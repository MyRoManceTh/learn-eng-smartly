import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RewardData } from "@/types/dopamine";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  reward: RewardData | null;
  streakDays: number;
  isMilestone: boolean;
  milestoneMessage: string;
  onClaim: () => Promise<void>;
  onClose: () => void;
}

const DailyRewardModal = ({
  open,
  reward,
  streakDays,
  isMilestone,
  milestoneMessage,
  onClaim,
  onClose,
}: Props) => {
  const [opened, setOpened] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const handleOpenBox = async () => {
    setOpened(true);

    // ยิง confetti ฉลอง
    confetti({
      particleCount: isMilestone ? 200 : 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: isMilestone
        ? ["#FFD700", "#FFA500", "#FF6347", "#FF4500"]
        : ["#6366f1", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"],
    });
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await onClaim();
    } finally {
      setClaiming(false);
      setOpened(false);
      onClose();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpened(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-violet-950 text-white overflow-hidden">
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-xl font-bold text-amber-300">
            สวัสดี! วันที่ {streakDays} ติดต่อกัน 🔥
          </DialogTitle>
          <DialogDescription className="text-purple-200">
            เปิดกล่องสุ่มรับรางวัลประจำวัน!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* กล่องของขวัญ */}
          {!opened ? (
            <button
              onClick={handleOpenBox}
              className="group relative focus:outline-none"
              aria-label="เปิดกล่องรางวัล"
            >
              {/* เอฟเฟกต์เรืองแสง */}
              <div className="absolute inset-0 rounded-3xl bg-amber-400/20 blur-2xl animate-pulse" />
              <div
                className={cn(
                  "relative text-8xl select-none transition-transform duration-150",
                  "animate-[shake_0.8s_ease-in-out_infinite] group-hover:scale-110 group-active:scale-95"
                )}
              >
                🎁
              </div>
              <p className="mt-3 text-sm text-purple-200 animate-pulse text-center">
                แตะเพื่อเปิด!
              </p>
            </button>
          ) : (
            /* แสดงรางวัล */
            <div className="flex flex-col items-center gap-3 animate-bounce-in">
              {/* ไอคอนรางวัล */}
              <div className="text-6xl animate-float">🎉</div>

              {/* รางวัลหลัก */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {reward?.coins != null && reward.coins > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-2">
                    <span className="text-2xl">🪙</span>
                    <span className="text-lg font-bold text-amber-300">
                      +{reward.coins} เหรียญ
                    </span>
                  </div>
                )}
                {reward?.exp != null && reward.exp > 0 && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2">
                    <span className="text-2xl">✨</span>
                    <span className="text-lg font-bold text-emerald-300">
                      +{reward.exp} EXP
                    </span>
                  </div>
                )}
              </div>

              {/* ไอเทม (ถ้ามี) */}
              {reward?.items && reward.items.length > 0 && (
                <div className="flex flex-col items-center gap-1 mt-1">
                  {reward.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-2"
                    >
                      <span className="text-xl">🎀</span>
                      <span className="text-sm font-semibold text-violet-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ข้อความ (ถ้ามี) */}
              {reward?.message && (
                <p className="text-sm text-purple-200 text-center mt-1">
                  {reward.message}
                </p>
              )}

              {/* Milestone พิเศษ */}
              {isMilestone && (
                <div className="mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/30 via-yellow-400/30 to-amber-500/30 border border-yellow-400/50">
                  <p className="text-center text-base font-bold bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    🏆 {milestoneMessage}
                  </p>
                </div>
              )}

              {/* ปุ่มรับรางวัล */}
              <Button
                onClick={handleClaim}
                disabled={claiming}
                className="mt-3 w-full max-w-[240px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-5 rounded-xl shadow-lg shadow-amber-500/25 transition-all active:scale-95"
              >
                {claiming ? "กำลังรับ..." : "รับรางวัล!"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyRewardModal;
