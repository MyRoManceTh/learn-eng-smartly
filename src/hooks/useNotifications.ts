import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return (data || []) as AppNotification[];
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user) return;
      await supabase
        .from("notifications")
        .update({ read: true } as never)
        .eq("id", notificationId)
        .eq("user_id", user.id);
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    },
    [user, queryClient]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true } as never)
      .eq("user_id", user.id)
      .eq("read", false);
    queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
  }, [user, queryClient]);

  return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead };
}
