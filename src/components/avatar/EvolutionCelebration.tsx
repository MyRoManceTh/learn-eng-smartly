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

function fireConfettiBursts(color: string) {
  // Initial big burst from center
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.45 },
    colors: [color, "#FFD700", "#FF69B4", "#00BFFF", "#FF6B35"],
    startVelocity: 35,
    gravity: 0.8,
  });

  // Left burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.55 },
      colors: [color, "#FFD700", "#FFFFFF"],
    });
  }, 250);

  // Right burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.55 },
      colors: [color, "#FFD700", "#FFFFFF"],
    });
  }, 500);

  // Star rain from top
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 160,
      origin: { y: 0 },
      gravity: 0.6,
      scalar: 1.2,
      shapes: ["star"],
      colors: [color, "#FFD700"],
      startVelocity: 15,
    });
  }, 800);

  // Final sparkle burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: [color, "#FFD700", "#FF69B4"],
      startVelocity: 25,
      ticks: 200,
    });
  }, 1200);
}

const EvolutionCelebration = ({ open, previousStage, newStage, onClose }: Props) => {
  const hasFireRef = useRef(false);

  useEffect(() => {
    if (open && !hasFireRef.current) {
      hasFireRef.current = true;
      fireConfettiBursts(newStage.color);
    }
    if (!open) {
      hasFireRef.current = false;
    }
  }, [open, newStage.color]);

  if (!open) return null;

  const newEffects = newStage.effects.filter(
    (e) => !previousStage.effects.includes(e)
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with radial glow */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${newStage.color}25 0%, rgba(0,0,0,0.8) 70%)`,
        }}
        onClick={onClose}
      />

      {/* Animated ring pulse behind card */}
      <div
        className="absolute w-80 h-80 rounded-full animate-ping opacity-10"
        style={{ backgroundColor: newStage.color }}
      />
      <div
        className="absolute w-64 h-64 rounded-full animate-pulse opacity-15"
        style={{ backgroundColor: newStage.color }}
      />

      {/* Content Card */}
      <div
        className="relative z-10 w-[90vw] max-w-sm mx-auto"
        style={{ animation: "levelup-card 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
      >
        <div
          className="rounded-3xl p-6 text-center space-y-5 border-2 shadow-2xl overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
            borderColor: `${newStage.color}60`,
            boxShadow: `0 0 60px ${newStage.color}40, 0 0 120px ${newStage.color}15, inset 0 1px 1px rgba(255,255,255,0.1)`,
          }}
        >
          {/* Shimmer sweep effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${newStage.color}15 45%, ${newStage.color}25 50%, ${newStage.color}15 55%, transparent 60%)`,
              animation: "shimmer-sweep 3s ease-in-out infinite",
            }}
          />

          {/* Header with staggered entrance */}
          <div style={{ animation: "fade-slide-up 0.5s ease-out 0.2s both" }}>
            <div className="text-4xl mb-1" style={{ animation: "icon-bounce 1s ease-out 0.3s both" }}>
              🎉
            </div>
            <h2 className="text-2xl font-bold text-yellow-300 drop-shadow-lg font-thai">
              เลเวลอัพ!
            </h2>
          </div>

          {/* Before -> After with entrance animation */}
          <div
            className="flex items-center justify-center gap-6 py-4"
            style={{ animation: "fade-slide-up 0.5s ease-out 0.4s both" }}
          >
            {/* Previous Stage */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <span className="text-4xl grayscale-[40%] opacity-60">{previousStage.icon}</span>
              </div>
              <span className="text-[11px] text-white/40 font-thai font-bold">{previousStage.nameThai}</span>
              <span className="text-[10px] text-white/25 font-bold">Lv.{previousStage.stage}</span>
            </div>

            {/* Arrow with pulse */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl" style={{ animation: "arrow-pulse 1s ease-in-out infinite" }}>
                <span className="text-yellow-400 drop-shadow-lg">⟶</span>
              </div>
            </div>

            {/* New Stage with glow */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <span
                  className="text-5xl relative z-10 block"
                  style={{
                    filter: `drop-shadow(0 0 16px ${newStage.color})`,
                    animation: "icon-bounce 0.8s ease-out 0.6s both",
                  }}
                >
                  {newStage.icon}
                </span>
                {/* Glow ring behind icon */}
                <div
                  className="absolute inset-0 -m-3 rounded-full animate-pulse"
                  style={{ boxShadow: `0 0 30px ${newStage.color}50` }}
                />
              </div>
              <span
                className="text-sm font-extrabold font-thai"
                style={{ color: newStage.color }}
              >
                {newStage.nameThai}
              </span>
              <span
                className="text-[10px] font-bold"
                style={{ color: `${newStage.color}CC` }}
              >
                Lv.{newStage.stage}
              </span>
            </div>
          </div>

          {/* Stage title with glow text */}
          <div style={{ animation: "fade-slide-up 0.5s ease-out 0.6s both" }}>
            <div
              className="text-xl font-extrabold tracking-wider font-thai"
              style={{
                color: newStage.color,
                textShadow: `0 0 20px ${newStage.color}80, 0 0 40px ${newStage.color}40`,
              }}
            >
              ขั้น {newStage.stage}: {newStage.nameThai}
            </div>
            <p className="text-white/40 text-xs mt-1 font-semibold">{newStage.name}</p>
          </div>

          {/* Unlocked Effects */}
          {newEffects.length > 0 && (
            <div
              className="bg-white/5 rounded-2xl p-3.5 space-y-2.5"
              style={{ animation: "fade-slide-up 0.5s ease-out 0.8s both" }}
            >
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">
                ปลดล็อกใหม่
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {newEffects.map((effect, i) => (
                  <span
                    key={effect}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: `${newStage.color}20`,
                      borderColor: `${newStage.color}40`,
                      color: newStage.color,
                      animation: `fade-slide-up 0.4s ease-out ${0.9 + i * 0.1}s both`,
                    }}
                  >
                    ✨ {effectLabels[effect] ?? effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div style={{ animation: "fade-slide-up 0.5s ease-out 1s both" }}>
            <Button
              onClick={onClose}
              className="w-full rounded-xl text-base font-bold font-thai py-5 shadow-lg transition-transform hover:scale-105 active:scale-95 border-0"
              style={{
                background: `linear-gradient(135deg, ${newStage.color}, ${newStage.color}CC)`,
                boxShadow: `0 4px 24px ${newStage.color}50`,
              }}
            >
              สุดยอด! 🎊
            </Button>
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes levelup-card {
          0% { opacity: 0; transform: scale(0.5) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-slide-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes icon-bounce {
          0% { opacity: 0; transform: scale(0) rotate(-10deg); }
          60% { transform: scale(1.3) rotate(5deg); }
          80% { transform: scale(0.95) rotate(-2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes arrow-pulse {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          50% { transform: translateX(4px); opacity: 1; }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default EvolutionCelebration;
