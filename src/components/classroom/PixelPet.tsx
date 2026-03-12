import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { RoomItem } from "@/types/room";
import {
  generatePetSpriteSheet,
  PET_FRAME_W,
  PET_FRAME_H,
} from "@/lib/pixi/petSpriteSheet";

// ── Pet speech lines (bilingual) ──
const PET_SPEECHES: Record<string, { th: string; en: string }[]> = {
  pet_hippo: [
    { th: "อ้อน~ หิวแล้ว 🍉", en: "Cuddle~ I'm hungry!" },
    { th: "เล่นด้วย~", en: "Play with me~" },
    { th: "ง่วงจัง 💤", en: "So sleepy..." },
    { th: "รักเจ้าของ 💕", en: "Love you, owner!" },
  ],
  pet_calico: [
    { th: "เหมียว~ 🐾", en: "Meow~" },
    { th: "กรน กรน...", en: "Purrrr..." },
    { th: "เกาคางให้หน่อย", en: "Scratch my chin!" },
    { th: "ง่วงแล้ว..zzz", en: "Sleepy..zzz" },
  ],
  pet_corgi: [
    { th: "โฮ่ง! โฮ่ง! 🐕", en: "Woof! Woof!" },
    { th: "พาไปเดินเล่น~", en: "Walk me please~" },
    { th: "กระดิกหาง!", en: "Tail wagging!" },
    { th: "ขาสั้นแต่ใจสู้!", en: "Short legs, big heart!" },
  ],
  pet_hamster: [
    { th: "จี๊ดๆ~ 🌻", en: "Squeak~" },
    { th: "เมล็ดทานตะวัน!", en: "Sunflower seeds!" },
    { th: "แก้มป่อง~", en: "Cheeky cheeks~" },
    { th: "วิ่งวงล้อ!", en: "Wheel time!" },
  ],
  pet_penguin: [
    { th: "หนาวดี~ ❄️", en: "Nice and cold~" },
    { th: "เดินโย้กเย้ก~", en: "Waddle waddle~" },
    { th: "ปลา! ปลา!", en: "Fish! Fish!" },
    { th: "กอดหน่อย~", en: "Hug me~" },
  ],
  pet_redpanda: [
    { th: "ไม้ไผ่อร่อย~ 🎋", en: "Yummy bamboo~" },
    { th: "หางฟูๆ!", en: "Fluffy tail!" },
    { th: "น่ารักใช่ไหม~", en: "Cute, right~?" },
  ],
  pet_sloth: [
    { th: "ช้าๆ ได้พร้าสองเล่ม 🦥", en: "Slow and steady~" },
    { th: "...zzZ zzZ...", en: "...zzZ zzZ..." },
    { th: "ไม่รีบนะ~", en: "No rush~" },
  ],
  pet_axolotl: [
    { th: "บลั๊บ บลั๊บ 💧", en: "Blub blub~" },
    { th: "เหงือกสีชมพู~", en: "Pink gills~" },
    { th: "ยิ้ม~ 😊", en: "Smiling~" },
  ],
  pet_bunny: [
    { th: "กระโดด! 🐇", en: "Hop hop!" },
    { th: "อยากกินแครอท!", en: "Want carrots!" },
    { th: "นุ่มนิ่ม~", en: "So fluffy~" },
  ],
  pet_dragon: [
    { th: "ฟี้~ 🔥", en: "Rawr~ 🔥" },
    { th: "พ่นไฟเล็กๆ!", en: "Tiny fire breath!" },
    { th: "รักเจ้าของนะ 💕", en: "Love you, master!" },
  ],
};

const DEFAULT_SPEECHES = [
  { th: "สวัสดี~", en: "Hello~" },
  { th: "เล่นด้วย!", en: "Play with me!" },
  { th: "รักนะ 💕", en: "Love you!" },
];

interface PixelPetProps {
  pet: RoomItem;
  charX: number;
}

type PetState = "idle" | "walking" | "approaching" | "cuddling";

