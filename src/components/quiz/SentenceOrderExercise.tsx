import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentenceOrderQuestion {
  questionType: "sentence_order";
  question: string;
  scrambledWords: string[];
  correctOrder: string[];
}

interface Props {
  question: SentenceOrderQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function SentenceOrderExercise({ question, onAnswer }: Props) {
  const [bank, setBank] = useState<string[]>([...question.scrambledWords]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleTapFromBank = (word: string, idx: number) => {
    if (checked) return;
    setBank((prev) => prev.filter((_, i) => i !== idx));
    setAnswer((prev) => [...prev, word]);
  };

  const handleTapFromAnswer = (word: string, idx: number) => {
    if (checked) return;
    setAnswer((prev) => prev.filter((_, i) => i !== idx));
    setBank((prev) => [...prev, word]);
  };

  const handleReset = () => {
    setBank([...question.scrambledWords]);
    setAnswer([]);
  };

  const handleCheck = () => {
    const ok = answer.join(" ") === question.correctOrder.join(" ");
    setIsCorrect(ok);
    setChecked(true);
    onAnswer(ok);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm font-thai text-muted-foreground">{question.question}</p>

      {/* Answer area */}
      <div className={cn(
        "min-h-[60px] rounded-2xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-start transition-all",
        checked && isCorrect && "border-green-400 bg-green-50/50",
        checked && !isCorrect && "border-red-400 bg-red-50/50",
        !checked && "border-purple-300 bg-purple-50/30"
      )}>
        {answer.length === 0 && (
          <p className="text-sm text-muted-foreground font-thai w-full text-center py-2">
            แตะคำด้านล่างเพื่อเรียงประโยค
          </p>
        )}
        {answer.map((word, i) => (
          <button
            key={`a-${i}`}
            onClick={() => handleTapFromAnswer(word, i)}
            disabled={checked}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium font-reading transition-all",
              checked && isCorrect && "bg-green-500 text-white",
              checked && !isCorrect && "bg-red-400 text-white",
              !checked && "bg-white border border-purple-300 text-foreground shadow-sm hover:bg-purple-50 active:scale-95"
            )}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      {!checked && (
        <div className="flex flex-wrap gap-2 justify-center min-h-[44px]">
          {bank.map((word, i) => (
            <button
              key={`b-${i}`}
              onClick={() => handleTapFromBank(word, i)}
              className="px-3 py-1.5 rounded-lg bg-muted border border-border text-sm font-medium font-reading hover:bg-muted/80 active:scale-95 transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      {checked && (
        <div className={cn(
          "rounded-xl p-4 text-center",
          isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        )}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={cn("font-bold font-thai", isCorrect ? "text-green-700" : "text-red-700")}>
              {isCorrect ? "ถูกต้อง!" : "ลำดับไม่ถูก"}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-sm text-red-600 font-reading mt-1">
              ประโยคที่ถูก: <span className="font-bold">{question.correctOrder.join(" ")}</span>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {!checked && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} size="sm" className="font-thai">
            <RotateCcw className="w-4 h-4 mr-1" /> รีเซ็ต
          </Button>
          <Button
            onClick={handleCheck}
            disabled={bank.length > 0}
            className="flex-1"
            size="lg"
          >
            ตรวจคำตอบ
          </Button>
        </div>
      )}
    </div>
  );
}
