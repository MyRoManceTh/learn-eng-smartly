import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import LevelSelector from "@/components/LevelSelector";
import { sampleLesson, sampleQuiz } from "@/data/sampleLesson";
import { LearnerLevel, QuizQuestion } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, Zap, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import LessonSkeleton from "@/components/LessonSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
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

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [level, setLevel] = useState<LearnerLevel>(1);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lesson from DB
  const [dbLesson, setDbLesson] = useState<DbLesson | null>(null);
  const [currentLessonOrder, setCurrentLessonOrder] = useState(1);
  const [maxLessonOrder, setMaxLessonOrder] = useState(1);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  // Load profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("current_level, lessons_completed, total_exp, current_streak")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setLevel(data.current_level as LearnerLevel);
          setLessonsCompleted(data.lessons_completed);
          const d = data as any;
          setTotalExp(d.total_exp || 0);
          setCurrentStreak(d.current_streak || 0);
        }
      });
  }, [user]);

  // Load completed lessons for this user
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

  // Fetch lesson from DB by level + order
  useEffect(() => {
    fetchLesson(level, currentLessonOrder);
  }, [level, currentLessonOrder]);

  // Find max lesson order for navigation
  useEffect(() => {
    supabase
      .from("lessons")
      .select("lesson_order")
      .eq("level", level)
      .eq("is_published", true)
      .order("lesson_order", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMaxLessonOrder((data[0] as any).lesson_order);
        } else {
          setMaxLessonOrder(1);
        }
      });
  }, [level, dbLesson]);

  // Auto-advance when coming back from quiz
  useEffect(() => {
    const navState = location.state as { generateNew?: boolean } | null;
    if (navState?.generateNew) {
      window.history.replaceState({}, "");
      // Move to next lesson
      setCurrentLessonOrder((prev) => prev + 1);
      // Reload profile data
      if (user) {
        supabase
          .from("profiles")
          .select("current_level, lessons_completed, total_exp, current_streak")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setLevel(data.current_level as LearnerLevel);
              setLessonsCompleted(data.lessons_completed);
              const d = data as any;
              setTotalExp(d.total_exp || 0);
              setCurrentStreak(d.current_streak || 0);
            }
          });
        supabase
          .from("user_lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .then(({ data }) => {
            if (data) {
              setCompletedLessonIds(new Set(data.map((d: any) => d.lesson_id)));
            }
          });
      }
    }
  }, [location.state]);

  const fetchLesson = async (lvl: number, order: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("level", lvl)
      .eq("lesson_order", order)
      .eq("is_published", true)
      .single();

    if (data) {
      setDbLesson(data as unknown as DbLesson);
    } else {
      // No lesson found at this order, stay on current or show message
      if (order > 1) {
        toast("🎉 ยังไม่มีบทเรียนถัดไป กำลังสร้างให้...", { duration: 3000 });
        setCurrentLessonOrder(order - 1);
      } else {
        setDbLesson(null);
      }
    }
    setLoading(false);
  };

  const handleLevelChange = (newLevel: LearnerLevel) => {
    setLevel(newLevel);
    setCurrentLessonOrder(1);
  };

  const isCurrentLessonCompleted = dbLesson ? completedLessonIds.has(dbLesson.id) : false;

  const handleStartQuiz = () => {
    if (!dbLesson) return;
    navigate("/quiz", {
      state: {
        questions: dbLesson.quiz,
        lessonTitle: dbLesson.title,
        lessonLevel: dbLesson.level,
        lessonId: dbLesson.id,
        lessonOrder: dbLesson.lesson_order,
      },
    });
  };

  // Use dbLesson data or fallback to sample
  const lesson = dbLesson
    ? {
        title: dbLesson.title,
        titleThai: dbLesson.title_thai,
        level: dbLesson.level,
        vocabulary: dbLesson.vocabulary,
        articleSentences: dbLesson.article_sentences,
        articleTranslation: dbLesson.article_translation,
      }
    : sampleLesson;

  const lessonImage = dbLesson?.image_url || defaultLessonImage;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-foreground font-thai">
              📖 อ่านเรียน<span className="text-primary">English</span>
            </h1>
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-destructive/10 rounded-full px-2.5 py-1">
                    <Flame className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-xs font-bold text-destructive">{currentStreak}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-accent/50 rounded-full px-2.5 py-1">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">{totalExp}</span>
                  </div>
                </div>
              )}
              {user ? (
                <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-thai text-xs h-8">
                  <LogIn className="w-4 h-4 mr-1" /> เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
          <LevelSelector currentLevel={level} onLevelChange={handleLevelChange} lessonsCompleted={lessonsCompleted} />
        </div>
      </header>

      <main className="px-4 py-4">
        {loading ? (
          <LessonSkeleton />
        ) : !dbLesson ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-thai text-lg">ยังไม่มีบทเรียนสำหรับระดับนี้</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lesson navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentLessonOrder <= 1}
                onClick={() => setCurrentLessonOrder((p) => p - 1)}
                className="font-thai"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> ก่อนหน้า
              </Button>
              <div className="text-center">
                <span className="text-sm font-bold font-thai text-foreground">
                  บทที่ {currentLessonOrder}
                </span>
                {isCurrentLessonCompleted && (
                  <span className="ml-2 text-xs text-primary font-thai">✅ เรียนแล้ว</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentLessonOrder >= maxLessonOrder}
                onClick={() => setCurrentLessonOrder((p) => p + 1)}
                className="font-thai"
              >
                ถัดไป <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Lesson content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3 order-1">
                <ArticleReader
                  sentences={lesson.articleSentences}
                  translation={lesson.articleTranslation}
                  title={lesson.title}
                  titleThai={lesson.titleThai}
                  imageUrl={lessonImage || undefined}
                />
              </div>
              <div className="lg:col-span-2 order-2">
                <VocabTable vocabulary={lesson.vocabulary} />
              </div>
            </div>

            {/* Quiz button */}
            <div className="text-center pb-4">
              <Button
                onClick={handleStartQuiz}
                variant={isCurrentLessonCompleted ? "outline" : "default"}
                className="font-thai w-full max-w-xs h-11"
              >
                📝 {isCurrentLessonCompleted ? "ทำแบบทดสอบอีกครั้ง" : "ทำแบบทดสอบ"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
