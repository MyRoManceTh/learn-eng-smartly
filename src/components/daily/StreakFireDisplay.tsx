import { cn } from "@/lib/utils";
import { getStreakTier, getNextStreakTier } from "@/data/streakTiers";

interface Props {
  streak: number;
  size?: "sm" | "md";
}

const StreakFireDisplay = ({ streak, size = "md" }: Props) => {
  const isSm = size === "sm";
  const tier = getStreakTier(streak);
  const nextTier = getNextStreakTier(streak);

  const TierBadge = () => {
    if (!tier || isSm) return null;
    return (
      <span className={cn(
        "text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r text-white ml-1",
        tier.color
      )}>
        {tier.emoji} {tier.nameThai}
      </span>
    );
  };

  // ระดับ 0: ไม่มีไฟ
  if (streak <= 0) {
    return (
      <div className="flex items-center gap-0.5">
        <span
          className={cn(
            "text-muted-foreground font-bold",
            isSm ? "text-sm" : "text-base"
          )}
        >
          0
        </span>
      </div>
    );
  }

  // ระดับ 1-2: ไฟเล็กสีส้ม
  if (streak <= 2) {
    return (
      <div className="flex items-center gap-0.5">
        <span className={isSm ? "text-base" : "text-lg"}>🔥</span>
        <span
          className={cn(
            "font-bold text-orange-500",
            isSm ? "text-sm" : "text-base"
          )}
        >
          {streak}
        </span>
        <TierBadge />
      </div>
    );
  }

  // ระดับ 3-6: ไฟเคลื่อนไหวพร้อม pulse
  if (streak <= 6) {
    return (
      <div className="flex items-center gap-0.5 relative">
        <span
          className={cn(
            "animate-pulse",
            isSm ? "text-lg" : "text-xl"
          )}
        >
          🔥
        </span>
        <span
          className={cn(
            "font-bold text-orange-500",
            isSm ? "text-sm" : "text-base"
          )}
        >
          {streak}
        </span>
        <TierBadge />
      </div>
    );
  }

  // ระดับ 7-13: ไฟคู่พร้อมเรืองแสง
  if (streak <= 13) {
    return (
      <div className="flex items-center gap-0.5 relative">
        {/* เอฟเฟกต์เรืองแสง */}
        <div
          className={cn(
            "absolute -inset-1 rounded-full bg-orange-500/20 blur-md animate-pulse",
            isSm ? "scale-75" : ""
          )}
        />
        <div className="relative flex items-center">
          <span
            className={cn(
              "animate-bounce",
              isSm ? "text-lg" : "text-xl"
            )}
            style={{ animationDuration: "1s" }}
          >
            🔥
          </span>
          <span
            className={cn(
              "animate-bounce -ml-1.5",
              isSm ? "text-sm" : "text-base"
            )}
            style={{ animationDuration: "1.2s", animationDelay: "0.1s" }}
          >
            🔥
          </span>
        </div>
        <span
          className={cn(
            "relative font-extrabold text-orange-400",
            isSm ? "text-sm" : "text-base"
          )}
        >
          {streak}
        </span>
        <TierBadge />
      </div>
    );
  }

  // ระดับ 14+: ไฟสีน้ำเงิน/เรนโบว์ พร้อมเรืองแสงแรง
  return (
    <div className="flex items-center gap-0.5 relative">
      {/* เอฟเฟกต์เรืองแสงแรง */}
      <div
        className={cn(
          "absolute -inset-2 rounded-full blur-lg animate-pulse",
          "bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30",
          isSm ? "scale-75" : ""
        )}
      />
      <div
        className={cn(
          "absolute -inset-1 rounded-full blur-md animate-pulse",
          "bg-blue-400/25",
          isSm ? "scale-75" : ""
        )}
        style={{ animationDuration: "1.5s" }}
      />
      <div className="relative flex items-center">
        <span
          className={cn(
            "animate-bounce drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]",
            isSm ? "text-xl" : "text-2xl"
          )}
          style={{ animationDuration: "0.8s" }}
        >
          🔥
        </span>
        <span
          className={cn(
            "animate-bounce -ml-2 drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]",
            isSm ? "text-lg" : "text-xl"
          )}
          style={{ animationDuration: "1s", animationDelay: "0.15s" }}
        >
          🔥
        </span>
      </div>
      <span
        className={cn(
          "relative font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent",
          isSm ? "text-sm" : "text-lg"
        )}
      >
        {streak}
      </span>
      <TierBadge />
    </div>
  );
};

export default StreakFireDisplay;
