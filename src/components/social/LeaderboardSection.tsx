import { useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { evolutionStages } from "@/data/evolutionStages";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardSection() {
  const { entries, myRank, loading } = useLeaderboard();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"weekly" | "all">("weekly");

  // Show top 10 only
  const displayEntries = entries.slice(0, 10);

  const getEvolutionIcon = (stage: number) => {
    const evo = evolutionStages.find((s) => s.stage === stage);
    return evo?.icon || "🥚";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏆 กระดานผู้นำ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">🏆 กระดานผู้นำ</CardTitle>
          <div className="flex gap-1">
            <button
              onClick={() => setTimeRange("weekly")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                timeRange === "weekly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              สัปดาห์นี้
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                timeRange === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              ตลอดกาล
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayEntries.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            ยังไม่มีข้อมูลผู้เล่น
          </p>
        )}

        {/* Top 3 - Larger display */}
        {displayEntries.slice(0, 3).map((entry) => {
          const isMe = user?.id === entry.user_id;
          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                isMe
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "bg-muted/30"
              }`}
            >
              <span className="text-2xl">{MEDALS[entry.rank - 1]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">
                    {getEvolutionIcon(entry.evolution_stage)}{" "}
                    {entry.display_name}
                  </span>
                  {isMe && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      คุณ
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>⚡ {entry.total_exp.toLocaleString()} EXP</span>
                  <span>🔥 {entry.current_streak} วัน</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Rank 4-10 - Compact list */}
        {displayEntries.slice(3).map((entry) => {
          const isMe = user?.id === entry.user_id;
          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isMe
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "hover:bg-muted/30"
              }`}
            >
              <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                {entry.rank}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm truncate">
                    {getEvolutionIcon(entry.evolution_stage)}{" "}
                    {entry.display_name}
                  </span>
                  {isMe && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      คุณ
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <span>⚡ {entry.total_exp.toLocaleString()}</span>
                <span>🔥 {entry.current_streak}</span>
              </div>
            </div>
          );
        })}

        {/* My rank footer */}
        {myRank > 0 && (
          <div className="border-t pt-2 mt-3">
            <p className="text-center text-sm font-medium text-muted-foreground">
              อันดับของคุณ:{" "}
              <span className="text-primary font-bold">
                {myRank <= 3 ? MEDALS[myRank - 1] : `#${myRank}`}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
