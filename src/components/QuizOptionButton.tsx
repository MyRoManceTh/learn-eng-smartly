import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

interface QuizOptionButtonProps {
  option: string;
  index: number;
  showResult: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

/**
 * Answer choice button shared by QuizSection and QuizPage.
 * Keeps the correct answer vivid green (not dimmed by disabled styles),
 * wraps long Thai text, and animates hover/press states.
 */
export const QuizOptionButton = ({
  option,
  index,
  showResult,
  isCorrect,
  isSelected,
  onSelect,
}: QuizOptionButtonProps) => {
  const showCorrect = showResult && isCorrect;
  const showWrongPick = showResult && isSelected && !isCorrect;
  const isFaded = showResult && !showCorrect && !showWrongPick;

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      disabled={showResult}
      className={cn(
        "w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-thai text-sm sm:text-base transition-all duration-200 disabled:cursor-default",
        !showResult &&
          "bg-white border-purple-100 text-foreground hover:border-purple-300 hover:bg-purple-50/60 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] active:translate-y-0",
        showCorrect &&
          "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/25 scale-[1.02] animate-in zoom-in-95 duration-200",
        showWrongPick && "bg-rose-50 border-rose-300 text-rose-600",
        isFaded && "bg-white/60 border-transparent text-muted-foreground opacity-50"
      )}
    >
      <span
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors",
          showCorrect
            ? "bg-white/25 text-white"
            : showWrongPick
              ? "bg-rose-100 text-rose-500"
              : "bg-purple-100 text-purple-600"
        )}
      >
        {showCorrect ? (
          <CheckCircle className="w-4 h-4" />
        ) : showWrongPick ? (
          <XCircle className="w-4 h-4" />
        ) : (
          OPTION_LETTERS[index] ?? index + 1
        )}
      </span>
      <span className="flex-1 leading-snug">{option}</span>
    </button>
  );
};
