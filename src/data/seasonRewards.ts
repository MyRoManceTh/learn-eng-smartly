import { SeasonTier } from "@/types/dopamine";

export const seasonTiers: SeasonTier[] = [
  {
    tier: 1,
    expRequired: 50,
    freeReward: { coins: 20 },
    premiumReward: { coins: 50, item: "season_badge_1" },
  },
  {
    tier: 2,
    expRequired: 150,
    freeReward: { coins: 30 },
    premiumReward: { coins: 60, items: ["gacha_ticket"] },
  },
  {
    tier: 3,
    expRequired: 300,
    freeReward: { coins: 40, exp: 20 },
    premiumReward: { coins: 80, item: "season_hat_1" },
  },
  {
    tier: 4,
    expRequired: 500,
    freeReward: { coins: 50 },
    premiumReward: { coins: 100, items: ["gacha_ticket"] },
  },
  {
    tier: 5,
    expRequired: 750,
    freeReward: { coins: 60, exp: 30 },
    premiumReward: { coins: 120, item: "season_shirt_1" },
  },
  {
    tier: 6,
    expRequired: 1000,
    freeReward: { coins: 70 },
    premiumReward: { coins: 140, items: ["gacha_ticket", "gacha_ticket"] },
  },
  {
    tier: 7,
    expRequired: 1300,
    freeReward: { coins: 80, exp: 40 },
    premiumReward: { coins: 160, item: "season_acc_1" },
  },
  {
    tier: 8,
    expRequired: 1600,
    freeReward: { coins: 90 },
    premiumReward: { coins: 180, items: ["gacha_ticket"] },
  },
  {
    tier: 9,
    expRequired: 1850,
    freeReward: { coins: 100, exp: 50 },
    premiumReward: { coins: 200, item: "season_shoes_1" },
  },
  {
    tier: 10,
    expRequired: 2000,
    freeReward: { coins: 150, exp: 100 },
    premiumReward: { coins: 300, item: "season_legendary_1" },
  },
];

/**
 * คำนวณ tier ปัจจุบันจาก EXP
 */
export function getCurrentTier(expEarned: number): number {
  for (let i = seasonTiers.length - 1; i >= 0; i--) {
    if (expEarned >= seasonTiers[i].expRequired) {
      return seasonTiers[i].tier;
    }
  }
  return 0;
}

/**
 * คำนวณ progress ไป tier ถัดไป
 */
export function getTierProgress(expEarned: number): {
  currentTier: number;
  nextTierExp: number;
  progress: number;
} {
  const currentTier = getCurrentTier(expEarned);
  const nextTierData = seasonTiers.find((t) => t.tier === currentTier + 1);

  if (!nextTierData) {
    return { currentTier, nextTierExp: 0, progress: 100 };
  }

  const prevExp = currentTier > 0 ? seasonTiers[currentTier - 1].expRequired : 0;
  const expInTier = expEarned - prevExp;
  const expNeeded = nextTierData.expRequired - prevExp;
  const progress = Math.min(100, Math.floor((expInTier / expNeeded) * 100));

  return { currentTier, nextTierExp: nextTierData.expRequired - expEarned, progress };
}
