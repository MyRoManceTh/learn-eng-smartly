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

      {/* Hover glow — Star-Office-UI style (gold, no rounded) */}
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          boxShadow: "0 0 8px 2px rgba(255,215,0,0.4)",
          border: "1px solid rgba(255,215,0,0.3)",
        }}
      />

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
        />
        {/* Flat pixel shadow under furniture */}
        <div
          className="mx-auto -mt-0.5"
          style={{
            width: displayW * 0.6,
            height: 3,
            backgroundColor: "rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* Zone label — retro pixel style */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="retro-label text-[5px] md:text-[7px]">
          {zone.nameEn}
        </span>
      </div>
    </div>
  );
};

export default ClassroomZone;
