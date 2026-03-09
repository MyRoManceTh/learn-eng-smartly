import { supabase } from "@/integrations/supabase/client";

/**
 * ติดตามพฤติกรรมผู้ใช้ — fire-and-forget, ไม่ block UI
 */
export const trackEvent = (eventType: string, eventData: Record<string, any> = {}) => {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return;
    supabase
      .from("analytics_events")
      .insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
      } as any)
      .then();
  });
};
