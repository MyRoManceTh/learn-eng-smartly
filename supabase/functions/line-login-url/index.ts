import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { redirect_uri, state } = await req.json();
    
    const LINE_CHANNEL_ID = Deno.env.get("VITE_LINE_CHANNEL_ID") || Deno.env.get("LINE_CHANNEL_ID");
    if (!LINE_CHANNEL_ID) {
      return new Response(JSON.stringify({ error: "LINE_CHANNEL_ID not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: LINE_CHANNEL_ID,
      redirect_uri,
      state,
      scope: "profile openid",
    });

    const login_url = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

    return new Response(JSON.stringify({ login_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
