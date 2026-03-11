import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminLessons(filterLevel?: number) {
  const queryClient = useQueryClient();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["admin-lessons", filterLevel],
    queryFn: async () => {
      let query = supabase
        .from("lessons")
        .select("*")
        .order("level")
        .order("lesson_order");

      if (filterLevel && filterLevel > 0) {
        query = query.eq("level", filterLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });

  const createLesson = useMutation({
    mutationFn: async (lesson: {
      level: number;
      lesson_order: number;
      title: string;
      title_thai: string;
      vocabulary: any[];
      article_sentences: any[];
      article_translation: string;
      quiz: any[];
      image_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("lessons")
        .insert(lesson as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("สร้างบทเรียนสำเร็จ");
    },
    onError: (err: any) => toast.error(`สร้างไม่สำเร็จ: ${err.message}`),
  });

  const updateLesson = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from("lessons")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("อัปเดตบทเรียนสำเร็จ");
    },
    onError: (err: any) => toast.error(`อัปเดตไม่สำเร็จ: ${err.message}`),
  });

  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("ลบบทเรียนสำเร็จ");
    },
    onError: (err: any) => toast.error(`ลบไม่สำเร็จ: ${err.message}`),
  });

  const generateLesson = useMutation({
    mutationFn: async (params: { level: number; lessonOrder: number; topic?: string }) => {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: { level: params.level, lessonOrder: params.lessonOrder, topic: params.topic },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("สร้างบทเรียนด้วย AI สำเร็จ");
    },
    onError: (err: any) => toast.error(`สร้างไม่สำเร็จ: ${err.message}`),
  });

  return {
    lessons: lessons || [],
    isLoading,
    createLesson,
    updateLesson,
    deleteLesson,
    generateLesson,
  };
}
