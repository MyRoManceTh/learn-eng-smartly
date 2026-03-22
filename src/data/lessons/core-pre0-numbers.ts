import { LessonSeedData } from './core-a1-greetings';

export const corePreNumbersLessons: LessonSeedData[] = [
  // ==========================================
  // Lesson 1: Numbers 1, 2, 3
  // ==========================================
  {
    module_id: 'core-pre-numbers',
    lesson_order: 1,
    level: 0,
    topic: 'Numbers 1, 2, 3',
    title: 'One, Two, Three',
    title_thai: 'หนึ่ง สอง สาม',
    vocabulary: [
      { word: 'one', phonetic: 'วัน', meaning: 'หนึ่ง (1)', partOfSpeech: 'n.' },
      { word: 'two', phonetic: 'ทู', meaning: 'สอง (2)', partOfSpeech: 'n.' },
      { word: 'three', phonetic: 'ธรี', meaning: 'สาม (3)', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'one', thai: 'วัน' },
        { english: 'cat.', thai: 'แคท' },
      ],
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'two', thai: 'ทู' },
        { english: 'dogs.', thai: 'ด็อกส์' },
      ],
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'three', thai: 'ธรี' },
        { english: 'apples.', thai: 'แอปเปิลส์' },
      ],
      [
        { english: 'One,', thai: 'วัน,' },
        { english: 'two,', thai: 'ทู,' },
        { english: 'three!', thai: 'ธรี!' },
      ],
    ],
    article_translation:
      'ฉันมีแมวหนึ่งตัว ฉันมีหมาสองตัว ฉันมีแอปเปิลสามลูก หนึ่ง สอง สาม!',
    image_prompt: 'One cat, two dogs, and three apples arranged neatly with number labels 1 2 3, bright cartoon illustration for beginners',
    quiz: [
      {
        question: 'one แปลว่าอะไร?',
        options: ['สอง', 'สาม', 'หนึ่ง', 'สี่'],
        correctIndex: 2,
        explanation: 'one แปลว่า หนึ่ง (1)',
      },
      {
        question: 'สองในภาษาอังกฤษคือ?',
        options: ['one', 'two', 'three', 'four'],
        correctIndex: 1,
        explanation: 'สองในภาษาอังกฤษคือ two',
      },
      {
        question: 'three แปลว่าเลขอะไร?',
        options: ['1', '2', '3', '4'],
        correctIndex: 2,
        explanation: 'three แปลว่า สาม ซึ่งเป็นเลข 3',
      },
      {
        question: '"I have two cats." หมายความว่าอะไร?',
        options: ['ฉันมีแมวหนึ่งตัว', 'ฉันมีแมวสองตัว', 'ฉันมีแมวสามตัว', 'ฉันไม่มีแมว'],
        correctIndex: 1,
        explanation: 'two แปลว่า สอง ดังนั้น "I have two cats" แปลว่า ฉันมีแมวสองตัว',
      },
    ],
  },

  // ==========================================
  // Lesson 2: Numbers 4, 5, 6
  // ==========================================
  {
    module_id: 'core-pre-numbers',
    lesson_order: 2,
    level: 0,
    topic: 'Numbers 4, 5, 6',
    title: 'Four, Five, Six',
    title_thai: 'สี่ ห้า หก',
    vocabulary: [
      { word: 'four', phonetic: 'ฟอร์', meaning: 'สี่ (4)', partOfSpeech: 'n.' },
      { word: 'five', phonetic: 'ไฟว์', meaning: 'ห้า (5)', partOfSpeech: 'n.' },
      { word: 'six', phonetic: 'ซิกซ์', meaning: 'หก (6)', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'four', thai: 'ฟอร์' },
        { english: 'books.', thai: 'บุ๊คส์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'has', thai: 'แฮส' },
        { english: 'five', thai: 'ไฟว์' },
        { english: 'fish.', thai: 'ฟิช' },
      ],
      [
        { english: 'We', thai: 'วี' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'six', thai: 'ซิกซ์' },
        { english: 'chairs.', thai: 'แชร์ส์' },
      ],
      [
        { english: 'Four,', thai: 'ฟอร์,' },
        { english: 'five,', thai: 'ไฟว์,' },
        { english: 'six!', thai: 'ซิกซ์!' },
      ],
    ],
    article_translation:
      'ฉันมีหนังสือสี่เล่ม เธอมีปลาห้าตัว เรามีเก้าอี้หกตัว สี่ ห้า หก!',
    image_prompt: 'Four books, five fish in a bowl, and six chairs arranged with number labels 4 5 6, cheerful cartoon classroom scene',
    quiz: [
      {
        question: 'four แปลว่าอะไร?',
        options: ['สาม', 'สี่', 'ห้า', 'หก'],
        correctIndex: 1,
        explanation: 'four แปลว่า สี่ (4)',
      },
      {
        question: 'ห้าในภาษาอังกฤษคือ?',
        options: ['four', 'five', 'six', 'seven'],
        correctIndex: 1,
        explanation: 'ห้าในภาษาอังกฤษคือ five',
      },
      {
        question: 'six แปลว่าเลขอะไร?',
        options: ['4', '5', '6', '7'],
        correctIndex: 2,
        explanation: 'six แปลว่า หก ซึ่งเป็นเลข 6',
      },
      {
        question: '"She has five bags." หมายความว่าอะไร?',
        options: ['เธอมีกระเป๋าสี่ใบ', 'เธอมีกระเป๋าห้าใบ', 'เธอมีกระเป๋าหกใบ', 'เธอไม่มีกระเป๋า'],
        correctIndex: 1,
        explanation: 'five แปลว่า ห้า ดังนั้น "She has five bags" แปลว่า เธอมีกระเป๋าห้าใบ',
      },
    ],
  },

  // ==========================================
  // Lesson 3: Numbers 7, 8, 9, 10
  // ==========================================
  {
    module_id: 'core-pre-numbers',
    lesson_order: 3,
    level: 0,
    topic: 'Numbers 7, 8, 9, 10',
    title: 'Seven, Eight, Nine, Ten',
    title_thai: 'เจ็ด แปด เก้า สิบ',
    vocabulary: [
      { word: 'seven', phonetic: 'เซเวน', meaning: 'เจ็ด (7)', partOfSpeech: 'n.' },
      { word: 'eight', phonetic: 'เอท', meaning: 'แปด (8)', partOfSpeech: 'n.' },
      { word: 'nine', phonetic: 'ไนน์', meaning: 'เก้า (9)', partOfSpeech: 'n.' },
      { word: 'ten', phonetic: 'เทน', meaning: 'สิบ (10)', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'see', thai: 'ซี' },
        { english: 'seven', thai: 'เซเวน' },
        { english: 'stars.', thai: 'สตาร์ส์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'has', thai: 'แฮส' },
        { english: 'eight', thai: 'เอท' },
        { english: 'pens.', thai: 'เพนส์' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'is', thai: 'อิส' },
        { english: 'nine', thai: 'ไนน์' },
        { english: 'years old.', thai: 'เยียร์ส โอลด์' },
      ],
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'can', thai: 'แคน' },
        { english: 'count', thai: 'เคาท์' },
        { english: 'to ten!', thai: 'ทู เทน!' },
      ],
    ],
    article_translation:
      'ฉันเห็นดาวเจ็ดดวง เธอมีปากกาแปดแท่ง เขาอายุเก้าขวบ ฉันนับได้ถึงสิบ!',
    image_prompt: 'Seven stars in the sky, eight colored pencils, a child aged nine holding ten balloons, cartoon number learning scene',
    quiz: [
      {
        question: 'seven แปลว่าอะไร?',
        options: ['หก', 'เจ็ด', 'แปด', 'เก้า'],
        correctIndex: 1,
        explanation: 'seven แปลว่า เจ็ด (7)',
      },
      {
        question: 'แปดในภาษาอังกฤษคือ?',
        options: ['seven', 'eight', 'nine', 'ten'],
        correctIndex: 1,
        explanation: 'แปดในภาษาอังกฤษคือ eight',
      },
      {
        question: 'ten แปลว่าเลขอะไร?',
        options: ['7', '8', '9', '10'],
        correctIndex: 3,
        explanation: 'ten แปลว่า สิบ ซึ่งเป็นเลข 10',
      },
      {
        question: 'nine แปลว่าอะไร?',
        options: ['เจ็ด', 'แปด', 'เก้า', 'สิบ'],
        correctIndex: 2,
        explanation: 'nine แปลว่า เก้า (9)',
      },
    ],
  },

  // ==========================================
  // Lesson 4: Zero and Counting
  // ==========================================
  {
    module_id: 'core-pre-numbers',
    lesson_order: 4,
    level: 0,
    topic: 'Zero and Counting',
    title: 'Zero to Ten',
    title_thai: 'ศูนย์ถึงสิบ',
    vocabulary: [
      { word: 'zero', phonetic: 'เซียโร', meaning: 'ศูนย์ (0)', partOfSpeech: 'n.' },
      { word: 'count', phonetic: 'เคาท์', meaning: 'นับ', partOfSpeech: 'v.' },
      { word: 'number', phonetic: 'นัมเบอร์', meaning: 'ตัวเลข', partOfSpeech: 'n.' },
      { word: 'again', phonetic: 'อะเกน', meaning: 'อีกครั้ง', partOfSpeech: 'adv.' },
    ],
    article_sentences: [
      [
        { english: 'Zero', thai: 'เซียโร' },
        { english: 'is', thai: 'อิส' },
        { english: 'nothing.', thai: 'นัธธิง' },
      ],
      [
        { english: 'Let\'s', thai: 'เล็ทส์' },
        { english: 'count!', thai: 'เคาท์!' },
      ],
      [
        { english: 'Zero,', thai: 'เซียโร,' },
        { english: 'one,', thai: 'วัน,' },
        { english: 'two,', thai: 'ทู,' },
        { english: 'three.', thai: 'ธรี' },
      ],
      [
        { english: 'Four,', thai: 'ฟอร์,' },
        { english: 'five,', thai: 'ไฟว์,' },
        { english: 'six,', thai: 'ซิกซ์,' },
        { english: 'seven.', thai: 'เซเวน' },
      ],
      [
        { english: 'Eight,', thai: 'เอท,' },
        { english: 'nine,', thai: 'ไนน์,' },
        { english: 'ten!', thai: 'เทน!' },
      ],
    ],
    article_translation:
      'ศูนย์คือไม่มีอะไร มาน้บกันเถอะ! ศูนย์ หนึ่ง สอง สาม สี่ ห้า หก เจ็ด แปด เก้า สิบ!',
    image_prompt: 'Number line from 0 to 10 with colorful cartoon animals standing on each number, bright and playful style',
    quiz: [
      {
        question: 'zero แปลว่าอะไร?',
        options: ['หนึ่ง', 'สอง', 'ศูนย์', 'สาม'],
        correctIndex: 2,
        explanation: 'zero แปลว่า ศูนย์ (0)',
      },
      {
        question: 'หลังจาก nine มาเลขอะไร?',
        options: ['eight', 'ten', 'eleven', 'seven'],
        correctIndex: 1,
        explanation: 'หลังจาก nine (เก้า) มา ten (สิบ)',
      },
      {
        question: 'count แปลว่าอะไร?',
        options: ['นับ', 'วาด', 'อ่าน', 'เขียน'],
        correctIndex: 0,
        explanation: 'count แปลว่า นับ',
      },
      {
        question: 'เลขใดที่อยู่ระหว่าง seven และ nine?',
        options: ['six', 'ten', 'eight', 'five'],
        correctIndex: 2,
        explanation: 'eight (แปด) อยู่ระหว่าง seven (เจ็ด) และ nine (เก้า)',
      },
    ],
  },

  // ==========================================
  // Lesson 5: Numbers in Daily Life
  // ==========================================
  {
    module_id: 'core-pre-numbers',
    lesson_order: 5,
    level: 0,
    topic: 'Numbers in Daily Life',
    title: 'Age, Phone, Time',
    title_thai: 'อายุ เบอร์โทร เวลา',
    vocabulary: [
      { word: 'age', phonetic: 'เอจ', meaning: 'อายุ', partOfSpeech: 'n.' },
      { word: 'phone', phonetic: 'โฟน', meaning: 'โทรศัพท์', partOfSpeech: 'n.' },
      { word: 'time', phonetic: 'ไทม์', meaning: 'เวลา', partOfSpeech: 'n.' },
      { word: 'year', phonetic: 'เยียร์', meaning: 'ปี', partOfSpeech: 'n.' },
      { word: 'old', phonetic: 'โอลด์', meaning: 'อายุ... ปี', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'is', thai: 'อิส' },
        { english: 'ten', thai: 'เทน' },
        { english: 'years old.', thai: 'เยียร์ส โอลด์' },
      ],
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'phone', thai: 'โฟน' },
        { english: 'number', thai: 'นัมเบอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'two', thai: 'ทู' },
        { english: 'three.', thai: 'ธรี' },
      ],
      [
        { english: 'It', thai: 'อิท' },
        { english: 'is', thai: 'อิส' },
        { english: 'nine', thai: 'ไนน์' },
        { english: "o'clock.", thai: "โอ'คล็อก" },
      ],
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'eight', thai: 'เอท' },
        { english: 'years old.', thai: 'เยียร์ส โอลด์' },
      ],
    ],
    article_translation:
      'ส้มอายุสิบขวบ เบอร์โทรของเธอคือสอง สาม ตอนนี้เก้าโมง ฉันอายุแปดขวบ',
    image_prompt: 'A Thai child showing their age on fingers, a phone with number display, a clock showing 9 o\'clock, colorful cartoon',
    quiz: [
      {
        question: '"I am six years old." หมายความว่าอะไร?',
        options: ['ฉันอายุห้าขวบ', 'ฉันอายุหกขวบ', 'ฉันอายุเจ็ดขวบ', 'ฉันอายุแปดขวบ'],
        correctIndex: 1,
        explanation: 'six years old แปลว่า อายุหกขวบ',
      },
      {
        question: 'age แปลว่าอะไร?',
        options: ['ชื่อ', 'อายุ', 'เวลา', 'เลขที่'],
        correctIndex: 1,
        explanation: 'age แปลว่า อายุ',
      },
      {
        question: '"It is ten o\'clock." หมายความว่าอะไร?',
        options: ['เก้าโมง', 'สิบโมง', 'สิบเอ็ดโมง', 'แปดโมง'],
        correctIndex: 1,
        explanation: 'ten o\'clock แปลว่า สิบโมง',
      },
      {
        question: 'ตัวเลขในภาษาอังกฤษเรียกว่าอะไร?',
        options: ['letter', 'number', 'word', 'color'],
        correctIndex: 1,
        explanation: 'ตัวเลขในภาษาอังกฤษเรียกว่า number',
      },
    ],
  },
];
