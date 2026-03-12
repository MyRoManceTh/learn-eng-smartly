import { useMemo } from "react";
import { WALLPAPER_COLORS, FLOOR_COLORS } from "@/data/roomItems";
import "@/components/ui/8bit/styles/retro.css";

interface ClassroomBackgroundProps {
  wallpaper: string;
  floor: string;
}

const ClassroomBackground = ({ wallpaper, floor }: ClassroomBackgroundProps) => {
  const wallStyle = useMemo(() => {
    const wall = WALLPAPER_COLORS[wallpaper || "wall_basic"] || WALLPAPER_COLORS.wall_basic;
    return { backgroundColor: wall.bg, backgroundImage: wall.pattern };
  }, [wallpaper]);

  const floorStyle = useMemo(() => {
    const fl = FLOOR_COLORS[floor || "floor_wood"] || FLOOR_COLORS.floor_wood;
    return { backgroundColor: fl.bg, backgroundImage: fl.pattern };
  }, [floor]);

  const isDark = wallpaper === "wall_space" || wallpaper === "wall_ocean";

  return (
    <>
      {/* BACK WALL (top 50%) */}
      <div className="absolute top-0 left-0 right-0 h-[50%]" style={wallStyle}>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-800/40 to-amber-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/15 pointer-events-none" />
        <div
          className={`absolute top-2 left-3 retro text-[7px] md:text-[9px] px-2 py-0.5 rounded ${
            isDark ? "bg-white/15 text-white/70" : "bg-black/8 text-black/40"
          }`}
        >
          MY CLASSROOM
        </div>
      </div>

      {/* FLOOR (bottom 50%) with perspective */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        style={{ ...floorStyle, backgroundSize: "24px 24px" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-white/20 via-white/40 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/15 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 95%, rgba(0,0,0,0.5) 100%), linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.5) 100%)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Ambient light */}
      {!isDark && (
        <div
          className="absolute top-0 right-0 w-1/3 h-[50%] pointer-events-none z-[1]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,200,0.15) 0%, transparent 60%)",
          }}
        />
      )}
    </>
  );
};

export default ClassroomBackground;
