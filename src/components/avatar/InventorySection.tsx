import { AvatarItem, EquippedItems, ItemCategory } from "@/types/avatar";
import { getItemById, avatarItems } from "@/data/avatarItems";
import ItemCard from "./ItemCard";
import { EmojiIcon } from "@/components/ui/EmojiIcon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categoryLabels } from "@/data/avatarItems";

interface InventorySectionProps {
  inventory: string[];
  equipped: EquippedItems;
  coins: number;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (item: AvatarItem) => void;
}

const hiddenCategories = new Set(["hat"]);

const InventorySection = ({ inventory, equipped, coins, onEquip, onUnequip }: InventorySectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>("shirt");
  const defaultItems = avatarItems.filter((item) => item.price === 0);
  const purchasedItems = inventory
    .map((id) => getItemById(id))
    .filter((item): item is AvatarItem => item !== undefined);

  const allOwned = [...defaultItems, ...purchasedItems.filter((p) => p.price > 0)].filter(item => !hiddenCategories.has(item.category));

  const filteredItems = allOwned.filter(item => item.category === selectedCategory);

  const getEquippedId = (category: ItemCategory): string | null => {
    return (equipped as unknown as Record<string, string | null>)[category] || null;
  };

  if (allOwned.length === 0) {
    return (
      <div className="text-center py-16 font-thai">
        <div className="text-5xl mb-4"><EmojiIcon emoji="🛍" /></div>
        <p className="text-lg font-black text-foreground">ยังไม่มีไอเทม</p>
        <p className="text-sm mt-2 text-muted-foreground">ไปซื้อที่ร้านค้าได้เลย!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="หมวดไอเทมที่มี">
        {categoryLabels.map(cat => (
          <Button key={cat.key} variant="ghost" onClick={() => setSelectedCategory(cat.key)} aria-pressed={selectedCategory === cat.key}
            className={`flex flex-col items-center gap-0.5 min-w-[72px] h-16 px-2 font-thai rounded-md ${selectedCategory === cat.key ? "bg-arcade-blue text-primary-foreground hover:bg-arcade-blue/90 hover:text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-arcade-blue/10"}`}>
            <span className="text-xl"><EmojiIcon emoji={cat.icon} /></span><span className="text-[10px] font-bold whitespace-nowrap">{cat.label}</span>
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground font-thai"><span className="h-px flex-1 bg-border" />{filteredItems.length} ไอเทม<span className="h-px flex-1 bg-border" /></div>
      {filteredItems.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  owned={true}
                  equipped={getEquippedId(item.category as ItemCategory) === item.id}
                  coins={coins}
                  onBuy={() => {}}
                  onEquip={onEquip}
                  onUnequip={onUnequip}
                />
              ))}
            </div>
      ) : <p className="text-center text-sm text-muted-foreground font-thai py-12">ยังไม่มีไอเทมในหมวดนี้</p>}
    </div>
  );
};

export default InventorySection;
