import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
const BAR_COLORS = [
  "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#6366f1", "#818cf8",
];

function getMonday(weekOffset: number): Date {
  const now = new Date();
  const thaiOffset = 7 * 60 * 60 * 1000;
  const thaiNow = new Date(now.getTime() + thaiOffset);
  const day = thaiNow.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(thaiNow);
  monday.setDate(thaiNow.getDate() - diff + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getSunday(monday: Date): Date {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

async function fetchWeeklyXP(userId: string, weekOffset: number) {
  const monday = getMonday(weekOffset);
  const sunday = getSunday(monday);

  const start = monday.toISOString();
  const end = sunday.toISOString();

  const { data } = await supabase
    .from("learning_history")
    .select("completed_at, quiz_score")
    .eq("user_id", userId)
    .gte("completed_at", start)
    .lte("completed_at", end);

  // Group by day of week
  const dailyXP = Array(7).fill(0);
  ((data as any[]) || []).forEach((row) => {
    const d = new Date(row.completed_at);
    const thaiD = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    let dayIdx = thaiD.getDay() - 1; // Mon=0 ... Sun=6
    if (dayIdx < 0) dayIdx = 6;
    dailyXP[dayIdx] += (row.quiz_score || 0) * 10 + 5;
  });

  return dailyXP.map((xp, i) => ({
    day: DAY_LABELS[i],
    xp,
  }));
}

export default function WeeklyXPChart() {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["weeklyXP", user?.id, weekOffset],
    queryFn: () => fetchWeeklyXP(user!.id, weekOffset),
    enabled: !!user,
    staleTime: 60_000,
  });

  const totalXP = useMemo(
    () => (chartData || []).reduce((sum, d) => sum + d.xp, 0),
    [chartData]
  );

  const maxXP = useMemo(
    () => Math.max(10, ...(chartData || []).map((d) => d.xp)),
    [chartData]
  );

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold font-thai flex items-center gap-1.5">
            📊 EXP สัปดาห์นี้
          </h3>
          <p className="text-xs text-muted-foreground font-thai mt-0.5">
            รวม <span className="font-bold text-purple-600">{totalXP}</span> XP
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekOffset(0)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold font-thai transition-all",
              weekOffset === 0
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            สัปดาห์นี้
          </button>
          <button
            onClick={() => setWeekOffset(-1)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold font-thai transition-all",
              weekOffset === -1
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            สัปดาห์ก่อน
          </button>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-[140px] flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-thai">กำลังโหลด...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#d1d5db" }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxXP * 1.1]}
              width={30}
            />
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
            <Bar dataKey="xp" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {(chartData || []).map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Today highlight */}
      {weekOffset === 0 && chartData && (
        <p className="text-[10px] text-center text-muted-foreground font-thai mt-1">
          {(() => {
            const now = new Date();
            const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
            let todayIdx = thaiNow.getDay() - 1;
            if (todayIdx < 0) todayIdx = 6;
            const todayXP = chartData[todayIdx]?.xp || 0;
            return todayXP > 0
              ? `วันนี้ได้ ${todayXP} XP แล้ว 🎉`
              : "วันนี้ยังไม่ได้ XP — มาเรียนกันเถอะ! 💪";
          })()}
        </p>
      )}
    </div>
  );
}
