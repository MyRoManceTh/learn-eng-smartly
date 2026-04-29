import { AvatarItem } from "@/types/avatar";

/**
 * 🎰 Gacha Exclusive Items
 *
 * Design rules (NEVER violate):
 * - NO hats (project Core rule). Use accessories that render on the body.
 * - Only categories the avatar pipeline can render: necklace, leftHand,
 *   rightHand, aura, hairColor, skin, shoes, shirt.
 * - Every item is wearable + visible on the character.
 * - 24 curated items spread across 6 rarities (common → mythic).
 */
export const gachaExclusiveItems: AvatarItem[] = [
  // ═══ COMMON (4) — สีผมและรองเท้าสนุกๆ ═══
  { id: "gacha_haircolor_bubblegum", name: "Bubblegum", nameThai: "ผมหมากฝรั่ง", category: "hairColor", price: 0, rarity: "common", icon: "🩷", svgProps: { color: "#FF8FB1" } },
  { id: "gacha_haircolor_skyblue", name: "Sky Blue", nameThai: "ผมฟ้าใส", category: "hairColor", price: 0, rarity: "common", icon: "🩵", svgProps: { color: "#7EC8E3" } },
  { id: "gacha_shoes_jelly", name: "Jelly Shoes", nameThai: "รองเท้าเจลลี่", category: "shoes", price: 0, rarity: "common", icon: "🍬", svgProps: { color: "#FFB7D5" } },
  { id: "gacha_neck_clover", name: "Lucky Clover", nameThai: "จี้ใบโคลเวอร์", category: "necklace", price: 0, rarity: "common", icon: "🍀", svgProps: { color: "#66BB6A" } },

  // ═══ UNCOMMON (5) — เครื่องประดับน่ารัก ═══
  { id: "gacha_neck_candy", name: "Candy Locket", nameThai: "จี้ลูกอม", category: "necklace", price: 0, rarity: "uncommon", icon: "🍭", svgProps: { color: "#FF80AB" } },
  { id: "gacha_left_balloon", name: "Heart Balloon", nameThai: "ลูกโป่งหัวใจ", category: "leftHand", price: 0, rarity: "uncommon", icon: "🎈", svgProps: { color: "#EF5350" } },
  { id: "gacha_right_icecream", name: "Ice Cream Cone", nameThai: "ไอติมโคน", category: "rightHand", price: 0, rarity: "uncommon", icon: "🍦", svgProps: { color: "#FFE0B2" } },
  { id: "gacha_shoes_strawberry", name: "Berry Sneakers", nameThai: "รองเท้าเบอร์รี่", category: "shoes", price: 0, rarity: "uncommon", icon: "🍓", svgProps: { color: "#E91E63" } },
  { id: "gacha_haircolor_minty", name: "Minty Fresh", nameThai: "ผมมินต์ฟู", category: "hairColor", price: 0, rarity: "uncommon", icon: "🌱", svgProps: { color: "#4DD0A8" } },

  // ═══ RARE (5) — ของถือเท่ + ออร่าเริ่มต้น ═══
  { id: "gacha_left_book_glow", name: "Glowing Tome", nameThai: "ตำราเรืองแสง", category: "leftHand", price: 0, rarity: "rare", icon: "📖", svgProps: { color: "#26C6DA" } },
  { id: "gacha_right_quill", name: "Phoenix Quill", nameThai: "ขนนกฟีนิกซ์", category: "rightHand", price: 0, rarity: "rare", icon: "🪶", svgProps: { color: "#FF7043" } },
  { id: "gacha_neck_starlocket", name: "Star Locket", nameThai: "จี้ดวงดาว", category: "necklace", price: 0, rarity: "rare", icon: "⭐", svgProps: { color: "#FFD54F" } },
  { id: "gacha_aura_petals", name: "Petal Breeze", nameThai: "ออร่ากลีบดอก", category: "aura", price: 0, rarity: "rare", icon: "🌸", svgProps: { color: "#F48FB1" } },
  { id: "gacha_shirt_starry", name: "Starry Tee", nameThai: "เสื้อดวงดาว", category: "shirt", price: 0, rarity: "rare", icon: "✨", svgProps: { color: "#5E35B1", pattern: "plain" } },

  // ═══ EPIC (5) — อาวุธ/ออร่าโดดเด่น ═══
  { id: "gacha_right_crystal_wand", name: "Crystal Wand", nameThai: "ไม้กายสิทธิ์คริสตัล", category: "rightHand", price: 0, rarity: "epic", icon: "🔮", svgProps: { color: "#CE93D8" } },
  { id: "gacha_left_aurora_shield", name: "Aurora Shield", nameThai: "โล่แสงเหนือ", category: "leftHand", price: 0, rarity: "epic", icon: "🛡️", svgProps: { color: "#80DEEA" } },
  { id: "gacha_aura_galaxy", name: "Galaxy Aura", nameThai: "ออร่ากาแล็กซี่", category: "aura", price: 0, rarity: "epic", icon: "🌌", svgProps: { color: "#7C4DFF" } },
  { id: "gacha_neck_phoenix", name: "Phoenix Tear", nameThai: "หยดน้ำตาฟีนิกซ์", category: "necklace", price: 0, rarity: "epic", icon: "🔥", svgProps: { color: "#FF6F00" } },
  { id: "gacha_skin_porcelain", name: "Porcelain Glow", nameThai: "ผิวพอร์ซเลน", category: "skin", price: 0, rarity: "epic", icon: "🌟", svgProps: { color: "#FFF1E6" } },

  // ═══ LEGENDARY (4) — ดาบและออร่าระดับโลก ═══
  { id: "gacha_right_dragon_blade", name: "Dragon Blade", nameThai: "ดาบมังกรเพลิง", category: "rightHand", price: 0, rarity: "legendary", icon: "🐉", svgProps: { color: "#D84315" } },
  { id: "gacha_left_celestial_shield", name: "Celestial Shield", nameThai: "โล่สวรรค์", category: "leftHand", price: 0, rarity: "legendary", icon: "✨", svgProps: { color: "#FFD700" } },
  { id: "gacha_aura_rainbow", name: "Rainbow Aura", nameThai: "ออร่าสายรุ้ง", category: "aura", price: 0, rarity: "legendary", icon: "🌈", svgProps: { color: "rainbow" } },
  { id: "gacha_haircolor_aurora", name: "Aurora Hair", nameThai: "ผมแสงเหนือ", category: "hairColor", price: 0, rarity: "legendary", icon: "🌠", svgProps: { color: "#00E5FF" } },

  // ═══ MYTHIC (1) — สุดยอดของสะสม ═══
  { id: "gacha_aura_cosmic", name: "Cosmic Sovereign", nameThai: "ออร่าจักรวาล", category: "aura", price: 0, rarity: "mythic", icon: "💫", svgProps: { color: "rainbow" } },
];

/**
 * Drop rates — sums to 1.0
 * Tuned so mythic feels truly rare, but each pull still feels rewarding.
 */
export const GACHA_RATES = {
  common: 0.40,
  uncommon: 0.28,
  rare: 0.18,
  epic: 0.09,
  legendary: 0.045,
  mythic: 0.005,
} as const;

export const GACHA_COIN_COST = 50;
export const PITY_THRESHOLD = 10;
