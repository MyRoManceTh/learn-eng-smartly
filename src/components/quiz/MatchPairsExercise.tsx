import { useState, useMemo } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchPairsQuestion {
  questionType: "match_pairs";
  question: string;
  pairs: Array<{ english: string; thai: string }>;
}

interface Props {
  question: MatchPairsQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairsExercise({ question, onAnswer }: Props) {
  const [selectedEng, setSelectedEng] = useState<string | null>(null);
  const [selectedThai, setSelectedThai] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ eng: string; thai: string } | null>(null);
  const [reported, setReported] = useState(false);

  const shuffledEng = useMemo(() => shuffle(question.pairs.map((p) => p.english)), [question]);
  const shuffledThai = useMemo(() => shuffle(question.pairs.map((p) => p.thai)), [question]);

  const pairMap = useMemo(() => {
    const m = new Map<string, string>();
    question.pairs.forEach((p) => m.set(p.english, p.thai));
    return m;
  }, [question]);

  const tryMatch = (eng: string, thai: string) => {
    if (pairMap.get(eng) === thai) {
      // Correct match
      const newMatched = new Set(matched);
      newMatched.add(eng);
      setMatched(newMatched);
      setSelectedEng(null);
      setSelectedThai(null);
      setWrongPair(null);

      // Check if all matched
      if (newMatched.size === question.pairs.length && !reported) {
        setReported(true);
        onAnswer(true);
      }
    } else {
      // Wrong match
      setWrongPair({ eng, thai });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedEng(null);
        setSelectedThai(null);
      }, 600);
    }
  };

  const handleEngClick = (word: string) => {
    if (matched.has(word)) return;
    setSelectedEng(word);
    if (selectedThai) {
      tryMatch(word, selectedThai);
    }
  };

  const handleThaiClick = (word: string) => {
    // Find which eng this thai belongs to
    const engKey = question.pairs.find((p) => p.thai === word)?.english;
    if (engKey && matched.has(engKey)) return;
    setSelectedThai(word);
    if (selectedEng) {
      tryMatch(selectedEng, word);
    }
  };

  const allDone = matched.size === question.pairs.length;

  return (
    <div className="space-y-5">
      <p className="text-sm font-thai text-muted-foreground">{question.question}</p>

      <div className="grid grid-cols-2 gap-3">
        {/* English column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-muted-foreground mb-1">English</p>
          {shuffledEng.map((word) => {
            const isMatched = matched.has(word);
            const isSelected = selectedEng === word;
            const isWrong = wrongPair?.eng === word;

            return (
              <button
                key={word}
                onClick={() => handleEngClick(word)}
                disabled={isMatched}
                className={cn(
                  "w-full rounded-xl px-3 py-2.5 text-sm font-reading font-medium transition-all border-2",
                  isMatched && "bg-green-50 border-green-300 text-green-700 opacity-60",
                  isSelected && !isMatched && "bg-purple-50 border-purple-400 text-purple-700 scale-[1.02] shadow-sm",
                  isWrong && "bg-red-50 border-red-400 text-red-700 animate-shake",
                  !isMatched && !isSelected && !isWrong && "bg-white border-border hover:border-purple-300 active:scale-95"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span>{word}</span>
                  {isMatched && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Thai column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-muted-foreground mb-1">ไทย</p>
          {shuffledThai.map((word) => {
            const engKey = question.pairs.find((p) => p.thai === word)?.english;
            const isMatched = engKey ? matched.has(engKey) : false;
            const isSelected = selectedThai === word;
            const isWrong = wrongPair?.thai === word;

            return (
              <button
                key={word}
                onClick={() => handleThaiClick(word)}
                disabled={isMatched}
                className={cn(
                  "w-full rounded-xl px-3 py-2.5 text-sm font-thai font-medium transition-all border-2",
                  isMatched && "bg-green-50 border-green-300 text-green-700 opacity-60",
                  isSelected && !isMatched && "bg-pink-50 border-pink-400 text-pink-700 scale-[1.02] shadow-sm",
                  isWrong && "bg-red-50 border-red-400 text-red-700 animate-shake",
                  !isMatched && !isSelected && !isWrong && "bg-white border-border hover:border-pink-300 active:scale-95"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span>{word}</span>
                  {isMatched && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion */}
      {allDone && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="font-bold text-green-700 font-thai">จับคู่ครบแล้ว!</p>
        </div>
      )}

      {/* Progress indicator */}
      {!allDone && (
        <p className="text-xs text-center text-muted-foreground font-thai">
          จับคู่แล้ว {matched.size}/{question.pairs.length}
        </p>
      )}
    </div>
  );
}
