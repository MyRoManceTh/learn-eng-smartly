import { skillTreePaths } from "@/data/skillTreeData";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathSwitcherProps {
  activePath: string;
  onPathChange: (pathId: string) => void;
  getPathProgress?: (pathId: string) => number;
}

const PathSwitcher = ({ activePath, onPathChange, getPathProgress }: PathSwitcherProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {skillTreePaths.map((path) => {
        const isActive = path.id === activePath;
        const isLocked = path.isLocked;
        const progress = getPathProgress ? getPathProgress(path.id) : -1;

        return (
          <button
            key={path.id}
            onClick={() => !isLocked && onPathChange(path.id)}
            disabled={isLocked}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border-2 text-sm font-thai whitespace-nowrap transition-all duration-300 flex-shrink-0",
              isActive && cn(
                "bg-gradient-to-r border-white/30 text-white",
                "shadow-lg scale-[1.02]",
                path.color,
                "shadow-[0_4px_0_0_rgba(0,0,0,0.2)]"
              ),
              !isActive && !isLocked && cn(
                "bg-white/5 border-white/10 text-white/60",
                "hover:bg-white/10 hover:text-white/80 hover:scale-[1.02] hover:border-white/20",
                "active:scale-[0.98]"
              ),
              isLocked && "bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed opacity-50"
            )}
          >
            <span className={cn(
              "text-lg transition-transform duration-300",
              isActive && "animate-sway"
            )} style={{ display: 'inline-block' }}>
              {path.icon}
            </span>
            <span className="text-xs font-bold">{path.nameThai}</span>
            {!isLocked && progress >= 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
              )}>
                {progress}%
              </span>
            )}
            {isLocked && <Lock className="w-3 h-3 ml-0.5" />}
            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PathSwitcher;
