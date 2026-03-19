import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LINE_PUSH_API = "https://api.line.me/v2/bot/message/push";
const APP_URL = "https://learn-eng-smartly.lovable.app";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ── Notification types ──────────────────────────────────────────
type NotifyType =
  | "friend_energy"       // เพื่อนเติมหัวใจให้
  | "friend_request"      // คำขอเป็นเพื่อน
  | "friend_accepted"     // ยอมรับคำขอเพื่อน
  | "streak_tier_up"      // ขึ้น streak tier ใหม่
  | "league_promote"      // เลื่อนขั้นลีก
  | "league_demote"       // ตกชั้นลีก
  | "challenge_received"  // ถูกท้าทาย quiz
  | "gift_received"       // ได้รับของขวัญ
  | "level_up";           // เลเวลอัพ

interface NotifyPayload {
  type: NotifyType;
  target_user_id: string;   // user_id ของคนที่จะรับ notification
  sender_name?: string;     // ชื่อคนส่ง (ถ้ามี)
  data?: Record<string, unknown>; // ข้อมูลเพิ่มเติม
}

// ── Flex Message builders ───────────────────────────────────────
function buildFlexBubble(opts: {
  emoji: string;
  heading: string;
  body: string;
  btnLabel: string;
  btnUrl: string;
  bgStart: string;
  bgEnd: string;
  accent: string;
  footer?: string;
}) {
  return {
    type: "flex" as const,
    altText: opts.heading,
    contents: {
      type: "bubble",
      size: "kilo",
      styles: {
        body: { backgroundColor: "#00000000" },
        footer: { backgroundColor: "#00000000" },
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: opts.emoji, size: "3xl", align: "center" },
            ],
            position: "absolute",
            offsetEnd: "12px",
            offsetTop: "12px",
            width: "50px",
            height: "50px",
          },
          {
            type: "text",
            text: opts.heading,
            weight: "bold",
            size: "lg",
            color: "#ffffff",
            wrap: true,
          },
          {
            type: "separator",
            color: "#ffffff30",
            margin: "md",
          },
          {
            type: "text",
            text: opts.body,
            size: "sm",
            color: "#ffffffcc",
            wrap: true,
            margin: "md",
            lineSpacing: "6px",
          },
        ],
        paddingAll: "20px",
        background: {
          type: "linearGradient",
          angle: "135deg",
          startColor: opts.bgStart.replace("#", "#ff"),
          endColor: opts.bgEnd.replace("#", "#ff"),
        },
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: { type: "uri", label: opts.btnLabel, uri: opts.btnUrl },
            style: "primary",
            color: opts.accent,
            height: "sm",
          },
          ...(opts.footer
            ? [
                {
                  type: "text",
                  text: opts.footer,
                  size: "xxs",
                  color: "#ffffffaa",
                  align: "center",
                  margin: "sm",
                },
              ]
            : []),
        ],
        paddingAll: "14px",
        background: {
          type: "linearGradient",
          angle: "135deg",
          startColor: opts.bgEnd.replace("#", "#ff"),
          endColor: opts.bgEnd.replace("#", "#dd"),
        },
      },
    },
  };
}

