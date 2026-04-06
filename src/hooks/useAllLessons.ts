import { useState, useEffect } from "react";
import type { LessonSeedData } from "@/data/lessons/core-a1-greetings";
import { loadAllLessons } from "@/data/lessons/loadAllLessons";

export function useAllLessons() {
  const [lessons, setLessons] = useState<LessonSeedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllLessons().then(data => {
      setLessons(data);
      setLoading(false);
    });
  }, []);

  return { lessons, loading };
}
