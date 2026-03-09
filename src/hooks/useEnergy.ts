import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EnergyState } from "@/types/dopamine";

const MAX_ENERGY = 5;
const REFILL_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 ชั่วโมง

export function useEnergy(
  currentEnergy: number,
  lastRefill: string | null,
  isPremium: boolean
): {
  energy: EnergyState;
  consumeEnergy: () => Promise<boolean>;
  refreshEnergy: () => void;
} {
  const { user } = useAuth();

  const calculateEnergy = useCallback((): EnergyState => {
    if (isPremium) {
      return { current: MAX_ENERGY, max: MAX_ENERGY, nextRefillAt: null, isFull: true };
    }

    if (!lastRefill) {
      return { current: MAX_ENERGY, max: MAX_ENERGY, nextRefillAt: null, isFull: true };
    }

    const lastRefillTime = new Date(lastRefill).getTime();
    const now = Date.now();
    const elapsed = now - lastRefillTime;
    const refills = Math.floor(elapsed / REFILL_INTERVAL_MS);
    const newEnergy = Math.min(MAX_ENERGY, currentEnergy + refills);
    const isFull = newEnergy >= MAX_ENERGY;

    let nextRefillAt: Date | null = null;
    if (!isFull) {
      const nextRefillMs = lastRefillTime + (refills + 1) * REFILL_INTERVAL_MS;
      nextRefillAt = new Date(nextRefillMs);
    }

    return { current: newEnergy, max: MAX_ENERGY, nextRefillAt, isFull };
  }, [currentEnergy, lastRefill, isPremium]);

  const [energy, setEnergy] = useState<EnergyState>(calculateEnergy());

  useEffect(() => {
    setEnergy(calculateEnergy());
    // Update every minute
    const interval = setInterval(() => setEnergy(calculateEnergy()), 60_000);
    return () => clearInterval(interval);
  }, [calculateEnergy]);

  const consumeEnergy = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    if (isPremium) return true; // Premium ไม่ใช้ energy

    const currentState = calculateEnergy();
    if (currentState.current <= 0) return false;

    await supabase
      .from("profiles")
      .update({
        energy: currentState.current - 1,
        energy_last_refill: new Date().toISOString(),
      } as any)
      .eq("user_id", user.id);

    setEnergy({
      ...currentState,
      current: currentState.current - 1,
      isFull: false,
    });

    return true;
  }, [user, isPremium, calculateEnergy]);

  const refreshEnergy = useCallback(() => {
    setEnergy(calculateEnergy());
  }, [calculateEnergy]);

  return { energy, consumeEnergy, refreshEnergy };
}