const PixelPet = ({ pet, charX }: PixelPetProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [petX, setPetX] = useState(65);
  const [petState, setPetState] = useState<PetState>("idle");
  const [petDirection, setPetDirection] = useState<"left" | "right">("left");
  const [speech, setSpeech] = useState<{ th: string; en: string } | null>(null);
  const [walkDur, setWalkDur] = useState(2);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef(0);
  const animTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speeches = useMemo(
    () => PET_SPEECHES[pet.id] || DEFAULT_SPEECHES,
    [pet.id]
  );

  // Generate pet sprite sheet & animate on canvas
  const sheetData = useMemo(() => generatePetSpriteSheet(pet.id), [pet.id]);

  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, PET_FRAME_W, PET_FRAME_H);
    ctx.drawImage(
      sheetData.canvas,
      frameIdx * PET_FRAME_W, 0, PET_FRAME_W, PET_FRAME_H,
      0, 0, PET_FRAME_W, PET_FRAME_H,
    );
  }, [sheetData]);

  // Animation loop
  useEffect(() => {
    renderFrame(0);

    animTimerRef.current = setInterval(() => {
      const isMoving = petState === "walking" || petState === "approaching";
      const anim = isMoving ? sheetData.animations.walk : sheetData.animations.idle;
      const frameIdx = anim.startFrame + (animFrameRef.current % anim.frameCount);
      animFrameRef.current++;
      renderFrame(frameIdx);
    }, 300);

    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
    };
  }, [petState, renderFrame, sheetData]);

  // ── Main behavior loop ──
  useEffect(() => {
    const doAction = () => {
      const roll = Math.random();

      if (roll < 0.35) {
        const target = 15 + Math.random() * 70;
        const dist = Math.abs(target - petX);
        const dur = Math.max(1.5, Math.min(3.5, dist * 0.035));
        setPetDirection(target > petX ? "right" : "left");
        setWalkDur(dur);
        setPetState("walking");
        setPetX(target);
        timerRef.current = setTimeout(() => {
          setPetState("idle");
          timerRef.current = setTimeout(doAction, 1500 + Math.random() * 2500);
        }, dur * 1000);
      } else if (roll < 0.65) {
        const offset = Math.random() > 0.5 ? 6 : -6;
        const target = Math.max(10, Math.min(90, charX + offset));
        const dist = Math.abs(target - petX);
        const dur = Math.max(1, Math.min(3, dist * 0.03));
        setPetDirection(target > petX ? "right" : "left");
        setWalkDur(dur);
        setPetState("approaching");
        setPetX(target);
        timerRef.current = setTimeout(() => {
          setPetState("cuddling");
          const line = speeches[Math.floor(Math.random() * speeches.length)];
          setSpeech(line);
          speechTimerRef.current = setTimeout(() => setSpeech(null), 3500);
          timerRef.current = setTimeout(() => {
            setPetState("idle");
            timerRef.current = setTimeout(doAction, 2000 + Math.random() * 3000);
          }, 4000);
        }, dur * 1000);
      } else if (roll < 0.85) {
        setPetState("idle");
        const line = speeches[Math.floor(Math.random() * speeches.length)];
        setSpeech(line);
        speechTimerRef.current = setTimeout(() => setSpeech(null), 3000);
        timerRef.current = setTimeout(doAction, 4000 + Math.random() * 2000);
      } else {
        setPetState("idle");
        timerRef.current = setTimeout(doAction, 2000 + Math.random() * 3000);
      }
    };

    timerRef.current = setTimeout(doAction, 500 + Math.random() * 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, []);

  const animClass =
    petState === "cuddling"
      ? "animate-[wiggle_0.5s_ease-in-out_infinite]"
      : "";

  return (
    <>
      {/* Pet pixel sprite */}
      <div
        className="absolute z-[7] pointer-events-none"
        style={{
          left: `${petX}%`,
          bottom: "13%",
          transform: `translateX(-50%) scaleX(${petDirection === "left" ? -1 : 1})`,
          transition: `left ${walkDur}s ease-in-out`,
          filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.25))",
        }}
      >
        <div className={animClass}>
          <canvas
            ref={canvasRef}
            width={PET_FRAME_W}
            height={PET_FRAME_H}
            style={{
              width: 44,
              height: 44,
              imageRendering: "pixelated",
            }}
          />
        </div>
      </div>

      {/* Speech bubble */}
      {speech && (
        <div
          className="absolute z-[20] pointer-events-none animate-fade-in"
          style={{
            left: `${petX}%`,
            bottom: "28%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg border border-white/80 max-w-[140px]">
            <p className="text-[9px] md:text-[10px] font-thai font-bold text-foreground leading-tight">
              {speech.th}
            </p>
            <p className="text-[8px] md:text-[9px] text-muted-foreground leading-tight mt-0.5">
              {speech.en}
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 border-r border-b border-white/80 rotate-45" />
          </div>
        </div>
      )}

      {/* Hearts when cuddling */}
      {petState === "cuddling" && (
        <div
          className="absolute z-[15] pointer-events-none"
          style={{
            left: `${petX}%`,
            bottom: "25%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex gap-1">
            <span className="text-xs animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.8s" }}>💕</span>
            <span className="text-[10px] animate-bounce" style={{ animationDelay: "200ms", animationDuration: "0.9s" }}>❤️</span>
            <span className="text-xs animate-bounce" style={{ animationDelay: "400ms", animationDuration: "0.7s" }}>💕</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PixelPet;
