import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readingCategories, getStoriesByCategory, ReadingStory } from "@/data/readingData";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import LevelSelector from "@/components/LevelSelector";
import LessonSkeleton from "@/components/LessonSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { LearnerLevel, QuizQuestion } from "@/types/lesson";
import { skillTreeModules } from "@/data/skillTreeData";
import { toast } from "sonner";

const levelLabel: Record<number, string> = { 1: "ง่าย", 2: "ปานกลาง", 3: "ยาก" };
const levelColor: Record<number, string> = { 1: "bg-emerald-100 text-emerald-700", 2: "bg-amber-100 text-amber-700", 3: "bg-red-100 text-red-700" };

interface DbLesson {
  id: string;
  level: number;
  lesson_order: number;
  title: string;
  title_thai: string;
  vocabulary: any[];
  article_sentences: any[][];
  article_translation: string;
  image_url: string | null;
  quiz: QuizQuestion[];
  module_id: string | null;
}

type MainTab = "stories" | "lessons";

const ReadingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, addExp, addCoins } = useProfile();

  // Main tab state
  const [mainTab, setMainTab] = useState<MainTab>("stories");

  // === Stories tab state ===
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<ReadingStory | null>(null);
  const [showStoryQuiz, setShowStoryQuiz] = useState(false);
  const [completedStoryIds, setCompletedStoryIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("completedStoryIds");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  // === Lessons tab state ===
  const [level, setLevel] = useState<LearnerLevel>((profile?.current_level || 1) as LearnerLevel);
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<DbLesson | null>(null);
  const [lessonActiveTab, setLessonActiveTab] = useState<"vocab" | "article">("vocab");

  // Load lessons when level changes (for lessons tab)
  useEffect(() => {
    if (mainTab !== "lessons") return;
    const loadLessons = async () => {
      setLessonsLoading(true);
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", level)
        .eq("is_published", true)
        .order("lesson_order", { ascending: true });

      if (data) {
        setLessons(data as unknown as DbLesson[]);
      }
      setLessonsLoading(false);
    };
    loadLessons();
  }, [level, mainTab]);

  // Load completed lessons
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          setCompletedLessonIds(new Set(data.map((d: any) => d.lesson_id)));
        }
      });
  }, [user]);

  const handleStoryQuizComplete = async (score: number) => {
    if (user && selectedStory) {
      const exp = score * 10 + 5;
      const coins = score * 5;
      await addExp(exp);
      await addCoins(coins);
      toast.success(`+${exp} EXP, +${coins} เหรียญ!`);

      // Mark story as completed
      setCompletedStoryIds(prev => {
        const next = new Set(prev);
        next.add(selectedStory.id);
        localStorage.setItem("completedStoryIds", JSON.stringify([...next]));
        return next;
      });
    }
  };

  const openLesson = (lesson: DbLesson) => {
    setSelectedLesson(lesson);
    setLessonActiveTab("vocab");
  };

  const handleStartLessonQuiz = () => {
    if (!selectedLesson) return;
    navigate("/quiz", {
      state: {
        questions: selectedLesson.quiz,
        lessonTitle: selectedLesson.title,
        lessonLevel: selectedLesson.level,
        lessonId: selectedLesson.id,
        lessonOrder: selectedLesson.lesson_order,
      },
    });
  };

  // ─── Story View ───────────────────────────────
  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedStory(null); setShowStoryQuiz(false); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", levelColor[selectedStory.level])}>
              {levelLabel[selectedStory.level]}
            </span>
            <span className="text-base font-bold font-thai truncate">{selectedStory.titleThai}</span>
          </div>
        </header>
        <main className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
          <VocabTable vocabulary={selectedStory.vocabulary} />
          <ArticleReader
            sentences={selectedStory.articleSentences}
            translation={selectedStory.articleTranslation}
            title={selectedStory.title}
            titleThai={selectedStory.titleThai}
          />
          {!showStoryQuiz ? (
            <div className="text-center py-2">
              <Button onClick={() => setShowStoryQuiz(true)} className="font-thai w-full max-w-xs bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg">
                📝 ทำแบบทดสอบ (+EXP & เหรียญ)
              </Button>
            </div>
          ) : (
            <QuizSection questions={selectedStory.quiz} onComplete={handleStoryQuizComplete} />
          )}
        </main>
      </div>
    );
  }

  // ─── Lesson Detail View ───────────────────────
  if (selectedLesson) {
    const isCompleted = completedLessonIds.has(selectedLesson.id);
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLesson(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div>
              <span className="font-bold font-thai text-sm">
                บทที่ {selectedLesson.lesson_order}
              </span>
              {isCompleted && <span className="ml-2 text-xs text-emerald-600">✅</span>}
            </div>
          </div>
        </header>

        <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
          <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-bold">{selectedLesson.title}</h2>
            <p className="text-sm text-muted-foreground font-thai">{selectedLesson.title_thai}</p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-white/60 rounded-xl p-1 border border-white/50">
            <button
              onClick={() => setLessonActiveTab("vocab")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold font-thai transition-all",
                lessonActiveTab === "vocab"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              📝 คำศัพท์
            </button>
            <button
              onClick={() => setLessonActiveTab("article")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold font-thai transition-all",
                lessonActiveTab === "article"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              📖 บทอ่าน
            </button>
          </div>

          {lessonActiveTab === "vocab" ? (
            <VocabTable vocabulary={selectedLesson.vocabulary} />
          ) : (
            <ArticleReader
              sentences={selectedLesson.article_sentences}
              translation={selectedLesson.article_translation}
              title={selectedLesson.title}
              titleThai={selectedLesson.title_thai}
              imageUrl={selectedLesson.image_url || undefined}
            />
          )}

          <div className="text-center pb-4">
            <Button
              onClick={handleStartLessonQuiz}
              className={cn(
                "font-thai w-full max-w-xs h-12 text-base font-bold shadow-lg",
                isCompleted
                  ? "bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50 shadow-purple-500/10"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-purple-500/25"
              )}
            >
              📝 {isCompleted ? "ทำแบบทดสอบอีกครั้ง" : "ทำแบบทดสอบ"}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ─── Category Stories View ────────────────────
  if (selectedCategory) {
    const cat = readingCategories.find(c => c.id === selectedCategory)!;
    const stories = getStoriesByCategory(selectedCategory);
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className="text-xl">{cat.icon}</span>
            <span className="text-base font-bold font-thai">{cat.nameThai}</span>
          </div>
        </header>
        <main className="px-4 py-5 max-w-3xl mx-auto">
          <div className="space-y-3">
            {stories.map((story) => {
              const isRead = completedStoryIds.has(story.id);
              return (
                <button
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className={cn(
                    "w-full text-left rounded-2xl border-2 p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.98] backdrop-blur-sm",
                    isRead
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-white/80 border-white/60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star key={s} className={cn("w-3 h-3", s <= story.level ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                        ))}
                      </div>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", levelColor[story.level])}>
                        {levelLabel[story.level]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold font-thai text-foreground">{story.titleThai}</h3>
                        {isRead && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            อ่านแล้ว
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-reading">{story.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{story.preview}</p>
                    </div>
                    <svg className="w-5 h-5 text-muted-foreground mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              );
            })}
            {stories.length === 0 && (
              <p className="text-center text-muted-foreground font-thai py-8">ยังไม่มีเรื่องในหมวดนี้</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ─── Main View (Tab Switcher + Content) ───────
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <h1 className="text-lg font-bold font-thai">📖 ฝึกอ่าน</h1>
          </div>

          {/* Main Tab Switcher */}
          <div className="flex gap-1 bg-white/60 rounded-xl p-1 border border-white/50">
            <button
              onClick={() => setMainTab("stories")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold font-thai transition-all",
                mainTab === "stories"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              📖 เรื่องสนุก
            </button>
            <button
              onClick={() => setMainTab("lessons")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold font-thai transition-all",
                mainTab === "lessons"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              📚 บทเรียน
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 max-w-3xl mx-auto">
        {mainTab === "stories" ? (
          /* ─── Stories Tab ─── */
          <>
            <p className="text-sm text-muted-foreground font-thai mb-4">เลือกหมวดที่สนใจ แต่ละเรื่องมีเนื้อหาสนุกๆ คำศัพท์ และ quiz</p>
            <div className="grid grid-cols-2 gap-3">
              {readingCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="group relative rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.97] text-left overflow-hidden"
                >
                  <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", cat.color)} />
                  <div className="relative">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 shadow-sm bg-gradient-to-br", cat.color)}>
                      {cat.icon}
                    </div>
                    <h3 className="font-bold font-thai text-sm">{cat.nameThai}</h3>
                    <p className="text-[11px] text-muted-foreground font-reading">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground font-thai mt-1">{cat.storiesCount} เรื่อง</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ─── Lessons Tab ─── */
          <>
            <div className="mb-4">
              <LevelSelector
                currentLevel={level}
                onLevelChange={(l) => { setLevel(l); setSelectedLesson(null); }}
                lessonsCompleted={profile?.lessons_completed || 0}
              />
            </div>

            {lessonsLoading ? (
              <LessonSkeleton />
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-thai">ยังไม่มีบทเรียนสำหรับระดับนี้</p>
              </div>
            ) : (() => {
              // Group lessons by module_id
              const grouped: Record<string, DbLesson[]> = {};
              const noModule: DbLesson[] = [];
              for (const lesson of lessons) {
                if (lesson.module_id) {
                  if (!grouped[lesson.module_id]) grouped[lesson.module_id] = [];
                  grouped[lesson.module_id].push(lesson);
                } else {
                  noModule.push(lesson);
                }
              }

              const sortedModuleIds = Object.keys(grouped).sort((a, b) => {
                const modA = skillTreeModules.find(m => m.id === a);
                const modB = skillTreeModules.find(m => m.id === b);
                return (modA?.order ?? 999) - (modB?.order ?? 999);
              });

              return (
                <div className="space-y-4">
                  {sortedModuleIds.map((moduleId) => {
                    const mod = skillTreeModules.find(m => m.id === moduleId);
                    const moduleLessons = grouped[moduleId].sort((a, b) => a.lesson_order - b.lesson_order);
                    const completedCount = moduleLessons.filter(l => completedLessonIds.has(l.id)).length;

                    return (
                      <div key={moduleId}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{mod?.icon || '📘'}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm leading-tight">
                              {mod?.nameThai || moduleId}
                            </h4>
                            <p className="text-[10px] text-muted-foreground">
                              {mod?.name || ''} · {completedCount}/{moduleLessons.length} บท
                            </p>
                          </div>
                          {completedCount === moduleLessons.length && moduleLessons.length > 0 && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">✅ จบแล้ว</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {moduleLessons.map((lesson) => {
                            const isCompleted = completedLessonIds.has(lesson.id);
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => openLesson(lesson)}
                                className={cn(
                                  "text-left rounded-xl border-2 p-3 transition-all hover:shadow-md active:scale-[0.98]",
                                  isCompleted
                                    ? "bg-emerald-50/80 border-emerald-200"
                                    : "bg-white/80 border-white/60 hover:border-purple-200"
                                )}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-xs text-muted-foreground font-thai">บทที่ {lesson.lesson_order}</span>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-purple-300" />
                                  )}
                                </div>
                                <h4 className="font-bold text-sm leading-tight">{lesson.title}</h4>
                                <p className="text-[10px] text-muted-foreground font-thai mt-0.5 truncate">{lesson.title_thai}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {noModule.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📘</span>
                        <h4 className="font-bold text-sm font-thai">บทเรียนทั่วไป</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {noModule.map((lesson) => {
                          const isCompleted = completedLessonIds.has(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => openLesson(lesson)}
                              className={cn(
                                "text-left rounded-xl border-2 p-3 transition-all hover:shadow-md active:scale-[0.98]",
                                isCompleted
                                  ? "bg-emerald-50/80 border-emerald-200"
                                  : "bg-white/80 border-white/60 hover:border-purple-200"
                              )}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <span className="text-xs text-muted-foreground font-thai">บทที่ {lesson.lesson_order}</span>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-purple-300" />
                                )}
                              </div>
                              <h4 className="font-bold text-sm leading-tight">{lesson.title}</h4>
                              <p className="text-[10px] text-muted-foreground font-thai mt-0.5 truncate">{lesson.title_thai}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </main>
    </div>
  );
};

export default ReadingPage;
