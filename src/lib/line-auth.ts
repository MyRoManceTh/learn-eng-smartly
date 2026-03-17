import { supabase } from "@/integrations/supabase/client";

/**
 * Redirect user to LINE Login authorization page
 */
export async function redirectToLineLogin() {
  const { data, error } = await supabase.functions.invoke("line-login-url", {
    body: {},
  });

  if (error || !data?.login_url) {
    throw new Error("Failed to get LINE login URL");
  }

  window.location.href = data.login_url;
}

/**
 * Handle LINE OAuth callback — exchange code for session
 */
export async function handleLineCallback(
  code: string,
  state: string
): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> {
  const { data, error } = await supabase.functions.invoke("line-auth", {
    body: { code, state },
  });

  if (error) {
    console.error("LINE auth edge function error:", error);
    return { success: false, error: "เข้าสู่ระบบด้วย LINE ล้มเหลว" };
  }

  if (data?.error) {
    return { success: false, error: data.error };
  }

  const { error: otpError } = await supabase.auth.verifyOtp({
    token_hash: data.hashed_token,
    type: "magiclink",
  });

  if (otpError) {
    console.error("OTP verification error:", otpError);
    return { success: false, error: "เข้าสู่ระบบด้วย LINE ล้มเหลว" };
  }

  return { success: true, isNewUser: data.is_new_user };
}
