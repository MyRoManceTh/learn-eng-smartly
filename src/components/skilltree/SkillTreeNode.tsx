import { SkillTreeModule } from "@/data/skillTreeData";
import { Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillTreeNodeProps {
  module: SkillTreeModule;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  progress: { completed: number; total: number };
  onClick: () => void;
}

// Level → cartoon color themes
const levelTheme: Record<number, {
  bg: string; border: string; shadow: string; glow: string;
  ring: string; starColor: string; label: string;
}> = {
  1: {
    bg: "bg-gradient-to-br from-violet-400 to-purple-600",
    border: "border-violet-300",
    shadow: "shadow-[0_6px_0_0_rgb(109,40,217)]",
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.5)]",
    ring: "stroke-violet-400",
    starColor: "text-amber-400 fill-amber-400",
    label: "text-violet-300",
  },
  2: {
    bg: "bg-gradient-to-br from-sky-400 to-blue-600",
    border: "border-sky-300",
    shadow: "shadow-[0_6px_0_0_rgb(29,78,216)]",
    glow: "shadow-[0_0_24px_rgba(56,189,248,0.5)]",
    ring: "stroke-sky-400",
    starColor: "text-amber-400 fill-amber-400",
    label: "text-sky-300",
  },
  3: {
    bg: "bg-gradient-to-br from-emerald-400 to-green-600",
    border: "border-emerald-300",
    shadow: "shadow-[0_6px_0_0_rgb(21,128,61)]",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.5)]",
    ring: "stroke-emerald-400",
    starColor: "text-amber-400 fill-amber-400",
    label: "text-emerald-300",
  },
  4: {
    bg: "bg-gradient-to-br from-amber-400 to-orange-600",
    border: "border-amber-300",
    shadow: "shadow-[0_6px_0_0_rgb(194,65,12)]",
    glow: "shadow-[0_0_24px_rgba(251,191,36,0.5)]",
    ring: "stroke-amber-400",
    starColor: "text-amber-400 fill-amber-400",
    label: "text-amber-300",
  },
  5: {
    bg: "bg-gradient-to-br from-rose-400 to-red-600",
    border: "border-rose-300",
    shadow: "shadow-[0_6px_0_0_rgb(185,28,28)]",
    glow: "shadow-[0_0_24px_rgba(251,113,133,0.5)]",
    ring: "stroke-rose-400",
    starColor: "text-amber-400 fill-amber-400",
    label: "text-rose-300",
  },
};

// Progress ring SVG
const ProgressRing = ({ progress, size = 80, strokeWidth = 4, colorClass }: {
  progress: number; size?: number; strokeWidth?: number; colorClass: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" strokeWidth={strokeWidth}
        className="stroke-white/10"
      />
      {progress > 0 && (
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(colorClass, "transition-all duration-700 ease-out")}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      )}
    </svg>
  );
};

const SkillTreeNode = ({
  module,
  isUnlocked,
  isCompleted,
  isCurrent,
  progress,
  onClick,
}: SkillTreeNodeProps) => {
  const theme = levelTheme[module.level] || levelTheme[1];
  const progressPct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Bouncing arrow for current node */}
      {isCurrent && !isCompleted && (
        <div className="animate-hop text-2xl -mb-1 drop-shadow-lg">
          👇
        </div>
      )}

      {/* Main circle button */}
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={cn(
          "relative w-[76px] h-[76px] rounded-full transition-all duration-300 flex items-center justify-center",
          // Completed: golden crown style
          isCompleted && cn(
            "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500",
            "border-[4px] border-amber-200",
            "shadow-[0_6px_0_0_rgb(180,83,9),0_0_20px_rgba(251,191,36,0.4)]",
            "hover:scale-105 active:scale-95 active:shadow-[0_2px_0_0_rgb(180,83,9)]",
            "active:translate-y-1"
          ),
          // Current: vibrant + glow pulse
          isCurrent && !isCompleted && cn(
            theme.bg,
            "border-[4px]", theme.border,
            theme.shadow, theme.glow,
            "animate-float-gentle",
            "hover:scale-110 active:scale-95 active:translate-y-1",
            "cursor-pointer"
          ),
          // Unlocked: colored but subdued
          isUnlocked && !isCompleted && !isCurrent && cn(
            theme.bg, "opacity-75",
            "border-[4px] border-white/20",
            theme.shadow,
            "hover:opacity-100 hover:scale-105 active:scale-95 active:translate-y-1",
            "cursor-pointer"
          ),
          // Locked: grey
          !isUnlocked && cn(
            "bg-gradient-to-br from-slate-600 to-slate-700",
            "border-[4px] border-slate-500/50",
            "shadow-[0_6px_0_0_rgb(51,65,85)]",
            "opacity-50 cursor-not-allowed"
          )
        )}
      >
        {/* Progress ring (only for unlocked, non-completed) */}
        {isUnlocked && !isCompleted && progressPct > 0 && (
          <ProgressRing progress={progressPct} colorClass={theme.ring} />
        )}

        {/* Icon or lock */}
        <span className={cn(
          "relative z-10 select-none transition-transform duration-200",
          isCompleted ? "text-3xl drop-shadow-md" : "text-2xl",
          !isUnlocked && "grayscale"
        )}>
          {!isUnlocked ? (
            <Lock className="w-6 h-6 text-slate-400" />
          ) : (
            module.icon
          )}
        </span>

        {/* Completed checkmark badge */}
        {isCompleted && (
          <span className="absolute -right-0.5 -top-0.5 w-7 h-7 rounded-full bg-green-500 border-[3px] border-green-300 flex items-center justify-center shadow-lg z-20 animate-cartoon-pop">
            <span className="text-sm">✓</span>
          </span>
        )}

        {/* Reward badge */}
        {module.reward && isCompleted && (
          <span className="absolute -left-1 -bottom-1 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold shadow-md z-20 animate-cartoon-pop border-2 border-amber-300">
            {module.reward.type === 'coins' ? '🪙' : module.reward.type === 'exp' ? '⚡' : '🎁'}
          </span>
        )}

        {/* Sparkle effects for completed */}
        {isCompleted && (
          <>
            <span className="absolute -top-2 -right-3 text-sm animate-sparkle-twinkle" style={{ animationDelay: '0ms' }}>✨</span>
            <span className="absolute -bottom-1 -left-3 text-xs animate-sparkle-twinkle" style={{ animationDelay: '600ms' }}>⭐</span>
          </>
        )}
      </button>

      {/* Stars for completed modules */}
      {isCompleted && (
        <div className="flex items-center gap-0.5 -mt-0.5">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={cn(
                "w-4 h-4 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]",
                progressPct >= (s / 3) * 100
                  ? "text-amber-400 fill-amber-400"
                  : "text-white/20 fill-white/10"
              )}
            />
          ))}
        </div>
      )}

      {/* Module name label */}
      <div className="text-center max-w-[100px]">
        <p className={cn(
          "text-xs font-bold font-thai leading-tight truncate",
          isCompleted ? "text-amber-300" : isUnlocked ? "text-white/90" : "text-white/30"
        )}>
          {module.nameThai}
        </p>
        {/* Progress count for in-progress */}
        {isUnlocked && !isCompleted && progress.completed > 0 && (
          <p className="text-[10px] text-white/40 font-thai mt-0.5">
            {progress.completed}/{progress.total}
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillTreeNode;
