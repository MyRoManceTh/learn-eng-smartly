import { useState } from "react";
import { roomItems, PET_IMAGES, getRoomItem } from "@/data/roomItems";
import { RoomLayout } from "@/types/room";
import { PetCareState, PET_FOODS, PET_LEVEL_TITLES, getPetLevel, getPetExpProgress, PetFood } from "@/data/petCare";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PetShopProps {
  coins: number;
  roomInventory: string[];
  room: RoomLayout;
  petCare: PetCareState;
  onBuyPet: (item: typeof roomItems[0]) => void;
  onPlacePet: (item: typeof roomItems[0]) => void;
  onRemovePet: (itemId: string) => void;
  onFeedPet: (petId: string, food: PetFood) => void;
}

const RARITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  common: { label: "ธรรมดา", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-300" },
  rare: { label: "หายาก", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300" },
  epic: { label: "พิเศษ", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-300" },
  legendary: { label: "ตำนาน", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-400" },
};

const PetShop = ({ coins, roomInventory, room, petCare, onBuyPet, onPlacePet, onRemovePet, onFeedPet }: PetShopProps) => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [feedingPet, setFeedingPet] = useState<string | null>(null);

  const allPets = roomItems.filter((i) => i.category === "pet");
  const activePetId = room.items.find((id) => getRoomItem(id)?.category === "pet");

  const ownsPet = (id: string) =>
    roomInventory.includes(id) || roomItems.find((i) => i.id === id)?.price === 0;

  const isPetPlaced = (id: string) => room.items.includes(id);

  return (
    <div className="space-y-4">
      {/* Active pet with care panel */}
      {activePetId && PET_IMAGES[activePetId] && (() => {
        const care = petCare[activePetId] || { level: 1, exp: 0, happiness: 50, hunger: 50, lastFed: "", totalFeedings: 0 };
        const level = getPetLevel(care.exp);
        const expProgress = getPetExpProgress(care.exp);
        const levelTitle = PET_LEVEL_TITLES[level] || PET_LEVEL_TITLES[1];
        const petInfo = getRoomItem(activePetId);

        return (
          <div className="rounded-2xl border border-white/50 bg-gradient-to-b from-green-50 to-emerald-50/50 p-4 shadow-lg">
            <p className="text-xs font-thai font-semibold text-muted-foreground mb-2 text-center">🐾 สัตว์เลี้ยงของฉัน</p>

            <div className="flex items-center gap-4">
              {/* Pet image */}
              <div className="flex-shrink-0 text-center">
                <img
                  src={PET_IMAGES[activePetId]}
                  alt={petInfo?.nameThai}
                  className="w-20 h-20 object-contain mx-auto pixelated"
                  style={{ imageRendering: "pixelated" }}
                />
                <p className="font-thai font-bold text-sm mt-1">{petInfo?.nameThai}</p>
              </div>

              {/* Stats */}
              <div className="flex-1 space-y-2">
                {/* Level */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{levelTitle.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-thai font-bold">Lv.{level} {levelTitle.th}</span>
                      <span className="text-[9px] text-muted-foreground">{expProgress.current}/{expProgress.needed} EXP</span>
                    </div>
                    <Progress value={expProgress.percent} className="h-2" />
                  </div>
                </div>

                {/* Happiness */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">😊</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] font-thai">ความสุข</span>
                      <span className="text-[9px] text-muted-foreground">{care.happiness}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${care.happiness}%`,
                          background: care.happiness > 60 ? "#22c55e" : care.happiness > 30 ? "#eab308" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hunger */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">🍽️</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] font-thai">ความอิ่ม</span>
                      <span className="text-[9px] text-muted-foreground">{care.hunger}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${care.hunger}%`,
                          background: care.hunger > 60 ? "#22c55e" : care.hunger > 30 ? "#eab308" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-muted-foreground font-thai">
                  ให้อาหารแล้ว {care.totalFeedings} ครั้ง
                </p>
              </div>
            </div>

            {/* Feed buttons */}
            <div className="mt-3">
              <p className="text-[10px] font-thai font-semibold mb-2">🍽️ ให้อาหาร</p>
              <div className="grid grid-cols-4 gap-2">
                {PET_FOODS.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => onFeedPet(activePetId, food)}
                    className="flex flex-col items-center gap-0.5 p-2 rounded-xl bg-white/80 border border-white/60 hover:bg-white hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <span className="text-xl">{food.icon}</span>
                    <span className="text-[8px] font-thai font-semibold leading-tight">{food.nameThai}</span>
                    <span className="text-[7px] text-muted-foreground">+{food.expGain} EXP</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-3 font-thai text-xs w-full"
              onClick={() => onRemovePet(activePetId)}
            >
              เก็บเข้าคลัง
            </Button>
          </div>
        );
      })()}

      {/* Pet grid */}
      <div className="grid grid-cols-2 gap-3">
        {allPets.map((pet) => {
          const owned = ownsPet(pet.id);
          const placed = isPetPlaced(pet.id);
          const rarity = RARITY_CONFIG[pet.rarity];
          const image = PET_IMAGES[pet.id];
          const care = petCare[pet.id];
          const level = care ? getPetLevel(care.exp) : 0;
          const levelTitle = level > 0 ? PET_LEVEL_TITLES[level] : null;

          return (
            <div
              key={pet.id}
              className={cn(
                "rounded-2xl border-2 p-3 transition-all duration-200 cursor-pointer",
                placed
                  ? "border-green-400 bg-green-50/80 shadow-md shadow-green-200/50"
                  : "border-white/60 bg-white/80 hover:border-white/80 hover:shadow-md"
              )}
              onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
            >
              <div className="flex flex-col items-center gap-1.5">
                {/* Pet image */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  {image ? (
                    <img src={image} alt={pet.nameThai} className="w-full h-full object-contain pixelated" style={{ imageRendering: "pixelated" }} />
                  ) : (
                    <span className="text-3xl">{pet.pixel}</span>
                  )}
                  {placed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                  )}
                  {level > 0 && (
                    <div className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[8px] font-bold">
                      Lv.{level}
                    </div>
                  )}
                </div>

                <p className="text-xs font-thai font-bold text-center leading-tight">{pet.nameThai}</p>
                {levelTitle && (
                  <span className="text-[9px] text-muted-foreground">{levelTitle.icon} {levelTitle.th}</span>
                )}

                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", rarity.bg, rarity.color)}>
                  {rarity.label}
                </span>

                {/* Action - FREE BUY for testing */}
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
                    onClick={(e) => { e.stopPropagation(); onBuyPet(pet); }}
                    className="font-thai text-xs w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
                  >
                    🎁 รับฟรี! (ทดสอบ)
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
