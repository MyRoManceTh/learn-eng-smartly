import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ["admin-check", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();
      return (data as any)?.is_admin === true;
    },
    enabled: !!user,
    staleTime: 5 * 60_000,
  });

  return {
    isAdmin: isAdmin ?? false,
    isLoading: authLoading || adminLoading,
    user,
    isLoggedIn: !!user,
  };
}
