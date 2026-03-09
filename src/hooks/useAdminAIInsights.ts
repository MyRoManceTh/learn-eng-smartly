import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AIAnalysisResult } from "@/types/admin";

export function useAdminAIInsights() {
  const [data, setData] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "analyze-engagement"
      );

      if (fnError) throw fnError;

      setData({
        summary: result.analysis?.summary || "ไม่สามารถวิเคราะห์ได้",
        insights: result.analysis?.insights || [],
        analyzedAt: result.analyzedAt || new Date().toISOString(),
      });
    } catch (e) {
      console.error("AI analysis failed:", e);
      setError("ไม่สามารถวิเคราะห์ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyze };
}
