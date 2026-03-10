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

async function validateAdmin(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return false;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return false;

  const adminSupabase = getSupabase();
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  return profile?.is_admin === true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const isAdmin = await validateAdmin(req);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = getSupabase();
    const { action, ...params } = await req.json();

    switch (action) {
      case "ban": {
        const { userId, reason } = params;
        const { error } = await supabase
          .from("profiles")
          .update({
            is_banned: true,
            banned_at: new Date().toISOString(),
            ban_reason: reason || "No reason provided",
          })
          .eq("user_id", userId);
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "unban": {
        const { userId } = params;
        const { error } = await supabase
          .from("profiles")
          .update({
            is_banned: false,
            banned_at: null,
            ban_reason: null,
          })
          .eq("user_id", userId);
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "reset-progress": {
        const { userId } = params;
        const { error } = await supabase
          .from("profiles")
          .update({
            total_exp: 0,
            lessons_completed: 0,
            current_streak: 0,
            longest_streak: 0,
            coins: 0,
            current_level: 1,
          })
          .eq("user_id", userId);
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "grant": {
        const { userId, coins, exp } = params;
        const { data: profile } = await supabase
          .from("profiles")
          .select("coins, total_exp")
          .eq("user_id", userId)
          .single();

        if (!profile) throw new Error("User not found");

        const updates: Record<string, number> = {};
        if (coins) updates.coins = (profile.coins || 0) + coins;
        if (exp) updates.total_exp = (profile.total_exp || 0) + exp;

        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("user_id", userId);
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete-user": {
        const { userId } = params;
        // Delete profile first (cascading should handle related records)
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("user_id", userId);
        if (profileError) throw profileError;

        // Delete auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) throw authError;

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
    console.error("admin-manage-users error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
