import { AvatarItem, ItemCategory, ItemRarity } from "@/types/avatar";
import { gachaExclusiveItems } from "@/data/gachaItems";

export const avatarItems: AvatarItem[] = [
  // ═══════════════════════════════════════════
  // 🎨 SKIN (8)
  // ═══════════════════════════════════════════
  { id: "skin_default", name: "Peach", nameThai: "ผิวพีช", category: "skin", price: 0, rarity: "common", icon: "🍑", svgProps: { color: "#FDDCB5" } },
  { id: "skin_warm", name: "Honey", nameThai: "ผิวน้ำผึ้ง", category: "skin", price: 50, rarity: "common", icon: "🍯", svgProps: { color: "#E8C49B" } },
  { id: "skin_cocoa", name: "Cocoa", nameThai: "ผิวโกโก้", category: "skin", price: 50, rarity: "common", icon: "☕", svgProps: { color: "#C48B5C" } },
  { id: "skin_espresso", name: "Espresso", nameThai: "ผิวเอสเปรสโซ", category: "skin", price: 50, rarity: "common", icon: "🫘", svgProps: { color: "#8B6248" } },
  { id: "skin_rose", name: "Rose Petal", nameThai: "ผิวกลีบกุหลาบ", category: "skin", price: 100, rarity: "rare", icon: "🌹", svgProps: { color: "#FFD5E0" } },
  { id: "skin_pearl", name: "Pearl", nameThai: "ผิวไข่มุก", category: "skin", price: 150, rarity: "rare", icon: "🦪", svgProps: { color: "#FFF5EE" } },
  { id: "skin_lavender", name: "Lavender Dream", nameThai: "ผิวลาเวนเดอร์", category: "skin", price: 200, rarity: "epic", icon: "💜", svgProps: { color: "#E0C8FF" } },
  { id: "skin_mint", name: "Mint Fresh", nameThai: "ผิวมินต์", category: "skin", price: 200, rarity: "epic", icon: "🌿", svgProps: { color: "#B8F0D8" } },

  // ═══════════════════════════════════════════
  // 💇 HAIR STYLES (10)
  // ═══════════════════════════════════════════
  { id: "hair_default", name: "Soft Bob", nameThai: "บ๊อบนุ่มนิ่ม", category: "hair", price: 0, rarity: "common", icon: "💇", svgProps: { path: "softbob" } },
  { id: "hair_long", name: "Silky Long", nameThai: "ผมยาวเรียบ", category: "hair", price: 80, rarity: "common", icon: "👱", svgProps: { path: "silkylong" } },
  { id: "hair_twintails", name: "Twin Tails", nameThai: "ผมสองหาง", category: "hair", price: 120, rarity: "rare", icon: "🎀", svgProps: { path: "twintails" } },
  { id: "hair_wavy", name: "Beach Waves", nameThai: "ผมลอนทะเล", category: "hair", price: 100, rarity: "rare", icon: "🌊", svgProps: { path: "wavy" } },
  { id: "hair_messy", name: "Messy Cute", nameThai: "ผมยุ่งน่ารัก", category: "hair", price: 100, rarity: "rare", icon: "🌸", svgProps: { path: "messy" } },
  { id: "hair_ponytail", name: "High Ponytail", nameThai: "หางม้าสูง", category: "hair", price: 120, rarity: "rare", icon: "✨", svgProps: { path: "highpony" } },
  { id: "hair_spacebuns", name: "Space Buns", nameThai: "บันอวกาศ", category: "hair", price: 200, rarity: "epic", icon: "🪐", svgProps: { path: "spacebuns" } },
  { id: "hair_fluffy", name: "Cloud Fluffy", nameThai: "ผมฟูเมฆ", category: "hair", price: 200, rarity: "epic", icon: "☁️", svgProps: { path: "fluffy" } },
  { id: "hair_princess", name: "Princess Curls", nameThai: "ผมเจ้าหญิง", category: "hair", price: 250, rarity: "epic", icon: "👸", svgProps: { path: "princess" } },
  { id: "hair_mohawk", name: "Electric Hawk", nameThai: "ม็อกฮอว์คเท่", category: "hair", price: 400, rarity: "legendary", icon: "⚡", svgProps: { path: "electrichawk" } },

  // ═══════════════════════════════════════════
  // 🎨 HAIR COLORS (10)
  // ═══════════════════════════════════════════
  { id: "haircolor_midnight", name: "Midnight", nameThai: "มิดไนท์", category: "hairColor", price: 0, rarity: "common", icon: "🌙", svgProps: { color: "#1A1A2E" } },
  { id: "haircolor_chestnut", name: "Chestnut", nameThai: "เกาลัด", category: "hairColor", price: 50, rarity: "common", icon: "🌰", svgProps: { color: "#7B4B2A" } },
  { id: "haircolor_caramel", name: "Caramel", nameThai: "คาราเมล", category: "hairColor", price: 60, rarity: "common", icon: "🍮", svgProps: { color: "#C4914B" } },
  { id: "haircolor_strawberry", name: "Strawberry", nameThai: "สตรอว์เบอร์รี่", category: "hairColor", price: 100, rarity: "rare", icon: "🍓", svgProps: { color: "#FF7B93" } },
  { id: "haircolor_ocean", name: "Ocean Blue", nameThai: "มหาสมุทร", category: "hairColor", price: 100, rarity: "rare", icon: "🌊", svgProps: { color: "#3498DB" } },
  { id: "haircolor_lavender", name: "Lavender", nameThai: "ลาเวนเดอร์", category: "hairColor", price: 150, rarity: "epic", icon: "💐", svgProps: { color: "#C39BD3" } },
  { id: "haircolor_sakura", name: "Sakura Pink", nameThai: "ซากุระ", category: "hairColor", price: 150, rarity: "epic", icon: "🌸", svgProps: { color: "#FFB7C5" } },
  { id: "haircolor_mint", name: "Mint", nameThai: "มินต์", category: "hairColor", price: 180, rarity: "epic", icon: "🍃", svgProps: { color: "#7DCEA0" } },
  { id: "haircolor_sunset", name: "Sunset", nameThai: "พระอาทิตย์ตก", category: "hairColor", price: 200, rarity: "epic", icon: "🌅", svgProps: { color: "#FF6348" } },
  { id: "haircolor_rainbow", name: "Holographic", nameThai: "โฮโลแกรม", category: "hairColor", price: 350, rarity: "legendary", icon: "🌈", svgProps: { color: "rainbow" } },

  // ═══════════════════════════════════════════
  // 🎩 HATS (10) — ไม่มีเนคไท
  // ═══════════════════════════════════════════
  { id: "hat_beret", name: "Cute Beret", nameThai: "เบเรต์น่ารัก", category: "hat", price: 80, rarity: "common", icon: "🎩", svgProps: { color: "#FF8A80" } },
  { id: "hat_bucket", name: "Bucket Hat", nameThai: "หมวกบักเก็ต", category: "hat", price: 80, rarity: "common", icon: "🪣", svgProps: { color: "#80CBC4" } },
  { id: "hat_beanie", name: "Cozy Beanie", nameThai: "บีนนี่อุ่นๆ", category: "hat", price: 100, rarity: "common", icon: "🧢", svgProps: { color: "#CE93D8" } },
  { id: "hat_catears", name: "Cat Ears", nameThai: "หูแมวคาวาอิ", category: "hat", price: 120, rarity: "rare", icon: "🐱", svgProps: { color: "#F8BBD0" } },
  { id: "hat_bunnyears", name: "Bunny Ears", nameThai: "หูกระต่าย", category: "hat", price: 120, rarity: "rare", icon: "🐰", svgProps: { color: "#FFFFFF" } },
  { id: "hat_flowerband", name: "Flower Crown", nameThai: "มงกุฎดอกไม้", category: "hat", price: 150, rarity: "rare", icon: "🌸", svgProps: { color: "#FF69B4" } },
  { id: "hat_headphones", name: "Neon Headphones", nameThai: "หูฟังเรืองแสง", category: "hat", price: 200, rarity: "rare", icon: "🎧", svgProps: { color: "#00E5FF" } },
  { id: "hat_witch", name: "Star Witch Hat", nameThai: "หมวกแม่มดดาว", category: "hat", price: 280, rarity: "epic", icon: "🧙", svgProps: { color: "#4A148C" } },
  { id: "hat_tiara", name: "Crystal Tiara", nameThai: "มงกุฎคริสตัล", category: "hat", price: 350, rarity: "epic", icon: "👑", svgProps: { color: "#B39DDB" } },
  { id: "hat_crown", name: "Royal Crown", nameThai: "มงกุฎราชา", category: "hat", price: 500, rarity: "legendary", icon: "👑", svgProps: { color: "#FFD700" } },

  // ═══════════════════════════════════════════
  // 👕 SHIRTS (8) — ออกแบบใหม่ ไม่มีเนคไท
  // ═══════════════════════════════════════════
  // ชุดเริ่มต้น: เสื้อยืดธรรมดา ไม่มีลวดลาย
  { id: "shirt_default", name: "Plain Tee", nameThai: "เสื้อยืดธรรมดา", category: "shirt", price: 0, rarity: "common", icon: "👕", svgProps: { color: "#A8D8EA", pattern: "plain" } },
  { id: "shirt_stripe", name: "Stripe Tee", nameThai: "เสื้อลายทาง", category: "shirt", price: 60, rarity: "common", icon: "👕", svgProps: { color: "#FFFFFF", pattern: "stripe" } },
  { id: "shirt_hoodie", name: "Bear Hoodie", nameThai: "ฮู้ดหมีน้อย", category: "shirt", price: 180, rarity: "rare", icon: "🧸", svgProps: { color: "#D7BDE2", pattern: "bearhoodie" } },
  { id: "shirt_overalls", name: "Cute Overalls", nameThai: "เอี๊ยมน่ารัก", category: "shirt", price: 150, rarity: "rare", icon: "👗", svgProps: { color: "#82B1FF", pattern: "overalls" } },
  { id: "shirt_cardigan", name: "Pastel Cardigan", nameThai: "คาร์ดิแกนพาสเทล", category: "shirt", price: 160, rarity: "rare", icon: "🧥", svgProps: { color: "#FADBD8", pattern: "cardigan" } },
  { id: "shirt_magical", name: "Magical Dress", nameThai: "ชุดเมจิคอล", category: "shirt", price: 300, rarity: "epic", icon: "💫", svgProps: { color: "#FF69B4", pattern: "magical" } },
  { id: "shirt_kimono", name: "Sakura Kimono", nameThai: "กิโมโนซากุระ", category: "shirt", price: 350, rarity: "epic", icon: "🌸", svgProps: { color: "#FFE4E1", pattern: "kimono" } },
  { id: "shirt_celestial", name: "Celestial Robe", nameThai: "ชุดดวงดาว", category: "shirt", price: 500, rarity: "legendary", icon: "🌟", svgProps: { color: "#1A1A4E", pattern: "celestial" } },

  // ═══════════════════════════════════════════
  // 👖 PANTS (6)
  // ═══════════════════════════════════════════
  { id: "pants_default", name: "Soft Joggers", nameThai: "กางเกงขายาวนุ่ม", category: "pants", price: 0, rarity: "common", icon: "👖", svgProps: { color: "#B0C4DE" } },
  { id: "pants_shorts", name: "Puffy Shorts", nameThai: "กางเกงสั้นพอง", category: "pants", price: 60, rarity: "common", icon: "🩳", svgProps: { color: "#F8C8DC" } },
  { id: "pants_pleated", name: "Pleated Skirt", nameThai: "กระโปรงพลีท", category: "pants", price: 120, rarity: "rare", icon: "👗", svgProps: { color: "#1B2A4A" } },
  { id: "pants_cargo", name: "Cute Cargo", nameThai: "คาร์โก้น่ารัก", category: "pants", price: 100, rarity: "rare", icon: "🪖", svgProps: { color: "#8FBC8F" } },
  { id: "pants_tutu", name: "Tutu Skirt", nameThai: "กระโปรงทูทู่", category: "pants", price: 250, rarity: "epic", icon: "🩰", svgProps: { color: "#FFB7D5" } },
  { id: "pants_starry", name: "Galaxy Pants", nameThai: "กางเกงกาแล็กซี่", category: "pants", price: 300, rarity: "epic", icon: "🌌", svgProps: { color: "#1A1A3E" } },

  // ═══════════════════════════════════════════
  // 👟 SHOES (6)
  // ═══════════════════════════════════════════
  { id: "shoes_default", name: "Pastel Sneakers", nameThai: "ผ้าใบพาสเทล", category: "shoes", price: 0, rarity: "common", icon: "👟", svgProps: { color: "#FFE4F0" } },
  { id: "shoes_sandals", name: "Flower Sandals", nameThai: "แตะดอกไม้", category: "shoes", price: 60, rarity: "common", icon: "🌼", svgProps: { color: "#FFE0B2" } },
  { id: "shoes_boots", name: "Lace Boots", nameThai: "บูทผูกเชือก", category: "shoes", price: 120, rarity: "rare", icon: "🥾", svgProps: { color: "#6D4C41" } },
  { id: "shoes_maryjane", name: "Mary Jane", nameThai: "แมรี่เจน", category: "shoes", price: 100, rarity: "rare", icon: "👠", svgProps: { color: "#1A1A1A" } },
  { id: "shoes_platform", name: "Star Platform", nameThai: "แพลตฟอร์มดาว", category: "shoes", price: 250, rarity: "epic", icon: "⭐", svgProps: { color: "#FF69B4" } },
  { id: "shoes_roller", name: "Roller Skates", nameThai: "โรลเลอร์สเก็ต", category: "shoes", price: 300, rarity: "epic", icon: "🛼", svgProps: { color: "#00BCD4" } },

  // ═══════════════════════════════════════════
  // 📿 NECKLACE (6) — สร้อยคอ slot ใหม่
  // ═══════════════════════════════════════════
  { id: "neck_heart", name: "Heart Pendant", nameThai: "จี้หัวใจ", category: "necklace", price: 80, rarity: "common", icon: "💗", svgProps: { color: "#FF4081" } },
  { id: "neck_star", name: "Star Pendant", nameThai: "จี้ดาว", category: "necklace", price: 80, rarity: "common", icon: "⭐", svgProps: { color: "#FFD700" } },
  { id: "neck_pearl", name: "Pearl Necklace", nameThai: "สร้อยไข่มุก", category: "necklace", price: 150, rarity: "rare", icon: "🦪", svgProps: { color: "#FFFFFF" } },
  { id: "neck_crystal", name: "Crystal Drop", nameThai: "จี้คริสตัล", category: "necklace", price: 200, rarity: "rare", icon: "💎", svgProps: { color: "#B3E5FC" } },
  { id: "neck_moon", name: "Moon Crescent", nameThai: "จี้พระจันทร์", category: "necklace", price: 280, rarity: "epic", icon: "🌙", svgProps: { color: "#FFF9C4" } },
  { id: "neck_dragon", name: "Dragon Fang", nameThai: "เขี้ยวมังกร", category: "necklace", price: 400, rarity: "legendary", icon: "🐉", svgProps: { color: "#FF6F00" } },

  // ═══════════════════════════════════════════
  // 🫲 LEFT HAND (6) — ของถือมือซ้าย
  // ═══════════════════════════════════════════
  { id: "left_shield", name: "Round Shield", nameThai: "โล่กลม", category: "leftHand", price: 120, rarity: "common", icon: "🛡️", svgProps: { color: "#78909C" } },
  { id: "left_lantern", name: "Magic Lantern", nameThai: "โคมไฟเวทย์", category: "leftHand", price: 150, rarity: "rare", icon: "🏮", svgProps: { color: "#FF8F00" } },
  { id: "left_book", name: "Spell Book", nameThai: "หนังสือเวทย์", category: "leftHand", price: 180, rarity: "rare", icon: "📖", svgProps: { color: "#4A148C" } },
  { id: "left_flower", name: "Bouquet", nameThai: "ช่อดอกไม้", category: "leftHand", price: 100, rarity: "common", icon: "💐", svgProps: { color: "#FF80AB" } },
  { id: "left_crystal_shield", name: "Crystal Shield", nameThai: "โล่คริสตัล", category: "leftHand", price: 350, rarity: "epic", icon: "💠", svgProps: { color: "#B3E5FC" } },
  { id: "left_star_shield", name: "Starlight Shield", nameThai: "โล่แสงดาว", category: "leftHand", price: 500, rarity: "legendary", icon: "🌟", svgProps: { color: "#FFD700" } },

  // ═══════════════════════════════════════════
  // 🫱 RIGHT HAND (6) — ของถือมือขวา
  // ═══════════════════════════════════════════
  { id: "right_wand", name: "Magic Wand", nameThai: "ไม้กายสิทธิ์", category: "rightHand", price: 120, rarity: "common", icon: "🪄", svgProps: { color: "#CE93D8" } },
  { id: "right_sword", name: "Short Sword", nameThai: "ดาบสั้น", category: "rightHand", price: 150, rarity: "rare", icon: "⚔️", svgProps: { color: "#90A4AE" } },
  { id: "right_staff", name: "Magic Staff", nameThai: "ไม้เท้าเวทย์", category: "rightHand", price: 200, rarity: "rare", icon: "🔮", svgProps: { color: "#7E57C2" } },
  { id: "right_torch", name: "Flame Torch", nameThai: "คบเพลิง", category: "rightHand", price: 180, rarity: "rare", icon: "🔥", svgProps: { color: "#FF6D00" } },
  { id: "right_crystal_blade", name: "Crystal Blade", nameThai: "ดาบคริสตัล", category: "rightHand", price: 400, rarity: "epic", icon: "💎", svgProps: { color: "#B3E5FC" } },
  { id: "right_lightning_sword", name: "Thunder Blade", nameThai: "ดาบสายฟ้า", category: "rightHand", price: 500, rarity: "legendary", icon: "⚡", svgProps: { color: "#FFD600" } },

  // ═══════════════════════════════════════════
  // ✨ AURA (5) — ออร่าพลัง
  // ═══════════════════════════════════════════
  { id: "aura_fire", name: "Fire Aura", nameThai: "ออร่าไฟ", category: "aura", price: 200, rarity: "rare", icon: "🔥", svgProps: { color: "#FF6D00" } },
  { id: "aura_ice", name: "Ice Aura", nameThai: "ออร่าน้ำแข็ง", category: "aura", price: 200, rarity: "rare", icon: "❄️", svgProps: { color: "#B3E5FC" } },
  { id: "aura_lightning", name: "Lightning Aura", nameThai: "ออร่าสายฟ้า", category: "aura", price: 300, rarity: "epic", icon: "⚡", svgProps: { color: "#FFD600" } },
  { id: "aura_dark", name: "Dark Aura", nameThai: "ออร่ามืด", category: "aura", price: 300, rarity: "epic", icon: "🌑", svgProps: { color: "#4A148C" } },
  { id: "aura_supersaiyan", name: "Super Saiyan", nameThai: "ออร่าซุปเปอร์ไซย่า", category: "aura", price: 600, rarity: "legendary", icon: "💥", svgProps: { color: "#FFD600" } },
];

