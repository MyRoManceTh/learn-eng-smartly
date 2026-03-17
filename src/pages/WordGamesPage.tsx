import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { wordGameSets, WordGameSet, MatchPair } from "@/data/wordGameData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle, Trophy, RotateCcw, Star, Zap, Check, X, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { toast } from "sonner";

type GameMode = "matching" | "fillblank" | "speedmatch";

interface SpeedMatchRound {
  english: string;
  thai: string;
  isCorrect: boolean;
}

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

  // Speed match game state
  const [smRounds, setSmRounds] = useState<SpeedMatchRound[]>([]);
  const [smIndex, setSmIndex] = useState(0);
  const [smScore, setSmScore] = useState(0);
  const [smStreak, setSmStreak] = useState(0);
  const [smBestStreak, setSmBestStreak] = useState(0);
  const [smFinished, setSmFinished] = useState(false);
  const [smTimeLeft, setSmTimeLeft] = useState(30);
  const [smStarted, setSmStarted] = useState(false);
  const [smFeedback, setSmFeedback] = useState<"correct" | "wrong" | null>(null);
  const [smSwipeDir, setSmSwipeDir] = useState<"left" | "right" | null>(null);
  const smTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const smTotalRounds = useRef(0);

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

  const startSpeedMatch = (set: WordGameSet) => {
    setSelectedSet(set);
    setGameMode("speedmatch");
    // Generate rounds: mix of correct and incorrect pairs
    const pairs = set.matching;
    const rounds: SpeedMatchRound[] = [];
    // Create ~20 rounds with ~50% correct
    for (let i = 0; i < 20; i++) {
      const isCorrect = Math.random() > 0.5;
      const pairIdx = Math.floor(Math.random() * pairs.length);
      if (isCorrect) {
        rounds.push({ english: pairs[pairIdx].english, thai: pairs[pairIdx].thai, isCorrect: true });
      } else {
        // Pick a different thai word
        let wrongIdx = pairIdx;
        while (wrongIdx === pairIdx) wrongIdx = Math.floor(Math.random() * pairs.length);
        rounds.push({ english: pairs[pairIdx].english, thai: pairs[wrongIdx].thai, isCorrect: false });
      }
    }
    setSmRounds(rounds);
    setSmIndex(0);
    setSmScore(0);
    setSmStreak(0);
    setSmBestStreak(0);
    setSmFinished(false);
    setSmTimeLeft(30);
    setSmStarted(false);
    setSmFeedback(null);
    setSmSwipeDir(null);
    smTotalRounds.current = 0;
    if (smTimerRef.current) clearInterval(smTimerRef.current);
  };

  // Speed match timer
  useEffect(() => {
    if (gameMode !== "speedmatch" || !smStarted || smFinished) return;
    smTimerRef.current = setInterval(() => {
      setSmTimeLeft(t => {
        if (t <= 1) {
          clearInterval(smTimerRef.current!);
          setSmFinished(true);
          playComplete();
          confetti({ particleCount: 100, spread: 80 });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (smTimerRef.current) clearInterval(smTimerRef.current); };
  }, [gameMode, smStarted, smFinished]);

  const handleSpeedAnswer = (answeredMatch: boolean) => {
    if (smFinished || smIndex >= smRounds.length) return;
    if (!smStarted) setSmStarted(true);
    const round = smRounds[smIndex];
    const correct = answeredMatch === round.isCorrect;
    smTotalRounds.current += 1;
    setSmSwipeDir(answeredMatch ? "right" : "left");
    if (correct) {
      playCorrect();
      setSmFeedback("correct");
      setSmScore(s => s + 1 + smStreak); // Bonus for streak
      setSmStreak(s => {
        const next = s + 1;
        setSmBestStreak(b => Math.max(b, next));
        return next;
      });
      if (smStreak > 0 && smStreak % 3 === 2) {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
      }
    } else {
      playWrong();
      setSmFeedback("wrong");
      setSmStreak(0);
    }
    setTimeout(() => {
      setSmFeedback(null);
      setSmSwipeDir(null);
      if (smIndex + 1 >= smRounds.length) {
        // Generate more rounds on the fly
        if (selectedSet) {
          const pairs = selectedSet.matching;
          const moreRounds: SpeedMatchRound[] = [];
          for (let i = 0; i < 20; i++) {
            const isCorrect = Math.random() > 0.5;
            const pairIdx = Math.floor(Math.random() * pairs.length);
            if (isCorrect) {
              moreRounds.push({ english: pairs[pairIdx].english, thai: pairs[pairIdx].thai, isCorrect: true });
            } else {
              let wrongIdx = pairIdx;
              while (wrongIdx === pairIdx) wrongIdx = Math.floor(Math.random() * pairs.length);
              moreRounds.push({ english: pairs[pairIdx].english, thai: pairs[wrongIdx].thai, isCorrect: false });
            }
          }
          setSmRounds(moreRounds);
          setSmIndex(0);
        }
      } else {
        setSmIndex(i => i + 1);
      }
    }, 350);
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
      } else if (gameMode === "fillblank") {
        exp = fbScore * 10 + 5;
        coins = fbScore * 5;
      } else if (gameMode === "speedmatch") {
        exp = smScore * 3 + smBestStreak * 5;
        coins = Math.floor(smScore * 2);
      }
      await addExp(exp);
      await addCoins(coins);
      toast.success(`+${exp} EXP, +${coins} เหรียญ!`);
    }
    if (smTimerRef.current) clearInterval(smTimerRef.current);
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

  // === Speed Match Game View ===
  if (selectedSet && gameMode === "speedmatch") {
    const round = smRounds[smIndex];

    if (smFinished) {
      const accuracy = smTotalRounds.current > 0 ? Math.round((smScore / smTotalRounds.current) * 100) : 0;
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-white/50 bg-white/90 backdrop-blur-xl p-8 space-y-5 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold font-thai">หมดเวลา! ⚡</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-gradient-to-b from-purple-50 to-purple-100 p-3">
                  <p className="text-2xl font-bold text-purple-600">{smScore}</p>
                  <p className="text-[10px] text-muted-foreground font-thai">คะแนน</p>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-orange-50 to-orange-100 p-3">
                  <p className="text-2xl font-bold text-orange-600">{smBestStreak}</p>
                  <p className="text-[10px] text-muted-foreground font-thai">คอมโบสูงสุด</p>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-green-50 to-green-100 p-3">
                  <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                  <p className="text-[10px] text-muted-foreground font-thai">ความแม่นยำ</p>
                </div>
              </div>
              <p className="text-muted-foreground font-thai text-sm">
                ตอบทั้งหมด {smTotalRounds.current} คำ ถูก {smScore} คำ
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => startSpeedMatch(selectedSet)} variant="outline" className="font-thai">
                <RotateCcw className="w-4 h-4 mr-1" /> เล่นใหม่
              </Button>
              <Button onClick={handleFinishGame} className="font-thai bg-gradient-to-r from-orange-500 to-red-500 text-white">
                รับรางวัล
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { if (smTimerRef.current) clearInterval(smTimerRef.current); setSelectedSet(null); setGameMode(null); }}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="font-bold font-thai">⚡ เร็วแค่ไหน</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {smStreak >= 2 && (
                <span className="font-bold text-orange-500 animate-pulse">
                  🔥 x{smStreak}
                </span>
              )}
              <span className="font-bold text-purple-600">{smScore} แต้ม</span>
            </div>
          </div>
          {/* Timer bar */}
          <div className="px-4 pb-2">
            <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-linear",
                  smTimeLeft > 10 ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                  smTimeLeft > 5 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                  "bg-gradient-to-r from-red-400 to-red-600"
                )}
                style={{ width: `${(smTimeLeft / 30) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground font-thai flex items-center gap-1">
                <Timer className="w-3 h-3" /> {smTimeLeft}s
              </span>
              <span className="text-[10px] text-muted-foreground font-thai">
                ตอบแล้ว {smTotalRounds.current} คำ
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 max-w-md mx-auto flex flex-col items-center">
          {!smStarted ? (
            <div className="text-center space-y-6 py-12 animate-in fade-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto shadow-xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-thai">พร้อมยัง?</h2>
                <p className="text-sm text-muted-foreground font-thai mt-2">
                  คำอังกฤษกับคำไทยจะโผล่มา<br/>
                  กด <span className="text-green-600 font-bold">✅ ตรงกัน</span> หรือ <span className="text-red-600 font-bold">❌ ไม่ตรง</span><br/>
                  มี 30 วินาที ตอบให้เร็วที่สุด!
                </p>
              </div>
              <Button
                onClick={() => setSmStarted(true)}
                className="font-thai text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                เริ่มเลย! ⚡
              </Button>
            </div>
          ) : round ? (
            <div className="w-full space-y-6 pt-4">
              {/* Word Card */}
              <div
                className={cn(
                  "relative rounded-3xl border-2 bg-white/90 backdrop-blur-sm p-8 shadow-xl transition-all duration-300",
                  smFeedback === "correct" && "border-green-400 bg-green-50/90",
                  smFeedback === "wrong" && "border-red-400 bg-red-50/90 animate-shake",
                  !smFeedback && "border-white/60",
                  smSwipeDir === "right" && "translate-x-8 rotate-3 opacity-80",
                  smSwipeDir === "left" && "-translate-x-8 -rotate-3 opacity-80",
                )}
              >
                {smFeedback && (
                  <div className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
                    smFeedback === "correct" ? "bg-green-500" : "bg-red-500"
                  )}>
                    {smFeedback === "correct" ? <Check className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
                  </div>
                )}
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-thai mb-1">English</p>
                    <p className="text-3xl font-bold font-reading text-purple-700">{round.english}</p>
                  </div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto" />
                  <div>
                    <p className="text-xs text-muted-foreground font-thai mb-1">ไทย</p>
                    <p className="text-3xl font-bold font-thai text-pink-600">{round.thai}</p>
                  </div>
                </div>
              </div>

              {/* Hint text */}
              <p className="text-center text-xs text-muted-foreground font-thai">
                คำสองคำนี้ตรงกันไหม?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleSpeedAnswer(false)}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                >
                  <X className="w-10 h-10" />
                </button>
                <button
                  onClick={() => handleSpeedAnswer(true)}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                >
                  <Check className="w-10 h-10" />
                </button>
              </div>

              {/* Labels */}
              <div className="flex justify-center gap-16 text-xs font-thai text-muted-foreground">
                <span>ไม่ตรง</span>
                <span>ตรงกัน!</span>
              </div>
            </div>
          ) : null}
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
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-3 text-white shadow-lg">
            <span className="text-2xl">🎯</span>
            <h3 className="font-bold font-thai text-xs mt-1">จับคู่คำ</h3>
            <p className="text-[10px] text-purple-200 font-thai">Matching</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-3 text-white shadow-lg">
            <span className="text-2xl">✏️</span>
            <h3 className="font-bold font-thai text-xs mt-1">เติมคำ</h3>
            <p className="text-[10px] text-pink-200 font-thai">Fill Blank</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-3 text-white shadow-lg">
            <span className="text-2xl">⚡</span>
            <h3 className="font-bold font-thai text-xs mt-1">เร็วแค่ไหน</h3>
            <p className="text-[10px] text-orange-200 font-thai">Speed Match</p>
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
              <Button onClick={() => startMatching(set)} variant="outline" className="flex-1 font-thai text-xs h-10 px-2">
                🎯 จับคู่คำ
              </Button>
              <Button onClick={() => startFillBlank(set)} variant="outline" className="flex-1 font-thai text-xs h-10 px-2">
                ✏️ เติมคำ
              </Button>
              <Button onClick={() => startSpeedMatch(set)} variant="outline" className="flex-1 font-thai text-xs h-10 px-2">
                ⚡ เร็วแค่ไหน
              </Button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default WordGamesPage;
