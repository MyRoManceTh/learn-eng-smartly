import { memo } from "react";
import { AvatarItem } from "@/types/avatar";
import { getRarityColor, getRarityLabel } from "@/data/avatarItems";
import PixelItemPreview from "./PixelItemPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ItemCardProps {
  item: AvatarItem;
  owned: boolean;
  equipped: boolean;
  coins: number;
  onBuy: (item: AvatarItem) => void;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (item: AvatarItem) => void;
  onPreview?: (item: AvatarItem) => void;
  onPreviewClear?: () => void;
}

const rarityGradients: Record<string, string> = {
  common: "from-slate-200 via-gray-100 to-slate-200",
  rare: "from-blue-200 via-cyan-100 to-blue-200",
  epic: "from-purple-200 via-pink-100 to-purple-200",
  legendary: "from-yellow-200 via-amber-100 to-yellow-200",
};

const rarityBorders: Record<string, string> = {
  common: "border-slate-300",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

const rarityGlow: Record<string, string> = {
  common: "",
  rare: "shadow-blue-400/20",
  epic: "shadow-purple-400/30",
  legendary: "shadow-yellow-400/40 animate-legendary-glow",
};

const ItemCard = memo(({ item, owned, equipped, coins, onBuy, onEquip, onUnequip, onPreview, onPreviewClear }: ItemCardProps) => {
  const canAfford = coins >= item.price;
  const isFree = item.price === 0;
  const isDefaultOwned = isFree;
  const isHat = item.category === "hat";

  return (
    <div
      className={`relative rounded-2xl border-3 p-2.5 text-center transition-all duration-300
        bg-gradient-to-br ${rarityGradients[item.rarity]}
        ${rarityBorders[item.rarity]}
        ${equipped
          ? "ring-3 ring-green-400 scale-[1.02] shadow-xl shadow-green-400/30 border-green-400"
          : owned || isDefaultOwned
          ? `hover:scale-[1.05] hover:shadow-lg ${rarityGlow[item.rarity]} cursor-pointer`
          : canAfford
          ? `hover:scale-[1.05] hover:shadow-lg ${rarityGlow[item.rarity]} cursor-pointer`
          : "opacity-50 grayscale-[30%]"
        }`}
      style={{
        borderWidth: "3px",
        ...(isHat && item.svgProps?.color ? {
          background: `linear-gradient(135deg, ${item.svgProps.color}15, ${item.svgProps.color}08, transparent)`,
        } : {}),
      }}
      onPointerEnter={() => onPreview?.(item)}
      onPointerLeave={() => onPreviewClear?.()}
    >
      {/* Rarity badge */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider whitespace-nowrap"
        style={{ backgroundColor: getRarityColor(item.rarity) }}
      >
        {getRarityLabel(item.rarity)}
      </div>

      {/* Equipped badge */}
      {equipped && (
        <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce-slow z-10">
          ✅ ใส่อยู่
        </div>
      )}

      {/* Item pixel preview with background circle */}
      <div className="mt-3 mb-1 flex justify-center">
        <div className={`${isHat ? "w-16 h-16" : "w-14 h-14"} rounded-full flex items-center justify-center
          bg-white/60 shadow-inner backdrop-blur-sm
          ${item.rarity === "legendary" ? "animate-pulse-soft" : ""}
          ${item.rarity === "epic" ? "animate-float" : ""}
        `}
          style={isHat && item.svgProps?.color ? {
            boxShadow: `0 0 12px ${item.svgProps.color}40, inset 0 1px 3px rgba(255,255,255,0.5)`,
          } : undefined}
        >
          <PixelItemPreview item={item} size={isHat ? "lg" : "sm"} />
        </div>
      </div>

      {/* Name */}
      <p className="text-[11px] font-black font-thai leading-tight truncate text-gray-800">
        {item.nameThai}
      </p>
      <p className="text-[9px] text-gray-500 leading-tight font-semibold">{item.name}</p>

      {/* Action area */}
      <div className="mt-2">
        {equipped ? (
          <button
            onClick={() => onUnequip(item)}
            className="w-full text-[10px] font-thai font-black text-white bg-gradient-to-r from-red-400 to-red-500
              rounded-xl py-1.5 hover:from-red-500 hover:to-red-600 transition-all
              shadow-md shadow-red-400/30 active:scale-95"
          >
            ✖ ถอดออก
          </button>
        ) : owned || isDefaultOwned ? (
          <button
            onClick={() => onEquip(item)}
            className="w-full text-[10px] font-thai font-black text-white bg-gradient-to-r from-green-400 to-emerald-500
              rounded-xl py-1.5 hover:from-green-500 hover:to-emerald-600 transition-all
              shadow-md shadow-green-400/30 active:scale-95"
          >
            👆 สวมใส่!
          </button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={!canAfford}
                className={`w-full text-[10px] font-black rounded-xl py-1.5 flex items-center justify-center gap-1 transition-all active:scale-95 ${
                  canAfford
                    ? "text-white bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-400/30 hover:from-amber-500 hover:to-orange-600"
                    : "text-gray-400 bg-gray-200 cursor-not-allowed"
                }`}
              >
                🪙 {item.price}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-4 mx-4" style={{ borderColor: getRarityColor(item.rarity) }}>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-thai text-center">
                  <div className="flex justify-center mb-3 animate-bounce">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/60 shadow-inner">
                      <PixelItemPreview item={item} size="lg" />
                    </div>
                  </div>
                  <div className="text-xl">ซื้อ {item.nameThai}?</div>
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="text-center space-y-3">
                    <span className="block text-sm font-semibold text-gray-500">{item.name}</span>
                    <span
                      className="inline-block text-xs font-black px-3 py-1 rounded-full text-white shadow-md"
                      style={{ backgroundColor: getRarityColor(item.rarity) }}
                    >
                      ⭐ {getRarityLabel(item.rarity)}
                    </span>
                    <div className="flex items-center justify-center gap-2 text-2xl font-black">
                      <span className="animate-coin-spin">🪙</span>
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        {item.price} เหรียญ
                      </span>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-2">
                <AlertDialogCancel className="font-thai rounded-xl font-bold">
                  ❌ ยกเลิก
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onBuy(item)}
                  className="font-thai rounded-xl font-black bg-gradient-to-r from-amber-400 to-orange-500
                    hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-400/30 text-white border-0"
                >
                  🛒 ซื้อเลย!
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
});

ItemCard.displayName = "ItemCard";

export default ItemCard;
