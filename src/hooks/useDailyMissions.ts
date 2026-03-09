import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DailyMission, MissionType } from "@/types/dopamine";
import { generateDailyMissions } from "@/data/missionTemplates";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface UseDailyMissionsReturn {
  missions: DailyMission[];
  loading: boolean;
  allCompleted: boolean;
  completedCount: number;
  totalCount: number;
  incrementMission: (type: MissionType, amount?: number) => Promise<void>;
  refreshMissions: () => Promise<void>;
}

export function useDailyMissions(): UseDailyMissionsReturn {
  const { user } = useAuth();
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const loadOrCreateMissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Try to load today's missions
    const { data: existing } = await supabase
      .from("daily_missions")
      .select("*")
      .eq("user_id", user.id)
      .eq("mission_date", today);

    if (existing && existing.length > 0) {
      setMissions(existing as any as DailyMission[]);
      setLoading(false);
      return;
    }

    // Generate new missions for today
    const templates = generateDailyMissions(today);
    const newMissions = templates.map((t) => ({
      user_id: user.id,
      mission_date: today,
      mission_type: t.type,
      mission_title: t.title,
      target_count: t.targetCount,
      current_count: 0,
      reward_coins: t.rewardCoins,
      reward_exp: t.rewardExp,
      completed: false,
    }));

    const { data: inserted } = await supabase
      .from("daily_missions")
      .insert(newMissions as any)
      .select();

    if (inserted) {
      setMissions(inserted as any as DailyMission[]);
    }

    // Auto-complete streak_login mission
    await incrementMissionInternal("streak_login", 1, inserted as any as DailyMission[]);

    setLoading(false);
  }, [user, today]);

  useEffect(() => {
    loadOrCreateMissions();
  }, [loadOrCreateMissions]);

  const incrementMissionInternal = async (
    type: MissionType,
    amount: number,
    currentMissions: DailyMission[]
  ) => {
    if (!user) return;

    const mission = currentMissions.find(
      (m) => m.mission_type === type && !m.completed
    );
    if (!mission) return;

    const newCount = Math.min(mission.current_count + amount, mission.target_count);
    const nowCompleted = newCount >= mission.target_count;

    const updates: any = { current_count: newCount };
    if (nowCompleted) {
      updates.completed = true;
      updates.completed_at = new Date().toISOString();
    }

    await supabase
      .from("daily_missions")
      .update(updates)
      .eq("id", mission.id);

    // Update local state
    const updatedMissions = currentMissions.map((m) =>
      m.id === mission.id
        ? { ...m, current_count: newCount, completed: nowCompleted }
        : m
    );
    setMissions(updatedMissions);

    if (nowCompleted) {
      toast.success(`✅ ภารกิจ "${mission.mission_title}" สำเร็จ! +${mission.reward_coins}🪙 +${mission.reward_exp}⚡`);

      // Apply rewards
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, total_exp, total_missions_completed")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const p = profile as any;
        let bonusCoins = mission.reward_coins;
        let bonusExp = mission.reward_exp;

        // Check if ALL missions completed → x2 bonus
        const allDone = updatedMissions.every((m) => m.completed);
        if (allDone) {
          bonusCoins *= 2;
          bonusExp *= 2;
          toast.success("🎉 ภารกิจครบ! ได้โบนัส x2!", { duration: 3000 });
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });

          // Update mission streak
          await supabase
            .from("profiles")
            .update({
              daily_mission_streak: (p.daily_mission_streak || 0) + 1,
              last_mission_complete_date: today,
            } as any)
            .eq("user_id", user.id);
        }

        await supabase
          .from("profiles")
          .update({
            coins: (p.coins || 0) + bonusCoins,
            total_exp: (p.total_exp || 0) + bonusExp,
            total_missions_completed: (p.total_missions_completed || 0) + 1,
          } as any)
          .eq("user_id", user.id);
      }
    }
  };

  const incrementMission = useCallback(
    async (type: MissionType, amount: number = 1) => {
      await incrementMissionInternal(type, amount, missions);
    },
    [user, missions, today]
  );

  const completedCount = missions.filter((m) => m.completed).length;
  const allCompleted = missions.length > 0 && completedCount === missions.length;

  return {
    missions,
    loading,
    allCompleted,
    completedCount,
    totalCount: missions.length,
    incrementMission,
    refreshMissions: loadOrCreateMissions,
  };
}
