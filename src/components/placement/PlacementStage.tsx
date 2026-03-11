import { useState } from "react";
import { PlacementQuestion, PlacementStage as PlacementStageType, stageInfo } from "@/data/placementTestQuestions";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { playCorrect, playWrong } from "@/utils/sounds";
import confetti from "canvas-confetti";

interface PlacementStageProps {
  stage: PlacementStageType;
  question: PlacementQuestion;
  questionNumber: number;
  totalQuestions: number;
  overallProgress: number; // 0-16
  totalOverall: number;    // 16
  onAnswer: (correct: boolean) => void;
}

const PlacementStageComponent = ({
  stage,
  question,
  questionNumber,
  totalQuestions,
  overallProgress,
  totalOverall,
  onAnswer,
}: PlacementStageProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);
  const info = stageInfo[stage];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);

    const correct = idx === question.correctIndex;
    if (correct) {
      playCorrect();
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#7c3aed", "#ec4899", "#10b981", "#f59e0b"],
      });
    } else {
      playWrong();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleNext = () => {
    const correct = selected === question.correctIndex;
    setSelected(null);
    setShowResult(false);
    onAnswer(correct);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{info.icon}</span>
              <span className="text-sm font-semibold text-white">{info.name}</span>
            </div>
            <span className="text-xs text-purple-300 font-thai">
              ข้อ {questionNumber}/{totalQuestions}
            </span>
          </div>
          {/* Overall progress */}
          <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${(overallProgress / totalOverall) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-purple-400 font-thai">{info.nameThai}</span>
            <span className="text-[10px] text-purple-400">{overallProgress}/{totalOverall}</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Context (for reading/listening) */}
        {question.context && (
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 mb-4">
            <p className="text-sm text-purple-200 whitespace-pre-line leading-relaxed">
              {question.context}
            </p>
          </div>
        )}

        {/* Question card */}
        <div
          className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl transition-transform ${
            shaking ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
        >
          <p className="text-base text-white font-thai mb-2 leading-relaxed">
            {question.question}
          </p>
          {question.questionThai && (
            <p className="text-xs text-purple-400 font-thai mb-4">
              {question.questionThai}
            </p>
          )}

          <div className="space-y-2.5 mb-5">
            {question.options.map((opt, idx) => {
              let bgClass = "bg-white/5 border-white/10 text-white hover:bg-white/10";
              let icon = null;

              if (showResult) {
                if (idx === question.correctIndex) {
                  bgClass = "bg-green-500/20 border-green-500 text-green-300";
                  icon = <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-400" />;
                } else if (idx === selected) {
                  bgClass = "bg-red-500/20 border-red-500 text-red-300";
                  icon = <XCircle className="w-4 h-4 mr-2 flex-shrink-0 text-red-400" />;
                } else {
                  bgClass = "bg-white/5 border-white/5 text-white/40";
                }
              }

              return (
                <button
                  key={idx}
                  className={`w-full flex items-center text-left rounded-xl border p-3.5 text-sm transition-all ${bgClass} ${
                    showResult ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
                  }`}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                >
                  {icon}
                  <span className="font-thai">{opt}</span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <Button
              onClick={handleNext}
              className={`w-full font-thai h-12 text-base bg-gradient-to-r ${info.color} text-white shadow-lg rounded-xl`}
            >
              {questionNumber >= totalQuestions ? "ด่านถัดไป" : "ข้อถัดไป"}
            </Button>
          )}
        </div>

        {/* Difficulty indicator (subtle) */}
        <div className="flex justify-center mt-4 gap-1">
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className={`w-2 h-2 rounded-full transition-all ${
                d <= question.difficulty ? "bg-amber-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlacementStageComponent;
