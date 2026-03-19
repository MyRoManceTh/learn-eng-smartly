import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function sendLineNotify(accessToken: string, message: string): Promise<boolean> {
  const res = await fetch(LINE_NOTIFY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
    body: new URLSearchParams({ message }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("LINE Notify failed:", res.status, err);
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, user_ids, message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = getSupabase();
    const targetIds: string[] = user_ids || (user_id ? [user_id] : []);

    // If no specific users, send to all users with LINE Notify tokens
    let query = supabase
      .from("profiles")
      .select("user_id, display_name, line_notify_access_token")
      .not("line_notify_access_token", "is", null);

    if (targetIds.length > 0) {
      query = query.in("user_id", targetIds);
    }

    const { data: profiles, error } = await query;

    if (error) {
      throw error;
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No users with LINE Notify connected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let failed = 0;

    for (const profile of profiles) {
      const token = profile.line_notify_access_token;
      if (!token) continue;

      const ok = await sendLineNotify(token, `\n${message}`);
      if (ok) {
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`LINE Notify: ${sent} sent, ${failed} failed out of ${profiles.length}`);

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: profiles.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("line-notify error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
