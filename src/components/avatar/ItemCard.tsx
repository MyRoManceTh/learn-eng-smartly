import { memo } from "react";
import { AvatarItem } from "@/types/avatar";
import { getRarityLabel } from "@/data/avatarItems";
import PixelItemPreview from "./PixelItemPreview";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Coins, Check } from "lucide-react";

interface ItemCardProps {
  item: AvatarItem;
  owned: boolean;
  equipped: boolean;
  coins: number;
  onBuy: (item: AvatarItem) => void;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (item: AvatarItem) => void;
}

const rarityStyle: Record<AvatarItem["rarity"], string> = {
  common: "bg-secondary text-secondary-foreground",
  uncommon: "bg-quiz-correct/15 text-quiz-correct",
  rare: "bg-arcade-blue/15 text-arcade-blue",
  epic: "bg-accent/15 text-accent",
  legendary: "bg-arcade-gold/25 text-foreground",
  mythic: "bg-arcade-coral/25 text-foreground",
};

const ItemCard = memo(({ item, owned, equipped, coins, onBuy, onEquip, onUnequip }: ItemCardProps) => {
  const canAfford = coins >= item.price;
  const isOwned = owned || item.price === 0;
  return (
    <div className={`min-w-0 flex flex-col rounded-md border bg-card p-3 transition-colors ${equipped ? "border-arcade-blue ring-1 ring-arcade-blue" : "border-border hover:border-arcade-blue/60"}`}>
      <div className="flex justify-between items-start gap-1 min-h-6">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${rarityStyle[item.rarity]}`}>{getRarityLabel(item.rarity)}</span>
        {equipped && <span className="flex gap-1 items-center text-[10px] font-bold text-arcade-blue whitespace-nowrap"><Check className="w-3 h-3" />ใส่อยู่</span>}
      </div>
      <div className="my-3 mx-auto w-20 h-20 flex items-center justify-center rounded-md bg-secondary/70">
        <PixelItemPreview item={item} size="sm" />
      </div>
      <p className="text-sm font-bold font-thai text-foreground leading-tight break-words min-h-9">{item.nameThai}</p>
      <p className="text-xs text-muted-foreground truncate mt-0.5" title={item.name}>{item.name}</p>
      <div className="mt-auto pt-3">
        {equipped ? (
          <Button variant="outline" className="w-full h-9 text-xs font-thai" onClick={() => onUnequip(item)}>ถอดออก</Button>
        ) : isOwned ? (
          <Button className="w-full h-9 text-xs font-thai bg-arcade-blue text-primary-foreground hover:bg-arcade-blue/90" onClick={() => onEquip(item)}>สวมใส่</Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!canAfford} variant="outline" className="w-full h-9 gap-1 text-xs font-thai"><Coins className="h-3.5 w-3.5 text-arcade-gold" />{item.price} เหรียญ</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm">
              <AlertDialogHeader>
                <div className="mx-auto mb-2 w-24 h-24 flex items-center justify-center rounded-md bg-secondary"><PixelItemPreview item={item} size="lg" /></div>
                <AlertDialogTitle className="font-thai text-center">ซื้อ {item.nameThai}?</AlertDialogTitle>
                <AlertDialogDescription className="text-center font-thai">{getRarityLabel(item.rarity)} · {item.price} เหรียญ</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-thai">ยกเลิก</AlertDialogCancel>
                <AlertDialogAction onClick={() => onBuy(item)} className="font-thai bg-arcade-blue text-primary-foreground hover:bg-arcade-blue/90">ซื้อเลย</AlertDialogAction>
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