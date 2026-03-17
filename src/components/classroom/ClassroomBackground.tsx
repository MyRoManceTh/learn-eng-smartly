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
        {/* Hard pixel edge between wall and floor — no gradient */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 4, backgroundColor: "#0e1119" }}
        />
        {/* Subtle darkening at top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 40%)" }}
        />
        {/* Room label — retro pixel style */}
        <div className="absolute top-2 left-3 z-10">
          <span className="retro-label text-[7px] md:text-[9px]">
            MY CLASSROOM
          </span>
        </div>
      </div>

      {/* FLOOR (bottom 50%) — pixel grid pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        style={{ ...floorStyle, backgroundSize: "24px 24px" }}
      >
        {/* Hard top edge highlight */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 2, backgroundColor: "rgba(255,255,255,0.2)" }}
        />
        {/* Grid overlay for pixel floor tiles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(0deg, transparent 95%, rgba(0,0,0,0.6) 100%), linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.6) 100%)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Ambient light — only for non-dark themes */}
      {!isDark && (
        <div
          className="absolute top-0 right-0 w-1/3 h-[50%] pointer-events-none z-[1]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,200,0.1) 0%, transparent 50%)",
          }}
        />
      )}
    </>
  );
};

export default ClassroomBackground;
