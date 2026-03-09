import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  event: { name_thai: string; theme: string; end_date: string } | null;
}

const themeEmojis: Record<string, string> = {
  songkran: "💦",
  christmas: "🎄",
  halloween: "🎃",
  loy_krathong: "🏮",
  new_year: "🎆",
  valentine: "💕",
};

const themeGradients: Record<string, string> = {
  songkran: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
  christmas: "from-red-500/20 via-green-500/20 to-red-600/20",
  halloween: "from-orange-500/20 via-purple-500/20 to-orange-600/20",
  loy_krathong: "from-yellow-500/20 via-amber-500/20 to-yellow-600/20",
  new_year: "from-purple-500/20 via-pink-500/20 to-purple-600/20",
  valentine: "from-pink-500/20 via-rose-500/20 to-pink-600/20",
};

const themeBorderColors: Record<string, string> = {
  songkran: "border-cyan-500/40",
  christmas: "border-red-500/40",
  halloween: "border-orange-500/40",
  loy_krathong: "border-amber-500/40",
  new_year: "border-purple-500/40",
  valentine: "border-pink-500/40",
};

const EventBanner = ({ event }: Props) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    if (!event) return;

    const calcCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(event.end_date).getTime();
      const diff = Math.max(0, end - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      setCountdown({ days, hours });
    };

    calcCountdown();
    const interval = setInterval(calcCountdown, 60000); // อัพเดตทุกนาที
    return () => clearInterval(interval);
  }, [event]);

  if (!event) return null;

  const emoji = themeEmojis[event.theme] || "🎉";
  const gradient = themeGradients[event.theme] || "from-indigo-500/20 via-purple-500/20 to-indigo-600/20";
  const borderColor = themeBorderColors[event.theme] || "border-indigo-500/40";

  const isExpired = countdown.days === 0 && countdown.hours === 0;

  if (isExpired) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 p-3 transition-all",
        "bg-gradient-to-r",
        gradient,
        borderColor,
        "animate-in fade-in slide-in-from-top-2 duration-500"
      )}
      style={{
        backgroundSize: "200% 200%",
        animation: "gradient-shift 3s ease infinite, fadeIn 0.5s ease",
      }}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          animation: "shimmer 2s infinite",
        }}
      />

      <div className="relative flex items-center justify-between gap-3">
        {/* Left: emoji + info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-2xl flex-shrink-0">{emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{event.name_thai}</p>
            <p className="text-xs text-muted-foreground">
              {"เหลือ "}{countdown.days}{" วัน "}{countdown.hours}{" ชม."}
            </p>
          </div>
        </div>

        {/* Right: button */}
        <button
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
            "border border-white/20"
          )}
          onClick={() => {
            // นำทางไปหน้า event
            window.location.hash = "#event";
          }}
        >
          ดูรายละเอียด
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default EventBanner;
