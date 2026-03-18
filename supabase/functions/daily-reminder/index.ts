import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LINE_PUSH_API = "https://api.line.me/v2/bot/message/push";
const APP_URL = "https://learn-eng-smartly.lovable.app";

// ── Reminder themes ─────────────────────────────────────────────
interface ReminderTheme {
  title: string;
  message: string;      // in-app notification
  emoji: string;
  heading: string;      // flex card heading
  body: string;         // flex card body
  btnLabel: string;     // flex button text
  bgStart: string;      // gradient start color
  bgEnd: string;        // gradient end color
  accent: string;       // button color
}

const THEMES: ReminderTheme[] = [
  {
    title: "คิดถึงนะ~ 🥺",
    message: "วันนี้ยังไม่ได้เข้ามาเรียนเลย... เราคิดถึงนะ มาหาเราหน่อยนะ 💜",
    emoji: "🥺",
    heading: "คิดถึงนะ~",
    body: "วันนี้ยังไม่เห็นเธอเลย\nเราเตรียมบทเรียนรอไว้แล้วนะ\nมาหาเราหน่อยนะ ก่อนหมดวัน~",
    btnLabel: "💜 มาเรียนเลย!",
    bgStart: "#667eea",
    bgEnd: "#764ba2",
    accent: "#7c3aed",
  },
  {
    title: "อย่าลืมเราน้า~ 🐱",
    message: "เราเตรียมบทเรียนไว้ให้แล้วนะ ยังรออยู่เลย~ มาเรียนกันเถอะ!",
    emoji: "🐱",
    heading: "อย่าลืมเราน้า~",
    body: "เราเตรียมบทเรียนไว้ให้แล้วนะ\nยังรออยู่เลยย~\nมาเรียนด้วยกันเถอะ!",
    btnLabel: "🐾 ไปเรียนกัน!",
    bgStart: "#f093fb",
    bgEnd: "#f5576c",
    accent: "#ec4899",
  },
  {
    title: "Streak กำลังจะหาย! 😿",
    message: "ถ้าไม่เข้ามาวันนี้ streak จะรีเซ็ตนะ! อย่าให้เสียเปล่า มาทำภารกิจกัน~",
    emoji: "🔥",
    heading: "Streak กำลังจะหาย!",
    body: "ถ้าไม่เข้ามาวันนี้\nstreak จะรีเซ็ตนะ!\nอย่าให้เสียเปล่า~ แวะมาสักนิด",
    btnLabel: "🔥 รักษา Streak!",
    bgStart: "#f7971e",
    bgEnd: "#ffd200",
    accent: "#ea580c",
  },
  {
    title: "เหงาจังเลย~ 🌙",
    message: "วันนี้ไม่เห็นเธอเลย เราเหงาจัง มาเรียนด้วยกันนะ ก่อนนอน~",
    emoji: "🌙",
    heading: "เหงาจังเลย~",
    body: "วันนี้ไม่เห็นเธอเลย\nเราเหงาจัง~\nมาเรียนด้วยกันนะ ก่อนนอน",
    btnLabel: "🌙 เรียนก่อนนอน",
    bgStart: "#0f0c29",
    bgEnd: "#302b63",
    accent: "#6366f1",
  },
  {
    title: "สู้ๆ นะ! 💪✨",
    message: "แค่ 5 นาทีก็ได้นะ~ เข้ามาทำภารกิจสักข้อ แล้ววันนี้ก็ครบ!",
    emoji: "💪",
    heading: "สู้ๆ นะ!",
    body: "แค่ 5 นาทีก็ได้นะ~\nเข้ามาทำภารกิจสักข้อ\nแล้ววันนี้ก็ครบ!",
    btnLabel: "⭐ ทำภารกิจเลย!",
    bgStart: "#11998e",
    bgEnd: "#38ef7d",
    accent: "#059669",
  },
  {
    title: "เราว่าเธอเก่งนะ 🌟",
    message: "แต่ต้องมาเรียนด้วยน้า~ ความรู้ไม่รอใคร มาสะสม XP กันเถอะ!",
    emoji: "🌟",
    heading: "เราว่าเธอเก่งนะ~",
    body: "แต่ต้องมาเรียนด้วยน้า~\nความรู้ไม่รอใคร\nมาสะสม XP กันเถอะ!",
    btnLabel: "🎯 สะสม XP!",
    bgStart: "#fc5c7d",
    bgEnd: "#6a82fb",
    accent: "#8b5cf6",
  },
];

