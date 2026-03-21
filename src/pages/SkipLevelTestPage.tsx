import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { levelLabels } from "@/data/skillTreeData";
import { placementQuestions } from "@/data/placementTestQuestions";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const TOTAL_QUESTIONS = 20;
const PASS_THRESHOLD = 0.7;

// Level info with vocab targets
const skipLevelInfo: Record<number, { cefr: string; icon: string }> = {
  0: { cefr: "Pre-A1", icon: "🌱" },
  1: { cefr: "A1", icon: "🥚" },
  2: { cefr: "A2", icon: "🐣" },
  3: { cefr: "B1", icon: "🐥" },
  4: { cefr: "B2", icon: "🦅" },
  5: { cefr: "C1", icon: "🐉" },
};

export default function SkipLevelTestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetLevel = parseInt(searchParams.get("level") || "2", 10);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => {
    const pool = placementQuestions.filter((q) => q.difficulty === targetLevel);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, TOTAL_QUESTIONS);
  }, [targetLevel]);

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + (finished ? 1 : 0)) / Math.max(questions.length, 1)) * 100;
  const info = skipLevelInfo[targetLevel] || skipLevelInfo[2];

  const handleSelect = useCallback((optIdx: number) => {
    if (selected !== null || !currentQ) return;
    setSelected(optIdx);
    const isCorrect = optIdx === currentQ.correctIndex;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        const passed = finalScore / questions.length >= PASS_THRESHOLD;
        setFinished(true);

        if (passed && user) {
          supabase
            .from("profiles")
            .update({ current_level: targetLevel } as any)
            .eq("user_id", user.id)
            .then(() => {
              confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
            });
        }
      } else {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
      }
    }, 1200);
  }, [selected, currentQ, currentIdx, questions.length, score, targetLevel, user]);

  const finalScore = finished ? score : 0;
  const passed = finished && finalScore / questions.length >= PASS_THRESHOLD;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-background p-4">
        <div className="text-center space-y-4">
          <span className="text-5xl">📝</span>
          <p className="font-thai text-muted-foreground">ไม่มีข้อสอบสำหรับระดับนี้</p>
          <Button onClick={() => navigate(-1)}>กลับ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-background pb-24">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold font-thai">ข้ามระดับไป {info.cefr} {info.icon}</p>
            <Progress value={progress} className="h-1.5 mt-1" />
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {currentIdx + 1}/{questions.length}
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {!finished && currentQ ? (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-card border p-6 shadow-sm">
              <p className="text-xs text-muted-foreground font-thai mb-2">
                {currentQ.stage === "grammar" ? "ไวยากรณ์" :
                 currentQ.stage === "vocabulary" ? "คำศัพท์" :
                 currentQ.stage === "reading" ? "การอ่าน" : "การฟัง"}
              </p>
              <p className="text-base font-medium text-foreground">{currentQ.question}</p>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const showFeedback = selected !== null;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-foreground",
                      !showFeedback && "hover:border-primary/50 hover:bg-primary/5 border-muted",
                      showFeedback && isCorrect && "border-green-500 bg-green-50",
                      showFeedback && isSelected && !isCorrect && "border-red-500 bg-red-50",
                      !showFeedback && "border-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {showFeedback && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                      {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : finished ? (
          <div className="space-y-6 text-center animate-fade-in">
            <span className="text-6xl block">{passed ? "🎉" : "😢"}</span>
            <h2 className="text-xl font-bold font-thai text-foreground">
              {passed ? `ยินดีด้วย! คุณผ่านไป ${info.cefr}!` : "ยังไม่ผ่าน ลองอีกครั้ง!"}
            </h2>
            <p className="text-muted-foreground font-thai">
              คะแนน: {finalScore}/{questions.length} ({Math.round((finalScore / questions.length) * 100)}%)
              <br />
              ต้องได้ 70% ขึ้นไป
            </p>

            <div className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold",
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {passed ? `✅ ข้ามไป ${info.cefr} แล้ว!` : `❌ ต้องการ ${Math.ceil(questions.length * PASS_THRESHOLD)} ข้อ`}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/learn")} className="font-thai">
                กลับหน้าเรียน
              </Button>
              {!passed && (
                <Button onClick={() => window.location.reload()} className="font-thai">
                  ลองอีกครั้ง
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}