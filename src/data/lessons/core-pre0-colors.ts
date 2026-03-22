import { LessonSeedData } from './core-a1-greetings';

export const corePreColorsLessons: LessonSeedData[] = [
  // ==========================================
  // Lesson 1: Red, Blue, Yellow (Primary Colors)
  // ==========================================
  {
    module_id: 'core-pre-colors',
    lesson_order: 1,
    level: 0,
    topic: 'Primary Colors',
    title: 'Red, Blue, Yellow',
    title_thai: 'แดง น้ำเงิน เหลือง',
    vocabulary: [
      { word: 'red', phonetic: 'เรด', meaning: 'สีแดง', partOfSpeech: 'n.' },
      { word: 'blue', phonetic: 'บลู', meaning: 'สีน้ำเงิน', partOfSpeech: 'n.' },
      { word: 'yellow', phonetic: 'เยลโลว์', meaning: 'สีเหลือง', partOfSpeech: 'n.' },
      { word: 'color', phonetic: 'คัลเลอร์', meaning: 'สี', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'Red', thai: 'เรด' },
        { english: 'is', thai: 'อิส' },
        { english: 'a', thai: 'อะ' },
        { english: 'color.', thai: 'คัลเลอร์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'apple', thai: 'แอปเปิล' },
        { english: 'is', thai: 'อิส' },
        { english: 'red.', thai: 'เรด' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'sky', thai: 'สกาย' },
        { english: 'is', thai: 'อิส' },
        { english: 'blue.', thai: 'บลู' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'sun', thai: 'ซัน' },
        { english: 'is', thai: 'อิส' },
        { english: 'yellow.', thai: 'เยลโลว์' },
      ],
    ],
    article_translation:
      'สีแดงเป็นสี แอปเปิลสีแดง ท้องฟ้าสีน้ำเงิน ดวงอาทิตย์สีเหลือง',
    image_prompt: 'A red apple, blue sky, and yellow sun together, primary colors labeled in English, bright and cheerful cartoon art',
    quiz: [
      {
        question: 'สีแดงในภาษาอังกฤษคือ?',
        options: ['blue', 'red', 'yellow', 'green'],
        correctIndex: 1,
        explanation: 'สีแดงในภาษาอังกฤษคือ red',
      },
      {
        question: 'blue แปลว่าสีอะไร?',
        options: ['สีแดง', 'สีเหลือง', 'สีน้ำเงิน', 'สีเขียว'],
        correctIndex: 2,
        explanation: 'blue แปลว่า สีน้ำเงิน',
      },
      {
        question: 'ท้องฟ้าสีอะไร?',
        options: ['red', 'yellow', 'blue', 'green'],
        correctIndex: 2,
        explanation: 'ท้องฟ้าสีน้ำเงิน ในภาษาอังกฤษคือ blue',
      },
      {
        question: 'yellow แปลว่าสีอะไร?',
        options: ['สีแดง', 'สีน้ำเงิน', 'สีเขียว', 'สีเหลือง'],
        correctIndex: 3,
        explanation: 'yellow แปลว่า สีเหลือง',
      },
    ],
  },

  // ==========================================
  // Lesson 2: Green, Orange, Purple (Secondary Colors)
  // ==========================================
  {
    module_id: 'core-pre-colors',
    lesson_order: 2,
    level: 0,
    topic: 'Secondary Colors',
    title: 'Green, Orange, Purple',
    title_thai: 'เขียว ส้ม ม่วง',
    vocabulary: [
      { word: 'green', phonetic: 'กรีน', meaning: 'สีเขียว', partOfSpeech: 'n.' },
      { word: 'orange', phonetic: 'ออเรนจ์', meaning: 'สีส้ม', partOfSpeech: 'n.' },
      { word: 'purple', phonetic: 'เพอร์เพิล', meaning: 'สีม่วง', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'grass', thai: 'กราส' },
        { english: 'is', thai: 'อิส' },
        { english: 'green.', thai: 'กรีน' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'orange', thai: 'ออเรนจ์' },
        { english: 'is', thai: 'อิส' },
        { english: 'orange.', thai: 'ออเรนจ์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'likes', thai: 'ไลคส์' },
        { english: 'purple.', thai: 'เพอร์เพิล' },
      ],
      [
        { english: 'Green,', thai: 'กรีน,' },
        { english: 'orange,', thai: 'ออเรนจ์,' },
        { english: 'purple!', thai: 'เพอร์เพิล!' },
      ],
    ],
    article_translation:
      'หญ้าสีเขียว ส้มสีส้ม เธอชอบสีม่วง เขียว ส้ม ม่วง!',
    image_prompt: 'Green grass, an orange fruit, and a purple flower arranged together with color labels in English, colorful cartoon',
    quiz: [
      {
        question: 'สีเขียวในภาษาอังกฤษคือ?',
        options: ['orange', 'purple', 'green', 'red'],
        correctIndex: 2,
        explanation: 'สีเขียวในภาษาอังกฤษคือ green',
      },
      {
        question: 'หญ้าสีอะไร?',
        options: ['orange', 'green', 'purple', 'blue'],
        correctIndex: 1,
        explanation: 'หญ้าสีเขียว ในภาษาอังกฤษคือ green',
      },
      {
        question: 'purple แปลว่าสีอะไร?',
        options: ['สีส้ม', 'สีเขียว', 'สีม่วง', 'สีชมพู'],
        correctIndex: 2,
        explanation: 'purple แปลว่า สีม่วง',
      },
      {
        question: 'orange แปลว่าสีอะไร?',
        options: ['สีแดง', 'สีเหลือง', 'สีส้ม', 'สีน้ำตาล'],
        correctIndex: 2,
        explanation: 'orange แปลว่า สีส้ม',
      },
    ],
  },

  // ==========================================
  // Lesson 3: White, Black, Pink, Brown
  // ==========================================
  {
    module_id: 'core-pre-colors',
    lesson_order: 3,
    level: 0,
    topic: 'More Colors',
    title: 'White, Black, Pink, Brown',
    title_thai: 'ขาว ดำ ชมพู น้ำตาล',
    vocabulary: [
      { word: 'white', phonetic: 'ไวท์', meaning: 'สีขาว', partOfSpeech: 'n.' },
      { word: 'black', phonetic: 'แบล็ค', meaning: 'สีดำ', partOfSpeech: 'n.' },
      { word: 'pink', phonetic: 'พิงค์', meaning: 'สีชมพู', partOfSpeech: 'n.' },
      { word: 'brown', phonetic: 'บราวน์', meaning: 'สีน้ำตาล', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'cloud', thai: 'คลาวด์' },
        { english: 'is', thai: 'อิส' },
        { english: 'white.', thai: 'ไวท์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'cat', thai: 'แคท' },
        { english: 'is', thai: 'อิส' },
        { english: 'black.', thai: 'แบล็ค' },
      ],
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'shirt', thai: 'เชิ้ต' },
        { english: 'is', thai: 'อิส' },
        { english: 'pink.', thai: 'พิงค์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'dog', thai: 'ด็อก' },
        { english: 'is', thai: 'อิส' },
        { english: 'brown.', thai: 'บราวน์' },
      ],
    ],
    article_translation:
      'เมฆสีขาว แมวสีดำ เสื้อของเธอสีชมพู หมาสีน้ำตาล',
    image_prompt: 'White cloud, black cat, pink shirt on a hanger, and brown dog, color labels in English, bright cartoon illustration',
    quiz: [
      {
        question: 'สีดำในภาษาอังกฤษคือ?',
        options: ['white', 'black', 'pink', 'brown'],
        correctIndex: 1,
        explanation: 'สีดำในภาษาอังกฤษคือ black',
      },
      {
        question: 'white แปลว่าสีอะไร?',
        options: ['สีขาว', 'สีดำ', 'สีชมพู', 'สีน้ำตาล'],
        correctIndex: 0,
        explanation: 'white แปลว่า สีขาว',
      },
      {
        question: 'pink แปลว่าสีอะไร?',
        options: ['สีน้ำตาล', 'สีขาว', 'สีชมพู', 'สีดำ'],
        correctIndex: 2,
        explanation: 'pink แปลว่า สีชมพู',
      },
      {
        question: 'เมฆสีอะไร?',
        options: ['black', 'brown', 'pink', 'white'],
        correctIndex: 3,
        explanation: 'เมฆสีขาว ในภาษาอังกฤษคือ white',
      },
    ],
  },

  // ==========================================
  // Lesson 4: Colors in Nature
  // ==========================================
  {
    module_id: 'core-pre-colors',
    lesson_order: 4,
    level: 0,
    topic: 'Colors in Nature',
    title: 'Colors Around Us',
    title_thai: 'สีในธรรมชาติ',
    vocabulary: [
      { word: 'sky', phonetic: 'สกาย', meaning: 'ท้องฟ้า', partOfSpeech: 'n.' },
      { word: 'grass', phonetic: 'กราส', meaning: 'หญ้า', partOfSpeech: 'n.' },
      { word: 'flower', phonetic: 'ฟลาวเวอร์', meaning: 'ดอกไม้', partOfSpeech: 'n.' },
      { word: 'tree', phonetic: 'ทรี', meaning: 'ต้นไม้', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'sky', thai: 'สกาย' },
        { english: 'is', thai: 'อิส' },
        { english: 'blue.', thai: 'บลู' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'grass', thai: 'กราส' },
        { english: 'is', thai: 'อิส' },
        { english: 'green.', thai: 'กรีน' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'flower', thai: 'ฟลาวเวอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'red.', thai: 'เรด' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'tree', thai: 'ทรี' },
        { english: 'is', thai: 'อิส' },
        { english: 'brown.', thai: 'บราวน์' },
      ],
    ],
    article_translation:
      'ท้องฟ้าสีน้ำเงิน หญ้าสีเขียว ดอกไม้สีแดง ต้นไม้สีน้ำตาล',
    image_prompt: 'Outdoor nature scene in Thailand with blue sky, green grass, red flower, and brown tree trunk, cartoon watercolor style',
    quiz: [
      {
        question: '"The sky is blue." หมายความว่าอะไร?',
        options: ['หญ้าสีเขียว', 'ท้องฟ้าสีน้ำเงิน', 'ดอกไม้สีแดง', 'ต้นไม้สีน้ำตาล'],
        correctIndex: 1,
        explanation: 'sky แปลว่า ท้องฟ้า และ blue แปลว่า สีน้ำเงิน',
      },
      {
        question: 'grass แปลว่าอะไร?',
        options: ['ดอกไม้', 'ต้นไม้', 'หญ้า', 'ท้องฟ้า'],
        correctIndex: 2,
        explanation: 'grass แปลว่า หญ้า',
      },
      {
        question: 'ดอกไม้มักจะเป็นสีอะไรในประโยคนี้?',
        options: ['blue', 'green', 'red', 'brown'],
        correctIndex: 2,
        explanation: 'ดอกไม้สีแดง ในภาษาอังกฤษคือ red',
      },
      {
        question: 'tree แปลว่าอะไร?',
        options: ['หญ้า', 'ดอกไม้', 'ต้นไม้', 'ท้องฟ้า'],
        correctIndex: 2,
        explanation: 'tree แปลว่า ต้นไม้',
      },
    ],
  },

  // ==========================================
  // Lesson 5: My Favorite Color
  // ==========================================
  {
    module_id: 'core-pre-colors',
    lesson_order: 5,
    level: 0,
    topic: 'My Favorite Color',
    title: 'What Is Your Favorite Color?',
    title_thai: 'สีโปรดของคุณคืออะไร?',
    vocabulary: [
      { word: 'favorite', phonetic: 'เฟเวอริท', meaning: 'โปรด / ชอบที่สุด', partOfSpeech: 'adj.' },
      { word: 'my', phonetic: 'มาย', meaning: 'ของฉัน', partOfSpeech: 'pron.' },
      { word: 'your', phonetic: 'ยัวร์', meaning: 'ของคุณ', partOfSpeech: 'pron.' },
      { word: 'is', phonetic: 'อิส', meaning: 'คือ / เป็น', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'What', thai: 'วอท' },
        { english: 'is', thai: 'อิส' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'favorite', thai: 'เฟเวอริท' },
        { english: 'color?', thai: 'คัลเลอร์?' },
      ],
      [
        { english: 'My', thai: 'มาย' },
        { english: 'favorite', thai: 'เฟเวอริท' },
        { english: 'color', thai: 'คัลเลอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'blue.', thai: 'บลู' },
      ],
      [
        { english: 'Noi', thai: 'น้อย' },
        { english: 'likes', thai: 'ไลคส์' },
        { english: 'pink.', thai: 'พิงค์' },
      ],
      [
        { english: 'Chai', thai: 'ชาย' },
        { english: 'likes', thai: 'ไลคส์' },
        { english: 'green.', thai: 'กรีน' },
      ],
    ],
    article_translation:
      'สีโปรดของคุณคืออะไร? สีโปรดของฉันคือสีน้ำเงิน น้อยชอบสีชมพู ชายชอบสีเขียว',
    image_prompt: 'Two Thai children Noi and Chai each holding their favorite color paint, asking about favorite colors, playful cartoon',
    quiz: [
      {
        question: '"My favorite color is red." หมายความว่าอะไร?',
        options: ['สีโปรดของคุณคือสีแดง', 'สีโปรดของฉันคือสีแดง', 'ฉันไม่ชอบสีแดง', 'สีแดงสวยมาก'],
        correctIndex: 1,
        explanation: 'my แปลว่า ของฉัน ดังนั้นประโยคนี้แปลว่า สีโปรดของฉันคือสีแดง',
      },
      {
        question: 'favorite แปลว่าอะไร?',
        options: ['ไม่ชอบ', 'โปรด / ชอบที่สุด', 'สี', 'สวย'],
        correctIndex: 1,
        explanation: 'favorite แปลว่า โปรด หรือ ชอบที่สุด',
      },
      {
        question: 'ถ้าจะถามว่า "สีโปรดของคุณคืออะไร?" ภาษาอังกฤษพูดว่าอย่างไร?',
        options: ['What is your name?', 'What is your favorite color?', 'How are you?', 'Where are you?'],
        correctIndex: 1,
        explanation: '"What is your favorite color?" แปลว่า สีโปรดของคุณคืออะไร?',
      },
      {
        question: 'your แปลว่าอะไร?',
        options: ['ของฉัน', 'ของเขา', 'ของคุณ', 'ของเรา'],
        correctIndex: 2,
        explanation: 'your แปลว่า ของคุณ',
      },
    ],
  },
];
