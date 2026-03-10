import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminUsers(search?: string) {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (search && search.trim()) {
        query = query.ilike("display_name", `%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as any[];
    },
    staleTime: 30_000,
  });

  const updateUser = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates as any)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("อัปเดตผู้ใช้สำเร็จ");
    },
    onError: (err: any) => toast.error(`อัปเดตไม่สำเร็จ: ${err.message}`),
  });

  const banUser = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: true,
          banned_at: new Date().toISOString(),
          ban_reason: reason,
        } as any)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("แบนผู้ใช้สำเร็จ");
    },
    onError: (err: any) => toast.error(`แบนไม่สำเร็จ: ${err.message}`),
  });

  const unbanUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: false,
          banned_at: null,
          ban_reason: null,
        } as any)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("ปลดแบนผู้ใช้สำเร็จ");
    },
    onError: (err: any) => toast.error(`ปลดแบนไม่สำเร็จ: ${err.message}`),
  });

  const resetProgress = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          total_exp: 0,
          lessons_completed: 0,
          current_streak: 0,
          longest_streak: 0,
          coins: 0,
          current_level: 1,
        } as any)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("รีเซ็ตความก้าวหน้าสำเร็จ");
    },
    onError: (err: any) => toast.error(`รีเซ็ตไม่สำเร็จ: ${err.message}`),
  });

  const grantReward = useMutation({
    mutationFn: async ({ userId, coins, exp }: { userId: string; coins?: number; exp?: number }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, total_exp")
        .eq("user_id", userId)
        .single();

      if (!profile) throw new Error("ไม่พบผู้ใช้");

      const updates: Record<string, any> = {};
      if (coins) updates.coins = ((profile as any).coins || 0) + coins;
      if (exp) updates.total_exp = ((profile as any).total_exp || 0) + exp;

      const { error } = await supabase
        .from("profiles")
        .update(updates as any)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("แจกรางวัลสำเร็จ");
    },
    onError: (err: any) => toast.error(`แจกรางวัลไม่สำเร็จ: ${err.message}`),
  });

  return {
    users: users || [],
    isLoading,
    updateUser,
    banUser,
    unbanUser,
    resetProgress,
    grantReward,
  };
}
