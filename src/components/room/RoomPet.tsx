import { useState, useEffect, useRef, useMemo } from "react";
import { PET_IMAGES } from "@/data/roomItems";
import { RoomItem } from "@/types/room";

// ── Pet speech lines (bilingual) ──
const PET_SPEECHES: Record<string, { th: string; en: string }[]> = {
  pet_hippo: [
    { th: "อ้อน~ หิวแล้ว 🍉", en: "Cuddle~ I'm hungry!" },
    { th: "เล่นด้วย~", en: "Play with me~" },
    { th: "ง่วงจัง 💤", en: "So sleepy..." },
    { th: "รักเจ้าของ 💕", en: "Love you, owner!" },
    { th: "อยากกินแตงโม!", en: "Want watermelon!" },
    { th: "ฮิปโปอ้วนๆ~", en: "Chubby hippo~" },
  ],
  pet_calico: [
    { th: "เหมียว~ 🐾", en: "Meow~" },
    { th: "กรน กรน...", en: "Purrrr..." },
    { th: "เกาคางให้หน่อย", en: "Scratch my chin!" },
    { th: "หิวนม~ 🥛", en: "Want milk~" },
    { th: "ง่วงแล้ว..zzz", en: "Sleepy..zzz" },
  ],
  pet_corgi: [
    { th: "โฮ่ง! โฮ่ง! 🐕", en: "Woof! Woof!" },
    { th: "พาไปเดินเล่น~", en: "Walk me please~" },
    { th: "กระดิกหาง!", en: "Tail wagging!" },
    { th: "รักเจ้าของที่สุด!", en: "Love you the most!" },
    { th: "ขาสั้นแต่ใจสู้!", en: "Short legs, big heart!" },
  ],
  pet_hamster: [
    { th: "จี๊ดๆ~ 🌻", en: "Squeak~" },
    { th: "เมล็ดทานตะวัน!", en: "Sunflower seeds!" },
    { th: "แก้มป่อง~", en: "Cheeky cheeks~" },
    { th: "วิ่งวงล้อ!", en: "Wheel time!" },
    { th: "อยากกินเยอะๆ", en: "Want to eat lots!" },
  ],
  pet_penguin: [
    { th: "หนาวดี~ ❄️", en: "Nice and cold~" },
    { th: "อยากไปว่ายน้ำ!", en: "Want to swim!" },
    { th: "เดินโย้กเย้ก~", en: "Waddle waddle~" },
    { th: "ปลา! ปลา!", en: "Fish! Fish!" },
    { th: "กอดหน่อย~", en: "Hug me~" },
  ],
  pet_redpanda: [
    { th: "ไม้ไผ่อร่อย~ 🎋", en: "Yummy bamboo~" },
    { th: "หางฟูๆ!", en: "Fluffy tail!" },
    { th: "ปีนต้นไม้เก่ง!", en: "Great climber!" },
    { th: "ง่วงนอน...", en: "So sleepy..." },
    { th: "น่ารักใช่ไหม~", en: "Cute, right~?" },
  ],
  pet_sloth: [
    { th: "ช้าๆ ได้พร้าสองเล่ม 🦥", en: "Slow and steady~" },
    { th: "...zzZ zzZ...", en: "...zzZ zzZ..." },
    { th: "ห้อยอยู่ดีๆ~", en: "Just hanging~" },
    { th: "ไม่รีบนะ~", en: "No rush~" },
    { th: "นอนอีกนิด...", en: "Five more minutes..." },
  ],
  pet_axolotl: [
    { th: "บลั๊บ บลั๊บ 💧", en: "Blub blub~" },
    { th: "ชอบน้ำเย็นๆ", en: "Love cool water!" },
    { th: "เหงือกสีชมพู~", en: "Pink gills~" },
    { th: "ว่ายน้ำสนุก!", en: "Swimming is fun!" },
    { th: "ยิ้ม~ 😊", en: "Smiling~" },
  ],
  pet_bunny: [
    { th: "กระโดด! 🐇", en: "Hop hop!" },
    { th: "อยากกินแครอท!", en: "Want carrots!" },
    { th: "หูยาวๆ~", en: "Long ears~" },
    { th: "ลูบหัวหน่อย", en: "Pet my head~" },
    { th: "นุ่มนิ่ม~", en: "So fluffy~" },
  ],
  pet_dragon: [
    { th: "ฟี้~ 🔥", en: "Rawr~ 🔥" },
    { th: "พ่นไฟเล็กๆ!", en: "Tiny fire breath!" },
    { th: "บินยังไม่เป็น...", en: "Can't fly yet..." },
    { th: "โตขึ้นจะเป็นมังกรยิ่งใหญ่!", en: "I'll be a great dragon!" },
    { th: "รักเจ้าของนะ 💕", en: "Love you, master!" },
  ],
};

