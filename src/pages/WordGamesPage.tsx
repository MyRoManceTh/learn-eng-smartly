import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { wordGameSets, WordGameSet, MatchPair } from "@/data/wordGameData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle, Trophy, RotateCcw, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { toast } from "sonner";

type GameMode = "matching" | "fillblank";

const WordGamesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addExp, addCoins } = useProfile();
  const [selectedSet, setSelectedSet] = useState<WordGameSet | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  // Matching game state
  const [cards, setCards] = useState<{ id: string; text: string; type: "en" | "th"; pairId: number; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [moves, setMoves] = useState(0);

  // Fill-blank game state
  const [fbIndex, setFbIndex] = useState(0);
  const [fbSelected, setFbSelected] = useState<string | null>(null);
  const [fbScore, setFbScore] = useState(0);
  const [fbShowResult, setFbShowResult] = useState(false);
  const [fbFinished, setFbFinished] = useState(false);

  const startMatching = (set: WordGameSet) => {
    setSelectedSet(set);
    setGameMode("matching");
    const pairs = set.matching.slice(0, 6); // Use 6 pairs
    setTotalPairs(pairs.length);
    setMatchedPairs(0);
    setMoves(0);
    setFlipped([]);
    const allCards = pairs.flatMap((p, i) => [
      { id: `en-${i}`, text: p.english, type: "en" as const, pairId: i, matched: false },
      { id: `th-${i}`, text: p.thai, type: "th" as const, pairId: i, matched: false },
    ]);
    // Shuffle
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    setCards(allCards);
  };

  const startFillBlank = (set: WordGameSet) => {
    setSelectedSet(set);
    setGameMode("fillblank");
    setFbIndex(0);
    setFbSelected(null);
    setFbScore(0);
    setFbShowResult(false);
    setFbFinished(false);
  };

  const handleCardClick = (idx: number) => {
    if (flipped.length >= 2 || cards[idx].matched || flipped.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].pairId === cards[b].pairId && cards[a].type !== cards[b].type) {
        playCorrect();
        const newCards = [...cards];
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards(newCards);
        setMatchedPairs(m => {
          const next = m + 1;
          if (next === totalPairs) {
            setTimeout(() => {
              playComplete();
              confetti({ particleCount: 150, spread: 100 });
            }, 300);
          }
          return next;
        });
        setTimeout(() => setFlipped([]), 300);
      } else {
        playWrong();
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const handleFbSelect = (option: string) => {
    if (fbShowResult || !selectedSet) return;
    setFbSelected(option);
    setFbShowResult(true);
    const q = selectedSet.fillBlanks[fbIndex];
    if (option === q.answer) {
      playCorrect();
      setFbScore(s => s + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } else {
      playWrong();
    }
  };

  const handleFbNext = () => {
    if (!selectedSet) return;
    if (fbIndex + 1 >= selectedSet.fillBlanks.length) {
      setFbFinished(true);
      playComplete();
      confetti({ particleCount: 120, spread: 80 });
    } else {
      setFbIndex(i => i + 1);
      setFbSelected(null);
      setFbShowResult(false);
    }
  };

  const handleFinishGame = async () => {
    if (user) {
      let exp = 0;
      let coins = 0;
      if (gameMode === "matching") {
        exp = 15 + Math.max(0, totalPairs * 3 - moves);
        coins = 10;
      } else {
        exp = fbScore * 10 + 5;
        coins = fbScore * 5;
      }
      await addExp(exp);
      await addCoins(coins);
      toast.success(`+${exp} EXP, +${coins} เหรียญ!`);
    }
    setSelectedSet(null);
    setGameMode(null);
  };

  // === Matching Game View ===
  if (selectedSet && gameMode === "matching") {
    const isDone = matchedPairs === totalPairs;
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedSet(null); setGameMode(null); }}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="font-bold font-thai">🎯 จับคู่คำศัพท์</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-thai text-muted-foreground">ครั้งที่ {moves}</span>
              <span className="font-bold text-purple-600">{matchedPairs}/{totalPairs}</span>
            </div>
          </div>
        </header>
        <main className="px-4 py-5 max-w-md mx-auto">
          {isDone ? (
            <div className="text-center space-y-4 py-8 animate-in fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold font-thai">จับคู่สำเร็จ! 🎉</h2>
              <p className="text-muted-foreground font-thai">ใช้ {moves} ครั้ง จับคู่ {totalPairs} คู่</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => startMatching(selectedSet)} variant="outline" className="font-thai">
                  <RotateCcw className="w-4 h-4 mr-1" /> เล่นใหม่
                </Button>
                <Button onClick={handleFinishGame} className="font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                  รับรางวัล
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx);
                const isMatched = card.matched;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    disabled={isMatched}
                    className={cn(
                      "aspect-[3/2] rounded-xl border-2 flex items-center justify-center text-center p-2 transition-all duration-200 text-sm font-bold",
                      isMatched && "border-green-300 bg-green-50 opacity-60 scale-95",
                      isFlipped && !isMatched && (card.type === "en" ? "border-purple-400 bg-purple-50" : "border-pink-400 bg-pink-50"),
                      !isFlipped && !isMatched && "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md active:scale-95 cursor-pointer",
                    )}
                  >
                    {isFlipped || isMatched ? (
                      <span className={cn("font-thai", card.type === "en" ? "font-reading text-purple-700" : "text-pink-700")}>
                        {card.text}
                      </span>
                    ) : (
                      <span className="text-2xl">❓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  // === Fill Blank Game View ===
  if (selectedSet && gameMode === "fillblank") {
    const questions = selectedSet.fillBlanks;
    const q = questions[fbIndex];

    if (fbFinished) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-white/50 bg-white/90 backdrop-blur-xl p-8 space-y-4 shadow-2xl">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="text-xl font-bold font-thai">เก่งมาก! 🎉</h2>
              <p className="text-3xl font-bold text-purple-600">{fbScore}/{questions.length}</p>
              <p className="text-muted-foreground font-thai text-sm">
                {fbScore === questions.length ? "สุดยอด! ตอบถูกทุกข้อ" : fbScore >= questions.length / 2 ? "ดีมาก!" : "ลองอีกครั้งนะ"}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => startFillBlank(selectedSet)} variant="outline" className="font-thai">
                <RotateCcw className="w-4 h-4 mr-1" /> เล่นใหม่
              </Button>
              <Button onClick={handleFinishGame} className="font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                รับรางวัล
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedSet(null); setGameMode(null); }}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="font-bold font-thai">✏️ เติมคำ</span>
            </div>
            <span className="text-sm text-muted-foreground font-thai">ข้อ {fbIndex + 1}/{questions.length}</span>
          </div>
          <div className="px-4 pb-2">
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${((fbIndex + (fbShowResult ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 max-w-md mx-auto">
          <div className="rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-sm p-6 shadow-xl">
            <p className="text-lg font-reading mb-2 leading-relaxed">
              {q.sentence.split("___").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className={cn(
                      "inline-block min-w-[80px] border-b-2 mx-1 text-center font-bold",
                      fbShowResult
                        ? fbSelected === q.answer ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
                        : "border-purple-300"
                    )}>
                      {fbSelected || "______"}
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-xs text-muted-foreground font-thai mb-6">{q.translation}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleFbSelect(opt)}
                  disabled={fbShowResult}
                  className={cn(
                    "rounded-xl border-2 py-3 px-4 font-reading font-bold text-sm transition-all active:scale-95",
                    fbShowResult && opt === q.answer && "border-green-400 bg-green-50 text-green-700",
                    fbShowResult && fbSelected === opt && opt !== q.answer && "border-red-400 bg-red-50 text-red-700",
                    !fbShowResult && "border-gray-200 bg-white hover:border-purple-300",
                    fbShowResult && opt !== q.answer && fbSelected !== opt && "opacity-40",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            {fbShowResult && (
              <Button onClick={handleFbNext} className="w-full font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                {fbIndex + 1 >= questions.length ? "ดูผลคะแนน" : "ข้อถัดไป →"}
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // === Game Set Selection ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold font-thai">🎮 เกมคำศัพท์</h1>
          <p className="text-xs text-muted-foreground font-thai mt-0.5">เลือกหมวดแล้วเริ่มเล่นเลย!</p>
        </div>
      </header>
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Game Mode Selector */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white shadow-lg">
            <span className="text-2xl">🎯</span>
            <h3 className="font-bold font-thai text-sm mt-1">จับคู่คำ</h3>
            <p className="text-[10px] text-purple-200 font-thai">Matching Game</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-4 text-white shadow-lg">
            <span className="text-2xl">✏️</span>
            <h3 className="font-bold font-thai text-sm mt-1">เติมคำ</h3>
            <p className="text-[10px] text-pink-200 font-thai">Fill in the Blank</p>
          </div>
        </div>

        {/* Game Sets */}
        <h3 className="text-sm font-bold font-thai text-foreground">🎲 เลือกหมวดคำศัพท์</h3>
        {wordGameSets.map((set) => (
          <div key={set.id} className="rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold font-thai text-foreground">{set.categoryThai}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{set.category}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star key={s} className={cn("w-3 h-3", s <= set.level ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => startMatching(set)} variant="outline" className="flex-1 font-thai text-sm h-10">
                🎯 จับคู่คำ
              </Button>
              <Button onClick={() => startFillBlank(set)} variant="outline" className="flex-1 font-thai text-sm h-10">
                ✏️ เติมคำ
              </Button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default WordGamesPage;
