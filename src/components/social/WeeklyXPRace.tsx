import { useFriendLeaderboard } from "@/hooks/useFriendLeaderboard";
import { evolutionStages } from "@/data/evolutionStages";
import { cn } from "@/lib/utils";

const rankColors = [
  "", // 0-indexed placeholder
  "from-amber-400 to-yellow-500",   // 1st
  "from-gray-300 to-slate-400",     // 2nd
  "from-orange-300 to-amber-400",   // 3rd
];

const rankRewards = ["", "50🪙", "30🪙", "20🪙"];

function getEvoIcon(stage: number) {
  return evolutionStages.find((s) => s.stage === stage)?.icon || "🥚";
}

export default function WeeklyXPRace() {
  const { sortEntries, timeToReset, hasFriends, loading } = useFriendLeaderboard();

  if (loading || !hasFriends) return null;

  const entries = sortEntries("weekly").slice(0, 5);
  const maxXP = Math.max(...entries.map((e) => e.weekly_exp), 1);

  return (
    <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏃</span>
          <span className="text-sm font-bold font-thai">Weekly XP Race</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-thai">
          ⏰ {timeToReset}
        </span>
      </div>

      {/* Race bars */}
      <div className="space-y-2">
        {entries.map((entry) => {
          const width = maxXP > 0 ? (entry.weekly_exp / maxXP) * 100 : 0;
          const barColor = entry.rank <= 3
            ? rankColors[entry.rank]
            : "from-gray-200 to-gray-300";

          return (
            <div key={entry.user_id} className="flex items-center gap-2">
              <span className="text-base w-5 shrink-0">{getEvoIcon(entry.evolution_stage)}</span>
              <span className={cn(
                "text-xs w-16 truncate font-thai shrink-0",
                entry.isMe ? "font-bold text-purple-700" : "text-muted-foreground"
              )}>
                {entry.isMe ? "คุณ" : entry.display_name}
              </span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                    barColor,
                    entry.isMe && "ring-1 ring-purple-300"
                  )}
                  style={{ width: `${Math.max(width, 3)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-foreground w-12 text-right shrink-0">
                +{entry.weekly_exp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rewards hint */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-[10px] text-muted-foreground font-thai text-center">
          🏆 รางวัล Top 3: {rankRewards[1]} {rankRewards[2]} {rankRewards[3]}
        </p>
      </div>
    </div>
  );
}
