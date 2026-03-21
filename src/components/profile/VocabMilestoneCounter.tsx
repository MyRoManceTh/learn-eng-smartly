import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { countLearnedWords } from "@/data/flashcardSRS";

/** Target vocabulary count per CEFR level */
export const VOCAB_MILESTONES: Record<number, number> = {
  0: 100,
  1: 500,
  2: 1200,
  3: 2500,
  4: 4000,
  5: 6000,
};

const LEVEL_NAMES: Record<number, string> = {
  0: "Pre-A1",
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
};

interface VocabMilestoneCounterProps {
  currentLevel: number;
}

export default function VocabMilestoneCounter({ currentLevel }: VocabMilestoneCounterProps) {
  const { user } = useAuth();

  const learnedCount = useMemo(
    () => (user ? countLearnedWords(user.id) : 0),
    [user]
  );

  const target = VOCAB_MILESTONES[currentLevel] ?? VOCAB_MILESTONES[5];
  const percent = Math.min(Math.round((learnedCount / target) * 100), 100);
  const levelLabel = LEVEL_NAMES[currentLevel] ?? "C1";

  return (
    <div className="rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <p className="text-sm font-bold font-thai text-foreground">คลังคำศัพท์</p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full font-thai">
          เป้าหมาย {levelLabel}: {target.toLocaleString()} คำ
        </span>
      </div>

      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-purple-700">{learnedCount.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground font-thai mb-1">คำ</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-[10px] text-muted-foreground font-thai">
            {learnedCount < target
              ? `เหลืออีก ${(target - learnedCount).toLocaleString()} คำ`
              : "✅ ถึงเป้าหมายแล้ว!"}
          </p>
          <p className="text-[10px] font-bold text-purple-600">{percent}%</p>
        </div>
      </div>

      {/* Milestone hint */}
      {learnedCount === 0 && (
        <p className="text-[10px] text-muted-foreground font-thai bg-white/60 rounded-lg px-3 py-2">
          💡 ทำ Flashcard ทุกวันเพื่อสะสมคำศัพท์ — คำที่ review แล้วจะนับ
        </p>
      )}
    </div>
  );
}
