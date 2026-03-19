export interface StreakTier {
  id: string;
  name: string;
  nameThai: string;
  emoji: string;
  minDays: number;
  maxDays: number | null;
  bonusExp: number;
  color: string;
}

export const streakTiers: StreakTier[] = [
  { id: "warm", name: "Warm Streak", nameThai: "อุ่นเครื่อง", emoji: "🕯️", minDays: 1, maxDays: 2, bonusExp: 5, color: "from-orange-300 to-amber-400" },
  { id: "fire", name: "Fire Streak", nameThai: "ไฟลุก", emoji: "🔥", minDays: 3, maxDays: 6, bonusExp: 10, color: "from-orange-400 to-red-500" },
  { id: "inferno", name: "Inferno Streak", nameThai: "เปลวเพลิง", emoji: "🌋", minDays: 7, maxDays: 13, bonusExp: 20, color: "from-red-500 to-rose-600" },
  { id: "blaze", name: "Blaze Streak", nameThai: "อุกกาบาต", emoji: "☄️", minDays: 14, maxDays: 29, bonusExp: 35, color: "from-purple-500 to-pink-500" },
  { id: "legendary", name: "Legendary Streak", nameThai: "ตำนาน", emoji: "💎", minDays: 30, maxDays: null, bonusExp: 50, color: "from-blue-400 via-purple-400 to-pink-400" },
];

export function getStreakTier(streak: number): StreakTier | null {
  if (streak <= 0) return null;
  for (let i = streakTiers.length - 1; i >= 0; i--) {
    if (streak >= streakTiers[i].minDays) return streakTiers[i];
  }
  return null;
}

export function getNextStreakTier(streak: number): StreakTier | null {
  const current = getStreakTier(streak);
  if (!current) return streakTiers[0];
  const idx = streakTiers.indexOf(current);
  return idx < streakTiers.length - 1 ? streakTiers[idx + 1] : null;
}

export function didReachNewTier(oldStreak: number, newStreak: number): StreakTier | null {
  const oldTier = getStreakTier(oldStreak);
  const newTier = getStreakTier(newStreak);
  if (!newTier) return null;
  if (!oldTier || oldTier.id !== newTier.id) return newTier;
  return null;
}
