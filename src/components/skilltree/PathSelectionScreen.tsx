import { skillTreePaths, SkillTreePath } from "@/data/skillTreeData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathSelectionScreenProps {
  onSelect: (pathId: string) => void;
  onBack: () => void;
  currentPath?: string;
  isCoreLevel1Done: boolean;
}

// Specialty paths only (exclude core)
const specialtyPaths = skillTreePaths.filter((p) => p.id !== "core");

// Card themes for each path
const cardThemes: Record<string, {
  gradient: string;
  border: string;
  glow: string;
  iconBg: string;
  shadow: string;
}> = {
  business: {
    gradient: "from-blue-500/20 via-cyan-500/10 to-blue-600/5",
    border: "border-blue-400/40",
    glow: "shadow-[0_0_30px_rgba(56,189,248,0.15)]",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
    shadow: "shadow-[0_6px_0_0_rgb(29,78,216)]",
  },
  travel: {
    gradient: "from-green-500/20 via-emerald-500/10 to-green-600/5",
    border: "border-emerald-400/40",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    shadow: "shadow-[0_6px_0_0_rgb(21,128,61)]",
  },
  entertainment: {
    gradient: "from-pink-500/20 via-rose-500/10 to-pink-600/5",
    border: "border-pink-400/40",
    glow: "shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    shadow: "shadow-[0_6px_0_0_rgb(159,18,57)]",
  },
  tech: {
    gradient: "from-amber-500/20 via-orange-500/10 to-amber-600/5",
    border: "border-amber-400/40",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    shadow: "shadow-[0_6px_0_0_rgb(194,65,12)]",
  },
};

const PathCard = ({
  path,
  isLocked,
  isSelected,
  onSelect,
  index,
}: {
  path: SkillTreePath;
  isLocked: boolean;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const theme = cardThemes[path.id] || cardThemes.business;

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        "relative flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300",
        "animate-cartoon-bounce",
        // Active/selected state
        isSelected && cn(
          "bg-gradient-to-b", theme.gradient,
          theme.border, theme.glow,
          "scale-[1.03] ring-2 ring-white/20"
        ),
        // Normal unlocked state
        !isSelected && !isLocked && cn(
          "bg-gradient-to-b", theme.gradient,
          "border-white/10",
          "hover:border-white/25 hover:scale-[1.02] hover:shadow-lg",
          "active:scale-[0.98]"
        ),
        // Locked state
        isLocked && cn(
          "bg-white/[0.03] border-white/5",
          "opacity-50 cursor-not-allowed"
        )
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Icon circle */}
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300",
        "border-[3px]",
        isLocked
          ? "bg-slate-700 border-slate-600"
          : cn(theme.iconBg, "border-white/30", theme.shadow),
        isSelected && "scale-110 animate-float-gentle"
      )}>
        {isLocked ? (
          <Lock className="w-6 h-6 text-slate-400" />
        ) : (
          <span className="drop-shadow-lg">{path.icon}</span>
        )}
      </div>

      {/* Path name */}
      <div className="text-center">
        <p className={cn(
          "text-sm font-bold font-thai",
          isLocked ? "text-white/30" : "text-white"
        )}>
          {path.nameThai}
        </p>
        <p className={cn(
          "text-[11px] mt-0.5",
          isLocked ? "text-white/15" : "text-white/50"
        )}>
          {path.name}
        </p>
      </div>

      {/* Description */}
      <p className={cn(
        "text-[11px] font-thai leading-relaxed text-center",
        isLocked ? "text-white/15" : "text-white/40"
      )}>
        {path.descriptionThai}
      </p>

      {/* Lock reason */}
      {isLocked && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
          <Lock className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/30 font-thai">
            จบพื้นฐาน A1 ก่อน
          </span>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-[3px] border-green-300 flex items-center justify-center shadow-lg animate-cartoon-pop">
          <span className="text-sm">✓</span>
        </div>
      )}
    </button>
  );
};

const PathSelectionScreen = ({
  onSelect,
  onBack,
  currentPath,
  isCoreLevel1Done,
}: PathSelectionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 pb-20 md:pb-0 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["⚔️", "🛡️", "📜", "🗡️", "✨", "🌟", "💫", "⭐"].map((emoji, i) => (
          <span
            key={i}
            className="absolute animate-float-gentle opacity-10 text-2xl"
            style={{
              left: `${(i * 27 + 5) % 95}%`,
              top: `${(i * 31 + 10) % 90}%`,
              animationDelay: `${i * 500}ms`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับแผนที่
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-8 relative">
        {/* Epic title */}
        <div className="text-center mb-8 animate-cartoon-pop">
          <div className="text-5xl mb-3 animate-float-gentle">⚔️</div>
          <h1 className="text-2xl font-bold text-white font-thai mb-1">
            เลือกเส้นทางผจญภัย
          </h1>
          <p className="text-sm text-white/50">
            Choose Your Adventure Path
          </p>
          <p className="text-xs text-white/30 font-thai mt-2">
            เลือกสายที่สนใจ เปลี่ยนทีหลังได้เสมอ
          </p>
        </div>

        {/* Path cards - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {specialtyPaths.map((path, i) => (
            <PathCard
              key={path.id}
              path={path}
              isLocked={!isCoreLevel1Done}
              isSelected={currentPath === path.id}
              onSelect={() => onSelect(path.id)}
              index={i}
            />
          ))}
        </div>

        {/* Bottom hint */}
        {!isCoreLevel1Done && (
          <div className="mt-6 text-center animate-cartoon-pop" style={{ animationDelay: '600ms' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
              <span className="text-lg">🏰</span>
              <p className="text-xs text-amber-300 font-thai font-bold">
                จบบทเรียนพื้นฐาน A1 เพื่อปลดล็อค
              </p>
            </div>
          </div>
        )}

        {/* Continue with core button */}
        {currentPath && currentPath !== "core" && (
          <div className="mt-6 text-center animate-cartoon-pop" style={{ animationDelay: '500ms' }}>
            <button
              onClick={onBack}
              className={cn(
                "px-6 py-3 rounded-2xl font-thai font-bold text-sm",
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                "border-2 border-white/20",
                "shadow-[0_4px_0_0_rgba(0,0,0,0.3)]",
                "hover:scale-[1.02] active:scale-[0.98] active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(0,0,0,0.3)]",
                "transition-all duration-200"
              )}
            >
              🗺️ ไปผจญภัยเลย!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathSelectionScreen;
