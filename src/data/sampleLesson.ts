import { Lesson, QuizQuestion } from "@/types/lesson";

// Sample lesson data for initial display before AI generates content
export const sampleLesson: Lesson = {
  id: "sample-1",
  title: "Balcony Garden in the City",
  titleThai: "ปลูกผักสวนครัวริมระเบียง",
  level: 1,
  vocabulary: [
    { word: "spend time on", phonetic: "สเปนด์-ไทม์-ออน", meaning: "ใช้เวลากับ", partOfSpeech: "phr." },
    { word: "balcony", phonetic: "แบลเคอะนิ", meaning: "ระเบียง", partOfSpeech: "n." },
    { word: "water", phonetic: "วอเทอะ", meaning: "รดน้ำ", partOfSpeech: "v." },
    { word: "grow", phonetic: "โกรว์", meaning: "ปลูก, เจริญเติบโต", partOfSpeech: "v." },
    { word: "pot", phonetic: "พอท", meaning: "กระถาง", partOfSpeech: "n." },
    { word: "chemical", phonetic: "เคมิเคิล", meaning: "สารเคมี", partOfSpeech: "n." },
    { word: "harvest", phonetic: "ฮาร์เวสท์", meaning: "เก็บเกี่ยว", partOfSpeech: "v." },
    { word: "fresh", phonetic: "เฟรช", meaning: "สด", partOfSpeech: "adj." },
  ],
  articleSentences: [
    [
      { english: "After", thai: "หลังจาก" },
      { english: "work,", thai: "งาน" },
      { english: "Fon", thai: "ฟ้อน" },
      { english: "likes", thai: "ชอบ" },
      { english: "to", thai: "ที่จะ" },
      { english: "spend", thai: "ใช้" },
      { english: "time", thai: "เวลา" },
      { english: "on", thai: "กับ" },
      { english: "her", thai: "ของเธอ" },
      { english: "condo", thai: "คอนโด" },
      { english: "balcony,", thai: "ระเบียง" },
    ],
    [
      { english: "watering", thai: "รดน้ำ" },
      { english: "her", thai: "ของเธอ" },
      { english: "small", thai: "เล็กๆ" },
      { english: "garden.", thai: "สวน" },
    ],
    [
      { english: "The", thai: "" },
      { english: "vegetables", thai: "ผัก" },
      { english: "grow", thai: "เจริญเติบโต" },
      { english: "quickly", thai: "อย่างรวดเร็ว" },
      { english: "in", thai: "ใน" },
      { english: "the", thai: "" },
      { english: "pots.", thai: "กระถาง" },
    ],
    [
      { english: "She", thai: "เธอ" },
      { english: "can", thai: "สามารถ" },
      { english: "harvest", thai: "เก็บเกี่ยว" },
      { english: "fresh", thai: "สดๆ" },
      { english: "food", thai: "อาหาร" },
      { english: "for", thai: "สำหรับ" },
      { english: "cooking.", thai: "ทำอาหาร" },
    ],
    [
      { english: "She", thai: "เธอ" },
      { english: "feels", thai: "รู้สึก" },
      { english: "safe", thai: "ปลอดภัย" },
      { english: "because", thai: "เพราะ" },
      { english: "the", thai: "" },
      { english: "plants", thai: "พืช" },
      { english: "are", thai: "เป็น" },
      { english: "free", thai: "ปลอด" },
      { english: "from", thai: "จาก" },
      { english: "chemicals.", thai: "สารเคมี" },
    ],
  ],
  articleTranslation:
    "หลังเลิกงาน ฟ้อนชอบใช้เวลาอยู่ที่ระเบียงคอนโดของเธอ รดน้ำสวนเล็กๆ ผักต่างๆ เจริญเติบโตได้เร็วในกระถาง เธอสามารถเก็บเกี่ยวผักสดๆ มาทำอาหารได้ เธอรู้สึกปลอดภัยเพราะผักเหล่านี้ปลอดจากสารเคมี",
  imagePrompt: "balcony garden",
};

export const sampleQuiz: QuizQuestion[] = [
  {
    question: "คำว่า 'balcony' แปลว่าอะไร?",
    options: ["ห้องนอน", "ระเบียง", "ห้องครัว", "สวน"],
    correctIndex: 1,
    type: "vocab",
  },
  {
    question: "คำว่า 'harvest' เป็น Part of Speech อะไร?",
    options: ["noun", "adjective", "verb", "adverb"],
    correctIndex: 2,
    type: "vocab",
  },
  {
    question: "ฟ้อนชอบทำอะไรหลังเลิกงาน?",
    options: [
      "ไปออกกำลังกาย",
      "ดูโทรทัศน์",
      "ดูแลสวนที่ระเบียง",
      "ไปซื้อของ",
    ],
    correctIndex: 2,
    type: "comprehension",
  },
  {
    question: "ทำไมฟ้อนถึงรู้สึกปลอดภัย?",
    options: [
      "เพราะคอนโดมีรปภ.",
      "เพราะผักปลอดสารเคมี",
      "เพราะอยู่ชั้นสูง",
      "เพราะมีแมวเฝ้าบ้าน",
    ],
    correctIndex: 1,
    type: "comprehension",
  },
];
