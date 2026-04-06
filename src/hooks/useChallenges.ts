import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import { toast } from "sonner";

export interface ChallengeData {
  id: string;
  challenger_id: string;
  opponent_id: string;
  lesson_id: string | null;
  challenger_score: number | null;
  opponent_score: number | null;
  challenger_total: number | null;
  opponent_total: number | null;
  status: "pending" | "active" | "completed" | "expired";
  expires_at: string;
  created_at: string;
  // Joined names
  challenger_name: string;
  opponent_name: string;
  lesson_title: string | null;
}

export function useChallenges() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["challenges", user?.id],
    queryFn: async () => {
      if (!user) return { pending: [], active: [], completed: [], sent: [] };

      // Get all challenges involving this user
      const { data: challenges } = await supabase
        .from("quiz_challenges")
        .select("*")
        .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!challenges) return { pending: [], active: [], completed: [], sent: [] };

      // Get all user IDs for name lookup
      const userIds = new Set<string>();
      const lessonIds = new Set<string>();
      (challenges as any[]).forEach((c) => {
        userIds.add(c.challenger_id);
        userIds.add(c.opponent_id);
        if (c.lesson_id) lessonIds.add(c.lesson_id);
      });

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", [...userIds]);

      const nameMap = new Map<string, string>();
      ((profiles as any[]) || []).forEach((p) =>
        nameMap.set(p.user_id, p.display_name || "ไม่ระบุชื่อ")
      );

      // Fetch lesson titles
      const titleMap = new Map<string, string>();
      if (lessonIds.size > 0) {
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id, title")
          .in("id", [...lessonIds]);
        ((lessons as any[]) || []).forEach((l) => titleMap.set(l.id, l.title));
      }

      // Auto-expire old pending challenges
      const now = new Date().toISOString();
      const expiredIds = (challenges as any[])
        .filter((c) => c.status === "pending" && c.expires_at < now)
        .map((c) => c.id);

      if (expiredIds.length > 0) {
        await supabase
          .from("quiz_challenges")
          .update({ status: "expired" } as any)
          .in("id", expiredIds);
      }

      // Map to ChallengeData
      const all: ChallengeData[] = (challenges as any[])
        .filter((c) => !expiredIds.includes(c.id))
        .map((c) => ({
          id: c.id,
          challenger_id: c.challenger_id,
          opponent_id: c.opponent_id,
          lesson_id: c.lesson_id,
          challenger_score: c.challenger_score,
          opponent_score: c.opponent_score,
          challenger_total: c.challenger_total || null,
          opponent_total: c.opponent_total || null,
          status: c.status,
          expires_at: c.expires_at,
          created_at: c.created_at,
          challenger_name: nameMap.get(c.challenger_id) || "ไม่ระบุชื่อ",
          opponent_name: nameMap.get(c.opponent_id) || "ไม่ระบุชื่อ",
          lesson_title: c.lesson_id ? titleMap.get(c.lesson_id) || null : null,
        }));

      return {
        pending: all.filter((c) => c.status === "pending" && c.opponent_id === user.id),
        sent: all.filter((c) => c.status === "pending" && c.challenger_id === user.id),
        active: all.filter((c) => c.status === "active"),
        completed: all.filter((c) => c.status === "completed").slice(0, 10),
      };
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["challenges", user?.id] });
  }, [queryClient, user?.id]);

  const sendChallenge = useCallback(
    async (opponentId: string, lessonId?: string) => {
      if (!user) return;

      // If no lesson specified, pick a random published lesson
      let finalLessonId = lessonId;
      if (!finalLessonId) {
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id")
          .eq("is_published", true)
          .limit(20);

        if (lessons && (lessons as any[]).length > 0) {
          const arr = lessons as any[];
          finalLessonId = arr[Math.floor(Math.random() * arr.length)].id;
        }
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase.from("quiz_challenges").insert({
        challenger_id: user.id,
        opponent_id: opponentId,
        lesson_id: finalLessonId || null,
        status: "pending",
        expires_at: expiresAt,
      } as any);

      if (error) {
        toast.error("ส่งคำท้าไม่สำเร็จ ลองใหม่อีกครั้ง");
        return false;
      }

      toast.success("ส่งคำท้าทายแล้ว! ⚔️");
      refresh();
      return true;
    },
    [user, refresh]
  );

  const acceptChallenge = useCallback(
    async (challengeId: string) => {
      const { error } = await supabase
        .from("quiz_challenges")
        .update({ status: "active" } as any)
        .eq("id", challengeId);

      if (error) {
        toast.error("เกิดข้อผิดพลาด");
        return null;
      }

      toast.success("รับคำท้าทายแล้ว! ไปทำ Quiz กัน!");
      refresh();

      // Return the challenge data for navigation
      const challenge = data?.pending.find((c) => c.id === challengeId);
      return challenge || null;
    },
    [data, refresh]
  );

  const declineChallenge = useCallback(
    async (challengeId: string) => {
      await supabase
        .from("quiz_challenges")
        .update({ status: "expired" } as any)
        .eq("id", challengeId);

      toast("ปฏิเสธคำท้าทายแล้ว");
      refresh();
    },
    [refresh]
  );

  const submitScore = useCallback(
    async (challengeId: string, score: number, total: number) => {
      if (!user) return;

      // Get current challenge state
      const { data: challenge } = await supabase
        .from("quiz_challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (!challenge) return;

      const c = challenge as any;

      // Validate: user must be challenger or opponent
      if (c.challenger_id !== user.id && c.opponent_id !== user.id) {
        toast.error("คุณไม่ได้อยู่ในคำท้านี้");
        return;
      }
      // Validate: challenge must be active
      if (c.status !== "active") {
        toast.error("คำท้านี้ยังไม่เริ่ม หรือจบไปแล้ว");
        return;
      }

      const isChallenger = c.challenger_id === user.id;

      const updates: any = {};
      if (isChallenger) {
        updates.challenger_score = score;
        updates.challenger_total = total;
      } else {
        updates.opponent_score = score;
        updates.opponent_total = total;
      }

      // Check if both scores are now filled
      const otherScore = isChallenger ? c.opponent_score : c.challenger_score;
      if (otherScore !== null) {
        updates.status = "completed";
      }

      await supabase
        .from("quiz_challenges")
        .update(updates as any)
        .eq("id", challengeId);

      refresh();
    },
    [user, refresh]
  );

  const pendingCount = (data?.pending.length || 0);
  const activeCount = (data?.active.length || 0);

  return {
    pendingChallenges: data?.pending || [],
    sentChallenges: data?.sent || [],
    activeChallenges: data?.active || [],
    completedChallenges: data?.completed || [],
    loading: isLoading,
    challengeNotificationCount: pendingCount + activeCount,
    sendChallenge,
    acceptChallenge,
    declineChallenge,
    submitScore,
    refresh,
  };
}
