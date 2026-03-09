import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopItems, ShopItem, rarityColors, rarityGlow } from "@/data/shopItems";
import { Button } from "@/components/ui/button";
import { Coins, Zap, ShoppingBag, Sparkles, Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type Tab = "power-up" | "cosmetic" | "special";

const tabConfig: { key: Tab; label: string; icon: string }[] = [
  { key: "power-up", label: "พาวเวอร์อัพ", icon: "⚡" },
  { key: "cosmetic", label: "เครื่องประดับ", icon: "🎨" },
  { key: "special", label: "พิเศษ", icon: "🎁" },
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, addCoins, updateProfile, refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<Tab>("power-up");
  const [buying, setBuying] = useState<string | null>(null);

  const coins = profile?.coins || 0;
  const inventory: string[] = profile?.inventory || [];

  const getOwnedCount = (itemId: string) => inventory.filter(i => i === itemId).length;

  const handleBuy = async (item: ShopItem) => {
    if (!user || !profile) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      navigate("/auth");
      return;
    }
    if (coins < item.price) {
      toast.error("เหรียญไม่พอ!");
      return;
    }
    if (item.maxOwned > 0 && getOwnedCount(item.id) >= item.maxOwned) {
      toast.error("มีครบแล้ว!");
      return;
    }

    setBuying(item.id);
    try {
      const newInventory = [...inventory, item.id];
      await updateProfile({
        coins: coins - item.price,
        inventory: newInventory,
      });
      refreshProfile();

      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ["#7c3aed", "#ec4899", "#f59e0b"] });
      toast.success(`ซื้อ ${item.nameThai} สำเร็จ!`);
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setBuying(null);
    }
  };

  const filteredItems = shopItems.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-purple-50 to-pink-50 pb-24">
      {/* Header with coins */}
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold font-thai">
              🛒 ร้านค้า
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-3 py-1.5 shadow-sm border border-amber-200">
                <span className="text-lg">🪙</span>
                <span className="font-bold text-amber-700">{coins.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {tabConfig.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-xs font-bold font-thai transition-all",
                  activeTab === tab.key
                    ? "bg-white shadow-sm text-purple-700"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const owned = getOwnedCount(item.id);
            const maxed = item.maxOwned > 0 && owned >= item.maxOwned;
            const cantAfford = coins < item.price;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border-2 p-4 transition-all relative overflow-hidden",
                  rarityColors[item.rarity],
                  !maxed && !cantAfford && "hover:shadow-lg",
                  rarityGlow[item.rarity] && `shadow-lg ${rarityGlow[item.rarity]}`,
                  maxed && "opacity-60"
                )}
              >
                {/* Rarity indicator */}
                {item.rarity === "legendary" && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-2 right-[-20px] bg-amber-500 text-white text-[8px] font-bold px-6 py-0.5 rotate-45">LEGEND</div>
                  </div>
                )}
                {item.rarity === "epic" && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                )}

                <div className="text-center mb-2">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="font-bold font-thai text-sm text-center">{item.nameThai}</h3>
                <p className="text-[10px] text-muted-foreground font-thai text-center mt-1 line-clamp-2">{item.description}</p>

                {maxed ? (
                  <div className="flex items-center justify-center gap-1 mt-3 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-bold font-thai">มีแล้ว</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleBuy(item)}
                    disabled={cantAfford || buying === item.id}
                    className={cn(
                      "w-full mt-3 h-9 text-xs font-bold font-thai",
                      cantAfford
                        ? "bg-gray-200 text-gray-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md"
                    )}
                  >
                    <span className="mr-1">🪙</span>
                    {buying === item.id ? "กำลังซื้อ..." : `${item.price}`}
                  </Button>
                )}

                {item.maxOwned > 0 && !maxed && owned > 0 && (
                  <p className="text-[9px] text-center text-muted-foreground mt-1 font-thai">
                    มี {owned}/{item.maxOwned}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* How to earn coins */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="font-bold font-thai text-sm text-amber-800 mb-3">💰 วิธีหาเหรียญ</h3>
          <div className="space-y-2 text-xs font-thai text-amber-700">
            <div className="flex items-center gap-2">
              <span className="text-base">📖</span>
              <span>เรียนบทเรียน +10 เหรียญ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">📝</span>
              <span>Quiz ได้คะแนนเต็ม +20 เหรียญ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span>Streak 7 วัน +50 เหรียญ โบนัส</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎮</span>
              <span>เล่นเกมชนะ +5-10 เหรียญ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎁</span>
              <span>เข้าแอปทุกวัน รับเหรียญฟรี</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;
