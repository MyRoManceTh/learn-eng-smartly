import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminEvents() {
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
    staleTime: 30_000,
  });

  const createEvent = useMutation({
    mutationFn: async (event: {
      name: string;
      description: string;
      theme: string;
      start_date: string;
      end_date: string;
      is_active: boolean;
      exclusive_items?: any[];
    }) => {
      const { data, error } = await supabase
        .from("events")
        .insert(event as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("สร้างอีเวนท์สำเร็จ");
    },
    onError: (err: any) => toast.error(`สร้างไม่สำเร็จ: ${err.message}`),
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from("events")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("อัปเดตอีเวนท์สำเร็จ");
    },
    onError: (err: any) => toast.error(`อัปเดตไม่สำเร็จ: ${err.message}`),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("ลบอีเวนท์สำเร็จ");
    },
    onError: (err: any) => toast.error(`ลบไม่สำเร็จ: ${err.message}`),
  });

  return {
    events: events || [],
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
