import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { seasonTiers, getCurrentTier, getTierProgress } from "@/data/seasonRewards";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Lock, Gift, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const SeasonPassPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [seasonProgress, setSeasonProgress] = useState<{
    exp_earned: number;
    rewards_claimed: number[];
    is_premium: boolean;
  }>({
    exp_earned: 0,
    rewards_claimed: [],
    is_premium: false,
  });
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  const currentMonth = THAI_MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear() + 543; // พ.ศ.

  // โหลดข้อมูล Season Pass
  useEffect(() => {
    if (!user) return;
    const loadSeasonProgress = async () => {
      setLoading(true);
      const now = new Date();
      const seasonMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const { data } = await supabase
        .from("season_pass" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("season_month", seasonMonth)
        .single();

      if (data) {
        setSeasonProgress({
          exp_earned: data.exp_earned || 0,
          rewards_claimed: Array.isArray(data.rewards_claimed) ? (data.rewards_claimed as number[]) : [],
          is_premium: data.is_premium || false,
        });
      } else {
        // ใช้ total_exp จาก profile ถ้าไม่มีข้อมูล season
        setSeasonProgress({
          exp_earned: profile?.total_exp || 0,
          rewards_claimed: [],
          is_premium: profile?.is_premium || false,
        });
      }
      setLoading(false);
    };
    loadSeasonProgress();
  }, [user, profile]);

  // เลื่อนไปยัง tier ปัจจุบัน
  useEffect(() => {
    if (!loading && scrollRef.current) {
      const currentTierNum = getCurrentTier(seasonProgress.exp_earned);
      const tierElement = scrollRef.current.querySelector(`[data-tier="${currentTierNum}"]`);
      if (tierElement) {
        tierElement.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [loading, seasonProgress.exp_earned]);

  const tierProgress = getTierProgress(seasonProgress.exp_earned);
  const currentTierNum = tierProgress.currentTier;

  // เคลมรางวัล
  const handleClaim = async (tier: number) => {
    if (!user || claiming !== null) return;
    setClaiming(tier);

    try {
      const tierData = seasonTiers.find((t) => t.tier === tier);
      if (!tierData) return;

      const reward = tierData.freeReward;
      const coinsToAdd = reward.coins || 0;
      const expToAdd = reward.exp || 0;

      // อัพเดต profile
      if (profile) {
        await supabase
          .from("profiles")
          .update({
            coins: (profile.coins || 0) + coinsToAdd,
            total_exp: (profile.total_exp || 0) + expToAdd,
          })
          .eq("user_id", user.id);
      }

      // อัพเดต claimed rewards
      const newClaimed = [...seasonProgress.rewards_claimed, tier];
      setSeasonProgress((prev) => ({
        ...prev,
        rewards_claimed: newClaimed,
      }));

      const now = new Date();
      const seasonMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      await supabase.from("season_pass" as any).upsert({
        user_id: user.id,
        season_month: seasonMonth,
        rewards_claimed: newClaimed,
        exp_earned: seasonProgress.exp_earned,
        is_premium: seasonProgress.is_premium,
      });
    } catch (err) {
      console.error("Claim error:", err);
    } finally {
      setClaiming(null);
    }
  };

  const isTierClaimed = (tier: number) => seasonProgress.rewards_claimed.includes(tier);
  const isTierUnlocked = (tier: number) => currentTierNum >= tier;
  const canClaim = (tier: number) => isTierUnlocked(tier) && !isTierClaimed(tier);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/20 via-background to-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">
              {"🏆 Season Pass - "}{currentMonth} {currentYear}
            </h1>
            <p className="text-xs text-muted-foreground">
              รับรางวัลจากการสะสม EXP ตลอดทั้งเดือน
            </p>
          </div>
        </div>
      </div>

      {/* EXP Summary */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-amber-200">EXP เดือนนี้</span>
          <span className="text-lg font-bold text-amber-400">
            {seasonProgress.exp_earned.toLocaleString()} EXP
          </span>
        </div>
        <Progress value={tierProgress.progress} className="h-2.5 [&>div]:bg-amber-500" />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">
            เทียร์ {currentTierNum}
          </span>
          {tierProgress.nextTierExp > 0 ? (
            <span className="text-xs text-muted-foreground">
              อีก {tierProgress.nextTierExp} EXP ถึงเทียร์ถัดไป
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-medium">
              {"🎉 ถึงเทียร์สูงสุดแล้ว!"}
            </span>
          )}
        </div>
      </div>

      {/* Reward Track - Horizontal Scroll */}
      <div className="mt-6 px-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          เส้นทางรางวัล
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-0 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {seasonTiers.map((tier, index) => {
          const unlocked = isTierUnlocked(tier.tier);
          const claimed = isTierClaimed(tier.tier);
          const available = canClaim(tier.tier);
          const isCurrent = currentTierNum === tier.tier;

          return (
            <div key={tier.tier} className="flex items-center snap-center" data-tier={tier.tier}>
              {/* Tier Node */}
              <div className="flex flex-col items-center min-w-[120px]">
                {/* Tier Number */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all",
                    claimed
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : isCurrent
                        ? "bg-amber-500 border-amber-400 text-white animate-pulse"
                        : unlocked
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {claimed ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    tier.tier
                  )}
                </div>

                {/* EXP Required */}
                <span className="text-[10px] text-muted-foreground mt-1">
                  {tier.expRequired} EXP
                </span>

                {/* Free Reward */}
                <div
                  className={cn(
                    "mt-2 px-3 py-2 rounded-xl text-center min-w-[100px] border transition-all",
                    unlocked
                      ? "bg-card border-border/50"
                      : "bg-muted/30 border-border/20 opacity-60"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground block mb-0.5">ฟรี</span>
                  <div className="text-xs font-medium">
                    {tier.freeReward.coins && (
                      <span className="text-amber-500">{"🪙 "}{tier.freeReward.coins}</span>
                    )}
                    {tier.freeReward.exp && (
                      <span className="text-emerald-500 ml-1">{"✨ "}{tier.freeReward.exp}</span>
                    )}
                  </div>
                </div>

                {/* Premium Reward */}
                <div
                  className={cn(
                    "mt-1.5 px-3 py-2 rounded-xl text-center min-w-[100px] border transition-all",
                    seasonProgress.is_premium && unlocked
                      ? "bg-gradient-to-b from-amber-500/10 to-amber-600/5 border-amber-500/30"
                      : "bg-muted/20 border-border/20 opacity-50"
                  )}
                >
                  <span className="text-[10px] text-amber-400 block mb-0.5">
                    {"⭐ "}พรีเมียม
                  </span>
                  <div className="text-xs font-medium">
                    {!seasonProgress.is_premium ? (
                      <Lock className="w-3.5 h-3.5 mx-auto text-muted-foreground" />
                    ) : (
                      <>
                        {tier.premiumReward.coins && (
                          <span className="text-amber-500">{"🪙 "}{tier.premiumReward.coins}</span>
                        )}
                        {tier.premiumReward.item && (
                          <span className="text-purple-400 ml-1">{"🎁 "}ไอเทม</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Claim Button */}
                {available && (
                  <Button
                    size="sm"
                    className="mt-2 h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => handleClaim(tier.tier)}
                    disabled={claiming === tier.tier}
                  >
                    {claiming === tier.tier ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Gift className="w-3 h-3 mr-1" />
                        รับรางวัล
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Connector Line */}
              {index < seasonTiers.length - 1 && (
                <div className="flex items-center h-12 -mx-1">
                  <div
                    className={cn(
                      "h-1 w-6 rounded-full transition-all",
                      isTierUnlocked(tier.tier + 1)
                        ? "bg-emerald-500"
                        : isTierUnlocked(tier.tier)
                          ? "bg-gradient-to-r from-emerald-500 to-muted"
                          : "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Stats */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-card border border-border/50">
        <h3 className="text-sm font-semibold mb-3">สถิติเดือนนี้</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-amber-400">{currentTierNum}</p>
            <p className="text-[11px] text-muted-foreground">เทียร์ปัจจุบัน</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-400">
              {seasonProgress.rewards_claimed.length}
            </p>
            <p className="text-[11px] text-muted-foreground">รางวัลที่เคลมแล้ว</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">
              {seasonProgress.exp_earned.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">EXP ทั้งหมด</p>
          </div>
        </div>
      </div>

      {/* Premium Upsell */}
      {!seasonProgress.is_premium && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
          <p className="text-sm font-semibold text-center">
            {"⭐ "}อัพเกรดเป็นพรีเมียม
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            ปลดล็อกรางวัลพรีเมียมทั้ง 10 เทียร์!
          </p>
          <Button
            className="w-full mt-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            onClick={() => navigate("/premium")}
          >
            ดูรายละเอียด
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeasonPassPage;
