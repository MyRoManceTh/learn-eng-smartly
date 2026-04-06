import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFriends } from "@/hooks/useFriends";
import { supabase } from "@/integrations/supabase/client";
import { evolutionStages } from "@/data/evolutionStages";
import { ChevronLeft, Trophy, Flame, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyScore {
  user_id: string;
  display_name: string;
  evolution_stage: number;
  lessons_today: number;
  exp_today: number;
  current_streak: number;
  rank: number;
  isMe: boolean;
}

type TimeFilter = "today" | "week" | "month";

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = [
  "from-yellow-400/20 to-amber-500/20 ring-yellow-400/40",
  "from-gray-300/20 to-slate-400/20 ring-gray-400/40",
  "from-orange-400/20 to-amber-600/20 ring-orange-400/40",
];

export default function FriendLeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { friends } = useFriends();
  const [scores, setScores] = useState<DailyScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");

  const getEvolutionIcon = (stage: number) => {
    const evo = evolutionStages.find((s) => s.stage === stage);
    return evo?.icon || "🥚";
  };

  // Get date range based on filter
  const getDateRange = useCallback((filter: TimeFilter) => {
    const now = new Date();
    const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    if (filter === "today") {
      const start = thaiNow.toISOString().split("T")[0] + "T00:00:00+07:00";
      return start;
    } else if (filter === "week") {
      const day = thaiNow.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday = start
      const monday = new Date(thaiNow);
      monday.setDate(thaiNow.getDate() - diff);
      return monday.toISOString().split("T")[0] + "T00:00:00+07:00";
    } else {
      // month
      const firstDay = new Date(thaiNow.getFullYear(), thaiNow.getMonth(), 1);
      return firstDay.toISOString().split("T")[0] + "T00:00:00+07:00";
    }
  }, []);

  const loadScores = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const startDate = getDateRange(timeFilter);

    // Get all user IDs to track (me + friends)
    const allUserIds = [user.id, ...friends.map((f) => f.user_id)];

    // Fetch lesson completions in date range
    const { data: lessonProgress } = await supabase
      .from("user_lesson_progress")
      .select("user_id, quiz_score, completed_at")
      .in("user_id", allUserIds)
      .gte("completed_at", startDate);

    // Aggregate per user
    const userScoreMap = new Map<string, { lessons: number; exp: number }>();
    allUserIds.forEach((id) => userScoreMap.set(id, { lessons: 0, exp: 0 }));

    ((lessonProgress as any[]) || []).forEach((p) => {
      const current = userScoreMap.get(p.user_id) || { lessons: 0, exp: 0 };
      current.lessons += 1;
      current.exp += (p.quiz_score || 0) * 10 + 5; // score*10 + 5 per lesson
      userScoreMap.set(p.user_id, current);
    });

    // Fetch daily mission completions in date range
    const { data: missions } = await supabase
      .from("daily_missions")
      .select("user_id, reward_claimed, completed")
      .in("user_id", allUserIds)
      .gte("created_at", startDate)
      .eq("completed", true);

    ((missions as any[]) || []).forEach((m) => {
      const current = userScoreMap.get(m.user_id) || { lessons: 0, exp: 0 };
      current.exp += 20; // 20 XP per completed mission
      userScoreMap.set(m.user_id, current);
    });

    // Build profile map (me + friends)
    const myProfile = await supabase
      .from("profiles")
      .select("user_id, display_name, evolution_stage, current_streak")
      .eq("user_id", user.id)
      .single();

    const profileMap = new Map<string, any>();
    if (myProfile.data) {
      profileMap.set(user.id, myProfile.data);
    }
    friends.forEach((f) => {
      profileMap.set(f.user_id, {
        user_id: f.user_id,
        display_name: f.display_name,
        evolution_stage: f.evolution_stage,
        current_streak: f.current_streak,
      });
    });

    // Build scores array and sort
    const allScores: DailyScore[] = allUserIds
      .map((uid) => {
        const profile = profileMap.get(uid);
        const score = userScoreMap.get(uid) || { lessons: 0, exp: 0 };
        return {
          user_id: uid,
          display_name: profile?.display_name || "ไม่ระบุชื่อ",
          evolution_stage: profile?.evolution_stage || 1,
          lessons_today: score.lessons,
          exp_today: score.exp,
          current_streak: profile?.current_streak || 0,
          rank: 0,
          isMe: uid === user.id,
        };
      })
      .sort((a, b) => b.exp_today - a.exp_today || b.lessons_today - a.lessons_today);

    // Assign ranks
    allScores.forEach((s, i) => (s.rank = i + 1));

    setScores(allScores);
    setLoading(false);
  }, [user, friends, timeFilter, getDateRange]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  const filterLabels: Record<TimeFilter, string> = {
    today: "วันนี้",
    week: "สัปดาห์นี้",
    month: "เดือนนี้",
  };

  const myScore = scores.find((s) => s.isMe);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/50 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold font-thai flex items-center gap-2">
                <Trophy className="w-5 h-5" /> อันดับเพื่อน
              </h1>
              <p className="text-xs text-amber-100 font-thai">
                ใครเรียนเก่งสุดวันนี้?
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Time filter */}
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-white/50">
          {(["today", "week", "month"] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={cn(
                "flex-1 rounded-xl py-2 text-xs font-bold font-thai transition-all",
                timeFilter === f
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* My rank card */}
        {myScore && !loading && (
          <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                {myScore.rank <= 3 ? MEDALS[myScore.rank - 1] : `#${myScore.rank}`}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/70 font-thai">อันดับของฉัน</p>
                <p className="font-bold font-thai">
                  {getEvolutionIcon(myScore.evolution_stage)} {myScore.display_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{myScore.exp_today}</p>
                <p className="text-xs text-white/70">XP</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20 text-xs">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> {myScore.lessons_today} บท
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {myScore.current_streak} วัน streak
              </span>
            </div>
          </div>
        )}

        {/* Leaderboard list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : scores.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">🤝</p>
            <p className="text-sm text-muted-foreground font-thai">
              ยังไม่มีเพื่อน เพิ่มเพื่อนก่อนนะ!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 podium */}
            {scores.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4">
                {/* 2nd place */}
                <div className="flex flex-col items-center w-24">
                  <span className="text-2xl mb-1">{getEvolutionIcon(scores[1].evolution_stage)}</span>
                  <div className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-xl w-full h-16 flex items-center justify-center">
                    <span className="text-xl">🥈</span>
                  </div>
                  <p className="text-[10px] font-bold font-thai truncate w-full text-center mt-1">
                    {scores[1].display_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{scores[1].exp_today} XP</p>
                </div>
                {/* 1st place */}
                <div className="flex flex-col items-center w-28">
                  <span className="text-3xl mb-1">{getEvolutionIcon(scores[0].evolution_stage)}</span>
                  <div className="bg-gradient-to-b from-yellow-400 to-amber-500 rounded-t-xl w-full h-24 flex items-center justify-center">
                    <span className="text-2xl">🥇</span>
                  </div>
                  <p className="text-xs font-bold font-thai truncate w-full text-center mt-1">
                    {scores[0].display_name}
                  </p>
                  <p className="text-xs text-amber-600 font-bold">{scores[0].exp_today} XP</p>
                </div>
                {/* 3rd place */}
                <div className="flex flex-col items-center w-24">
                  <span className="text-2xl mb-1">{getEvolutionIcon(scores[2].evolution_stage)}</span>
                  <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-xl w-full h-12 flex items-center justify-center">
                    <span className="text-xl">🥉</span>
                  </div>
                  <p className="text-[10px] font-bold font-thai truncate w-full text-center mt-1">
                    {scores[2].display_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{scores[2].exp_today} XP</p>
                </div>
              </div>
            )}

            {/* Rest of the list */}
            {scores.map((score) => (
              <div
                key={score.user_id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-3 transition-all",
                  score.isMe
                    ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 ring-1 ring-purple-300/50 shadow-sm"
                    : score.rank <= 3
                    ? `bg-gradient-to-r ${MEDAL_COLORS[score.rank - 1]} ring-1`
                    : "bg-white/80 border border-white/50"
                )}
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {score.rank <= 3 ? (
                    <span className="text-xl">{MEDALS[score.rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{score.rank}</span>
                  )}
                </div>

                {/* Avatar + info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span>{getEvolutionIcon(score.evolution_stage)}</span>
                    <span className="text-sm font-semibold truncate font-thai">
                      {score.display_name}
                    </span>
                    {score.isMe && (
                      <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        คุณ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <BookOpen className="w-3 h-3" /> {score.lessons_today} บท
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {score.current_streak} วัน
                    </span>
                  </div>
                </div>

                {/* XP score */}
                <div className="text-right shrink-0">
                  <p className={cn(
                    "font-bold",
                    score.rank === 1 ? "text-amber-600 text-lg" :
                    score.rank <= 3 ? "text-amber-600" : "text-foreground"
                  )}>
                    {score.exp_today}
                  </p>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
              </div>
            ))}

            {/* Motivational footer */}
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground font-thai">
                {myScore && myScore.rank === 1
                  ? "🎉 เก่งมาก! เธออันดับ 1 เลย!"
                  : myScore && myScore.exp_today === 0
                  ? "💪 เริ่มเรียนเลย จะได้ขึ้นอันดับ!"
                  : "📚 เรียนเพิ่มอีกนิดเพื่อขึ้นอันดับ!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
