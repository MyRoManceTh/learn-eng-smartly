import { useState } from "react";
import { ItemCategory, AvatarItem, EquippedItems } from "@/types/avatar";
import { getItemsByCategory, categoryLabels } from "@/data/avatarItems";
import ItemCard from "./ItemCard";
import { EmojiIcon } from "@/components/ui/EmojiIcon";
import { Button } from "@/components/ui/button";

interface ShopSectionProps {
  coins: number;
  inventory: string[];
  equipped: EquippedItems;
  onBuy: (item: AvatarItem) => void;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (item: AvatarItem) => void;
}

const ShopSection = ({ coins, inventory, equipped, onBuy, onEquip, onUnequip }: ShopSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>("shirt");

  const items = getItemsByCategory(selectedCategory);
  const ownedSet = new Set(inventory);

  const getEquippedId = (category: ItemCategory): string | null => {
    return (equipped as unknown as Record<string, string | null>)[category] || null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="หมวดสินค้า">
        {categoryLabels.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <Button
              variant="ghost"
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-0.5 min-w-[72px] h-16 px-2 font-thai rounded-md ${isActive ? "bg-arcade-blue text-primary-foreground hover:bg-arcade-blue/90 hover:text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-arcade-blue/10"}`}
            >
              <span className="text-xl"><EmojiIcon emoji={cat.icon} /></span>
              <span className="text-[10px] font-bold whitespace-nowrap">{cat.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Items count */}
      <div className="flex items-center gap-2 px-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold font-thai text-muted-foreground">
          {items.length} ไอเทม
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id}>
            <ItemCard
              item={item}
              owned={ownedSet.has(item.id)}
              equipped={getEquippedId(item.category) === item.id}
              coins={coins}
              onBuy={onBuy}
              onEquip={onEquip}
              onUnequip={onUnequip}
            />
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 font-thai">
          <div className="text-5xl mb-3"><EmojiIcon emoji="🤷" /></div>
          <p className="text-sm text-muted-foreground font-bold">ไม่มีไอเทมในหมวดนี้</p>
        </div>
      )}
    </div>
  );
};

export default ShopSection;
