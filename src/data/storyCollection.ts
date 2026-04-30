import { VocabWord, InterlinearWord, QuizQuestion } from "@/types/lesson";

export type StoryTheme = "adventure" | "mystery" | "heart" | "funny" | "wisdom";
export type StoryRarity = "common" | "rare" | "epic" | "legendary";

export interface StoryChapter {
  id: string;
  title: string;
  titleThai: string;
  vocabulary: VocabWord[];
  sentences: InterlinearWord[][];
  translation: string;
  quiz: QuizQuestion[];
}

export interface Story {
  id: string;
  title: string;
  titleThai: string;
  tagline: string; // Thai short hook
  theme: StoryTheme;
  rarity: StoryRarity;
  level: 1 | 2 | 3 | 4 | 5;
  cover: {
    emoji: string;
    gradient: string; // tailwind classes for cover gradient
  };
  chapters: StoryChapter[];
}

export const themeMeta: Record<StoryTheme, { th: string; emoji: string; color: string; ring: string }> = {
  adventure: { th: "ผจญภัย", emoji: "🗺️", color: "from-amber-400 to-orange-500", ring: "ring-amber-300" },
  mystery: { th: "ลึกลับ", emoji: "🔮", color: "from-indigo-500 to-purple-600", ring: "ring-indigo-300" },
  heart: { th: "ซึ้งกินใจ", emoji: "💛", color: "from-pink-400 to-rose-500", ring: "ring-pink-300" },
  funny: { th: "ตลก", emoji: "🎭", color: "from-lime-400 to-emerald-500", ring: "ring-lime-300" },
  wisdom: { th: "สอนใจ", emoji: "🦉", color: "from-sky-400 to-cyan-500", ring: "ring-sky-300" },
};

export const rarityMeta: Record<StoryRarity, { th: string; color: string; bg: string; glow: string }> = {
  common: { th: "ธรรมดา", color: "text-slate-600", bg: "bg-slate-100 border-slate-300", glow: "" },
  rare: { th: "หายาก", color: "text-sky-600", bg: "bg-sky-100 border-sky-400", glow: "shadow-sky-300/40" },
  epic: { th: "เอพิค", color: "text-purple-600", bg: "bg-purple-100 border-purple-400", glow: "shadow-purple-400/50" },
  legendary: { th: "ตำนาน", color: "text-amber-600", bg: "bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-400", glow: "shadow-amber-400/60" },
};

// ============= STORIES =============

