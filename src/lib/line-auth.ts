import { supabase } from "@/integrations/supabase/client";

// LINE Login configuration
// Set these in your .env file:
//   VITE_LINE_CHANNEL_ID=your_line_channel_id
const LINE_CHANNEL_ID = import.meta.env.VITE_LINE_CHANNEL_ID;
const LINE_AUTH_URL = "https://access.line.me/oauth2/v2.1/authorize";

/**
 * Generate a random state string for CSRF protection
 */
function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Redirect user to LINE Login authorization page
 */
export function redirectToLineLogin() {
  const state = generateState();
  sessionStorage.setItem("line_oauth_state", state);

  const redirectUri = `${window.location.origin}/auth/line/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINE_CHANNEL_ID,
    redirect_uri: redirectUri,
    state,
    scope: "profile openid",
  });

  window.location.href = `${LINE_AUTH_URL}?${params.toString()}`;
}

/**
 * Handle LINE OAuth callback — exchange code for session
 */
export async function handleLineCallback(
  code: string,
  state: string
): Promise<{ success: boolean; error?: string }> {
  // Verify state to prevent CSRF
  const savedState = sessionStorage.getItem("line_oauth_state");
  if (state !== savedState) {
    return { success: false, error: "Invalid state parameter" };
  }
  sessionStorage.removeItem("line_oauth_state");

  const redirectUri = `${window.location.origin}/auth/line/callback`;

  // Call our Edge Function to exchange code for tokens
  const { data, error } = await supabase.functions.invoke("line-auth", {
    body: { code, redirect_uri: redirectUri },
  });

  if (error) {
    console.error("LINE auth edge function error:", error);
    return { success: false, error: "เข้าสู่ระบบด้วย LINE ล้มเหลว" };
  }

  if (data?.error) {
    return { success: false, error: data.error };
  }

  // Verify OTP with the hashed token to get a session
  const { error: otpError } = await supabase.auth.verifyOtp({
    token_hash: data.hashed_token,
    type: "magiclink",
  });

  if (otpError) {
    console.error("OTP verification error:", otpError);
    return { success: false, error: "เข้าสู่ระบบด้วย LINE ล้มเหลว" };
  }

  return { success: true };
}
