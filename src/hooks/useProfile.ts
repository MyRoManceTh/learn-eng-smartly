import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ExtendedProfile } from "@/types/dopamine";
import { useCallback } from "react";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!data) return null;
      const d = data as any;
      return {
        ...d,
        coins: d.coins || 0,
        total_exp: d.total_exp || 0,
        current_streak: d.current_streak || 0,
        longest_streak: d.longest_streak || 0,
        lessons_completed: d.lessons_completed || 0,
        current_level: d.current_level || 1,
        inventory: Array.isArray(d.inventory) ? d.inventory : [],
        daily_mission_streak: d.daily_mission_streak || 0,
        evolution_stage: d.evolution_stage || 1,
        gacha_tickets: d.gacha_tickets || 0,
        energy: d.energy ?? 5,
        is_premium: d.is_premium || false,
        total_missions_completed: d.total_missions_completed || 0,
        placement_completed: d.placement_completed || false,
        placement_level: d.placement_level || null,
        active_path: d.active_path || 'core',
      } as ExtendedProfile;
    },
    enabled: !!user,
    staleTime: 30_000, // 30 seconds
  });

  const refreshProfile = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
  }, [queryClient, user?.id]);

  const updateProfile = useCallback(
    async (updates: Partial<Record<string, any>>) => {
      if (!user) return;
      await supabase
        .from("profiles")
        .update(updates as any)
        .eq("user_id", user.id);
      refreshProfile();
    },
    [user, refreshProfile]
  );

  const addCoins = useCallback(
    async (amount: number) => {
      if (!user || !profile) return;
      await updateProfile({ coins: profile.coins + amount });
    },
    [user, profile, updateProfile]
  );

  const addExp = useCallback(
    async (amount: number) => {
      if (!user || !profile) return;
      await updateProfile({ total_exp: profile.total_exp + amount });
    },
    [user, profile, updateProfile]
  );

  return {
    profile,
    loading,
    refreshProfile,
    updateProfile,
    addCoins,
    addExp,
  };
}
