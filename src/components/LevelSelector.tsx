import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy } from "lucide-react";

interface LevelSelectorProps {
  currentLevel: LearnerLevel;
  onLevelChange: (level: LearnerLevel) => void;
  lessonsCompleted: number;
}

const levels: { level: LearnerLevel; label: string; desc: string }[] = [
  { level: 1, label: "Beginner", desc: "เริ่มต้น" },
  { level: 2, label: "Elementary", desc: "พื้นฐาน" },
  { level: 3, label: "Intermediate", desc: "กลาง" },
  { level: 4, label: "Upper-Int", desc: "กลาง-สูง" },
  { level: 5, label: "Advanced", desc: "สูง" },
];

const LevelSelector = ({ currentLevel, onLevelChange, lessonsCompleted }: LevelSelectorProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-thai">
        <BookOpen className="w-4 h-4" />
        <span>ระดับ:</span>
      </div>
      <div className="flex gap-1">
        {levels.map(({ level, label, desc }) => (
          <Button
            key={level}
            size="sm"
            variant={currentLevel === level ? "default" : "outline"}
            className="font-thai text-xs"
            onClick={() => onLevelChange(level)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto font-thai">
        <Trophy className="w-4 h-4 text-primary" />
        <span>เรียนแล้ว {lessonsCompleted} บท</span>
      </div>
    </div>
  );
};

export default LevelSelector;
