import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { code, redirect_uri } = await req.json();
    if (!code) return json({ error: "Missing authorization code" }, 400);

    const LINE_CHANNEL_ID = Deno.env.get("VITE_LINE_CHANNEL_ID") || Deno.env.get("LINE_CHANNEL_ID");
    const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET");
    if (!LINE_CHANNEL_ID || !LINE_CHANNEL_SECRET) {
      throw new Error("LINE credentials not configured");
    }

    // 1. Exchange authorization code for LINE tokens
    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
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

    // 2. Get LINE user profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) throw new Error("Failed to get LINE profile");

    const lineProfile = await profileRes.json();
    // { userId, displayName, pictureUrl, statusMessage }

    // 3. Create or find Supabase user
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

    // Try to find user by email
    const { data: userList } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    // More reliable: try to create, if conflict then update
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
        // User exists — find and update
        const { data: allUsers } = await supabase.auth.admin.listUsers();
        const existing = allUsers?.users?.find(
          (u: any) => u.email === lineEmail
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

      // Set display_name in profiles table for new users
      await supabase
        .from("profiles")
        .update({ display_name: lineProfile.displayName })
        .eq("id", userId);
    }

    // 4. Generate magic link → client will verify OTP to get session
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
