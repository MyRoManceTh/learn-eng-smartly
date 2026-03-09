import { useState } from "react";
import { avatarItems, getRarityColor, getRarityLabel } from "@/data/avatarItems";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  eventTheme: string;
  exclusiveItemIds: string[];
  coins: number;
  inventory: string[];
  onBuy: (item: any) => Promise<void>;
}

const themeEmojis: Record<string, string> = {
  songkran: "💦",
  christmas: "🎄",
  halloween: "🎃",
  loy_krathong: "🏮",
  new_year: "🎆",
  valentine: "💕",
};

const themeNames: Record<string, string> = {
  songkran: "สงกรานต์",
  christmas: "คริสต์มาส",
  halloween: "ฮาโลวีน",
  loy_krathong: "ลอยกระทง",
  new_year: "ปีใหม่",
  valentine: "วาเลนไทน์",
};

const EventShop = ({ eventTheme, exclusiveItemIds, coins, inventory, onBuy }: Props) => {
  const [buying, setBuying] = useState<string | null>(null);

  const exclusiveItems = exclusiveItemIds
    .map((id) => avatarItems.find((item) => item.id === id))
    .filter(Boolean);

  const themeEmoji = themeEmojis[eventTheme] || "🎉";
  const themeName = themeNames[eventTheme] || "พิเศษ";

  const handleBuy = async (item: any) => {
    if (buying) return;
    setBuying(item.id);
    try {
      await onBuy(item);
    } catch (err) {
      console.error("Buy error:", err);
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{themeEmoji}</span>
        <div>
          <h2 className="text-lg font-bold">
            {"🎪 "}ร้านค้าพิเศษ
          </h2>
          <p className="text-xs text-muted-foreground">
            {"ธีม: "}{themeName}
          </p>
        </div>
        {/* Coin display */}
        <div className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <span className="text-sm">{"🪙"}</span>
          <span className="text-sm font-bold text-amber-400">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Urgency Banner */}
      <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-center">
        <p className="text-xs font-medium text-red-400 animate-pulse">
          {"⏰ "}หมดเวลาแล้วจะไม่กลับมาอีก!
        </p>
      </div>

      {/* Items Grid */}
      {exclusiveItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            ไม่มีไอเทมพิเศษในตอนนี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {exclusiveItems.map((item) => {
            if (!item) return null;

            const isOwned = inventory.includes(item.id);
            const canAfford = coins >= item.price;
            const isDisabled = isOwned || !canAfford;
            const isBuying = buying === item.id;
            const rarityColor = getRarityColor(item.rarity);
            const rarityLabel = getRarityLabel(item.rarity);

            return (
              <div
                key={item.id}
                className={cn(
                  "relative p-4 rounded-2xl border transition-all",
                  isOwned
                    ? "bg-muted/30 border-border/30 opacity-60"
                    : "bg-card border-border/50 hover:border-primary/30"
                )}
              >
                {/* Rarity Badge */}
                <Badge
                  className="absolute top-2 right-2 text-[10px] px-1.5 py-0"
                  style={{
                    backgroundColor: `${rarityColor}20`,
                    color: rarityColor,
                    borderColor: `${rarityColor}40`,
                  }}
                  variant="outline"
                >
                  {rarityLabel}
                </Badge>

                {/* Item Icon */}
                <div className="text-center">
                  <div
                    className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-2"
                    style={{ backgroundColor: `${rarityColor}10` }}
                  >
                    {item.icon}
                  </div>

                  {/* Item Name */}
                  <p className="text-sm font-medium truncate">{item.nameThai}</p>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs">{"🪙"}</span>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        canAfford ? "text-amber-400" : "text-red-400"
                      )}
                    >
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  size="sm"
                  className={cn(
                    "w-full mt-3 h-8 text-xs font-semibold rounded-lg transition-all",
                    isOwned
                      ? "bg-muted text-muted-foreground"
                      : canAfford
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        : "bg-muted text-muted-foreground"
                  )}
                  disabled={isDisabled || isBuying}
                  onClick={() => handleBuy(item)}
                >
                  {isBuying ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isOwned ? (
                    "มีแล้ว ✓"
                  ) : !canAfford ? (
                    "เหรียญไม่พอ"
                  ) : (
                    "ซื้อ"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventShop;
