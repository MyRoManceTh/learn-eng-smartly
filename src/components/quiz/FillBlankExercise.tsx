import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FillBlankQuestion {
  questionType: "fill_blank";
  question: string;
  sentence: string; // "I ___ to school every day."
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
}

interface Props {
  question: FillBlankQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function FillBlankExercise({ question, onAnswer }: Props) {
  const [userInput, setUserInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const answer = userInput.trim().toLowerCase();
    const correct = question.correctAnswer.toLowerCase();
    const acceptable = (question.acceptableAnswers || []).map((a) => a.toLowerCase());
    const ok = answer === correct || acceptable.includes(answer);
    setIsCorrect(ok);
    setChecked(true);
    onAnswer(ok);
  };

  // Split sentence at ___
  const parts = question.sentence.split("___");

  return (
    <div className="space-y-6">
      <p className="text-sm font-thai text-muted-foreground">{question.question}</p>

      {/* Sentence with blank */}
      <div className="rounded-2xl bg-muted/30 p-5">
        <p className="text-lg leading-relaxed font-reading text-center">
          {parts[0]}
          <span
            className={cn(
              "inline-block mx-1 border-b-2 min-w-[100px] text-center font-bold px-2 py-1 rounded-lg transition-all",
              !checked && "border-purple-400 bg-purple-50",
              checked && isCorrect && "border-green-500 bg-green-50 text-green-700",
              checked && !isCorrect && "border-red-500 bg-red-50 text-red-700"
            )}
          >
            {checked ? (isCorrect ? userInput : question.correctAnswer) : userInput || "..."}
          </span>
          {parts[1]}
        </p>
      </div>

      {/* Input + check */}
      {!checked ? (
        <div className="space-y-3">
          {question.hint && (
            <p className="text-xs text-muted-foreground text-center font-thai">
              💡 คำใบ้: {question.hint}
            </p>
          )}
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="พิมพ์คำตอบ..."
            className="text-center text-lg font-reading"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && userInput.trim() && handleCheck()}
          />
          <Button
            onClick={handleCheck}
            disabled={!userInput.trim()}
            className="w-full"
            size="lg"
          >
            ตรวจคำตอบ
          </Button>
        </div>
      ) : (
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
              {isCorrect ? "ถูกต้อง!" : "ไม่ถูกต้อง"}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-sm text-red-600 font-thai">
              คำตอบที่ถูก: <span className="font-bold font-reading">{question.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
