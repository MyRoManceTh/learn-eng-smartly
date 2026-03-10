import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get top 100 users by total_exp
    const { data: topUsers, error } = await supabase
      .from("profiles")
      .select("user_id, display_name, total_exp")
      .neq("is_banned", true)
      .order("total_exp", { ascending: false })
      .limit(100);

    if (error) throw error;
    if (!topUsers || topUsers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users to rank", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clear existing all_time leaderboard
    await supabase
      .from("leaderboard_cache")
      .delete()
      .eq("period", "all_time");

    // Insert new rankings
    const entries = topUsers.map((user: any, index: number) => ({
      period: "all_time",
      user_id: user.user_id,
      rank: index + 1,
      total_exp: user.total_exp || 0,
      display_name: user.display_name || "ไม่ระบุชื่อ",
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("leaderboard_cache")
      .insert(entries);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        rankedUsers: entries.length,
        updatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("leaderboard-update error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
