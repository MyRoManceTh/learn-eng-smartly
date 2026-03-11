import { RoomItem } from "@/types/room";

// Pet image imports
import petHippo from "@/assets/pets/pet-hippo.png";
import petHamster from "@/assets/pets/pet-hamster.png";
import petPenguin from "@/assets/pets/pet-penguin.png";
import petCorgi from "@/assets/pets/pet-corgi.png";
import petCalico from "@/assets/pets/pet-calico.png";
import petRedpanda from "@/assets/pets/pet-redpanda.png";
import petSloth from "@/assets/pets/pet-sloth.png";
import petAxolotl from "@/assets/pets/pet-axolotl.png";

export const PET_IMAGES: Record<string, string> = {
  pet_hippo: petHippo,
  pet_calico: petCalico,
  pet_corgi: petCorgi,
  pet_hamster: petHamster,
  pet_penguin: petPenguin,
  pet_redpanda: petRedpanda,
  pet_sloth: petSloth,
  pet_axolotl: petAxolotl,
};

export const roomItems: RoomItem[] = [
  // === WALLPAPERS ===
  { id: "wall_basic", name: "Basic Wall", nameThai: "ผนังพื้นฐาน", category: "wallpaper", price: 0, rarity: "common", icon: "🧱", pixel: "🧱", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "wall_blue", name: "Blue Sky Wall", nameThai: "ผนังท้องฟ้า", category: "wallpaper", price: 100, rarity: "common", icon: "🌤️", pixel: "🌤️", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "wall_space", name: "Space Wall", nameThai: "ผนังอวกาศ", category: "wallpaper", price: 300, rarity: "epic", icon: "🌌", pixel: "🌌", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "wall_forest", name: "Forest Wall", nameThai: "ผนังป่าไม้", category: "wallpaper", price: 200, rarity: "rare", icon: "🌲", pixel: "🌲", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "wall_ocean", name: "Ocean Wall", nameThai: "ผนังใต้ทะเล", category: "wallpaper", price: 400, rarity: "epic", icon: "🐠", pixel: "🐠", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },

  // === FLOORS ===
  { id: "floor_wood", name: "Wood Floor", nameThai: "พื้นไม้", category: "floor", price: 0, rarity: "common", icon: "🪵", pixel: "🪵", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "floor_carpet", name: "Red Carpet", nameThai: "พรมแดง", category: "floor", price: 150, rarity: "rare", icon: "🟥", pixel: "🟥", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "floor_grass", name: "Grass Floor", nameThai: "พื้นหญ้า", category: "floor", price: 200, rarity: "rare", icon: "🌿", pixel: "🌿", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: "floor_cloud", name: "Cloud Floor", nameThai: "พื้นเมฆ", category: "floor", price: 500, rarity: "legendary", icon: "☁️", pixel: "☁️", position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },

  // === DESKS ===
  { id: "desk_wood", name: "Wooden Desk", nameThai: "โต๊ะไม้", category: "desk", price: 80, rarity: "common", icon: "🪑", pixel: "🪑", position: { x: 1, y: 3 }, size: { w: 2, h: 1 } },
  { id: "desk_gamer", name: "Gamer Desk", nameThai: "โต๊ะเกมเมอร์", category: "desk", price: 300, rarity: "epic", icon: "🖥️", pixel: "🖥️", position: { x: 1, y: 3 }, size: { w: 2, h: 1 } },
  { id: "desk_magic", name: "Magic Table", nameThai: "โต๊ะเวทมนตร์", category: "desk", price: 500, rarity: "legendary", icon: "✨", pixel: "✨", position: { x: 1, y: 3 }, size: { w: 2, h: 1 } },

  // === BEDS ===
  { id: "bed_simple", name: "Simple Bed", nameThai: "เตียงธรรมดา", category: "bed", price: 100, rarity: "common", icon: "🛏️", pixel: "🛏️", position: { x: 5, y: 2 }, size: { w: 2, h: 2 } },
  { id: "bed_princess", name: "Princess Bed", nameThai: "เตียงเจ้าหญิง", category: "bed", price: 400, rarity: "epic", icon: "👑", pixel: "👑", position: { x: 5, y: 2 }, size: { w: 2, h: 2 } },
  { id: "bed_spaceship", name: "Spaceship Bed", nameThai: "เตียงยานอวกาศ", category: "bed", price: 600, rarity: "legendary", icon: "🚀", pixel: "🚀", position: { x: 5, y: 2 }, size: { w: 2, h: 2 } },

  // === SHELVES ===
  { id: "shelf_small", name: "Small Shelf", nameThai: "ชั้นเล็ก", category: "shelf", price: 60, rarity: "common", icon: "📚", pixel: "📚", position: { x: 0, y: 1 }, size: { w: 1, h: 2 } },
  { id: "shelf_big", name: "Big Bookshelf", nameThai: "ตู้หนังสือใหญ่", category: "shelf", price: 200, rarity: "rare", icon: "📖", pixel: "📖", position: { x: 0, y: 1 }, size: { w: 2, h: 2 } },
  { id: "shelf_enchanted", name: "Enchanted Shelf", nameThai: "ชั้นวิเศษ", category: "shelf", price: 500, rarity: "legendary", icon: "🔮", pixel: "🔮", position: { x: 0, y: 1 }, size: { w: 1, h: 2 } },

  // === POSTERS (unlockable) ===
  { id: "poster_abc", name: "ABC Poster", nameThai: "โปสเตอร์ ABC", category: "poster", price: 0, rarity: "common", icon: "🔤", pixel: "🔤", position: { x: 2, y: 0 }, size: { w: 1, h: 1 }, unlockedBy: "complete_10_lessons" },
  { id: "poster_world", name: "World Map", nameThai: "แผนที่โลก", category: "poster", price: 0, rarity: "rare", icon: "🗺️", pixel: "🗺️", position: { x: 3, y: 0 }, size: { w: 1, h: 1 }, unlockedBy: "complete_30_lessons" },
  { id: "poster_flame", name: "Flame Champion", nameThai: "โปสเตอร์แชมป์", category: "poster", price: 0, rarity: "epic", icon: "🔥", pixel: "🔥", position: { x: 4, y: 0 }, size: { w: 1, h: 1 }, unlockedBy: "streak_30" },
  { id: "poster_star", name: "Star Student", nameThai: "โปสเตอร์ดาวเด่น", category: "poster", price: 0, rarity: "legendary", icon: "⭐", pixel: "⭐", position: { x: 5, y: 0 }, size: { w: 1, h: 1 }, unlockedBy: "avg_score_90" },

  // === WINDOWS ===
  { id: "window_basic", name: "Basic Window", nameThai: "หน้าต่างธรรมดา", category: "window", price: 50, rarity: "common", icon: "🪟", pixel: "🪟", position: { x: 6, y: 0 }, size: { w: 1, h: 2 } },
  { id: "window_stained", name: "Stained Glass", nameThai: "กระจกสี", category: "window", price: 300, rarity: "epic", icon: "🏰", pixel: "🏰", position: { x: 6, y: 0 }, size: { w: 1, h: 2 } },

  // === PLANTS ===
  { id: "plant_cactus", name: "Cactus", nameThai: "กระบองเพชร", category: "plant", price: 40, rarity: "common", icon: "🌵", pixel: "🌵", position: { x: 7, y: 3 }, size: { w: 1, h: 1 } },
  { id: "plant_flower", name: "Flower Pot", nameThai: "กระถางดอกไม้", category: "plant", price: 80, rarity: "common", icon: "🌸", pixel: "🌸", position: { x: 7, y: 2 }, size: { w: 1, h: 1 } },
  { id: "plant_tree", name: "Magic Tree", nameThai: "ต้นไม้วิเศษ", category: "plant", price: 400, rarity: "epic", icon: "🌳", pixel: "🌳", position: { x: 7, y: 1 }, size: { w: 1, h: 2 } },

  // === TROPHIES (achievement unlocks) ===
  { id: "trophy_bronze", name: "Bronze Trophy", nameThai: "ถ้วยบรอนซ์", category: "trophy", price: 0, rarity: "common", icon: "🥉", pixel: "🥉", position: { x: 0, y: 2 }, size: { w: 1, h: 1 }, unlockedBy: "complete_5_lessons" },
  { id: "trophy_silver", name: "Silver Trophy", nameThai: "ถ้วยเงิน", category: "trophy", price: 0, rarity: "rare", icon: "🥈", pixel: "🥈", position: { x: 0, y: 2 }, size: { w: 1, h: 1 }, unlockedBy: "complete_20_lessons" },
  { id: "trophy_gold", name: "Gold Trophy", nameThai: "ถ้วยทอง", category: "trophy", price: 0, rarity: "epic", icon: "🥇", pixel: "🥇", position: { x: 0, y: 2 }, size: { w: 1, h: 1 }, unlockedBy: "complete_50_lessons" },
  { id: "trophy_diamond", name: "Diamond Trophy", nameThai: "ถ้วยเพชร", category: "trophy", price: 0, rarity: "legendary", icon: "💎", pixel: "💎", position: { x: 0, y: 2 }, size: { w: 1, h: 1 }, unlockedBy: "legend_stage" },

  // === PETS ===
  { id: "pet_hippo", name: "Pygmy Hippo", nameThai: "ฮิปโปแคระ", category: "pet", price: 500, rarity: "epic", icon: "🦛", pixel: "🦛", position: { x: 4, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_calico", name: "Calico Cat", nameThai: "แมวสามสี", category: "pet", price: 300, rarity: "rare", icon: "🐱", pixel: "🐱", position: { x: 4, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_corgi", name: "Corgi", nameThai: "คอร์กี้", category: "pet", price: 350, rarity: "rare", icon: "🐶", pixel: "🐶", position: { x: 5, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_hamster", name: "Hamster", nameThai: "แฮมสเตอร์", category: "pet", price: 200, rarity: "common", icon: "🐹", pixel: "🐹", position: { x: 3, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_penguin", name: "Penguin", nameThai: "เพนกวิน", category: "pet", price: 400, rarity: "epic", icon: "🐧", pixel: "🐧", position: { x: 4, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_redpanda", name: "Red Panda", nameThai: "แพนด้าแดง", category: "pet", price: 600, rarity: "epic", icon: "🦊", pixel: "🦊", position: { x: 5, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_sloth", name: "Sloth", nameThai: "สลอธ", category: "pet", price: 450, rarity: "rare", icon: "🦥", pixel: "🦥", position: { x: 3, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_axolotl", name: "Axolotl", nameThai: "แอกโซลอเติล", category: "pet", price: 700, rarity: "legendary", icon: "🦎", pixel: "🦎", position: { x: 4, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_bunny", name: "Bunny", nameThai: "กระต่าย", category: "pet", price: 250, rarity: "rare", icon: "🐰", pixel: "🐰", position: { x: 3, y: 4 }, size: { w: 1, h: 1 } },
  { id: "pet_dragon", name: "Baby Dragon", nameThai: "มังกรน้อย", category: "pet", price: 800, rarity: "legendary", icon: "🐉", pixel: "🐉", position: { x: 4, y: 4 }, size: { w: 1, h: 1 } },

  // === TOYS ===
  { id: "toy_console", name: "Game Console", nameThai: "เครื่องเกม", category: "toy", price: 200, rarity: "rare", icon: "🎮", pixel: "🎮", position: { x: 6, y: 3 }, size: { w: 1, h: 1 } },
  { id: "toy_teddy", name: "Teddy Bear", nameThai: "ตุ๊กตาหมี", category: "toy", price: 100, rarity: "common", icon: "🧸", pixel: "🧸", position: { x: 5, y: 3 }, size: { w: 1, h: 1 } },
  { id: "toy_robot", name: "Robot", nameThai: "หุ่นยนต์", category: "toy", price: 350, rarity: "epic", icon: "🤖", pixel: "🤖", position: { x: 6, y: 2 }, size: { w: 1, h: 1 } },
  { id: "toy_globe", name: "Globe", nameThai: "ลูกโลก", category: "toy", price: 150, rarity: "rare", icon: "🌍", pixel: "🌍", position: { x: 3, y: 3 }, size: { w: 1, h: 1 } },
];

export const roomItemsByCategory = (category: string) =>
  roomItems.filter((item) => item.category === category);

export const getRoomItem = (id: string) =>
  roomItems.find((item) => item.id === id);

export const WALLPAPER_COLORS: Record<string, { bg: string; pattern: string }> = {
  wall_basic: { bg: "#e8d5b7", pattern: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 9px)" },
  wall_blue: { bg: "#87CEEB", pattern: "repeating-linear-gradient(180deg, transparent, transparent 12px, rgba(255,255,255,0.15) 12px, rgba(255,255,255,0.15) 14px)" },
  wall_space: { bg: "#1a1a2e", pattern: "radial-gradient(1px 1px at 20px 30px, #fff, transparent), radial-gradient(1px 1px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent), radial-gradient(1px 1px at 130px 80px, #fff, transparent)" },
  wall_forest: { bg: "#2d5a27", pattern: "repeating-linear-gradient(180deg, transparent, transparent 10px, rgba(0,0,0,0.08) 10px, rgba(0,0,0,0.08) 12px)" },
  wall_ocean: { bg: "#1e6091", pattern: "repeating-linear-gradient(180deg, transparent, transparent 8px, rgba(255,255,255,0.08) 8px, rgba(255,255,255,0.08) 10px)" },
};

export const FLOOR_COLORS: Record<string, { bg: string; pattern: string }> = {
  floor_wood: { bg: "#8B6914", pattern: "repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.1) 12px, rgba(0,0,0,0.1) 13px)" },
  floor_carpet: { bg: "#c0392b", pattern: "repeating-conic-gradient(rgba(0,0,0,0.05) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px" },
  floor_grass: { bg: "#27ae60", pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 5px)" },
  floor_cloud: { bg: "#ecf0f1", pattern: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 70%)" },
};
