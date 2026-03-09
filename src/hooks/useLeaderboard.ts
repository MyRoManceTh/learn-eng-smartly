import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LeaderboardEntry } from "@/types/dopamine";

export function useLeaderboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, total_exp, current_streak, equipped, evolution_stage")
        .not("display_name", "is", null)
        .order("total_exp" as any, { ascending: false })
        .limit(50);

      if (!profiles) return { entries: [] as LeaderboardEntry[], myRank: 0 };

      const entries: LeaderboardEntry[] = (profiles as any[]).map((p, i) => ({
        user_id: p.user_id,
        display_name: p.display_name || "ไม่ระบุชื่อ",
        total_exp: p.total_exp || 0,
        current_streak: p.current_streak || 0,
        equipped: p.equipped,
        evolution_stage: p.evolution_stage || 1,
        rank: i + 1,
      }));

      const myRank = user
        ? entries.findIndex((e) => e.user_id === user.id) + 1
        : 0;

      return { entries, myRank };
    },
    staleTime: 60_000, // 1 minute
  });

  return {
    entries: data?.entries || [],
    myRank: data?.myRank || 0,
    loading: isLoading,
  };
}