// Fallback speeches for unknown pets
const DEFAULT_SPEECHES = [
  { th: "สวัสดี~", en: "Hello~" },
  { th: "เล่นด้วย!", en: "Play with me!" },
  { th: "รักนะ 💕", en: "Love you!" },
  { th: "หิวแล้ว~", en: "I'm hungry~" },
];

interface RoomPetProps {
  pet: RoomItem;
  charX: number; // character position %
}

type PetState = "idle" | "walking" | "approaching" | "cuddling";

const RoomPet = ({ pet, charX }: RoomPetProps) => {
  const [petX, setPetX] = useState(65);
  const [petState, setPetState] = useState<PetState>("idle");
  const [petDirection, setPetDirection] = useState<"left" | "right">("left");
  const [speech, setSpeech] = useState<{ th: string; en: string } | null>(null);
  const [walkDur, setWalkDur] = useState(2);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const petImage = PET_IMAGES[pet.id];
  const speeches = useMemo(
    () => PET_SPEECHES[pet.id] || DEFAULT_SPEECHES,
    [pet.id]
  );

  // ── Main behavior loop ──
  useEffect(() => {
    const doAction = () => {
      const roll = Math.random();

      if (roll < 0.35) {
        // Wander randomly
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
        // Approach character and cuddle
        const offset = (Math.random() > 0.5 ? 6 : -6);
        const target = Math.max(10, Math.min(90, charX + offset));
        const dist = Math.abs(target - petX);
        const dur = Math.max(1, Math.min(3, dist * 0.03));
        setPetDirection(target > petX ? "right" : "left");
        setWalkDur(dur);
        setPetState("approaching");
        setPetX(target);
        timerRef.current = setTimeout(() => {
          setPetState("cuddling");
          // Show speech bubble
          const line = speeches[Math.floor(Math.random() * speeches.length)];
          setSpeech(line);
          speechTimerRef.current = setTimeout(() => setSpeech(null), 3500);
          // After cuddling, go idle
          timerRef.current = setTimeout(() => {
            setPetState("idle");
            timerRef.current = setTimeout(doAction, 2000 + Math.random() * 3000);
          }, 4000);
        }, dur * 1000);
      } else if (roll < 0.85) {
        // Just speak in place
        setPetState("idle");
        const line = speeches[Math.floor(Math.random() * speeches.length)];
        setSpeech(line);
        speechTimerRef.current = setTimeout(() => setSpeech(null), 3000);
        timerRef.current = setTimeout(doAction, 4000 + Math.random() * 2000);
      } else {
        // Idle pause
        setPetState("idle");
        timerRef.current = setTimeout(doAction, 2000 + Math.random() * 3000);
      }
    };

    timerRef.current = setTimeout(doAction, 500 + Math.random() * 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, []); // Run once on mount

  // ── Bounce/wobble animation based on state ──
  const animClass =
    petState === "walking" || petState === "approaching"
      ? "" // no bounce while walking - CSS transition handles it
      : petState === "cuddling"
        ? "animate-[wiggle_0.5s_ease-in-out_infinite]"
        : ""; // idle: no extra animation

  return (
    <>
      {/* Pet sprite */}
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
          {petImage ? (
            <img
              src={petImage}
              alt={pet.nameThai}
              className="w-9 h-9 md:w-11 md:h-11 object-contain pixelated"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <span className="text-2xl md:text-3xl block">{pet.pixel}</span>
          )}
        </div>
        {/* Shadow */}
        <div className="w-6 h-1.5 mx-auto -mt-1 rounded-full bg-black/15 blur-[2px]" />
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
            {/* Speech text */}
            <p className="text-[9px] md:text-[10px] font-thai font-bold text-foreground leading-tight">
              {speech.th}
            </p>
            <p className="text-[8px] md:text-[9px] text-muted-foreground leading-tight mt-0.5">
              {speech.en}
            </p>
            {/* Tail */}
            <div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 border-r border-b border-white/80 rotate-45"
            />
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

export default RoomPet;
