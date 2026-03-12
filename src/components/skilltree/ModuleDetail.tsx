import { SkillTreeModule, getLessonsByModule, SkillTreeLesson } from "@/data/skillTreeData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Lock, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleDetailProps {
  module: SkillTreeModule;
  isNodeCompleted: (nodeId: string) => boolean;
  isModuleCompleted: boolean;
  onLessonClick: (lesson: SkillTreeLesson) => void;
  onBack: () => void;
  loadingLessonId: string | null;
}

const levelColors: Record<number, {
  gradient: string; dot: string; glow: string;
  bg: string; border: string; badge: string;
}> = {
  1: { gradient: "from-violet-500 to-purple-500", dot: "bg-violet-500", glow: "shadow-violet-500/20", bg: "bg-violet-500/10", border: "border-violet-500/30", badge: "bg-violet-500" },
  2: { gradient: "from-sky-500 to-blue-500", dot: "bg-sky-500", glow: "shadow-sky-500/20", bg: "bg-sky-500/10", border: "border-sky-500/30", badge: "bg-sky-500" },
  3: { gradient: "from-emerald-500 to-green-500", dot: "bg-emerald-500", glow: "shadow-emerald-500/20", bg: "bg-emerald-500/10", border: "border-emerald-500/30", badge: "bg-emerald-500" },
  4: { gradient: "from-amber-500 to-orange-500", dot: "bg-amber-500", glow: "shadow-amber-500/20", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "bg-amber-500" },
  5: { gradient: "from-rose-500 to-red-500", dot: "bg-rose-500", glow: "shadow-rose-500/20", bg: "bg-rose-500/10", border: "border-rose-500/30", badge: "bg-rose-500" },
};

