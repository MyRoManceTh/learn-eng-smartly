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

export const corePreAlphabetLessons: LessonSeedData[] = [
  // ==========================================
  // Lesson 1: Letters A, B, C
  // ==========================================
  {
    module_id: 'core-pre-alphabet',
    lesson_order: 1,
    level: 0,
    topic: 'Letters A, B, C',
    title: 'Apple, Ball, Cat',
    title_thai: 'แอปเปิล บอล แมว',
    vocabulary: [
      { word: 'apple', phonetic: 'แอปเปิล', meaning: 'แอปเปิล (ผลไม้)', partOfSpeech: 'n.' },
      { word: 'ball', phonetic: 'บอล', meaning: 'ลูกบอล', partOfSpeech: 'n.' },
      { word: 'cat', phonetic: 'แคท', meaning: 'แมว', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'A', thai: 'เอ' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Apple.', thai: 'แอปเปิล' },
      ],
      [
        { english: 'B', thai: 'บี' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Ball.', thai: 'บอล' },
      ],
      [
        { english: 'C', thai: 'ซี' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Cat.', thai: 'แคท' },
      ],
      [
        { english: 'A,', thai: 'เอ,' },
        { english: 'B,', thai: 'บี,' },
        { english: 'C!', thai: 'ซี!' },
      ],
    ],
    article_translation:
      'A คือ Apple (แอปเปิล) B คือ Ball (ลูกบอล) C คือ Cat (แมว) เอ บี ซี!',
    image_prompt: 'Colorful alphabet cards showing A for Apple, B for Ball, C for Cat, bright cartoon style for children',
    quiz: [
      {
        question: 'ตัวอักษร A อ่านว่าอะไร?',
        options: ['บี', 'ซี', 'เอ', 'ดี'],
        correctIndex: 2,
        explanation: 'ตัวอักษร A อ่านว่า "เอ" เหมือนใน Apple',
      },
      {
        question: 'คำว่า Ball เริ่มต้นด้วยตัวอักษรอะไร?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        explanation: 'Ball เริ่มต้นด้วยตัวอักษร B',
      },
      {
        question: 'ตัวอักษร C อ่านว่าอะไร?',
        options: ['เอ', 'บี', 'ซี', 'อี'],
        correctIndex: 2,
        explanation: 'ตัวอักษร C อ่านว่า "ซี" เหมือนใน Cat',
      },
      {
        question: 'Apple แปลว่าอะไร?',
        options: ['ลูกบอล', 'แมว', 'แอปเปิล', 'หมา'],
        correctIndex: 2,
        explanation: 'Apple แปลว่า แอปเปิล ซึ่งเป็นผลไม้',
      },
    ],
  },

  // ==========================================
  // Lesson 2: Letters D, E, F
  // ==========================================
  {
    module_id: 'core-pre-alphabet',
    lesson_order: 2,
    level: 0,
    topic: 'Letters D, E, F',
    title: 'Dog, Egg, Fish',
    title_thai: 'หมา ไข่ ปลา',
    vocabulary: [
      { word: 'dog', phonetic: 'ด็อก', meaning: 'หมา / สุนัข', partOfSpeech: 'n.' },
      { word: 'egg', phonetic: 'เอ็ก', meaning: 'ไข่', partOfSpeech: 'n.' },
      { word: 'fish', phonetic: 'ฟิช', meaning: 'ปลา', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'D', thai: 'ดี' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Dog.', thai: 'ด็อก' },
      ],
      [
        { english: 'E', thai: 'อี' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Egg.', thai: 'เอ็ก' },
      ],
      [
        { english: 'F', thai: 'เอฟ' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Fish.', thai: 'ฟิช' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'dog', thai: 'ด็อก' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'fish.', thai: 'ฟิช' },
      ],
    ],
    article_translation:
      'D คือ Dog (หมา) E คือ Egg (ไข่) F คือ Fish (ปลา) หมากินปลา',
    image_prompt: 'Cute cartoon dog, egg, and fish side by side with D, E, F letter labels, colorful and child-friendly',
    quiz: [
      {
        question: 'ตัวอักษร D อ่านว่าอะไร?',
        options: ['ดี', 'อี', 'เอฟ', 'จี'],
        correctIndex: 0,
        explanation: 'ตัวอักษร D อ่านว่า "ดี" เหมือนใน Dog',
      },
      {
        question: 'Dog แปลว่าอะไร?',
        options: ['ปลา', 'ไข่', 'หมา', 'แมว'],
        correctIndex: 2,
        explanation: 'Dog แปลว่า หมา หรือ สุนัข',
      },
      {
        question: 'คำว่า Fish เริ่มต้นด้วยตัวอักษรอะไร?',
        options: ['D', 'E', 'F', 'G'],
        correctIndex: 2,
        explanation: 'Fish เริ่มต้นด้วยตัวอักษร F',
      },
      {
        question: 'ตัวอักษร E อ่านว่าอะไร?',
        options: ['ดี', 'อี', 'เอฟ', 'บี'],
        correctIndex: 1,
        explanation: 'ตัวอักษร E อ่านว่า "อี" เหมือนใน Egg',
      },
    ],
  },

  // ==========================================
  // Lesson 3: Letters G, H, I, J
  // ==========================================
  {
    module_id: 'core-pre-alphabet',
    lesson_order: 3,
    level: 0,
    topic: 'Letters G, H, I, J',
    title: 'Girl, Hat, Ice, Juice',
    title_thai: 'เด็กผู้หญิง หมวก น้ำแข็ง น้ำผลไม้',
    vocabulary: [
      { word: 'girl', phonetic: 'เกิร์ล', meaning: 'เด็กผู้หญิง', partOfSpeech: 'n.' },
      { word: 'hat', phonetic: 'แฮท', meaning: 'หมวก', partOfSpeech: 'n.' },
      { word: 'ice', phonetic: 'ไอซ์', meaning: 'น้ำแข็ง', partOfSpeech: 'n.' },
      { word: 'juice', phonetic: 'จูส', meaning: 'น้ำผลไม้', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'G', thai: 'จี' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Girl.', thai: 'เกิร์ล' },
      ],
      [
        { english: 'H', thai: 'เอช' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Hat.', thai: 'แฮท' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'girl', thai: 'เกิร์ล' },
        { english: 'has', thai: 'แฮส' },
        { english: 'a', thai: 'อะ' },
        { english: 'hat.', thai: 'แฮท' },
      ],
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Ice.', thai: 'ไอซ์' },
      ],
      [
        { english: 'J', thai: 'เจ' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Juice.', thai: 'จูส' },
      ],
    ],
    article_translation:
      'G คือ Girl (เด็กผู้หญิง) H คือ Hat (หมวก) เด็กผู้หญิงมีหมวก I คือ Ice (น้ำแข็ง) J คือ Juice (น้ำผลไม้)',
    image_prompt: 'A happy girl wearing a hat, holding a glass of juice with ice, cartoon style with G H I J letter labels',
    quiz: [
      {
        question: 'Girl แปลว่าอะไร?',
        options: ['เด็กผู้ชาย', 'เด็กผู้หญิง', 'ผู้ใหญ่', 'สัตว์'],
        correctIndex: 1,
        explanation: 'Girl แปลว่า เด็กผู้หญิง',
      },
      {
        question: 'ตัวอักษร H อ่านว่าอะไร?',
        options: ['จี', 'เอช', 'ไอ', 'เจ'],
        correctIndex: 1,
        explanation: 'ตัวอักษร H อ่านว่า "เอช" เหมือนใน Hat',
      },
      {
        question: 'Juice แปลว่าอะไร?',
        options: ['น้ำแข็ง', 'น้ำเปล่า', 'น้ำผลไม้', 'นม'],
        correctIndex: 2,
        explanation: 'Juice แปลว่า น้ำผลไม้',
      },
      {
        question: 'คำว่า Ice เริ่มต้นด้วยตัวอักษรอะไร?',
        options: ['G', 'H', 'I', 'J'],
        correctIndex: 2,
        explanation: 'Ice เริ่มต้นด้วยตัวอักษร I',
      },
    ],
  },

  // ==========================================
  // Lesson 4: Letters K, L, M, N
  // ==========================================
  {
    module_id: 'core-pre-alphabet',
    lesson_order: 4,
    level: 0,
    topic: 'Letters K, L, M, N',
    title: 'King, Lion, Moon, Night',
    title_thai: 'กษัตริย์ สิงโต พระจันทร์ กลางคืน',
    vocabulary: [
      { word: 'king', phonetic: 'คิง', meaning: 'กษัตริย์ / พระราชา', partOfSpeech: 'n.' },
      { word: 'lion', phonetic: 'ไลอัน', meaning: 'สิงโต', partOfSpeech: 'n.' },
      { word: 'moon', phonetic: 'มูน', meaning: 'พระจันทร์', partOfSpeech: 'n.' },
      { word: 'night', phonetic: 'ไนท์', meaning: 'กลางคืน', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'K', thai: 'เค' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'King.', thai: 'คิง' },
      ],
      [
        { english: 'L', thai: 'เอล' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Lion.', thai: 'ไลอัน' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'lion', thai: 'ไลอัน' },
        { english: 'is', thai: 'อิส' },
        { english: 'big.', thai: 'บิก' },
      ],
      [
        { english: 'M', thai: 'เอม' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Moon.', thai: 'มูน' },
      ],
      [
        { english: 'N', thai: 'เอน' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Night.', thai: 'ไนท์' },
      ],
    ],
    article_translation:
      'K คือ King (กษัตริย์) L คือ Lion (สิงโต) สิงโตตัวใหญ่ M คือ Moon (พระจันทร์) N คือ Night (กลางคืน)',
    image_prompt: 'Majestic lion under a bright moon at night, with K L M N letter cards, colorful cartoon for children',
    quiz: [
      {
        question: 'King แปลว่าอะไร?',
        options: ['ราชินี', 'กษัตริย์', 'เจ้าชาย', 'ทหาร'],
        correctIndex: 1,
        explanation: 'King แปลว่า กษัตริย์ หรือ พระราชา',
      },
      {
        question: 'ตัวอักษร L อ่านว่าอะไร?',
        options: ['เค', 'เอล', 'เอม', 'เอน'],
        correctIndex: 1,
        explanation: 'ตัวอักษร L อ่านว่า "เอล" เหมือนใน Lion',
      },
      {
        question: 'Moon แปลว่าอะไร?',
        options: ['ดวงอาทิตย์', 'ดาว', 'พระจันทร์', 'เมฆ'],
        correctIndex: 2,
        explanation: 'Moon แปลว่า พระจันทร์',
      },
      {
        question: 'คำว่า Night เริ่มต้นด้วยตัวอักษรอะไร?',
        options: ['K', 'L', 'M', 'N'],
        correctIndex: 3,
        explanation: 'Night เริ่มต้นด้วยตัวอักษร N',
      },
    ],
  },

  // ==========================================
  // Lesson 5: Letters O, P, Q, R, S
  // ==========================================
  {
    module_id: 'core-pre-alphabet',
    lesson_order: 5,
    level: 0,
    topic: 'Letters O, P, Q, R, S',
    title: 'Orange, Pink, Queen, Rain, Sun',
    title_thai: 'ส้ม ชมพู ราชินี ฝน ดวงอาทิตย์',
    vocabulary: [
      { word: 'orange', phonetic: 'ออเรนจ์', meaning: 'ส้ม (ผลไม้)', partOfSpeech: 'n.' },
      { word: 'pink', phonetic: 'พิงค์', meaning: 'สีชมพู', partOfSpeech: 'n.' },
      { word: 'queen', phonetic: 'ควีน', meaning: 'ราชินี', partOfSpeech: 'n.' },
      { word: 'rain', phonetic: 'เรน', meaning: 'ฝน', partOfSpeech: 'n.' },
      { word: 'sun', phonetic: 'ซัน', meaning: 'ดวงอาทิตย์', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'O', thai: 'โอ' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Orange.', thai: 'ออเรนจ์' },
      ],
      [
        { english: 'Q', thai: 'คิว' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Queen.', thai: 'ควีน' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'queen', thai: 'ควีน' },
        { english: 'likes', thai: 'ไลคส์' },
        { english: 'rain.', thai: 'เรน' },
      ],
      [
        { english: 'R', thai: 'อาร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Rain.', thai: 'เรน' },
      ],
      [
        { english: 'S', thai: 'เอส' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Sun.', thai: 'ซัน' },
      ],
    ],
    article_translation:
      'O คือ Orange (ส้ม) Q คือ Queen (ราชินี) ราชินีชอบฝน R คือ Rain (ฝน) S คือ Sun (ดวงอาทิตย์)',
    image_prompt: 'Colorful scene with an orange, a queen in pink dress, rain clouds and sunshine, O P Q R S letter labels, cartoon style',
    quiz: [
      {
        question: 'Orange แปลว่าอะไร?',
        options: ['แอปเปิล', 'กล้วย', 'ส้ม', 'องุ่น'],
        correctIndex: 2,
        explanation: 'Orange แปลว่า ส้ม ซึ่งเป็นผลไม้',
      },
      {
        question: 'Queen แปลว่าอะไร?',
        options: ['กษัตริย์', 'ราชินี', 'เจ้าชาย', 'เจ้าหญิง'],
        correctIndex: 1,
        explanation: 'Queen แปลว่า ราชินี',
      },
      {
        question: 'ตัวอักษร S อ่านว่าอะไร?',
        options: ['อาร์', 'เอส', 'ที', 'คิว'],
        correctIndex: 1,
        explanation: 'ตัวอักษร S อ่านว่า "เอส" เหมือนใน Sun',
      },
      {
        question: 'Sun แปลว่าอะไร?',
        options: ['ดวงจันทร์', 'ดาว', 'เมฆ', 'ดวงอาทิตย์'],
        correctIndex: 3,
        explanation: 'Sun แปลว่า ดวงอาทิตย์',
      },
    ],
  },

  // ==========================================
  // Lesson 6: Letters T, U, V, W, X, Y, Z
  // ==========================================
  {
    module_id: 'core-pre-alphabet',
    lesson_order: 6,
    level: 0,
    topic: 'Letters T, U, V, W, X, Y, Z',
    title: 'Tiger, Umbrella, Van, Water, X-ray, Yellow, Zoo',
    title_thai: 'เสือ ร่ม รถตู้ น้ำ เอกซเรย์ สีเหลือง สวนสัตว์',
    vocabulary: [
      { word: 'tiger', phonetic: 'ไทเกอร์', meaning: 'เสือโคร่ง', partOfSpeech: 'n.' },
      { word: 'umbrella', phonetic: 'อัมเบรลลา', meaning: 'ร่ม', partOfSpeech: 'n.' },
      { word: 'van', phonetic: 'แวน', meaning: 'รถตู้', partOfSpeech: 'n.' },
      { word: 'water', phonetic: 'วอเตอร์', meaning: 'น้ำ', partOfSpeech: 'n.' },
      { word: 'yellow', phonetic: 'เยลโลว์', meaning: 'สีเหลือง', partOfSpeech: 'n.' },
      { word: 'zoo', phonetic: 'ซู', meaning: 'สวนสัตว์', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'T', thai: 'ที' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Tiger.', thai: 'ไทเกอร์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'tiger', thai: 'ไทเกอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'yellow.', thai: 'เยลโลว์' },
      ],
      [
        { english: 'W', thai: 'ดับเบิลยู' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Water.', thai: 'วอเตอร์' },
      ],
      [
        { english: 'Z', thai: 'ซี' },
        { english: 'is', thai: 'อิส' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Zoo.', thai: 'ซู' },
      ],
    ],
    article_translation:
      'T คือ Tiger (เสือโคร่ง) เสือโคร่งสีเหลือง W คือ Water (น้ำ) Z คือ Zoo (สวนสัตว์)',
    image_prompt: 'Yellow tiger at a zoo in the rain holding an umbrella, a van nearby, T U V W X Y Z letter cards, fun cartoon style',
    quiz: [
      {
        question: 'Tiger แปลว่าอะไร?',
        options: ['สิงโต', 'เสือโคร่ง', 'หมี', 'ช้าง'],
        correctIndex: 1,
        explanation: 'Tiger แปลว่า เสือโคร่ง',
      },
      {
        question: 'ตัวอักษร W อ่านว่าอะไร?',
        options: ['วี', 'ดับเบิลยู', 'เอกซ์', 'วาย'],
        correctIndex: 1,
        explanation: 'ตัวอักษร W อ่านว่า "ดับเบิลยู" เหมือนใน Water',
      },
      {
        question: 'Zoo แปลว่าอะไร?',
        options: ['สวนสาธารณะ', 'โรงเรียน', 'สวนสัตว์', 'โรงพยาบาล'],
        correctIndex: 2,
        explanation: 'Zoo แปลว่า สวนสัตว์',
      },
      {
        question: 'Yellow แปลว่าสีอะไร?',
        options: ['สีแดง', 'สีน้ำเงิน', 'สีเขียว', 'สีเหลือง'],
        correctIndex: 3,
        explanation: 'Yellow แปลว่า สีเหลือง',
      },
    ],
  },
];
