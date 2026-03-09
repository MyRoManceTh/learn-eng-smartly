import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GachaRarity, GachaResult } from "@/types/dopamine";
import { avatarItems } from "@/data/avatarItems";
import { gachaExclusiveItems, GACHA_RATES, GACHA_COIN_COST, PITY_THRESHOLD } from "@/data/gachaItems";
import { AvatarItem } from "@/types/avatar";

export function useGacha() {
  const { user } = useAuth();

  const pullGacha = useCallback(
    async (
      inventory: string[],
      coins: number,
      gachaTickets: number,
      useTicket: boolean
    ): Promise<{ result: GachaResult | null; error?: string }> => {
      if (!user) return { result: null, error: "ไม่ได้เข้าสู่ระบบ" };

      if (useTicket && gachaTickets <= 0) {
        return { result: null, error: "ไม่มีตั๋วกาชา!" };
      }
      if (!useTicket && coins < GACHA_COIN_COST) {
        return { result: null, error: `เหรียญไม่พอ! ต้องใช้ ${GACHA_COIN_COST} เหรียญ` };
      }

      // Check pity counter
      const { data: history } = await supabase
        .from("gacha_history")
        .select("rarity")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(PITY_THRESHOLD);

      const recentPulls = (history as any[]) || [];
      const pullsSinceEpic = recentPulls.findIndex(
        (h) => h.rarity === "epic" || h.rarity === "legendary"
      );
      const isPity = pullsSinceEpic === -1 && recentPulls.length >= PITY_THRESHOLD;

      // Determine rarity
      let rarity: GachaRarity;
      if (isPity) {
        rarity = "epic"; // Pity guaranteed
      } else {
        const roll = Math.random();
        if (roll < GACHA_RATES.legendary) rarity = "legendary";
        else if (roll < GACHA_RATES.legendary + GACHA_RATES.epic) rarity = "epic";
        else if (roll < GACHA_RATES.legendary + GACHA_RATES.epic + GACHA_RATES.rare) rarity = "rare";
        else rarity = "common";
      }

      // Pick item
      const allItems: AvatarItem[] = [...avatarItems, ...gachaExclusiveItems];
      const candidates = allItems.filter((i) => i.rarity === rarity);
      const unowned = candidates.filter((i) => !inventory.includes(i.id));
      const pool = unowned.length > 0 ? unowned : candidates;
      const wonItem = pool[Math.floor(Math.random() * pool.length)];

      const isNew = !inventory.includes(wonItem.id);

      // Save to DB
      const newInventory = isNew ? [...inventory, wonItem.id] : inventory;
      const profileUpdates: any = {};

      if (useTicket) {
        profileUpdates.gacha_tickets = gachaTickets - 1;
      } else {
        profileUpdates.coins = coins - GACHA_COIN_COST;
      }
      profileUpdates.inventory = newInventory;

      await Promise.all([
        supabase
          .from("profiles")
          .update(profileUpdates)
          .eq("user_id", user.id),
        supabase.from("gacha_history").insert({
          user_id: user.id,
          item_id: wonItem.id,
          rarity: wonItem.rarity,
        } as any),
      ]);

      return {
        result: {
          itemId: wonItem.id,
          rarity: wonItem.rarity as GachaRarity,
          isNew,
        },
      };
    },
    [user]
  );

  const canFreePull = useCallback((lastFreeGacha: string | null): boolean => {
    if (!lastFreeGacha) return true;
    const lastDate = new Date(lastFreeGacha);
    const now = new Date();
    // อนุญาตถ้าผ่านไป 7 วันแล้ว
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  }, []);

  return { pullGacha, canFreePull, GACHA_COIN_COST };
}