export const getItemsByCategory = (category: ItemCategory): AvatarItem[] =>
  avatarItems.filter((item) => item.category === category);

export const getItemById = (id: string): AvatarItem | undefined =>
  avatarItems.find((item) => item.id === id) ?? gachaExclusiveItems.find((item) => item.id === id);

export const getRarityColor = (rarity: ItemRarity): string => {
  const colors: Record<ItemRarity, string> = {
    common: "#9E9E9E",
    rare: "#2196F3",
    epic: "#9C27B0",
    legendary: "#FFD700",
  };
  return colors[rarity];
};

export const getRarityLabel = (rarity: ItemRarity): string => {
  const labels: Record<ItemRarity, string> = {
    common: "ธรรมดา",
    rare: "หายาก",
    epic: "พิเศษ",
    legendary: "ตำนาน",
  };
  return labels[rarity];
};

export const categoryLabels: { key: ItemCategory; label: string; icon: string }[] = [
  { key: "skin", label: "สีผิว", icon: "🍑" },
  { key: "hair", label: "ทรงผม", icon: "💇" },
  { key: "hairColor", label: "สีผม", icon: "🎨" },
  { key: "hat", label: "หมวก", icon: "🎩" },
  { key: "shirt", label: "เสื้อ", icon: "👕" },
  { key: "pants", label: "กางเกง", icon: "👖" },
  { key: "shoes", label: "รองเท้า", icon: "👟" },
  { key: "necklace", label: "สร้อยคอ", icon: "📿" },
  { key: "leftHand", label: "มือซ้าย", icon: "🫲" },
  { key: "rightHand", label: "มือขวา", icon: "🫱" },
  { key: "aura", label: "ออร่า", icon: "✨" },
];
