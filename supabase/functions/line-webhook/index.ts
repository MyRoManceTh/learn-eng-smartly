import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-line-signature",
};

const LINE_API = "https://api.line.me/v2/bot/message/reply";

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(body);
  const digest = hmac.digest("base64");
  return digest === signature;
}

async function replyMessage(replyToken: string, messages: Array<{ type: string; text: string }>) {
  const accessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
  if (!accessToken) throw new Error("LINE_CHANNEL_ACCESS_TOKEN not configured");

  const res = await fetch(LINE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("LINE reply failed:", res.status, err);
  } else {
    await res.text(); // consume body
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const channelSecret = Deno.env.get("LINE_CHANNEL_SECRET");
    if (!channelSecret) {
      throw new Error("LINE_CHANNEL_SECRET not configured");
    }

    const body = await req.text();
    const signature = req.headers.get("x-line-signature") || "";

    // Verify webhook signature
    if (!verifySignature(body, signature, channelSecret)) {
      console.error("Invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(body);
    const events = payload.events || [];

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userMessage = event.message.text.trim().toLowerCase();
        const replyToken = event.replyToken;

        // Simple bot responses - customize as needed
        let reply = "สวัสดีครับ! 🎓 พิมพ์ 'เรียน' เพื่อเริ่มบทเรียนภาษาอังกฤษ หรือ 'สถิติ' เพื่อดูความก้าวหน้า";

        if (userMessage.includes("เรียน") || userMessage.includes("learn")) {
          reply =
            "📚 เริ่มเรียนได้เลยที่เว็บแอปของเรา!\n\n🔗 https://learn-eng-smartly.lovable.app\n\nมีบทเรียนตั้งแต่ระดับ A1 ครอบคลุม 8 หัวข้อ เช่น การทักทาย ตัวเลข ครอบครัว อาหาร และอีกมากมาย!";
        } else if (userMessage.includes("สถิติ") || userMessage.includes("stat")) {
          reply =
            "📊 ดูสถิติการเรียนของคุณได้ที่:\n🔗 https://learn-eng-smartly.lovable.app/my\n\nเข้าสู่ระบบเพื่อดู streak, XP, และบทเรียนที่เรียนจบแล้ว!";
        } else if (userMessage.includes("help") || userMessage.includes("ช่วย")) {
          reply =
            "🤖 คำสั่งที่ใช้ได้:\n• 'เรียน' - เริ่มบทเรียน\n• 'สถิติ' - ดูความก้าวหน้า\n• 'ช่วย' - แสดงคำสั่งทั้งหมด";
        }

        await replyMessage(replyToken, [{ type: "text", text: reply }]);
      }

      // Handle follow event (new friend)
      if (event.type === "follow") {
        await replyMessage(event.replyToken, [
          {
            type: "text",
            text: "ยินดีต้อนรับสู่ Learn English Smartly! 🎉\n\nฉันคือบอทช่วยเรียนภาษาอังกฤษ พิมพ์ 'เรียน' เพื่อเริ่มต้น หรือ 'ช่วย' เพื่อดูคำสั่งทั้งหมด 📚",
          },
        ]);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
