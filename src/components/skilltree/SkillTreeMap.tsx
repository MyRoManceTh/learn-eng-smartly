import { SkillTreeModule, levelLabels } from "@/data/skillTreeData";
import SkillTreeNode from "./SkillTreeNode";
import { cn } from "@/lib/utils";

interface SkillTreeMapProps {
  modules: SkillTreeModule[];
  isModuleUnlocked: (module: SkillTreeModule) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  getModuleProgress: (moduleId: string) => { completed: number; total: number };
  onModuleClick: (module: SkillTreeModule) => void;
  nextModuleId: string | null;
  activePath?: string;
}

const levelGradients: Record<number, string> = {
  1: "from-purple-500 to-purple-400",
  2: "from-blue-500 to-blue-400",
  3: "from-green-500 to-green-400",
  4: "from-amber-500 to-amber-400",
  5: "from-red-500 to-red-400",
};

const levelDotColors: Record<number, string> = {
  1: "bg-purple-500",
  2: "bg-blue-500",
  3: "bg-green-500",
  4: "bg-amber-500",
  5: "bg-red-500",
};

const SkillTreeMap = ({
  modules,
  isModuleUnlocked,
  isModuleCompleted,
  getModuleProgress,
  onModuleClick,
  nextModuleId,
}: SkillTreeMapProps) => {
  const levels = [...new Set(modules.map((m) => m.level))].sort();

  return (
    <div className="space-y-6">
      {levels.map((level, levelIdx) => {
        const levelModules = modules.filter((m) => m.level === level);
        const info = levelLabels[level];
        const allCompleted = levelModules.every((m) => isModuleCompleted(m.id));
        const completedCount = levelModules.filter((m) => isModuleCompleted(m.id)).length;
        const progressPct = (completedCount / levelModules.length) * 100;
        const gradient = levelGradients[level] || levelGradients[1];
        const dotColor = levelDotColors[level] || levelDotColors[1];

        return (
          <div key={level}>
            {/* Level divider (between levels) */}
            {levelIdx > 0 && (
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className={cn("w-1 h-1 rounded-full", dotColor, "opacity-40")} />
                  ))}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${level * 100}ms` }}>
              {/* Level header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all",
                  allCompleted
                    ? "bg-gradient-to-br " + gradient + " border-white/20 shadow-lg"
                    : "bg-white/10 border-white/10"
                )}>
                  {info?.icon || '📚'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">
                      Level {level} — {info?.name || ''}
                    </h2>
                    <span className="text-xs text-white/30">({info?.cefr})</span>
                    {allCompleted && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold animate-bounce-in">
                        ✅ Complete!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r",
                          gradient
                        )}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/30 font-thai">
                      {completedCount}/{levelModules.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Module nodes */}
              <div className="relative pl-4">
                {/* Dotted vertical connector */}
                <div className="absolute left-[2.25rem] top-0 bottom-0 flex flex-col items-center">
                  <div className={cn(
                    "w-0.5 h-full rounded-full",
                    allCompleted
                      ? "bg-gradient-to-b " + gradient + " opacity-30"
                      : "bg-white/10"
                  )} />
                </div>

                <div className="flex flex-col gap-2">
                  {levelModules.map((module, i) => {
                    const unlocked = isModuleUnlocked(module);
                    const completed = isModuleCompleted(module.id);
                    const isCurrent = module.id === nextModuleId;
                    const progress = getModuleProgress(module.id);
                    const offset = i % 2 === 0 ? 0 : 40;

                    return (
                      <div key={module.id}>
                        {/* Connector dot between nodes */}
                        {i > 0 && (
                          <div className="flex justify-start pl-[2.05rem] -my-1 relative z-10">
                            <span className={cn(
                              "w-2 h-2 rounded-full border-2 transition-colors",
                              completed
                                ? cn(dotColor, "border-transparent")
                                : isCurrent
                                  ? cn(dotColor, "border-transparent animate-pulse")
                                  : "bg-white/5 border-white/20"
                            )} />
                          </div>
                        )}
                        <div
                          className="animate-in fade-in duration-300"
                          style={{
                            animationDelay: `${(level * 10 + i) * 50}ms`,
                            paddingLeft: `${offset}px`,
                          }}
                        >
                          <div className="max-w-xs">
                            <SkillTreeNode
                              module={module}
                              isUnlocked={unlocked}
                              isCompleted={completed}
                              isCurrent={isCurrent}
                              progress={progress}
                              onClick={() => onModuleClick(module)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillTreeMap;
