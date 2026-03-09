import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  currentLevel: LearnerLevel;
  onLevelChange: (level: LearnerLevel) => void;
  lessonsCompleted: number;
}

const levels: { level: LearnerLevel; label: string; desc: string; activeClass: string; inactiveClass: string }[] = [
  { level: 1, label: "Beginner", desc: "เริ่มต้น", activeClass: "bg-emerald-500 text-white shadow-emerald-500/30", inactiveClass: "border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50" },
  { level: 2, label: "Elementary", desc: "พื้นฐาน", activeClass: "bg-sky-500 text-white shadow-sky-500/30", inactiveClass: "border-2 border-sky-300 text-sky-600 hover:bg-sky-50" },
  { level: 3, label: "Intermediate", desc: "กลาง", activeClass: "bg-purple-500 text-white shadow-purple-500/30", inactiveClass: "border-2 border-purple-300 text-purple-600 hover:bg-purple-50" },
  { level: 4, label: "Upper-Int", desc: "กลาง-สูง", activeClass: "bg-pink-500 text-white shadow-pink-500/30", inactiveClass: "border-2 border-pink-300 text-pink-600 hover:bg-pink-50" },
  { level: 5, label: "Advanced", desc: "สูง", activeClass: "bg-orange-500 text-white shadow-orange-500/30", inactiveClass: "border-2 border-orange-300 text-orange-600 hover:bg-orange-50" },
];

const LevelSelector = ({ currentLevel, onLevelChange, lessonsCompleted }: LevelSelectorProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-thai">
        <BookOpen className="w-4 h-4" />
        <span>ระดับ:</span>
      </div>
      <div className="flex gap-1">
        {levels.map(({ level, label, activeClass, inactiveClass }) => (
          <button
            key={level}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold font-thai transition-all duration-200",
              currentLevel === level
                ? cn(activeClass, "shadow-lg scale-105")
                : cn(inactiveClass, "bg-white/60")
            )}
            onClick={() => onLevelChange(level)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto font-thai">
        <Trophy className="w-4 h-4 text-amber-500" />
        <span>เรียนแล้ว {lessonsCompleted} บท</span>
      </div>
    </div>
  );
};

export default LevelSelector;
