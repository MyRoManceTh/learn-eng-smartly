import { useState, useCallback } from "react";
import { useGacha } from "@/hooks/useGacha";
import { avatarItems, getItemById } from "@/data/avatarItems";
import { gachaExclusiveItems, GACHA_RATES, GACHA_COIN_COST } from "@/data/gachaItems";
import { GachaResult } from "@/types/dopamine";
import { AvatarItem } from "@/types/avatar";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  coins: number;
  gachaTickets: number;
  inventory: string[];
  lastFreeGacha: string | null;
  onPullComplete: () => void;
}

const rarityConfig = {
  common: {
    label: "ธรรมดา",
    icon: "⭐",
    color: "#9E9E9E",
    bgGradient: "from-slate-300 via-gray-200 to-slate-300",
    borderColor: "border-slate-400",
    textColor: "text-slate-600",
    glowClass: "",
  },
  uncommon: {
    label: "พิเศษ",
    icon: "🌿",
    color: "#43A047",
    bgGradient: "from-emerald-400 via-green-300 to-emerald-400",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-600",
    glowClass: "shadow-emerald-400/40",
  },
  rare: {
    label: "หายาก",
    icon: "💎",
    color: "#2196F3",
    bgGradient: "from-blue-400 via-cyan-300 to-blue-400",
    borderColor: "border-blue-500",
    textColor: "text-blue-600",
    glowClass: "shadow-blue-400/50",
  },
  epic: {
    label: "เอพิค",
    icon: "💜",
    color: "#9C27B0",
    bgGradient: "from-purple-500 via-pink-400 to-purple-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-600",
    glowClass: "shadow-purple-500/60",
  },
  legendary: {
    label: "ตำนาน",
    icon: "👑",
    color: "#FFD700",
    bgGradient: "from-yellow-400 via-amber-300 to-yellow-400",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-600",
    glowClass: "shadow-yellow-400/70",
  },
  mythic: {
    label: "เหนือตำนาน",
    icon: "💫",
    color: "#FF1744",
    bgGradient: "from-rose-500 via-fuchsia-500 to-indigo-500",
    borderColor: "border-rose-500",
    textColor: "text-rose-600",
    glowClass: "shadow-rose-500/80",
  },
} as const;

