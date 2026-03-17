import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_ORIGIN = "https://learn-eng-smartly.lovable.app";
const LINE_CALLBACK_URL = `${APP_ORIGIN}/auth/line/callback`;
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

const toBase64Url = (value: string) =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

async function signValue(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LINE_CHANNEL_ID = Deno.env.get("VITE_LINE_CHANNEL_ID") || Deno.env.get("LINE_CHANNEL_ID");
    const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET");

    if (!LINE_CHANNEL_ID || !LINE_CHANNEL_SECRET) {
      return new Response(JSON.stringify({ error: "LINE login is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.stringify({
      nonce: crypto.randomUUID(),
      issuedAt: Date.now(),
      expiresAt: Date.now() + STATE_MAX_AGE_MS,
    });

    const signature = await signValue(payload, LINE_CHANNEL_SECRET);
    const state = `${toBase64Url(payload)}.${signature}`;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: LINE_CHANNEL_ID,
      redirect_uri: LINE_CALLBACK_URL,
      state,
      scope: "profile openid",
    });

    const login_url = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

    return new Response(JSON.stringify({ login_url, redirect_uri: LINE_CALLBACK_URL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
