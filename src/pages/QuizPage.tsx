import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QuizQuestion } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Trophy, Zap, Coins } from "lucide-react";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sampleQuiz } from "@/data/sampleLesson";
import { useDailyMissions } from "@/hooks/useDailyMissions";
import { useChallenges } from "@/hooks/useChallenges";
import { useProfile } from "@/hooks/useProfile";
import { trackEvent } from "@/utils/analytics";
import ChallengeResult from "@/components/social/ChallengeResult";

interface QuizLocationState {
  questions: QuizQuestion[];
  lessonTitle: string;
  lessonLevel: number;
  lessonId?: string;
  lessonOrder?: number;
  challengeId?: string;
  isChallenge?: boolean;
  opponentName?: string;
  opponentEvolution?: number;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { incrementMission } = useDailyMissions();
  const { submitScore: submitChallengeScore, sendChallenge } = useChallenges();
  const { profile } = useProfile();

  const state = location.state as QuizLocationState | null;
  const questions = state?.questions || sampleQuiz;
  const lessonTitle = state?.lessonTitle || "บทเรียน";
  const lessonLevel = state?.lessonLevel || 1;
  const lessonId = state?.lessonId;
  const lessonOrder = state?.lessonOrder || 1;
  const challengeId = state?.challengeId;
  const isChallenge = state?.isChallenge || false;
  const opponentName = state?.opponentName || "เพื่อน";
  const opponentEvolution = state?.opponentEvolution || 1;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [earnedExp, setEarnedExp] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);

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
        colors: ["#7c3aed", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"],
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
      const coins = score * 5;
      setEarnedExp(exp);
      setEarnedCoins(coins);

      if (user) {
        // Get current profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_exp, lessons_completed, current_level, current_streak, longest_streak, last_activity_date, coins")
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

        const saveOps = [
          supabase.from("learning_history").insert({
            user_id: user.id,
            lesson_title: lessonTitle,
            lesson_level: lessonLevel,
            quiz_score: score,
            quiz_total: questions.length,
          }).then(),
          supabase.from("profiles").update({
            total_exp: newExp,
            coins: ((profileData as any)?.coins || 0) + coins,
            lessons_completed: newCompleted,
            current_level: newLevel,
            current_streak: newStreak,
            longest_streak: newLongest,
            last_activity_date: today,
          } as any).eq("user_id", user.id).then(),
        ];

        // Save lesson progress
        if (lessonId) {
          saveOps.push(
            supabase.from("user_lesson_progress").upsert({
              user_id: user.id,
              lesson_id: lessonId,
              quiz_score: score,
              quiz_total: questions.length,
            } as any, { onConflict: "user_id,lesson_id" }).then()
          );
        }

        await Promise.all(saveOps);

        // Track missions
        incrementMission('complete_lesson', 1);
        incrementMission('answer_quiz', questions.length);
        trackEvent('quiz_complete', { score, total: questions.length, lessonTitle, level: lessonLevel });

        // Submit challenge score if this is a challenge
        if (challengeId) {
          await submitChallengeScore(challengeId, score, questions.length);
        }

        // Trigger next lesson generation in background
        supabase.functions.invoke("generate-lesson", {
          body: { action: "trigger-next", level: lessonLevel, lessonOrder },
        }).catch((e) => console.error("Trigger next lesson error:", e));
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

  if (finished && isChallenge && challengeId) {
    return (
      <ChallengeResult
        myScore={score}
        myTotal={questions.length}
        opponentScore={null}
        opponentTotal={null}
        opponentName={opponentName}
        myName={profile?.display_name || "คุณ"}
        myEvolution={profile?.evolution_stage || 1}
        opponentEvolution={opponentEvolution}
        challengeId={challengeId}
        earnedExp={earnedExp}
        earnedCoins={earnedCoins}
      />
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-amber-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="rounded-3xl border border-white/50 bg-white/90 backdrop-blur-xl p-8 space-y-4 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
              <Trophy className="w-10 h-10 text-white" />
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

            {/* EXP + Coins earned */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl py-3 px-4 shadow-sm">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-lg text-purple-700">+{earnedExp} EXP</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl py-3 px-4 shadow-sm">
                <span className="text-xl">🪙</span>
                <span className="font-bold text-lg text-amber-700">+{earnedCoins}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleNextLesson}
            className="w-full h-12 text-base font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25"
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold font-thai">
              {isChallenge ? "⚔️ Challenge Quiz" : "📝 แบบทดสอบ"}
            </h1>
            <span className="text-sm text-muted-foreground font-thai">
              ข้อ {currentQ + 1}/{questions.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2.5 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQ + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div
          className={`rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-sm p-6 shadow-xl shadow-purple-500/10 transition-transform ${
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
            <Button onClick={handleNext} className="w-full font-thai h-12 text-base bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25">
              {currentQ + 1 >= questions.length ? "ดูผลคะแนน →" : "ข้อถัดไป →"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
