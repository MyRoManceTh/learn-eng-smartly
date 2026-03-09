export interface ShopItem {
  id: string;
  icon: string;
  name: string;
  nameThai: string;
  description: string;
  price: number;
  category: "power-up" | "cosmetic" | "special";
  /** How many times the user can buy this (0 = unlimited) */
  maxOwned: number;
  /** Rarity for visual styling */
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const shopItems: ShopItem[] = [
  // === Power-ups ===
  {
    id: "streak-freeze",
    icon: "🛡️",
    name: "Streak Freeze",
    nameThai: "ปกป้อง Streak",
    description: "ป้องกัน streak ไม่ให้หายถ้าลืมเข้าแอป 1 วัน",
    price: 50,
    category: "power-up",
    maxOwned: 3,
    rarity: "rare",
  },
  {
    id: "quiz-hint",
    icon: "💡",
    name: "Quiz Hint",
    nameThai: "คำใบ้ Quiz",
    description: "ตัดตัวเลือกผิดออก 1 ตัว ในแบบทดสอบ",
    price: 20,
    category: "power-up",
    maxOwned: 0,
    rarity: "common",
  },
  {
    id: "double-exp",
    icon: "⚡",
    name: "Double EXP",
    nameThai: "EXP x2",
    description: "ได้ EXP เป็น 2 เท่าจากการเรียน 1 ชั่วโมง",
    price: 80,
    category: "power-up",
    maxOwned: 0,
    rarity: "epic",
  },
  {
    id: "double-coins",
    icon: "💰",
    name: "Double Coins",
    nameThai: "เหรียญ x2",
    description: "ได้เหรียญเป็น 2 เท่าจากกิจกรรม 1 ชั่วโมง",
    price: 80,
    category: "power-up",
    maxOwned: 0,
    rarity: "epic",
  },
  {
    id: "skip-lesson",
    icon: "⏭️",
    name: "Skip Lesson",
    nameThai: "ข้ามบทเรียน",
    description: "ข้ามบทเรียนที่ยากไปก่อนได้ 1 บท",
    price: 150,
    category: "power-up",
    maxOwned: 0,
    rarity: "rare",
  },
  {
    id: "energy-refill",
    icon: "🔋",
    name: "Energy Refill",
    nameThai: "เติมพลังงาน",
    description: "เติมพลังงานเต็มทันที",
    price: 30,
    category: "power-up",
    maxOwned: 0,
    rarity: "common",
  },

  // === Cosmetics ===
  {
    id: "theme-ocean",
    icon: "🌊",
    name: "Ocean Theme",
    nameThai: "ธีมมหาสมุทร",
    description: "เปลี่ยนสีธีมเป็นโทนฟ้าทะเล",
    price: 100,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "rare",
  },
  {
    id: "theme-forest",
    icon: "🌲",
    name: "Forest Theme",
    nameThai: "ธีมป่าไม้",
    description: "เปลี่ยนสีธีมเป็นโทนเขียวธรรมชาติ",
    price: 100,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "rare",
  },
  {
    id: "theme-sunset",
    icon: "🌅",
    name: "Sunset Theme",
    nameThai: "ธีมพระอาทิตย์ตก",
    description: "เปลี่ยนสีธีมเป็นโทนส้มอมชมพู",
    price: 100,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "rare",
  },
  {
    id: "frame-gold",
    icon: "✨",
    name: "Gold Frame",
    nameThai: "กรอบทอง",
    description: "กรอบโปรไฟล์สีทองสุดหรู",
    price: 200,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "epic",
  },
  {
    id: "frame-rainbow",
    icon: "🌈",
    name: "Rainbow Frame",
    nameThai: "กรอบรุ้ง",
    description: "กรอบโปรไฟล์สายรุ้งวิบวับ",
    price: 300,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "legendary",
  },
  {
    id: "title-bookworm",
    icon: "📚",
    name: "Bookworm Title",
    nameThai: "ฉายา 'หนอนหนังสือ'",
    description: "แสดงฉายาพิเศษบนโปรไฟล์",
    price: 120,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "rare",
  },
  {
    id: "title-champion",
    icon: "🏆",
    name: "Champion Title",
    nameThai: "ฉายา 'แชมป์'",
    description: "แสดงฉายา 'แชมป์' บนโปรไฟล์",
    price: 250,
    category: "cosmetic",
    maxOwned: 1,
    rarity: "epic",
  },

  // === Special ===
  {
    id: "mystery-box",
    icon: "🎁",
    name: "Mystery Box",
    nameThai: "กล่องสุ่ม",
    description: "เปิดกล่องสุ่มรับรางวัลพิเศษ!",
    price: 30,
    category: "special",
    maxOwned: 0,
    rarity: "common",
  },
  {
    id: "gacha-ticket",
    icon: "🎟️",
    name: "Gacha Ticket",
    nameThai: "ตั๋วกาชา",
    description: "ตั๋วสำหรับหมุนกาชาตัวละคร",
    price: 60,
    category: "special",
    maxOwned: 0,
    rarity: "rare",
  },
];

export function getShopItemsByCategory(category: ShopItem["category"]): ShopItem[] {
  return shopItems.filter(i => i.category === category);
}

export const rarityColors: Record<ShopItem["rarity"], string> = {
  common: "border-gray-300 bg-gray-50",
  rare: "border-blue-300 bg-blue-50",
  epic: "border-purple-300 bg-purple-50",
  legendary: "border-amber-400 bg-amber-50",
};

export const rarityGlow: Record<ShopItem["rarity"], string> = {
  common: "",
  rare: "shadow-blue-200/50",
  epic: "shadow-purple-300/50",
  legendary: "shadow-amber-300/50 animate-pulse",
};
