import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EquippedItems, DEFAULT_EQUIPPED, AvatarItem } from "@/types/avatar";
import RobloxAvatar from "@/components/avatar/RobloxAvatar";
import CoinDisplay from "@/components/avatar/CoinDisplay";
import ShopSection from "@/components/avatar/ShopSection";
import InventorySection from "@/components/avatar/InventorySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useDailyMissions } from "@/hooks/useDailyMissions";
import { useProfile } from "@/hooks/useProfile";
import { getEvolutionStage, getEvolutionProgress } from "@/data/evolutionStages";
import EvolutionProgressBar from "@/components/avatar/EvolutionProgressBar";
import GachaSpinner from "@/components/gacha/GachaSpinner";
import { trackEvent } from "@/utils/analytics";

const AvatarPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { incrementMission } = useDailyMissions();
  const { profile, refreshProfile } = useProfile();

  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [equipped, setEquipped] = useState<EquippedItems>(DEFAULT_EQUIPPED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("coins, inventory, equipped")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setCoins((data as any).coins || 0);
        const inv = (data as any).inventory;
        setInventory(Array.isArray(inv) ? inv : []);
        const eq = (data as any).equipped;
        if (eq && typeof eq === "object" && !Array.isArray(eq)) {
          setEquipped({ ...DEFAULT_EQUIPPED, ...eq });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      incrementMission('visit_avatar', 1);
      trackEvent('page_view', { page: 'avatar' });
    }
  }, [user]);

  const handleBuy = async (item: AvatarItem) => {
    if (!user) return;
    if (coins < item.price) {
      toast.error("เหรียญไม่พอ! 🪙 ไปทำแบบทดสอบเพิ่มนะ");
      return;
    }

    const newCoins = coins - item.price;
    const newInventory = [...inventory, item.id];

    const { error } = await supabase
      .from("profiles")
      .update({
        coins: newCoins,
        inventory: newInventory as any,
      } as any)
      .eq("user_id", user.id);

    if (error) {
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      return;
    }

    setCoins(newCoins);
    setInventory(newInventory);
    toast.success(`ซื้อ ${item.nameThai} สำเร็จ! 🎉`);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    handleEquip(item, newInventory);
  };

  const handleEquip = async (item: AvatarItem, currentInventory?: string[]) => {
    if (!user) return;

    const newEquipped = { ...equipped, [item.category]: item.id };

    const { error } = await supabase
      .from("profiles")
      .update({ equipped: newEquipped as any } as any)
      .eq("user_id", user.id);

    if (error) {
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      return;
    }

    setEquipped(newEquipped);
  };

  const handleUnequip = async (item: AvatarItem) => {
    if (!user) return;

    const defaults: Record<string, string | null> = {
      skin: "skin_default",
      hair: "hair_default",
      hairColor: "haircolor_black",
      hat: null,
      shirt: "shirt_default",
      pants: "pants_default",
      shoes: "shoes_default",
      accessory: null,
    };

    const newEquipped = { ...equipped, [item.category]: defaults[item.category] };

    const { error } = await supabase
      .from("profiles")
      .update({ equipped: newEquipped as any } as any)
      .eq("user_id", user.id);

    if (error) {
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      return;
    }

    setEquipped(newEquipped);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-purple-200 to-pink-200 flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="text-6xl animate-bounce">🎮</div>
          <p className="text-lg font-black font-thai text-white drop-shadow-lg">กำลังโหลด...</p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-indigo-200 to-purple-200 pb-28">
      {/* === GAME HEADER === */}
      <header className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl" />
          <div className="absolute -top-2 right-8 w-14 h-14 bg-pink-400/20 rounded-full blur-xl" />
          <div className="absolute top-8 left-1/3 w-10 h-10 bg-cyan-400/20 rounded-full blur-xl" />
        </div>

        <div className="relative px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500
                flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-lg font-black font-thai text-white drop-shadow-md">
                  ตัวละครของฉัน
                </h1>
                <p className="text-[10px] font-bold text-white/70">My Avatar</p>
              </div>
            </div>
            <CoinDisplay coins={coins} />
          </div>
        </div>
      </header>

      {/* === AVATAR DISPLAY STAGE === */}
      <div className="relative mx-4 mt-2 mb-4">
        {/* Stage background */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cyan-100 via-sky-50 to-white
          border-4 border-white/50 shadow-xl">

          {/* Decorative elements */}
          <div className="absolute top-3 left-4 text-lg animate-float opacity-50">⭐</div>
          <div className="absolute top-6 right-5 text-sm animate-float opacity-40" style={{ animationDelay: "1s" }}>✨</div>
          <div className="absolute top-12 left-8 text-xs animate-float opacity-30" style={{ animationDelay: "0.5s" }}>💫</div>
          <div className="absolute bottom-12 right-4 text-lg animate-float opacity-40" style={{ animationDelay: "1.5s" }}>🌟</div>

          {/* Avatar */}
          <div className="flex justify-center py-6">
            <div className="relative">
              <RobloxAvatar equipped={equipped} size="lg" animated evolutionStage={getEvolutionStage(profile?.total_exp || 0).stage} />
              {/* Ground platform */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <div className="w-40 h-6 bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent rounded-full blur-sm" />
                <div className="w-28 h-3 mx-auto -mt-2 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent rounded-full" />
              </div>
            </div>
          </div>

          {/* Stage floor gradient */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-indigo-100/80 to-transparent" />
        </div>

        {/* Stage glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 -z-10 blur-md" />
      </div>

      {/* Evolution Progress */}
      <div className="px-4 mb-4">
        <EvolutionProgressBar totalExp={profile?.total_exp || 0} />
      </div>

      {/* === TABS: SHOP / INVENTORY === */}
      <div className="px-4">
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="w-full mb-4 h-14 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border-2 border-white/30">
            <TabsTrigger
              value="shop"
              className="flex-1 font-thai text-sm font-black rounded-xl h-full transition-all
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-amber-500
                data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-400/30"
            >
              <span className="mr-1.5 text-lg">🛒</span>
              ร้านค้า
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="flex-1 font-thai text-sm font-black rounded-xl h-full transition-all
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-400 data-[state=active]:to-purple-500
                data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-400/30"
            >
              <span className="mr-1.5 text-lg">👔</span>
              ตู้เสื้อผ้า
            </TabsTrigger>
            <TabsTrigger
              value="gacha"
              className="flex-1 font-thai text-sm font-black rounded-xl h-full transition-all
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-cyan-500
                data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-400/30"
            >
              <span className="mr-1.5 text-lg">🎰</span>
              กาชา
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="mt-0">
            <ShopSection
              coins={coins}
              inventory={inventory}
              equipped={equipped}
              onBuy={handleBuy}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
          </TabsContent>

          <TabsContent value="inventory" className="mt-0">
            <InventorySection
              inventory={inventory}
              equipped={equipped}
              coins={coins}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
          </TabsContent>

          <TabsContent value="gacha" className="mt-0">
            <GachaSpinner
              coins={coins}
              gachaTickets={profile?.gacha_tickets || 0}
              inventory={inventory}
              lastFreeGacha={profile?.last_free_gacha || null}
              onPullComplete={() => {
                refreshProfile();
                // Reload local state too
                supabase.from("profiles").select("coins, inventory, equipped").eq("user_id", user!.id).single().then(({ data }) => {
                  if (data) {
                    setCoins((data as any).coins || 0);
                    const inv = (data as any).inventory;
                    setInventory(Array.isArray(inv) ? inv : []);
                  }
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AvatarPage;
