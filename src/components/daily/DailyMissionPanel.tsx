import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import type { DailyMission, MissionType } from "@/types/dopamine";
import { cn } from "@/lib/utils";

interface Props {
  missions: DailyMission[];
  loading: boolean;
  completedCount: number;
  totalCount: number;
  allCompleted: boolean;
}

const missionIcons: Record<MissionType, string> = {
  streak_login: "🔥",
  complete_lesson: "📖",
  answer_quiz: "🧠",
  visit_avatar: "🛒",
  read_article: "📚",
  path_node: "🗺️",
};

const DailyMissionPanel = ({
  missions,
  loading,
  completedCount,
  totalCount,
  allCompleted,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const overallProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-card rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-base">📋</span>
          <span className="font-semibold text-sm">
            ภารกิจวันนี้
          </span>
          <Badge
            variant={allCompleted ? "default" : "secondary"}
            className={cn(
              "text-xs",
              allCompleted &&
                "bg-emerald-500 hover:bg-emerald-500 text-white"
            )}
          >
            {completedCount}/{totalCount}
          </Badge>
          {allCompleted && (
            <span className="text-xs font-bold text-amber-500 animate-pulse">
              🎉 ครบแล้ว! โบนัส x2
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 space-y-2">
        {/* แถบความคืบหน้ารวม */}
        <div className="px-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>ความคืบหน้ารวม</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress
            value={overallProgress}
            className="h-2"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              กำลังโหลดภารกิจ...
            </span>
          </div>
        )}

        {/* รายการภารกิจ */}
        {!loading &&
          missions.map((mission) => {
            const icon = missionIcons[mission.mission_type] || "📌";
            const missionProgress =
              mission.target_count > 0
                ? Math.min(
                    (mission.current_count / mission.target_count) * 100,
                    100
                  )
                : 0;

            return (
              <div
                key={mission.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all",
                  mission.completed
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-card border-border/50"
                )}
              >
                {/* ไอคอนภารกิจ */}
                <span className="text-xl flex-shrink-0">{icon}</span>

                {/* รายละเอียด */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      mission.completed &&
                        "line-through text-muted-foreground"
                    )}
                  >
                    {mission.mission_title}
                  </p>
                  {/* แถบความคืบหน้า */}
                  <div className="flex items-center gap-2 mt-1">
                    <Progress
                      value={missionProgress}
                      className={cn(
                        "h-1.5 flex-1",
                        mission.completed && "[&>div]:bg-emerald-500"
                      )}
                    />
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {mission.current_count}/{mission.target_count}
                    </span>
                  </div>
                  {/* รางวัล */}
                  <div className="flex items-center gap-2 mt-1">
                    {mission.reward_coins > 0 && (
                      <span className="text-[11px] text-amber-500">
                        🪙 {mission.reward_coins}
                      </span>
                    )}
                    {mission.reward_exp > 0 && (
                      <span className="text-[11px] text-emerald-500">
                        ✨ {mission.reward_exp} EXP
                      </span>
                    )}
                  </div>
                </div>

                {/* สถานะ */}
                {mission.completed && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}

        {/* ไม่มีภารกิจ */}
        {!loading && missions.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            ยังไม่มีภารกิจวันนี้
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DailyMissionPanel;
