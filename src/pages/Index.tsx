import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import LevelSelector from "@/components/LevelSelector";
import { sampleLesson, sampleQuiz } from "@/data/sampleLesson";
import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, LogIn, Zap } from "lucide-react";
import LessonSkeleton from "@/components/LessonSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import defaultLessonImage from "@/assets/lesson-default.jpg";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [level, setLevel] = useState<LearnerLevel>(1);
  const [lesson, setLesson] = useState(sampleLesson);
  const [quiz, setQuiz] = useState(sampleQuiz);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lessonImage, setLessonImage] = useState<string | null>(defaultLessonImage);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("current_level, lessons_completed, total_exp")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setLevel(data.current_level as LearnerLevel);
          setLessonsCompleted(data.lessons_completed);
          setTotalExp((data as any).total_exp || 0);
        }
      });
  }, [user]);

  // Auto-generate new lesson when coming back from quiz
  useEffect(() => {
    const navState = location.state as { generateNew?: boolean } | null;
    if (navState?.generateNew) {
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, "");
      generateNewLesson();
    }
  }, [location.state]);

  const generateNewLesson = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: { level, lessonsCompleted },
      });
      if (error) throw error;
      if (data.lesson) {
        setLesson(data.lesson);
        setQuiz(data.quiz || sampleQuiz);
        setLessonImage(data.imageUrl || null);
        toast.success("สร้างบทเรียนใหม่แล้ว!");
      }
    } catch (err) {
      console.error("Error generating lesson:", err);
      toast.error("ไม่สามารถสร้างบทเรียนได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, [level, lessonsCompleted]);

  const handleStartQuiz = () => {
    navigate("/quiz", {
      state: {
        questions: quiz,
        lessonTitle: lesson.title,
        lessonLevel: lesson.level,
      },
    });
  };
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Mobile-friendly header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-foreground font-thai">
              📖 อ่านเรียน<span className="text-primary">English</span>
            </h1>
            <div className="flex items-center gap-1">
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
          <LevelSelector currentLevel={level} onLevelChange={setLevel} lessonsCompleted={lessonsCompleted} />
        </div>
      </header>

      <main className="px-4 py-4">
        {loading ? (
          <LessonSkeleton />
        ) : (
          <div className="space-y-4">
            {/* Generate button - prominent on mobile */}
            <Button
              onClick={generateNewLesson}
              disabled={loading}
              className="w-full font-thai h-12 text-base"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              สร้างบทเรียนใหม่
            </Button>

            {/* Stacked layout for mobile, side-by-side for desktop */}
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

            {/* Quiz */}
            {!showQuiz ? (
              <div className="text-center pb-4">
                <Button onClick={() => setShowQuiz(true)} variant="outline" className="font-thai w-full max-w-xs h-11">
                  📝 ทำแบบทดสอบ
                </Button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto pb-4">
                <QuizSection questions={quiz} onComplete={handleQuizComplete} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
