import { SkillTreeModule } from "@/data/skillTreeData";
import { CheckCircle2, Lock, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillTreeNodeProps {
  module: SkillTreeModule;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  progress: { completed: number; total: number };
  onClick: () => void;
}

const levelColorMap: Record<number, {
  bg: string; border: string; text: string; badge: string; glow: string;
  ring: string; shadow: string;
}> = {
  1: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/50",
    text: "text-purple-400",
    badge: "bg-purple-500 text-white",
    glow: "shadow-purple-500/30",
    ring: "stroke-purple-500",
    shadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
  2: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/50",
    text: "text-blue-400",
    badge: "bg-blue-500 text-white",
    glow: "shadow-blue-500/30",
    ring: "stroke-blue-500",
    shadow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  },
  3: {
    bg: "bg-green-500/10",
    border: "border-green-500/50",
    text: "text-green-400",
    badge: "bg-green-500 text-white",
    glow: "shadow-green-500/30",
    ring: "stroke-green-500",
    shadow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
  },
  4: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/50",
    text: "text-amber-400",
    badge: "bg-amber-500 text-white",
    glow: "shadow-amber-500/30",
    ring: "stroke-amber-500",
    shadow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
  5: {
    bg: "bg-red-500/10",
    border: "border-red-500/50",
    text: "text-red-400",
    badge: "bg-red-500 text-white",
    glow: "shadow-red-500/30",
    ring: "stroke-red-500",
    shadow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  },
};

// SVG circular progress ring
const ProgressRing = ({ progress, size = 52, strokeWidth = 3, color }: {
  progress: number; size?: number; strokeWidth?: number; color: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" strokeWidth={strokeWidth}
        className="stroke-white/10"
      />
      {/* Progress */}
      {progress > 0 && (
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(color, "transition-all duration-700 ease-out")}
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
  const colors = levelColorMap[module.level] || levelColorMap[1];
  const progressPct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={cn(
        "group relative flex items-center gap-3 w-full rounded-2xl p-3 transition-all duration-300 border",
        isCompleted && cn(colors.bg, colors.border, colors.shadow),
        isCurrent && !isCompleted && cn(colors.bg, colors.border, "animate-glow-pulse", colors.shadow),
        isUnlocked && !isCompleted && !isCurrent && cn(
          "bg-white/[0.03] border-white/10",
          "hover:border-white/25 hover:bg-white/[0.06] hover:shadow-lg"
        ),
        !isUnlocked && "bg-white/[0.01] border-white/5 opacity-35 cursor-not-allowed"
      )}
    >
      {/* Icon with SVG ring */}
      <div className="relative w-[52px] h-[52px] flex-shrink-0">
        <ProgressRing
          progress={isUnlocked ? progressPct : 0}
          color={colors.ring}
        />
        <div
          className={cn(
            "absolute inset-[4px] rounded-xl flex items-center justify-center text-xl transition-all duration-300",
            isCompleted && cn(colors.badge),
            isCurrent && !isCompleted && cn(colors.bg, "border", colors.border),
            isUnlocked && !isCompleted && !isCurrent && cn("bg-white/5 group-hover:scale-110"),
            !isUnlocked && "bg-white/5"
          )}
        >
          {!isUnlocked ? (
            <Lock className="w-4 h-4 text-white/20" />
          ) : isCompleted ? (
            <span className="relative">
              {module.icon}
              <CheckCircle2 className="absolute -right-1.5 -bottom-1.5 w-4 h-4 text-white drop-shadow-md" />
            </span>
          ) : (
            <span>{module.icon}</span>
          )}
        </div>

        {/* Play badge for current */}
        {isCurrent && !isCompleted && (
          <span className={cn(
            "absolute -right-1 -top-1 w-5 h-5 rounded-full flex items-center justify-center animate-bounce z-10",
            colors.badge
          )}>
            <Play className="w-3 h-3 fill-current" />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="text-left flex-1 min-w-0">
        <p className={cn(
          "text-sm font-bold font-thai truncate",
          isCompleted ? colors.text : isUnlocked ? "text-white" : "text-white/25"
        )}>
          {module.nameThai}
        </p>
        <p className={cn(
          "text-xs truncate",
          isCompleted ? "text-white/50" : isUnlocked ? "text-white/35" : "text-white/15"
        )}>
          {module.name}
        </p>

        {/* Stars + progress count */}
        {isUnlocked && (
          <div className="flex items-center gap-2 mt-1">
            {isCompleted ? (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-3.5 h-3.5",
                      progressPct >= (s / 3) * 100
                        ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]"
                        : "text-white/10"
                    )}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-white/30 font-thai">
                {progress.completed}/{progress.total}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Play arrow */}
      {isUnlocked && !isCompleted && (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:translate-x-0.5",
          isCurrent ? cn(colors.badge, "shadow-lg") : "bg-white/10 group-hover:bg-white/15"
        )}>
          <Play className={cn(
            "w-4 h-4 fill-current",
            isCurrent ? "text-white" : "text-white/40"
          )} />
        </div>
      )}

      {/* Reward badge */}
      {module.reward && isCompleted && (
        <div className="absolute -right-1 -bottom-1 text-xs bg-amber-500/90 text-white px-1.5 py-0.5 rounded-lg font-bold shadow-lg backdrop-blur-sm">
          {module.reward.type === 'coins' ? '🪙' : module.reward.type === 'exp' ? '⚡' : '🎁'}
        </div>
      )}
    </button>
  );
};

export default SkillTreeNode;
