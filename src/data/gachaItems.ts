import { AvatarItem } from "@/types/avatar";

/**
 * ไอเทม Exclusive เฉพาะกาชาเท่านั้น (ไม่ขายในร้านค้า)
 * ✨ ออกแบบใหม่ทั้งหมด — สไตล์ Fantasy Kawaii
 */
export const gachaExclusiveItems: AvatarItem[] = [
  // ═══ SHIRTS — ชุดหายาก ═══
  {
    id: "gacha_shirt_dragon",
    name: "Dragon Scale",
    nameThai: "ชุดเกล็ดมังกร",
    category: "shirt",
    price: 0,
    rarity: "legendary",
    icon: "🐉",
    svgProps: { color: "#B71C1C", pattern: "dragonscale" },
  },
  {
    id: "gacha_shirt_galaxy",
    name: "Galaxy Outfit",
    nameThai: "ชุดกาแล็กซี่",
    category: "shirt",
    price: 0,
    rarity: "epic",
    icon: "🌌",
    svgProps: { color: "#0D1B3E", pattern: "galaxy" },
  },
  {
    id: "gacha_shirt_rainbow",
    name: "Rainbow Dress",
    nameThai: "ชุดสายรุ้ง",
    category: "shirt",
    price: 0,
    rarity: "epic",
    icon: "🌈",
    svgProps: { color: "#FF9A9E", pattern: "rainbow" },
  },

  // ═══ ACCESSORIES — เพื่อนร่วมทาง ═══
  {
    id: "gacha_acc_spirit_cat",
    name: "Spirit Cat",
    nameThai: "แมววิญญาณ",
    category: "accessory",
    price: 0,
    rarity: "legendary",
    icon: "🐱",
    svgProps: { color: "#CE93D8" },
  },
  {
    id: "gacha_acc_spirit_dog",
    name: "Spirit Dog",
    nameThai: "หมาวิญญาณ",
    category: "accessory",
    price: 0,
    rarity: "epic",
    icon: "🐕",
    svgProps: { color: "#90CAF9" },
  },
  {
    id: "gacha_acc_moon_bunny",
    name: "Moon Bunny",
    nameThai: "กระต่ายพระจันทร์",
    category: "accessory",
    price: 0,
    rarity: "legendary",
    icon: "🐇",
    svgProps: { color: "#FFF9C4" },
  },
  {
    id: "gacha_acc_crystal_blade",
    name: "Crystal Blade",
    nameThai: "ดาบคริสตัล",
    category: "accessory",
    price: 0,
    rarity: "legendary",
    icon: "⚔️",
    svgProps: { color: "#B3E5FC" },
  },
  {
    id: "gacha_acc_star_shield",
    name: "Starlight Shield",
    nameThai: "โล่แสงดาว",
    category: "accessory",
    price: 0,
    rarity: "epic",
    icon: "🛡️",
    svgProps: { color: "#FFF176" },
  },

  // ═══ SHOES ═══
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

  // ═══ SKIN ═══
  {
    id: "gacha_skin_crystal",
    name: "Crystal Skin",
    nameThai: "ผิวคริสตัล",
    category: "skin",
    price: 0,
    rarity: "legendary",
    icon: "💎",
    svgProps: { color: "#E0F7FA" },
  },

  // ═══ HAIR COLOR ═══
  {
    id: "gacha_hair_aurora",
    name: "Aurora Hair",
    nameThai: "ผมแสงเหนือ",
    category: "hairColor",
    price: 0,
    rarity: "legendary",
    icon: "🌌",
    svgProps: { color: "#00E676" },
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
