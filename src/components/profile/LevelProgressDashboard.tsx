import { levelInfo, skillTreeModules } from "@/data/skillTreeData";
import { useSkillTreeProgress } from "@/hooks/useSkillTreeProgress";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function LevelProgressDashboard() {
  const { profile } = useProfile();
  const { isModuleCompleted, getModuleProgress } = useSkillTreeProgress();

  const currentLevel = profile?.current_level ?? 1;
  const info = levelInfo[currentLevel] || levelInfo[1];
  const nextInfo = levelInfo[currentLevel + 1];

  // Count modules completed/total for current level
  const currentLevelModules = skillTreeModules.filter(
    (m) => m.pathId === "core" && m.level === currentLevel
  );
  const completedCount = currentLevelModules.filter((m) => isModuleCompleted(m.id)).length;
  const totalCount = currentLevelModules.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 p-4 shadow-sm space-y-3">
      {/* Current level */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{info.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-thai">Level {currentLevel}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {info.cefr}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-thai">{info.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground font-thai">
          <span>โมดูลที่ผ่าน {completedCount}/{totalCount}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Next level requirement */}
      {nextInfo && (
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-thai",
          progress >= 100 ? "bg-green-50 text-green-700 border border-green-200" : "bg-muted/50 text-muted-foreground"
        )}>
          <span>{nextInfo.icon}</span>
          {progress >= 100 ? (
            <span className="font-bold">พร้อมเลื่อนระดับเป็น {nextInfo.cefr}! 🎉</span>
          ) : (
            <span>จบโมดูลทั้งหมดเพื่อเลื่อนเป็น {nextInfo.cefr}</span>
          )}
        </div>
      )}
    </div>
  );
}