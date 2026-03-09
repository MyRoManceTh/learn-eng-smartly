import { EvolutionStage } from "@/types/dopamine";

export const evolutionStages: EvolutionStage[] = [
  {
    stage: 1,
    name: "Egg",
    nameThai: "ไข่",
    minExp: 0,
    icon: "🥚",
    effects: [],
    color: "#9E9E9E",
  },
  {
    stage: 2,
    name: "Hatchling",
    nameThai: "ลูกนก",
    minExp: 100,
    icon: "🐣",
    effects: ["glow-soft"],
    color: "#4CAF50",
  },
  {
    stage: 3,
    name: "Student",
    nameThai: "นักเรียน",
    minExp: 500,
    icon: "🧑‍🎓",
    effects: ["glow-medium", "sparkle"],
    color: "#2196F3",
  },
  {
    stage: 4,
    name: "Warrior",
    nameThai: "นักรบ",
    minExp: 1500,
    icon: "⚔️",
    effects: ["glow-strong", "sparkle", "aura"],
    color: "#9C27B0",
  },
  {
    stage: 5,
    name: "Legend",
    nameThai: "ตำนาน",
    minExp: 5000,
    icon: "👑",
    effects: ["glow-legendary", "sparkle", "aura", "particles"],
    color: "#FFD700",
  },
];

/**
 * คำนวณขั้นวิวัฒนาการจาก EXP
 */
export function getEvolutionStage(totalExp: number): EvolutionStage {
  for (let i = evolutionStages.length - 1; i >= 0; i--) {
    if (totalExp >= evolutionStages[i].minExp) {
      return evolutionStages[i];
    }
  }
  return evolutionStages[0];
}

/**
 * คำนวณ progress ถึงขั้นถัดไป (0-100)
 */
export function getEvolutionProgress(totalExp: number): {
  current: EvolutionStage;
  next: EvolutionStage | null;
  progress: number;
  expToNext: number;
} {
  const current = getEvolutionStage(totalExp);
  const nextIndex = evolutionStages.findIndex((s) => s.stage === current.stage) + 1;
  const next = nextIndex < evolutionStages.length ? evolutionStages[nextIndex] : null;

  if (!next) {
    return { current, next: null, progress: 100, expToNext: 0 };
  }

  const expInStage = totalExp - current.minExp;
  const expNeeded = next.minExp - current.minExp;
  const progress = Math.min(100, Math.floor((expInStage / expNeeded) * 100));

  return { current, next, progress, expToNext: next.minExp - totalExp };
}
