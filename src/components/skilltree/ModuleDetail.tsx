import { useState } from "react";
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

const levelColors: Record<number, { gradient: string; dot: string; glow: string }> = {
  1: { gradient: "from-purple-500 to-purple-400", dot: "bg-purple-500", glow: "shadow-purple-500/20" },
  2: { gradient: "from-blue-500 to-blue-400", dot: "bg-blue-500", glow: "shadow-blue-500/20" },
  3: { gradient: "from-green-500 to-green-400", dot: "bg-green-500", glow: "shadow-green-500/20" },
  4: { gradient: "from-amber-500 to-amber-400", dot: "bg-amber-500", glow: "shadow-amber-500/20" },
  5: { gradient: "from-red-500 to-red-400", dot: "bg-red-500", glow: "shadow-red-500/20" },
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
              <span className="text-lg">{module.icon}</span>
              <span className="text-sm font-bold text-white font-thai">{module.nameThai}</span>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500 bg-gradient-to-r", colors.gradient)}
                style={{ width: `${(completedCount / lessons.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/50 font-thai">
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>
      </header>

      {/* Module info */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4 animate-in fade-in duration-300">
          <h2 className="text-lg font-bold text-white">{module.name}</h2>
          <p className="text-sm text-white/50 font-thai mt-1">
            Level {module.level} | {lessons.length} บทเรียน
          </p>
          {module.reward && (
            <p className="text-xs text-amber-400 font-thai mt-2">
              รางวัลจบ module: {module.reward.label}
            </p>
          )}
        </div>

        {/* Lesson list with vertical connector */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[1.4rem] top-4 bottom-4 w-0.5 bg-white/10 rounded-full" />

          <div className="flex flex-col gap-0">
            {lessons.map((lesson, index) => {
              const completed = isNodeCompleted(lesson.id);
              const unlocked = getIsLessonUnlocked(lesson, index);
              const isLoading = loadingLessonId === lesson.id;
              const isNext = unlocked && !completed &&
                (index === 0 || isNodeCompleted(lessons[index - 1]?.id));

              return (
                <div
                  key={lesson.id}
                  className="animate-in fade-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Connector dot */}
                  <div className="flex items-center gap-0 mb-1 mt-1">
                    <div className="w-[2.8rem] flex justify-center relative z-10">
                      <span className={cn(
                        "w-3 h-3 rounded-full border-2 transition-all",
                        completed
                          ? cn(colors.dot, "border-transparent shadow-md", colors.glow)
                          : isNext
                            ? cn(colors.dot, "border-transparent animate-pulse shadow-md", colors.glow)
                            : "bg-slate-800 border-white/20"
                      )} />
                    </div>
                  </div>

                  {/* Lesson card */}
                  <button
                    onClick={() => unlocked && !isLoading && onLessonClick(lesson)}
                    disabled={!unlocked || isLoading}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl p-3 border transition-all duration-200 ml-[2.8rem] mr-0",
                      "max-w-[calc(100%-2.8rem)]",
                      completed && "bg-green-500/10 border-green-500/30",
                      isNext && !completed && cn("bg-white/[0.06] border-white/20 shadow-lg", colors.glow),
                      unlocked && !completed && !isNext && "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-md",
                      !unlocked && "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed"
                    )}
                  >
                    {/* Number */}
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 border",
                        completed && "bg-green-500/20 border-green-500/40 text-green-400",
                        isNext && !completed && cn("bg-white/10 border-white/20 text-white"),
                        unlocked && !completed && !isNext && "bg-white/5 border-white/10 text-white/50",
                        !unlocked && "bg-white/[0.02] border-white/5 text-white/20"
                      )}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : !unlocked ? (
                        <Lock className="w-3 h-3" />
                      ) : isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        lesson.order
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left min-w-0">
                      <p className={cn(
                        "text-sm font-thai truncate",
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

                    {/* Action */}
                    {unlocked && !completed && (
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                        isNext ? cn("bg-gradient-to-r text-white shadow-md", colors.gradient) : "bg-white/10 text-white/40"
                      )}>
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module complete celebration */}
        {isModuleCompleted && (
          <div className="mt-6 text-center py-6 rounded-xl border border-amber-500/20 bg-amber-500/5 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none">
              {['🎊', '✨', '🌟', '💫', '⭐'].map((emoji, i) => (
                <span
                  key={i}
                  className="absolute animate-confetti text-lg"
                  style={{
                    left: `${15 + i * 18}%`,
                    animationDelay: `${i * 200}ms`,
                    bottom: '20%',
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <div className="text-4xl mb-2 animate-bounce">🎉</div>
            <p className="text-amber-300 font-bold font-thai text-lg">จบ Module แล้ว!</p>
            {module.reward && (
              <p className="text-sm text-amber-400/70 font-thai mt-1">
                ได้รับ: {module.reward.label}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
