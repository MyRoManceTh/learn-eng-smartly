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
      case "bulk-publish": {
        const { lessonIds, published } = params;
        const { error } = await supabase
          .from("lessons")
          .update({ is_published: published })
          .in("id", lessonIds);
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true, updated: lessonIds.length }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "regenerate-image": {
        const { lessonId, imagePrompt } = params;
        const apiKey = Deno.env.get("LOVABLE_API_KEY");
        if (!apiKey) throw new Error("No AI API key configured");

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image-preview",
            messages: [{
              role: "user",
              content: `Generate a watercolor illustration for an English lesson: ${imagePrompt}. Style: soft watercolor, educational, child-friendly.`,
            }],
          }),
        });

        if (!aiResponse.ok) throw new Error("Image generation failed");
        const aiData = await aiResponse.json();
        const imageUrl = aiData.choices?.[0]?.message?.content || "";

        const { error } = await supabase
          .from("lessons")
          .update({ image_url: imageUrl })
          .eq("id", lessonId);
        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, imageUrl }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get-stats": {
        const [lessonsRes, usersRes, eventsRes] = await Promise.all([
          supabase.from("lessons").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("events").select("*", { count: "exact", head: true }).eq("is_active", true),
        ]);

        return new Response(
          JSON.stringify({
            totalLessons: lessonsRes.count || 0,
            totalUsers: usersRes.count || 0,
            activeEvents: eventsRes.count || 0,
          }),
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
    console.error("admin-manage-content error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
