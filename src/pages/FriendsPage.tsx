import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFriends } from "@/hooks/useFriends";
import { supabase } from "@/integrations/supabase/client";
import { evolutionStages } from "@/data/evolutionStages";
import { cn } from "@/lib/utils";
import { Trophy, Users, BookOpen, Flame } from "lucide-react";
import FriendsList from "@/components/social/FriendsList";

type TimeFilter = "today" | "week" | "month";

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

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = [
  "from-yellow-400/20 to-amber-500/20 ring-yellow-400/40",
  "from-gray-300/20 to-slate-400/20 ring-gray-400/40",
  "from-orange-400/20 to-amber-600/20 ring-orange-400/40",
];

const filterLabels: Record<TimeFilter, string> = {
  today: "วันนี้",
  week: "สัปดาห์นี้",
  month: "เดือนนี้",
};

function getEvolutionIcon(stage: number) {
  return evolutionStages.find((s) => s.stage === stage)?.icon ?? "🥚";
}

function LeaderboardTab() {
  const { user } = useAuth();
  const { friends } = useFriends();
  const [scores, setScores] = useState<DailyScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");

  const getDateRange = useCallback((filter: TimeFilter) => {
    const now = new Date();
    const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    if (filter === "today") {
      return thaiNow.toISOString().split("T")[0] + "T00:00:00+07:00";
    } else if (filter === "week") {
      const diff = thaiNow.getDay() === 0 ? 6 : thaiNow.getDay() - 1;
      const monday = new Date(thaiNow);
      monday.setDate(thaiNow.getDate() - diff);
      return monday.toISOString().split("T")[0] + "T00:00:00+07:00";
    } else {
      return new Date(thaiNow.getFullYear(), thaiNow.getMonth(), 1)
        .toISOString().split("T")[0] + "T00:00:00+07:00";
    }
  }, []);

  const loadScores = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const startDate = getDateRange(timeFilter);
    const allUserIds = [user.id, ...friends.map((f) => f.user_id)];

    const { data: lessonProgress } = await supabase
      .from("user_lesson_progress")
      .select("user_id, quiz_score, completed_at")
      .in("user_id", allUserIds)
      .gte("completed_at", startDate);

    const userScoreMap = new Map<string, { lessons: number; exp: number }>();
    allUserIds.forEach((id) => userScoreMap.set(id, { lessons: 0, exp: 0 }));
    ((lessonProgress as any[]) || []).forEach((p) => {
      const cur = userScoreMap.get(p.user_id) ?? { lessons: 0, exp: 0 };
      cur.lessons += 1;
      cur.exp += (p.quiz_score || 0) * 10 + 5;
      userScoreMap.set(p.user_id, cur);
    });

    const { data: missions } = await supabase
      .from("daily_missions")
      .select("user_id")
      .in("user_id", allUserIds)
      .gte("created_at", startDate)
      .eq("completed", true);

    ((missions as any[]) || []).forEach((m) => {
      const cur = userScoreMap.get(m.user_id) ?? { lessons: 0, exp: 0 };
      cur.exp += 20;
      userScoreMap.set(m.user_id, cur);
    });

    const { data: myData } = await supabase
      .from("profiles")
      .select("user_id, display_name, evolution_stage, current_streak")
      .eq("user_id", user.id)
      .single();

    const profileMap = new Map<string, any>();
    if (myData) profileMap.set(user.id, myData);
    friends.forEach((f) =>
      profileMap.set(f.user_id, {
        user_id: f.user_id,
        display_name: f.display_name,
        evolution_stage: f.evolution_stage,
        current_streak: f.current_streak,
      })
    );

    const allScores: DailyScore[] = allUserIds
      .map((uid) => {
        const p = profileMap.get(uid);
        const s = userScoreMap.get(uid) ?? { lessons: 0, exp: 0 };
        return {
          user_id: uid,
          display_name: p?.display_name || "ไม่ระบุชื่อ",
          evolution_stage: p?.evolution_stage || 1,
          lessons_today: s.lessons,
          exp_today: s.exp,
          current_streak: p?.current_streak || 0,
          rank: 0,
          isMe: uid === user.id,
        };
      })
      .sort((a, b) => b.exp_today - a.exp_today || b.lessons_today - a.lessons_today);

    allScores.forEach((s, i) => (s.rank = i + 1));
    setScores(allScores);
    setLoading(false);
  }, [user, friends, timeFilter, getDateRange]);

  useEffect(() => { loadScores(); }, [loadScores]);

  const myScore = scores.find((s) => s.isMe);

  return (
    <div className="space-y-4">
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
              <div className="flex flex-col items-center w-24">
                <span className="text-2xl mb-1">{getEvolutionIcon(scores[1].evolution_stage)}</span>
                <div className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-xl w-full h-16 flex items-center justify-center">
                  <span className="text-xl">🥈</span>
                </div>
                <p className="text-[10px] font-bold font-thai truncate w-full text-center mt-1">{scores[1].display_name}</p>
                <p className="text-[10px] text-muted-foreground">{scores[1].exp_today} XP</p>
              </div>
              <div className="flex flex-col items-center w-28">
                <span className="text-3xl mb-1">{getEvolutionIcon(scores[0].evolution_stage)}</span>
                <div className="bg-gradient-to-b from-yellow-400 to-amber-500 rounded-t-xl w-full h-24 flex items-center justify-center">
                  <span className="text-2xl">🥇</span>
                </div>
                <p className="text-xs font-bold font-thai truncate w-full text-center mt-1">{scores[0].display_name}</p>
                <p className="text-xs text-amber-600 font-bold">{scores[0].exp_today} XP</p>
              </div>
              <div className="flex flex-col items-center w-24">
                <span className="text-2xl mb-1">{getEvolutionIcon(scores[2].evolution_stage)}</span>
                <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-xl w-full h-12 flex items-center justify-center">
                  <span className="text-xl">🥉</span>
                </div>
                <p className="text-[10px] font-bold font-thai truncate w-full text-center mt-1">{scores[2].display_name}</p>
                <p className="text-[10px] text-muted-foreground">{scores[2].exp_today} XP</p>
              </div>
            </div>
          )}

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
              <div className="w-8 text-center shrink-0">
                {score.rank <= 3 ? (
                  <span className="text-xl">{MEDALS[score.rank - 1]}</span>
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">{score.rank}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span>{getEvolutionIcon(score.evolution_stage)}</span>
                  <span className="text-sm font-semibold truncate font-thai">{score.display_name}</span>
                  {score.isMe && (
                    <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">คุณ</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-0.5"><BookOpen className="w-3 h-3" /> {score.lessons_today} บท</span>
                  <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" /> {score.current_streak} วัน</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={cn("font-bold", score.rank === 1 ? "text-amber-600 text-lg" : score.rank <= 3 ? "text-amber-600" : "text-foreground")}>
                  {score.exp_today}
                </p>
                <p className="text-[10px] text-muted-foreground">XP</p>
              </div>
            </div>
          ))}

          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground font-thai">
              {myScore?.rank === 1
                ? "🎉 เก่งมาก! เธออันดับ 1 เลย!"
                : myScore?.exp_today === 0
                ? "💪 เริ่มเรียนเลย จะได้ขึ้นอันดับ!"
                : "📚 เรียนเพิ่มอีกนิดเพื่อขึ้นอันดับ!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type Tab = "friends" | "ranking";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const { notificationCount } = useFriends();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-purple-200 to-pink-100 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold font-thai">👥 เพื่อน</h1>
          <p className="text-xs text-purple-100 font-thai">เพิ่มเพื่อน เติมไฟ และแข่งคะแนน</p>
        </div>

        {/* Tabs */}
        <div className="max-w-md mx-auto px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab("friends")}
            className={cn(
              "flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-sm font-bold font-thai transition-all",
              activeTab === "friends"
                ? "bg-white text-purple-600 shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/20"
            )}
          >
            <Users className="w-4 h-4" />
            เพื่อน
            {notificationCount > 0 && (
              <span className="w-4 h-4 bg-pink-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={cn(
              "flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-sm font-bold font-thai transition-all",
              activeTab === "ranking"
                ? "bg-white text-amber-600 shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/20"
            )}
          >
            <Trophy className="w-4 h-4" />
            อันดับ
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4">
        {activeTab === "friends" ? <FriendsList /> : <LeaderboardTab />}
      </div>
    </div>
  );
}