const ModuleDetail = ({
  module,
  isNodeCompleted,
  isModuleCompleted,
  onLessonClick,
  onBack,
  loadingLessonId,
}: ModuleDetailProps) => {
  const lessons = getLessonsByModule(module.id);
  const completedCount = lessons.filter((l) => isNodeCompleted(l.id)).length;
  const colors = levelColors[module.level] || levelColors[1];
  const progressPct = (completedCount / lessons.length) * 100;

  const getIsLessonUnlocked = (lesson: SkillTreeLesson, index: number) => {
    if (index === 0) return true;
    const prevLesson = lessons[index - 1];
    return prevLesson ? isNodeCompleted(prevLesson.id) : false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xl">{module.icon}</span>
              <span className="text-sm font-bold text-white font-thai">{module.nameThai}</span>
            </div>
          </div>
          {/* Progress bar - cartoon style */}
          <div className="mt-2 relative">
            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border-2 border-white/10">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r relative",
                  colors.gradient
                )}
                style={{ width: `${progressPct}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
              </div>
            </div>
            <span className="absolute right-2 top-0.5 text-[10px] font-bold text-white drop-shadow">
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>
      </header>

      {/* Module info card - cartoon style */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className={cn(
          "rounded-2xl border-2 p-4 mb-6 animate-cartoon-pop relative overflow-hidden",
          colors.border, colors.bg
        )}>
          {/* Decorative corner circles */}
          <div className={cn("absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20", colors.badge)} />
          <div className={cn("absolute -bottom-3 -left-3 w-10 h-10 rounded-full opacity-10", colors.badge)} />

          <div className="relative flex items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2",
              "bg-white/10 backdrop-blur-sm",
              colors.border
            )}>
              {module.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white">{module.name}</h2>
              <p className="text-xs text-white/50 font-thai mt-0.5">
                Level {module.level} · {lessons.length} บทเรียน
              </p>
              {module.reward && (
                <p className="text-xs text-amber-400 font-thai mt-1 flex items-center gap-1">
                  <span>🎁</span> รางวัล: {module.reward.label}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lesson list - cartoon path style */}
        <div className="relative">
          {/* Vertical connector line (cartoon dashed) */}
          <div className="absolute left-[2rem] top-4 bottom-4 w-1 rounded-full overflow-hidden">
            <div className={cn("w-full h-full bg-white/10")} />
            <div
              className={cn("absolute top-0 left-0 w-full rounded-full bg-gradient-to-b", colors.gradient)}
              style={{ height: `${progressPct}%`, transition: "height 0.7s ease-out" }}
            />
          </div>

          <div className="flex flex-col gap-3">
            {lessons.map((lesson, index) => {
              const completed = isNodeCompleted(lesson.id);
              const unlocked = getIsLessonUnlocked(lesson, index);
              const isLoading = loadingLessonId === lesson.id;
              const isNext = unlocked && !completed &&
                (index === 0 || isNodeCompleted(lessons[index - 1]?.id));

              return (
                <div
                  key={lesson.id}
                  className="animate-cartoon-pop"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <button
                    onClick={() => unlocked && !isLoading && onLessonClick(lesson)}
                    disabled={!unlocked || isLoading}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-2xl p-3 border-2 transition-all duration-200",
                      // Completed
                      completed && "bg-green-500/10 border-green-500/30 hover:bg-green-500/15",
                      // Next (current)
                      isNext && !completed && cn(
                        colors.bg, colors.border,
                        "shadow-lg", colors.glow,
                        "hover:scale-[1.02] active:scale-[0.98]"
                      ),
                      // Unlocked
                      unlocked && !completed && !isNext && "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-md",
                      // Locked
                      !unlocked && "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed"
                    )}
                  >
                    {/* Number circle */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                      "border-2 transition-all",
                      completed && "bg-green-500 border-green-400 text-white shadow-[0_3px_0_0_rgb(21,128,61)]",
                      isNext && !completed && cn(
                        "bg-gradient-to-br text-white shadow-[0_3px_0_0_rgba(0,0,0,0.3)]",
                        colors.gradient, colors.border
                      ),
                      unlocked && !completed && !isNext && "bg-white/10 border-white/10 text-white/50",
                      !unlocked && "bg-white/5 border-white/5 text-white/20"
                    )}>
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : !unlocked ? (
                        <Lock className="w-4 h-4" />
                      ) : isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>{lesson.order}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left min-w-0">
                      <p className={cn(
                        "text-sm font-thai font-bold truncate",
                        completed ? "text-green-300" : unlocked ? "text-white" : "text-white/30"
                      )}>
                        {lesson.topicThai}
                      </p>
                      <p className={cn(
                        "text-xs truncate",
                        completed ? "text-green-400/50" : "text-white/30"
                      )}>
                        {lesson.topic}
                      </p>
                    </div>

                    {/* Action button */}
                    {unlocked && !completed && (
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                        "border-2 shadow-sm",
                        isNext
                          ? cn("bg-gradient-to-br text-white animate-float-gentle", colors.gradient, colors.border)
                          : "bg-white/10 border-white/10 text-white/40 hover:bg-white/20"
                      )}>
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </div>
                    )}

                    {/* Completed sparkle */}
                    {completed && (
                      <span className="text-lg animate-sparkle-twinkle">⭐</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module complete celebration */}
        {isModuleCompleted && (
          <div className="mt-8 text-center py-8 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-amber-600/5 animate-cartoon-bounce relative overflow-hidden">
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none">
              {['🎊', '✨', '🌟', '💫', '⭐', '🎉', '🥳', '🪅'].map((emoji, i) => (
                <span
                  key={i}
                  className="absolute animate-confetti text-lg"
                  style={{
                    left: `${8 + i * 12}%`,
                    animationDelay: `${i * 150}ms`,
                    bottom: '20%',
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            <div className="relative z-10">
              <div className="text-5xl mb-3 animate-hop">🏆</div>
              <p className="text-amber-300 font-bold font-thai text-xl">
                🎉 จบ Module แล้ว! 🎉
              </p>
              <p className="text-sm text-amber-400/60 font-thai mt-1">
                {module.nameThai}
              </p>
              {module.reward && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <span className="text-lg">🎁</span>
                  <span className="text-sm text-amber-300 font-bold font-thai">
                    ได้รับ: {module.reward.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
