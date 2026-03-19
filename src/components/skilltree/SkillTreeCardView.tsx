import { useRef, useEffect } from "react";
import { SkillTreeModule, getLessonsByModule, levelLabels } from "@/data/skillTreeData";
import { cn } from "@/lib/utils";
import { Lock, CheckCircle } from "lucide-react";

interface Props {
  modules: SkillTreeModule[];
  isModuleUnlocked: (module: SkillTreeModule) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  getModuleProgress: (moduleId: string) => { completed: number; total: number };
  onModuleClick: (module: SkillTreeModule) => void;
  nextModuleId: string | null;
}

const LEVEL_GRADIENTS: Record<number, string> = {
  1: "from-emerald-400 to-green-500",
  2: "from-sky-400 to-blue-500",
  3: "from-purple-400 to-violet-500",
  4: "from-pink-400 to-rose-500",
  5: "from-amber-400 to-orange-500",
};

const LEVEL_BG: Record<number, string> = {
  1: "bg-emerald-50",
  2: "bg-sky-50",
  3: "bg-purple-50",
  4: "bg-pink-50",
  5: "bg-amber-50",
};

function ProgressCircle({ completed, total, size = 44 }: { completed: number; total: number; size?: number }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={pct >= 100 ? "#22c55e" : "#8b5cf6"}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {pct >= 100 ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <span className="text-[10px] font-bold text-muted-foreground">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function SkillTreeCardView({
  modules,
  isModuleUnlocked,
  isModuleCompleted,
  getModuleProgress,
  onModuleClick,
  nextModuleId,
}: Props) {
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nextRef.current) {
      nextRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [nextModuleId]);

  // Group modules by level
  const byLevel = new Map<number, SkillTreeModule[]>();
  modules.forEach((m) => {
    const list = byLevel.get(m.level) || [];
    list.push(m);
    byLevel.set(m.level, list);
  });

  const levels = Array.from(byLevel.keys()).sort();

  return (
    <div className="space-y-6 pb-4">
      {levels.map((level) => {
        const mods = byLevel.get(level) || [];
        const levelInfo = levelLabels[level] || { name: `Level ${level}`, cefr: "", icon: "📚" };

        return (
          <div key={level}>
            {/* Level header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-lg">{(levelInfo as any).icon || "📚"}</span>
              <div>
                <h3 className="text-sm font-bold font-thai">{(levelInfo as any).name || `Level ${level}`}</h3>
                <span className="text-[10px] text-muted-foreground">{(levelInfo as any).cefr || ""}</span>
              </div>
            </div>

            {/* Module cards */}
            <div className="space-y-2.5">
              {mods.map((mod) => {
                const unlocked = isModuleUnlocked(mod);
                const completed = isModuleCompleted(mod.id);
                const progress = getModuleProgress(mod.id);
                const lessons = getLessonsByModule(mod.id);
                const isNext = mod.id === nextModuleId;
                const gradient = LEVEL_GRADIENTS[mod.level] || LEVEL_GRADIENTS[1];

                return (
                  <div
                    key={mod.id}
                    ref={isNext ? nextRef : undefined}
                    onClick={() => unlocked && onModuleClick(mod)}
                    className={cn(
                      "rounded-2xl border overflow-hidden transition-all",
                      unlocked
                        ? "cursor-pointer hover:shadow-md active:scale-[0.98]"
                        : "opacity-50 cursor-not-allowed",
                      isNext && "ring-2 ring-purple-400 ring-offset-2",
                      completed ? "border-green-300 bg-green-50/50" : "border-white/60 bg-white/80"
                    )}
                  >
                    <div className="flex items-center gap-3 p-3">
                      {/* Module icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0",
                          unlocked
                            ? `bg-gradient-to-br ${gradient} text-white`
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {unlocked ? mod.icon : <Lock className="w-5 h-5" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate font-thai">{mod.title}</p>
                        <p className="text-[11px] text-muted-foreground font-thai">
                          {lessons.length} บทเรียน
                        </p>

                        {/* Lesson dots */}
                        {unlocked && (
                          <div className="flex items-center gap-1 mt-1.5">
                            {lessons.map((l, i) => {
                              const done = i < progress.completed;
                              return (
                                <div
                                  key={l.id}
                                  className={cn(
                                    "w-4 h-4 rounded-full flex items-center justify-center transition-all",
                                    done
                                      ? "bg-green-500 text-white"
                                      : i === progress.completed
                                      ? "bg-purple-500 text-white animate-pulse"
                                      : "bg-muted"
                                  )}
                                >
                                  {done && <CheckCircle className="w-3 h-3" />}
                                  {!done && i === progress.completed && (
                                    <span className="text-[8px] font-bold">▶</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Progress circle */}
                      {unlocked && (
                        <div className="shrink-0">
                          <ProgressCircle completed={progress.completed} total={progress.total} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
