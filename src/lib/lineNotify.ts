import { supabase } from "@/integrations/supabase/client";

type NotifyType =
  | "friend_energy"
  | "friend_request"
  | "friend_accepted"
  | "streak_tier_up"
  | "league_promote"
  | "league_demote"
  | "challenge_received"
  | "gift_received"
  | "level_up";

/**
 * Send a LINE + in-app notification via edge function.
 * Fire-and-forget — errors are logged but don't block the UI.
 */
export async function sendLineNotify(
  type: NotifyType,
  targetUserId: string,
  senderName?: string,
  data?: Record<string, unknown>
) {
  try {
    await supabase.functions.invoke("line-notify", {
      body: {
        type,
        target_user_id: targetUserId,
        sender_name: senderName,
        data,
      },
    });
  } catch (err) {
    console.warn("line-notify failed (non-blocking):", err);
  }
}
