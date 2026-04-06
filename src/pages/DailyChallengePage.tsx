import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAllLessons } from "@/hooks/useAllLessons";
import { ChevronLeft, Clock, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { trackEvent } from "@/utils/analytics";

// ── Seeded random (same as missionTemplates) ────────────────────
function dateToSeed(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i++) {
    h = ((h << 5) - h + date.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface VocabItem {
  english: string;
  thai: string;
  options: string[];
}

function getToday(): string {
  const now = new Date();
  const thai = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return thai.toISOString().split("T")[0];
}

// ── Generate daily challenge ────────────────────────────────────
function generateChallenge(date: string, allLessons: { vocabulary: unknown }[]) {
  const seed = dateToSeed(date);
  const rand = seededRandom(seed);

  // Collect all vocab
  const allVocab: { english: string; thai: string }[] = [];
  for (const lesson of allLessons) {
    const vocab = lesson.vocabulary as Array<{ word: string; meaning: string }>;
    if (!vocab) continue;
    for (const v of vocab) {
      allVocab.push({ english: v.word, thai: v.meaning });
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique = allVocab.filter((v) => {
    if (seen.has(v.english)) return false;
    seen.add(v.english);
    return true;
  });

  const shuffled = seededShuffle(unique, rand);
  const questions = shuffled.slice(0, 20);

  // Generate 4 options per question
  const items: VocabItem[] = questions.map((q) => {
    const distractors = seededShuffle(
      unique.filter((v) => v.english !== q.english),
      rand
    ).slice(0, 3).map((v) => v.thai);

    const options = seededShuffle([q.thai, ...distractors], rand);
    return { english: q.english, thai: q.thai, options };
  });

  return { date, items, timeLimit: 60 };
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, addExp, addCoins } = useProfile();
  const { lessons: allLessons, loading: lessonsLoading } = useAllLessons();

  const today = useMemo(() => getToday(), []);
  const challenge = useMemo(() => generateChallenge(today, allLessons), [today, allLessons]);

  const [phase, setPhase] = useState<"lobby" | "playing" | "result">("lobby");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [todayScore, setTodayScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if already attempted
  useEffect(() => {
    if (!user) return;
    supabase
      .from("analytics_events")
      .select("event_data")
      .eq("user_id", user.id)
      .eq("event_type", "daily_challenge_complete")
      .gte("created_at", today + "T00:00:00")
      .limit(1)
      .then(({ data }) => {
        if (data && (data as any[]).length > 0) {
          setHasAttempted(true);
          setTodayScore((data as any[])[0].event_data?.score || 0);
          setPhase("result");
        }
      });
  }, [user, today]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("analytics_events")
      .select("user_id, event_data")
      .eq("event_type", "daily_challenge_complete")
      .gte("created_at", today + "T00:00:00")
      .order("created_at", { ascending: true });

    if (!data) return;

    const userIds = [...new Set((data as any[]).map((d: any) => d.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, evolution_stage")
      .in("user_id", userIds);

    const profileMap = new Map<string, any>();
    ((profiles as any[]) || []).forEach((p) => profileMap.set(p.user_id, p));

    const entries = (data as any[])
      .map((d: any) => ({
        user_id: d.user_id,
        display_name: profileMap.get(d.user_id)?.display_name || "ไม่ระบุ",
        evolution_stage: profileMap.get(d.user_id)?.evolution_stage || 1,
        score: d.event_data?.score || 0,
        time_used: d.event_data?.time_used || 0,
      }))
      .sort((a: any, b: any) => b.score - a.score || a.time_used - b.time_used)
      .map((e: any, i: number) => ({ ...e, rank: i + 1 }));

    setLeaderboard(entries);
  }, [today]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard, phase]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const finishGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("result");
    playComplete();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    const timeUsed = challenge.timeLimit - timeLeft;
    const finalScore = score;

    // Save result
    if (user) {
      trackEvent("daily_challenge_complete", {
        date: today,
        score: finalScore,
        time_used: timeUsed,
        total: challenge.items.length,
      });
      // Rewards: 1 coin per correct, 5 exp per correct
      if (finalScore > 0) {
        await addCoins(finalScore);
        await addExp(finalScore * 5);
      }
    }
    setTodayScore(finalScore);
    setHasAttempted(true);
  }, [score, timeLeft, user, today, challenge]);

  const handleSelect = (optIdx: number) => {
    if (showAnswer || phase !== "playing") return;
    setSelected(optIdx);
    setShowAnswer(true);

    const item = challenge.items[currentQ];
    const isCorrect = item.options[optIdx] === item.thai;

    if (isCorrect) {
      setScore((s) => s + 1);
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      if (currentQ + 1 >= challenge.items.length) {
        finishGame();
      } else {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setShowAnswer(false);
      }
    }, 500);
  };

  const myEntry = leaderboard.find((e) => e.user_id === user?.id);

  if (lessonsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // ── Lobby ─────────────────────────────────────
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white pb-24">
        <header className="sticky top-0 z-30 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-thai">⚔️ Daily Challenge</h1>
              <p className="text-xs text-amber-100 font-thai">{today}</p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white text-center shadow-xl">
            <span className="text-5xl">⚔️</span>
            <h2 className="text-xl font-bold mt-3 font-thai">Vocab Speed Challenge</h2>
            <p className="text-sm text-amber-100 mt-1 font-thai">
              ตอบคำศัพท์ {challenge.items.length} คำ ภายใน {challenge.timeLimit} วินาที
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {challenge.timeLimit} วินาที</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {challenge.items.length} คำ</span>
            </div>
          </div>

          <Button
            onClick={() => { setPhase("playing"); setTimeLeft(challenge.timeLimit); }}
            className="w-full h-14 text-lg font-bold font-thai bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl"
          >
            เริ่ม Challenge! ⚔️
          </Button>

          {/* Mini leaderboard */}
          {leaderboard.length > 0 && (
            <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm">
              <h3 className="text-sm font-bold font-thai mb-2">🏆 อันดับวันนี้</h3>
              {leaderboard.slice(0, 5).map((e, i) => (
                <div key={e.user_id} className="flex items-center gap-2 py-1.5">
                  <span className="w-6 text-center text-sm">{i < 3 ? MEDALS[i] : i + 1}</span>
                  <span className="flex-1 text-sm truncate font-thai">{e.display_name}</span>
                  <span className="text-sm font-bold">{e.score}/{challenge.items.length}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Playing ───────────────────────────────────
  if (phase === "playing") {
    const item = challenge.items[currentQ];
    const timerPct = (timeLeft / challenge.timeLimit) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Timer bar */}
        <div className="h-2 bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-1000 rounded-r-full",
              timerPct > 30 ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-red-500"
            )}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        <div className="max-w-md mx-auto px-4 py-3">
          {/* Stats row */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-thai">
              ข้อ {currentQ + 1}/{challenge.items.length}
            </span>
            <span className={cn(
              "text-sm font-bold",
              timerPct > 30 ? "text-amber-600" : "text-red-500 animate-pulse"
            )}>
              ⏱ {timeLeft}s
            </span>
            <span className="text-xs font-bold text-green-600">
              ✅ {score}
            </span>
          </div>

          {/* Question */}
          <div className="rounded-2xl bg-white border-2 border-amber-200 p-6 text-center mb-4 shadow-md">
            <p className="text-2xl font-bold font-reading">{item.english}</p>
            <p className="text-xs text-muted-foreground mt-1 font-thai">เลือกความหมายที่ถูกต้อง</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2">
            {item.options.map((opt, idx) => {
              const isCorrect = opt === item.thai;
              const isSelected = selected === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showAnswer}
                  className={cn(
                    "rounded-xl border-2 p-3 text-sm font-thai font-medium transition-all active:scale-95",
                    showAnswer && isCorrect && "bg-green-100 border-green-400 text-green-700",
                    showAnswer && isSelected && !isCorrect && "bg-red-100 border-red-400 text-red-700",
                    !showAnswer && "bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Result ────────────────────────────────────
  const displayScore = todayScore ?? score;
  const stars = displayScore >= 18 ? 3 : displayScore >= 12 ? 2 : displayScore >= 6 ? 1 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white pb-24">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold font-thai">⚔️ ผลลัพธ์ Daily Challenge</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Score card */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white text-center shadow-xl">
          <div className="text-3xl mb-2">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <p className="text-5xl font-bold">{displayScore}</p>
          <p className="text-sm text-amber-100 font-thai">จาก {challenge.items.length} คำ</p>
          {displayScore > 0 && (
            <p className="text-xs text-amber-200 mt-2 font-thai">
              +{displayScore} 🪙 +{displayScore * 5} XP
            </p>
          )}
        </div>

        {hasAttempted && !todayScore && (
          <p className="text-center text-sm text-muted-foreground font-thai">
            ทำได้ 1 ครั้งต่อวัน พรุ่งนี้มาลองใหม่นะ!
          </p>
        )}

        {/* Leaderboard */}
        <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm">
          <h3 className="text-sm font-bold font-thai mb-3 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> อันดับวันนี้
          </h3>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 font-thai">ยังไม่มีผู้เล่น</p>
          ) : (
            <div className="space-y-1.5">
              {leaderboard.slice(0, 20).map((e, i) => {
                const isMe = e.user_id === user?.id;
                return (
                  <div
                    key={e.user_id}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2",
                      isMe ? "bg-purple-50 ring-1 ring-purple-200" : ""
                    )}
                  >
                    <span className="w-6 text-center text-sm shrink-0">
                      {i < 3 ? MEDALS[i] : i + 1}
                    </span>
                    <span className="flex-1 text-sm truncate font-thai">
                      {e.display_name}
                      {isMe && <span className="ml-1 text-[10px] text-purple-500 font-bold">(คุณ)</span>}
                    </span>
                    <span className="text-sm font-bold">{e.score}/{challenge.items.length}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button onClick={() => navigate("/")} variant="outline" className="w-full font-thai">
          กลับหน้าหลัก
        </Button>
      </div>
    </div>
  );
}
