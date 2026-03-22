import { useState } from "react";
import { ItemCategory, AvatarItem, EquippedItems } from "@/types/avatar";
import { getItemsByCategory, categoryLabels } from "@/data/avatarItems";
import ItemCard from "./ItemCard";

interface ShopSectionProps {
  coins: number;
  inventory: string[];
  equipped: EquippedItems;
  onBuy: (item: AvatarItem) => void;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (item: AvatarItem) => void;
}

const categoryColors: Record<string, string> = {
  skin: "from-orange-400 to-amber-500",
  hair: "from-pink-400 to-rose-500",
  hairColor: "from-violet-400 to-purple-500",
  hat: "from-yellow-400 to-orange-400",
  shirt: "from-green-400 to-emerald-500",
  pants: "from-indigo-400 to-blue-500",
  shoes: "from-teal-400 to-cyan-500",
  necklace: "from-pink-300 to-rose-400",
  leftHand: "from-blue-400 to-indigo-500",
  rightHand: "from-purple-400 to-violet-500",
  aura: "from-yellow-300 to-amber-400",
};

const ShopSection = ({ coins, inventory, equipped, onBuy, onEquip, onUnequip }: ShopSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>("skin");

  const items = getItemsByCategory(selectedCategory);
  const ownedSet = new Set(inventory);

  const getEquippedId = (category: ItemCategory): string | null => {
    return (equipped as unknown as Record<string, string | null>)[category] || null;
  };

  return (
    <div className="space-y-4">
      {/* Category selector - game style buttons */}
      <div className="flex gap-2 overflow-x-auto px-1 pb-2 no-scrollbar">
        {categoryLabels.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`relative flex flex-col items-center gap-0.5 min-w-[60px] px-3 py-2 rounded-2xl font-thai
                transition-all duration-200 active:scale-95
                ${isActive
                  ? `bg-gradient-to-br ${categoryColors[cat.key]} text-white shadow-lg scale-105 -translate-y-0.5`
                  : "bg-white/70 text-gray-600 hover:bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                }`}
              style={isActive ? { boxShadow: "0 4px 15px rgba(0,0,0,0.15)" } : {}}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[9px] font-bold whitespace-nowrap">{cat.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-md" />
              )}
            </button>
          );
        })}
      </div>

      {/* Items count */}
      <div className="flex items-center gap-2 px-1">
        <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-[10px] font-bold font-thai text-gray-400">
          {items.length} ไอเทม
        </span>
        <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="animate-pop-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
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
          <div className="text-6xl mb-3 animate-bounce">🤷</div>
          <p className="text-sm text-gray-400 font-bold">ไม่มีไอเทมในหมวดนี้</p>
        </div>
      )}
    </div>
  );
};

export default ShopSection;