export const storyCollection: Story[] = [
  // ===== ADVENTURE =====
  {
    id: "story-lost-key",
    title: "The Lost Key",
    titleThai: "กุญแจที่หายไป",
    tagline: "เด็กชายค้นพบกุญแจปริศนาในสวนหลังบ้าน",
    theme: "adventure",
    rarity: "common",
    level: 1,
    cover: { emoji: "🗝️", gradient: "from-amber-300 via-orange-400 to-red-400" },
    chapters: [
      {
        id: "lost-key-1",
        title: "Chapter 1: The Garden",
        titleThai: "บทที่ 1: สวนหลังบ้าน",
        vocabulary: [
          { word: "garden", phonetic: "การ์-เด้น", meaning: "สวน", partOfSpeech: "n." },
          { word: "key", phonetic: "คีย์", meaning: "กุญแจ", partOfSpeech: "n." },
          { word: "shiny", phonetic: "ไช-นี่", meaning: "เป็นประกาย", partOfSpeech: "adj." },
          { word: "found", phonetic: "ฟาวด์", meaning: "พบ", partOfSpeech: "v." },
          { word: "old", phonetic: "โอลด์", meaning: "เก่า", partOfSpeech: "adj." },
        ],
        sentences: [
          [
            { english: "Tom", thai: "ทอม" },
            { english: "played", thai: "เพลย์ด" },
            { english: "in", thai: "อิน" },
            { english: "the", thai: "เดอะ" },
            { english: "garden.", thai: "การ์-เด้น" },
          ],
          [
            { english: "He", thai: "ฮี" },
            { english: "saw", thai: "ซอว์" },
            { english: "something", thai: "ซัม-ทิง" },
            { english: "shiny.", thai: "ไช-นี่" },
          ],
          [
            { english: "It", thai: "อิท" },
            { english: "was", thai: "วอส" },
            { english: "an", thai: "แอน" },
            { english: "old", thai: "โอลด์" },
            { english: "key.", thai: "คีย์" },
          ],
        ],
        translation: "ทอมเล่นอยู่ในสวน เขาเห็นบางอย่างเป็นประกาย มันคือกุญแจเก่าๆ",
        quiz: [
          { question: "Where did Tom play?", options: ["In the kitchen", "In the garden", "At school", "In the park"], correctIndex: 1, type: "comprehension" },
          { question: '"shiny" แปลว่าอะไร?', options: ["มืด", "เป็นประกาย", "สกปรก", "เปียก"], correctIndex: 1, type: "vocab" },
        ],
      },
      {
        id: "lost-key-2",
        title: "Chapter 2: The Box",
        titleThai: "บทที่ 2: กล่องลึกลับ",
        vocabulary: [
          { word: "box", phonetic: "บ็อกซ์", meaning: "กล่อง", partOfSpeech: "n." },
          { word: "open", phonetic: "โอ-เพ่น", meaning: "เปิด", partOfSpeech: "v." },
          { word: "letter", phonetic: "เลท-เทอร์", meaning: "จดหมาย", partOfSpeech: "n." },
          { word: "secret", phonetic: "ซี-เคร็ท", meaning: "ความลับ", partOfSpeech: "n." },
        ],
        sentences: [
          [
            { english: "Tom", thai: "ทอม" },
            { english: "found", thai: "ฟาวด์" },
            { english: "a", thai: "อะ" },
            { english: "small", thai: "สมอลล์" },
            { english: "box.", thai: "บ็อกซ์" },
          ],
          [
            { english: "The", thai: "เดอะ" },
            { english: "key", thai: "คีย์" },
            { english: "could", thai: "คุด" },
            { english: "open", thai: "โอ-เพ่น" },
            { english: "it.", thai: "อิท" },
          ],
          [
            { english: "Inside", thai: "อิน-ไซด์" },
            { english: "was", thai: "วอส" },
            { english: "a", thai: "อะ" },
            { english: "secret", thai: "ซี-เคร็ท" },
            { english: "letter.", thai: "เลท-เทอร์" },
          ],
        ],
        translation: "ทอมพบกล่องเล็กๆ กุญแจสามารถเปิดมันได้ ข้างในมีจดหมายลับอยู่",
        quiz: [
          { question: "What was inside the box?", options: ["A toy", "A letter", "A coin", "Nothing"], correctIndex: 1, type: "comprehension" },
          { question: '"secret" แปลว่าอะไร?', options: ["ความลับ", "เสียง", "ของขวัญ", "เพื่อน"], correctIndex: 0, type: "vocab" },
        ],
      },
    ],
  },
  {
    id: "story-sky-pirate",
    title: "The Sky Pirate",
    titleThai: "โจรสลัดท้องฟ้า",
    tagline: "การผจญภัยบนเรือเหาะเหนือเมฆ",
    theme: "adventure",
    rarity: "epic",
    level: 3,
    cover: { emoji: "🏴‍☠️", gradient: "from-cyan-400 via-blue-500 to-indigo-600" },
    chapters: [
      {
        id: "sky-pirate-1",
        title: "Chapter 1: Above the Clouds",
        titleThai: "บทที่ 1: เหนือก้อนเมฆ",
        vocabulary: [
          { word: "airship", phonetic: "แอร์-ชิป", meaning: "เรือเหาะ", partOfSpeech: "n." },
          { word: "cloud", phonetic: "คลาวด์", meaning: "เมฆ", partOfSpeech: "n." },
          { word: "captain", phonetic: "แคพ-เท่น", meaning: "กัปตัน", partOfSpeech: "n." },
          { word: "horizon", phonetic: "ฮอ-ไร-เซิ่น", meaning: "ขอบฟ้า", partOfSpeech: "n." },
          { word: "treasure", phonetic: "เทรช-เชอะ", meaning: "สมบัติ", partOfSpeech: "n." },
        ],
        sentences: [
          [
            { english: "Captain", thai: "แคพ-เท่น" },
            { english: "Mira", thai: "มี-ร่า" },
            { english: "sailed", thai: "เซลด์" },
            { english: "her", thai: "เฮอร์" },
            { english: "airship", thai: "แอร์-ชิป" },
            { english: "above", thai: "อะ-บัฟ" },
            { english: "the", thai: "เดอะ" },
            { english: "clouds.", thai: "คลาวด์" },
          ],
          [
            { english: "She", thai: "ชี" },
            { english: "searched", thai: "เสิร์ชด์" },
            { english: "the", thai: "เดอะ" },
            { english: "horizon", thai: "ฮอ-ไร-เซิ่น" },
            { english: "for", thai: "ฟอร์" },
            { english: "treasure.", thai: "เทรช-เชอะ" },
          ],
        ],
        translation: "กัปตันมีร่าล่องเรือเหาะของเธอเหนือก้อนเมฆ เธอมองหาขอบฟ้าเพื่อค้นหาสมบัติ",
        quiz: [
          { question: "What was Captain Mira looking for?", options: ["Friends", "Treasure", "A map", "Land"], correctIndex: 1, type: "comprehension" },
        ],
      },
    ],
  },

  // ===== MYSTERY =====
  {
    id: "story-midnight-letter",
    title: "The Midnight Letter",
    titleThai: "จดหมายเที่ยงคืน",
    tagline: "จดหมายโผล่มาในห้องที่ล็อคไว้",
    theme: "mystery",
    rarity: "rare",
    level: 2,
    cover: { emoji: "✉️", gradient: "from-indigo-500 via-purple-600 to-violet-700" },
    chapters: [
      {
        id: "midnight-1",
        title: "Chapter 1: The Locked Room",
        titleThai: "บทที่ 1: ห้องที่ล็อคไว้",
        vocabulary: [
          { word: "midnight", phonetic: "มิด-ไนท์", meaning: "เที่ยงคืน", partOfSpeech: "n." },
          { word: "locked", phonetic: "ล็อคท์", meaning: "ล็อค", partOfSpeech: "adj." },
          { word: "envelope", phonetic: "เอน-เวอะ-โลพ", meaning: "ซองจดหมาย", partOfSpeech: "n." },
          { word: "strange", phonetic: "สเตรนจ์", meaning: "แปลก", partOfSpeech: "adj." },
        ],
        sentences: [
          [
            { english: "At", thai: "แอท" },
            { english: "midnight,", thai: "มิด-ไนท์" },
            { english: "Anna", thai: "แอน-นา" },
            { english: "heard", thai: "เฮิร์ด" },
            { english: "a", thai: "อะ" },
            { english: "sound.", thai: "ซาวด์" },
          ],
          [
            { english: "An", thai: "แอน" },
            { english: "envelope", thai: "เอน-เวอะ-โลพ" },
            { english: "lay", thai: "เลย์" },
            { english: "on", thai: "ออน" },
            { english: "the", thai: "เดอะ" },
            { english: "floor.", thai: "ฟลอร์" },
          ],
          [
            { english: "But", thai: "บัท" },
            { english: "the", thai: "เดอะ" },
            { english: "door", thai: "ดอร์" },
            { english: "was", thai: "วอส" },
            { english: "locked.", thai: "ล็อคท์" },
          ],
        ],
        translation: "ตอนเที่ยงคืน แอนนาได้ยินเสียง ซองจดหมายวางอยู่บนพื้น แต่ประตูถูกล็อคไว้",
        quiz: [
          { question: "When did Anna hear the sound?", options: ["Morning", "Noon", "Midnight", "Evening"], correctIndex: 2, type: "comprehension" },
          { question: '"strange" แปลว่าอะไร?', options: ["ใกล้", "แปลก", "ดี", "ใหญ่"], correctIndex: 1, type: "vocab" },
        ],
      },
    ],
  },

  // ===== HEART =====
  {
    id: "story-grandmas-tea",
    title: "Grandma's Tea",
    titleThai: "ชาของยาย",
    tagline: "ความทรงจำอบอุ่นในถ้วยชา",
    theme: "heart",
    rarity: "rare",
    level: 1,
    cover: { emoji: "🍵", gradient: "from-rose-300 via-pink-400 to-fuchsia-500" },
    chapters: [
      {
        id: "tea-1",
        title: "Chapter 1: A Warm Cup",
        titleThai: "บทที่ 1: ถ้วยที่อบอุ่น",
        vocabulary: [
          { word: "tea", phonetic: "ที", meaning: "ชา", partOfSpeech: "n." },
          { word: "warm", phonetic: "วอร์ม", meaning: "อบอุ่น", partOfSpeech: "adj." },
          { word: "remember", phonetic: "รี-เมม-เบอร์", meaning: "จดจำ", partOfSpeech: "v." },
          { word: "smile", phonetic: "สมาย", meaning: "รอยยิ้ม", partOfSpeech: "n." },
        ],
        sentences: [
          [
            { english: "Lily", thai: "ลิ-ลี่" },
            { english: "drank", thai: "แดรงค์" },
            { english: "warm", thai: "วอร์ม" },
            { english: "tea.", thai: "ที" },
          ],
          [
            { english: "She", thai: "ชี" },
            { english: "remembered", thai: "รี-เมม-เบอร์ด" },
            { english: "her", thai: "เฮอร์" },
            { english: "grandma's", thai: "แกรนด์-มาส์" },
            { english: "smile.", thai: "สมาย" },
          ],
        ],
        translation: "ลิลี่ดื่มชาอุ่นๆ เธอนึกถึงรอยยิ้มของยาย",
        quiz: [
          { question: "What did Lily drink?", options: ["Coffee", "Milk", "Warm tea", "Water"], correctIndex: 2, type: "comprehension" },
        ],
      },
    ],
  },

  // ===== FUNNY =====
  {
    id: "story-cat-mayor",
    title: "The Cat Mayor",
    titleThai: "ท่านนายกแมว",
    tagline: "เมืองเล็กๆ ที่นายกเทศมนตรีคือแมวอ้วน",
    theme: "funny",
    rarity: "epic",
    level: 2,
    cover: { emoji: "🐱", gradient: "from-lime-300 via-emerald-400 to-teal-500" },
    chapters: [
      {
        id: "cat-mayor-1",
        title: "Chapter 1: Election Day",
        titleThai: "บทที่ 1: วันเลือกตั้ง",
        vocabulary: [
          { word: "mayor", phonetic: "เม-เยอร์", meaning: "นายกเทศมนตรี", partOfSpeech: "n." },
          { word: "vote", phonetic: "โหวต", meaning: "ลงคะแนน", partOfSpeech: "v." },
          { word: "town", phonetic: "ทาวน์", meaning: "เมือง", partOfSpeech: "n." },
          { word: "fluffy", phonetic: "ฟลัฟ-ฟี่", meaning: "ฟูนุ่ม", partOfSpeech: "adj." },
        ],
        sentences: [
          [
            { english: "The", thai: "เดอะ" },
            { english: "town", thai: "ทาวน์" },
            { english: "voted", thai: "โหวต-ทิด" },
            { english: "for", thai: "ฟอร์" },
            { english: "a", thai: "อะ" },
            { english: "fluffy", thai: "ฟลัฟ-ฟี่" },
            { english: "cat.", thai: "แคท" },
          ],
          [
            { english: "He", thai: "ฮี" },
            { english: "became", thai: "บี-เคม" },
            { english: "the", thai: "เดอะ" },
            { english: "new", thai: "นิว" },
            { english: "mayor!", thai: "เม-เยอร์" },
          ],
        ],
        translation: "ชาวเมืองโหวตให้แมวฟูนุ่มตัวหนึ่ง เขากลายเป็นนายกคนใหม่!",
        quiz: [
          { question: "Who became the mayor?", options: ["A dog", "A fluffy cat", "A bird", "A child"], correctIndex: 1, type: "comprehension" },
        ],
      },
    ],
  },

  // ===== WISDOM =====
  {
    id: "story-river-stone",
    title: "The River and the Stone",
    titleThai: "แม่น้ำกับก้อนหิน",
    tagline: "ความเพียรชนะความแข็งแกร่ง",
    theme: "wisdom",
    rarity: "legendary",
    level: 3,
    cover: { emoji: "🌊", gradient: "from-amber-300 via-yellow-400 to-orange-500" },
    chapters: [
      {
        id: "river-1",
        title: "Chapter 1: The Stubborn Stone",
        titleThai: "บทที่ 1: ก้อนหินดื้อรั้น",
        vocabulary: [
          { word: "river", phonetic: "ริ-เวอร์", meaning: "แม่น้ำ", partOfSpeech: "n." },
          { word: "stone", phonetic: "สโตน", meaning: "ก้อนหิน", partOfSpeech: "n." },
          { word: "patient", phonetic: "เพ-เชิ่นท์", meaning: "อดทน", partOfSpeech: "adj." },
          { word: "smooth", phonetic: "สมูธ", meaning: "เรียบ", partOfSpeech: "adj." },
        ],
        sentences: [
          [
            { english: "A", thai: "อะ" },
            { english: "river", thai: "ริ-เวอร์" },
            { english: "met", thai: "เม็ท" },
            { english: "a", thai: "อะ" },
            { english: "hard", thai: "ฮาร์ด" },
            { english: "stone.", thai: "สโตน" },
          ],
          [
            { english: "It", thai: "อิท" },
            { english: "flowed", thai: "โฟลด์" },
            { english: "every", thai: "เอฟ-รี่" },
            { english: "day,", thai: "เดย์" },
            { english: "patient", thai: "เพ-เชิ่นท์" },
            { english: "and", thai: "แอนด์" },
            { english: "kind.", thai: "ไคนด์" },
          ],
          [
            { english: "Years", thai: "เยียร์ส" },
            { english: "later,", thai: "เลท-เทอร์" },
            { english: "the", thai: "เดอะ" },
            { english: "stone", thai: "สโตน" },
            { english: "was", thai: "วอส" },
            { english: "smooth.", thai: "สมูธ" },
          ],
        ],
        translation: "แม่น้ำพบก้อนหินที่แข็ง มันไหลทุกวันด้วยความอดทนและอ่อนโยน หลายปีต่อมา ก้อนหินกลายเป็นเรียบ",
        quiz: [
          { question: "What did the river do every day?", options: ["Stopped", "Flowed patiently", "Disappeared", "Got angry"], correctIndex: 1, type: "comprehension" },
          { question: '"patient" แปลว่าอะไร?', options: ["โกรธ", "อดทน", "เร็ว", "เสียใจ"], correctIndex: 1, type: "vocab" },
        ],
      },
    ],
  },
];

export const totalChapters = (story: Story) => story.chapters.length;
