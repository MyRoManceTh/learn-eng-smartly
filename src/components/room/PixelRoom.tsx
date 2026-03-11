import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { EquippedItems } from "@/types/avatar";
import { RoomLayout } from "@/types/room";
import { getRoomItem, WALLPAPER_COLORS, FLOOR_COLORS, PET_IMAGES } from "@/data/roomItems";
import { PetCareState } from "@/data/petCare";
import PixelAvatar from "@/components/avatar/PixelAvatar";
import RoomPet from "@/components/room/RoomPet";
import "@/components/ui/8bit/styles/retro.css";

interface PixelRoomProps {
  equipped: EquippedItems;
  room: RoomLayout;
  evolutionStage: number;
  size?: "sm" | "md" | "lg";
  petCare?: PetCareState;
}

/* ── furniture slot positions (percentage-based for responsiveness) ── */
const SLOT_POSITIONS: Record<string, { left: string; bottom: string; zIndex: number; scale?: number }> = {
  // Wall-mounted items
  poster: { left: "15%", bottom: "55%", zIndex: 2 },
  window: { left: "70%", bottom: "55%", zIndex: 2 },
  // Floor items – left side
  shelf: { left: "5%", bottom: "28%", zIndex: 4, scale: 1.1 },
  desk: { left: "8%", bottom: "18%", zIndex: 5, scale: 1.2 },
  // Floor items – right side
  bed: { left: "72%", bottom: "22%", zIndex: 4, scale: 1.3 },
  // Ground items
  plant: { left: "88%", bottom: "30%", zIndex: 5 },
  trophy: { left: "30%", bottom: "50%", zIndex: 3 },
  pet: { left: "55%", bottom: "12%", zIndex: 6 },
  toy: { left: "42%", bottom: "15%", zIndex: 5, scale: 1.1 },
};

