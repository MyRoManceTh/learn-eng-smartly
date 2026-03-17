import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const APP_ORIGIN = "https://learn-eng-smartly.lovable.app";
const LINE_CALLBACK_URL = `${APP_ORIGIN}/auth/line/callback`;
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

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

async function verifyState(state: string, secret: string) {
  const [encodedPayload, signature] = state.split(".");
  if (!encodedPayload || !signature) return false;

  const payload = fromBase64Url(encodedPayload);
  const expectedSignature = await signValue(payload, secret);
  if (expectedSignature !== signature) return false;

  const parsed = JSON.parse(payload) as { expiresAt?: number; issuedAt?: number };
  if (!parsed.expiresAt || !parsed.issuedAt) return false;
  if (Date.now() > parsed.expiresAt) return false;
  if (parsed.expiresAt - parsed.issuedAt > STATE_MAX_AGE_MS + 1000) return false;

  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { code, state } = await req.json();
    if (!code) return json({ error: "Missing authorization code" }, 400);

    const LINE_CHANNEL_ID = Deno.env.get("VITE_LINE_CHANNEL_ID") || Deno.env.get("LINE_CHANNEL_ID");
    const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET");
    if (!LINE_CHANNEL_ID || !LINE_CHANNEL_SECRET) {
      throw new Error("LINE credentials not configured");
    }

    const isValidState = state
      ? await verifyState(state, LINE_CHANNEL_SECRET)
      : false;

    if (!isValidState) {
      return json({ error: "Invalid or expired LINE login state" }, 400);
    }

    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: LINE_CALLBACK_URL,
        client_id: LINE_CHANNEL_ID,
        client_secret: LINE_CHANNEL_SECRET,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("LINE token exchange failed:", errText);
      return json({ error: "LINE token exchange failed" }, 401);
    }

    const { access_token } = await tokenRes.json();

    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) throw new Error("Failed to get LINE profile");

    const lineProfile = await profileRes.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const lineEmail = `line_${lineProfile.userId}@line.local`;
    const userMetadata = {
      line_user_id: lineProfile.userId,
      display_name: lineProfile.displayName,
      avatar_url: lineProfile.pictureUrl,
      provider: "line",
    };

    let userId: string;
    const { data: newUser, error: createError } =
      await supabase.auth.admin.createUser({
        email: lineEmail,
        email_confirm: true,
        user_metadata: userMetadata,
      });

    if (createError) {
      if (
        createError.message?.includes("already been registered") ||
        createError.message?.includes("already exists")
      ) {
        const { data: allUsers } = await supabase.auth.admin.listUsers();
        const existing = allUsers?.users?.find(
          (u: { email?: string; id: string }) => u.email === lineEmail
        );
        if (!existing) throw new Error("User exists but could not be found");

        userId = existing.id;
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: userMetadata,
        });
      } else {
        throw createError;
      }
    } else {
      userId = newUser.user!.id;

      await supabase
        .from("profiles")
        .update({ display_name: lineProfile.displayName })
        .eq("id", userId);
    }

    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: lineEmail,
      });

    if (linkError) {
      console.error("Failed to generate link:", linkError);
      throw new Error("Failed to generate session link");
    }

    return json({
      hashed_token: linkData.properties.hashed_token,
      email: lineEmail,
      line_profile: {
        userId: lineProfile.userId,
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl,
      },
    });
  } catch (e) {
    console.error("line-auth error:", e);
    return json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500
    );
  }
});
