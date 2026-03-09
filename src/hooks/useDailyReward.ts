import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RewardData } from "@/types/dopamine";
import { avatarItems } from "@/data/avatarItems";

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
  const [showModal, setShowModal] = useState(false);
  const [reward, setReward] = useState<RewardData | null>(null);
  const [claimed, setClaimed] = useState(false);

  const today = new Date().toISOString().split("T")[0];
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

    // Apply rewards
    const { data: profile } = await supabase
      .from("profiles")
      .select("coins, total_exp, inventory")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;
    const p = profile as any;

    const updates: any = {
      coins: (p.coins || 0) + (reward.coins || 0),
      total_exp: (p.total_exp || 0) + (reward.exp || 0),
      mystery_box_last_claimed: today,
    };

    // Add milestone bonus
    if (isMilestone) {
      updates.coins += milestones[currentStreak].coins;
    }

    // Add items to inventory
    if (reward.items && reward.items.length > 0) {
      const currentInv = Array.isArray(p.inventory) ? p.inventory : [];
      updates.inventory = [...currentInv, ...reward.items];
    }

    await supabase.from("profiles").update(updates).eq("user_id", user.id);

    // Record in daily_rewards
    await supabase.from("daily_rewards").insert({
      user_id: user.id,
      reward_date: today,
      reward_type: "mystery_box",
      reward_data: reward,
      claimed: true,
      claimed_at: new Date().toISOString(),
    } as any);

    setClaimed(true);
  }, [user, reward, today, isMilestone, currentStreak]);

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
