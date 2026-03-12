import { useRef, useEffect } from "react";
import type { ClassroomZone as ZoneType } from "@/types/classroom";
import { generateFurnitureCanvas, getFurnitureSize } from "@/lib/pixi/furnitureSprites";
import "@/components/ui/8bit/styles/retro.css";

interface ClassroomZoneProps {
  zone: ZoneType;
  active?: boolean;
  onClick: () => void;
}

const ClassroomZone = ({ zone, active, onClick }: ClassroomZoneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnRef = useRef(false);

  // Draw pixel furniture onto canvas
  useEffect(() => {
    if (drawnRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const furnitureCanvas = generateFurnitureCanvas(zone.id);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(furnitureCanvas, 0, 0);
    drawnRef.current = true;
  }, [zone.id]);

  const size = getFurnitureSize(zone.id);
  // Scale 3× for display (pixel art looks good at integer scales)
  const displayW = size.w * 2;
  const displayH = size.h * 2;

  return (
    <div
      className={`absolute cursor-pointer group transition-transform duration-150 ${
        active ? "scale-95" : "hover:scale-105"
      }`}
      style={{
        left: zone.furniturePosition.left,
        bottom: zone.furniturePosition.bottom,
        zIndex: zone.furniturePosition.zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Extended hit area for mobile */}
      <div className="absolute -inset-4" />

      {/* Hover glow effect */}
      <div className="absolute -inset-2 rounded-lg bg-yellow-200/0 group-hover:bg-yellow-200/30 transition-colors duration-300 group-hover:animate-pulse" />

      {/* Pixel art furniture */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size.w}
          height={size.h}
          style={{
            width: displayW,
            height: displayH,
            imageRendering: "pixelated",
          }}
          className="drop-shadow-lg"
        />
        {/* Shadow under furniture */}
        <div
          className="mx-auto -mt-0.5 rounded-full bg-black/15 blur-[2px]"
          style={{ width: displayW * 0.7, height: 4 }}
        />
      </div>

      {/* Zone label */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="retro text-[5px] md:text-[7px] px-1 py-0.5 rounded bg-black/20 text-white/80">
          {zone.nameEn}
        </span>
      </div>
    </div>
  );
};

export default ClassroomZone;
