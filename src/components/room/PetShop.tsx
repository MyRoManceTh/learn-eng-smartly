import { useState } from "react";
import { roomItems, PET_IMAGES, getRoomItem } from "@/data/roomItems";
import { RoomLayout } from "@/types/room";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PetShopProps {
  coins: number;
  roomInventory: string[];
  room: RoomLayout;
  onBuyPet: (item: typeof roomItems[0]) => void;
  onPlacePet: (item: typeof roomItems[0]) => void;
  onRemovePet: (itemId: string) => void;
}

const RARITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  common: { label: "ธรรมดา", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-300" },
  rare: { label: "หายาก", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300" },
  epic: { label: "พิเศษ", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-300" },
  legendary: { label: "ตำนาน", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-400" },
};

const PetShop = ({ coins, roomInventory, room, onBuyPet, onPlacePet, onRemovePet }: PetShopProps) => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  const allPets = roomItems.filter((i) => i.category === "pet");
  const activePetId = room.items.find((id) => {
    const item = getRoomItem(id);
    return item?.category === "pet";
  });

  const ownsPet = (id: string) =>
    roomInventory.includes(id) || roomItems.find((i) => i.id === id)?.price === 0;

  const isPetPlaced = (id: string) => room.items.includes(id);

  return (
    <div className="space-y-4">
      {/* Active pet display */}
      {activePetId && PET_IMAGES[activePetId] && (
        <div className="rounded-2xl border border-white/50 bg-gradient-to-b from-green-50 to-emerald-50/50 p-4 shadow-lg text-center">
          <p className="text-xs font-thai font-semibold text-muted-foreground mb-2">🐾 สัตว์เลี้ยงของฉัน</p>
          <div className="relative inline-block">
            <img
              src={PET_IMAGES[activePetId]}
              alt={getRoomItem(activePetId)?.nameThai}
              className="w-24 h-24 object-contain mx-auto animate-bounce pixelated"
              style={{ animationDuration: "3s", imageRendering: "pixelated" }}
            />
            <div className="w-16 h-3 mx-auto mt-1 rounded-full bg-black/10 blur-sm" />
          </div>
          <p className="font-thai font-bold text-sm mt-2">{getRoomItem(activePetId)?.nameThai}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 font-thai text-xs"
            onClick={() => onRemovePet(activePetId)}
          >
            เก็บเข้าคลัง
          </Button>
        </div>
      )}

      {/* Pet grid */}
      <div className="grid grid-cols-2 gap-3">
        {allPets.map((pet) => {
          const owned = ownsPet(pet.id);
          const placed = isPetPlaced(pet.id);
          const rarity = RARITY_CONFIG[pet.rarity];
          const image = PET_IMAGES[pet.id];
          const isSelected = selectedPet === pet.id;

          return (
            <div
              key={pet.id}
              className={cn(
                "rounded-2xl border-2 p-3 transition-all duration-200 cursor-pointer",
                placed
                  ? "border-green-400 bg-green-50/80 shadow-md shadow-green-200/50"
                  : isSelected
                    ? `${rarity.border} ${rarity.bg} shadow-lg scale-[1.02]`
                    : "border-white/60 bg-white/80 hover:border-white/80 hover:shadow-md"
              )}
              onClick={() => setSelectedPet(isSelected ? null : pet.id)}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Pet image or emoji fallback */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt={pet.nameThai}
                      className="w-full h-full object-contain pixelated"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-4xl">{pet.pixel}</span>
                  )}
                  {placed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <p className="text-xs font-thai font-bold text-center leading-tight">
                  {pet.nameThai}
                </p>
                <p className="text-[10px] text-muted-foreground">{pet.name}</p>

                {/* Rarity badge */}
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  rarity.bg, rarity.color
                )}>
                  {rarity.label}
                </span>

                {/* Action */}
                {placed ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onRemovePet(pet.id); }}
                    className="font-thai text-xs w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    ✓ อยู่ในห้อง
                  </Button>
                ) : owned ? (
                  <Button
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onPlacePet(pet); }}
                    className="font-thai text-xs w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    🐾 วางในห้อง
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); onBuyPet(pet); }}
                    disabled={coins < pet.price}
                    className={cn(
                      "font-thai text-xs w-full",
                      coins < pet.price && "opacity-50"
                    )}
                  >
                    🪙 {pet.price} เหรียญ
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetShop;
