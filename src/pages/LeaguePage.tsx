import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { getLeagueByExp, getNextLeague, leagues } from "@/data/leagueData";
import { evolutionStages } from "@/data/evolutionStages";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronLeft, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaguePlayer {
  user_id: string;
  display_name: string;
  evolution_stage: number;
  total_exp: number;
  weekly_xp: number;
  rank: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const PROMOTE_COUNT = 5;
const DEMOTE_COUNT = 5;
const DAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

function getMonday(): Date {
  const now = new Date();
  const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const day = thaiNow.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(thaiNow);
  monday.setDate(thaiNow.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getTimeToReset(): string {
  const now = new Date();
  const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const day = thaiNow.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  const nextMonday = new Date(thaiNow);
  nextMonday.setDate(thaiNow.getDate() + diff + (day === 0 ? 0 : 0));
  // Actually calculate next Monday
  const daysUntilMonday = day === 1 ? 7 : ((8 - day) % 7);
  nextMonday.setDate(thaiNow.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const diffMs = nextMonday.getTime() - thaiNow.getTime();
  if (diffMs <= 0) return "รีเซ็ตเร็วๆ นี้";
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days} วัน ${hours} ชม.`;
  return `${hours} ชม.`;
}

export default function LeaguePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [players, setPlayers] = useState<LeaguePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [myDailyXP, setMyDailyXP] = useState<number[]>(Array(7).fill(0));

  const myLeague = useMemo(() => getLeagueByExp(profile?.total_exp || 0), [profile]);
  const nextLeague = useMemo(() => getNextLeague(myLeague), [myLeague]);

  const getEvolutionIcon = (stage: number) => {
    return evolutionStages.find((s) => s.stage === stage)?.icon || "🥚";
  };

  const loadLeagueData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const monday = getMonday();
    const mondayISO = monday.toISOString();

    // Get players in same league range
    const league = getLeagueByExp(profile?.total_exp || 0);
    const nextL = getNextLeague(league);
    const maxExp = nextL ? nextL.minExp : 999999999;

    const { data: leaguePlayers } = await supabase
      .from("profiles")
      .select("user_id, display_name, total_exp, evolution_stage")
      .gte("total_exp", league.minExp)
      .lt("total_exp", maxExp)
      .not("display_name", "is", null)
      .order("total_exp", { ascending: false })
      .limit(30);

    if (!leaguePlayers) {
      setLoading(false);
      return;
    }

    const userIds = (leaguePlayers as any[]).map((p) => p.user_id);

    // Get weekly XP
    const { data: history } = await supabase
      .from("learning_history")
      .select("user_id, quiz_score")
      .in("user_id", userIds)
      .gte("completed_at", mondayISO);

    const weeklyMap = new Map<string, number>();
    ((history as any[]) || []).forEach((h) => {
      const prev = weeklyMap.get(h.user_id) || 0;
      weeklyMap.set(h.user_id, prev + (h.quiz_score || 0) * 10 + 5);
    });

    const ranked: LeaguePlayer[] = (leaguePlayers as any[])
      .map((p) => ({
        user_id: p.user_id,
        display_name: p.display_name || "ไม่ระบุชื่อ",
        evolution_stage: p.evolution_stage || 1,
        total_exp: p.total_exp || 0,
        weekly_xp: weeklyMap.get(p.user_id) || 0,
        rank: 0,
      }))
      .sort((a, b) => b.weekly_xp - a.weekly_xp);

    ranked.forEach((p, i) => (p.rank = i + 1));
    setPlayers(ranked);

    // My daily XP for chart
    if (user) {
      const { data: myHistory } = await supabase
        .from("learning_history")
        .select("completed_at, quiz_score")
        .eq("user_id", user.id)
        .gte("completed_at", mondayISO);

      const daily = Array(7).fill(0);
      ((myHistory as any[]) || []).forEach((h) => {
        const d = new Date(h.completed_at);
        const thaiD = new Date(d.getTime() + 7 * 60 * 60 * 1000);
        let dayIdx = thaiD.getDay() - 1;
        if (dayIdx < 0) dayIdx = 6;
        daily[dayIdx] += (h.quiz_score || 0) * 10 + 5;
      });
      setMyDailyXP(daily);
    }

    setLoading(false);
  }, [user, profile]);

  useEffect(() => {
    loadLeagueData();
  }, [loadLeagueData]);

  const myRank = players.find((p) => p.user_id === user?.id);
  const totalPlayers = players.length;

  const chartData = DAY_LABELS.map((day, i) => ({ day, xp: myDailyXP[i] }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <header className={cn("sticky top-0 z-30 text-white shadow-lg bg-gradient-to-r", myLeague.bgGradient)}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold font-thai flex items-center gap-2">
                {myLeague.emoji} {myLeague.nameThai} League
              </h1>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Clock className="w-3 h-3" />
                <span className="font-thai">รีเซ็ตใน {getTimeToReset()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* League badge */}
        <div className={cn("rounded-2xl p-5 text-white text-center shadow-lg bg-gradient-to-br", myLeague.bgGradient)}>
          <span className="text-5xl">{myLeague.emoji}</span>
          <h2 className="text-xl font-bold mt-2">{myLeague.nameThai} League</h2>
          {nextLeague && (
            <p className="text-xs text-white/70 mt-1 font-thai">
              อีก {(nextLeague.minExp - (profile?.total_exp || 0)).toLocaleString()} EXP ถึง {nextLeague.emoji} {nextLeague.nameThai}
            </p>
          )}
          {/* League progress */}
          {nextLeague && (
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (((profile?.total_exp || 0) - myLeague.minExp) / (nextLeague.minExp - myLeague.minExp)) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* My weekly chart */}
        <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm">
          <h3 className="text-sm font-bold font-thai mb-2">📊 XP สัปดาห์นี้ของฉัน</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg bg-foreground text-background px-2 py-1 text-xs font-bold shadow-lg">
                      {payload[0].value} XP
                    </div>
                  );
                }}
              />
              <Bar dataKey="xp" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="#8b5cf6" opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Promotion/Demotion legend */}
        <div className="flex gap-2 text-[10px] font-thai">
          <span className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-3 h-3" /> Top {PROMOTE_COUNT} เลื่อนขั้น
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Minus className="w-3 h-3" /> อยู่ที่เดิม
          </span>
          <span className="flex items-center gap-1 text-rose-500">
            <TrendingDown className="w-3 h-3" /> ท้าย {DEMOTE_COUNT} ตกชั้น
          </span>
        </div>

        {/* Rankings */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {players.map((player) => {
              const isMe = player.user_id === user?.id;
              const isPromote = player.rank <= PROMOTE_COUNT;
              const isDemote = totalPlayers > DEMOTE_COUNT + PROMOTE_COUNT && player.rank > totalPlayers - DEMOTE_COUNT;

              return (
                <div
                  key={player.user_id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                    isMe
                      ? "bg-purple-500/10 ring-1 ring-purple-300/50"
                      : isPromote
                      ? "bg-emerald-50/80"
                      : isDemote
                      ? "bg-rose-50/80"
                      : "bg-white/60"
                  )}
                >
                  {/* Rank */}
                  <div className="w-7 text-center shrink-0">
                    {player.rank <= 3 ? (
                      <span className="text-lg">{MEDALS[player.rank - 1]}</span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">{player.rank}</span>
                    )}
                  </div>

                  {/* Zone indicator */}
                  <div className="w-4 shrink-0">
                    {isPromote && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                    {isDemote && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{getEvolutionIcon(player.evolution_stage)}</span>
                      <span className="text-sm font-medium truncate font-thai">
                        {player.display_name}
                      </span>
                      {isMe && (
                        <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">คุณ</span>
                      )}
                    </div>
                  </div>

                  {/* Weekly XP */}
                  <div className="text-right shrink-0">
                    <p className={cn("font-bold text-sm", player.rank <= 3 ? "text-amber-600" : "text-foreground")}>
                      {player.weekly_xp}
                    </p>
                    <p className="text-[9px] text-muted-foreground">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* All leagues */}
        <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm">
          <h3 className="text-sm font-bold font-thai mb-3">🏅 ลีกทั้งหมด</h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {leagues.map((l) => (
              <div
                key={l.id}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-3 min-w-[70px] transition-all",
                  l.id === myLeague.id
                    ? "bg-gradient-to-b " + l.bgGradient + " text-white ring-2 ring-offset-1 ring-purple-300 scale-105"
                    : "bg-muted/30"
                )}
              >
                <span className="text-2xl">{l.emoji}</span>
                <span className={cn("text-[10px] font-bold font-thai", l.id !== myLeague.id && "text-muted-foreground")}>
                  {l.nameThai}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
