import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FriendLeaderboardEntry {
  user_id: string;
  display_name: string;
  total_exp: number;
  weekly_exp: number;
  current_streak: number;
  evolution_stage: number;
  equipped: any;
  rank: number;
  isMe: boolean;
}

function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

function getTimeToReset(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : 8 - day;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const diff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} วัน ${hours} ชม.`;
  return `${hours} ชม.`;
}

export function useFriendLeaderboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["friend-leaderboard", user?.id],
    queryFn: async () => {
      if (!user) return { entries: [] as FriendLeaderboardEntry[], myRank: 0 };

      // 1. Get accepted friend user IDs
      const { data: friendships } = await (supabase
        .from("friendships") as any)
        .select("requester_id, addressee_id")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq("status", "accepted");

      const friendIds = ((friendships as any[]) || []).map((f) =>
        f.requester_id === user.id ? f.addressee_id : f.requester_id
      );

      // Include self
      const allUserIds = [...friendIds, user.id];

      if (allUserIds.length <= 1) {
        // No friends - just return self
        const { data: myProfile } = await supabase
          .from("profiles")
          .select("user_id, display_name, total_exp, current_streak, evolution_stage, equipped")
          .eq("user_id", user.id)
          .single();

        if (!myProfile) return { entries: [] as FriendLeaderboardEntry[], myRank: 0 };
        const p = myProfile as any;
        return {
          entries: [{
            user_id: p.user_id,
            display_name: p.display_name || "ฉัน",
            total_exp: p.total_exp || 0,
            weekly_exp: 0,
            current_streak: p.current_streak || 0,
            evolution_stage: p.evolution_stage || 1,
            equipped: p.equipped,
            rank: 1,
            isMe: true,
          }],
          myRank: 1,
        };
      }

      // 2. Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, total_exp, current_streak, evolution_stage, equipped")
        .in("user_id", allUserIds);

      // 3. Get weekly learning history
      const weekStart = getStartOfWeek();
      const { data: history } = await supabase
        .from("learning_history")
        .select("user_id, quiz_score")
        .in("user_id", allUserIds)
        .gte("completed_at", weekStart);

      // Calculate weekly XP per user: quiz_score * 10 + 5 per record
      const weeklyXpMap = new Map<string, number>();
      ((history as any[]) || []).forEach((h) => {
        const exp = (h.quiz_score || 0) * 10 + 5;
        weeklyXpMap.set(h.user_id, (weeklyXpMap.get(h.user_id) || 0) + exp);
      });

      // Build entries
      const entries: FriendLeaderboardEntry[] = ((profiles as any[]) || []).map((p) => ({
        user_id: p.user_id,
        display_name: p.display_name || "ไม่ระบุชื่อ",
        total_exp: p.total_exp || 0,
        weekly_exp: weeklyXpMap.get(p.user_id) || 0,
        current_streak: p.current_streak || 0,
        evolution_stage: p.evolution_stage || 1,
        equipped: p.equipped,
        rank: 0,
        isMe: p.user_id === user.id,
      }));

      return { entries, myRank: 0 };
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  // Sort and rank based on mode
  const sortEntries = (mode: "weekly" | "alltime"): FriendLeaderboardEntry[] => {
    const entries = [...(data?.entries || [])];
    if (mode === "weekly") {
      entries.sort((a, b) => b.weekly_exp - a.weekly_exp);
    } else {
      entries.sort((a, b) => b.total_exp - a.total_exp);
    }
    return entries.map((e, i) => ({ ...e, rank: i + 1 }));
  };

  const getMyRank = (mode: "weekly" | "alltime"): number => {
    const sorted = sortEntries(mode);
    const me = sorted.find((e) => e.isMe);
    return me?.rank || 0;
  };

  return {
    entries: data?.entries || [],
    sortEntries,
    getMyRank,
    loading: isLoading,
    timeToReset: getTimeToReset(),
    hasFriends: (data?.entries || []).length > 1,
  };
}
