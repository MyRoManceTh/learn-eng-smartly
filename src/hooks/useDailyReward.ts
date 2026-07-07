import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RewardData } from "@/types/dopamine";
import { avatarItems } from "@/data/avatarItems";
import { getThaiToday } from "@/utils/timezone";

interface UseDailyRewardReturn {
  showModal: boolean;
  reward: RewardData | null;
  streakDays: number;
  isMilestone: boolean;
  milestoneMessage: string;
  claimReward: () => Promise<void>;
  closeModal: () => void;
}

export function useDailyReward(
  currentStreak: number,
  mysteryBoxLastClaimed: string | null,
  inventory: string[]
): UseDailyRewardReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [reward, setReward] = useState<RewardData | null>(null);
  const [claimed, setClaimed] = useState(false);

  // Thai timezone so the "new day" boundary matches the server (claim_daily_reward
  // dates the claim in Asia/Bangkok). Using UTC here caused a 7h mismatch window.
  const today = getThaiToday();
  const needsClaim = mysteryBoxLastClaimed !== today;

  // Milestone bonuses
  const milestones: Record<number, { coins: number; message: string }> = {
    3: { coins: 10, message: "3 วันติดต่อกัน! +10 โบนัส!" },
    7: { coins: 30, message: "7 วันติดต่อกัน! +30 โบนัส!" },
    14: { coins: 50, message: "14 วันติดต่อกัน! +50 โบนัส!" },
    30: { coins: 100, message: "30 วันติดต่อกัน! +100 โบนัส!" },
  };

  const isMilestone = currentStreak in milestones;
  const milestoneMessage = isMilestone ? milestones[currentStreak].message : "";

  useEffect(() => {
    if (user && needsClaim && !claimed) {
      // Generate reward
      const generated = generateMysteryBoxReward(currentStreak, inventory);
      setReward(generated);
      // Small delay before showing modal
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [user, needsClaim, claimed]);

  const claimReward = useCallback(async () => {
    if (!user || !reward) return;

    // Atomic + idempotent server-side claim: coins/exp/milestone are computed
    // from the server's own streak, the (user, day, type) unique row prevents
    // double-claims across tabs/devices, and the day is dated in Asia/Bangkok so
    // it can't be farmed by changing the device clock.
    const { error } = await (supabase as any).rpc("claim_daily_reward", {
      p_items: reward.items ?? [],
    });

    if (error) {
      console.error("claim_daily_reward failed:", error);
      return;
    }

    // On success (or an idempotent "already claimed") mark done and refresh the
    // cached profile so the new coin balance shows immediately everywhere.
    setClaimed(true);
    queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  }, [user, reward, queryClient]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    showModal,
    reward,
    streakDays: currentStreak,
    isMilestone,
    milestoneMessage,
    claimReward,
    closeModal,
  };
}

function generateMysteryBoxReward(streakDays: number, inventory: string[]): RewardData {
  const baseCoins = 5 + Math.min(streakDays * 2, 20);
  const itemChance = Math.min(0.05 + streakDays * 0.02, 0.3);

  const result: RewardData = { coins: baseCoins, exp: 5 + Math.floor(streakDays / 3) * 5 };

  if (Math.random() < itemChance) {
    const unownedItems = avatarItems.filter(
      (item) => !inventory.includes(item.id) && item.price > 0 && item.price <= 200
    );
    if (unownedItems.length > 0) {
      const randomItem = unownedItems[Math.floor(Math.random() * unownedItems.length)];
      result.items = [randomItem.id];
      result.message = `ได้รับ ${randomItem.nameThai}!`;
    }
  }

  return result;
}
