import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { placementQuestions, levelInfo } from "@/data/placementTestQuestions";
import { levelLabels } from "@/data/skillTreeData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle, XCircle, Zap } from "lucide-react";

const QUESTION_COUNT = 20;
const PASS_THRESHOLD = 0.7; // 70% to advance

function getSkipQuestions(targetLevel: number) {
  const capped = Math.max(1, Math.min(5, targetLevel));
  const pool = placementQuestions.filter((q) => q.difficulty === capped);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT);
}

type Phase = "intro" | "quiz" | "result";

const SkipLevelTestPage = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLevel: number = (location.state as any)?.fromLevel ?? (profile as any)?.placement_level ?? 1;
  const targetLevel = Math.min(currentLevel + 1, 5);

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions] = useState(() => getSkipQuestions(targetLevel));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [passed, setPassed] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;

  const handleAnswer = useCallback(
    async (optionIndex: number) => {
      if (answered) return;
      setSelectedOption(optionIndex);
      setAnswered(true);

      const isCorrect = optionIndex === currentQuestion.correctIndex;
      const newCorrect = correctCount + (isCorrect ? 1 : 0);

      if (currentIdx + 1 >= totalQuestions) {
        // Test complete
        const ratio = newCorrect / totalQuestions;
        const didPass = ratio >= PASS_THRESHOLD;
        setPassed(didPass);
        setCorrectCount(newCorrect);

        if (didPass && user) {
          setSaving(true);
          try {
            await supabase
              .from("profiles")
              .update({
                placement_level: targetLevel,
                current_level: targetLevel,
              } as any)
              .eq("user_id", user.id);
            await updateProfile({ placement_level: targetLevel, current_level: targetLevel } as any);
            toast.success(`🎉 ยินดีด้วย! ขึ้น ${levelLabels[targetLevel]?.cefr} แล้ว!`);
          } catch {
            toast.error("บันทึกไม่สำเร็จ กรุณาลองใหม่");
          } finally {
            setSaving(false);
          }
        }

        setTimeout(() => setPhase("result"), 800);
      } else {
        setCorrectCount(newCorrect);
        setTimeout(() => {
          setCurrentIdx((i) => i + 1);
          setSelectedOption(null);
          setAnswered(false);
        }, 600);
      }
    },
    [answered, currentIdx, currentQuestion, correctCount, totalQuestions, targetLevel, user, updateProfile]
  );

  const currentLevelInfo = levelLabels[currentLevel];
  const targetLevelInfo = levelLabels[targetLevel];
  const targetLevelMeta = (levelInfo as any)[targetLevel];

  // ─── Intro screen ────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 flex flex-col items-center justify-center p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="max-w-sm w-full space-y-6 text-center">
          <div className="flex items-center justify-center gap-4 text-5xl">
            <span>{currentLevelInfo?.icon}</span>
            <span className="text-white/30 text-2xl">→</span>
            <span className="animate-float-gentle" style={{ display: "inline-block" }}>
              {targetLevelInfo?.icon}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white font-thai">ทดสอบข้ามระดับ</h1>
            <p className="text-sm text-white/50 font-thai mt-1">
              {currentLevelInfo?.cefr} → {targetLevelInfo?.cefr}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 space-y-2 text-left">
            <p className="text-xs text-cyan-300 font-bold font-thai">กฎของแบบทดสอบ:</p>
            <ul className="space-y-1 text-xs text-white/60 font-thai">
              <li>🎯 {totalQuestions} ข้อ จากเนื้อหาระดับ {targetLevelInfo?.cefr}</li>
              <li>✅ ต้องตอบถูก 70%+ ({Math.ceil(totalQuestions * PASS_THRESHOLD)} ข้อ)</li>
              <li>🚀 ถ้าผ่าน — ข้ามขึ้นระดับ {targetLevelInfo?.cefr} เลย</li>
              <li>😊 ถ้าไม่ผ่าน — เรียนต่อที่ระดับเดิม ไม่มีผลเสีย</li>
            </ul>
          </div>

          <Button
            onClick={() => setPhase("quiz")}
            className="w-full font-thai bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl h-12 text-base shadow-lg shadow-cyan-500/20"
          >
            <Zap className="w-5 h-5 mr-2" /> เริ่มทดสอบเลย!
          </Button>
        </div>
      </div>
    );
  }

  // ─── Result screen ────────────────────────────────────
  if (phase === "result") {
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6 text-center">
          <div className="text-6xl animate-float-gentle" style={{ display: "inline-block" }}>
            {passed ? "🎉" : "💪"}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white font-thai">
              {passed ? "ผ่านแล้ว!" : "ยังไม่ผ่านครั้งนี้"}
            </h2>
            <p className="text-sm text-white/50 font-thai mt-1">
              {passed
                ? `คุณขึ้นระดับ ${targetLevelInfo?.cefr} ได้แล้ว!`
                : `ทำได้ ${scorePercent}% ต้องการ ${Math.round(PASS_THRESHOLD * 100)}%`}
            </p>
          </div>

          {/* Score circle */}
          <div className={cn(
            "w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto border-4",
            passed ? "bg-green-500/20 border-green-400" : "bg-amber-500/20 border-amber-400"
          )}>
            <p className={cn("text-4xl font-bold", passed ? "text-green-300" : "text-amber-300")}>
              {scorePercent}%
            </p>
            <p className="text-xs text-white/50 font-thai">{correctCount}/{totalQuestions} ข้อ</p>
          </div>

          {passed && targetLevelMeta && (
            <div className="bg-white/5 rounded-2xl border border-green-500/30 p-4 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">{targetLevelInfo?.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-green-300 font-thai">{targetLevelInfo?.name}</p>
                  <p className="text-[10px] text-white/40 font-thai">{targetLevelMeta?.description}</p>
                </div>
              </div>
            </div>
          )}

          {!passed && (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <p className="text-xs text-white/50 font-thai leading-relaxed">
                ไม่เป็นไร! เรียนต่อที่ระดับ {currentLevelInfo?.cefr} ให้ครบก่อน
                แล้วกลับมาทดสอบอีกครั้งได้เลย 😊
              </p>
            </div>
          )}

          <Button
            onClick={() => navigate("/learn")}
            disabled={saving}
            className="w-full font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-2xl h-12"
          >
            {saving ? "กำลังบันทึก..." : "กลับไปเรียน →"}
          </Button>
        </div>
      </div>
    );
  }

  // ─── Quiz phase ────────────────────────────────────
  const progress = Math.round(((currentIdx + (answered ? 1 : 0)) / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-white/50 font-thai min-w-[3rem] text-right">
            {currentIdx + 1}/{totalQuestions}
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Level badge */}
        <div className="flex justify-center">
          <span className="text-xs font-bold font-thai px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
            🚀 ทดสอบข้ามระดับ → {targetLevelInfo?.cefr}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
          {currentQuestion.context && (
            <div className="bg-white/5 rounded-xl p-3 mb-3">
              <p className="text-xs text-white/60 leading-relaxed font-reading italic">
                {currentQuestion.context}
              </p>
            </div>
          )}
          <p className="text-lg font-bold text-white font-reading leading-snug">
            {currentQuestion.question}
          </p>
          {currentQuestion.questionThai && (
            <p className="text-sm text-white/40 font-thai">{currentQuestion.questionThai}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === currentQuestion.correctIndex;
            const showFeedback = answered;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-reading",
                  !showFeedback && "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white",
                  showFeedback && isCorrect && "border-green-400 bg-green-500/20 text-green-300",
                  showFeedback && isSelected && !isCorrect && "border-red-400 bg-red-500/20 text-red-300",
                  showFeedback && !isSelected && !isCorrect && "border-white/5 bg-white/[0.03] text-white/30",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    !showFeedback && "bg-white/10 text-white/60",
                    showFeedback && isCorrect && "bg-green-500 text-white",
                    showFeedback && isSelected && !isCorrect && "bg-red-500 text-white",
                    showFeedback && !isSelected && !isCorrect && "bg-white/5 text-white/20",
                  )}>
                    {showFeedback && isCorrect
                      ? <CheckCircle className="w-4 h-4" />
                      : showFeedback && isSelected && !isCorrect
                        ? <XCircle className="w-4 h-4" />
                        : String.fromCharCode(65 + i)
                    }
                  </span>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SkipLevelTestPage;
