import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import LevelSelector from "@/components/LevelSelector";
import { LearnerLevel, QuizQuestion } from "@/types/lesson";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import LessonSkeleton from "@/components/LessonSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { sampleLesson } from "@/data/sampleLesson";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/utils/analytics";
import defaultLessonImage from "@/assets/lesson-default.jpg";

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
}

const activities = [
  { path: "/path", icon: "🗺️", title: "เส้นทางการเรียน", subtitle: "เรียนตามลำดับ ปลดล็อคทีละด่าน", color: "from-emerald-400 to-green-500" },
  { path: "/reading", icon: "📖", title: "ฝึกอ่าน", subtitle: "เรื่องสนุกๆ แยกหมวด พร้อมรูปภาพ", color: "from-blue-400 to-indigo-500" },
  { path: "/conversation", icon: "💬", title: "ฝึกบทสนทนา", subtitle: "จำลองสถานการณ์จริง", color: "from-pink-400 to-rose-500" },
  { path: "/pronunciation", icon: "🗣️", title: "ฝึกออกเสียง", subtitle: "เน้นเสียงที่คนไทยออกยาก", color: "from-orange-400 to-amber-500" },
  { path: "/news", icon: "📰", title: "ข่าวง่ายรายวัน", subtitle: "อ่านข่าวจริง เขียนใหม่ให้เข้าใจง่าย", color: "from-purple-400 to-violet-500" },
  { path: "/library", icon: "📚", title: "คลังนิทาน", subtitle: "นิทานอีสปสนุกๆ พร้อม Quiz", color: "from-teal-400 to-cyan-500" },
];

type ViewMode = "hub" | "lesson";

const LearnPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();

  const [viewMode, setViewMode] = useState<ViewMode>("hub");
  const [level, setLevel] = useState<LearnerLevel>((profile?.current_level || 1) as LearnerLevel);
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Lesson detail state
  const [selectedLesson, setSelectedLesson] = useState<DbLesson | null>(null);
  const [activeTab, setActiveTab] = useState<"vocab" | "article">("vocab");

  useEffect(() => {
    trackEvent("page_view", { page: "learn" });
  }, []);

  // Handle incoming navigation state (from home "continue learning" card)
  useEffect(() => {
    const navState = location.state as { lessonId?: string } | null;
    if (navState?.lessonId) {
      window.history.replaceState({}, "");
      // Will be handled after lessons load
    }
  }, [location.state]);

  // Load lessons list
  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", level)
        .eq("is_published", true)
        .order("lesson_order", { ascending: true });

      if (data) {
        setLessons(data as unknown as DbLesson[]);
      }
      setLoading(false);
    };
    loadLessons();
  }, [level]);

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

  // Handle navigation state after lessons load
  useEffect(() => {
    const navState = location.state as { lessonId?: string } | null;
    if (navState?.lessonId && lessons.length > 0) {
      const target = lessons.find(l => l.id === navState.lessonId);
      if (target) {
        setSelectedLesson(target);
        setViewMode("lesson");
      }
    }
  }, [lessons, location.state]);

  const handleLevelChange = (newLevel: LearnerLevel) => {
    setLevel(newLevel);
    setViewMode("hub");
    setSelectedLesson(null);
  };

  const openLesson = (lesson: DbLesson) => {
    setSelectedLesson(lesson);
    setViewMode("lesson");
    setActiveTab("vocab");
    trackEvent("lesson_open", { lessonId: lesson.id, level: lesson.level });
  };

  const handleStartQuiz = () => {
    if (!selectedLesson) return;
    trackEvent("quiz_start", { lessonId: selectedLesson.id, level: selectedLesson.level });
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

  const goToNextLesson = () => {
    if (!selectedLesson) return;
    const idx = lessons.findIndex(l => l.id === selectedLesson.id);
    if (idx < lessons.length - 1) {
      openLesson(lessons[idx + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (!selectedLesson) return;
    const idx = lessons.findIndex(l => l.id === selectedLesson.id);
    if (idx > 0) {
      openLesson(lessons[idx - 1]);
    }
  };

  // === LESSON DETAIL VIEW ===
  if (viewMode === "lesson" && selectedLesson) {
    const lesson = {
      title: selectedLesson.title,
      titleThai: selectedLesson.title_thai,
      level: selectedLesson.level,
      vocabulary: selectedLesson.vocabulary,
      articleSentences: selectedLesson.article_sentences,
      articleTranslation: selectedLesson.article_translation,
    };
    const lessonImage = selectedLesson.image_url || defaultLessonImage;
    const isCompleted = completedLessonIds.has(selectedLesson.id);
    const currentIdx = lessons.findIndex(l => l.id === selectedLesson.id);

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setViewMode("hub"); setSelectedLesson(null); }}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <span className="font-bold font-thai text-sm">
                  บทที่ {selectedLesson.lesson_order}
                </span>
                {isCompleted && <span className="ml-2 text-xs text-emerald-600">✅</span>}
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentIdx <= 0} onClick={goToPrevLesson}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentIdx >= lessons.length - 1} onClick={goToNextLesson}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
          {/* Lesson title card */}
          <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-bold">{selectedLesson.title}</h2>
            <p className="text-sm text-muted-foreground font-thai">{selectedLesson.title_thai}</p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-white/60 rounded-xl p-1 border border-white/50">
            <button
              onClick={() => setActiveTab("vocab")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold font-thai transition-all",
                activeTab === "vocab"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              📝 คำศัพท์
            </button>
            <button
              onClick={() => setActiveTab("article")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold font-thai transition-all",
                activeTab === "article"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              📖 บทอ่าน
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "vocab" ? (
            <VocabTable vocabulary={lesson.vocabulary} />
          ) : (
            <ArticleReader
              sentences={lesson.articleSentences}
              translation={lesson.articleTranslation}
              title={lesson.title}
              titleThai={lesson.titleThai}
              imageUrl={lessonImage || undefined}
            />
          )}

          {/* Quiz CTA */}
          <div className="text-center pb-4">
            <Button
              onClick={handleStartQuiz}
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

  // === LEARNING HUB VIEW ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold font-thai">
            📚 เรียน<span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">รู้</span>
          </h1>
          <div className="mt-2">
            <LevelSelector currentLevel={level} onLevelChange={handleLevelChange} lessonsCompleted={profile?.lessons_completed || 0} />
          </div>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* === Lesson List === */}
        <div>
          <h3 className="text-sm font-bold font-thai text-foreground mb-2">
            📖 บทเรียน Level {level}
          </h3>
          {loading ? (
            <LessonSkeleton />
          ) : lessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-thai">ยังไม่มีบทเรียนสำหรับระดับนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {lessons.map((lesson, idx) => {
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
          )}
        </div>

        {/* === Activities Collection === */}
        <div>
          <h3 className="text-sm font-bold font-thai text-foreground mb-2">
            🎯 กิจกรรมอื่นๆ
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {activities.map((act) => (
              <button
                key={act.path}
                onClick={() => navigate(act.path)}
                className="group w-full text-left rounded-xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
              >
                <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b", act.color)} />
                <div className="flex items-center gap-3 pl-2">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm bg-gradient-to-br", act.color)}>
                    <span>{act.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold font-thai text-sm">{act.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-thai truncate">{act.subtitle}</p>
                  </div>
                  <div className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
