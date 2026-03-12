import type { ClassroomZone, ZoneId, ZoneSpeech } from "@/types/classroom";

export const CLASSROOM_ZONES: ClassroomZone[] = [
  {
    id: "bookshelf",
    nameThai: "ชั้นหนังสือ",
    nameEn: "Bookshelf",
    icon: "📚",
    position: { x: 10, bottom: 15 },
    furniturePosition: { left: "3%", bottom: "28%", zIndex: 4, scale: 1.1 },
    route: "/reading",
    speeches: [
      { th: "อ่านหนังสืออะไรดีนะ~", en: "What to read~" },
      { th: "มีเรื่องใหม่มาเยอะ!", en: "So many new stories!" },
      { th: "ฝึกอ่านภาษาอังกฤษ 📖", en: "Reading practice! 📖" },
    ],
    furnitureEmoji: "📚",
    decorEmojis: ["📖", "🔖"],
    characterPose: "reading",
  },
  {
    id: "desk",
    nameThai: "โต๊ะเรียน",
    nameEn: "Study Desk",
    icon: "📝",
    position: { x: 28, bottom: 15 },
    furniturePosition: { left: "20%", bottom: "18%", zIndex: 5, scale: 1.15 },
    route: "/learn",
    speeches: [
      { th: "มาเรียนกันเถอะ!", en: "Let's study!" },
      { th: "วันนี้เรียนอะไรดี?", en: "What shall we learn?" },
      { th: "ตั้งใจเรียนนะ 📚", en: "Focus time! 📚" },
    ],
    furnitureEmoji: "🪑",
    decorEmojis: ["📝", "✏️"],
    characterPose: "sitting",
  },
  {
    id: "quizBoard",
    nameThai: "กระดานทดสอบ",
    nameEn: "Quiz Board",
    icon: "🧠",
    position: { x: 50, bottom: 15 },
    furniturePosition: { left: "42%", bottom: "52%", zIndex: 2, scale: 1.2 },
    route: "/path",
    speeches: [
      { th: "ทดสอบความรู้กัน!", en: "Test your knowledge!" },
      { th: "พร้อมท้าทายมั้ย? 🧠", en: "Ready for a challenge?" },
      { th: "เก่งขึ้นทุกวัน!", en: "Getting better daily!" },
    ],
    furnitureEmoji: "📋",
    decorEmojis: ["⭐", "✅"],
    characterPose: "idle",
  },
  {
    id: "restArea",
    nameThai: "มุมพักผ่อน",
    nameEn: "Rest Area",
    icon: "💬",
    position: { x: 68, bottom: 15 },
    furniturePosition: { left: "62%", bottom: "18%", zIndex: 4 },
    route: "/conversation",
    speeches: [
      { th: "พักผ่อนสักหน่อย~", en: "Take a little break~" },
      { th: "คุยกันมั้ย? 💬", en: "Let's chat? 💬" },
      { th: "ฝึกสนทนาดีกว่า!", en: "Let's practice talking!" },
    ],
    furnitureEmoji: "🛋️",
    decorEmojis: ["☕", "🧸"],
    characterPose: "sitting",
  },
  {
    id: "gameCorner",
    nameThai: "มุมเกม",
    nameEn: "Game Corner",
    icon: "🎮",
    position: { x: 86, bottom: 15 },
    furniturePosition: { left: "80%", bottom: "20%", zIndex: 5 },
    route: "/games",
    speeches: [
      { th: "เล่นเกมคำศัพท์มั้ย?", en: "Word games time?" },
      { th: "สนุกกันเถอะ! 🎮", en: "Let's have fun! 🎮" },
      { th: "เก่งขึ้นทุกวัน!", en: "Getting better daily!" },
    ],
    furnitureEmoji: "🎮",
    decorEmojis: ["🕹️", "🏆"],
    characterPose: "idle",
  },
];

export function getZoneById(id: ZoneId): ClassroomZone | undefined {
  return CLASSROOM_ZONES.find((z) => z.id === id);
}

export function getZoneByRoute(route: string): ClassroomZone | undefined {
  return CLASSROOM_ZONES.find((z) => z.route === route);
}

/** Random speech for idle state */
export const IDLE_SPEECHES: ZoneSpeech[] = [
  { th: "วันนี้เรียนอะไรดี?", en: "What to learn today?" },
  { th: "คลิกที่เฟอร์นิเจอร์สิ!", en: "Click furniture to start!" },
  { th: "มีภารกิจรออยู่นะ~", en: "Missions await~" },
  { th: "พร้อมเรียนรู้! ✨", en: "Ready to learn! ✨" },
];

/** Greeting on first load */
export const GREETING_SPEECHES: ZoneSpeech[] = [
  { th: "สวัสดี! ยินดีต้อนรับ~", en: "Hello! Welcome~" },
  { th: "กลับมาแล้ว! เรียนต่อเลย!", en: "You're back! Let's go!" },
  { th: "วันนี้จะเก่งขึ้นอีก! 💪", en: "You'll improve today! 💪" },
];
