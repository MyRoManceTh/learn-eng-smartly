import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { EvolutionStage } from "@/types/dopamine";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  previousStage: EvolutionStage;
  newStage: EvolutionStage;
  onClose: () => void;
}

const effectLabels: Record<string, string> = {
  "glow-soft": "เรืองแสงอ่อน",
  "glow-medium": "เรืองแสงกลาง",
  "glow-strong": "เรืองแสงเข้ม",
  "glow-legendary": "เรืองแสงตำนาน",
  sparkle: "ประกายแวววาว",
  aura: "ออร่าพลังงาน",
  particles: "อนุภาคมหัศจรรย์",
};

const EvolutionCelebration = ({ open, previousStage, newStage, onClose }: Props) => {
  const hasFireRef = useRef(false);

  useEffect(() => {
    if (open && !hasFireRef.current) {
      hasFireRef.current = true;

      // Fire confetti bursts
      const fireConfetti = () => {
        // Center burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: [newStage.color, "#FFD700", "#FF69B4", "#00BFFF"],
        });

        // Left burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: [newStage.color, "#FFD700"],
          });
        }, 200);

        // Right burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: [newStage.color, "#FFD700"],
          });
        }, 400);
      };

      fireConfetti();
    }

    if (!open) {
      hasFireRef.current = false;
    }
  }, [open, newStage.color]);

  if (!open) return null;

  // Determine new effects (effects in newStage that weren't in previousStage)
  const newEffects = newStage.effects.filter(
    (e) => !previousStage.effects.includes(e)
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Content Card */}
      <div className="relative z-10 w-[90vw] max-w-sm mx-auto animate-in zoom-in-75 fade-in duration-500">
        <div
          className="rounded-3xl p-6 text-center space-y-5 border-2 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
            borderColor: `${newStage.color}60`,
            boxShadow: `0 0 40px ${newStage.color}30, 0 0 80px ${newStage.color}15`,
          }}
        >
          {/* Header */}
          <h2 className="text-2xl font-bold text-yellow-300 drop-shadow-lg">
            🎉 วิวัฒนาการสำเร็จ!
          </h2>

          {/* Before -> After */}
          <div className="flex items-center justify-center gap-4 py-3">
            {/* Previous Stage */}
            <div className="flex flex-col items-center gap-1 opacity-60">
              <span className="text-4xl grayscale-[30%]">{previousStage.icon}</span>
              <span className="text-xs text-white/50">{previousStage.nameThai}</span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <span className="text-3xl animate-bounce-x text-yellow-400">→</span>
            </div>

            {/* New Stage */}
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-5xl drop-shadow-lg animate-bounce"
                style={{ filter: `drop-shadow(0 0 12px ${newStage.color})` }}
              >
                {newStage.icon}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: newStage.color }}
              >
                {newStage.nameThai}
              </span>
            </div>
          </div>

          {/* New Stage Name */}
          <div
            className="text-xl font-extrabold tracking-wider"
            style={{
              color: newStage.color,
              textShadow: `0 0 20px ${newStage.color}80`,
            }}
          >
            ขั้น {newStage.stage}: {newStage.nameThai}
          </div>

          {/* Unlocked Effects */}
          {newEffects.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-3 space-y-2">
              <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">
                ปลดล็อก
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {newEffects.map((effect) => (
                  <span
                    key={effect}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: `${newStage.color}20`,
                      borderColor: `${newStage.color}50`,
                      color: newStage.color,
                    }}
                  >
                    ✨ {effectLabels[effect] ?? effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full rounded-xl text-base font-bold py-5 shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${newStage.color}, ${newStage.color}CC)`,
              boxShadow: `0 4px 20px ${newStage.color}50`,
            }}
          >
            เยี่ยมไปเลย! 🎊
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvolutionCelebration;
