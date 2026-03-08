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
      { english: "After", thai: "อาฟเทอะ" },
      { english: "work,", thai: "เวิร์ค" },
      { english: "Fon", thai: "ฟ้อน" },
      { english: "likes", thai: "ไลค์ส" },
      { english: "to", thai: "ทู" },
      { english: "spend", thai: "สเปนด์" },
      { english: "time", thai: "ไทม์" },
      { english: "on", thai: "ออน" },
      { english: "her", thai: "เฮอร์" },
      { english: "condo", thai: "คอนโด" },
      { english: "balcony,", thai: "แบลเคอะนิ" },
    ],
    [
      { english: "watering", thai: "วอเทอะริง" },
      { english: "her", thai: "เฮอร์" },
      { english: "small", thai: "สมอลล์" },
      { english: "garden.", thai: "การ์เดิน" },
    ],
    [
      { english: "The", thai: "เดอะ" },
      { english: "vegetables", thai: "เวจเทอะเบิลส์" },
      { english: "grow", thai: "โกรว์" },
      { english: "quickly", thai: "ควิคลี" },
      { english: "in", thai: "อิน" },
      { english: "the", thai: "เดอะ" },
      { english: "pots.", thai: "พอทส์" },
    ],
    [
      { english: "She", thai: "ชี" },
      { english: "can", thai: "แคน" },
      { english: "harvest", thai: "ฮาร์เวสท์" },
      { english: "fresh", thai: "เฟรช" },
      { english: "food", thai: "ฟูด" },
      { english: "for", thai: "ฟอร์" },
      { english: "cooking.", thai: "คุคกิง" },
    ],
    [
      { english: "She", thai: "ชี" },
      { english: "feels", thai: "ฟีลส์" },
      { english: "safe", thai: "เซฟ" },
      { english: "because", thai: "บิคอส" },
      { english: "the", thai: "เดอะ" },
      { english: "plants", thai: "แพลนท์ส" },
      { english: "are", thai: "อาร์" },
      { english: "free", thai: "ฟรี" },
      { english: "from", thai: "ฟรอม" },
      { english: "chemicals.", thai: "เคมิเคิลส์" },
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
