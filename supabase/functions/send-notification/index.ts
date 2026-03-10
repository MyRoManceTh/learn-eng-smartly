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
    const { action, ...params } = await req.json();

    switch (action) {
      case "send": {
        const { targetUserId, type, title, message, data } = params;
        const { error } = await supabase.from("notifications").insert({
          user_id: targetUserId,
          type: type || "system",
          title,
          message,
          data: data || {},
          read: false,
        });
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "broadcast": {
        const { type, title, message, data } = params;
        // Get all active users
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id")
          .neq("is_banned", true);

        if (!profiles || profiles.length === 0) {
          return new Response(
            JSON.stringify({ success: true, sent: 0 }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const notifications = profiles.map((p: any) => ({
          user_id: p.user_id,
          type: type || "system",
          title,
          message,
          data: data || {},
          read: false,
        }));

        // Insert in batches
        let sent = 0;
        for (let i = 0; i < notifications.length; i += 500) {
          const batch = notifications.slice(i, i + 500);
          const { error } = await supabase.from("notifications").insert(batch);
          if (!error) sent += batch.length;
        }

        return new Response(
          JSON.stringify({ success: true, sent }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "mark-read": {
        const { notificationId, userId } = params;
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("id", notificationId)
          .eq("user_id", userId);
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (e) {
    console.error("send-notification error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
