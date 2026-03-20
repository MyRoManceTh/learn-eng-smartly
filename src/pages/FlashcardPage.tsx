import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, Volume2, RotateCcw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { allLessons } from "@/data/lessons";
import { SRSCard, createCard, reviewCard, getDueCards, loadCards, saveCards } from "@/data/flashcardSRS";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";

export default function FlashcardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  // Initialize cards from lesson vocab
  useEffect(() => {
    if (!user) return;
    let existing = loadCards(user.id);

    // Add vocab from lessons not yet in deck
    const existingIds = new Set(existing.map((c) => c.wordId));
    const newCards: SRSCard[] = [];

    for (const lesson of allLessons) {
      const vocab = lesson.vocabulary as Array<{ word: string; phonetic: string; meaning: string; partOfSpeech: string }>;
      if (!vocab) continue;
      for (const v of vocab) {
        const card = createCard(v.word, v.phonetic, v.meaning, v.partOfSpeech, lesson.module_id);
        if (!existingIds.has(card.wordId)) {
          newCards.push(card);
          existingIds.add(card.wordId);
        }
      }
    }

    if (newCards.length > 0) {
      existing = [...existing, ...newCards];
      saveCards(user.id, existing);
    }

    setCards(existing);
    setDueCards(getDueCards(existing));
  }, [user]);

  const currentCard = dueCards[currentIdx] || null;

  const handleAnswer = useCallback((know: boolean) => {
    if (!user || !currentCard || answered) return;
    setAnswered(true);

    const updated = reviewCard(currentCard, know);
    const newCards = cards.map((c) => (c.wordId === updated.wordId ? updated : c));
    setCards(newCards);
    saveCards(user.id, newCards);

    setReviewed((r) => r + 1);
    if (know) {
      setCorrect((c) => c + 1);
      playCorrect();
    } else {
      playWrong();
    }

    // Move to next after brief delay
    setTimeout(() => {
      if (currentIdx + 1 >= dueCards.length) {
        setDone(true);
        playComplete();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        setCurrentIdx((i) => i + 1);
        setFlipped(false);
        setAnswered(false);
      }
    }, 600);
  }, [user, currentCard, answered, cards, currentIdx, dueCards.length]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  // Done screen
  if (done) {
    const accuracy = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <span className="text-6xl">🎉</span>
          <h2 className="text-xl font-bold font-thai">ทบทวนครบแล้ว!</h2>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{reviewed}</p>
              <p className="text-xs text-muted-foreground font-thai">คำที่ทบทวน</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
              <p className="text-xs text-muted-foreground font-thai">ความแม่นยำ</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-thai">
            คำที่ตอบผิดจะกลับมาเร็วขึ้น คำที่จำได้จะห่างออกไป
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (dueCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <span className="text-6xl">✅</span>
          <h2 className="text-xl font-bold font-thai">ไม่มีคำต้องทบทวนวันนี้</h2>
          <p className="text-sm text-muted-foreground font-thai">
            คุณมีทั้งหมด {cards.length} คำในคลัง
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold font-thai flex items-center gap-1.5">
              <Brain className="w-4 h-4" /> ทบทวนคำศัพท์
            </h1>
            <span className="text-xs text-muted-foreground font-thai">
              {currentIdx + 1}/{dueCards.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIdx) / dueCards.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Card */}
      {currentCard && (
        <div className="max-w-md mx-auto px-4 py-8">
          <div
            className="relative h-[320px] cursor-pointer perspective-1000"
            onClick={() => !answered && setFlipped(!flipped)}
          >
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-500 preserve-3d",
                flipped && "rotate-y-180"
              )}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 flex flex-col items-center justify-center text-white shadow-xl backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-3xl font-bold font-reading mb-2">{currentCard.word}</p>
                <span className="text-sm text-white/60 px-3 py-1 rounded-full bg-white/10">
                  {currentCard.partOfSpeech}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(currentCard.word); }}
                  className="mt-6 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="mt-6 text-xs text-white/50 font-thai">แตะเพื่อดูคำตอบ</p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-3xl bg-white border-2 border-purple-200 p-8 flex flex-col items-center justify-center shadow-xl"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p className="text-2xl font-bold font-thai text-purple-700 mb-2">{currentCard.meaning}</p>
                <p className="text-lg text-muted-foreground">{currentCard.phonetic}</p>
                <span className="mt-2 text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
                  {currentCard.partOfSpeech}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(currentCard.word); }}
                  className="mt-4 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200"
                >
                  <Volume2 className="w-5 h-5 text-purple-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {flipped && !answered && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => handleAnswer(false)}
                className="flex-1 h-14 text-base bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white border-0 rounded-2xl"
              >
                😣 ไม่รู้
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                className="flex-1 h-14 text-base bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0 rounded-2xl"
              >
                😊 รู้แล้ว
              </Button>
            </div>
          )}

          {!flipped && !answered && (
            <p className="text-center text-sm text-muted-foreground font-thai mt-6">
              แตะการ์ดเพื่อดูความหมาย
            </p>
          )}
        </div>
      )}
    </div>
  );
}
