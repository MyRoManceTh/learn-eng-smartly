// Seed all lessons into Supabase
// Run: node scripts/seed-all-lessons.mjs

const SUPABASE_URL = 'https://wyzfsfywpyjdsnxumowi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5emZzZnl3cHlqZHNueHVtb3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4OTQsImV4cCI6MjA4ODU2NDg5NH0.Oo3hwK7dGoxsUqaoH-E8Nu6ll5hsiwYQ9hWt3VXuKFY';

async function upsertLessons(lessons) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lessons`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(lessons),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }
  return res.status;
}

// =============================================
// CORE PRE-A1 (Level 0) - Alphabet module
// =============================================
const alphabetLessons = [
  {
    module_id: 'core-a0-alphabet',
    lesson_order: 1,
    level: 0,
    topic: 'Letters A-G',
    title: 'Apple to Gorilla',
    title_thai: 'ตัวอักษร A-G',
    vocabulary: [
      { word: 'apple', phonetic: 'แอปเปิล', meaning: 'แอปเปิล', partOfSpeech: 'n.' },
      { word: 'ball', phonetic: 'บอล', meaning: 'ลูกบอล', partOfSpeech: 'n.' },
      { word: 'cat', phonetic: 'แคท', meaning: 'แมว', partOfSpeech: 'n.' },
      { word: 'dog', phonetic: 'ด็อก', meaning: 'หมา', partOfSpeech: 'n.' },
      { word: 'egg', phonetic: 'เอ็ก', meaning: 'ไข่', partOfSpeech: 'n.' },
      { word: 'fish', phonetic: 'ฟิช', meaning: 'ปลา', partOfSpeech: 'n.' },
      { word: 'gorilla', phonetic: 'กอริลลา', meaning: 'กอริลลา', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [{ english: 'A', thai: 'เอ' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Apple.', thai: 'แอปเปิล' }],
      [{ english: 'B', thai: 'บี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Ball.', thai: 'บอล' }],
      [{ english: 'C', thai: 'ซี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Cat.', thai: 'แคท' }],
      [{ english: 'D', thai: 'ดี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Dog.', thai: 'ด็อก' }],
      [{ english: 'E', thai: 'อี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Egg.', thai: 'เอ็ก' }],
      [{ english: 'F', thai: 'เอฟ' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Fish.', thai: 'ฟิช' }],
      [{ english: 'G', thai: 'จี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Gorilla.', thai: 'กอริลลา' }],
    ],
    article_translation: 'A คือ Apple (แอปเปิล) B คือ Ball (ลูกบอล) C คือ Cat (แมว) D คือ Dog (หมา) E คือ Egg (ไข่) F คือ Fish (ปลา) G คือ Gorilla (กอริลลา)',
    image_prompt: 'Colorful alphabet cards A to G with cute cartoon animals and objects, bright child-friendly style',
    quiz: [
      { question: 'ตัวอักษร A อ่านว่าอะไร?', options: ['บี', 'ซี', 'เอ', 'ดี'], correctIndex: 2, type: 'vocab' },
      { question: 'Dog แปลว่าอะไร?', options: ['แมว', 'ปลา', 'หมา', 'ไข่'], correctIndex: 2, type: 'vocab' },
      { question: 'คำว่า Fish เริ่มต้นด้วยตัวอักษรอะไร?', options: ['D', 'E', 'F', 'G'], correctIndex: 2, type: 'comprehension' },
      { question: 'ตัวอักษร E อ่านว่าอะไร?', options: ['ดี', 'อี', 'เอฟ', 'บี'], correctIndex: 1, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-alphabet',
    lesson_order: 2,
    level: 0,
    topic: 'Letters H-N',
    title: 'Hat to Night',
    title_thai: 'ตัวอักษร H-N',
    vocabulary: [
      { word: 'hat', phonetic: 'แฮท', meaning: 'หมวก', partOfSpeech: 'n.' },
      { word: 'ice', phonetic: 'ไอซ์', meaning: 'น้ำแข็ง', partOfSpeech: 'n.' },
      { word: 'juice', phonetic: 'จูส', meaning: 'น้ำผลไม้', partOfSpeech: 'n.' },
      { word: 'king', phonetic: 'คิง', meaning: 'กษัตริย์', partOfSpeech: 'n.' },
      { word: 'lion', phonetic: 'ไลอัน', meaning: 'สิงโต', partOfSpeech: 'n.' },
      { word: 'moon', phonetic: 'มูน', meaning: 'พระจันทร์', partOfSpeech: 'n.' },
      { word: 'night', phonetic: 'ไนท์', meaning: 'กลางคืน', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [{ english: 'H', thai: 'เอช' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Hat.', thai: 'แฮท' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Ice.', thai: 'ไอซ์' }],
      [{ english: 'J', thai: 'เจ' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Juice.', thai: 'จูส' }],
      [{ english: 'K', thai: 'เค' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'King.', thai: 'คิง' }],
      [{ english: 'L', thai: 'เอล' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Lion.', thai: 'ไลอัน' }],
      [{ english: 'M', thai: 'เอม' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Moon.', thai: 'มูน' }],
      [{ english: 'N', thai: 'เอน' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Night.', thai: 'ไนท์' }],
    ],
    article_translation: 'H คือ Hat (หมวก) I คือ Ice (น้ำแข็ง) J คือ Juice (น้ำผลไม้) K คือ King (กษัตริย์) L คือ Lion (สิงโต) M คือ Moon (พระจันทร์) N คือ Night (กลางคืน)',
    image_prompt: 'Colorful alphabet cards H to N with cute cartoon objects, bright child-friendly style',
    quiz: [
      { question: 'Hat แปลว่าอะไร?', options: ['รองเท้า', 'หมวก', 'เสื้อ', 'กระเป๋า'], correctIndex: 1, type: 'vocab' },
      { question: 'ตัวอักษร L อ่านว่าอะไร?', options: ['เค', 'เอล', 'เอม', 'เอน'], correctIndex: 1, type: 'vocab' },
      { question: 'Moon แปลว่าอะไร?', options: ['ดวงอาทิตย์', 'ดาว', 'พระจันทร์', 'เมฆ'], correctIndex: 2, type: 'comprehension' },
      { question: 'คำว่า King เริ่มต้นด้วยตัวอักษรอะไร?', options: ['H', 'I', 'J', 'K'], correctIndex: 3, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-alphabet',
    lesson_order: 3,
    level: 0,
    topic: 'Letters O-U',
    title: 'Orange to Umbrella',
    title_thai: 'ตัวอักษร O-U',
    vocabulary: [
      { word: 'orange', phonetic: 'ออเรนจ์', meaning: 'ส้ม', partOfSpeech: 'n.' },
      { word: 'pink', phonetic: 'พิงค์', meaning: 'สีชมพู', partOfSpeech: 'n.' },
      { word: 'queen', phonetic: 'ควีน', meaning: 'ราชินี', partOfSpeech: 'n.' },
      { word: 'rain', phonetic: 'เรน', meaning: 'ฝน', partOfSpeech: 'n.' },
      { word: 'sun', phonetic: 'ซัน', meaning: 'ดวงอาทิตย์', partOfSpeech: 'n.' },
      { word: 'tree', phonetic: 'ทรี', meaning: 'ต้นไม้', partOfSpeech: 'n.' },
      { word: 'umbrella', phonetic: 'อัมเบรลลา', meaning: 'ร่ม', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [{ english: 'O', thai: 'โอ' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Orange.', thai: 'ออเรนจ์' }],
      [{ english: 'P', thai: 'พี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Pink.', thai: 'พิงค์' }],
      [{ english: 'Q', thai: 'คิว' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Queen.', thai: 'ควีน' }],
      [{ english: 'R', thai: 'อาร์' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Rain.', thai: 'เรน' }],
      [{ english: 'S', thai: 'เอส' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Sun.', thai: 'ซัน' }],
      [{ english: 'T', thai: 'ที' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Tree.', thai: 'ทรี' }],
      [{ english: 'U', thai: 'ยู' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Umbrella.', thai: 'อัมเบรลลา' }],
    ],
    article_translation: 'O คือ Orange (ส้ม) P คือ Pink (ชมพู) Q คือ Queen (ราชินี) R คือ Rain (ฝน) S คือ Sun (ดวงอาทิตย์) T คือ Tree (ต้นไม้) U คือ Umbrella (ร่ม)',
    image_prompt: 'Colorful alphabet cards O to U with cute cartoon objects, bright child-friendly style',
    quiz: [
      { question: 'Orange แปลว่าอะไร?', options: ['แอปเปิล', 'กล้วย', 'ส้ม', 'องุ่น'], correctIndex: 2, type: 'vocab' },
      { question: 'Queen แปลว่าอะไร?', options: ['กษัตริย์', 'ราชินี', 'เจ้าชาย', 'เจ้าหญิง'], correctIndex: 1, type: 'vocab' },
      { question: 'ตัวอักษร S อ่านว่าอะไร?', options: ['อาร์', 'เอส', 'ที', 'คิว'], correctIndex: 1, type: 'comprehension' },
      { question: 'Umbrella แปลว่าอะไร?', options: ['หมวก', 'รองเท้า', 'ร่ม', 'กระเป๋า'], correctIndex: 2, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-alphabet',
    lesson_order: 4,
    level: 0,
    topic: 'Letters V-Z',
    title: 'Van to Zebra',
    title_thai: 'ตัวอักษร V-Z',
    vocabulary: [
      { word: 'van', phonetic: 'แวน', meaning: 'รถตู้', partOfSpeech: 'n.' },
      { word: 'water', phonetic: 'วอเตอร์', meaning: 'น้ำ', partOfSpeech: 'n.' },
      { word: 'x-ray', phonetic: 'เอกซ์เรย์', meaning: 'เอกซเรย์', partOfSpeech: 'n.' },
      { word: 'yellow', phonetic: 'เยลโลว์', meaning: 'สีเหลือง', partOfSpeech: 'adj.' },
      { word: 'zebra', phonetic: 'ซีบรา', meaning: 'ม้าลาย', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [{ english: 'V', thai: 'วี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Van.', thai: 'แวน' }],
      [{ english: 'W', thai: 'ดับเบิลยู' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Water.', thai: 'วอเตอร์' }],
      [{ english: 'X', thai: 'เอกซ์' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'X-ray.', thai: 'เอกซ์เรย์' }],
      [{ english: 'Y', thai: 'วาย' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Yellow.', thai: 'เยลโลว์' }],
      [{ english: 'Z', thai: 'ซี' }, { english: 'is', thai: 'อิส' }, { english: 'for', thai: 'ฟอร์' }, { english: 'Zebra.', thai: 'ซีบรา' }],
      [{ english: 'Now', thai: 'นาว' }, { english: 'I', thai: 'ไอ' }, { english: 'know', thai: 'โน' }, { english: 'my', thai: 'มาย' }, { english: 'ABC!', thai: 'เอบีซี!' }],
    ],
    article_translation: 'V คือ Van (รถตู้) W คือ Water (น้ำ) X คือ X-ray (เอกซเรย์) Y คือ Yellow (สีเหลือง) Z คือ Zebra (ม้าลาย) ตอนนี้ฉันรู้จัก ABC แล้ว!',
    image_prompt: 'Colorful alphabet cards V to Z with cute cartoon objects including a zebra, bright child-friendly style',
    quiz: [
      { question: 'Zebra แปลว่าอะไร?', options: ['สิงโต', 'ม้าลาย', 'ยีราฟ', 'ช้าง'], correctIndex: 1, type: 'vocab' },
      { question: 'ตัวอักษร W อ่านว่าอะไร?', options: ['วี', 'ดับเบิลยู', 'เอกซ์', 'วาย'], correctIndex: 1, type: 'vocab' },
      { question: 'Yellow แปลว่าสีอะไร?', options: ['สีแดง', 'สีน้ำเงิน', 'สีเขียว', 'สีเหลือง'], correctIndex: 3, type: 'comprehension' },
      { question: 'Van แปลว่าอะไร?', options: ['รถยนต์', 'รถตู้', 'รถบัส', 'รถไฟ'], correctIndex: 1, type: 'comprehension' },
    ],
  },
];

// =============================================
// CORE PRE-A1 (Level 0) - Numbers module
// =============================================
const numbersLessons = [
  {
    module_id: 'core-a0-numbers',
    lesson_order: 1,
    level: 0,
    topic: 'Numbers 1-5',
    title: 'One to Five',
    title_thai: 'หนึ่งถึงห้า',
    vocabulary: [
      { word: 'one', phonetic: 'วัน', meaning: 'หนึ่ง', partOfSpeech: 'number' },
      { word: 'two', phonetic: 'ทู', meaning: 'สอง', partOfSpeech: 'number' },
      { word: 'three', phonetic: 'ทรี', meaning: 'สาม', partOfSpeech: 'number' },
      { word: 'four', phonetic: 'ฟอร์', meaning: 'สี่', partOfSpeech: 'number' },
      { word: 'five', phonetic: 'ไฟว์', meaning: 'ห้า', partOfSpeech: 'number' },
    ],
    article_sentences: [
      [{ english: 'I', thai: 'ไอ' }, { english: 'have', thai: 'แฮฟ' }, { english: 'one', thai: 'วัน' }, { english: 'cat.', thai: 'แคท' }],
      [{ english: 'She', thai: 'ชี' }, { english: 'has', thai: 'แฮส' }, { english: 'two', thai: 'ทู' }, { english: 'dogs.', thai: 'ด็อกส์' }],
      [{ english: 'We', thai: 'วี' }, { english: 'see', thai: 'ซี' }, { english: 'three', thai: 'ทรี' }, { english: 'birds.', thai: 'เบิร์ดส์' }],
      [{ english: 'He', thai: 'ฮี' }, { english: 'eats', thai: 'อีทส์' }, { english: 'four', thai: 'ฟอร์' }, { english: 'apples.', thai: 'แอปเปิลส์' }],
      [{ english: 'They', thai: 'เดย์' }, { english: 'have', thai: 'แฮฟ' }, { english: 'five', thai: 'ไฟว์' }, { english: 'fish.', thai: 'ฟิช' }],
    ],
    article_translation: 'ฉันมีแมวหนึ่งตัว เธอมีหมาสองตัว เราเห็นนกสามตัว เขากินแอปเปิลสี่ลูก พวกเขามีปลาห้าตัว',
    image_prompt: 'Cute cartoon numbers 1-5 with matching objects, colorful child-friendly style',
    quiz: [
      { question: '"Two" แปลว่าอะไร?', options: ['หนึ่ง', 'สอง', 'สาม', 'สี่'], correctIndex: 1, type: 'vocab' },
      { question: '"Five" แปลว่าอะไร?', options: ['สาม', 'สี่', 'ห้า', 'หก'], correctIndex: 2, type: 'vocab' },
      { question: 'ฉันมีแมวกี่ตัว?', options: ['one', 'two', 'three', 'four'], correctIndex: 0, type: 'comprehension' },
      { question: 'เธอมีหมากี่ตัว?', options: ['one', 'two', 'three', 'five'], correctIndex: 1, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-numbers',
    lesson_order: 2,
    level: 0,
    topic: 'Numbers 6-10',
    title: 'Six to Ten',
    title_thai: 'หกถึงสิบ',
    vocabulary: [
      { word: 'six', phonetic: 'ซิกซ์', meaning: 'หก', partOfSpeech: 'number' },
      { word: 'seven', phonetic: 'เซเวน', meaning: 'เจ็ด', partOfSpeech: 'number' },
      { word: 'eight', phonetic: 'เอท', meaning: 'แปด', partOfSpeech: 'number' },
      { word: 'nine', phonetic: 'ไนน์', meaning: 'เก้า', partOfSpeech: 'number' },
      { word: 'ten', phonetic: 'เทน', meaning: 'สิบ', partOfSpeech: 'number' },
    ],
    article_sentences: [
      [{ english: 'Six', thai: 'ซิกซ์' }, { english: 'plus', thai: 'พลัส' }, { english: 'four', thai: 'ฟอร์' }, { english: 'is', thai: 'อิส' }, { english: 'ten.', thai: 'เทน' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'see', thai: 'ซี' }, { english: 'seven', thai: 'เซเวน' }, { english: 'stars.', thai: 'สตาร์ส' }],
      [{ english: 'She', thai: 'ชี' }, { english: 'has', thai: 'แฮส' }, { english: 'eight', thai: 'เอท' }, { english: 'books.', thai: 'บุ๊คส์' }],
      [{ english: 'He', thai: 'ฮี' }, { english: 'is', thai: 'อิส' }, { english: 'nine', thai: 'ไนน์' }, { english: 'years old.', thai: 'เยียร์ส โอลด์' }],
      [{ english: 'We', thai: 'วี' }, { english: 'count', thai: 'เคานท์' }, { english: 'to', thai: 'ทู' }, { english: 'ten!', thai: 'เทน!' }],
    ],
    article_translation: 'หกบวกสี่เท่ากับสิบ ฉันเห็นดาวเจ็ดดวง เธอมีหนังสือแปดเล่ม เขาอายุเก้าขวบ เรานับถึงสิบ!',
    image_prompt: 'Cute cartoon numbers 6-10 with stars and objects, colorful child-friendly style',
    quiz: [
      { question: '"Seven" แปลว่าอะไร?', options: ['หก', 'เจ็ด', 'แปด', 'เก้า'], correctIndex: 1, type: 'vocab' },
      { question: '"Ten" แปลว่าอะไร?', options: ['แปด', 'เก้า', 'สิบ', 'สิบเอ็ด'], correctIndex: 2, type: 'vocab' },
      { question: 'หกบวกสี่เท่ากับเท่าไหร่?', options: ['eight', 'nine', 'ten', 'eleven'], correctIndex: 2, type: 'comprehension' },
      { question: 'เธอมีหนังสือกี่เล่ม?', options: ['six', 'seven', 'eight', 'nine'], correctIndex: 2, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-numbers',
    lesson_order: 3,
    level: 0,
    topic: 'Numbers 11-20',
    title: 'Eleven to Twenty',
    title_thai: 'สิบเอ็ดถึงยี่สิบ',
    vocabulary: [
      { word: 'eleven', phonetic: 'อีเลเวน', meaning: 'สิบเอ็ด', partOfSpeech: 'number' },
      { word: 'twelve', phonetic: 'ทเวลฟ์', meaning: 'สิบสอง', partOfSpeech: 'number' },
      { word: 'fifteen', phonetic: 'ฟิฟทีน', meaning: 'สิบห้า', partOfSpeech: 'number' },
      { word: 'twenty', phonetic: 'ทเวนตี', meaning: 'ยี่สิบ', partOfSpeech: 'number' },
      { word: 'how many', phonetic: 'ฮาว เมนี', meaning: 'กี่ / เท่าไหร่', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [{ english: 'There', thai: 'แดร์' }, { english: 'are', thai: 'อาร์' }, { english: 'eleven', thai: 'อีเลเวน' }, { english: 'players.', thai: 'เพลเยอร์ส' }],
      [{ english: '"How', thai: '"ฮาว' }, { english: 'many', thai: 'เมนี' }, { english: 'months?', thai: 'มันธ์ส?' }, { english: '"Twelve!"', thai: '"ทเวลฟ์!"' }],
      [{ english: 'She', thai: 'ชี' }, { english: 'is', thai: 'อิส' }, { english: 'fifteen', thai: 'ฟิฟทีน' }, { english: 'years old.', thai: 'เยียร์ส โอลด์' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'have', thai: 'แฮฟ' }, { english: 'twenty', thai: 'ทเวนตี' }, { english: 'coins.', thai: 'คอยน์ส' }],
    ],
    article_translation: 'มีผู้เล่นสิบเอ็ดคน "มีกี่เดือน?" "สิบสอง!" เธออายุสิบห้าปี ฉันมีเหรียญยี่สิบเหรียญ',
    image_prompt: 'Cartoon kids counting objects from 11 to 20, colorful classroom setting',
    quiz: [
      { question: '"Twelve" แปลว่าอะไร?', options: ['สิบเอ็ด', 'สิบสอง', 'สิบสาม', 'สิบสี่'], correctIndex: 1, type: 'vocab' },
      { question: '"Twenty" แปลว่าอะไร?', options: ['สิบห้า', 'สิบแปด', 'ยี่สิบ', 'สามสิบ'], correctIndex: 2, type: 'vocab' },
      { question: 'มีผู้เล่นกี่คน?', options: ['ten', 'eleven', 'twelve', 'fifteen'], correctIndex: 1, type: 'comprehension' },
      { question: 'ฉันมีเหรียญกี่เหรียญ?', options: ['fifteen', 'eighteen', 'twenty', 'twelve'], correctIndex: 2, type: 'comprehension' },
    ],
  },
];

// =============================================
// CORE PRE-A1 (Level 0) - Colors module
// =============================================
const colorsLessons = [
  {
    module_id: 'core-a0-colors',
    lesson_order: 1,
    level: 0,
    topic: 'Basic Colors',
    title: 'Red, Blue, Yellow',
    title_thai: 'แดง น้ำเงิน เหลือง',
    vocabulary: [
      { word: 'red', phonetic: 'เรด', meaning: 'สีแดง', partOfSpeech: 'adj.' },
      { word: 'blue', phonetic: 'บลู', meaning: 'สีน้ำเงิน', partOfSpeech: 'adj.' },
      { word: 'yellow', phonetic: 'เยลโลว์', meaning: 'สีเหลือง', partOfSpeech: 'adj.' },
      { word: 'color', phonetic: 'คัลเลอร์', meaning: 'สี', partOfSpeech: 'n.' },
      { word: 'what color', phonetic: 'ว็อท คัลเลอร์', meaning: 'สีอะไร', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [{ english: 'The', thai: 'เดอะ' }, { english: 'apple', thai: 'แอปเปิล' }, { english: 'is', thai: 'อิส' }, { english: 'red.', thai: 'เรด' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'sky', thai: 'สกาย' }, { english: 'is', thai: 'อิส' }, { english: 'blue.', thai: 'บลู' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'sun', thai: 'ซัน' }, { english: 'is', thai: 'อิส' }, { english: 'yellow.', thai: 'เยลโลว์' }],
      [{ english: '"What', thai: '"ว็อท' }, { english: 'color', thai: 'คัลเลอร์' }, { english: 'is', thai: 'อิส' }, { english: 'this?"', thai: 'ดิส?"' }],
      [{ english: '"It', thai: '"อิท' }, { english: 'is', thai: 'อิส' }, { english: 'red!"', thai: 'เรด!"' }],
    ],
    article_translation: 'แอปเปิลสีแดง ท้องฟ้าสีน้ำเงิน ดวงอาทิตย์สีเหลือง "นี่สีอะไร?" "มันสีแดง!"',
    image_prompt: 'Colorful cartoon showing red apple, blue sky, yellow sun with color labels, child-friendly',
    quiz: [
      { question: '"Red" แปลว่าสีอะไร?', options: ['สีน้ำเงิน', 'สีเหลือง', 'สีแดง', 'สีเขียว'], correctIndex: 2, type: 'vocab' },
      { question: '"Blue" แปลว่าสีอะไร?', options: ['สีแดง', 'สีน้ำเงิน', 'สีเหลือง', 'สีขาว'], correctIndex: 1, type: 'vocab' },
      { question: 'ท้องฟ้าสีอะไร?', options: ['red', 'yellow', 'blue', 'green'], correctIndex: 2, type: 'comprehension' },
      { question: 'แอปเปิลสีอะไร?', options: ['blue', 'red', 'yellow', 'white'], correctIndex: 1, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-colors',
    lesson_order: 2,
    level: 0,
    topic: 'More Colors',
    title: 'Green, Orange, Purple',
    title_thai: 'เขียว ส้ม ม่วง',
    vocabulary: [
      { word: 'green', phonetic: 'กรีน', meaning: 'สีเขียว', partOfSpeech: 'adj.' },
      { word: 'orange', phonetic: 'ออเรนจ์', meaning: 'สีส้ม', partOfSpeech: 'adj.' },
      { word: 'purple', phonetic: 'เพอร์เพิล', meaning: 'สีม่วง', partOfSpeech: 'adj.' },
      { word: 'pink', phonetic: 'พิงค์', meaning: 'สีชมพู', partOfSpeech: 'adj.' },
      { word: 'white', phonetic: 'ไวท์', meaning: 'สีขาว', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [{ english: 'The', thai: 'เดอะ' }, { english: 'tree', thai: 'ทรี' }, { english: 'is', thai: 'อิส' }, { english: 'green.', thai: 'กรีน' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'orange', thai: 'ออเรนจ์' }, { english: 'is', thai: 'อิส' }, { english: 'orange.', thai: 'ออเรนจ์' }],
      [{ english: 'Her', thai: 'เฮอร์' }, { english: 'bag', thai: 'แบก' }, { english: 'is', thai: 'อิส' }, { english: 'purple.', thai: 'เพอร์เพิล' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'flower', thai: 'ฟลาวเวอร์' }, { english: 'is', thai: 'อิส' }, { english: 'pink.', thai: 'พิงค์' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'cloud', thai: 'คลาวด์' }, { english: 'is', thai: 'อิส' }, { english: 'white.', thai: 'ไวท์' }],
    ],
    article_translation: 'ต้นไม้สีเขียว ส้มสีส้ม กระเป๋าของเธอสีม่วง ดอกไม้สีชมพู เมฆสีขาว',
    image_prompt: 'Colorful cartoon showing green tree, orange fruit, purple bag, pink flower, white cloud, child-friendly',
    quiz: [
      { question: '"Green" แปลว่าสีอะไร?', options: ['สีส้ม', 'สีม่วง', 'สีเขียว', 'สีชมพู'], correctIndex: 2, type: 'vocab' },
      { question: '"Purple" แปลว่าสีอะไร?', options: ['สีเขียว', 'สีส้ม', 'สีชมพู', 'สีม่วง'], correctIndex: 3, type: 'vocab' },
      { question: 'ต้นไม้สีอะไร?', options: ['orange', 'green', 'purple', 'pink'], correctIndex: 1, type: 'comprehension' },
      { question: 'เมฆสีอะไร?', options: ['pink', 'purple', 'white', 'orange'], correctIndex: 2, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-colors',
    lesson_order: 3,
    level: 0,
    topic: 'Colors in Daily Life',
    title: 'My Colorful World',
    title_thai: 'โลกสีสันของฉัน',
    vocabulary: [
      { word: 'black', phonetic: 'แบลค', meaning: 'สีดำ', partOfSpeech: 'adj.' },
      { word: 'brown', phonetic: 'บราวน์', meaning: 'สีน้ำตาล', partOfSpeech: 'adj.' },
      { word: 'gray', phonetic: 'เกรย์', meaning: 'สีเทา', partOfSpeech: 'adj.' },
      { word: 'favorite', phonetic: 'เฟเวอริท', meaning: 'ชื่นชอบที่สุด', partOfSpeech: 'adj.' },
      { word: 'my favorite color', phonetic: 'มาย เฟเวอริท คัลเลอร์', meaning: 'สีที่ฉันชอบที่สุด', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [{ english: 'My', thai: 'มาย' }, { english: 'cat', thai: 'แคท' }, { english: 'is', thai: 'อิส' }, { english: 'black.', thai: 'แบลค' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'dog', thai: 'ด็อก' }, { english: 'is', thai: 'อิส' }, { english: 'brown.', thai: 'บราวน์' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'elephant', thai: 'เอเลเฟนท์' }, { english: 'is', thai: 'อิส' }, { english: 'gray.', thai: 'เกรย์' }],
      [{ english: '"What', thai: '"ว็อท' }, { english: 'is', thai: 'อิส' }, { english: 'your', thai: 'ยัวร์' }, { english: 'favorite', thai: 'เฟเวอริท' }, { english: 'color?"', thai: 'คัลเลอร์?"' }],
      [{ english: '"My', thai: '"มาย' }, { english: 'favorite', thai: 'เฟเวอริท' }, { english: 'color', thai: 'คัลเลอร์' }, { english: 'is', thai: 'อิส' }, { english: 'blue!"', thai: 'บลู!"' }],
    ],
    article_translation: 'แมวของฉันสีดำ หมาสีน้ำตาล ช้างสีเทา "สีที่คุณชอบที่สุดคืออะไร?" "สีที่ฉันชอบที่สุดคือสีน้ำเงิน!"',
    image_prompt: 'Cartoon animals in different colors - black cat, brown dog, gray elephant, colorful scene',
    quiz: [
      { question: '"Black" แปลว่าสีอะไร?', options: ['สีขาว', 'สีเทา', 'สีดำ', 'สีน้ำตาล'], correctIndex: 2, type: 'vocab' },
      { question: '"Brown" แปลว่าสีอะไร?', options: ['สีดำ', 'สีน้ำตาล', 'สีเทา', 'สีส้ม'], correctIndex: 1, type: 'vocab' },
      { question: 'แมวของฉันสีอะไร?', options: ['brown', 'gray', 'black', 'white'], correctIndex: 2, type: 'comprehension' },
      { question: 'ช้างสีอะไร?', options: ['black', 'brown', 'gray', 'white'], correctIndex: 2, type: 'comprehension' },
    ],
  },
];

// =============================================
// CORE PRE-A1 (Level 0) - First Words module
// =============================================
const firstWordsLessons = [
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 1,
    level: 0,
    topic: 'Greetings',
    title: 'Hello and Thank You',
    title_thai: 'สวัสดีและขอบคุณ',
    vocabulary: [
      { word: 'hello', phonetic: 'เฮลโล', meaning: 'สวัสดี', partOfSpeech: 'interj.' },
      { word: 'thank you', phonetic: 'แธงค์ยู', meaning: 'ขอบคุณ', partOfSpeech: 'phr.' },
      { word: 'please', phonetic: 'พลีส', meaning: 'กรุณา / ได้โปรด', partOfSpeech: 'adv.' },
      { word: 'sorry', phonetic: 'ซอร์รี', meaning: 'ขอโทษ', partOfSpeech: 'interj.' },
      { word: 'yes', phonetic: 'เยส', meaning: 'ใช่ / ได้', partOfSpeech: 'adv.' },
      { word: 'no', phonetic: 'โน', meaning: 'ไม่ใช่ / ไม่', partOfSpeech: 'adv.' },
    ],
    article_sentences: [
      [{ english: '"Hello!"', thai: '"เฮลโล!"' }, { english: 'says', thai: 'เซส์' }, { english: 'Nong.', thai: 'น้อง' }],
      [{ english: '"Thank', thai: '"แธงค์' }, { english: 'you!"', thai: 'ยู!"' }, { english: 'says', thai: 'เซส์' }, { english: 'Phi.', thai: 'พี่' }],
      [{ english: '"Please', thai: '"พลีส' }, { english: 'help', thai: 'เฮลป์' }, { english: 'me."', thai: 'มี"' }],
      [{ english: '"Sorry!"', thai: '"ซอร์รี!"' }, { english: 'says', thai: 'เซส์' }, { english: 'Nong.', thai: 'น้อง' }],
      [{ english: '"Yes,', thai: '"เยส,' }, { english: 'no', thai: 'โน' }, { english: 'problem!"', thai: 'พรอบเลม!"' }],
    ],
    article_translation: '"สวัสดี!" น้องพูด "ขอบคุณ!" พี่พูด "กรุณาช่วยฉันด้วย" "ขอโทษ!" น้องพูด "ได้เลย ไม่มีปัญหา!"',
    image_prompt: 'Two Thai children greeting each other politely, cartoon style, bright and friendly',
    quiz: [
      { question: '"Thank you" แปลว่าอะไร?', options: ['สวัสดี', 'ขอโทษ', 'ขอบคุณ', 'กรุณา'], correctIndex: 2, type: 'vocab' },
      { question: '"Sorry" แปลว่าอะไร?', options: ['ขอบคุณ', 'ขอโทษ', 'สวัสดี', 'ได้โปรด'], correctIndex: 1, type: 'vocab' },
      { question: 'น้องพูดว่าอะไรก่อน?', options: ['Thank you', 'Sorry', 'Hello', 'Please'], correctIndex: 2, type: 'comprehension' },
      { question: '"Yes" แปลว่าอะไร?', options: ['ไม่', 'ใช่', 'บางที', 'ไม่รู้'], correctIndex: 1, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 2,
    level: 0,
    topic: 'Body Parts',
    title: 'Head, Eyes, Hands',
    title_thai: 'หัว ตา มือ',
    vocabulary: [
      { word: 'head', phonetic: 'เฮด', meaning: 'หัว', partOfSpeech: 'n.' },
      { word: 'eyes', phonetic: 'ไอส์', meaning: 'ตา', partOfSpeech: 'n.' },
      { word: 'nose', phonetic: 'โนส', meaning: 'จมูก', partOfSpeech: 'n.' },
      { word: 'mouth', phonetic: 'เมาธ์', meaning: 'ปาก', partOfSpeech: 'n.' },
      { word: 'hands', phonetic: 'แฮนดส์', meaning: 'มือ', partOfSpeech: 'n.' },
      { word: 'feet', phonetic: 'ฟีท', meaning: 'เท้า', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [{ english: 'I', thai: 'ไอ' }, { english: 'have', thai: 'แฮฟ' }, { english: 'two', thai: 'ทู' }, { english: 'eyes.', thai: 'ไอส์' }],
      [{ english: 'My', thai: 'มาย' }, { english: 'nose', thai: 'โนส' }, { english: 'is', thai: 'อิส' }, { english: 'small.', thai: 'สมอลล์' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'eat', thai: 'อีท' }, { english: 'with', thai: 'วิธ' }, { english: 'my', thai: 'มาย' }, { english: 'mouth.', thai: 'เมาธ์' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'clap', thai: 'แคลป' }, { english: 'my', thai: 'มาย' }, { english: 'hands!', thai: 'แฮนดส์!' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'walk', thai: 'วอล์ค' }, { english: 'with', thai: 'วิธ' }, { english: 'my', thai: 'มาย' }, { english: 'feet.', thai: 'ฟีท' }],
    ],
    article_translation: 'ฉันมีตาสองข้าง จมูกของฉันเล็ก ฉันกินด้วยปาก ฉันปรบมือ! ฉันเดินด้วยเท้า',
    image_prompt: 'Cute cartoon child pointing to body parts - head, eyes, nose, mouth, hands, feet, colorful labels',
    quiz: [
      { question: '"Eyes" แปลว่าอะไร?', options: ['หู', 'ตา', 'จมูก', 'ปาก'], correctIndex: 1, type: 'vocab' },
      { question: '"Mouth" แปลว่าอะไร?', options: ['จมูก', 'ตา', 'ปาก', 'หู'], correctIndex: 2, type: 'vocab' },
      { question: 'ฉันกินด้วยอะไร?', options: ['hands', 'feet', 'nose', 'mouth'], correctIndex: 3, type: 'comprehension' },
      { question: 'ฉันเดินด้วยอะไร?', options: ['hands', 'feet', 'eyes', 'head'], correctIndex: 1, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 3,
    level: 0,
    topic: 'Animals',
    title: 'Cat, Dog, Bird',
    title_thai: 'แมว หมา นก',
    vocabulary: [
      { word: 'cat', phonetic: 'แคท', meaning: 'แมว', partOfSpeech: 'n.' },
      { word: 'dog', phonetic: 'ด็อก', meaning: 'หมา', partOfSpeech: 'n.' },
      { word: 'bird', phonetic: 'เบิร์ด', meaning: 'นก', partOfSpeech: 'n.' },
      { word: 'fish', phonetic: 'ฟิช', meaning: 'ปลา', partOfSpeech: 'n.' },
      { word: 'rabbit', phonetic: 'แรบบิท', meaning: 'กระต่าย', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [{ english: 'The', thai: 'เดอะ' }, { english: 'cat', thai: 'แคท' }, { english: 'says', thai: 'เซส์' }, { english: '"Meow!"', thai: '"เมี้ยว!"' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'dog', thai: 'ด็อก' }, { english: 'says', thai: 'เซส์' }, { english: '"Woof!"', thai: '"วุฟ!"' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'bird', thai: 'เบิร์ด' }, { english: 'can', thai: 'แคน' }, { english: 'fly.', thai: 'ฟลาย' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'fish', thai: 'ฟิช' }, { english: 'swims', thai: 'สวิมส์' }, { english: 'in', thai: 'อิน' }, { english: 'water.', thai: 'วอเตอร์' }],
      [{ english: 'The', thai: 'เดอะ' }, { english: 'rabbit', thai: 'แรบบิท' }, { english: 'is', thai: 'อิส' }, { english: 'white.', thai: 'ไวท์' }],
    ],
    article_translation: 'แมวพูดว่า "เมี้ยว!" หมาพูดว่า "วุฟ!" นกบินได้ ปลาว่ายน้ำในน้ำ กระต่ายสีขาว',
    image_prompt: 'Cute cartoon animals - cat, dog, bird, fish, rabbit - colorful and child-friendly',
    quiz: [
      { question: '"Bird" แปลว่าอะไร?', options: ['ปลา', 'กระต่าย', 'นก', 'แมว'], correctIndex: 2, type: 'vocab' },
      { question: '"Rabbit" แปลว่าอะไร?', options: ['หมา', 'แมว', 'นก', 'กระต่าย'], correctIndex: 3, type: 'vocab' },
      { question: 'นกทำอะไรได้?', options: ['swim', 'fly', 'run', 'jump'], correctIndex: 1, type: 'comprehension' },
      { question: 'กระต่ายสีอะไร?', options: ['black', 'brown', 'white', 'gray'], correctIndex: 2, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 4,
    level: 0,
    topic: 'Food and Drink',
    title: 'Rice, Water, Fruit',
    title_thai: 'ข้าว น้ำ ผลไม้',
    vocabulary: [
      { word: 'rice', phonetic: 'ไรซ์', meaning: 'ข้าว', partOfSpeech: 'n.' },
      { word: 'water', phonetic: 'วอเตอร์', meaning: 'น้ำ', partOfSpeech: 'n.' },
      { word: 'fruit', phonetic: 'ฟรูท', meaning: 'ผลไม้', partOfSpeech: 'n.' },
      { word: 'eat', phonetic: 'อีท', meaning: 'กิน', partOfSpeech: 'v.' },
      { word: 'drink', phonetic: 'ดริงค์', meaning: 'ดื่ม', partOfSpeech: 'v.' },
      { word: 'hungry', phonetic: 'ฮังกรี', meaning: 'หิว', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [{ english: 'I', thai: 'ไอ' }, { english: 'am', thai: 'แอม' }, { english: 'hungry.', thai: 'ฮังกรี' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'eat', thai: 'อีท' }, { english: 'rice.', thai: 'ไรซ์' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'drink', thai: 'ดริงค์' }, { english: 'water.', thai: 'วอเตอร์' }],
      [{ english: 'I', thai: 'ไอ' }, { english: 'like', thai: 'ไลค์' }, { english: 'fruit.', thai: 'ฟรูท' }],
      [{ english: 'Now', thai: 'นาว' }, { english: 'I', thai: 'ไอ' }, { english: 'am', thai: 'แอม' }, { english: 'full!', thai: 'ฟูล!' }],
    ],
    article_translation: 'ฉันหิว ฉันกินข้าว ฉันดื่มน้ำ ฉันชอบผลไม้ ตอนนี้ฉันอิ่มแล้ว!',
    image_prompt: 'Cartoon child eating rice and fruit, drinking water, happy and full, colorful kitchen setting',
    quiz: [
      { question: '"Eat" แปลว่าอะไร?', options: ['ดื่ม', 'กิน', 'นอน', 'วิ่ง'], correctIndex: 1, type: 'vocab' },
      { question: '"Hungry" แปลว่าอะไร?', options: ['อิ่ม', 'เหนื่อย', 'หิว', 'ง่วง'], correctIndex: 2, type: 'vocab' },
      { question: 'ฉันกินอะไร?', options: ['fruit', 'rice', 'water', 'milk'], correctIndex: 1, type: 'comprehension' },
      { question: 'ตอนท้ายฉันรู้สึกยังไง?', options: ['hungry', 'tired', 'full', 'sad'], correctIndex: 2, type: 'comprehension' },
    ],
  },
];

// =============================================
// CORE PRE-A1 (Level 0) - Greetings module
// =============================================
const pre0GreetingsLessons = [
  {
    module_id: 'core-a0-greetings',
    lesson_order: 1,
    level: 0,
    topic: 'Hello and Goodbye',
    title: 'Good Morning!',
    title_thai: 'สวัสดีตอนเช้า!',
    vocabulary: [
      { word: 'good morning', phonetic: 'กู๊ดมอร์นิง', meaning: 'สวัสดีตอนเช้า', partOfSpeech: 'phr.' },
      { word: 'good night', phonetic: 'กู๊ดไนท์', meaning: 'ราตรีสวัสดิ์', partOfSpeech: 'phr.' },
      { word: 'bye', phonetic: 'บาย', meaning: 'บ๊ายบาย', partOfSpeech: 'interj.' },
      { word: 'see you', phonetic: 'ซียู', meaning: 'แล้วเจอกัน', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [{ english: '"Good', thai: '"กู๊ด' }, { english: 'morning!"', thai: 'มอร์นิง!"' }],
      [{ english: '"Good', thai: '"กู๊ด' }, { english: 'morning,', thai: 'มอร์นิง,' }, { english: 'Mom!"', thai: 'มัม!"' }],
      [{ english: 'At', thai: 'แอท' }, { english: 'night,', thai: 'ไนท์,' }, { english: '"Good', thai: '"กู๊ด' }, { english: 'night!"', thai: 'ไนท์!"' }],
      [{ english: '"Bye!', thai: '"บาย!' }, { english: 'See', thai: 'ซี' }, { english: 'you', thai: 'ยู' }, { english: 'tomorrow!"', thai: 'ทูมอร์โรว์!"' }],
    ],
    article_translation: '"สวัสดีตอนเช้า!" "สวัสดีตอนเช้า แม่!" ตอนกลางคืน "ราตรีสวัสดิ์!" "บ๊ายบาย! แล้วเจอกันพรุ่งนี้!"',
    image_prompt: 'Cartoon child waking up in the morning saying good morning to mom, bright sunny bedroom',
    quiz: [
      { question: '"Good morning" แปลว่าอะไร?', options: ['ราตรีสวัสดิ์', 'สวัสดีตอนเช้า', 'บ๊ายบาย', 'แล้วเจอกัน'], correctIndex: 1, type: 'vocab' },
      { question: '"Good night" แปลว่าอะไร?', options: ['สวัสดีตอนเช้า', 'สวัสดีตอนบ่าย', 'ราตรีสวัสดิ์', 'บ๊ายบาย'], correctIndex: 2, type: 'vocab' },
      { question: 'ตอนกลางคืนพูดว่าอะไร?', options: ['Good morning', 'Good night', 'Bye', 'Hello'], correctIndex: 1, type: 'comprehension' },
      { question: '"See you" แปลว่าอะไร?', options: ['ขอบคุณ', 'ขอโทษ', 'แล้วเจอกัน', 'สวัสดี'], correctIndex: 2, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-greetings',
    lesson_order: 2,
    level: 0,
    topic: 'How Are You?',
    title: 'I Am Happy!',
    title_thai: 'ฉันมีความสุข!',
    vocabulary: [
      { word: 'happy', phonetic: 'แฮปปี้', meaning: 'มีความสุข', partOfSpeech: 'adj.' },
      { word: 'sad', phonetic: 'แซด', meaning: 'เศร้า', partOfSpeech: 'adj.' },
      { word: 'tired', phonetic: 'ไทเออร์ด', meaning: 'เหนื่อย', partOfSpeech: 'adj.' },
      { word: 'fine', phonetic: 'ไฟน์', meaning: 'สบายดี', partOfSpeech: 'adj.' },
      { word: 'how are you', phonetic: 'ฮาว อาร์ ยู', meaning: 'คุณเป็นยังไงบ้าง', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [{ english: '"How', thai: '"ฮาว' }, { english: 'are', thai: 'อาร์' }, { english: 'you?"', thai: 'ยู?"' }],
      [{ english: '"I', thai: '"ไอ' }, { english: 'am', thai: 'แอม' }, { english: 'happy!"', thai: 'แฮปปี้!"' }],
      [{ english: '"Are', thai: '"อาร์' }, { english: 'you', thai: 'ยู' }, { english: 'tired?"', thai: 'ไทเออร์ด?"' }],
      [{ english: '"No,', thai: '"โน,' }, { english: 'I', thai: 'ไอ' }, { english: 'am', thai: 'แอม' }, { english: 'fine!"', thai: 'ไฟน์!"' }],
    ],
    article_translation: '"คุณเป็นยังไงบ้าง?" "ฉันมีความสุข!" "คุณเหนื่อยมั้ย?" "ไม่ ฉันสบายดี!"',
    image_prompt: 'Two cartoon children talking, one looking happy and energetic, bright colorful background',
    quiz: [
      { question: '"Happy" แปลว่าอะไร?', options: ['เศร้า', 'เหนื่อย', 'มีความสุข', 'หิว'], correctIndex: 2, type: 'vocab' },
      { question: '"Sad" แปลว่าอะไร?', options: ['มีความสุข', 'เศร้า', 'สบายดี', 'เหนื่อย'], correctIndex: 1, type: 'vocab' },
      { question: 'เด็กตอบว่าอะไรเมื่อถามว่า "How are you?"', options: ['I am sad', 'I am tired', 'I am happy', 'I am fine'], correctIndex: 2, type: 'comprehension' },
      { question: '"Fine" แปลว่าอะไร?', options: ['เหนื่อย', 'เศร้า', 'หิว', 'สบายดี'], correctIndex: 3, type: 'comprehension' },
    ],
  },
  {
    module_id: 'core-a0-greetings',
    lesson_order: 3,
    level: 0,
    topic: 'My Name',
    title: 'What Is Your Name?',
    title_thai: 'คุณชื่ออะไร?',
    vocabulary: [
      { word: 'name', phonetic: 'เนม', meaning: 'ชื่อ', partOfSpeech: 'n.' },
      { word: 'my name is', phonetic: 'มาย เนม อิส', meaning: 'ฉันชื่อ', partOfSpeech: 'phr.' },
      { word: 'what', phonetic: 'ว็อท', meaning: 'อะไร', partOfSpeech: 'pron.' },
      { word: 'nice to meet you', phonetic: 'ไนซ์ ทู มีท ยู', meaning: 'ยินดีที่ได้รู้จัก', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [{ english: '"What', thai: '"ว็อท' }, { english: 'is', thai: 'อิส' }, { english: 'your', thai: 'ยัวร์' }, { english: 'name?"', thai: 'เนม?"' }],
      [{ english: '"My', thai: '"มาย' }, { english: 'name', thai: 'เนม' }, { english: 'is', thai: 'อิส' }, { english: 'Nong."', thai: 'น้อง"' }],
      [{ english: '"My', thai: '"มาย' }, { english: 'name', thai: 'เนม' }, { english: 'is', thai: 'อิส' }, { english: 'Phi."', thai: 'พี่"' }],
      [{ english: '"Nice', thai: '"ไนซ์' }, { english: 'to', thai: 'ทู' }, { english: 'meet', thai: 'มีท' }, { english: 'you!"', thai: 'ยู!"' }],
    ],
    article_translation: '"คุณชื่ออะไร?" "ฉันชื่อน้อง" "ฉันชื่อพี่" "ยินดีที่ได้รู้จัก!"',
    image_prompt: 'Two cartoon children introducing themselves, shaking hands, bright friendly scene',
    quiz: [
      { question: '"Name" แปลว่าอะไร?', options: ['อายุ', 'ชื่อ', 'บ้าน', 'โรงเรียน'], correctIndex: 1, type: 'vocab' },
      { question: '"Nice to meet you" แปลว่าอะไร?', options: ['สวัสดี', 'ลาก่อน', 'ยินดีที่ได้รู้จัก', 'ขอบคุณ'], correctIndex: 2, type: 'vocab' },
      { question: 'เด็กคนแรกชื่ออะไร?', options: ['Phi', 'Nong', 'Som', 'Bam'], correctIndex: 1, type: 'comprehension' },
      { question: 'พวกเขาพูดว่าอะไรตอนท้าย?', options: ['Goodbye', 'Thank you', 'Nice to meet you', 'Sorry'], correctIndex: 2, type: 'comprehension' },
    ],
  },
];

// =============================================
// Main seed function
// =============================================
async function seedModule(moduleName, lessons) {
  console.log(`\nSeeding ${moduleName} (${lessons.length} lessons)...`);
  
  // Delete existing lessons for this module first
  const deleteRes = await fetch(
    `${SUPABASE_URL}/rest/v1/lessons?module_id=eq.${lessons[0].module_id}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  console.log(`  Cleared existing: ${deleteRes.status}`);

  // Insert new lessons
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/lessons`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(lessons.map(l => ({
      module_id: l.module_id,
      lesson_order: l.lesson_order,
      level: l.level,
      topic: l.topic,
      title: l.title,
      title_thai: l.title_thai,
      vocabulary: l.vocabulary,
      article_sentences: l.article_sentences,
      article_translation: l.article_translation,
      image_prompt: l.image_prompt,
      quiz: l.quiz,
      is_published: true,
    }))),
  });

  if (!insertRes.ok) {
    const err = await insertRes.text();
    console.error(`  ERROR: ${insertRes.status} - ${err}`);
  } else {
    console.log(`  Inserted ${lessons.length} lessons: OK`);
  }
}

async function main() {
  console.log('=== Seeding Pre-A1 Lessons ===');
  
  await seedModule('core-a0-alphabet', alphabetLessons);
  await seedModule('core-a0-numbers', numbersLessons);
  await seedModule('core-a0-colors', colorsLessons);
  await seedModule('core-a0-firstwords', firstWordsLessons);
  await seedModule('core-a0-greetings', pre0GreetingsLessons);

  console.log('\n=== Done! Verifying... ===');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/lessons?module_id=like.core-a0-*&select=module_id,lesson_order,title`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  const data = await res.json();
  console.log(`Total Pre-A1 lessons inserted: ${data.length}`);
  
  // Group by module
  const byModule = {};
  for (const l of data) {
    byModule[l.module_id] = (byModule[l.module_id] || 0) + 1;
  }
  for (const [mod, count] of Object.entries(byModule)) {
    console.log(`  ${mod}: ${count} lessons`);
  }
}

main().catch(console.error);
