import { AvatarItem } from "@/types/avatar";

/**
 * ไอเทม Exclusive เฉพาะกาชาเท่านั้น (ไม่ขายในร้านค้า)
 */
export const gachaExclusiveItems: AvatarItem[] = [
  // ═══ SHIRTS ═══
  { id: "gacha_shirt_dragon", name: "Dragon Scale", nameThai: "ชุดเกล็ดมังกร", category: "shirt", price: 0, rarity: "legendary", icon: "🐉", svgProps: { color: "#B71C1C", pattern: "dragonscale" } },
  { id: "gacha_shirt_galaxy", name: "Galaxy Outfit", nameThai: "ชุดกาแล็กซี่", category: "shirt", price: 0, rarity: "epic", icon: "🌌", svgProps: { color: "#0D1B3E", pattern: "galaxy" } },
  { id: "gacha_shirt_rainbow", name: "Rainbow Dress", nameThai: "ชุดสายรุ้ง", category: "shirt", price: 0, rarity: "epic", icon: "🌈", svgProps: { color: "#FF9A9E", pattern: "rainbow" } },

  // ═══ HATS ═══
  { id: "gacha_hat_angel", name: "Angel Wings Band", nameThai: "คาดผมปีกเทวดา", category: "hat", price: 0, rarity: "legendary", icon: "😇", svgProps: { color: "#FFFFFF" } },
  { id: "gacha_hat_devil", name: "Devil Horns", nameThai: "เขาปีศาจน่ารัก", category: "hat", price: 0, rarity: "epic", icon: "😈", svgProps: { color: "#E53935" } },
  { id: "gacha_hat_astronaut", name: "Space Helmet", nameThai: "หมวกอวกาศ", category: "hat", price: 0, rarity: "legendary", icon: "👨‍🚀", svgProps: { color: "#ECEFF1" } },
  { id: "gacha_hat_unicorn", name: "Unicorn Horn", nameThai: "เขายูนิคอร์น", category: "hat", price: 0, rarity: "epic", icon: "🦄", svgProps: { color: "#F8BBD0" } },

  // ═══ NECKLACE ═══
  { id: "gacha_neck_dragon_soul", name: "Dragon Soul", nameThai: "วิญญาณมังกร", category: "necklace", price: 0, rarity: "legendary", icon: "🐉", svgProps: { color: "#FF6F00" } },

  // ═══ LEFT HAND ═══
  { id: "gacha_left_spirit_shield", name: "Spirit Shield", nameThai: "โล่วิญญาณ", category: "leftHand", price: 0, rarity: "legendary", icon: "🛡️", svgProps: { color: "#CE93D8" } },

  // ═══ RIGHT HAND ═══
  { id: "gacha_right_spirit_blade", name: "Spirit Blade", nameThai: "ดาบวิญญาณ", category: "rightHand", price: 0, rarity: "legendary", icon: "⚔️", svgProps: { color: "#B3E5FC" } },

  // ═══ AURA ═══
  { id: "gacha_aura_rainbow", name: "Rainbow Aura", nameThai: "ออร่าสายรุ้ง", category: "aura", price: 0, rarity: "legendary", icon: "🌈", svgProps: { color: "rainbow" } },

  // ═══ SHOES ═══
  { id: "gacha_shoes_cloud", name: "Cloud Walkers", nameThai: "รองเท้าเมฆ", category: "shoes", price: 0, rarity: "epic", icon: "☁️", svgProps: { color: "#E3F2FD" } },

  // ═══ SKIN ═══
  { id: "gacha_skin_crystal", name: "Crystal Skin", nameThai: "ผิวคริสตัล", category: "skin", price: 0, rarity: "legendary", icon: "💎", svgProps: { color: "#E0F7FA" } },

  // ═══ HAIR COLOR ═══
  { id: "gacha_hair_aurora", name: "Aurora Hair", nameThai: "ผมแสงเหนือ", category: "hairColor", price: 0, rarity: "legendary", icon: "🌌", svgProps: { color: "#00E676" } },
];

export const GACHA_RATES = {
  common: 0.6,
  rare: 0.25,
  epic: 0.1,
  legendary: 0.05,
} as const;

export const GACHA_COIN_COST = 50;
export const PITY_THRESHOLD = 10;
