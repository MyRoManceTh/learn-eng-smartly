import type { ClassroomZone as ZoneType } from "@/types/classroom";
import "@/components/ui/8bit/styles/retro.css";

interface ClassroomZoneProps {
  zone: ZoneType;
  active?: boolean;
  onClick: () => void;
}

const ClassroomZone = ({ zone, active, onClick }: ClassroomZoneProps) => {
  return (
    <div
      className={`absolute cursor-pointer group transition-transform duration-150 ${
        active ? "scale-95" : "hover:scale-105"
      }`}
      style={{
        left: zone.furniturePosition.left,
        bottom: zone.furniturePosition.bottom,
        zIndex: zone.furniturePosition.zIndex,
        transform: `scale(${zone.furniturePosition.scale || 1})`,
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

      {/* Main furniture emoji */}
      <div className="relative">
        <span className="text-2xl md:text-3xl block drop-shadow-lg">{zone.furnitureEmoji}</span>
        {/* Shadow under furniture */}
        <div className="w-5 h-1.5 mx-auto -mt-0.5 rounded-full bg-black/15 blur-[2px]" />
      </div>

      {/* Decor emojis */}
      {zone.decorEmojis?.map((emoji, i) => (
        <span
          key={i}
          className="absolute text-xs md:text-sm opacity-70"
          style={{
            top: i === 0 ? "-8px" : "auto",
            bottom: i === 1 ? "-4px" : "auto",
            right: i === 0 ? "-12px" : "auto",
            left: i === 1 ? "-10px" : "auto",
          }}
        >
          {emoji}
        </span>
      ))}

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
