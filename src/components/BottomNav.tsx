import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Route, User, Library } from "lucide-react";
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

  // Hide on auth page
  if (location.pathname === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
            (tab.path === "/library" && location.pathname === "/" && new URLSearchParams(location.search).get("tab") === "library");
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-thai font-medium">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
