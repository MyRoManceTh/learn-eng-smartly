import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "engxp.storyProgress.v1";

// Map of storyId -> array of completed chapter ids
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

const mergeMaps = (a: ProgressMap, b: ProgressMap): ProgressMap => {
  const out: ProgressMap = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const set = new Set([...(out[k] ?? []), ...v]);
    out[k] = Array.from(set);
  }
  return out;
};

export const useStoryProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>(() => load());
  const syncedRef = useRef(false);

  // Sync from cloud on login + push any local-only entries
  useEffect(() => {
    if (!user) {
      syncedRef.current = false;
      return;
    }
    if (syncedRef.current) return;
    syncedRef.current = true;

    (async () => {
      // Build the local payload to send up. The RPC will insert any rows
      // that don't already exist and return the full reconciled cloud state
      // in a single atomic transaction — so we can never end up half-synced.
      const local = load();
      const entries: { story_id: string; chapter_id: string }[] = [];
      for (const [sid, chapters] of Object.entries(local)) {
        for (const cid of chapters) {
          entries.push({ story_id: sid, chapter_id: cid });
        }
      }

      const { data, error } = await supabase.rpc("sync_story_progress", {
        _entries: entries as any,
      });

      if (error) {
        // Don't blow away local state on transient network errors.
        syncedRef.current = false;
        console.warn("story_progress backfill failed", error);
        return;
      }

      const cloudMap: ProgressMap = {};
      for (const row of (data ?? []) as Array<{ story_id: string; chapter_id: string }>) {
        (cloudMap[row.story_id] ??= []).push(row.chapter_id);
      }

      // Cloud is now authoritative (it already contains everything local had).
      save(cloudMap);
      setProgress(cloudMap);
    })();
  }, [user]);

  // Realtime sync across devices
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`story_progress:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "story_progress",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setProgress((prev) => {
            const next = { ...prev };
            if (payload.eventType === "INSERT") {
              const row: any = payload.new;
              const list = next[row.story_id] ?? [];
              if (!list.includes(row.chapter_id)) {
                next[row.story_id] = [...list, row.chapter_id];
              }
            } else if (payload.eventType === "DELETE") {
              const row: any = payload.old;
              if (next[row.story_id]) {
                next[row.story_id] = next[row.story_id].filter((c) => c !== row.chapter_id);
              }
            }
            save(next);
            return next;
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setProgress(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markChapterRead = useCallback(
    (storyId: string, chapterId: string) => {
      let didAdd = false;
      setProgress((prev) => {
        const list = prev[storyId] ?? [];
        if (list.includes(chapterId)) return prev;
        didAdd = true;
        const next = { ...prev, [storyId]: [...list, chapterId] };
        save(next);
        return next;
      });
      if (!didAdd || !user) return;

      // Use upsert with ignoreDuplicates so a race between devices / realtime echo
      // never produces a duplicate row or a noisy error toast.
      supabase
        .from("story_progress")
        .upsert(
          { user_id: user.id, story_id: storyId, chapter_id: chapterId },
          { onConflict: "user_id,story_id,chapter_id", ignoreDuplicates: true }
        )
        .then(({ error }) => {
          if (!error) return;
          // 23505 = unique_violation (race with realtime). Safe to ignore.
          const code = (error as any).code;
          if (code === "23505" || /duplicate|conflict/i.test(error.message || "")) return;
          console.warn("story_progress sync failed", error);
        });
    },
    [user]
  );

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
