import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { EquippedItems } from "@/types/avatar";
import { RoomLayout } from "@/types/room";
import { getRoomItem, WALLPAPER_COLORS, FLOOR_COLORS } from "@/data/roomItems";
import PixelAvatar from "@/components/avatar/PixelAvatar";
import "@/components/ui/8bit/styles/retro.css";

interface PixelRoomProps {
  equipped: EquippedItems;
  room: RoomLayout;
  evolutionStage: number;
  size?: "sm" | "md" | "lg";
}

const PixelRoom = ({ equipped, room, evolutionStage, size = "md" }: PixelRoomProps) => {
  const [charX, setCharX] = useState(50);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [walkDuration, setWalkDuration] = useState(0.5);
  const [autoWalking, setAutoWalking] = useState(true);
  const roomRef = useRef<HTMLDivElement>(null);
  const autoWalkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-walk: wander back and forth when idle
  useEffect(() => {
    if (!autoWalking) return;

    const wander = () => {
      // Pick a random target between 15-85%
      const target = 15 + Math.random() * 70;
      const distance = Math.abs(target - charX);
      const duration = Math.max(1.5, Math.min(4, distance * 0.04));

      setDirection(target > charX ? "right" : "left");
      setWalkDuration(duration);
      setIsWalking(true);
      setCharX(target);

      // Schedule next wander after arriving + idle pause
      const idlePause = 1500 + Math.random() * 3000;
      autoWalkTimer.current = setTimeout(() => {
        setIsWalking(false);
        autoWalkTimer.current = setTimeout(wander, idlePause);
      }, duration * 1000);
    };

    // Start first wander after a short delay
    autoWalkTimer.current = setTimeout(wander, 1000 + Math.random() * 2000);

    return () => {
      if (autoWalkTimer.current) clearTimeout(autoWalkTimer.current);
    };
  }, [autoWalking]); // intentionally only depend on autoWalking flag

  const wallStyle = useMemo(() => {
    const wall = WALLPAPER_COLORS[room.wallpaper || "wall_basic"] || WALLPAPER_COLORS.wall_basic;
    return { backgroundColor: wall.bg, backgroundImage: wall.pattern };
  }, [room.wallpaper]);

  const floorStyle = useMemo(() => {
    const floor = FLOOR_COLORS[room.floor || "floor_wood"] || FLOOR_COLORS.floor_wood;
    return { backgroundColor: floor.bg, backgroundImage: floor.pattern };
  }, [room.floor]);

  const placedItems = useMemo(() => {
    return room.items
      .map((id) => getRoomItem(id))
      .filter(Boolean);
  }, [room.items]);

  const wallItems = placedItems.filter(
    (i) => i && ["poster", "window", "shelf"].includes(i.category)
  );
  const floorLeftItems = placedItems.filter(
    (i) => i && ["desk", "shelf"].includes(i.category)
  );
  const floorRightItems = placedItems.filter(
    (i) => i && ["bed", "toy"].includes(i.category)
  );
  const groundItems = placedItems.filter(
    (i) => i && ["plant", "pet", "trophy", "toy"].includes(i.category)
  );

  const sizeClasses = {
    sm: "h-40",
    md: "h-56",
    lg: "h-72",
  };

  const isDark = room.wallpaper === "wall_space" || room.wallpaper === "wall_ocean";

  // Click-to-walk handler (overrides auto-walk)
  const handleRoomClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!roomRef.current) return;

    // Stop auto-walking when user clicks
    setAutoWalking(false);
    if (autoWalkTimer.current) clearTimeout(autoWalkTimer.current);

    const rect = roomRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const floorTop = rect.height * 0.6;
    if (clickY < floorTop) return;

    setClickPos({ x: clickX, y: clickY });
    setTimeout(() => setClickPos(null), 500);

    const targetPercent = Math.max(10, Math.min(90, (clickX / rect.width) * 100));
    const newDirection = targetPercent > charX ? "right" : "left";
    setDirection(newDirection);

    const distance = Math.abs(targetPercent - charX);
    const duration = Math.max(0.3, Math.min(2.0, distance * 0.025));

    setWalkDuration(duration);
    setIsWalking(true);
    setCharX(targetPercent);

    // Resume auto-walking after 8 seconds of no clicks
    if (autoWalkTimer.current) clearTimeout(autoWalkTimer.current);
    autoWalkTimer.current = setTimeout(() => setAutoWalking(true), 8000);
  }, [charX]);

  const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    // Only respond to our own "left" transition, not child element transitions
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "left") return;
    setIsWalking(false);
  }, []);

  return (
    <div
      ref={roomRef}
      className={`relative w-full ${sizeClasses[size]} rounded-none overflow-hidden pixelated cursor-pointer select-none`}
      style={{ imageRendering: "pixelated" }}
      onClick={handleRoomClick}
    >
      {/* === PIXEL BORDER (8-bit frame) === */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Top border */}
        <div className="absolute top-0 left-2 right-2 h-2 bg-foreground dark:bg-ring" />
        {/* Bottom border */}
        <div className="absolute bottom-0 left-2 right-2 h-2 bg-foreground dark:bg-ring" />
        {/* Left border */}
        <div className="absolute top-2 left-0 bottom-2 w-2 bg-foreground dark:bg-ring" />
        {/* Right border */}
        <div className="absolute top-2 right-0 bottom-2 w-2 bg-foreground dark:bg-ring" />
        {/* Corners */}
        <div className="absolute top-0 left-0 w-2 h-2" />
        <div className="absolute top-0 right-0 w-2 h-2" />
        <div className="absolute bottom-0 left-0 w-2 h-2" />
        <div className="absolute bottom-0 right-0 w-2 h-2" />
      </div>

      {/* === WALL (top 60%) === */}
      <div
        className="absolute top-0 left-0 right-0 h-[60%]"
        style={wallStyle}
      >
        {/* Wall items - posters, windows */}
        <div className="absolute inset-x-4 top-2 bottom-0 flex items-start justify-around gap-2 pt-3">
          {wallItems.map((item) =>
            item ? (
              <div
                key={item.id}
                className="flex flex-col items-center animate-fade-in"
                title={item.nameThai}
              >
                <span className="text-2xl md:text-3xl drop-shadow-md">{item.pixel}</span>
              </div>
            ) : null
          )}
        </div>

        {/* Room name tag */}
        <div className={`absolute top-3 left-4 retro text-[8px] md:text-[10px] px-2 py-0.5 rounded-sm ${isDark ? "bg-white/20 text-white" : "bg-black/10 text-black/60"}`}>
          MY ROOM
        </div>
      </div>

      {/* === FLOOR (bottom 40%) === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={floorStyle}
      >
        {/* Floor divider line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/20" />

        {/* Left side items - desk area */}
        <div className="absolute left-4 top-2 flex gap-2 items-end">
          {floorLeftItems.map((item) =>
            item ? (
              <span key={item.id} className="text-xl md:text-2xl drop-shadow" title={item.nameThai}>
                {item.pixel}
              </span>
            ) : null
          )}
        </div>

        {/* Right side items - bed area */}
        <div className="absolute right-4 top-2 flex gap-2 items-end">
          {floorRightItems.map((item) =>
            item ? (
              <span key={item.id} className="text-xl md:text-2xl drop-shadow" title={item.nameThai}>
                {item.pixel}
              </span>
            ) : null
          )}
        </div>

        {/* Ground items - near character */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 items-end">
          {groundItems.map((item) =>
            item ? (
              <span
                key={item.id}
                className={`text-lg md:text-xl drop-shadow ${item.category === "pet" ? "animate-bounce" : ""}`}
                style={item.category === "pet" ? { animationDuration: "2s" } : undefined}
                title={item.nameThai}
              >
                {item.pixel}
              </span>
            ) : null
          )}
        </div>
      </div>

      {/* === CHARACTER (click-to-walk) === */}
      <div
        className="absolute bottom-[25%] z-10"
        style={{
          left: `${charX}%`,
          transform: "translateX(-50%)",
          transition: `left ${walkDuration}s ease-in-out`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <PixelAvatar
          equipped={equipped}
          size={size}
          animated
          evolutionStage={evolutionStage}
          walking={isWalking}
          direction={direction}
        />
      </div>

      {/* === Evolution glow effects === */}
      {evolutionStage >= 3 && (
        <div
          className="absolute bottom-[20%] w-20 h-20 z-0 pointer-events-none"
          style={{
            left: `${charX}%`,
            transform: "translateX(-50%)",
            transition: `left ${walkDuration}s ease-in-out`,
          }}
        >
          <div
            className="w-full h-full rounded-full blur-xl animate-pulse"
            style={{
              backgroundColor:
                evolutionStage >= 5
                  ? "rgba(255,215,0,0.3)"
                  : evolutionStage >= 4
                    ? "rgba(147,51,234,0.25)"
                    : "rgba(59,130,246,0.2)",
            }}
          />
        </div>
      )}

      {/* === Click indicator === */}
      {clickPos && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: clickPos.x - 3,
            top: clickPos.y - 3,
          }}
        >
          <div className="w-1.5 h-1.5 bg-white/70 animate-ping" style={{ animationDuration: "0.5s" }} />
        </div>
      )}
    </div>
  );
};

export default PixelRoom;
