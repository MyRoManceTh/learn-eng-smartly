import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DailyMission, MissionType } from "@/types/dopamine";
import { generateDailyMissions } from "@/data/missionTemplates";
import { getThaiToday } from "@/utils/timezone";
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
  const queryClient = useQueryClient();
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  // Thai (UTC+7) day so mission creation/lookup lines up with increment_mission,
  // which dates progress in Asia/Bangkok server-side. UTC here reset at 07:00.
  const today = getThaiToday();

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

    // Atomic server-side progress + reward: the DB validates the mission, applies
    // coins/XP once with row locking, and computes the all-done x2 bonus + streak
    // server-side. Removes the client coin/XP write (cheatable + lost-update race).
    const { data, error } = await (supabase as any).rpc("increment_mission", {
      p_type: type,
      p_amount: amount,
    });

    if (error || !data?.ok || !data?.found) return;

    setMissions(
      currentMissions.map((m) =>
        m.id === mission.id
          ? { ...m, current_count: data.current_count ?? m.current_count, completed: !!data.completed }
          : m
      )
    );

    if (data.completed) {
      toast.success(`✅ ภารกิจ "${data.title || mission.mission_title}" สำเร็จ! +${data.coins}🪙 +${data.exp}⚡`);
      if (data.all_done) {
        toast.success("🎉 ภารกิจครบ! ได้โบนัส x2!", { duration: 3000 });
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      }
      // Refresh the cached profile so the new coin/XP balance shows immediately.
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
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
