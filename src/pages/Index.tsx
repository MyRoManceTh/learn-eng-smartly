import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import LevelSelector from "@/components/LevelSelector";
import FableLibrary from "@/components/FableLibrary";
import { sampleLesson, sampleQuiz } from "@/data/sampleLesson";
import { FableEntry } from "@/data/aesopFables";
import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, BookOpen, User, LogOut, LogIn, Library, Route } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import defaultLessonImage from "@/assets/lesson-default.jpg";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [level, setLevel] = useState<LearnerLevel>(1);
  const [lesson, setLesson] = useState(sampleLesson);
  const [quiz, setQuiz] = useState(sampleQuiz);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessonImage, setLessonImage] = useState<string | null>(defaultLessonImage);
  const [showLibrary, setShowLibrary] = useState(false);

  // Load profile data when logged in
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("current_level, lessons_completed")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setLevel(data.current_level as LearnerLevel);
          setLessonsCompleted(data.lessons_completed);
        }
      });
  }, [user]);

  const generateNewLesson = useCallback(async () => {
    setLoading(true);
    setShowQuiz(false);
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

  const handleSelectFable = (entry: FableEntry) => {
    setLesson(entry.lesson);
    setQuiz(entry.quiz);
    setLessonImage(null);
    setShowQuiz(false);
    setShowLibrary(false);
  };

  const handleQuizComplete = async (score: number) => {
    const newCompleted = lessonsCompleted + 1;
    setLessonsCompleted(newCompleted);

    let newLevel = level;
    if (score >= 3 && newCompleted > 0 && newCompleted % 3 === 0 && level < 5) {
      newLevel = Math.min(5, level + 1) as LearnerLevel;
      setLevel(newLevel);
      toast.success("🎉 เลื่อนระดับแล้ว!");
    }

    // Save to DB if logged in
    if (user) {
      await Promise.all([
        supabase.from("learning_history").insert({
          user_id: user.id,
          lesson_title: lesson.title,
          lesson_level: lesson.level,
          quiz_score: score,
          quiz_total: quiz.length,
        }),
        supabase.from("profiles").update({
          current_level: newLevel,
          lessons_completed: newCompleted,
        }).eq("user_id", user.id),
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground font-thai">
                อ่านเรียน<span className="text-primary">English</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/path")}
                variant="secondary"
                size="sm"
                className="font-thai"
              >
                <Route className="w-4 h-4 mr-2" />
                เส้นทางเรียน
              </Button>
              <Button
                onClick={() => setShowLibrary(!showLibrary)}
                variant={showLibrary ? "default" : "secondary"}
                size="sm"
                className="font-thai"
              >
                <Library className="w-4 h-4 mr-2" />
                คลังนิทาน
              </Button>
              <Button onClick={generateNewLesson} disabled={loading} size="sm" className="font-thai">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                สร้างบทเรียนใหม่
              </Button>
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate("/profile")} className="font-thai">
                    <User className="w-4 h-4 mr-1" /> โปรไฟล์
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="font-thai">
                  <LogIn className="w-4 h-4 mr-1" /> เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
          <LevelSelector currentLevel={level} onLevelChange={setLevel} lessonsCompleted={lessonsCompleted} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showLibrary ? (
          <FableLibrary currentLevel={level} onSelectFable={handleSelectFable} />
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="font-thai">กำลังสร้างบทเรียนใหม่...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              <div className="lg:col-span-2">
                <VocabTable vocabulary={lesson.vocabulary} />
              </div>
              <div className="lg:col-span-3">
                <ArticleReader
                  sentences={lesson.articleSentences}
                  translation={lesson.articleTranslation}
                  title={lesson.title}
                  titleThai={lesson.titleThai}
                  imageUrl={lessonImage || undefined}
                />
              </div>
            </div>

            {!showQuiz ? (
              <div className="text-center">
                <Button onClick={() => setShowQuiz(true)} variant="outline" className="font-thai">
                  📝 ทำแบบทดสอบ
                </Button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <QuizSection questions={quiz} onComplete={handleQuizComplete} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
