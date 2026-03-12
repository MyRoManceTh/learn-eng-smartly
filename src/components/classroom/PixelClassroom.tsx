import { useRef, useMemo } from "react";
import { EquippedItems } from "@/types/avatar";
import { RoomLayout } from "@/types/room";
import { getRoomItem } from "@/data/roomItems";
import { CLASSROOM_ZONES } from "@/data/classroomZones";
import SpriteAvatar from "@/components/avatar/SpriteAvatar";
import RoomPet from "@/components/room/RoomPet";
import ClassroomBackground from "./ClassroomBackground";
import ClassroomZoneComponent from "./ClassroomZone";
import ClassroomSpeechBubble from "./ClassroomSpeechBubble";
import { useClassroomNavigation } from "./useClassroomNavigation";
import "@/components/ui/8bit/styles/retro.css";

interface PixelClassroomProps {
  equipped: EquippedItems;
  room: RoomLayout;
  evolutionStage: number;
  size?: "sm" | "md" | "lg";
  onZoneNavigate?: (route: string) => void;
}

const PixelClassroom = ({
  equipped,
  room,
  evolutionStage,
  size = "md",
  onZoneNavigate,
}: PixelClassroomProps) => {
  const roomRef = useRef<HTMLDivElement>(null);

  const {
    charX,
    isWalking,
    direction,
    currentPose,
    speech,
    activeZone,
    walkDuration,
    navigateToZone,
    handleFloorClick,
    handleTransitionEnd,
  } = useClassroomNavigation(onZoneNavigate);

  const petItems = useMemo(() => {
    return room.items
      .map((id) => getRoomItem(id))
      .filter((item) => item?.category === "pet");
  }, [room.items]);

  const sizeClasses = { sm: "h-48", md: "h-64", lg: "h-80" };
  const isDark = room.wallpaper === "wall_space" || room.wallpaper === "wall_ocean";

  return (
    <div
      ref={roomRef}
      className={`relative w-full ${sizeClasses[size]} rounded-xl overflow-hidden cursor-pointer select-none`}
      style={{ imageRendering: "pixelated" }}
      onClick={(e) => handleFloorClick(e, roomRef)}
    >
      {/* 8-bit pixel border */}
      <div
        className="absolute inset-0 z-30 pointer-events-none rounded-xl"
        style={{
          boxShadow:
            "inset 0 0 0 3px hsl(var(--foreground) / 0.8), inset 0 0 0 5px hsl(var(--foreground) / 0.15)",
        }}
      />

      {/* Background (wall + floor) */}
      <ClassroomBackground wallpaper={room.wallpaper} floor={room.floor} />

      {/* Interactive furniture zones */}
      {CLASSROOM_ZONES.map((zone) => (
        <ClassroomZoneComponent
          key={zone.id}
          zone={zone}
          active={activeZone === zone.id}
          onClick={() => navigateToZone(zone.id)}
        />
      ))}

      {/* Pets */}
      {petItems.map((pet) =>
        pet ? <RoomPet key={pet.id} pet={pet} charX={charX} /> : null,
      )}

      {/* Speech bubble */}
      <ClassroomSpeechBubble speech={speech} charX={charX} />

      {/* Character */}
      <div
        className="absolute z-10"
        style={{
          left: `${charX}%`,
          bottom: "15%",
          transform: "translateX(-50%)",
          transition: `left ${walkDuration}s ease-in-out`,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <SpriteAvatar
          size="sm"
          walking={isWalking}
          direction={direction}
          pose={currentPose}
        />
      </div>

      {/* Evolution glow */}
      {evolutionStage >= 3 && (
        <div
          className="absolute w-16 h-16 z-0 pointer-events-none"
          style={{
            left: `${charX}%`,
            bottom: "10%",
            transform: "translateX(-50%)",
            transition: `left ${walkDuration}s ease-in-out`,
          }}
        >
          <div
            className="w-full h-full rounded-full blur-xl animate-pulse"
            style={{
              backgroundColor:
                evolutionStage >= 5
                  ? "rgba(255,215,0,0.35)"
                  : evolutionStage >= 4
                    ? "rgba(147,51,234,0.3)"
                    : "rgba(59,130,246,0.25)",
            }}
          />
        </div>
      )}

      {/* Help text */}
      <div className="absolute bottom-2 right-3 z-20 pointer-events-none opacity-40">
        <span
          className="text-[8px] retro"
          style={{ color: isDark ? "#fff" : "#000" }}
        >
          🎮 TAP FURNITURE
        </span>
      </div>
    </div>
  );
};

export default PixelClassroom;
