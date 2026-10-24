import { useState, useRef } from "react";
import { QuizQuestion } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { EmojiIcon } from "@/components/ui/EmojiIcon";
import { QuizOptionButton } from "@/components/QuizOptionButton";

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

  const nextBtnRef = useRef<HTMLButtonElement>(null);

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
    // Scroll the next button into view so it's not hidden behind bottom nav
    setTimeout(() => {
      nextBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
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
    const isPerfect = score === questions.length;
    const isGood = score >= questions.length / 2;

    return (
      <div className="rounded-2xl border border-white/50 bg-white/90 backdrop-blur-sm p-6 text-center shadow-xl shadow-purple-500/10 space-y-4">
        <div className="text-5xl mb-1">{isPerfect ? "🏆" : isGood ? "🎉" : "💪"}</div>
        <h3 className="text-xl font-semibold font-thai">ทำแบบทดสอบเสร็จแล้ว!</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {score}/{questions.length}
        </p>
        <p className="text-muted-foreground font-thai text-sm">
          {isPerfect
            ? "เยี่ยมมาก! คุณตอบถูกทุกข้อ"
            : isGood
            ? "ดีมาก! ลองทบทวนคำที่ผิดอีกครั้ง"
            : "ลองทบทวนบทเรียนอีกครั้งนะ"}
        </p>

        {/* Action buttons */}
        <div className="space-y-2 pt-2">
          {onNextLesson && (
            <Button
              onClick={onNextLesson}
              className="w-full font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 h-12 text-base"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              {nextLessonLabel || "บทเรียนถัดไป"}
            </Button>
          )}

          {!isPerfect && (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQ(0);
                setSelected(null);
                setShowResult(false);
                setScore(0);
                setFinished(false);
              }}
              className="w-full font-thai h-11"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              ลองทำใหม่อีกครั้ง
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-full font-thai text-muted-foreground h-10 text-sm"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            ทบทวนบทเรียน
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-sm p-6 shadow-xl shadow-purple-500/10 transition-transform ${shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold font-thai">{<EmojiIcon emoji="📝" />} แบบทดสอบ</h3>
        <span className="text-sm font-bold text-purple-500">
          {currentQ + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-purple-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQ + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div key={currentQ} className="animate-in fade-in slide-in-from-right-4 duration-300">
        <p className="text-base font-thai mb-4 leading-relaxed">{question.question}</p>

        <div className="space-y-2.5 mb-4">
          {question.options.map((opt, idx) => (
            <QuizOptionButton
              key={idx}
              option={opt}
              index={idx}
              showResult={showResult}
              isCorrect={idx === question.correctIndex}
              isSelected={idx === selected}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {showResult && (
        <Button ref={nextBtnRef} onClick={handleNext} className="w-full h-11 font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {currentQ + 1 >= questions.length ? "ดูผลคะแนน" : "ข้อถัดไป →"}
        </Button>
      )}
    </div>
  );
};

export default QuizSection;
