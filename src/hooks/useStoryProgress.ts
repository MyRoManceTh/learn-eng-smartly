import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "engxp.storyProgress.v1";

// Map of storyId -> Set of completed chapter ids
type ProgressMap = Record<string, string[]>;

const load = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const save = (data: ProgressMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const useStoryProgress = () => {
  const [progress, setProgress] = useState<ProgressMap>(() => load());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setProgress(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markChapterRead = useCallback((storyId: string, chapterId: string) => {
    setProgress((prev) => {
      const list = prev[storyId] ?? [];
      if (list.includes(chapterId)) return prev;
      const next = { ...prev, [storyId]: [...list, chapterId] };
      save(next);
      return next;
    });
  }, []);

  const getStoryProgress = useCallback(
    (storyId: string, totalChapters: number) => {
      const done = progress[storyId]?.length ?? 0;
      return {
        done,
        total: totalChapters,
        percent: totalChapters === 0 ? 0 : Math.round((done / totalChapters) * 100),
        completed: done >= totalChapters && totalChapters > 0,
      };
    },
    [progress]
  );

  const isChapterRead = useCallback(
    (storyId: string, chapterId: string) => {
      return progress[storyId]?.includes(chapterId) ?? false;
    },
    [progress]
  );

  return { progress, markChapterRead, getStoryProgress, isChapterRead };
};
