import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { loadCards } from "@/data/flashcardSRS";
import { levelInfo } from "@/data/skillTreeData";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";

export default function VocabMilestoneCounter() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const currentLevel = profile?.current_level ?? 1;

  const learnedCount = useMemo(() => {
    if (!user) return 0;
    const cards = loadCards(user.id);
    // Count cards with at least 1 successful review (interval > 0)
    return cards.filter((c) => c.interval > 0).length;
  }, [user]);

  const info = levelInfo[currentLevel] || levelInfo[1];
  const target = info.vocabTarget;
  const progress = Math.min(100, Math.round((learnedCount / target) * 100));

  // Milestones
  const milestones = [
    { count: 100, label: "Pre-A1", icon: "🌱" },
    { count: 500, label: "A1", icon: "🥚" },
    { count: 1000, label: "A2", icon: "🐣" },
    { count: 2000, label: "B1", icon: "🐥" },
    { count: 4000, label: "B2", icon: "🦅" },
    { count: 6000, label: "C1", icon: "🐉" },
  ];

  const currentMilestone = milestones.filter((m) => learnedCount >= m.count).pop();
  const nextMilestone = milestones.find((m) => learnedCount < m.count);

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <span className="text-sm font-bold font-thai">คำศัพท์ที่เรียนรู้</span>
        </div>
        <span className="text-lg font-bold text-primary">{learnedCount}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground font-thai">
          <span>เป้าหมาย Level {currentLevel}: {target} คำ</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Milestone badges */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {milestones.map((m) => (
          <div
            key={m.count}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
              learnedCount >= m.count
                ? "bg-primary/10 text-primary"
                : "bg-muted/50 text-muted-foreground opacity-50"
            }`}
          >
            <span>{m.icon}</span>
            <span>{m.count}</span>
          </div>
        ))}
      </div>

      {nextMilestone && (
        <p className="text-[11px] text-muted-foreground font-thai text-center">
          อีก {nextMilestone.count - learnedCount} คำ ถึง {nextMilestone.label} {nextMilestone.icon}
        </p>
      )}
    </div>
  );
}