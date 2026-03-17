import { VocabWord, InterlinearWord, QuizQuestion } from '@/types/lesson';

export interface LessonSeedData {
  module_id: string;
  lesson_order: number;
  level: number;
  topic: string;
  title: string;
  title_thai: string;
  vocabulary: VocabWord[];
  article_sentences: InterlinearWord[][];
  article_translation: string;
  image_prompt: string;
  quiz: QuizQuestion[];
}

export const coreA1FoodLessons: LessonSeedData[] = [
  // ──────────────────────────────────────────────
  // Lesson 1: Common Foods (อาหารทั่วไป)
  // ──────────────────────────────────────────────
  {
    module_id: 'core-a1-food',
    lesson_order: 1,
    level: 1,
    topic: 'common-foods',
    title: 'What Som Eats Every Day',
    title_thai: 'สมกินอะไรทุกวัน',
    vocabulary: [
      { word: 'rice', phonetic: 'ไรซ์', meaning: 'ข้าว', partOfSpeech: 'n.' },
      { word: 'chicken', phonetic: 'ชิคเก้น', meaning: 'ไก่', partOfSpeech: 'n.' },
      { word: 'egg', phonetic: 'เอ้ก', meaning: 'ไข่', partOfSpeech: 'n.' },
      { word: 'noodle', phonetic: 'นู้ดเดิล', meaning: 'เส้นก๋วยเตี๋ยว', partOfSpeech: 'n.' },
      { word: 'fish', phonetic: 'ฟิช', meaning: 'ปลา', partOfSpeech: 'n.' },
      { word: 'vegetable', phonetic: 'เวจเทอะเบิล', meaning: 'ผัก', partOfSpeech: 'n.' },
      { word: 'eat', phonetic: 'อีท', meaning: 'กิน', partOfSpeech: 'v.' },
      { word: 'delicious', phonetic: 'ดิลิเชิส', meaning: 'อร่อย', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'rice', thai: 'ไรซ์' },
        { english: 'every', thai: 'เอฟวรี' },
        { english: 'day.', thai: 'เดย์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'chicken', thai: 'ชิคเก้น' },
        { english: 'with', thai: 'วิธ' },
        { english: 'rice.', thai: 'ไรซ์' },
      ],
      [
        { english: 'For', thai: 'ฟอร์' },
        { english: 'breakfast,', thai: 'เบรคฟาสท์' },
        { english: 'she', thai: 'ชี' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'eggs.', thai: 'เอ้กส์' },
      ],
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'mom', thai: 'มอม' },
        { english: 'cooks', thai: 'คุกส์' },
        { english: 'fish', thai: 'ฟิช' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'vegetables.', thai: 'เวจเทอะเบิลส์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'food', thai: 'ฟูด' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี' },
        { english: 'delicious!', thai: 'ดิลิเชิส' },
      ],
    ],
    article_translation:
      'ส้มกินข้าวทุกวัน เธอชอบข้าวกับไก่ มื้อเช้าเธอกินไข่ แม่ของเธอทำปลาและผัก อาหารอร่อยมาก!',
    image_prompt:
      'A Thai girl eating a plate of chicken rice at a simple Thai kitchen table, warm and cozy home setting, illustration style',
    quiz: [
      {
        question: "คำว่า 'rice' แปลว่าอะไร?",
        options: ['ไก่', 'ข้าว', 'ปลา', 'ไข่'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'delicious' เป็น Part of Speech อะไร?",
        options: ['noun', 'verb', 'adjective', 'adverb'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ส้มกินอะไรเป็นมื้อเช้า?',
        options: ['ข้าว', 'ปลา', 'ไข่', 'ก๋วยเตี๋ยว'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ใครเป็นคนทำอาหารให้ส้ม?',
        options: ['พ่อ', 'แม่', 'พี่สาว', 'ส้มทำเอง'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Lesson 2: Drinks and Beverages (เครื่องดื่ม)
  // ──────────────────────────────────────────────
  {
    module_id: 'core-a1-food',
    lesson_order: 2,
    level: 1,
    topic: 'drinks-and-beverages',
    title: "Bam's Favorite Drinks",
    title_thai: 'เครื่องดื่มที่แบมชอบ',
    vocabulary: [
      { word: 'water', phonetic: 'วอเทอะ', meaning: 'น้ำ', partOfSpeech: 'n.' },
      { word: 'tea', phonetic: 'ที', meaning: 'ชา', partOfSpeech: 'n.' },
      { word: 'coffee', phonetic: 'คอฟฟี', meaning: 'กาแฟ', partOfSpeech: 'n.' },
      { word: 'milk', phonetic: 'มิลค์', meaning: 'นม', partOfSpeech: 'n.' },
      { word: 'juice', phonetic: 'จูซ', meaning: 'น้ำผลไม้', partOfSpeech: 'n.' },
      { word: 'cold', phonetic: 'โคลด์', meaning: 'เย็น', partOfSpeech: 'adj.' },
      { word: 'hot', phonetic: 'ฮอท', meaning: 'ร้อน', partOfSpeech: 'adj.' },
      { word: 'sweet', phonetic: 'สวีท', meaning: 'หวาน', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'drinks', thai: 'ดริงค์ส' },
        { english: 'coffee', thai: 'คอฟฟี' },
        { english: 'every', thai: 'เอฟวรี' },
        { english: 'morning.', thai: 'มอร์นิง' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'it', thai: 'อิท' },
        { english: 'hot', thai: 'ฮอท' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'sweet.', thai: 'สวีท' },
      ],
      [
        { english: 'In', thai: 'อิน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'afternoon,', thai: 'อาฟเทอะนูน' },
        { english: 'he', thai: 'ฮี' },
        { english: 'drinks', thai: 'ดริงค์ส' },
        { english: 'cold', thai: 'โคลด์' },
        { english: 'Thai', thai: 'ไท' },
        { english: 'tea.', thai: 'ที' },
      ],
      [
        { english: 'His', thai: 'ฮิส' },
        { english: 'sister', thai: 'ซิสเทอะ' },
        { english: 'Fon', thai: 'ฟ้อน' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'orange', thai: 'ออเรนจ์' },
        { english: 'juice.', thai: 'จูซ' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'always', thai: 'ออลเวส์' },
        { english: 'drink', thai: 'ดริงค์' },
        { english: 'water', thai: 'วอเทอะ' },
        { english: 'too.', thai: 'ทู' },
      ],
    ],
    article_translation:
      'แบมดื่มกาแฟทุกเช้า เขาชอบกาแฟร้อนและหวาน ตอนบ่ายเขาดื่มชาไทยเย็น พี่สาวของเขาชื่อฟ้อนชอบน้ำส้ม พวกเขาดื่มน้ำเปล่าด้วยเสมอ',
    image_prompt:
      'A Thai boy holding a glass of iced Thai tea at a street drink stall in Bangkok, colorful drinks displayed, illustration style',
    quiz: [
      {
        question: "คำว่า 'coffee' แปลว่าอะไร?",
        options: ['ชา', 'กาแฟ', 'น้ำ', 'นม'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'cold' เป็น Part of Speech อะไร?",
        options: ['noun', 'verb', 'adjective', 'adverb'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมชอบดื่มกาแฟแบบไหน?',
        options: ['เย็นและขม', 'ร้อนและหวาน', 'เย็นและหวาน', 'ร้อนและขม'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ฟ้อนชอบดื่มอะไร?',
        options: ['กาแฟ', 'ชาไทย', 'น้ำส้ม', 'นม'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Lesson 3: I Like and I Don't Like (ฉันชอบและไม่ชอบ)
  // ──────────────────────────────────────────────
  {
    module_id: 'core-a1-food',
    lesson_order: 3,
    level: 1,
    topic: 'likes-and-dislikes',
    title: 'Fon and Pla Talk About Food',
    title_thai: 'ฟ้อนกับปลาคุยเรื่องอาหาร',
    vocabulary: [
      { word: 'like', phonetic: 'ไลค์', meaning: 'ชอบ', partOfSpeech: 'v.' },
      { word: 'spicy', phonetic: 'สไปซี', meaning: 'เผ็ด', partOfSpeech: 'adj.' },
      { word: 'sour', phonetic: 'ซาวเออะ', meaning: 'เปรี้ยว', partOfSpeech: 'adj.' },
      { word: 'favorite', phonetic: 'เฟเวอะริท', meaning: 'ที่ชอบที่สุด', partOfSpeech: 'adj.' },
      { word: 'hate', phonetic: 'เฮท', meaning: 'เกลียด', partOfSpeech: 'v.' },
      { word: 'taste', phonetic: 'เทสท์', meaning: 'รสชาติ', partOfSpeech: 'n.' },
      { word: 'fruit', phonetic: 'ฟรุท', meaning: 'ผลไม้', partOfSpeech: 'n.' },
      { word: 'try', phonetic: 'ทราย', meaning: 'ลอง', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Fon', thai: 'ฟ้อน' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'spicy', thai: 'สไปซี' },
        { english: 'food.', thai: 'ฟูด' },
      ],
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'favorite', thai: 'เฟเวอะริท' },
        { english: 'food', thai: 'ฟูด' },
        { english: 'is', thai: 'อิส' },
        { english: 'som', thai: 'ส้ม' },
        { english: 'tam.', thai: 'ตำ' },
      ],
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'does', thai: 'ดาส' },
        { english: 'not', thai: 'นอท' },
        { english: 'like', thai: 'ไลค์' },
        { english: 'spicy', thai: 'สไปซี' },
        { english: 'food.', thai: 'ฟูด' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'sweet', thai: 'สวีท' },
        { english: 'fruit.', thai: 'ฟรุท' },
      ],
      [
        { english: 'Fon', thai: 'ฟ้อน' },
        { english: 'says,', thai: 'เซส์' },
        { english: '"Try', thai: 'ทราย' },
        { english: 'it!', thai: 'อิท' },
        { english: 'The', thai: 'เดอะ' },
        { english: 'taste', thai: 'เทสท์' },
        { english: 'is', thai: 'อิส' },
        { english: 'great!"', thai: 'เกรท' },
      ],
    ],
    article_translation:
      'ฟ้อนชอบอาหารเผ็ด อาหารที่ชอบที่สุดของเธอคือส้มตำ ปลาไม่ชอบอาหารเผ็ด เธอชอบผลไม้หวาน ฟ้อนบอกว่า "ลองดูสิ! รสชาติดีมาก!"',
    image_prompt:
      'Two Thai girls at a street food stall, one eating som tam (papaya salad) happily while the other looks hesitant, colorful Thai market background, illustration style',
    quiz: [
      {
        question: "คำว่า 'spicy' แปลว่าอะไร?",
        options: ['หวาน', 'เปรี้ยว', 'เผ็ด', 'เค็ม'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: "คำว่า 'fruit' แปลว่าอะไร?",
        options: ['ผัก', 'ผลไม้', 'เนื้อ', 'ขนม'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'อาหารที่ฟ้อนชอบที่สุดคืออะไร?',
        options: ['ผัดไทย', 'ต้มยำ', 'ส้มตำ', 'ข้าวมันไก่'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ปลาชอบอาหารแบบไหน?',
        options: ['อาหารเผ็ด', 'ผลไม้หวาน', 'อาหารเปรี้ยว', 'อาหารเค็ม'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Lesson 4: Ordering Food (การสั่งอาหาร)
  // ──────────────────────────────────────────────
  {
    module_id: 'core-a1-food',
    lesson_order: 4,
    level: 1,
    topic: 'ordering-food',
    title: 'Nut Orders Pad Thai',
    title_thai: 'นัทสั่งผัดไทย',
    vocabulary: [
      { word: 'order', phonetic: 'ออร์เดอะ', meaning: 'สั่ง', partOfSpeech: 'v.' },
      { word: 'please', phonetic: 'พลีส', meaning: 'ได้โปรด / ครับ / ค่ะ', partOfSpeech: 'adv.' },
      { word: 'want', phonetic: 'วอนท์', meaning: 'ต้องการ', partOfSpeech: 'v.' },
      { word: 'how much', phonetic: 'ฮาว-มัช', meaning: 'เท่าไหร่', partOfSpeech: 'phr.' },
      { word: 'baht', phonetic: 'บาท', meaning: 'บาท (สกุลเงิน)', partOfSpeech: 'n.' },
      { word: 'one', phonetic: 'วัน', meaning: 'หนึ่ง', partOfSpeech: 'num.' },
      { word: 'plate', phonetic: 'เพลท', meaning: 'จาน', partOfSpeech: 'n.' },
      { word: 'thank you', phonetic: 'แธงค์-ยู', meaning: 'ขอบคุณ', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'a', thai: 'อะ' },
        { english: 'food', thai: 'ฟูด' },
        { english: 'stall.', thai: 'สตอลล์' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'says,', thai: 'เซส์' },
        { english: '"I', thai: 'ไอ' },
        { english: 'want', thai: 'วอนท์' },
        { english: 'pad', thai: 'แพด' },
        { english: 'Thai,', thai: 'ไท' },
        { english: 'please."', thai: 'พลีส' },
      ],
      [
        { english: '"How', thai: 'ฮาว' },
        { english: 'much', thai: 'มัช' },
        { english: 'is', thai: 'อิส' },
        { english: 'one', thai: 'วัน' },
        { english: 'plate?"', thai: 'เพลท' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'lady', thai: 'เลดี' },
        { english: 'says,', thai: 'เซส์' },
        { english: '"Fifty', thai: 'ฟิฟตี' },
        { english: 'baht."', thai: 'บาท' },
      ],
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'says,', thai: 'เซส์' },
        { english: '"Thank', thai: 'แธงค์' },
        { english: 'you!"', thai: 'ยู' },
      ],
    ],
    article_translation:
      'นัทไปที่ร้านข้างทาง เขาพูดว่า "ผมอยากได้ผัดไทยครับ" "จานละเท่าไหร่ครับ?" แม่ค้าบอกว่า "ห้าสิบบาทค่ะ" นัทบอก "ขอบคุณครับ!"',
    image_prompt:
      'A Thai boy ordering food at a Thai street food stall with a wok cooking pad thai, night market atmosphere with warm lights, illustration style',
    quiz: [
      {
        question: "คำว่า 'order' แปลว่าอะไร?",
        options: ['กิน', 'สั่ง', 'จ่าย', 'ถาม'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'plate' แปลว่าอะไร?",
        options: ['ช้อน', 'ส้อม', 'จาน', 'ถ้วย'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'นัทสั่งอาหารอะไร?',
        options: ['ข้าวผัด', 'ผัดไทย', 'ส้มตำ', 'ก๋วยเตี๋ยว'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ผัดไทยราคาเท่าไหร่?',
        options: ['สี่สิบบาท', 'ห้าสิบบาท', 'หกสิบบาท', 'เจ็ดสิบบาท'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Lesson 5: At the Restaurant (ที่ร้านอาหาร)
  // ──────────────────────────────────────────────
  {
    module_id: 'core-a1-food',
    lesson_order: 5,
    level: 1,
    topic: 'at-the-restaurant',
    title: 'Dinner with Friends',
    title_thai: 'กินข้าวกับเพื่อน',
    vocabulary: [
      { word: 'menu', phonetic: 'เมนู', meaning: 'เมนู / รายการอาหาร', partOfSpeech: 'n.' },
      { word: 'waiter', phonetic: 'เวทเทอะ', meaning: 'พนักงานเสิร์ฟ', partOfSpeech: 'n.' },
      { word: 'bill', phonetic: 'บิลล์', meaning: 'บิล / ใบเสร็จ', partOfSpeech: 'n.' },
      { word: 'share', phonetic: 'แชร์', meaning: 'แบ่ง / แชร์', partOfSpeech: 'v.' },
      { word: 'full', phonetic: 'ฟูล', meaning: 'อิ่ม', partOfSpeech: 'adj.' },
      { word: 'ready', phonetic: 'เรดดี', meaning: 'พร้อม', partOfSpeech: 'adj.' },
      { word: 'table', phonetic: 'เทเบิล', meaning: 'โต๊ะ', partOfSpeech: 'n.' },
      { word: 'together', phonetic: 'ทูเก็ธเธอะ', meaning: 'ด้วยกัน', partOfSpeech: 'adv.' },
    ],
    article_sentences: [
      [
        { english: 'Som,', thai: 'ส้ม' },
        { english: 'Bam,', thai: 'แบม' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'Fon', thai: 'ฟ้อน' },
        { english: 'go', thai: 'โก' },
        { english: 'to', thai: 'ทู' },
        { english: 'a', thai: 'อะ' },
        { english: 'restaurant.', thai: 'เรสเทอะร็อนท์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'waiter', thai: 'เวทเทอะ' },
        { english: 'gives', thai: 'กิฟส์' },
        { english: 'them', thai: 'เด็ม' },
        { english: 'a', thai: 'อะ' },
        { english: 'menu.', thai: 'เมนู' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'order', thai: 'ออร์เดอะ' },
        { english: 'three', thai: 'ธรี' },
        { english: 'dishes', thai: 'ดิชเชส' },
        { english: 'to', thai: 'ทู' },
        { english: 'share.', thai: 'แชร์' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'eat', thai: 'อีท' },
        { english: 'together', thai: 'ทูเก็ธเธอะ' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'feel', thai: 'ฟีล' },
        { english: 'very', thai: 'เวรี' },
        { english: 'full.', thai: 'ฟูล' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'asks', thai: 'อาสค์ส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'bill.', thai: 'บิลล์' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'share', thai: 'แชร์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'bill', thai: 'บิลล์' },
        { english: 'together.', thai: 'ทูเก็ธเธอะ' },
      ],
    ],
    article_translation:
      'ส้ม แบม และฟ้อนไปร้านอาหาร พนักงานเสิร์ฟให้เมนู พวกเขาสั่งอาหาร 3 อย่างมาแชร์กัน พวกเขากินด้วยกันจนอิ่มมาก แบมขอบิล แล้วพวกเขาหารจ่ายกัน',
    image_prompt:
      'Three Thai friends sitting at a restaurant table with multiple Thai dishes, laughing and sharing food, warm restaurant ambiance, illustration style',
    quiz: [
      {
        question: "คำว่า 'menu' แปลว่าอะไร?",
        options: ['โต๊ะ', 'บิล', 'รายการอาหาร', 'จาน'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: "คำว่า 'full' แปลว่าอะไร?",
        options: ['หิว', 'อิ่ม', 'เหนื่อย', 'ง่วง'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'พวกเขาสั่งอาหารกี่อย่าง?',
        options: ['2 อย่าง', '3 อย่าง', '4 อย่าง', '5 อย่าง'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'พวกเขาจ่ายเงินอย่างไร?',
        options: [
          'ส้มจ่ายคนเดียว',
          'แบมจ่ายคนเดียว',
          'ฟ้อนจ่ายคนเดียว',
          'หารจ่ายกัน',
        ],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },
];
