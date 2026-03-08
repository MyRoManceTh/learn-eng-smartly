import { useState } from "react";
import { aesopFables, FableEntry } from "@/data/aesopFables";
import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";

interface FableLibraryProps {
  currentLevel: LearnerLevel;
  onSelectFable: (entry: FableEntry) => void;
}

const levelLabels: Record<number, { en: string; th: string; color: string }> = {
  1: { en: "Beginner", th: "เริ่มต้น", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  2: { en: "Elementary", th: "พื้นฐาน", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  3: { en: "Intermediate", th: "กลาง", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  4: { en: "Upper-Int", th: "กลาง-สูง", color: "bg-orange-500/10 text-orange-700 border-orange-200" },
  5: { en: "Advanced", th: "สูง", color: "bg-red-500/10 text-red-700 border-red-200" },
};

const FableLibrary = ({ currentLevel, onSelectFable }: FableLibraryProps) => {
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const filtered = filterLevel
    ? aesopFables.filter((f) => f.lesson.level === filterLevel)
    : aesopFables;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold font-thai">📚 คลังนิทานอีสป</h3>
      </div>

      {/* Level filter */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <Button
          size="sm"
          variant={filterLevel === null ? "default" : "outline"}
          className="text-xs font-thai"
          onClick={() => setFilterLevel(null)}
        >
          ทั้งหมด
        </Button>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <Button
            key={lvl}
            size="sm"
            variant={filterLevel === lvl ? "default" : "outline"}
            className="text-xs font-thai"
            onClick={() => setFilterLevel(lvl)}
          >
            Lv.{lvl} {levelLabels[lvl].th}
          </Button>
        ))}
      </div>

      {/* Fable cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((entry) => {
          const info = levelLabels[entry.lesson.level];
          return (
            <button
              key={entry.lesson.id}
              onClick={() => onSelectFable(entry)}
              className="text-left rounded-lg border border-border bg-background p-4 hover:border-primary/50 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mb-2 ${info.color}`}>
                    Lv.{entry.lesson.level} {info.en}
                  </span>
                  <h4 className="font-semibold text-sm text-foreground leading-snug">
                    {entry.lesson.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-thai mt-0.5">
                    {entry.lesson.titleThai}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 font-thai">
                    📝 คำศัพท์ {entry.lesson.vocabulary.length} คำ · แบบทดสอบ {entry.quiz.length} ข้อ
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6 font-thai">
          ยังไม่มีนิทานในระดับนี้
        </p>
      )}
    </div>
  );
};

export default FableLibrary;
