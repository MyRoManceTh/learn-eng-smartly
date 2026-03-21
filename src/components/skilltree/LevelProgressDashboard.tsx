import { cn } from "@/lib/utils";
import { levelLabels, SkillTreeModule } from "@/data/skillTreeData";

interface LevelProgressDashboardProps {
  currentLevel: number;
  pathModules: SkillTreeModule[];
  isModuleCompleted: (id: string) => boolean;
}

// What's needed to advance per level (plain text, Thai)
const advanceRequirements: Record<number, string> = {
  0: "ผ่าน Pre-A1 ทั้ง 4 modules",
  1: "ผ่าน A1 ทั้ง 8 modules + อ่านเรื่อง Easy 3 เรื่อง",
  2: "ผ่าน A2 ทั้ง 10 modules + เลือก Specialty 1 สาย",
  3: "ผ่าน B1 ทั้ง 10 modules + อ่านเรื่อง Hard 5 เรื่อง + ฝึกพูด 3 ครั้ง",
  4: "ผ่าน B1+ ทั้ง 10 modules + IELTS หรือ TOEIC 1 สาย",
  5: "ยอดเยี่ยม! คุณถึงระดับสูงสุดแล้ว 🏆",
};

const levelBorderColors: Record<number, string> = {
  0: "border-lime-500/40",
  1: "border-violet-500/40",
  2: "border-sky-500/40",
  3: "border-emerald-500/40",
  4: "border-amber-500/40",
  5: "border-rose-500/40",
};

const levelBarColors: Record<number, string> = {
  0: "from-lime-400 to-green-500",
  1: "from-violet-400 to-indigo-500",
  2: "from-sky-400 to-blue-500",
  3: "from-emerald-400 to-green-500",
  4: "from-amber-400 to-orange-500",
  5: "from-rose-400 to-pink-500",
};

const levelTextColors: Record<number, string> = {
  0: "text-lime-300",
  1: "text-violet-300",
  2: "text-sky-300",
  3: "text-emerald-300",
  4: "text-amber-300",
  5: "text-rose-300",
};

export default function LevelProgressDashboard({
  currentLevel,
  pathModules,
  isModuleCompleted,
}: LevelProgressDashboardProps) {
  const currentLevelInfo = levelLabels[currentLevel];
  const nextLevelInfo = levelLabels[currentLevel + 1];

  const currentLevelModules = pathModules.filter((m) => m.pathId === "core" && m.level === currentLevel);
  const completedAtCurrentLevel = currentLevelModules.filter((m) => isModuleCompleted(m.id)).length;
  const total = currentLevelModules.length;
  const percent = total > 0 ? Math.round((completedAtCurrentLevel / total) * 100) : 0;

  const borderColor = levelBorderColors[currentLevel] || levelBorderColors[1];
  const barColor = levelBarColors[currentLevel] || levelBarColors[1];
  const textColor = levelTextColors[currentLevel] || levelTextColors[1];

  if (!currentLevelInfo) return null;

  return (
    <div className={cn(
      "rounded-2xl border-2 bg-white/5 backdrop-blur-sm p-4 space-y-3",
      borderColor
    )}>
      {/* Level badge row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-sway" style={{ display: "inline-block" }}>
            {currentLevelInfo.icon}
          </span>
          <div>
            <p className={cn("text-sm font-bold font-thai", textColor)}>
              Level {currentLevel} · {currentLevelInfo.cefr}
            </p>
            <p className="text-[10px] text-white/40 font-thai">{currentLevelInfo.name}</p>
          </div>
        </div>
        {nextLevelInfo && (
          <div className="flex items-center gap-1 text-[10px] text-white/30 font-thai">
            <span>ถัดไป</span>
            <span className="text-base">{nextLevelInfo.icon}</span>
            <span>{nextLevelInfo.cefr}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-700 ease-out", barColor)}
              style={{ width: `${Math.max(percent, 3)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-white/40 font-thai">
              Modules ระดับนี้: {completedAtCurrentLevel}/{total}
            </p>
            <p className={cn("text-[10px] font-bold font-thai", textColor)}>{percent}%</p>
          </div>
        </div>
      )}

      {/* Requirement to advance */}
      <div className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2">
        <span className="text-sm mt-0.5">🎯</span>
        <p className="text-[10px] text-white/50 font-thai leading-relaxed">
          {currentLevel < 5
            ? <><span className="text-white/70 font-bold">เพื่อขึ้น {nextLevelInfo?.cefr}: </span>{advanceRequirements[currentLevel]}</>
            : advanceRequirements[5]
          }
        </p>
      </div>
    </div>
  );
}