// ── Build Flex Message ──────────────────────────────────────────
function buildFlexMessage(
  theme: ReminderTheme,
  name: string,
  streak?: number | null
) {
  const streakBox = streak && streak > 1
    ? {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "🔥",
                size: "sm",
                align: "center",
              },
            ],
            width: "24px",
            height: "24px",
          },
          {
            type: "text",
            text: `Streak ${streak} วัน — อย่าให้ขาดนะ!`,
            size: "xs",
            color: "#ffffff",
            weight: "bold",
            gravity: "center",
          },
        ],
        backgroundColor: "#00000033",
        cornerRadius: "lg",
        paddingAll: "sm",
        margin: "md",
      }
    : null;

  const bodyContents: unknown[] = [
    // Greeting
    {
      type: "text",
      text: `${name}~`,
      weight: "bold",
      size: "md",
      color: "#ffffff",
    },
    // Main heading
    {
      type: "text",
      text: `${theme.emoji} ${theme.heading}`,
      weight: "bold",
      size: "xl",
      color: "#ffffff",
      margin: "md",
      wrap: true,
    },
    // Separator
    {
      type: "separator",
      color: "#ffffff30",
      margin: "lg",
    },
    // Body text
    {
      type: "text",
      text: theme.body,
      size: "sm",
      color: "#ffffffcc",
      wrap: true,
      margin: "lg",
      lineSpacing: "8px",
    },
  ];

  if (streakBox) {
    bodyContents.push(streakBox);
  }

  return {
    type: "flex",
    altText: `${theme.heading} — มาเรียนกันเถอะ!`,
    contents: {
      type: "bubble",
      size: "mega",
      styles: {
        body: { backgroundColor: "#00000000" },
        footer: { backgroundColor: "#00000000" },
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          // Big emoji decoration (top-right)
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: theme.emoji,
                size: "4xl",
                align: "center",
              },
            ],
            position: "absolute",
            offsetEnd: "16px",
            offsetTop: "16px",
            width: "60px",
            height: "60px",
          },
          // Body content
          ...bodyContents,
        ],
        paddingAll: "24px",
        background: {
          type: "linearGradient",
          angle: "135deg",
          startColor: theme.bgStart.replace("#", "#ff"),
          endColor: theme.bgEnd.replace("#", "#ff"),
        },
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: theme.btnLabel,
              uri: APP_URL,
            },
            style: "primary",
            color: theme.accent,
            height: "md",
          },
          {
            type: "text",
            text: "แค่ 5 นาทีก็ OK นะ ✨",
            size: "xxs",
            color: "#ffffffaa",
            align: "center",
            margin: "md",
          },
        ],
        paddingAll: "16px",
        background: {
          type: "linearGradient",
          angle: "135deg",
          startColor: theme.bgEnd.replace("#", "#ff"),
          endColor: theme.bgEnd.replace("#", "#dd"),
        },
      },
    },
  };
}

// ── Helpers ──────────────────────────────────────────────────────
function getRandomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function sendLinePush(lineUserId: string, messages: unknown[]) {
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
    body: JSON.stringify({ to: lineUserId, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`LINE push failed for ${lineUserId}:`, res.status, err);
    return false;
  }

  await res.text();
  return true;
}

// ── Main handler ────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabase();

    // Today in Thailand (UTC+7)
    const now = new Date();
    const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const today = thaiNow.toISOString().split("T")[0];

    // Find users who haven't been active today
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

    // Build LINE userId map from auth metadata
    const { data: authData } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    const lineUserMap = new Map<string, string>();
    if (authData?.users) {
      for (const u of authData.users) {
        const lineId = u.user_metadata?.line_user_id;
        if (lineId) lineUserMap.set(u.id, lineId);
      }
    }

    // Send reminders
    for (const profile of inactiveProfiles) {
      const theme = getRandomTheme();
      const name = profile.display_name || "เพื่อน";

      // 1. In-app notification
      const { error: notifError } = await supabase.from("notifications").insert({
        user_id: profile.user_id,
        type: "reminder",
        title: theme.title,
        message: theme.message,
        data: { action: "open_app" },
        read: false,
      });
      if (!notifError) notifsSent++;

      // 2. LINE Flex Message push
      const lineUserId = lineUserMap.get(profile.user_id);
      if (lineUserId) {
        const flexMsg = buildFlexMessage(theme, name, profile.current_streak);
        const sent = await sendLinePush(lineUserId, [flexMsg]);
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
