import { useState, useCallback } from "react";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import LevelSelector from "@/components/LevelSelector";
import { sampleLesson, sampleQuiz } from "@/data/sampleLesson";
import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import defaultLessonImage from "@/assets/lesson-default.jpg";

const Index = () => {
  const [level, setLevel] = useState<LearnerLevel>(1);
  const [lesson, setLesson] = useState(sampleLesson);
  const [quiz, setQuiz] = useState(sampleQuiz);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessonImage, setLessonImage] = useState<string | null>(null);

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

  const handleQuizComplete = (score: number) => {
    setLessonsCompleted((c) => c + 1);
    if (score >= 3 && lessonsCompleted > 0 && lessonsCompleted % 3 === 0 && level < 5) {
      setLevel((l) => Math.min(5, l + 1) as LearnerLevel);
      toast.success("🎉 เลื่อนระดับแล้ว!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground font-thai">
                อ่านเรียน<span className="text-primary">English</span>
              </h1>
            </div>
            <Button
              onClick={generateNewLesson}
              disabled={loading}
              size="sm"
              className="font-thai"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              สร้างบทเรียนใหม่
            </Button>
          </div>
          <LevelSelector
            currentLevel={level}
            onLevelChange={setLevel}
            lessonsCompleted={lessonsCompleted}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="font-thai">กำลังสร้างบทเรียนใหม่...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              {/* Left: Vocab */}
              <div className="lg:col-span-2">
                <VocabTable vocabulary={lesson.vocabulary} />
              </div>

              {/* Right: Article */}
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

            {/* Quiz section */}
            {!showQuiz ? (
              <div className="text-center">
                <Button
                  onClick={() => setShowQuiz(true)}
                  variant="outline"
                  className="font-thai"
                >
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