const PixelRoom = ({ equipped, room, evolutionStage, size = "md", petCare }: PixelRoomProps) => {
  const [charX, setCharX] = useState(50);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [walkDuration, setWalkDuration] = useState(0.5);
  const [autoWalking, setAutoWalking] = useState(true);
  const roomRef = useRef<HTMLDivElement>(null);
  const autoWalkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-walk
  useEffect(() => {
    if (!autoWalking) return;
    const wander = () => {
      const target = 20 + Math.random() * 60;
      const distance = Math.abs(target - charX);
      const duration = Math.max(1.5, Math.min(4, distance * 0.04));
      setDirection(target > charX ? "right" : "left");
      setWalkDuration(duration);
      setIsWalking(true);
      setCharX(target);
      const idlePause = 1500 + Math.random() * 3000;
      autoWalkTimer.current = setTimeout(() => {
        setIsWalking(false);
        autoWalkTimer.current = setTimeout(wander, idlePause);
      }, duration * 1000);
    };
    autoWalkTimer.current = setTimeout(wander, 1000 + Math.random() * 2000);
    return () => { if (autoWalkTimer.current) clearTimeout(autoWalkTimer.current); };
  }, [autoWalking]);

  const wallStyle = useMemo(() => {
    const wall = WALLPAPER_COLORS[room.wallpaper || "wall_basic"] || WALLPAPER_COLORS.wall_basic;
    return { backgroundColor: wall.bg, backgroundImage: wall.pattern };
  }, [room.wallpaper]);

  const floorStyle = useMemo(() => {
    const floor = FLOOR_COLORS[room.floor || "floor_wood"] || FLOOR_COLORS.floor_wood;
    return { backgroundColor: floor.bg, backgroundImage: floor.pattern };
  }, [room.floor]);

  const placedItems = useMemo(() => {
    return room.items.map((id) => getRoomItem(id)).filter(Boolean);
  }, [room.items]);

  const petItems = useMemo(() => placedItems.filter((i) => i?.category === "pet"), [placedItems]);
  const nonPetItems = useMemo(() => placedItems.filter((i) => i?.category !== "pet"), [placedItems]);

  const sizeClasses = { sm: "h-48", md: "h-64", lg: "h-80" };
  const isDark = room.wallpaper === "wall_space" || room.wallpaper === "wall_ocean";

  // Click-to-walk
  const handleRoomClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!roomRef.current) return;
    setAutoWalking(false);
    if (autoWalkTimer.current) clearTimeout(autoWalkTimer.current);
    const rect = roomRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const floorTop = rect.height * 0.5;
    if (clickY < floorTop) return;
    setClickPos({ x: clickX, y: clickY });
    setTimeout(() => setClickPos(null), 500);
    const targetPercent = Math.max(15, Math.min(85, (clickX / rect.width) * 100));
    setDirection(targetPercent > charX ? "right" : "left");
    const distance = Math.abs(targetPercent - charX);
    setWalkDuration(Math.max(0.3, Math.min(2.0, distance * 0.025)));
    setIsWalking(true);
    setCharX(targetPercent);
    if (autoWalkTimer.current) clearTimeout(autoWalkTimer.current);
    autoWalkTimer.current = setTimeout(() => setAutoWalking(true), 8000);
  }, [charX]);

  const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "left") return;
    setIsWalking(false);
  }, []);

  return (
    <div
      ref={roomRef}
      className={`relative w-full ${sizeClasses[size]} rounded-xl overflow-hidden cursor-pointer select-none`}
      style={{ imageRendering: "pixelated" }}
      onClick={handleRoomClick}
    >
      {/* ── 8-bit pixel border ── */}
      <div className="absolute inset-0 z-30 pointer-events-none rounded-xl" style={{
        boxShadow: "inset 0 0 0 3px hsl(var(--foreground) / 0.8), inset 0 0 0 5px hsl(var(--foreground) / 0.15)",
      }} />

      {/* ── BACK WALL (top 50%) ── */}
      <div className="absolute top-0 left-0 right-0 h-[50%]" style={wallStyle}>
        {/* Baseboard / trim */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-800/40 to-amber-900/60" />

        {/* Wall shadow for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/15 pointer-events-none" />

        {/* Room label */}
        <div className={`absolute top-2 left-3 retro text-[7px] md:text-[9px] px-2 py-0.5 rounded ${isDark ? "bg-white/15 text-white/70" : "bg-black/8 text-black/40"}`}>
          MY ROOM
        </div>

        {/* Wall-mounted furniture */}
        {nonPetItems.map((item) => {
          if (!item) return null;
          const slot = SLOT_POSITIONS[item.category];
          if (!slot || parseFloat(slot.bottom) < 40) return null; // only wall items
          return (
            <div
              key={item.id}
              className="absolute animate-fade-in transition-all duration-300"
              style={{
                left: slot.left,
                bottom: slot.bottom,
                zIndex: slot.zIndex,
                transform: `scale(${slot.scale || 1})`,
              }}
              title={item.nameThai}
            >
              {/* Shadow/frame behind poster/window */}
              <div className="relative">
                {item.category === "poster" && (
                  <div className="absolute inset-0 -m-1 bg-amber-900/30 rounded-sm" />
                )}
                <span className="text-3xl md:text-4xl drop-shadow-lg relative z-10 block">
                  {item.pixel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FLOOR (bottom 50%) with perspective ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        style={{
          ...floorStyle,
          backgroundSize: "24px 24px",
        }}
      >
        {/* Floor edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-white/20 via-white/40 to-white/20" />
        {/* Floor depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/15 pointer-events-none" />

        {/* Grid lines for game feel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(0deg, transparent 95%, rgba(0,0,0,0.5) 100%), linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.5) 100%)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floor furniture items (non-pet) */}
        {nonPetItems.map((item) => {
          if (!item) return null;
          const slot = SLOT_POSITIONS[item.category];
          if (!slot || parseFloat(slot.bottom) >= 40) return null;
          return (
            <div
              key={item.id}
              className="absolute animate-fade-in transition-all duration-500"
              style={{
                left: slot.left,
                bottom: slot.bottom,
                zIndex: slot.zIndex,
                transform: `scale(${slot.scale || 1})`,
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
              }}
              title={item.nameThai}
            >
              <span className="text-2xl md:text-3xl block">{item.pixel}</span>
              <div className="w-5 h-1.5 mx-auto -mt-0.5 rounded-full bg-black/15 blur-[2px]" />
            </div>
          );
        })}
      </div>

      {/* ── PETS (autonomous walking) ── */}
      {petItems.map((pet) =>
        pet ? <RoomPet key={pet.id} pet={pet} charX={charX} petCare={petCare} /> : null
      )}

      {/* ── Ambient light effect ── */}
      {!isDark && (
        <div className="absolute top-0 right-0 w-1/3 h-[50%] pointer-events-none z-1"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,200,0.15) 0%, transparent 60%)",
          }}
        />
      )}

      {/* ── CHARACTER ── */}
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
        <PixelAvatar
          equipped={equipped}
          size="sm"
          animated
          evolutionStage={evolutionStage}
          walking={isWalking}
          direction={direction}
        />
      </div>

      {/* ── Evolution glow ── */}
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
                evolutionStage >= 5 ? "rgba(255,215,0,0.35)"
                  : evolutionStage >= 4 ? "rgba(147,51,234,0.3)"
                    : "rgba(59,130,246,0.25)",
            }}
          />
        </div>
      )}

      {/* ── Click indicator ── */}
      {clickPos && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: clickPos.x - 4, top: clickPos.y - 4 }}
        >
          <div className="w-2 h-2 rounded-full bg-white/80 animate-ping" style={{ animationDuration: "0.4s" }} />
        </div>
      )}

      {/* ── Decorative corner icons ── */}
      <div className="absolute bottom-2 right-3 z-20 pointer-events-none opacity-40">
        <span className="text-[8px] retro" style={{ color: isDark ? "#fff" : "#000" }}>🎮 TAP TO WALK</span>
      </div>
    </div>
  );
};

export default PixelRoom;
