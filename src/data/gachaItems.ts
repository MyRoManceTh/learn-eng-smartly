import { AvatarItem } from "@/types/avatar";

/**
 * ไอเทม Exclusive เฉพาะกาชาเท่านั้น (ไม่ขายในร้านค้า)
 */
export const gachaExclusiveItems: AvatarItem[] = [
  // === Hats ===
  {
    id: "gacha_hat_halo",
    name: "Angel Halo",
    nameThai: "วงแหวนเทวดา",
    category: "hat",
    price: 0,
    rarity: "epic",
    icon: "😇",
    svgProps: { color: "#FFD700" },
  },
  {
    id: "gacha_hat_devil",
    name: "Devil Horns",
    nameThai: "เขาปีศาจ",
    category: "hat",
    price: 0,
    rarity: "epic",
    icon: "😈",
    svgProps: { color: "#D32F2F" },
  },
  {
    id: "gacha_hat_astronaut",
    name: "Astronaut Helmet",
    nameThai: "หมวกนักบินอวกาศ",
    category: "hat",
    price: 0,
    rarity: "legendary",
    icon: "🧑‍🚀",
    svgProps: { color: "#E0E0E0" },
  },
  // === Accessories ===
  {
    id: "gacha_acc_pet_cat",
    name: "Pet Cat",
    nameThai: "แมวน้อย",
    category: "accessory",
    price: 0,
    rarity: "legendary",
    icon: "🐱",
    svgProps: { color: "#FF9800" },
  },
  {
    id: "gacha_acc_pet_dog",
    name: "Pet Dog",
    nameThai: "หมาน้อย",
    category: "accessory",
    price: 0,
    rarity: "epic",
    icon: "🐕",
    svgProps: { color: "#8D6E63" },
  },
  {
    id: "gacha_acc_sword",
    name: "Magic Sword",
    nameThai: "ดาบวิเศษ",
    category: "accessory",
    price: 0,
    rarity: "legendary",
    icon: "⚔️",
    svgProps: { color: "#7C4DFF" },
  },
  {
    id: "gacha_acc_shield",
    name: "Golden Shield",
    nameThai: "โล่ทองคำ",
    category: "accessory",
    price: 0,
    rarity: "epic",
    icon: "🛡️",
    svgProps: { color: "#FFC107" },
  },
  // === Shirts ===
  {
    id: "gacha_shirt_dragon",
    name: "Dragon Armor",
    nameThai: "ชุดเกราะมังกร",
    category: "shirt",
    price: 0,
    rarity: "legendary",
    icon: "🐉",
    svgProps: { color: "#B71C1C" },
  },
  {
    id: "gacha_shirt_galaxy",
    name: "Galaxy Suit",
    nameThai: "ชุดกาแล็กซี",
    category: "shirt",
    price: 0,
    rarity: "epic",
    icon: "🌌",
    svgProps: { color: "#1A237E" },
  },
  // === Shoes ===
  {
    id: "gacha_shoes_cloud",
    name: "Cloud Walkers",
    nameThai: "รองเท้าเมฆ",
    category: "shoes",
    price: 0,
    rarity: "epic",
    icon: "☁️",
    svgProps: { color: "#E3F2FD" },
  },
  // === Skin ===
  {
    id: "gacha_skin_gold",
    name: "Golden Skin",
    nameThai: "ผิวทองคำ",
    category: "skin",
    price: 0,
    rarity: "legendary",
    icon: "✨",
    svgProps: { color: "#FFD54F" },
  },
  // === Hair Colors ===
  {
    id: "gacha_hair_galaxy",
    name: "Galaxy Hair",
    nameThai: "ผมกาแล็กซี",
    category: "hairColor",
    price: 0,
    rarity: "epic",
    icon: "🌌",
    svgProps: { color: "#7B1FA2" },
  },
  {
    id: "gacha_hair_fire",
    name: "Fire Hair",
    nameThai: "ผมเพลิง",
    category: "hairColor",
    price: 0,
    rarity: "legendary",
    icon: "🔥",
    svgProps: { color: "#FF5722" },
  },
];

export const GACHA_RATES = {
  common: 0.6,
  rare: 0.25,
  epic: 0.1,
  legendary: 0.05,
} as const;

export const GACHA_COIN_COST = 50;
export const PITY_THRESHOLD = 10; // การันตี epic หลัง 10 ครั้ง
