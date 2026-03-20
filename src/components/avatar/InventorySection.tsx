import { AvatarItem, EquippedItems, ItemCategory } from "@/types/avatar";
import { getItemById, avatarItems } from "@/data/avatarItems";
import ItemCard from "./ItemCard";

interface InventorySectionProps {
  inventory: string[];
  equipped: EquippedItems;
  coins: number;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (item: AvatarItem) => void;
}

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  skin: { label: "สีผิว", icon: "👤", color: "from-orange-400 to-amber-500" },
  hair: { label: "ทรงผม", icon: "💇", color: "from-pink-400 to-rose-500" },
  hairColor: { label: "สีผม", icon: "🎨", color: "from-violet-400 to-purple-500" },
  shirt: { label: "เสื้อ", icon: "👕", color: "from-green-400 to-emerald-500" },
  pants: { label: "กางเกง", icon: "👖", color: "from-indigo-400 to-blue-500" },
  shoes: { label: "รองเท้า", icon: "👟", color: "from-teal-400 to-cyan-500" },
  accessory: { label: "เครื่องประดับ", icon: "🎒", color: "from-fuchsia-400 to-pink-500" },
};

const InventorySection = ({ inventory, equipped, coins, onEquip, onUnequip }: InventorySectionProps) => {
  const defaultItems = avatarItems.filter((item) => item.price === 0);
  const purchasedItems = inventory
    .map((id) => getItemById(id))
    .filter((item): item is AvatarItem => item !== undefined);

  const allOwned = [...defaultItems, ...purchasedItems.filter((p) => p.price > 0)];

  const grouped = allOwned.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, AvatarItem[]>);

  const getEquippedId = (category: ItemCategory): string | null => {
    return (equipped as unknown as Record<string, string | null>)[category] || null;
  };

  if (allOwned.length === 0) {
    return (
      <div className="text-center py-16 font-thai">
        <div className="text-7xl mb-4 animate-bounce">🛍️</div>
        <p className="text-lg font-black text-gray-500">ยังไม่มีไอเทม</p>
        <p className="text-sm mt-2 text-gray-400">ไปซื้อที่ร้านค้าได้เลย! 🏪</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1.5 shadow-md">
          <span className="text-sm">📦</span>
          <span className="text-xs font-black font-thai text-gray-600">
            {allOwned.length} ไอเทม
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1.5 shadow-md">
          <span className="text-sm">🏷️</span>
          <span className="text-xs font-black font-thai text-gray-600">
            {Object.keys(grouped).length} หมวด
          </span>
        </div>
      </div>

      {Object.entries(grouped).map(([category, items], groupIndex) => {
        const config = categoryConfig[category];
        return (
          <div
            key={category}
            className="animate-pop-in"
            style={{ animationDelay: `${groupIndex * 100}ms` }}
          >
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex items-center gap-1.5 bg-gradient-to-r ${config?.color || "from-gray-400 to-gray-500"} text-white rounded-full px-3 py-1 shadow-md`}>
                <span className="text-sm">{config?.icon}</span>
                <span className="text-[11px] font-black font-thai">{config?.label || category}</span>
              </div>
              <div className="flex-1 h-0.5 rounded-full bg-gradient-to-r from-gray-200 to-transparent" />
              <span className="text-[10px] font-bold text-gray-400">{items.length}</span>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {items.map((item) => (
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
          </div>
        );
      })}
    </div>
  );
};

export default InventorySection;
