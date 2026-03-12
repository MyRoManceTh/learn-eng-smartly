import { useEffect, useRef } from "react";
import { SkillTreeModule, levelLabels } from "@/data/skillTreeData";
import SkillTreeNode from "./SkillTreeNode";
import { cn } from "@/lib/utils";

interface SkillTreeMapProps {
  modules: SkillTreeModule[];
  isModuleUnlocked: (module: SkillTreeModule) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  getModuleProgress: (moduleId: string) => { completed: number; total: number };
  onModuleClick: (module: SkillTreeModule) => void;
  nextModuleId: string | null;
  activePath?: string;
  // Branch point (RPG class selection)
  onBranchPointClick?: () => void;
  isCoreLevel1Done?: boolean;
  selectedSpecialty?: string | null;
}

// ─── Wave position calculation ──────────────────
// Creates a smooth zigzag pattern (like Duolingo/Candy Crush path)
const WAVE_AMPLITUDE = 55; // px offset from center

const getWaveX = (index: number): number => {
  return Math.sin((index * Math.PI) / 2.5) * WAVE_AMPLITUDE;
};

// ─── Level zone themes ──────────────────────────
const zoneThemes: Record<number, {
  bg: string;
  label: string;
  labelBg: string;
  labelBorder: string;
  pathColor: string;
  pathColorCompleted: string;
  decoEmojis: string[];
}> = {
  1: {
    bg: "from-green-950/40 via-emerald-950/20 to-transparent",
    label: "text-violet-300",
    labelBg: "bg-violet-500/20",
    labelBorder: "border-violet-500/30",
    pathColor: "rgba(139, 92, 246, 0.2)",
    pathColorCompleted: "rgba(139, 92, 246, 0.6)",
    decoEmojis: ["🌿", "🌸", "🦋", "🍄"],
  },
  2: {
    bg: "from-blue-950/40 via-sky-950/20 to-transparent",
    label: "text-sky-300",
    labelBg: "bg-sky-500/20",
    labelBorder: "border-sky-500/30",
    pathColor: "rgba(56, 189, 248, 0.2)",
    pathColorCompleted: "rgba(56, 189, 248, 0.6)",
    decoEmojis: ["🐚", "🏖️", "🌊", "🐠"],
  },
  3: {
    bg: "from-emerald-950/40 via-green-950/20 to-transparent",
    label: "text-emerald-300",
    labelBg: "bg-emerald-500/20",
    labelBorder: "border-emerald-500/30",
    pathColor: "rgba(52, 211, 153, 0.2)",
    pathColorCompleted: "rgba(52, 211, 153, 0.6)",
    decoEmojis: ["🏔️", "🌲", "🦌", "⛺"],
  },
  4: {
    bg: "from-amber-950/40 via-orange-950/20 to-transparent",
    label: "text-amber-300",
    labelBg: "bg-amber-500/20",
    labelBorder: "border-amber-500/30",
    pathColor: "rgba(251, 191, 36, 0.2)",
    pathColorCompleted: "rgba(251, 191, 36, 0.6)",
    decoEmojis: ["🏜️", "🌵", "🐪", "🦂"],
  },
  5: {
    bg: "from-red-950/40 via-rose-950/20 to-transparent",
    label: "text-rose-300",
    labelBg: "bg-rose-500/20",
    labelBorder: "border-rose-500/30",
    pathColor: "rgba(251, 113, 133, 0.2)",
    pathColorCompleted: "rgba(251, 113, 133, 0.6)",
    decoEmojis: ["🏰", "🐉", "👑", "🔥"],
  },
};

// ─── Cartoon decorative elements ────────────────

const CartoonCloud = ({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-12 h-4", md: "w-20 h-6", lg: "w-28 h-8" };
  const dotSizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  const dot2Sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-10 h-10" };

  return (
    <div className={cn("absolute pointer-events-none animate-float-cloud", className)}>
      <div className="relative">
        <div className={cn("bg-white/[0.06] rounded-full", sizes[size])} />
        <div className={cn("absolute -top-[60%] left-[15%] bg-white/[0.06] rounded-full", dotSizes[size])} />
        <div className={cn("absolute -top-[40%] left-[50%] bg-white/[0.06] rounded-full", dot2Sizes[size])} />
      </div>
    </div>
  );
};

const DecoEmoji = ({ emoji, className }: { emoji: string; className?: string }) => (
  <span className={cn(
    "absolute pointer-events-none text-lg opacity-20 select-none",
    className
  )}>
    {emoji}
  </span>
);

// ─── SVG path segment between two nodes ─────────

const PathSegment = ({
  fromX,
  toX,
  isCompleted,
  isCurrent,
  pathColor,
  completedColor,
}: {
  fromX: number;
  toX: number;
  isCompleted: boolean;
  isCurrent: boolean;
  pathColor: string;
  completedColor: string;
}) => {
  const viewW = 280;
  const viewH = 32;
  const cx = viewW / 2;
  const x1 = cx + fromX;
  const x2 = cx + toX;

  const d = `M ${x1} 0 C ${x1} ${viewH * 0.65}, ${x2} ${viewH * 0.35}, ${x2} ${viewH}`;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="w-full h-8 -my-1"
      preserveAspectRatio="none"
    >
      {/* Background path */}
      <path
        d={d}
        fill="none"
        stroke={pathColor}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Dashed overlay */}
      <path
        d={d}
        fill="none"
        stroke={isCompleted ? completedColor : isCurrent ? completedColor : pathColor}
        strokeWidth={isCompleted ? 4 : 3}
        strokeLinecap="round"
        strokeDasharray={isCompleted ? "none" : "8 8"}
        className={isCurrent && !isCompleted ? "animate-dash-flow" : ""}
      />
    </svg>
  );
};

