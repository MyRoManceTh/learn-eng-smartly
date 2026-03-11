// Pet care state stored in profile JSON
export interface PetCareState {
  [petId: string]: {
    level: number;       // 1-10
    exp: number;         // current exp toward next level
    happiness: number;   // 0-100
    hunger: number;      // 0-100 (100=full)
    lastFed: string;     // ISO timestamp
    totalFeedings: number;
  };
}

export const DEFAULT_PET_CARE: PetCareState = {};

// EXP needed per level
export const PET_LEVEL_EXP = [0, 10, 25, 50, 80, 120, 170, 230, 300, 400];

// Food items
export interface PetFood {
  id: string;
  name: string;
  nameThai: string;
  icon: string;
  expGain: number;
  happinessGain: number;
  hungerGain: number;
}

export const PET_FOODS: PetFood[] = [
  { id: "food_basic", name: "Pet Kibble", nameThai: "อาหารเม็ด", icon: "🍖", expGain: 3, happinessGain: 5, hungerGain: 20 },
  { id: "food_fruit", name: "Fresh Fruit", nameThai: "ผลไม้สด", icon: "🍎", expGain: 5, happinessGain: 10, hungerGain: 15 },
  { id: "food_cake", name: "Pet Cake", nameThai: "เค้กสัตว์เลี้ยง", icon: "🍰", expGain: 8, happinessGain: 20, hungerGain: 25 },
  { id: "food_treat", name: "Golden Treat", nameThai: "ขนมทอง", icon: "⭐", expGain: 15, happinessGain: 30, hungerGain: 30 },
];

// Level titles
export const PET_LEVEL_TITLES: Record<number, { th: string; en: string; icon: string }> = {
  1: { th: "ทารก", en: "Baby", icon: "🥚" },
  2: { th: "น้อยนิด", en: "Tiny", icon: "🐣" },
  3: { th: "เด็กน้อย", en: "Little", icon: "🌱" },
  4: { th: "กำลังโต", en: "Growing", icon: "🌿" },
  5: { th: "วัยรุ่น", en: "Teen", icon: "💪" },
  6: { th: "แข็งแกร่ง", en: "Strong", icon: "🔥" },
  7: { th: "ผู้เชี่ยวชาญ", en: "Expert", icon: "⚡" },
  8: { th: "แชมเปี้ยน", en: "Champion", icon: "🏆" },
  9: { th: "ตำนาน", en: "Legend", icon: "👑" },
  10: { th: "ราชา", en: "King", icon: "💎" },
};

export function getPetLevel(exp: number): number {
  for (let i = PET_LEVEL_EXP.length - 1; i >= 0; i--) {
    if (exp >= PET_LEVEL_EXP[i]) return i + 1;
  }
  return 1;
}

export function getPetExpProgress(exp: number): { current: number; needed: number; percent: number } {
  const level = getPetLevel(exp);
  if (level >= 10) return { current: exp, needed: exp, percent: 100 };
  const currentLevelExp = PET_LEVEL_EXP[level - 1];
  const nextLevelExp = PET_LEVEL_EXP[level];
  const current = exp - currentLevelExp;
  const needed = nextLevelExp - currentLevelExp;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}

export function feedPet(
  care: PetCareState,
  petId: string,
  food: PetFood
): { newCare: PetCareState; leveledUp: boolean; newLevel: number } {
  const existing = care[petId] || { level: 1, exp: 0, happiness: 50, hunger: 50, lastFed: "", totalFeedings: 0 };
  const oldLevel = getPetLevel(existing.exp);
  const newExp = existing.exp + food.expGain;
  const newLevel = getPetLevel(newExp);
  const newCare: PetCareState = {
    ...care,
    [petId]: {
      level: newLevel,
      exp: newExp,
      happiness: Math.min(100, existing.happiness + food.happinessGain),
      hunger: Math.min(100, existing.hunger + food.hungerGain),
      lastFed: new Date().toISOString(),
      totalFeedings: existing.totalFeedings + 1,
    },
  };
  return { newCare, leveledUp: newLevel > oldLevel, newLevel };
}
