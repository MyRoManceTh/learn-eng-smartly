import { useNavigate, useLocation } from "react-router-dom";
import { Home, GraduationCap, Gamepad2, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { path: "/", icon: Home, label: "หน้าหลัก" },
  { path: "/learn", icon: GraduationCap, label: "เรียนรู้" },
  { path: "/friends", icon: Users, label: "เพื่อน" },
  { path: "/games", icon: Gamepad2, label: "เกม" },
  { path: "/my", icon: User, label: "ฉัน" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const { count: pendingFriends } = await supabase
        .from("friendships")
        .select("*", { count: "exact", head: true })
        .eq("addressee_id", user.id)
        .eq("status", "pending");

      const { count: pendingGifts } = await supabase
        .from("gift_transactions")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("claimed", false);

      const { count: pendingChallenges } = await supabase
        .from("quiz_challenges")
        .select("*", { count: "exact", head: true })
        .eq("opponent_id", user.id)
        .eq("status", "pending");

      setTotalNotifications((pendingFriends || 0) + (pendingGifts || 0) + (pendingChallenges || 0));
    };
    fetchCounts();
  }, [user, location.pathname]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, path: string) => {
      // Create ripple
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.className = "ripple-effect";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);

      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);

      navigate(path);
    },
    [navigate]
  );

  const hiddenPaths = ["/auth", "/quiz", "/conversation"];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_24px_-4px_rgba(124,58,237,0.08)]">
        <div className="flex items-center justify-around h-[68px] md:h-[72px] px-1 md:px-4 max-w-md md:max-w-2xl mx-auto">
          {tabs.map((tab) => {
            const learnSubPaths = ["/learn", "/practice", "/path", "/reading", "/news", "/pronunciation", "/library", "/flashcards", "/speaking", "/daily-challenge"];
            const friendSubPaths = ["/friends", "/friend-ranking"];
            const isActive =
              location.pathname === tab.path ||
              (tab.path === "/learn" && learnSubPaths.includes(location.pathname)) ||
              (tab.path === "/friends" && friendSubPaths.includes(location.pathname)) ||
              (tab.path === "/my" && ["/profile", "/avatar", "/my"].includes(location.pathname));
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={(e) => handleClick(e, tab.path)}
                className={cn(
                  "relative overflow-hidden flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-2xl transition-all duration-200 active:scale-90",
                  isActive
                    ? "text-purple-600"
                    : "text-gray-400 active:text-gray-600"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-300",
                    isActive && "bg-gradient-to-r from-purple-500/15 to-pink-500/15 scale-110"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[22px] h-[22px] transition-all duration-200",
                      isActive && "stroke-[2.5]"
                    )}
                  />
                </div>
                {tab.path === "/friends" && totalNotifications > 0 && (
                  <div className="absolute top-0.5 right-2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">{totalNotifications > 9 ? '9+' : totalNotifications}</span>
                  </div>
                )}
                <span
                  className={cn(
                    "text-[10px] font-thai leading-tight transition-all duration-200",
                    isActive ? "font-semibold" : "font-medium"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