const GachaSpinner = ({
  coins,
  gachaTickets,
  inventory,
  lastFreeGacha,
  onPullComplete,
}: Props) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<GachaResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wonItem, setWonItem] = useState<AvatarItem | null>(null);

  const { pullGacha, canFreePull } = useGacha();

  const findItem = useCallback((itemId: string): AvatarItem | undefined => {
    const fromShop = getItemById(itemId);
    if (fromShop) return fromShop;
    return gachaExclusiveItems.find((i) => i.id === itemId);
  }, []);

  const fireConfetti = useCallback((rarity: string) => {
    if (rarity === "uncommon") {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#43A047", "#A5D6A7", "#66BB6A"],
      });
    } else if (rarity === "epic") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#9C27B0", "#E040FB", "#CE93D8", "#7B1FA2"],
      });
    } else if (rarity === "legendary" || rarity === "mythic") {
      // Heavy confetti burst
      const isMythic = rarity === "mythic";
      const palette = isMythic
        ? ["#FF1744", "#D500F9", "#651FFF", "#00E5FF", "#FFD600"]
        : ["#FFD700", "#FFA000", "#FFEA00", "#FF6F00"];
      const duration = isMythic ? 3500 : 2000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 18,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: palette,
        });
        confetti({
          particleCount: 18,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: palette,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      // Initial big burst
      confetti({
        particleCount: isMythic ? 500 : 300,
        spread: 130,
        origin: { y: 0.5 },
        colors: palette,
        gravity: 0.8,
      });
      frame();
    }
  }, []);

  const handlePull = useCallback(
    async (useTicket: boolean) => {
      if (isSpinning) return;

      setIsSpinning(true);
      setResult(null);
      setShowResult(false);
      setWonItem(null);

      // Wait for spin animation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { result: gachaResult, error } = await pullGacha(
        inventory,
        coins,
        gachaTickets,
        useTicket
      );

      if (error || !gachaResult) {
        toast.error(error || "เกิดข้อผิดพลาด!");
        setIsSpinning(false);
        return;
      }

      const item = findItem(gachaResult.itemId);
      setResult(gachaResult);
      setWonItem(item || null);
      setIsSpinning(false);
      setShowResult(true);

      // Fire effects based on rarity
      fireConfetti(gachaResult.rarity);

      // Legendary sound effect
      if (gachaResult.rarity === "legendary" || gachaResult.rarity === "mythic") {
        try {
          const audio = new Audio("/sounds/legendary.mp3");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {}
      }

      onPullComplete();
    },
    [isSpinning, pullGacha, inventory, coins, gachaTickets, findItem, fireConfetti, onPullComplete]
  );

  const handleFreePull = useCallback(async () => {
    if (isSpinning) return;
    if (!canFreePull(lastFreeGacha)) {
      toast.error("ยังหมุนฟรีไม่ได้! ต้องรอครบ 7 วัน");
      return;
    }
    // Free pull uses ticket logic but is free
    setIsSpinning(true);
    setResult(null);
    setShowResult(false);
    setWonItem(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { result: gachaResult, error } = await pullGacha(
      inventory,
      coins,
      gachaTickets,
      false // not using ticket, but it's free (handled server-side)
    );

    if (error || !gachaResult) {
      toast.error(error || "เกิดข้อผิดพลาด!");
      setIsSpinning(false);
      return;
    }

    const item = findItem(gachaResult.itemId);
    setResult(gachaResult);
    setWonItem(item || null);
    setIsSpinning(false);
    setShowResult(true);

    fireConfetti(gachaResult.rarity);

    if (gachaResult.rarity === "legendary" || gachaResult.rarity === "mythic") {
      try {
        const audio = new Audio("/sounds/legendary.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}
    }

    onPullComplete();
  }, [isSpinning, canFreePull, lastFreeGacha, pullGacha, inventory, coins, gachaTickets, findItem, fireConfetti, onPullComplete]);

  const resetResult = () => {
    setResult(null);
    setShowResult(false);
    setWonItem(null);
  };

  const isFreePullAvailable = canFreePull(lastFreeGacha);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* === Machine Display === */}
      <div className="relative bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl border-4 border-yellow-400 shadow-2xl shadow-purple-900/50 overflow-hidden">
        {/* Top decorative lights */}
        <div className="flex justify-center gap-2 py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500">
          {["red", "blue", "green", "yellow", "pink"].map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: color,
                animationDelay: `${i * 0.2}s`,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-center text-3xl font-black font-thai text-yellow-300 mt-4 drop-shadow-lg">
          🎰 กาชา
        </h2>

        {/* Probability rates */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 px-4 mt-2 mb-4">
          <span className="text-[11px] font-bold text-slate-300">⭐ 40%</span>
          <span className="text-[11px] font-bold text-emerald-300">🌿 28%</span>
          <span className="text-[11px] font-bold text-blue-300">💎 18%</span>
          <span className="text-[11px] font-bold text-purple-300">💜 9%</span>
          <span className="text-[11px] font-bold text-yellow-300">👑 4.5%</span>
          <span className="text-[11px] font-bold text-rose-300">💫 0.5%</span>
        </div>

        {/* Capsule Display Area */}
        <div className="mx-6 mb-6">
          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-600 p-6 min-h-[200px] flex items-center justify-center overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${20 + Math.random() * 30}px`,
                    height: `${20 + Math.random() * 30}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            {/* Spinning state */}
            {isSpinning && (
              <div className="flex flex-col items-center gap-4 z-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-spin flex items-center justify-center shadow-2xl"
                    style={{ animationDuration: "0.3s" }}>
                    <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl animate-bounce">?</span>
                    </div>
                  </div>
                  {/* Orbiting particles */}
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-yellow-400 animate-spin"
                      style={{
                        top: "50%",
                        left: "50%",
                        transformOrigin: `${40 + i * 10}px 0px`,
                        animationDuration: `${0.5 + i * 0.2}s`,
                        boxShadow: "0 0 10px #FFD700",
                      }}
                    />
                  ))}
                </div>
                <p className="text-yellow-300 font-black font-thai text-lg animate-pulse">
                  กำลังหมุน...
                </p>
              </div>
            )}

            {/* Idle state */}
            {!isSpinning && !showResult && (
              <div className="flex flex-col items-center gap-3 z-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center shadow-xl border-4 border-red-300 animate-float">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-4xl">🎲</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/20 rounded-full blur-sm" />
                </div>
                <p className="text-gray-400 font-thai font-bold text-sm">
                  กดปุ่มเพื่อหมุนกาชา!
                </p>
              </div>
            )}

            {/* Result reveal */}
            {showResult && result && wonItem && (
              <div
                className="flex flex-col items-center gap-3 z-10 animate-pop"
              >
                {/* Glow ring */}
                <div
                  className={`relative p-1 rounded-full
                    ${result.rarity === "uncommon" ? "shadow-2xl shadow-emerald-400/50" : ""}
                    ${result.rarity === "rare" ? "shadow-2xl shadow-blue-400/60" : ""}
                    ${result.rarity === "epic" ? "shadow-2xl shadow-purple-500/70" : ""}
                    ${result.rarity === "legendary" ? "shadow-2xl shadow-yellow-400/80 animate-pulse" : ""}
                    ${result.rarity === "mythic" ? "shadow-2xl shadow-rose-500/90 animate-pulse" : ""}
                  `}
                >
                  <div
                    className={`w-28 h-28 rounded-full flex items-center justify-center border-4 bg-gradient-to-br
                      ${rarityConfig[result.rarity].bgGradient}
                      ${rarityConfig[result.rarity].borderColor}
                      ${result.rarity === "legendary" || result.rarity === "mythic" ? "animate-legendary-glow" : ""}
                    `}
                    style={{
                      boxShadow: result.rarity !== "common"
                        ? `0 0 40px ${rarityConfig[result.rarity].color}40, 0 0 80px ${rarityConfig[result.rarity].color}20`
                        : undefined,
                    }}
                  >
                    <span className={`text-5xl ${result.rarity === "legendary" || result.rarity === "mythic" ? "animate-bounce" : ""}`}>
                      {wonItem.icon}
                    </span>
                  </div>

                  {/* Sparkles for rare+ */}
                  {(result.rarity === "rare" || result.rarity === "epic" || result.rarity === "legendary" || result.rarity === "mythic") && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute text-xs animate-ping"
                          style={{
                            top: `${10 + Math.random() * 80}%`,
                            left: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: "1s",
                          }}
                        >
                          ✨
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Item name */}
                <div className="text-center">
                  <p className="text-white font-black font-thai text-xl drop-shadow-lg">
                    {wonItem.nameThai}
                  </p>
                  <p className="text-gray-400 text-sm font-semibold">
                    {wonItem.name}
                  </p>
                </div>

                {/* Rarity badge */}
                <div
                  className="px-4 py-1.5 rounded-full font-black font-thai text-sm text-white shadow-lg"
                  style={{ backgroundColor: rarityConfig[result.rarity].color }}
                >
                  {rarityConfig[result.rarity].icon} {rarityConfig[result.rarity].label}
                </div>

                {/* New / Duplicate badge */}
                {result.isNew ? (
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-1 rounded-full font-black font-thai text-sm shadow-lg animate-bounce">
                    ใหม่! 🆕
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-1 rounded-full font-bold font-thai text-xs shadow-md">
                    ซ้ำ (ได้รับเหรียญแทน)
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 mt-2">
                  <Button
                    onClick={() => {
                      resetResult();
                    }}
                    variant="outline"
                    className="font-thai font-bold rounded-xl border-2 border-gray-500 text-gray-300 hover:text-white hover:border-gray-300 bg-transparent"
                  >
                    ปิด
                  </Button>
                  <Button
                    onClick={() => {
                      resetResult();
                      // Small delay then auto-decide best pull
                    }}
                    className="font-thai font-black rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 shadow-lg shadow-amber-400/30"
                  >
                    🔄 หมุนอีกครั้ง
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === Pull Buttons === */}
        {!showResult && (
          <div className="px-6 pb-6 space-y-3">
            {/* Free weekly pull */}
            {isFreePullAvailable && (
              <Button
                onClick={handleFreePull}
                disabled={isSpinning}
                className="w-full h-14 text-base font-black font-thai rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 hover:from-green-500 hover:via-emerald-500 hover:to-green-600 text-white shadow-xl shadow-green-500/30 border-2 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🎁 หมุนฟรีประจำสัปดาห์!
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            )}

            {/* Ticket pull */}
            <Button
              onClick={() => handlePull(true)}
              disabled={isSpinning || gachaTickets <= 0}
              className="w-full h-12 text-sm font-black font-thai rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white shadow-lg shadow-pink-500/30 border-2 border-pink-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎟️ หมุนด้วยตั๋ว ({gachaTickets} ใบ)
            </Button>

            {/* Coin pull */}
            <Button
              onClick={() => handlePull(false)}
              disabled={isSpinning || coins < GACHA_COIN_COST}
              className="w-full h-12 text-sm font-black font-thai rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-gray-900 shadow-lg shadow-amber-400/30 border-2 border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🪙 หมุนด้วยเหรียญ ({GACHA_COIN_COST} 🪙)
            </Button>

            {/* Current balance display */}
            <div className="flex justify-center gap-6 pt-2 text-sm">
              <span className="text-yellow-300 font-bold font-thai">
                🪙 {coins.toLocaleString()} เหรียญ
              </span>
              <span className="text-pink-300 font-bold font-thai">
                🎟️ {gachaTickets} ตั๋ว
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes legendary-glow {
          0%, 100% { box-shadow: 0 0 20px #FFD70040, 0 0 40px #FFD70020; }
          50% { box-shadow: 0 0 40px #FFD70060, 0 0 80px #FFD70040; }
        }
        .animate-pop {
          animation: pop 0.5s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-legendary-glow {
          animation: legendary-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GachaSpinner;
