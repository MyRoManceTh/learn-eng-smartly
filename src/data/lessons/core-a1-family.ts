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

export const coreA1FamilyLessons: LessonSeedData[] = [
  // ─────────────────────────────────────────────
  // Lesson 1: My Family Members (สมาชิกในครอบครัว)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-family',
    lesson_order: 1,
    level: 1,
    topic: 'family-members',
    title: 'My Family Members',
    title_thai: 'สมาชิกในครอบครัว',
    vocabulary: [
      { word: 'family', phonetic: 'แฟมิลี', meaning: 'ครอบครัว', partOfSpeech: 'n.' },
      { word: 'mother', phonetic: 'มาเธอร์', meaning: 'แม่', partOfSpeech: 'n.' },
      { word: 'father', phonetic: 'ฟาเธอร์', meaning: 'พ่อ', partOfSpeech: 'n.' },
      { word: 'sister', phonetic: 'ซิสเตอร์', meaning: 'พี่/น้องสาว', partOfSpeech: 'n.' },
      { word: 'brother', phonetic: 'บราเธอร์', meaning: 'พี่/น้องชาย', partOfSpeech: 'n.' },
      { word: 'grandmother', phonetic: 'แกรนด์มาเธอร์', meaning: 'ยาย/ย่า', partOfSpeech: 'n.' },
      { word: 'love', phonetic: 'เลิฟ', meaning: 'รัก', partOfSpeech: 'v.' },
      { word: 'live', phonetic: 'ลิฟว์', meaning: 'อาศัยอยู่', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      // Ploy has a big family.
      [
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'has', thai: 'แฮส' },
        { english: 'a', thai: 'อะ' },
        { english: 'big', thai: 'บิก' },
        { english: 'family.', thai: 'แฟมิลี' },
      ],
      // Her mother is Khun Nid.
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'mother', thai: 'มาเธอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'Khun', thai: 'คุณ' },
        { english: 'Nid.', thai: 'นิด' },
      ],
      // Her father is Khun Somchai.
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'father', thai: 'ฟาเธอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'Khun', thai: 'คุณ' },
        { english: 'Somchai.', thai: 'สมชาย' },
      ],
      // She has one sister and one brother.
      [
        { english: 'She', thai: 'ชี' },
        { english: 'has', thai: 'แฮส' },
        { english: 'one', thai: 'วัน' },
        { english: 'sister', thai: 'ซิสเตอร์' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'one', thai: 'วัน' },
        { english: 'brother.', thai: 'บราเธอร์' },
      ],
      // Her grandmother lives with them.
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'grandmother', thai: 'แกรนด์มาเธอร์' },
        { english: 'lives', thai: 'ลิฟว์ส' },
        { english: 'with', thai: 'วิธ' },
        { english: 'them.', thai: 'เธม' },
      ],
      // Ploy loves her family very much.
      [
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'loves', thai: 'เลิฟส์' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'family', thai: 'แฟมิลี' },
        { english: 'very', thai: 'เวรี' },
        { english: 'much.', thai: 'มัช' },
      ],
    ],
    article_translation:
      'พลอยมีครอบครัวใหญ่ แม่ของเธอคือคุณนิด พ่อของเธอคือคุณสมชาย เธอมีพี่สาวหนึ่งคนและน้องชายหนึ่งคน ยายของเธออาศัยอยู่ด้วยกัน พลอยรักครอบครัวของเธอมาก',
    image_prompt: 'Thai family portrait with grandmother, parents, and three children in a warm living room',
    quiz: [
      {
        question: "คำว่า 'mother' แปลว่าอะไร?",
        options: ['พี่สาว', 'แม่', 'ยาย', 'ป้า'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'brother' หมายถึงอะไร?",
        options: ['พี่/น้องสาว', 'ลุง', 'พ่อ', 'พี่/น้องชาย'],
        correctIndex: 3,
        type: 'vocab',
      },
      {
        question: 'ครอบครัวของพลอยมีพี่น้องกี่คน?',
        options: ['1 คน', '2 คน', '3 คน', '4 คน'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ใครอาศัยอยู่กับครอบครัวพลอยด้วย?',
        options: ['ลุง', 'ป้า', 'ยาย', 'เพื่อน'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 2: Describing People (การบรรยายคน)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-family',
    lesson_order: 2,
    level: 1,
    topic: 'describing-people',
    title: 'Describing People',
    title_thai: 'การบรรยายคน',
    vocabulary: [
      { word: 'tall', phonetic: 'ทอลล์', meaning: 'สูง', partOfSpeech: 'adj.' },
      { word: 'short', phonetic: 'ชอร์ท', meaning: 'เตี้ย', partOfSpeech: 'adj.' },
      { word: 'hair', phonetic: 'แฮร์', meaning: 'ผม', partOfSpeech: 'n.' },
      { word: 'eyes', phonetic: 'อายส์', meaning: 'ดวงตา', partOfSpeech: 'n.' },
      { word: 'kind', phonetic: 'ไคนด์', meaning: 'ใจดี', partOfSpeech: 'adj.' },
      { word: 'funny', phonetic: 'ฟันนี', meaning: 'ตลก', partOfSpeech: 'adj.' },
      { word: 'look like', phonetic: 'ลุค-ไลค์', meaning: 'หน้าตาเหมือน', partOfSpeech: 'phr.' },
      { word: 'beautiful', phonetic: 'บิวทิฟูล', meaning: 'สวย', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      // Aom wants to describe her family.
      [
        { english: 'Aom', thai: 'ออม' },
        { english: 'wants', thai: 'วอนท์ส' },
        { english: 'to', thai: 'ทู' },
        { english: 'describe', thai: 'ดิสไครบ์' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'family.', thai: 'แฟมิลี' },
      ],
      // Her father is tall and kind.
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'father', thai: 'ฟาเธอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'tall', thai: 'ทอลล์' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'kind.', thai: 'ไคนด์' },
      ],
      // Her mother has long, beautiful hair.
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'mother', thai: 'มาเธอร์' },
        { english: 'has', thai: 'แฮส' },
        { english: 'long,', thai: 'ลอง' },
        { english: 'beautiful', thai: 'บิวทิฟูล' },
        { english: 'hair.', thai: 'แฮร์' },
      ],
      // Her brother is short and funny.
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'brother', thai: 'บราเธอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'short', thai: 'ชอร์ท' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'funny.', thai: 'ฟันนี' },
      ],
      // Aom has big eyes.
      [
        { english: 'Aom', thai: 'ออม' },
        { english: 'has', thai: 'แฮส' },
        { english: 'big', thai: 'บิก' },
        { english: 'eyes.', thai: 'อายส์' },
      ],
      // She looks like her mother.
      [
        { english: 'She', thai: 'ชี' },
        { english: 'looks', thai: 'ลุคส์' },
        { english: 'like', thai: 'ไลค์' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'mother.', thai: 'มาเธอร์' },
      ],
    ],
    article_translation:
      'ออมอยากจะบรรยายครอบครัวของเธอ พ่อของเธอสูงและใจดี แม่ของเธอมีผมยาวสวย น้องชายของเธอเตี้ยและตลก ออมมีดวงตากลมโต เธอหน้าตาเหมือนแม่ของเธอ',
    image_prompt: 'Thai girl describing her family members with speech bubbles showing adjectives',
    quiz: [
      {
        question: "คำว่า 'tall' แปลว่าอะไร?",
        options: ['อ้วน', 'ผอม', 'สูง', 'เตี้ย'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: "คำว่า 'funny' หมายถึงอะไร?",
        options: ['ใจดี', 'ตลก', 'สวย', 'เก่ง'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'พ่อของออมเป็นคนอย่างไร?',
        options: ['เตี้ยและตลก', 'สูงและใจดี', 'สูงและตลก', 'เตี้ยและใจดี'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ออมหน้าตาเหมือนใคร?',
        options: ['พ่อ', 'ยาย', 'แม่', 'น้องชาย'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 3: Ages and Birthdays (อายุและวันเกิด)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-family',
    lesson_order: 3,
    level: 1,
    topic: 'ages-and-birthdays',
    title: 'Ages and Birthdays',
    title_thai: 'อายุและวันเกิด',
    vocabulary: [
      { word: 'age', phonetic: 'เอจ', meaning: 'อายุ', partOfSpeech: 'n.' },
      { word: 'birthday', phonetic: 'เบิร์ธเดย์', meaning: 'วันเกิด', partOfSpeech: 'n.' },
      { word: 'years old', phonetic: 'เยียร์ส-โอลด์', meaning: 'ปี (อายุ)', partOfSpeech: 'phr.' },
      { word: 'cake', phonetic: 'เค้ก', meaning: 'เค้ก', partOfSpeech: 'n.' },
      { word: 'candle', phonetic: 'แคนเดิล', meaning: 'เทียน', partOfSpeech: 'n.' },
      { word: 'wish', phonetic: 'วิช', meaning: 'อธิษฐาน', partOfSpeech: 'v.' },
      { word: 'celebrate', phonetic: 'เซเลเบรท', meaning: 'ฉลอง', partOfSpeech: 'v.' },
      { word: 'happy', phonetic: 'แฮปปี้', meaning: 'มีความสุข', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      // Today is Win's birthday.
      [
        { english: 'Today', thai: 'ทูเดย์' },
        { english: 'is', thai: 'อิส' },
        { english: "Win's", thai: 'วินส์' },
        { english: 'birthday.', thai: 'เบิร์ธเดย์' },
      ],
      // He is ten years old.
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'is', thai: 'อิส' },
        { english: 'ten', thai: 'เท็น' },
        { english: 'years', thai: 'เยียร์ส' },
        { english: 'old.', thai: 'โอลด์' },
      ],
      // His family celebrates at home.
      [
        { english: 'His', thai: 'ฮิส' },
        { english: 'family', thai: 'แฟมิลี' },
        { english: 'celebrates', thai: 'เซเลเบรทส์' },
        { english: 'at', thai: 'แอท' },
        { english: 'home.', thai: 'โฮม' },
      ],
      // There is a big cake with ten candles.
      [
        { english: 'There', thai: 'แธร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'a', thai: 'อะ' },
        { english: 'big', thai: 'บิก' },
        { english: 'cake', thai: 'เค้ก' },
        { english: 'with', thai: 'วิธ' },
        { english: 'ten', thai: 'เท็น' },
        { english: 'candles.', thai: 'แคนเดิลส์' },
      ],
      // Win makes a wish and blows the candles.
      [
        { english: 'Win', thai: 'วิน' },
        { english: 'makes', thai: 'เมคส์' },
        { english: 'a', thai: 'อะ' },
        { english: 'wish', thai: 'วิช' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'blows', thai: 'โบลว์ส' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'candles.', thai: 'แคนเดิลส์' },
      ],
      // He is very happy today.
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี' },
        { english: 'happy', thai: 'แฮปปี้' },
        { english: 'today.', thai: 'ทูเดย์' },
      ],
    ],
    article_translation:
      'วันนี้เป็นวันเกิดของวิน เขาอายุสิบขวบ ครอบครัวของเขาฉลองที่บ้าน มีเค้กก้อนใหญ่พร้อมเทียนสิบเล่ม วินอธิษฐานและเป่าเทียน เขามีความสุขมากวันนี้',
    image_prompt: 'Thai boy blowing candles on a birthday cake surrounded by family at home',
    quiz: [
      {
        question: "คำว่า 'birthday' แปลว่าอะไร?",
        options: ['วันหยุด', 'วันเกิด', 'วันปีใหม่', 'วันสงกรานต์'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'celebrate' หมายถึงอะไร?",
        options: ['อธิษฐาน', 'ร้องเพลง', 'ฉลอง', 'เป่า'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'วินอายุเท่าไหร่?',
        options: ['8 ขวบ', '9 ขวบ', '10 ขวบ', '11 ขวบ'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ครอบครัววินฉลองวันเกิดที่ไหน?',
        options: ['ที่ร้านอาหาร', 'ที่โรงเรียน', 'ที่สวนสาธารณะ', 'ที่บ้าน'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 4: Family Activities (กิจกรรมครอบครัว)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-family',
    lesson_order: 4,
    level: 1,
    topic: 'family-activities',
    title: 'Family Activities',
    title_thai: 'กิจกรรมครอบครัว',
    vocabulary: [
      { word: 'cook', phonetic: 'คุก', meaning: 'ทำอาหาร', partOfSpeech: 'v.' },
      { word: 'eat', phonetic: 'อีท', meaning: 'กิน', partOfSpeech: 'v.' },
      { word: 'watch', phonetic: 'วอทช์', meaning: 'ดู', partOfSpeech: 'v.' },
      { word: 'play', phonetic: 'เพลย์', meaning: 'เล่น', partOfSpeech: 'v.' },
      { word: 'together', phonetic: 'ทูเกเธอร์', meaning: 'ด้วยกัน', partOfSpeech: 'adv.' },
      { word: 'weekend', phonetic: 'วีคเอนด์', meaning: 'สุดสัปดาห์', partOfSpeech: 'n.' },
      { word: 'dinner', phonetic: 'ดินเนอร์', meaning: 'อาหารเย็น', partOfSpeech: 'n.' },
      { word: 'enjoy', phonetic: 'เอ็นจอย', meaning: 'สนุก', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      // Film's family likes the weekend.
      [
        { english: "Film's", thai: 'ฟิล์มส์' },
        { english: 'family', thai: 'แฟมิลี' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'weekend.', thai: 'วีคเอนด์' },
      ],
      // His mother cooks dinner for everyone.
      [
        { english: 'His', thai: 'ฮิส' },
        { english: 'mother', thai: 'มาเธอร์' },
        { english: 'cooks', thai: 'คุกส์' },
        { english: 'dinner', thai: 'ดินเนอร์' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'everyone.', thai: 'เอฟรีวัน' },
      ],
      // They eat together at the table.
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'eat', thai: 'อีท' },
        { english: 'together', thai: 'ทูเกเธอร์' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'table.', thai: 'เทเบิล' },
      ],
      // After dinner, they watch TV together.
      [
        { english: 'After', thai: 'อาฟเทอะ' },
        { english: 'dinner,', thai: 'ดินเนอร์' },
        { english: 'they', thai: 'เดย์' },
        { english: 'watch', thai: 'วอทช์' },
        { english: 'TV', thai: 'ทีวี' },
        { english: 'together.', thai: 'ทูเกเธอร์' },
      ],
      // Film plays games with his brother.
      [
        { english: 'Film', thai: 'ฟิล์ม' },
        { english: 'plays', thai: 'เพลย์ส' },
        { english: 'games', thai: 'เกมส์' },
        { english: 'with', thai: 'วิธ' },
        { english: 'his', thai: 'ฮิส' },
        { english: 'brother.', thai: 'บราเธอร์' },
      ],
      // They enjoy their time together.
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'enjoy', thai: 'เอ็นจอย' },
        { english: 'their', thai: 'แธร์' },
        { english: 'time', thai: 'ไทม์' },
        { english: 'together.', thai: 'ทูเกเธอร์' },
      ],
    ],
    article_translation:
      'ครอบครัวของฟิล์มชอบวันสุดสัปดาห์ แม่ของเขาทำอาหารเย็นให้ทุกคน พวกเขากินข้าวด้วยกันที่โต๊ะ หลังอาหารเย็นพวกเขาดูทีวีด้วยกัน ฟิล์มเล่นเกมกับน้องชาย พวกเขาสนุกกับเวลาที่อยู่ด้วยกัน',
    image_prompt: 'Thai family eating dinner together and watching TV on a cozy weekend evening',
    quiz: [
      {
        question: "คำว่า 'cook' แปลว่าอะไร?",
        options: ['กิน', 'ดู', 'ทำอาหาร', 'เล่น'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: "คำว่า 'together' หมายถึงอะไร?",
        options: ['คนเดียว', 'ด้วยกัน', 'ตอนเย็น', 'ทุกวัน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ใครเป็นคนทำอาหารเย็นให้ครอบครัว?',
        options: ['พ่อของฟิล์ม', 'แม่ของฟิล์ม', 'ฟิล์ม', 'น้องชายของฟิล์ม'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'หลังอาหารเย็นครอบครัวฟิล์มทำอะไร?',
        options: ['ไปเดินเล่น', 'ทำการบ้าน', 'ดูทีวีด้วยกัน', 'ไปนอน'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 5: My Best Friend (เพื่อนสนิทของฉัน)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-family',
    lesson_order: 5,
    level: 1,
    topic: 'my-best-friend',
    title: 'My Best Friend',
    title_thai: 'เพื่อนสนิทของฉัน',
    vocabulary: [
      { word: 'friend', phonetic: 'เฟรนด์', meaning: 'เพื่อน', partOfSpeech: 'n.' },
      { word: 'best', phonetic: 'เบสท์', meaning: 'ดีที่สุด', partOfSpeech: 'adj.' },
      { word: 'school', phonetic: 'สคูล', meaning: 'โรงเรียน', partOfSpeech: 'n.' },
      { word: 'share', phonetic: 'แชร์', meaning: 'แบ่งปัน', partOfSpeech: 'v.' },
      { word: 'help', phonetic: 'เฮลพ์', meaning: 'ช่วย', partOfSpeech: 'v.' },
      { word: 'laugh', phonetic: 'ลาฟ', meaning: 'หัวเราะ', partOfSpeech: 'v.' },
      { word: 'homework', phonetic: 'โฮมเวิร์ค', meaning: 'การบ้าน', partOfSpeech: 'n.' },
      { word: 'always', phonetic: 'ออลเวย์ส', meaning: 'เสมอ', partOfSpeech: 'adv.' },
    ],
    article_sentences: [
      // Ploy's best friend is Aom.
      [
        { english: "Ploy's", thai: 'พลอยส์' },
        { english: 'best', thai: 'เบสท์' },
        { english: 'friend', thai: 'เฟรนด์' },
        { english: 'is', thai: 'อิส' },
        { english: 'Aom.', thai: 'ออม' },
      ],
      // They go to the same school.
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'go', thai: 'โก' },
        { english: 'to', thai: 'ทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'same', thai: 'เซม' },
        { english: 'school.', thai: 'สคูล' },
      ],
      // Aom always helps Ploy with homework.
      [
        { english: 'Aom', thai: 'ออม' },
        { english: 'always', thai: 'ออลเวย์ส' },
        { english: 'helps', thai: 'เฮลพ์ส' },
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'with', thai: 'วิธ' },
        { english: 'homework.', thai: 'โฮมเวิร์ค' },
      ],
      // They share their lunch every day.
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'share', thai: 'แชร์' },
        { english: 'their', thai: 'แธร์' },
        { english: 'lunch', thai: 'ลันช์' },
        { english: 'every', thai: 'เอฟรี' },
        { english: 'day.', thai: 'เดย์' },
      ],
      // They laugh and play at school.
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'laugh', thai: 'ลาฟ' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'play', thai: 'เพลย์' },
        { english: 'at', thai: 'แอท' },
        { english: 'school.', thai: 'สคูล' },
      ],
      // Ploy is happy to have a good friend.
      [
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'is', thai: 'อิส' },
        { english: 'happy', thai: 'แฮปปี้' },
        { english: 'to', thai: 'ทู' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'a', thai: 'อะ' },
        { english: 'good', thai: 'กู๊ด' },
        { english: 'friend.', thai: 'เฟรนด์' },
      ],
    ],
    article_translation:
      'เพื่อนสนิทของพลอยคือออม พวกเธอไปโรงเรียนเดียวกัน ออมช่วยพลอยทำการบ้านเสมอ พวกเธอแบ่งปันอาหารกลางวันกันทุกวัน พวกเธอหัวเราะและเล่นกันที่โรงเรียน พลอยมีความสุขที่มีเพื่อนดีๆ',
    image_prompt: 'Two Thai schoolgirls in uniform sharing lunch and laughing together at school',
    quiz: [
      {
        question: "คำว่า 'friend' แปลว่าอะไร?",
        options: ['ครอบครัว', 'ครู', 'เพื่อน', 'น้องสาว'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: "คำว่า 'share' หมายถึงอะไร?",
        options: ['ช่วย', 'แบ่งปัน', 'หัวเราะ', 'เล่น'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ออมช่วยพลอยทำอะไร?',
        options: ['ทำอาหาร', 'ทำการบ้าน', 'ทำความสะอาด', 'ทำขนม'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'พลอยกับออมทำอะไรทุกวัน?',
        options: ['ไปเที่ยว', 'ดูหนัง', 'แบ่งปันอาหารกลางวัน', 'ว่ายน้ำ'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },
];
