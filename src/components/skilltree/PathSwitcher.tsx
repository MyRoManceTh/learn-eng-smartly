import { skillTreePaths } from "@/data/skillTreeData";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathSwitcherProps {
  activePath: string;
  onPathChange: (pathId: string) => void;
  getPathProgress?: (pathId: string) => number;
}

// Short labels that fit on mobile
const shortLabels: Record<string, string> = {
  core: "พื้นฐาน",
  business: "ธุรกิจ",
  travel: "ท่องเที่ยว",
  entertainment: "บันเทิง",
  tech: "เทค",
};

const PathSwitcher = ({ activePath, onPathChange, getPathProgress }: PathSwitcherProps) => {
  return (
    <div className="grid grid-cols-5 gap-1.5">
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
              "relative flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-300",
              isActive && cn(
                "bg-gradient-to-b border-2",
                path.color, "border-white/30",
                "shadow-lg"
              ),
              !isActive && !isLocked && cn(
                "bg-white/5 border-2 border-transparent",
                "hover:bg-white/10 active:scale-95"
              ),
              isLocked && "opacity-40 cursor-not-allowed"
            )}
          >
            {/* Icon circle */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300",
              isActive && "bg-white/20 scale-110",
              !isActive && !isLocked && "bg-white/10",
              isLocked && "bg-white/5"
            )}>
              {isLocked ? (
                <Lock className="w-4 h-4 text-white/30" />
              ) : (
                <span className={cn(
                  isActive && "animate-sway",
                )} style={{ display: 'inline-block' }}>
                  {path.icon}
                </span>
              )}
            </div>

            {/* Label */}
            <span className={cn(
              "text-[10px] font-bold font-thai leading-tight text-center",
              isActive ? "text-white" : isLocked ? "text-white/20" : "text-white/50"
            )}>
              {shortLabels[path.id] || path.nameThai}
            </span>

            {/* Progress badge */}
            {!isLocked && progress > 0 && (
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full -mt-0.5",
                isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/30"
              )}>
                {progress}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PathSwitcher;
