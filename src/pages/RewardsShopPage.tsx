import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Zap, Shield, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import CoinDisplay from "@/components/avatar/CoinDisplay";
import confetti from "canvas-confetti";

interface PowerUp {
  id: string;
  name: string;
  nameThai: string;
  description: string;
  emoji: string;
  price: number;
  color: string;
  action: string;
}

const POWER_UPS: PowerUp[] = [
  {
    id: "freeze_streak",
    name: "Streak Freeze",
    nameThai: "แช่แข็ง Streak",
    description: "ไม่ขาด Streak 1 วัน แม้ไม่ได้เข้าเรียน",
    emoji: "🧊",
    price: 100,
    color: "from-cyan-400 to-blue-500",
    action: "freeze",
  },
  {
    id: "double_xp",
    name: "Double XP",
    nameThai: "XP x2",
    description: "ได้ XP 2 เท่า จากบทเรียนถัดไป",
    emoji: "⚡",
    price: 80,
    color: "from-purple-400 to-violet-500",
    action: "double_xp",
  },
  {
    id: "refill_hearts",
    name: "Refill Hearts",
    nameThai: "เติมหัวใจเต็ม",
    description: "เติมหัวใจกลับมาเต็ม 5 ดวง ทันที",
    emoji: "❤️",
    price: 60,
    color: "from-rose-400 to-pink-500",
    action: "refill",
  },
  {
    id: "gacha_ticket",
    name: "Gacha Ticket",
    nameThai: "ตั๋วกาชา",
    description: "ได้ตั๋วสุ่มไอเทม 1 ใบ",
    emoji: "🎰",
    price: 50,
    color: "from-amber-400 to-orange-500",
    action: "gacha",
  },
  {
    id: "hint_pack",
    name: "Hint Pack",
    nameThai: "ชุดคำใบ้",
    description: "ได้คำใบ้ในแบบทดสอบ 5 ครั้ง",
    emoji: "💡",
    price: 40,
    color: "from-yellow-400 to-amber-500",
    action: "hints",
  },
  {
    id: "bonus_coins",
    name: "Coin Booster",
    nameThai: "เหรียญ x2",
    description: "ได้เหรียญ 2 เท่า จากบทเรียนถัดไป",
    emoji: "🪙",
    price: 70,
    color: "from-emerald-400 to-green-500",
    action: "double_coins",
  },
];

export default function RewardsShopPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const [buying, setBuying] = useState<string | null>(null);

  const coins = profile?.coins || 0;

  const handleBuy = async (powerUp: PowerUp) => {
    if (!user || !profile) return;
    if (coins < powerUp.price) {
      toast.error("เหรียญไม่พอ!");
      return;
    }

    setBuying(powerUp.id);

    const updates: Record<string, any> = {
      coins: coins - powerUp.price,
    };

    // Apply power-up effect
    switch (powerUp.action) {
      case "freeze":
        updates.streak_freeze_count = ((profile as any).streak_freeze_count || 0) + 1;
        break;
      case "double_xp":
        updates.double_xp_count = ((profile as any).double_xp_count || 0) + 1;
        break;
      case "refill":
        updates.energy = 5;
        updates.energy_last_refill = new Date().toISOString();
        break;
      case "gacha":
        updates.gacha_tickets = (profile.gacha_tickets || 0) + 1;
        break;
      case "hints":
        updates.hint_count = ((profile as any).hint_count || 0) + 5;
        break;
      case "double_coins":
        updates.double_coins_count = ((profile as any).double_coins_count || 0) + 1;
        break;
    }

    await supabase
      .from("profiles")
      .update(updates as any)
      .eq("user_id", user.id);

    refreshProfile();
    toast.success(`ซื้อ ${powerUp.nameThai} สำเร็จ! ${powerUp.emoji}`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setBuying(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white pb-24 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold font-thai">🛒 ร้านค้า Power-Up</h1>
                <p className="text-xs text-emerald-100 font-thai">ใช้เหรียญซื้อพลังพิเศษ</p>
              </div>
            </div>
            <CoinDisplay coins={coins} />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {POWER_UPS.map((pu) => {
          const canBuy = coins >= pu.price;
          const isBuying = buying === pu.id;

          return (
            <div
              key={pu.id}
              className="rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-white/60 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-3 p-4">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br text-white shadow-md",
                  pu.color
                )}>
                  {pu.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-thai dark:text-gray-200">{pu.nameThai}</p>
                  <p className="text-xs text-muted-foreground font-thai">{pu.description}</p>
                </div>

                {/* Buy button */}
                <Button
                  onClick={() => handleBuy(pu)}
                  disabled={!canBuy || isBuying}
                  size="sm"
                  className={cn(
                    "shrink-0 rounded-xl font-bold text-xs h-9 px-3",
                    canBuy
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isBuying ? "..." : `🪙 ${pu.price}`}
                </Button>
              </div>
            </div>
          );
        })}

        {/* Earn more coins hint */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground font-thai">
            💡 ได้เหรียญจาก: เรียนบทเรียน, ทำภารกิจ, Daily Challenge
          </p>
        </div>
      </div>
    </div>
  );
}
