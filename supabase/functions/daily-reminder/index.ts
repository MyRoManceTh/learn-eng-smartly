import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LINE_PUSH_API = "https://api.line.me/v2/bot/message/push";

// ข้อความอ้อนๆ คิดถึง แบบสุ่ม
const REMINDER_MESSAGES = [
  {
    title: "คิดถึงนะ~ 🥺",
    message: "วันนี้ยังไม่ได้เข้ามาเรียนเลย... เราคิดถึงนะ มาหาเราหน่อยนะ 💜",
    line: "เฮ้ยย~ คิดถึงนะ 🥺💜\nวันนี้ยังไม่ได้เข้ามาเรียนเลยย\nมาหาเราหน่อยนะ ก่อนหมดวัน~\n\n📚 https://learn-eng-smartly.lovable.app",
  },
  {
    title: "อย่าลืมเราน้า~ 🐱",
    message: "เราเตรียมบทเรียนไว้ให้แล้วนะ ยังรออยู่เลย~ มาเรียนกันเถอะ!",
    line: "อย่าลืมเราน้าา~ 🐱\nเราเตรียมบทเรียนไว้ให้แล้วนะ\nยังรออยู่เลยย มาเรียนกันเถอะ!\n\n📚 https://learn-eng-smartly.lovable.app",
  },
  {
    title: "Streak ของเธอกำลังจะหาย! 😿",
    message: "ถ้าไม่เข้ามาวันนี้ streak จะรีเซ็ตนะ! อย่าให้เสียเปล่า มาทำภารกิจกัน~",
    line: "เตือนด้วยความห่วงใย 😿\nStreak ของเธอกำลังจะหายนะ!\nอย่าให้เสียเปล่า~ แวะมาทำภารกิจสักหน่อย\n\n🔥 https://learn-eng-smartly.lovable.app",
  },
  {
    title: "เหงาจังเลย~ 🌙",
    message: "วันนี้ไม่เห็นเธอเลย เราเหงาจัง มาเรียนด้วยกันนะ ก่อนนอน~",
    line: "เหงาจังเลยย~ 🌙\nวันนี้ไม่เห็นเธอเลย\nมาเรียนด้วยกันนะ ก่อนนอน~\n\n💤 https://learn-eng-smartly.lovable.app",
  },
  {
    title: "สู้ๆ นะ! 💪✨",
    message: "แค่ 5 นาทีก็ได้นะ~ เข้ามาทำภารกิจสักข้อ แล้ววันนี้ก็ครบ!",
    line: "สู้ๆ นะ! 💪✨\nแค่ 5 นาทีก็ได้นะ~\nเข้ามาทำภารกิจสักข้อ แล้ววันนี้ก็ครบ!\n\n⭐ https://learn-eng-smartly.lovable.app",
  },
  {
    title: "เราว่าเธอเก่งนะ 🌟",
    message: "แต่ต้องมาเรียนด้วยน้า~ ความรู้ไม่รอใคร มาสะสม XP กันเถอะ!",
    line: "เราว่าเธอเก่งนะ 🌟\nแต่ต้องมาเรียนด้วยน้า~\nความรู้ไม่รอใคร มาสะสม XP กันเถอะ!\n\n🎯 https://learn-eng-smartly.lovable.app",
  },
];

function getRandomMessage() {
  return REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
}

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function sendLinePush(lineUserId: string, message: string) {
  const accessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
  if (!accessToken) {
    console.warn("LINE_CHANNEL_ACCESS_TOKEN not set, skipping LINE push");
    return false;
  }

  const res = await fetch(LINE_PUSH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [{ type: "text", text: message }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`LINE push failed for ${lineUserId}:`, res.status, err);
    return false;
  }

  await res.text(); // consume body
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabase();

    // Get today's date in Thailand timezone (UTC+7)
    const now = new Date();
    const thaiOffset = 7 * 60 * 60 * 1000;
    const thaiNow = new Date(now.getTime() + thaiOffset);
    const today = thaiNow.toISOString().split("T")[0]; // YYYY-MM-DD

    // Find users who haven't been active today
    // last_activity_date is null OR before today
    const { data: inactiveProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, display_name, current_streak")
      .or(`last_activity_date.is.null,last_activity_date.lt.${today}`);

    if (profileError) {
      console.error("Failed to query profiles:", profileError);
      throw profileError;
    }

    if (!inactiveProfiles || inactiveProfiles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, reminded: 0, message: "Everyone studied today! 🎉" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let linesSent = 0;
    let notifsSent = 0;

    // Get LINE user IDs from auth.users metadata
    const { data: authData } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    const lineUserMap = new Map<string, string>();
    if (authData?.users) {
      for (const u of authData.users) {
        const lineId = u.user_metadata?.line_user_id;
        if (lineId) {
          lineUserMap.set(u.id, lineId);
        }
      }
    }

    // Send reminders
    for (const profile of inactiveProfiles) {
      const msg = getRandomMessage();

      // 1. In-app notification
      const { error: notifError } = await supabase.from("notifications").insert({
        user_id: profile.user_id,
        type: "reminder",
        title: msg.title,
        message: msg.message,
        data: { action: "open_app" },
        read: false,
      });

      if (!notifError) notifsSent++;

      // 2. LINE push (if user has LINE)
      const lineUserId = lineUserMap.get(profile.user_id);
      if (lineUserId) {
        // Personalize with name
        const name = profile.display_name || "เพื่อน";
        let lineMsg = msg.line.replace(/^/, `${name}~ `);

        // Add streak warning if they have one
        if (profile.current_streak && profile.current_streak > 1) {
          lineMsg += `\n\n🔥 Streak ${profile.current_streak} วัน อย่าให้ขาดนะ!`;
        }

        const sent = await sendLinePush(lineUserId, lineMsg);
        if (sent) linesSent++;
      }
    }

    console.log(
      `Daily reminder: ${inactiveProfiles.length} inactive, ${notifsSent} in-app, ${linesSent} LINE`
    );

    return new Response(
      JSON.stringify({
        success: true,
        inactive_users: inactiveProfiles.length,
        notifications_sent: notifsSent,
        line_messages_sent: linesSent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("daily-reminder error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