function getFlexForType(type: NotifyType, senderName: string, data: Record<string, unknown>) {
  switch (type) {
    case "friend_energy":
      return buildFlexBubble({
        emoji: "❤️",
        heading: `${senderName} เติมหัวใจให้!`,
        body: `${senderName} ส่งหัวใจมาให้\nเข้ามาเรียนเพื่อใช้หัวใจกันเถอะ~`,
        btnLabel: "❤️ เข้าเรียนเลย",
        btnUrl: APP_URL,
        bgStart: "#f43f5e",
        bgEnd: "#ec4899",
        accent: "#e11d48",
        footer: "หัวใจ +1 💕",
      });

    case "friend_request":
      return buildFlexBubble({
        emoji: "🤝",
        heading: "คำขอเป็นเพื่อนใหม่!",
        body: `${senderName} อยากเป็นเพื่อนกับคุณ\nเข้ามายอมรับคำขอได้เลย~`,
        btnLabel: "🤝 ดูคำขอ",
        btnUrl: `${APP_URL}/my`,
        bgStart: "#8b5cf6",
        bgEnd: "#6d28d9",
        accent: "#7c3aed",
      });

    case "friend_accepted":
      return buildFlexBubble({
        emoji: "🎉",
        heading: `${senderName} ยอมรับเป็นเพื่อนแล้ว!`,
        body: "ตอนนี้เป็นเพื่อนกันแล้ว~\nเติมหัวใจ ท้าทาย ส่งของขวัญได้เลย!",
        btnLabel: "🎉 ดูเพื่อน",
        btnUrl: `${APP_URL}/my`,
        bgStart: "#10b981",
        bgEnd: "#059669",
        accent: "#047857",
      });

    case "streak_tier_up":
      const tierEmoji = (data.emoji as string) || "🔥";
      const tierName = (data.tierName as string) || "Streak ใหม่";
      return buildFlexBubble({
        emoji: tierEmoji,
        heading: `ปลดล็อก ${tierName}!`,
        body: `ยินดีด้วย! คุณได้ระดับ Streak ใหม่\n${tierEmoji} ${tierName}\nเข้ามาเรียนต่อเพื่อรักษาสถิติ!`,
        btnLabel: `${tierEmoji} สู้ต่อ!`,
        btnUrl: APP_URL,
        bgStart: "#f59e0b",
        bgEnd: "#d97706",
        accent: "#b45309",
        footer: `+${data.bonusExp || 0} Bonus EXP ✨`,
      });

    case "league_promote":
      const leagueName = (data.leagueName as string) || "ลีกใหม่";
      const leagueEmoji = (data.leagueEmoji as string) || "🏆";
      return buildFlexBubble({
        emoji: leagueEmoji,
        heading: `เลื่อนขั้นเป็น ${leagueName}!`,
        body: `คุณเก่งมาก! เลื่อนขั้นเป็น\n${leagueEmoji} ${leagueName} League\nสู้ต่อเพื่อไปให้ถึง Champion!`,
        btnLabel: "🏆 ดูลีก",
        btnUrl: `${APP_URL}/league`,
        bgStart: "#eab308",
        bgEnd: "#ca8a04",
        accent: "#a16207",
      });

    case "league_demote":
      return buildFlexBubble({
        emoji: "😢",
        heading: "ตกชั้นลีก...",
        body: "อย่าเพิ่งท้อนะ!\nสัปดาห์นี้มาสู้ใหม่กัน\nเรียนทุกวันเพื่อกลับขึ้นไป!",
        btnLabel: "💪 สู้ใหม่!",
        btnUrl: `${APP_URL}/league`,
        bgStart: "#6b7280",
        bgEnd: "#4b5563",
        accent: "#374151",
        footer: "เราเชื่อในตัวคุณ! ❤️",
      });

    case "challenge_received":
      return buildFlexBubble({
        emoji: "⚔️",
        heading: `${senderName} ท้าทายคุณ!`,
        body: `${senderName} ส่งท้าทาย Quiz มาให้\nเข้ามาสู้กันเลย!`,
        btnLabel: "⚔️ รับคำท้า!",
        btnUrl: `${APP_URL}/my`,
        bgStart: "#ef4444",
        bgEnd: "#dc2626",
        accent: "#b91c1c",
      });

    case "gift_received":
      const giftCoins = (data.coins as number) || 0;
      const giftMsg = (data.message as string) || "";
      return buildFlexBubble({
        emoji: "🎁",
        heading: `${senderName} ส่งของขวัญมาให้!`,
        body: `${senderName} ส่งของขวัญมาให้คุณ${giftCoins > 0 ? `\n🪙 ${giftCoins} เหรียญ` : ""}${giftMsg ? `\n"${giftMsg}"` : ""}\nเข้ามารับได้เลย~`,
        btnLabel: "🎁 รับของขวัญ",
        btnUrl: `${APP_URL}/my`,
        bgStart: "#a855f7",
        bgEnd: "#7c3aed",
        accent: "#6d28d9",
      });

    case "level_up":
      const newLevel = (data.level as number) || 1;
      return buildFlexBubble({
        emoji: "⭐",
        heading: `Level Up! → Lv.${newLevel}`,
        body: `ยินดีด้วย! คุณขึ้นเลเวล ${newLevel} แล้ว!\nเก่งมากๆ เลย~\nเรียนต่อเพื่อปลดล็อกเนื้อหาใหม่!`,
        btnLabel: "⭐ เรียนต่อ!",
        btnUrl: APP_URL,
        bgStart: "#3b82f6",
        bgEnd: "#2563eb",
        accent: "#1d4ed8",
        footer: `🎊 Level ${newLevel} Unlocked!`,
      });

    default:
      return null;
  }
}

// ── LINE Push helper ────────────────────────────────────────────
async function sendLinePush(lineUserId: string, messages: unknown[]) {
  const accessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
  if (!accessToken) return false;

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
    console.error(`LINE push failed:`, res.status, err);
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
    const payload: NotifyPayload = await req.json();
    const { type, target_user_id, sender_name, data } = payload;

    if (!type || !target_user_id) {
      return json({ error: "Missing type or target_user_id" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get target user's LINE ID from auth metadata
    const { data: authData } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    const targetAuth = authData?.users?.find((u) => u.id === target_user_id);
    const lineUserId = targetAuth?.user_metadata?.line_user_id;

    // Also save in-app notification
    const flex = getFlexForType(type, sender_name || "เพื่อน", data || {});
    const titleMap: Record<string, string> = {
      friend_energy: `${sender_name || "เพื่อน"} เติมหัวใจให้! ❤️`,
      friend_request: `${sender_name || "ใครบางคน"} อยากเป็นเพื่อน 🤝`,
      friend_accepted: `${sender_name || "เพื่อน"} ยอมรับเป็นเพื่อนแล้ว! 🎉`,
      streak_tier_up: `ปลดล็อก Streak ใหม่! ${(data as any)?.emoji || "🔥"}`,
      league_promote: `เลื่อนขั้นลีก! ${(data as any)?.leagueEmoji || "🏆"}`,
      league_demote: "ตกชั้นลีก 😢",
      challenge_received: `${sender_name || "เพื่อน"} ท้าทายคุณ! ⚔️`,
      gift_received: `${sender_name || "เพื่อน"} ส่งของขวัญมาให้! 🎁`,
      level_up: `Level Up! ⭐ → Lv.${(data as any)?.level || "?"}`,
    };

    await supabase.from("notifications").insert({
      user_id: target_user_id,
      type: type,
      title: titleMap[type] || "แจ้งเตือนใหม่",
      message: flex ? (flex as any).altText : "คุณมีแจ้งเตือนใหม่",
      data: { action: "open_app", ...data },
      read: false,
    });

    // Send LINE push if user has LINE
    let lineSent = false;
    if (lineUserId && flex) {
      lineSent = await sendLinePush(lineUserId, [flex]);
    }

    return json({
      success: true,
      line_sent: lineSent,
      has_line: !!lineUserId,
      type,
    });
  } catch (e) {
    console.error("line-notify error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
