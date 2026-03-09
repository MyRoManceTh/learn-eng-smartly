import { AvatarItem, ItemCategory, ItemRarity } from "@/types/avatar";

export const avatarItems: AvatarItem[] = [
  // === SKIN (6) ===
  { id: "skin_default", name: "Light", nameThai: "ผิวขาว", category: "skin", price: 0, rarity: "common", icon: "👤", svgProps: { color: "#F5D5C0" } },
  { id: "skin_tan", name: "Tan", nameThai: "ผิวสองสี", category: "skin", price: 50, rarity: "common", icon: "👤", svgProps: { color: "#E8C4A0" } },
  { id: "skin_brown", name: "Brown", nameThai: "ผิวคล้ำ", category: "skin", price: 50, rarity: "common", icon: "👤", svgProps: { color: "#C8956B" } },
  { id: "skin_dark", name: "Dark", nameThai: "ผิวเข้ม", category: "skin", price: 50, rarity: "common", icon: "👤", svgProps: { color: "#8D6449" } },
  { id: "skin_pink", name: "Rosy", nameThai: "ผิวชมพู", category: "skin", price: 100, rarity: "rare", icon: "🌸", svgProps: { color: "#FFD0E0" } },
  { id: "skin_blue", name: "Cool Blue", nameThai: "ผิวฟ้า", category: "skin", price: 200, rarity: "epic", icon: "🔵", svgProps: { color: "#B0D4FF" } },

  // === HAIR STYLES (8) ===
  { id: "hair_default", name: "Short Hair", nameThai: "ผมสั้น", category: "hair", price: 0, rarity: "common", icon: "💇", svgProps: { path: "short" } },
  { id: "hair_long", name: "Long Hair", nameThai: "ผมยาว", category: "hair", price: 80, rarity: "common", icon: "👱", svgProps: { path: "long" } },
  { id: "hair_ponytail", name: "Ponytail", nameThai: "ผมหางม้า", category: "hair", price: 100, rarity: "rare", icon: "🎀", svgProps: { path: "ponytail" } },
  { id: "hair_bun", name: "Bun", nameThai: "ผมมวย", category: "hair", price: 100, rarity: "rare", icon: "🥨", svgProps: { path: "bun" } },
  { id: "hair_curly", name: "Curly", nameThai: "ผมหยิก", category: "hair", price: 150, rarity: "rare", icon: "🌀", svgProps: { path: "curly" } },
  { id: "hair_spike", name: "Spiky", nameThai: "ผมตั้ง", category: "hair", price: 120, rarity: "rare", icon: "⚡", svgProps: { path: "spike" } },
  { id: "hair_afro", name: "Afro", nameThai: "ผมแอฟโฟร", category: "hair", price: 200, rarity: "epic", icon: "☁️", svgProps: { path: "afro" } },
  { id: "hair_mohawk", name: "Mohawk", nameThai: "ผมโมฮอว์ค", category: "hair", price: 250, rarity: "epic", icon: "🔥", svgProps: { path: "mohawk" } },

  // === HAIR COLORS (8) ===
  { id: "haircolor_black", name: "Black", nameThai: "ดำ", category: "hairColor", price: 0, rarity: "common", icon: "⬛", svgProps: { color: "#2C2C2C" } },
  { id: "haircolor_brown", name: "Brown", nameThai: "น้ำตาล", category: "hairColor", price: 50, rarity: "common", icon: "🟤", svgProps: { color: "#6B4226" } },
  { id: "haircolor_blonde", name: "Blonde", nameThai: "บลอนด์", category: "hairColor", price: 80, rarity: "rare", icon: "🟡", svgProps: { color: "#F4D03F" } },
  { id: "haircolor_red", name: "Red", nameThai: "แดง", category: "hairColor", price: 100, rarity: "rare", icon: "🔴", svgProps: { color: "#D32F2F" } },
  { id: "haircolor_blue", name: "Blue", nameThai: "ฟ้า", category: "hairColor", price: 150, rarity: "epic", icon: "🔵", svgProps: { color: "#2196F3" } },
  { id: "haircolor_pink", name: "Pink", nameThai: "ชมพู", category: "hairColor", price: 150, rarity: "epic", icon: "🩷", svgProps: { color: "#EC407A" } },
  { id: "haircolor_green", name: "Green", nameThai: "เขียว", category: "hairColor", price: 180, rarity: "epic", icon: "🟢", svgProps: { color: "#4CAF50" } },
  { id: "haircolor_rainbow", name: "Rainbow", nameThai: "รุ้ง", category: "hairColor", price: 300, rarity: "legendary", icon: "🌈", svgProps: { color: "rainbow" } },

  // === HATS (6) ===
  { id: "hat_baseball", name: "Baseball Cap", nameThai: "หมวกแก๊ป", category: "hat", price: 80, rarity: "common", icon: "🧢", svgProps: { color: "#E53935" } },
  { id: "hat_beanie", name: "Beanie", nameThai: "หมวกไหมพรม", category: "hat", price: 100, rarity: "common", icon: "🎩", svgProps: { color: "#5D4037" } },
  { id: "hat_crown", name: "Crown", nameThai: "มงกุฎ", category: "hat", price: 500, rarity: "legendary", icon: "👑", svgProps: { color: "#FFD700" } },
  { id: "hat_wizard", name: "Wizard Hat", nameThai: "หมวกพ่อมด", category: "hat", price: 250, rarity: "epic", icon: "🧙", svgProps: { color: "#7B1FA2" } },
  { id: "hat_santa", name: "Santa Hat", nameThai: "หมวกซานตา", category: "hat", price: 200, rarity: "rare", icon: "🎅", svgProps: { color: "#C62828" } },
  { id: "hat_headphones", name: "Headphones", nameThai: "หูฟัง", category: "hat", price: 150, rarity: "rare", icon: "🎧", svgProps: { color: "#212121" } },

  // === SHIRTS (5) ===
  { id: "shirt_default", name: "Plain Tee", nameThai: "เสื้อยืด", category: "shirt", price: 0, rarity: "common", icon: "👕", svgProps: { color: "#4DB6AC" } },
  { id: "shirt_striped", name: "Striped Tee", nameThai: "เสื้อลายทาง", category: "shirt", price: 100, rarity: "common", icon: "👕", svgProps: { pattern: "stripes", color: "#1565C0" } },
  { id: "shirt_hoodie", name: "Hoodie", nameThai: "เสื้อฮู้ด", category: "shirt", price: 200, rarity: "rare", icon: "🧥", svgProps: { color: "#37474F" } },
  { id: "shirt_superhero", name: "Superhero Suit", nameThai: "ชุดซูเปอร์ฮีโร่", category: "shirt", price: 400, rarity: "epic", icon: "🦸", svgProps: { color: "#D32F2F", pattern: "hero" } },
  { id: "shirt_tuxedo", name: "Tuxedo", nameThai: "สูทหรู", category: "shirt", price: 500, rarity: "legendary", icon: "🤵", svgProps: { color: "#1A1A2E" } },

  // === PANTS (4) ===
  { id: "pants_default", name: "Basic Pants", nameThai: "กางเกงขายาว", category: "pants", price: 0, rarity: "common", icon: "👖", svgProps: { color: "#4A90E2" } },
  { id: "pants_jeans", name: "Jeans", nameThai: "ยีนส์", category: "pants", price: 80, rarity: "common", icon: "👖", svgProps: { color: "#1E3A5F" } },
  { id: "pants_shorts", name: "Shorts", nameThai: "กางเกงขาสั้น", category: "pants", price: 60, rarity: "common", icon: "🩳", svgProps: { color: "#8D6E63" } },
  { id: "pants_skirt", name: "Skirt", nameThai: "กระโปรง", category: "pants", price: 120, rarity: "rare", icon: "👗", svgProps: { color: "#EC407A" } },

  // === SHOES (4) ===
  { id: "shoes_default", name: "Sneakers", nameThai: "รองเท้าผ้าใบ", category: "shoes", price: 0, rarity: "common", icon: "👟", svgProps: { color: "#F0F0F0" } },
  { id: "shoes_boots", name: "Boots", nameThai: "บูท", category: "shoes", price: 100, rarity: "common", icon: "🥾", svgProps: { color: "#5D4037" } },
  { id: "shoes_heels", name: "High Heels", nameThai: "ส้นสูง", category: "shoes", price: 150, rarity: "rare", icon: "👠", svgProps: { color: "#C62828" } },
  { id: "shoes_rocket", name: "Rocket Boots", nameThai: "รองเท้าจรวด", category: "shoes", price: 400, rarity: "legendary", icon: "🚀", svgProps: { color: "#FF6D00" } },

  // === ACCESSORIES (4) ===
  { id: "acc_glasses", name: "Glasses", nameThai: "แว่นตา", category: "accessory", price: 120, rarity: "common", icon: "👓", svgProps: { color: "#212121" } },
  { id: "acc_backpack", name: "Backpack", nameThai: "กระเป๋า", category: "accessory", price: 150, rarity: "rare", icon: "🎒", svgProps: { color: "#E65100" } },
  { id: "acc_wings", name: "Wings", nameThai: "ปีก", category: "accessory", price: 500, rarity: "legendary", icon: "🦋", svgProps: { color: "#80DEEA" } },
  { id: "acc_cape", name: "Cape", nameThai: "ผ้าคลุม", category: "accessory", price: 350, rarity: "epic", icon: "🦸", svgProps: { color: "#D32F2F" } },
];

export const getItemsByCategory = (category: ItemCategory): AvatarItem[] =>
  avatarItems.filter((item) => item.category === category);

export const getItemById = (id: string): AvatarItem | undefined =>
  avatarItems.find((item) => item.id === id);

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
  { key: "skin", label: "สีผิว", icon: "👤" },
  { key: "hair", label: "ทรงผม", icon: "💇" },
  { key: "hairColor", label: "สีผม", icon: "🎨" },
  { key: "hat", label: "หมวก", icon: "🧢" },
  { key: "shirt", label: "เสื้อ", icon: "👕" },
  { key: "pants", label: "กางเกง", icon: "👖" },
  { key: "shoes", label: "รองเท้า", icon: "👟" },
  { key: "accessory", label: "เครื่องประดับ", icon: "🎒" },
];
