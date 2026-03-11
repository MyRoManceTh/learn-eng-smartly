import { useState, useRef } from "react";
import { QuizQuestion } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onNextLesson?: () => void;
  nextLessonLabel?: string;
}

const QuizSection = ({ questions, onComplete, onNextLesson, nextLessonLabel }: QuizSectionProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shaking, setShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      const finalScore = score;
      setFinished(true);
      playComplete();
      // Big celebration confetti
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 } }), 300);
      onComplete(finalScore);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  if (finished) {
    return (
      <div className="rounded-2xl border border-white/50 bg-white/90 backdrop-blur-sm p-6 text-center shadow-xl shadow-purple-500/10">
        <h3 className="text-xl font-semibold mb-2 font-thai">🎉 ทำแบบทดสอบเสร็จแล้ว!</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
          {score}/{questions.length}
        </p>
        <p className="text-muted-foreground font-thai text-sm">
          {score === questions.length
            ? "เยี่ยมมาก! คุณตอบถูกทุกข้อ"
            : score >= questions.length / 2
            ? "ดีมาก! ลองทบทวนคำที่ผิดอีกครั้ง"
            : "ลองทบทวนบทเรียนอีกครั้งนะ"}
        </p>
        {onNextLesson && (
          <Button
            onClick={onNextLesson}
            className="mt-4 w-full font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            {nextLessonLabel || "บทเรียนถัดไป"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-sm p-6 shadow-xl shadow-purple-500/10 transition-transform ${shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-thai">📝 แบบทดสอบ</h3>
        <span className="text-sm text-muted-foreground">
          {currentQ + 1}/{questions.length}
        </span>
      </div>

      <p className="text-base font-thai mb-4">{question.question}</p>

      <div className="space-y-2 mb-4">
        {question.options.map((opt, idx) => {
          let variant: "outline" | "default" | "destructive" = "outline";
          let icon = null;

          if (showResult) {
            if (idx === question.correctIndex) {
              variant = "default";
              icon = <CheckCircle className="w-4 h-4 mr-2" />;
            } else if (idx === selected) {
              variant = "destructive";
              icon = <XCircle className="w-4 h-4 mr-2" />;
            }
          }

          return (
            <Button
              key={idx}
              variant={variant}
              className="w-full justify-start text-left font-thai"
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
        <Button onClick={handleNext} className="w-full font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25">
          {currentQ + 1 >= questions.length ? "ดูผลคะแนน" : "ข้อถัดไป →"}
        </Button>
      )}
    </div>
  );
};

export default QuizSection;
