import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QuizQuestion } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Trophy, Zap } from "lucide-react";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sampleQuiz } from "@/data/sampleLesson";

interface QuizLocationState {
  questions: QuizQuestion[];
  lessonTitle: string;
  lessonLevel: number;
  lessonId?: string;
  lessonOrder?: number;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const state = location.state as QuizLocationState | null;
  const questions = state?.questions || sampleQuiz;
  const lessonTitle = state?.lessonTitle || "บทเรียน";
  const lessonLevel = state?.lessonLevel || 1;
  const lessonId = state?.lessonId;
  const lessonOrder = state?.lessonOrder || 1;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [earnedExp, setEarnedExp] = useState(0);

  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.correctIndex) {
      setScore((s) => s + 1);
      playCorrect();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"],
      });
    } else {
      playWrong();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleNext = async () => {
    if (currentQ + 1 >= questions.length) {
      const finalScore = score + (selected === question.correctIndex ? 0 : 0);
      // Score was already incremented in handleSelect
      setFinished(true);
      playComplete();
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 } }), 300);

      // Calculate EXP: 10 per correct + 5 bonus for completion
      const exp = score * 10 + 5;
      setEarnedExp(exp);

      if (user) {
        // Get current profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_exp, lessons_completed, current_level, current_streak, longest_streak, last_activity_date")
          .eq("user_id", user.id)
          .single();

        const profileData = profile as any;
        const newExp = (profileData?.total_exp || 0) + exp;
        const newCompleted = (profileData?.lessons_completed || 0) + 1;
        let newLevel = profileData?.current_level || 1;

        // Streak calculation
        const today = new Date().toISOString().split("T")[0];
        const lastDate = profileData?.last_activity_date;
        let newStreak = profileData?.current_streak || 0;

        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastDate === yesterdayStr) {
            newStreak += 1; // consecutive day
          } else if (!lastDate) {
            newStreak = 1; // first time
          } else {
            newStreak = 1; // streak broken, restart
          }
        }
        // If lastDate === today, streak stays the same (already counted today)

        const newLongest = Math.max(profileData?.longest_streak || 0, newStreak);

        // Level up every 3 lessons if score is good
        if (score >= Math.ceil(questions.length / 2) && newCompleted % 3 === 0 && newLevel < 5) {
          newLevel = Math.min(5, newLevel + 1);
        }

        await Promise.all([
          supabase.from("learning_history").insert({
            user_id: user.id,
            lesson_title: lessonTitle,
            lesson_level: lessonLevel,
            quiz_score: score,
            quiz_total: questions.length,
          }),
          supabase.from("profiles").update({
            total_exp: newExp,
            lessons_completed: newCompleted,
            current_level: newLevel,
            current_streak: newStreak,
            longest_streak: newLongest,
            last_activity_date: today,
          } as any).eq("user_id", user.id),
        ]);
      }
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleNextLesson = () => {
    navigate("/", { state: { generateNew: true } });
  };

  if (!state && !questions.length) {
    navigate("/");
    return null;
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="rounded-2xl border border-border bg-card p-8 space-y-4 shadow-lg">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-thai">🎉 ทำแบบทดสอบเสร็จแล้ว!</h2>
            <p className="text-4xl font-bold text-primary">
              {score}/{questions.length}
            </p>
            <p className="text-muted-foreground font-thai">
              {score === questions.length
                ? "เยี่ยมมาก! คุณตอบถูกทุกข้อ"
                : score >= questions.length / 2
                ? "ดีมาก! ลองทบทวนคำที่ผิดอีกครั้ง"
                : "ลองทบทวนบทเรียนอีกครั้งนะ"}
            </p>

            {/* EXP earned */}
            <div className="flex items-center justify-center gap-2 bg-accent/50 rounded-xl py-3 px-4">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg text-primary">+{earnedExp} EXP</span>
            </div>
          </div>

          <Button
            onClick={handleNextLesson}
            className="w-full h-12 text-base font-thai"
            size="lg"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            บทเรียนถัดไป
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full font-thai"
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold font-thai">📝 แบบทดสอบ</h1>
            <span className="text-sm text-muted-foreground font-thai">
              ข้อ {currentQ + 1}/{questions.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQ + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div
          className={`rounded-xl border border-border bg-card p-6 transition-transform ${
            shaking ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
        >
          <p className="text-lg font-thai mb-6 leading-relaxed">{question.question}</p>

          <div className="space-y-3 mb-6">
            {question.options.map((opt, idx) => {
              let variant: "outline" | "default" | "destructive" = "outline";
              let icon = null;

              if (showResult) {
                if (idx === question.correctIndex) {
                  variant = "default";
                  icon = <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
                } else if (idx === selected) {
                  variant = "destructive";
                  icon = <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
                }
              }

              return (
                <Button
                  key={idx}
                  variant={variant}
                  className="w-full justify-start text-left font-thai h-auto py-4 px-4 text-base"
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                >
                  {icon}
                  {opt}
                </Button>
              );
            })}
          </div>

          {showResult && (
            <Button onClick={handleNext} className="w-full font-thai h-12 text-base">
              {currentQ + 1 >= questions.length ? "ดูผลคะแนน →" : "ข้อถัดไป →"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
