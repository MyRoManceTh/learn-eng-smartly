import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriendLeaderboard, FriendLeaderboardEntry } from "@/hooks/useFriendLeaderboard";
import { evolutionStages } from "@/data/evolutionStages";
import { cn } from "@/lib/utils";

const rankMedals = ["", "🥇", "🥈", "🥉"];

function getEvoIcon(stage: number) {
  return evolutionStages.find((s) => s.stage === stage)?.icon || "🥚";
}

interface Props {
  compact?: boolean;
}

export default function FriendLeaderboard({ compact = false }: Props) {
  const navigate = useNavigate();
  const { sortEntries, getMyRank, loading, timeToReset, hasFriends } = useFriendLeaderboard();
  const [mode, setMode] = useState<"weekly" | "alltime">("weekly");

  const entries = sortEntries(mode);
  const myRank = getMyRank(mode);
  const displayEntries = compact ? entries.slice(0, 3) : entries;

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">👥</span>
          <span className="text-sm font-bold font-thai">อันดับเพื่อน</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasFriends) {
    return (
      <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm text-center">
        <p className="text-2xl mb-1">🤝</p>
        <p className="text-sm font-bold font-thai mb-1">เพิ่มเพื่อนเพื่อแข่งขัน!</p>
        <p className="text-xs text-muted-foreground font-thai mb-2">
          ไปที่หน้า "ฉัน" แล้วแชร์รหัสเพื่อน
        </p>
        <button
          onClick={() => navigate("/my")}
          className="text-xs font-bold text-purple-600 hover:underline font-thai"
        >
          เพิ่มเพื่อน →
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">👥</span>
          <span className="text-sm font-bold font-thai">อันดับเพื่อน</span>
        </div>
        {!compact && (
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setMode("weekly")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold font-thai transition-all",
                mode === "weekly" ? "bg-white shadow-sm text-purple-600" : "text-muted-foreground"
              )}
            >
              สัปดาห์
            </button>
            <button
              onClick={() => setMode("alltime")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold font-thai transition-all",
                mode === "alltime" ? "bg-white shadow-sm text-purple-600" : "text-muted-foreground"
              )}
            >
              ทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Entries */}
      <div className="space-y-1.5">
        {displayEntries.map((entry) => (
          <div
            key={entry.user_id}
            className={cn(
              "flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all",
              entry.isMe
                ? "bg-purple-50 ring-1 ring-purple-200"
                : "hover:bg-gray-50"
            )}
          >
            {/* Rank */}
            <span className="w-6 text-center shrink-0">
              {entry.rank <= 3 ? (
                <span className="text-base">{rankMedals[entry.rank]}</span>
              ) : (
                <span className="text-xs font-bold text-muted-foreground">{entry.rank}</span>
              )}
            </span>

            {/* Evolution icon */}
            <span className="text-base shrink-0">{getEvoIcon(entry.evolution_stage)}</span>

            {/* Name */}
            <span className={cn(
              "flex-1 text-sm font-medium truncate font-thai",
              entry.isMe && "font-bold text-purple-700"
            )}>
              {entry.isMe ? `${entry.display_name} (คุณ)` : entry.display_name}
            </span>

            {/* XP */}
            <span className="text-xs font-bold text-purple-600 shrink-0">
              {mode === "weekly" ? `+${entry.weekly_exp}` : entry.total_exp.toLocaleString()} XP
            </span>

            {/* Streak */}
            <span className="text-xs text-muted-foreground shrink-0">
              🔥{entry.current_streak}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        {mode === "weekly" && (
          <span className="text-[10px] text-muted-foreground font-thai">
            ⏰ รีเซ็ตใน {timeToReset}
          </span>
        )}
        {compact && entries.length > 3 && (
          <button
            onClick={() => navigate("/my")}
            className="text-[10px] font-bold text-purple-600 hover:underline font-thai ml-auto"
          >
            ดูทั้งหมด →
          </button>
        )}
      </div>
    </div>
  );
}
