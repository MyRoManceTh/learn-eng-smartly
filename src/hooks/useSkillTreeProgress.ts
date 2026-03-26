import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useRef } from "react";
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

  // Compute the correct level from completed core modules
  // Level = highest core level where ALL modules in that level are completed
  const computedLevel = (() => {
    const coreLevels = [...new Set(skillTreeModules.filter(m => m.pathId === 'core').map(m => m.level))].sort((a, b) => a - b);
    let highest = 0; // Pre-A1 base
    for (const lvl of coreLevels) {
      const modulesAtLevel = skillTreeModules.filter(m => m.pathId === 'core' && m.level === lvl);
      const allCompleted = modulesAtLevel.every(m => isModuleCompleted(m.id));
      if (allCompleted && modulesAtLevel.length > 0) {
        highest = lvl + 1; // completed this level, so user is at next level
      } else {
        // Also check if at least one module in this level is completed → user is AT this level
        const anyCompleted = modulesAtLevel.some(m => isModuleCompleted(m.id));
        if (anyCompleted) {
          highest = Math.max(highest, lvl);
        }
        break;
      }
    }
    return Math.min(highest, 5); // cap at 5
  })();

  // Auto-sync current_level to profile when it changes
  const lastSyncedLevel = useRef<number | null>(null);
  useEffect(() => {
    if (!user || loading || completedNodes.length === 0) return;
    if (lastSyncedLevel.current === computedLevel) return;
    lastSyncedLevel.current = computedLevel;

    // Only update if computed level differs from what might be stored
    supabase
      .from("profiles")
      .select("current_level")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        const stored = (data as any)?.current_level ?? 1;
        if (stored !== computedLevel) {
          supabase
            .from("profiles")
            .update({ current_level: computedLevel } as any)
            .eq("user_id", user.id)
            .then(() => {
              // Invalidate profile cache so UI updates everywhere
              queryClient.invalidateQueries({ queryKey: ["profile"] });
            });
        }
      });
  }, [user, loading, computedLevel, queryClient, completedNodes.length]);

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
    computedLevel,
  };
}
