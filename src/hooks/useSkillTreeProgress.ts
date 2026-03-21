import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import {
  skillTreeModules,
  getLessonsByModule,
  SkillTreeModule,
} from "@/data/skillTreeData";

export interface CompletedNode {
  node_id: string;
  module_id: string;
  path_id: string;
  quiz_score: number | null;
  quiz_total: number | null;
}

export function useSkillTreeProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: completedNodes = [], isLoading: loading } = useQuery({
    queryKey: ["skill-tree-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("skill_tree_progress" as any)
        .select("node_id, module_id, path_id, quiz_score, quiz_total")
        .eq("user_id", user.id);
      return (data || []) as unknown as CompletedNode[];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["skill-tree-progress", user?.id] });
  }, [queryClient, user?.id]);

  // Check if a specific lesson node is completed
  const isNodeCompleted = useCallback(
    (nodeId: string) => completedNodes.some((n) => n.node_id === nodeId),
    [completedNodes]
  );

  // Get completed lesson count for a module
  const getModuleProgress = useCallback(
    (moduleId: string) => {
      const completed = completedNodes.filter((n) => n.module_id === moduleId);
      const total = getLessonsByModule(moduleId).length;
      return { completed: completed.length, total };
    },
    [completedNodes]
  );

  // Check if a module is fully completed
  const isModuleCompleted = useCallback(
    (moduleId: string) => {
      const { completed, total } = getModuleProgress(moduleId);
      return total > 0 && completed >= total;
    },
    [getModuleProgress]
  );

  // Check if a module is unlocked (all prerequisites completed)
  const isModuleUnlocked = useCallback(
    (module: SkillTreeModule, placementLevel?: number | null) => {
      // If placement test placed user at higher level, unlock all modules at lower levels
      if (placementLevel != null && placementLevel > 0 && module.level < placementLevel) {
        return true;
      }

      // No prerequisites = always unlocked
      if (module.prerequisites.length === 0) return true;

      // All prerequisite modules must be completed
      return module.prerequisites.every((prereqId) => isModuleCompleted(prereqId));
    },
    [isModuleCompleted]
  );

  // Get the score for a specific node
  const getNodeScore = useCallback(
    (nodeId: string) => completedNodes.find((n) => n.node_id === nodeId) || null,
    [completedNodes]
  );

  // Save a completed lesson
  const completeLesson = useCallback(
    async (nodeId: string, moduleId: string, pathId: string, quizScore: number, quizTotal: number) => {
      if (!user) return;

      await supabase.from("skill_tree_progress" as any).upsert(
        {
          user_id: user.id,
          node_id: nodeId,
          module_id: moduleId,
          path_id: pathId,
          quiz_score: quizScore,
          quiz_total: quizTotal,
        } as any,
        { onConflict: "user_id,node_id" }
      );

      refresh();
    },
    [user, refresh]
  );

  // Get overall stats
  const totalCompleted = completedNodes.length;
  const totalModulesCompleted = skillTreeModules.filter((m) => isModuleCompleted(m.id)).length;

  return {
    completedNodes,
    loading,
    refresh,
    isNodeCompleted,
    getModuleProgress,
    isModuleCompleted,
    isModuleUnlocked,
    getNodeScore,
    completeLesson,
    totalCompleted,
    totalModulesCompleted,
  };
}
