import { useEffect, useState } from "react";
import type { EnergyState } from "@/types/dopamine";
import { cn } from "@/lib/utils";

interface Props {
  energy: EnergyState;
}

/**
 * คำนวณเวลาที่เหลือจนกว่าจะชาร์จ
 * คืนค่าเป็น string "HH:MM" หรือ null ถ้าไม่มี nextRefillAt
 */
function formatCountdown(nextRefillAt: Date | null): string | null {
  if (!nextRefillAt) return null;

  const now = new Date();
  const diff = nextRefillAt.getTime() - now.getTime();

  if (diff <= 0) return null;

  const totalMinutes = Math.ceil(diff / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

const EnergyDisplay = ({ energy }: Props) => {
  const { current, max, nextRefillAt, isFull } = energy;
  const [countdown, setCountdown] = useState<string | null>(() =>
    formatCountdown(nextRefillAt)
  );

  // อัปเดต countdown ทุกนาที
  useEffect(() => {
    if (isFull || !nextRefillAt) {
      setCountdown(null);
      return;
    }

    setCountdown(formatCountdown(nextRefillAt));

    const interval = setInterval(() => {
      const result = formatCountdown(nextRefillAt);
      setCountdown(result);
    }, 10_000); // อัปเดตทุก 10 วินาที เพื่อความแม่นยำ

    return () => clearInterval(interval);
  }, [nextRefillAt, isFull]);

  // สร้างไอคอน bolt
  const bolts: React.ReactNode[] = [];
  for (let i = 0; i < max; i++) {
    const filled = i < current;
    bolts.push(
      <span
        key={i}
        className={cn(
          "text-xs transition-all",
          filled ? "opacity-100" : "opacity-25 grayscale"
        )}
      >
        ⚡
      </span>
    );
  }

  const isUrgent = current === 1;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/80 border border-border/50",
        isUrgent && "animate-pulse border-amber-500/50"
      )}
    >
      {/* ไอคอน bolt */}
      <div className="flex items-center gap-0">{bolts}</div>

      {/* ตัวเลข */}
      <span
        className={cn(
          "text-xs font-bold tabular-nums",
          isUrgent
            ? "text-amber-500"
            : current === 0
              ? "text-destructive"
              : "text-foreground"
        )}
      >
        {current}/{max}
      </span>

      {/* นับถอยหลัง */}
      {!isFull && countdown && (
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          ชาร์จใน {countdown}
        </span>
      )}
    </div>
  );
};

export default EnergyDisplay;
