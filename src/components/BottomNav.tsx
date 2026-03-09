import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Route, Library, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: BookOpen, label: "เรียน" },
  { path: "/path", icon: Route, label: "เส้นทาง" },
  { path: "/library", icon: Library, label: "คลังนิทาน" },
  { path: "/profile", icon: User, label: "โปรไฟล์" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
      <div className="bg-card/90 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_24px_-4px_hsl(var(--foreground)/0.08)]">
        <div className="flex items-center justify-around h-[68px] px-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path === "/library" && location.pathname === "/" && new URLSearchParams(location.search).get("tab") === "library");
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-2xl transition-all duration-200 active:scale-90",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-300",
                    isActive && "bg-primary/12 scale-110"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[22px] h-[22px] transition-all duration-200",
                      isActive && "stroke-[2.5]"
                    )}
                  />
                </div>
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
