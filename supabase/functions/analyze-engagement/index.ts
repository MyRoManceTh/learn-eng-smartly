import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabase();
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

    // ===== 1. Aggregate all metrics in parallel =====
    const [
      profilesRes,
      premiumRes,
      analyticsRes,
      lessonsRes,
      missionsRes,
      missionsTodayRes,
      gachaRes,
      friendshipsRes,
      challengesRes,
      seasonRes,
    ] = await Promise.all([
      supabase.from("profiles").select("current_level, current_streak, total_exp, last_activity_date, is_premium, lessons_completed, created_at"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_premium", true),
      supabase.from("analytics_events").select("user_id, event_type, created_at").gte("created_at", thirtyDaysAgo),
      supabase.from("learning_history").select("quiz_score, quiz_total, completed_at").gte("completed_at", thirtyDaysAgo),
      supabase.from("daily_missions").select("mission_type, completed, mission_date").gte("mission_date", sevenDaysAgo.split("T")[0]),
      supabase.from("daily_missions").select("*", { count: "exact", head: true }).eq("mission_date", today).eq("completed", true),
      supabase.from("gacha_history").select("created_at, rarity").gte("created_at", thirtyDaysAgo),
      supabase.from("friendships").select("*", { count: "exact", head: true }).eq("status", "accepted"),
      supabase.from("quiz_challenges").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
      supabase.from("season_pass").select("is_premium", { count: "exact", head: true }),
    ]);

    const profiles = (profilesRes.data || []) as any[];
    const analytics = (analyticsRes.data || []) as any[];
    const lessons = (lessonsRes.data || []) as any[];
    const missions = (missionsRes.data || []) as any[];
    const gachaPulls = (gachaRes.data || []) as any[];

    // ===== 2. Compute metrics =====
    const totalUsers = profiles.length;
    const premiumCount = premiumRes.count || 0;

    // DAU: distinct users today
    const todayEvents = analytics.filter((e: any) => e.created_at?.startsWith(today));
    const todayUserIds = new Set(todayEvents.map((e: any) => e.user_id));
    const dau = todayUserIds.size;

    // Average streak
    const avgStreak = totalUsers > 0
      ? Math.round((profiles.reduce((s: number, p: any) => s + (p.current_streak || 0), 0) / totalUsers) * 10) / 10
      : 0;

    // Retention: users active in last 7 days
    const sevenDaysAgoDate = sevenDaysAgo.split("T")[0];
    const retainedUsers = profiles.filter((p: any) => p.last_activity_date && p.last_activity_date >= sevenDaysAgoDate).length;
    const retentionRate = totalUsers > 0 ? Math.round((retainedUsers / totalUsers) * 100) : 0;

    // Lessons today
    const lessonsToday = lessons.filter((l: any) => l.completed_at?.startsWith(today)).length;
    const missionsToday = missionsTodayRes.count || 0;

    // Quiz average
    const quizWithScores = lessons.filter((l: any) => l.quiz_score != null && l.quiz_total != null && l.quiz_total > 0);
    const avgQuizScore = quizWithScores.length > 0
      ? Math.round(quizWithScores.reduce((s: number, l: any) => s + (l.quiz_score / l.quiz_total) * 100, 0) / quizWithScores.length)
      : 0;

    // Level distribution
    const levelDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    profiles.forEach((p: any) => { const lv = p.current_level || 1; if (levelDist[lv] !== undefined) levelDist[lv]++; });

    // Mission completion rate
    const totalMissions = missions.length;
    const completedMissions = missions.filter((m: any) => m.completed).length;
    const missionCompletionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

    // Churn risk
    const churnRiskCount = profiles.filter((p: any) =>
      p.last_activity_date && p.last_activity_date < threeDaysAgo
    ).length;

    // New users this week
    const newUsersCount = profiles.filter((p: any) =>
      p.created_at && p.created_at >= sevenDaysAgo
    ).length;

    // DAU trend 30 days
    const dauByDay: Record<string, Set<string>> = {};
    analytics.forEach((e: any) => {
      const day = e.created_at?.split("T")[0];
      if (day) {
        if (!dauByDay[day]) dauByDay[day] = new Set();
        dauByDay[day].add(e.user_id);
      }
    });
    const dauTrend = Object.entries(dauByDay)
      .map(([date, users]) => ({ date, activeUsers: users.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalGachaPulls = gachaPulls.length;
    const totalFriendships = friendshipsRes.count || 0;
    const totalChallenges = challengesRes.count || 0;

    // ===== 3. Build AI prompt =====
    const prompt = `คุณเป็น Data Analyst สำหรับแอปเรียนภาษาอังกฤษ "Learn English Smartly" สำหรับเด็กไทย

ข้อมูลสรุป (30 วันล่าสุด):
- ผู้ใช้ทั้งหมด: ${totalUsers} คน
- ผู้ใช้ใหม่สัปดาห์นี้: ${newUsersCount} คน
- ผู้ใช้รายวัน (DAU): ${dau} คน
- Streak เฉลี่ย: ${avgStreak} วัน
- Retention 7 วัน: ${retentionRate}%
- บทเรียนเสร็จวันนี้: ${lessonsToday}
- ภารกิจสำเร็จวันนี้: ${missionsToday}
- ผู้ใช้พรีเมียม: ${premiumCount} คน
- คะแนนควิซเฉลี่ย: ${avgQuizScore}%
- การกระจาย Level: Lv.1=${levelDist[1]}, Lv.2=${levelDist[2]}, Lv.3=${levelDist[3]}, Lv.4=${levelDist[4]}, Lv.5=${levelDist[5]}
- อัตราทำภารกิจสำเร็จ: ${missionCompletionRate}%
- กาชาสุ่มทั้งหมด: ${totalGachaPulls} ครั้ง
- เพื่อนที่เชื่อมต่อ: ${totalFriendships} คู่
- ท้าดวล: ${totalChallenges} ครั้ง
- ผู้ใช้เสี่ยง churn (หาย 3+ วัน): ${churnRiskCount} คน

โปรดวิเคราะห์และส่งคืนเป็น JSON:
{
  "summary": "สรุปภาพรวมสั้นๆ 1-2 ประโยค",
  "insights": [
    {
      "category": "finding|suggestion|feature|risk",
      "title": "หัวข้อ",
      "description": "รายละเอียด 1-2 ประโยค",
      "severity": "info|warning|critical"
    }
  ]
}

ให้ข้อมูลเชิงลึก 6-10 ข้อ ครอบคลุม:
1. สิ่งที่ทำได้ดี (findings)
2. ความเสี่ยง (risk - churn, engagement ต่ำ)
3. ข้อเสนอแนะปรับปรุง (suggestions)
4. ฟีเจอร์ใหม่ที่ควรทำ (features)

ตอบเป็นภาษาไทยทั้งหมด ส่งกลับเฉพาะ JSON เท่านั้น`;

    // ===== 4. Call Gemini AI =====
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    let analysis = { summary: "ไม่สามารถวิเคราะห์ได้", insights: [] };

    if (apiKey) {
      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content || "";
          // Extract JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        console.error("AI analysis error:", e);
      }
    }

    // ===== 5. Return metrics + AI analysis =====
    return new Response(
      JSON.stringify({
        metrics: {
          totalUsers,
          dau,
          avgStreak,
          retentionRate,
          lessonsToday,
          missionsToday,
          premiumCount,
          avgQuizScore,
          missionCompletionRate,
          churnRiskCount,
          newUsersCount,
          totalGachaPulls,
          totalFriendships,
          totalChallenges,
          levelDist,
          dauTrend,
        },
        analysis,
        analyzedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("analyze-engagement error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
