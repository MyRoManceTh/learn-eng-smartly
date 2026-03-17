import type { VocabWord, InterlinearWord, QuizQuestion } from '@/types/lesson';

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

export const coreA1NumbersLessons: LessonSeedData[] = [
  // ─────────────────────────────────────────────
  // Lesson 1: Numbers 1 to 100
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-numbers',
    lesson_order: 1,
    level: 1,
    topic: 'Numbers 1 to 100',
    title: 'How Many Cats?',
    title_thai: 'แมวกี่ตัว?',
    vocabulary: [
      { word: 'one', phonetic: 'วัน', meaning: 'หนึ่ง', partOfSpeech: 'number' },
      { word: 'five', phonetic: 'ไฟว์', meaning: 'ห้า', partOfSpeech: 'number' },
      { word: 'ten', phonetic: 'เทน', meaning: 'สิบ', partOfSpeech: 'number' },
      { word: 'twenty', phonetic: 'ทเวนตี', meaning: 'ยี่สิบ', partOfSpeech: 'number' },
      { word: 'fifty', phonetic: 'ฟิฟตี', meaning: 'ห้าสิบ', partOfSpeech: 'number' },
      { word: 'hundred', phonetic: 'ฮันเดรด', meaning: 'ร้อย', partOfSpeech: 'number' },
      { word: 'how many', phonetic: 'ฮาว เมนี', meaning: 'กี่ / เท่าไหร่', partOfSpeech: 'phrase' },
      { word: 'count', phonetic: 'เคานท์', meaning: 'นับ', partOfSpeech: 'verb' },
    ],
    article_sentences: [
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'has', thai: 'แฮส' },
        { english: 'five', thai: 'ไฟว์' },
        { english: 'cats.', thai: 'แคทส์' },
      ],
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'has', thai: 'แฮส' },
        { english: 'ten', thai: 'เทน' },
        { english: 'fish.', thai: 'ฟิช' },
      ],
      [
        { english: '"How many', thai: '"ฮาว เมนี' },
        { english: 'pets', thai: 'เพ็ทส์' },
        { english: 'do we', thai: 'ดู วี' },
        { english: 'have?"', thai: 'แฮฟ?"' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'count', thai: 'เคานท์' },
        { english: 'together.', thai: 'ทูเก็ทเธอร์' },
      ],
      [
        { english: '"Five', thai: '"ไฟว์' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'ten', thai: 'เทน' },
        { english: 'is', thai: 'อิส' },
        { english: 'fifteen!"', thai: 'ฟิฟทีน!"' },
      ],
    ],
    article_translation:
      'นัทมีแมวห้าตัว ปลามีปลาสิบตัว "เรามีสัตว์เลี้ยงกี่ตัว?" พวกเขานับด้วยกัน "ห้าบวกสิบเท่ากับสิบห้า!"',
    image_prompt:
      'Two Thai kids sitting on the floor counting their pets — five cute cats and a fishbowl with colorful fish. Bright cartoon style, cheerful classroom vibe.',
    quiz: [
      {
        question: '"five" แปลว่าอะไร?',
        options: ['สาม', 'ห้า', 'สิบ', 'ยี่สิบ'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"count" แปลว่าอะไร?',
        options: ['วิ่ง', 'กิน', 'นับ', 'นอน'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'นัทมีแมวกี่ตัว?',
        options: ['one', 'five', 'ten', 'twenty'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ห้าบวกสิบเท่ากับเท่าไหร่?',
        options: ['ten', 'twelve', 'fifteen', 'twenty'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 2: What time is it?
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-numbers',
    lesson_order: 2,
    level: 1,
    topic: 'What time is it?',
    title: 'Late for School!',
    title_thai: 'สายแล้ว!',
    vocabulary: [
      { word: 'time', phonetic: 'ไทม์', meaning: 'เวลา', partOfSpeech: 'noun' },
      { word: 'clock', phonetic: 'คล็อก', meaning: 'นาฬิกา', partOfSpeech: 'noun' },
      { word: "o'clock", phonetic: 'อะคล็อก', meaning: '...โมง / นาฬิกา', partOfSpeech: 'adverb' },
      { word: 'morning', phonetic: 'มอร์นิง', meaning: 'ตอนเช้า', partOfSpeech: 'noun' },
      { word: 'late', phonetic: 'เลท', meaning: 'สาย', partOfSpeech: 'adjective' },
      { word: 'early', phonetic: 'เออร์ลี', meaning: 'เช้า / เร็ว', partOfSpeech: 'adjective' },
      { word: 'hurry', phonetic: 'เฮอร์รี', meaning: 'รีบ', partOfSpeech: 'verb' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'looks', thai: 'ลุคส์' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'clock.', thai: 'คล็อก' },
      ],
      [
        { english: '"What', thai: '"วอท' },
        { english: 'time', thai: 'ไทม์' },
        { english: 'is', thai: 'อิส' },
        { english: 'it?"', thai: 'อิท?"' },
      ],
      [
        { english: 'It', thai: 'อิท' },
        { english: 'is', thai: 'อิส' },
        { english: 'eight', thai: 'เอท' },
        { english: "o'clock", thai: 'อะคล็อก' },
        { english: 'in the', thai: 'อิน เดอะ' },
        { english: 'morning.', thai: 'มอร์นิง' },
      ],
      [
        { english: '"I am', thai: '"ไอ แอม' },
        { english: 'late!"', thai: 'เลท!"' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'must', thai: 'มัสท์' },
        { english: 'hurry', thai: 'เฮอร์รี' },
        { english: 'to', thai: 'ทู' },
        { english: 'school.', thai: 'สคูล' },
      ],
    ],
    article_translation:
      'แบมมองนาฬิกา "กี่โมงแล้ว?" ตอนนี้แปดโมงเช้า "สายแล้ว!" แบมต้องรีบไปโรงเรียน',
    image_prompt:
      'A Thai boy in school uniform panicking while looking at a wall clock showing 8:00 AM. Messy bedroom, backpack on the floor. Cartoon style, humorous.',
    quiz: [
      {
        question: '"clock" แปลว่าอะไร?',
        options: ['โต๊ะ', 'นาฬิกา', 'หน้าต่าง', 'ประตู'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"late" แปลว่าอะไร?',
        options: ['เร็ว', 'ช้า / สาย', 'ตรงเวลา', 'เช้า'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ตอนนี้กี่โมง?',
        options: ['seven o\'clock', 'eight o\'clock', 'nine o\'clock', 'ten o\'clock'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'แบมต้องรีบไปไหน?',
        options: ['market', 'school', 'hospital', 'park'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 3: Days of the week
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-numbers',
    lesson_order: 3,
    level: 1,
    topic: 'Days of the week',
    title: 'Aom\'s Busy Week',
    title_thai: 'สัปดาห์ยุ่ง ๆ ของอ้อม',
    vocabulary: [
      { word: 'Monday', phonetic: 'มันเดย์', meaning: 'วันจันทร์', partOfSpeech: 'noun' },
      { word: 'Wednesday', phonetic: 'เว็นส์เดย์', meaning: 'วันพุธ', partOfSpeech: 'noun' },
      { word: 'Friday', phonetic: 'ไฟรเดย์', meaning: 'วันศุกร์', partOfSpeech: 'noun' },
      { word: 'Saturday', phonetic: 'แซทเทอร์เดย์', meaning: 'วันเสาร์', partOfSpeech: 'noun' },
      { word: 'week', phonetic: 'วีค', meaning: 'สัปดาห์', partOfSpeech: 'noun' },
      { word: 'today', phonetic: 'ทูเดย์', meaning: 'วันนี้', partOfSpeech: 'adverb' },
      { word: 'busy', phonetic: 'บิซซี', meaning: 'ยุ่ง', partOfSpeech: 'adjective' },
      { word: 'free', phonetic: 'ฟรี', meaning: 'ว่าง', partOfSpeech: 'adjective' },
    ],
    article_sentences: [
      [
        { english: 'Aom', thai: 'อ้อม' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี' },
        { english: 'busy', thai: 'บิซซี' },
        { english: 'this', thai: 'ดิส' },
        { english: 'week.', thai: 'วีค' },
      ],
      [
        { english: 'On', thai: 'ออน' },
        { english: 'Monday,', thai: 'มันเดย์,' },
        { english: 'she', thai: 'ชี' },
        { english: 'has', thai: 'แฮส' },
        { english: 'English', thai: 'อิงลิช' },
        { english: 'class.', thai: 'คลาส' },
      ],
      [
        { english: 'On', thai: 'ออน' },
        { english: 'Wednesday,', thai: 'เว็นส์เดย์,' },
        { english: 'she', thai: 'ชี' },
        { english: 'plays', thai: 'เพลย์ส' },
        { english: 'guitar.', thai: 'กีตาร์' },
      ],
      [
        { english: 'On', thai: 'ออน' },
        { english: 'Friday,', thai: 'ไฟรเดย์,' },
        { english: 'she', thai: 'ชี' },
        { english: 'meets', thai: 'มีทส์' },
        { english: 'friends.', thai: 'เฟรนด์ส' },
      ],
      [
        { english: 'On', thai: 'ออน' },
        { english: 'Saturday,', thai: 'แซทเทอร์เดย์,' },
        { english: 'she', thai: 'ชี' },
        { english: 'is', thai: 'อิส' },
        { english: 'free!', thai: 'ฟรี!' },
      ],
    ],
    article_translation:
      'อ้อมยุ่งมากสัปดาห์นี้ วันจันทร์เธอมีเรียนภาษาอังกฤษ วันพุธเธอเล่นกีตาร์ วันศุกร์เธอเจอเพื่อน ๆ วันเสาร์เธอว่าง!',
    image_prompt:
      'A Thai girl looking at a colorful weekly planner pinned on her bedroom wall, each day has cute icons — book, guitar, friends, smiley face. Bright pastel cartoon style.',
    quiz: [
      {
        question: '"Wednesday" แปลว่าอะไร?',
        options: ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"busy" แปลว่าอะไร?',
        options: ['ว่าง', 'ยุ่ง', 'เหนื่อย', 'สนุก'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'อ้อมเล่นกีตาร์วันอะไร?',
        options: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'วันไหนที่อ้อมว่าง?',
        options: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 4: Months and dates
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-numbers',
    lesson_order: 4,
    level: 1,
    topic: 'Months and dates',
    title: 'When Is Your Birthday?',
    title_thai: 'วันเกิดเธอวันไหน?',
    vocabulary: [
      { word: 'January', phonetic: 'แจนยูเอรี', meaning: 'มกราคม', partOfSpeech: 'noun' },
      { word: 'April', phonetic: 'เอพริล', meaning: 'เมษายน', partOfSpeech: 'noun' },
      { word: 'July', phonetic: 'จูไล', meaning: 'กรกฎาคม', partOfSpeech: 'noun' },
      { word: 'December', phonetic: 'ดิเซมเบอร์', meaning: 'ธันวาคม', partOfSpeech: 'noun' },
      { word: 'birthday', phonetic: 'เบิร์ธเดย์', meaning: 'วันเกิด', partOfSpeech: 'noun' },
      { word: 'date', phonetic: 'เดท', meaning: 'วันที่', partOfSpeech: 'noun' },
      { word: 'month', phonetic: 'มันธ์', meaning: 'เดือน', partOfSpeech: 'noun' },
      { word: 'year', phonetic: 'เยียร์', meaning: 'ปี', partOfSpeech: 'noun' },
    ],
    article_sentences: [
      [
        { english: '"When', thai: '"เว็น' },
        { english: 'is', thai: 'อิส' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'birthday?"', thai: 'เบิร์ธเดย์?"' },
        { english: 'Nut', thai: 'นัท' },
        { english: 'asks.', thai: 'อาสค์ส' },
      ],
      [
        { english: '"My', thai: '"มาย' },
        { english: 'birthday', thai: 'เบิร์ธเดย์' },
        { english: 'is', thai: 'อิส' },
        { english: 'April', thai: 'เอพริล' },
        { english: 'fifth,"', thai: 'ฟิฟธ์,"' },
        { english: 'Pla', thai: 'ปลา' },
        { english: 'says.', thai: 'เซส' },
      ],
      [
        { english: '"That', thai: '"แดท' },
        { english: 'is', thai: 'อิส' },
        { english: 'Songkran', thai: 'สงกรานต์' },
        { english: 'month!"', thai: 'มันธ์!"' },
      ],
      [
        { english: '"Yes!', thai: '"เยส!' },
        { english: 'I', thai: 'ไอ' },
        { english: 'love', thai: 'เลิฟ' },
        { english: 'April,"', thai: 'เอพริล,"' },
        { english: 'Pla', thai: 'ปลา' },
        { english: 'smiles.', thai: 'สไมล์ส' },
      ],
    ],
    article_translation:
      '"วันเกิดเธอวันไหน?" นัทถาม "วันเกิดฉันวันที่ 5 เมษายน" ปลาตอบ "นั่นเดือนสงกรานต์เลย!" "ใช่! ฉันชอบเดือนเมษายน" ปลายิ้ม',
    image_prompt:
      'Two Thai kids chatting at a school canteen with a wall calendar showing April. One girl points at a date circled in red. Songkran water splash decorations. Cute cartoon style.',
    quiz: [
      {
        question: '"birthday" แปลว่าอะไร?',
        options: ['วันหยุด', 'วันเกิด', 'วันสอบ', 'วันปีใหม่'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"month" แปลว่าอะไร?',
        options: ['สัปดาห์', 'วัน', 'เดือน', 'ปี'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'วันเกิดของปลาอยู่เดือนอะไร?',
        options: ['January', 'April', 'July', 'December'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'เดือนเมษายนมีเทศกาลอะไรในไทย?',
        options: ['Christmas', 'Loy Krathong', 'Songkran', 'New Year'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 5: Making appointments
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-numbers',
    lesson_order: 5,
    level: 1,
    topic: 'Making appointments',
    title: 'Let\'s Meet at the Mall!',
    title_thai: 'เจอกันที่ห้างนะ!',
    vocabulary: [
      { word: 'meet', phonetic: 'มีท', meaning: 'เจอกัน / พบกัน', partOfSpeech: 'verb' },
      { word: 'appointment', phonetic: 'อะพอยท์เมนท์', meaning: 'การนัดหมาย', partOfSpeech: 'noun' },
      { word: 'place', phonetic: 'เพลส', meaning: 'สถานที่', partOfSpeech: 'noun' },
      { word: 'tomorrow', phonetic: 'ทูมอร์โรว์', meaning: 'พรุ่งนี้', partOfSpeech: 'adverb' },
      { word: 'afternoon', phonetic: 'อาฟเทอร์นูน', meaning: 'ตอนบ่าย', partOfSpeech: 'noun' },
      { word: 'sure', phonetic: 'ชัวร์', meaning: 'แน่นอน / ได้เลย', partOfSpeech: 'adjective' },
      { word: 'see you', phonetic: 'ซี ยู', meaning: 'เจอกัน / แล้วเจอกัน', partOfSpeech: 'phrase' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'calls', thai: 'คอลส์' },
        { english: 'Aom.', thai: 'อ้อม' },
      ],
      [
        { english: '"Let\'s', thai: '"เล็ทส์' },
        { english: 'meet', thai: 'มีท' },
        { english: 'tomorrow', thai: 'ทูมอร์โรว์' },
        { english: 'afternoon."', thai: 'อาฟเทอร์นูน"' },
      ],
      [
        { english: '"What', thai: '"วอท' },
        { english: 'time', thai: 'ไทม์' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'what', thai: 'วอท' },
        { english: 'place?"', thai: 'เพลส?"' },
        { english: 'Aom', thai: 'อ้อม' },
        { english: 'asks.', thai: 'อาสค์ส' },
      ],
      [
        { english: '"Two', thai: '"ทู' },
        { english: "o'clock", thai: 'อะคล็อก' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'mall."', thai: 'มอลล์"' },
      ],
      [
        { english: '"Sure!', thai: '"ชัวร์!' },
        { english: 'See you', thai: 'ซี ยู' },
        { english: 'tomorrow!"', thai: 'ทูมอร์โรว์!"' },
      ],
    ],
    article_translation:
      'แบมโทรหาอ้อม "เจอกันพรุ่งนี้ตอนบ่ายนะ" "กี่โมง ที่ไหน?" อ้อมถาม "บ่ายสองที่ห้าง" "ได้เลย! เจอกันพรุ่งนี้!"',
    image_prompt:
      'A Thai boy talking on a phone, a thought bubble shows a shopping mall with a clock showing 2:00 PM. Split screen with a Thai girl on the other side smiling. Cartoon style, fun colors.',
    quiz: [
      {
        question: '"tomorrow" แปลว่าอะไร?',
        options: ['เมื่อวาน', 'วันนี้', 'พรุ่งนี้', 'สัปดาห์หน้า'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"meet" แปลว่าอะไร?',
        options: ['กิน', 'นอน', 'เจอกัน', 'วิ่ง'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมกับอ้อมจะเจอกันกี่โมง?',
        options: ['one o\'clock', 'two o\'clock', 'three o\'clock', 'four o\'clock'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'พวกเขาจะเจอกันที่ไหน?',
        options: ['school', 'park', 'mall', 'restaurant'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },
];