// ─── Zone header with flag ──────────────────────

const ZoneHeader = ({
  level,
  info,
  allCompleted,
  completedCount,
  total,
}: {
  level: number;
  info: { name: string; cefr: string; icon: string };
  allCompleted: boolean;
  completedCount: number;
  total: number;
}) => {
  const theme = zoneThemes[level] || zoneThemes[1];

  return (
    <div className="flex items-center justify-center gap-3 my-4 mx-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm",
        theme.labelBg, theme.labelBorder
      )}>
        <span className="text-xl animate-sway" style={{ display: 'inline-block' }}>
          {info.icon}
        </span>
        <div className="text-center">
          <p className={cn("text-xs font-bold", theme.label)}>
            Level {level} · {info.cefr}
          </p>
          <p className="text-[10px] text-white/40 font-thai">
            {info.name} {allCompleted && "✅"}
          </p>
        </div>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          allCompleted ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
        )}>
          {completedCount}/{total}
        </span>
      </div>

      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

// ─── Main SkillTreeMap Component ────────────────

const SkillTreeMap = ({
  modules,
  isModuleUnlocked,
  isModuleCompleted,
  getModuleProgress,
  onModuleClick,
  nextModuleId,
  activePath,
  onBranchPointClick,
  isCoreLevel1Done,
  selectedSpecialty,
}: SkillTreeMapProps) => {
  const levels = [...new Set(modules.map((m) => m.level))].sort();
  const currentNodeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current node on mount
  useEffect(() => {
    if (currentNodeRef.current) {
      setTimeout(() => {
        currentNodeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 600);
    }
  }, [nextModuleId]);

  // Track global index across all levels for wave positioning
  let globalIndex = 0;

  return (
    <div className="relative pb-8">
      {/* Floating clouds in background */}
      <CartoonCloud className="top-12 -left-6 opacity-60" size="lg" />
      <CartoonCloud className="top-[200px] -right-4 opacity-40" size="md" />
      <CartoonCloud className="top-[450px] -left-8 opacity-50" size="sm" />
      <CartoonCloud className="top-[700px] -right-6 opacity-30" size="lg" />

      {levels.map((level, levelIdx) => {
        const levelModules = modules.filter((m) => m.level === level);
        const info = levelLabels[level];
        const allCompleted = levelModules.every((m) => isModuleCompleted(m.id));
        const completedCount = levelModules.filter((m) => isModuleCompleted(m.id)).length;
        const theme = zoneThemes[level] || zoneThemes[1];

        // Save the starting globalIndex for this level's first module
        const levelStartIndex = globalIndex;

        return (
          <div key={level} className="relative">
            {/* Zone background gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b pointer-events-none rounded-3xl -mx-2",
              theme.bg,
              "opacity-60"
            )} />

            {/* Decorative emojis scattered in the zone */}
            {theme.decoEmojis.map((emoji, i) => (
              <DecoEmoji
                key={i}
                emoji={emoji}
                className={cn(
                  "animate-float-gentle",
                  i === 0 && "top-16 left-0",
                  i === 1 && "top-[40%] right-0",
                  i === 2 && "bottom-20 left-2",
                  i === 3 && "bottom-8 right-4"
                )}
                // @ts-ignore style prop
                style={{ animationDelay: `${i * 800}ms` }}
              />
            ))}

            {/* Zone header */}
            <ZoneHeader
              level={level}
              info={info}
              allCompleted={allCompleted}
              completedCount={completedCount}
              total={levelModules.length}
            />

            {/* Nodes with winding path */}
            <div className="relative flex flex-col items-center gap-0 py-2">
              {levelModules.map((module, i) => {
                const idx = globalIndex;
                globalIndex++;

                const unlocked = isModuleUnlocked(module);
                const completed = isModuleCompleted(module.id);
                const isCurrent = module.id === nextModuleId;
                const progress = getModuleProgress(module.id);

                const xOffset = getWaveX(idx);
                const nextXOffset = i < levelModules.length - 1 ? getWaveX(idx + 1) : 0;

                // Is the path segment to the next node completed?
                const nextModule = i < levelModules.length - 1 ? levelModules[i + 1] : null;
                const nextCompleted = nextModule ? isModuleCompleted(nextModule.id) : false;
                const nextIsCurrent = nextModule?.id === nextModuleId;

                return (
                  <div key={module.id} className="w-full">
                    {/* The node */}
                    <div
                      ref={isCurrent ? currentNodeRef : undefined}
                      className="flex justify-center animate-cartoon-bounce"
                      style={{
                        transform: `translateX(${xOffset}px)`,
                        animationDelay: `${(idx - levelStartIndex) * 80}ms`,
                      }}
                    >
                      <SkillTreeNode
                        module={module}
                        isUnlocked={unlocked}
                        isCompleted={completed}
                        isCurrent={isCurrent}
                        progress={progress}
                        onClick={() => onModuleClick(module)}
                      />
                    </div>

                    {/* Path segment to next node */}
                    {i < levelModules.length - 1 && (
                      <PathSegment
                        fromX={xOffset}
                        toX={nextXOffset}
                        isCompleted={completed && nextCompleted}
                        isCurrent={completed && (nextIsCurrent || false)}
                        pathColor={theme.pathColor}
                        completedColor={theme.pathColorCompleted}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Branch Point: after level 1 on core path */}
            {level === 1 && activePath === "core" && onBranchPointClick && (
              <div className="flex flex-col items-center gap-3 py-8">
                {/* Connector line */}
                <div className="w-0.5 h-6 bg-gradient-to-b from-violet-500/40 to-transparent rounded-full" />

                {/* Branch point button */}
                <button
                  onClick={onBranchPointClick}
                  disabled={!isCoreLevel1Done}
                  className={cn(
                    "relative flex flex-col items-center gap-2 px-6 py-4 rounded-3xl border-2 transition-all duration-300",
                    isCoreLevel1Done
                      ? cn(
                          "bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-amber-600/5",
                          "border-amber-400/40",
                          "shadow-[0_0_30px_rgba(251,191,36,0.2)]",
                          "hover:scale-[1.03] active:scale-[0.97]",
                          "animate-float-gentle cursor-pointer"
                        )
                      : cn(
                          "bg-white/[0.03] border-white/10",
                          "opacity-50 cursor-not-allowed"
                        )
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center text-3xl border-[3px]",
                    isCoreLevel1Done
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 shadow-[0_6px_0_0_rgb(194,65,12)]"
                      : "bg-slate-700 border-slate-600"
                  )}>
                    {isCoreLevel1Done ? "⚔️" : "🔒"}
                  </div>

                  <p className={cn(
                    "text-sm font-bold font-thai",
                    isCoreLevel1Done ? "text-amber-300" : "text-white/30"
                  )}>
                    {isCoreLevel1Done ? "เลือกสายผจญภัย!" : "จบพื้นฐานก่อน"}
                  </p>

                  <p className={cn(
                    "text-[10px] font-thai",
                    isCoreLevel1Done ? "text-amber-400/60" : "text-white/20"
                  )}>
                    {isCoreLevel1Done
                      ? (selectedSpecialty ? "กดเพื่อเปลี่ยนสาย" : "ปลดล็อคแล้ว! กดเลย")
                      : `จบ A1 ทั้ง ${modules.filter(m => m.level === 1).length} modules`
                    }
                  </p>

                  {/* Sparkle effects when unlocked */}
                  {isCoreLevel1Done && (
                    <>
                      <span className="absolute -top-2 -right-2 text-lg animate-sparkle-twinkle">✨</span>
                      <span className="absolute -bottom-1 -left-2 text-sm animate-sparkle-twinkle" style={{ animationDelay: '700ms' }}>⭐</span>
                    </>
                  )}
                </button>

                {/* Connector to next level */}
                <div className="w-0.5 h-6 bg-gradient-to-b from-transparent to-white/10 rounded-full" />
              </div>
            )}

            {/* Level transition decoration (non-core or non-level-1) */}
            {levelIdx < levels.length - 1 && !(level === 1 && activePath === "core" && onBranchPointClick) && (
              <div className="flex items-center justify-center gap-2 py-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/10" />
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-base animate-float" style={{ animationDelay: '0ms' }}>🏁</span>
                  <span className="text-[10px] text-white/40 font-thai font-bold">
                    {allCompleted ? "สำเร็จ!" : "ด่านต่อไป"}
                  </span>
                  <span className="text-base animate-float" style={{ animationDelay: '500ms' }}>⬇️</span>
                </div>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/10" />
              </div>
            )}
          </div>
        );
      })}

      {/* End-of-path treasure */}
      <div className="flex flex-col items-center gap-2 pt-8 pb-4">
        <div className="text-4xl animate-float-gentle">🏆</div>
        <p className="text-xs text-white/30 font-thai font-bold">จุดหมายปลายทาง</p>
      </div>
    </div>
  );
};

export default SkillTreeMap;
