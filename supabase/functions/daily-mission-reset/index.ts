import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const missionTemplates = [
  { type: "streak_login", title: "เข้าเรียนวันนี้", targetCount: 1, rewardCoins: 5, rewardExp: 5 },
  { type: "complete_lesson", title: "เรียนจบ 1 บทเรียน", targetCount: 1, rewardCoins: 10, rewardExp: 15 },
  { type: "answer_quiz", title: "ตอบคำถาม 5 ข้อ", targetCount: 5, rewardCoins: 8, rewardExp: 10 },
  { type: "visit_avatar", title: "เยี่ยมชมร้านค้า", targetCount: 1, rewardCoins: 5, rewardExp: 5 },
  { type: "read_article", title: "อ่านบทความ 2 เรื่อง", targetCount: 2, rewardCoins: 8, rewardExp: 10 },
  { type: "path_node", title: "ผ่านด่านเส้นทาง 1 ด่าน", targetCount: 1, rewardCoins: 15, rewardExp: 20 },
];

function dateToSeed(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  let s = seed;
  const next = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDailyMissions(date: string) {
  const mandatory = missionTemplates.find((m) => m.type === "streak_login")!;
  const pool = missionTemplates.filter((m) => m.type !== "streak_login");
  const seed = dateToSeed(date);
  const shuffled = seededShuffle([...pool], seed);
  return [mandatory, ...shuffled.slice(0, 3)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const today = new Date().toISOString().split("T")[0];
    const missions = generateDailyMissions(today);

    // Get all active (non-banned) users
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .neq("is_banned", true);

    if (profileError) throw profileError;
    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active users", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check which users already have today's missions
    const { data: existing } = await supabase
      .from("daily_missions")
      .select("user_id")
      .eq("mission_date", today);

    const existingUserIds = new Set((existing || []).map((e: any) => e.user_id));
    const usersToCreate = profiles.filter((p: any) => !existingUserIds.has(p.user_id));

    if (usersToCreate.length === 0) {
      return new Response(
        JSON.stringify({ message: "All users already have missions today", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create missions for each user
    const missionRows = usersToCreate.flatMap((user: any) =>
      missions.map((m) => ({
        user_id: user.user_id,
        mission_date: today,
        mission_type: m.type,
        title: m.title,
        target_count: m.targetCount,
        current_count: 0,
        reward_coins: m.rewardCoins,
        reward_exp: m.rewardExp,
        completed: false,
      }))
    );

    // Insert in batches of 500
    let inserted = 0;
    for (let i = 0; i < missionRows.length; i += 500) {
      const batch = missionRows.slice(i, i + 500);
      const { error } = await supabase.from("daily_missions").insert(batch);
      if (error) {
        console.error(`Batch insert error at ${i}:`, error);
      } else {
        inserted += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        date: today,
        usersProcessed: usersToCreate.length,
        missionsCreated: inserted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("daily-mission-reset error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
