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

export const coreA1DailyLessons: LessonSeedData[] = [
  // ─────────────────────────────────────────────
  // Lesson 1: Morning Routine (กิจวัตรตอนเช้า)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-daily',
    lesson_order: 1,
    level: 1,
    topic: 'morning-routine',
    title: 'Morning Routine',
    title_thai: 'กิจวัตรตอนเช้า',
    vocabulary: [
      { word: 'wake up', phonetic: 'เวค-อัพ', meaning: 'ตื่นนอน', partOfSpeech: 'verb' },
      { word: 'brush teeth', phonetic: 'บรัช-ทีธ', meaning: 'แปรงฟัน', partOfSpeech: 'verb' },
      { word: 'take a shower', phonetic: 'เทค-อะ-ชาวเวอร์', meaning: 'อาบน้ำ', partOfSpeech: 'verb' },
      { word: 'get dressed', phonetic: 'เก็ท-เดรสท์', meaning: 'แต่งตัว', partOfSpeech: 'verb' },
      { word: 'eat breakfast', phonetic: 'อีท-เบรคฟาสท์', meaning: 'กินข้าวเช้า', partOfSpeech: 'verb' },
      { word: 'early', phonetic: 'เออร์ลี่', meaning: 'เช้า / แต่เช้า', partOfSpeech: 'adjective' },
      { word: 'every day', phonetic: 'เอฟวรี่-เดย์', meaning: 'ทุกวัน', partOfSpeech: 'adverb' },
      { word: 'morning', phonetic: 'มอร์นิ่ง', meaning: 'ตอนเช้า', partOfSpeech: 'noun' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'wakes up', thai: 'เวคส์-อัพ' },
        { english: 'early', thai: 'เออร์ลี่' },
        { english: 'every', thai: 'เอฟวรี่' },
        { english: 'morning.', thai: 'มอร์นิ่ง' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'brushes', thai: 'บรัชเชส' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'teeth', thai: 'ทีธ' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'takes', thai: 'เทคส์' },
        { english: 'a shower.', thai: 'อะ-ชาวเวอร์' },
      ],
      [
        { english: 'Then', thai: 'เด็น' },
        { english: 'she', thai: 'ชี' },
        { english: 'gets', thai: 'เก็ทส์' },
        { english: 'dressed.', thai: 'เดรสท์' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'rice porridge', thai: 'ไรซ์-พอร์ริดจ์' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'breakfast.', thai: 'เบรคฟาสท์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'is', thai: 'อิส' },
        { english: 'ready', thai: 'เรดดี้' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'school!', thai: 'สกูล' },
      ],
    ],
    article_translation:
      'แบมตื่นเช้าทุกเช้า เธอแปรงฟันและอาบน้ำ จากนั้นเธอแต่งตัว แบมกินข้าวต้มเป็นอาหารเช้า เธอพร้อมไปโรงเรียนแล้ว!',
    image_prompt:
      'A cheerful Thai girl named Bam in school uniform eating rice porridge at a wooden table in a bright Thai kitchen in the morning, warm sunlight through windows, cartoon style, cute, cozy',
    quiz: [
      {
        question: '"wake up" แปลว่าอะไร?',
        options: ['นอนหลับ', 'ตื่นนอน', 'แต่งตัว', 'กินข้าว'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"brush teeth" แปลว่าอะไร?',
        options: ['หวีผม', 'ล้างหน้า', 'แปรงฟัน', 'อาบน้ำ'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมตื่นนอนตอนไหน?',
        options: ['ตื่นสาย', 'ตื่นเช้า', 'ตื่นตอนบ่าย', 'ตื่นตอนเย็น'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'แบมกินอะไรเป็นอาหารเช้า?',
        options: ['ขนมปัง', 'ข้าวต้ม', 'ก๋วยเตี๋ยว', 'ผลไม้'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 2: At School or Work (ที่โรงเรียนหรือที่ทำงาน)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-daily',
    lesson_order: 2,
    level: 1,
    topic: 'school-or-work',
    title: 'At School or Work',
    title_thai: 'ที่โรงเรียนหรือที่ทำงาน',
    vocabulary: [
      { word: 'go to school', phonetic: 'โก-ทู-สกูล', meaning: 'ไปโรงเรียน', partOfSpeech: 'verb' },
      { word: 'study', phonetic: 'สตั๊ดดี้', meaning: 'เรียน', partOfSpeech: 'verb' },
      { word: 'teacher', phonetic: 'ทีชเชอร์', meaning: 'ครู', partOfSpeech: 'noun' },
      { word: 'friend', phonetic: 'เฟรนด์', meaning: 'เพื่อน', partOfSpeech: 'noun' },
      { word: 'lunch', phonetic: 'ลันช์', meaning: 'อาหารกลางวัน', partOfSpeech: 'noun' },
      { word: 'classroom', phonetic: 'คลาสรูม', meaning: 'ห้องเรียน', partOfSpeech: 'noun' },
      { word: 'learn', phonetic: 'เลิร์น', meaning: 'เรียนรู้', partOfSpeech: 'verb' },
    ],
    article_sentences: [
      [
        { english: 'Fon', thai: 'ฝน' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'school', thai: 'สกูล' },
        { english: 'at', thai: 'แอท' },
        { english: 'eight.', thai: 'เอท' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'studies', thai: 'สตั๊ดดี้ส์' },
        { english: 'English', thai: 'อิงลิช' },
        { english: 'in', thai: 'อิน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'classroom.', thai: 'คลาสรูม' },
      ],
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'teacher', thai: 'ทีชเชอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี่' },
        { english: 'kind.', thai: 'ไคนด์' },
      ],
      [
        { english: 'Fon', thai: 'ฝน' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'lunch', thai: 'ลันช์' },
        { english: 'with', thai: 'วิธ' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'friends.', thai: 'เฟรนด์ส' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'likes', thai: 'ไลค์ส' },
        { english: 'to', thai: 'ทู' },
        { english: 'learn', thai: 'เลิร์น' },
        { english: 'new', thai: 'นิว' },
        { english: 'words.', thai: 'เวิร์ดส์' },
      ],
    ],
    article_translation:
      'ฝนไปโรงเรียนตอนแปดโมง เธอเรียนภาษาอังกฤษในห้องเรียน ครูของเธอใจดีมาก ฝนกินอาหารกลางวันกับเพื่อนๆ เธอชอบเรียนรู้คำศัพท์ใหม่ๆ',
    image_prompt:
      'A Thai girl named Fon in school uniform sitting in a bright classroom with friends, studying English, Thai school setting, cartoon style, cute, colorful',
    quiz: [
      {
        question: '"teacher" แปลว่าอะไร?',
        options: ['นักเรียน', 'ครู', 'เพื่อน', 'ผู้ปกครอง'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"classroom" แปลว่าอะไร?',
        options: ['สนามเด็กเล่น', 'โรงอาหาร', 'ห้องเรียน', 'ห้องสมุด'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ฝนไปโรงเรียนกี่โมง?',
        options: ['เจ็ดโมง', 'แปดโมง', 'เก้าโมง', 'สิบโมง'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ฝนกินอาหารกลางวันกับใคร?',
        options: ['กับครู', 'กับแม่', 'กับเพื่อนๆ', 'คนเดียว'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 3: Afternoon Activities (กิจกรรมตอนบ่าย)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-daily',
    lesson_order: 3,
    level: 1,
    topic: 'afternoon-activities',
    title: 'Afternoon Activities',
    title_thai: 'กิจกรรมตอนบ่าย',
    vocabulary: [
      { word: 'go home', phonetic: 'โก-โฮม', meaning: 'กลับบ้าน', partOfSpeech: 'verb' },
      { word: 'do homework', phonetic: 'ดู-โฮมเวิร์ค', meaning: 'ทำการบ้าน', partOfSpeech: 'verb' },
      { word: 'play', phonetic: 'เพลย์', meaning: 'เล่น', partOfSpeech: 'verb' },
      { word: 'watch TV', phonetic: 'วอทช์-ทีวี', meaning: 'ดูทีวี', partOfSpeech: 'verb' },
      { word: 'snack', phonetic: 'สแน็ค', meaning: 'ขนม / ของว่าง', partOfSpeech: 'noun' },
      { word: 'afternoon', phonetic: 'อาฟเตอร์นูน', meaning: 'ตอนบ่าย', partOfSpeech: 'noun' },
      { word: 'tired', phonetic: 'ไทเออร์ด', meaning: 'เหนื่อย', partOfSpeech: 'adjective' },
    ],
    article_sentences: [
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'home', thai: 'โฮม' },
        { english: 'at', thai: 'แอท' },
        { english: 'four.', thai: 'โฟร์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'a', thai: 'อะ' },
        { english: 'snack', thai: 'สแน็ค' },
        { english: 'first.', thai: 'เฟิร์สท์' },
      ],
      [
        { english: 'Then', thai: 'เด็น' },
        { english: 'she', thai: 'ชี' },
        { english: 'does', thai: 'ดัส' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'homework.', thai: 'โฮมเวิร์ค' },
      ],
      [
        { english: 'After', thai: 'อาฟเตอร์' },
        { english: 'that,', thai: 'แดท' },
        { english: 'she', thai: 'ชี' },
        { english: 'plays', thai: 'เพลย์ส' },
        { english: 'with', thai: 'วิธ' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'cat.', thai: 'แคท' },
      ],
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'watches', thai: 'วอทเชส' },
        { english: 'TV', thai: 'ทีวี' },
        { english: 'when', thai: 'เว็น' },
        { english: 'she', thai: 'ชี' },
        { english: 'is', thai: 'อิส' },
        { english: 'tired.', thai: 'ไทเออร์ด' },
      ],
    ],
    article_translation:
      'ปลากลับบ้านตอนสี่โมง เธอกินขนมก่อน จากนั้นเธอทำการบ้าน หลังจากนั้นเธอเล่นกับแมว ปลาดูทีวีตอนที่เธอเหนื่อย',
    image_prompt:
      'A Thai girl named Pla relaxing at home after school, playing with a cute cat, doing homework on a desk, cozy Thai house interior, cartoon style, warm colors',
    quiz: [
      {
        question: '"go home" แปลว่าอะไร?',
        options: ['ไปโรงเรียน', 'ไปเที่ยว', 'กลับบ้าน', 'ไปตลาด'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"tired" แปลว่าอะไร?',
        options: ['หิว', 'เหนื่อย', 'สนุก', 'เศร้า'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ปลากลับบ้านกี่โมง?',
        options: ['สามโมง', 'สี่โมง', 'ห้าโมง', 'หกโมง'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ปลาเล่นกับอะไร?',
        options: ['สุนัข', 'แมว', 'น้องสาว', 'เพื่อน'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 4: Evening and Bedtime (ตอนเย็นและก่อนนอน)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-daily',
    lesson_order: 4,
    level: 1,
    topic: 'evening-and-bedtime',
    title: 'Evening and Bedtime',
    title_thai: 'ตอนเย็นและก่อนนอน',
    vocabulary: [
      { word: 'eat dinner', phonetic: 'อีท-ดินเนอร์', meaning: 'กินข้าวเย็น', partOfSpeech: 'verb' },
      { word: 'take a bath', phonetic: 'เทค-อะ-บาธ', meaning: 'อาบน้ำ', partOfSpeech: 'verb' },
      { word: 'read a book', phonetic: 'รีด-อะ-บุ๊ค', meaning: 'อ่านหนังสือ', partOfSpeech: 'verb' },
      { word: 'go to bed', phonetic: 'โก-ทู-เบ็ด', meaning: 'เข้านอน', partOfSpeech: 'verb' },
      { word: 'night', phonetic: 'ไนท์', meaning: 'กลางคืน', partOfSpeech: 'noun' },
      { word: 'sleepy', phonetic: 'สลีปปี้', meaning: 'ง่วงนอน', partOfSpeech: 'adjective' },
      { word: 'family', phonetic: 'แฟมิลี่', meaning: 'ครอบครัว', partOfSpeech: 'noun' },
      { word: 'good night', phonetic: 'กู๊ด-ไนท์', meaning: 'ราตรีสวัสดิ์', partOfSpeech: 'interjection' },
    ],
    article_sentences: [
      [
        { english: 'Mook', thai: 'มุก' },
        { english: 'eats', thai: 'อีทส์' },
        { english: 'dinner', thai: 'ดินเนอร์' },
        { english: 'with', thai: 'วิธ' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'family.', thai: 'แฟมิลี่' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'eat', thai: 'อีท' },
        { english: 'som tum', thai: 'ส้ม-ตำ' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'grilled chicken.', thai: 'กริลด์-ชิคเค่น' },
      ],
      [
        { english: 'After', thai: 'อาฟเตอร์' },
        { english: 'dinner,', thai: 'ดินเนอร์' },
        { english: 'she', thai: 'ชี' },
        { english: 'takes', thai: 'เทคส์' },
        { english: 'a bath.', thai: 'อะ-บาธ' },
      ],
      [
        { english: 'Mook', thai: 'มุก' },
        { english: 'reads', thai: 'รีดส์' },
        { english: 'a', thai: 'อะ' },
        { english: 'book', thai: 'บุ๊ค' },
        { english: 'in', thai: 'อิน' },
        { english: 'bed.', thai: 'เบ็ด' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'is', thai: 'อิส' },
        { english: 'sleepy.', thai: 'สลีปปี้' },
      ],
      [
        { english: 'Good', thai: 'กู๊ด' },
        { english: 'night,', thai: 'ไนท์' },
        { english: 'Mook!', thai: 'มุก' },
      ],
    ],
    article_translation:
      'มุกกินข้าวเย็นกับครอบครัว พวกเขากินส้มตำและไก่ย่าง หลังจากกินข้าว เธออาบน้ำ มุกอ่านหนังสือบนเตียง เธอง่วงนอนแล้ว ราตรีสวัสดิ์จ้ามุก!',
    image_prompt:
      'A Thai girl named Mook in pajamas reading a book in her cozy bed with a small lamp, nighttime, Thai bedroom with warm lighting, cartoon style, cute, peaceful',
    quiz: [
      {
        question: '"sleepy" แปลว่าอะไร?',
        options: ['หิว', 'โกรธ', 'ง่วงนอน', 'ดีใจ'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"family" แปลว่าอะไร?',
        options: ['เพื่อน', 'ครอบครัว', 'ครู', 'เพื่อนบ้าน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'มุกกินอะไรเป็นอาหารเย็น?',
        options: ['ข้าวผัด', 'ส้มตำและไก่ย่าง', 'ก๋วยเตี๋ยว', 'พิซซ่า'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'มุกทำอะไรก่อนนอน?',
        options: ['ดูทีวี', 'เล่นเกม', 'อ่านหนังสือ', 'ทำการบ้าน'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 5: Weekday vs Weekend (วันธรรมดา vs วันหยุด)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-daily',
    lesson_order: 5,
    level: 1,
    topic: 'weekday-vs-weekend',
    title: 'Weekday vs Weekend',
    title_thai: 'วันธรรมดา vs วันหยุด',
    vocabulary: [
      { word: 'weekday', phonetic: 'วีคเดย์', meaning: 'วันธรรมดา', partOfSpeech: 'noun' },
      { word: 'weekend', phonetic: 'วีคเอนด์', meaning: 'วันหยุดสุดสัปดาห์', partOfSpeech: 'noun' },
      { word: 'sleep late', phonetic: 'สลีป-เลท', meaning: 'นอนตื่นสาย', partOfSpeech: 'verb' },
      { word: 'go out', phonetic: 'โก-เอาท์', meaning: 'ออกไปข้างนอก', partOfSpeech: 'verb' },
      { word: 'market', phonetic: 'มาร์เค็ท', meaning: 'ตลาด', partOfSpeech: 'noun' },
      { word: 'relax', phonetic: 'รีแล็กซ์', meaning: 'พักผ่อน', partOfSpeech: 'verb' },
      { word: 'busy', phonetic: 'บิซซี่', meaning: 'ยุ่ง', partOfSpeech: 'adjective' },
      { word: 'free', phonetic: 'ฟรี', meaning: 'ว่าง', partOfSpeech: 'adjective' },
    ],
    article_sentences: [
      [
        { english: 'On', thai: 'ออน' },
        { english: 'weekdays,', thai: 'วีคเดย์ส' },
        { english: 'Fon', thai: 'ฝน' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี่' },
        { english: 'busy.', thai: 'บิซซี่' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'school', thai: 'สกูล' },
        { english: 'every', thai: 'เอฟวรี่' },
        { english: 'day.', thai: 'เดย์' },
      ],
      [
        { english: 'On', thai: 'ออน' },
        { english: 'weekends,', thai: 'วีคเอนด์ส' },
        { english: 'she', thai: 'ชี' },
        { english: 'is', thai: 'อิส' },
        { english: 'free.', thai: 'ฟรี' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'sleeps', thai: 'สลีปส์' },
        { english: 'late', thai: 'เลท' },
        { english: 'on', thai: 'ออน' },
        { english: 'Saturday.', thai: 'แซทเทอร์เดย์' },
      ],
      [
        { english: 'On', thai: 'ออน' },
        { english: 'Sunday,', thai: 'ซันเดย์' },
        { english: 'she', thai: 'ชี' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'market', thai: 'มาร์เค็ท' },
        { english: 'with', thai: 'วิธ' },
        { english: 'Mom.', thai: 'มัม' },
      ],
    ],
    article_translation:
      'วันธรรมดาฝนยุ่งมาก เธอไปโรงเรียนทุกวัน ในวันหยุดเธอว่าง เธอนอนตื่นสายวันเสาร์ วันอาทิตย์เธอไปตลาดกับแม่',
    image_prompt:
      'Split scene: left side shows a Thai girl Fon in school uniform (weekday), right side shows her in casual clothes at a Thai weekend market with her mom, cartoon style, vibrant, fun',
    quiz: [
      {
        question: '"weekend" แปลว่าอะไร?',
        options: ['วันธรรมดา', 'วันหยุดสุดสัปดาห์', 'วันพุธ', 'วันจันทร์'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"busy" แปลว่าอะไร?',
        options: ['ว่าง', 'ยุ่ง', 'สนุก', 'เหนื่อย'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ฝนทำอะไรวันเสาร์?',
        options: ['ไปโรงเรียน', 'ไปตลาด', 'นอนตื่นสาย', 'ทำการบ้าน'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ฝนไปตลาดกับใคร?',
        options: ['กับพ่อ', 'กับเพื่อน', 'กับแม่', 'คนเดียว'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 6: Talking About Habits (พูดเรื่องนิสัย)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-daily',
    lesson_order: 6,
    level: 1,
    topic: 'talking-about-habits',
    title: 'Talking About Habits',
    title_thai: 'พูดเรื่องนิสัย',
    vocabulary: [
      { word: 'always', phonetic: 'ออลเวย์ส', meaning: 'เสมอ / ทุกครั้ง', partOfSpeech: 'adverb' },
      { word: 'usually', phonetic: 'ยูชวลลี่', meaning: 'โดยปกติ', partOfSpeech: 'adverb' },
      { word: 'sometimes', phonetic: 'ซัมไทม์ส', meaning: 'บางครั้ง', partOfSpeech: 'adverb' },
      { word: 'never', phonetic: 'เนฟเวอร์', meaning: 'ไม่เคย', partOfSpeech: 'adverb' },
      { word: 'exercise', phonetic: 'เอ็กเซอร์ไซส์', meaning: 'ออกกำลังกาย', partOfSpeech: 'verb' },
      { word: 'cook', phonetic: 'คุ๊ค', meaning: 'ทำอาหาร', partOfSpeech: 'verb' },
      { word: 'drink water', phonetic: 'ดริงค์-วอเทอร์', meaning: 'ดื่มน้ำ', partOfSpeech: 'verb' },
      { word: 'healthy', phonetic: 'เฮลธี่', meaning: 'สุขภาพดี', partOfSpeech: 'adjective' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'always', thai: 'ออลเวย์ส' },
        { english: 'drinks', thai: 'ดริงค์ส' },
        { english: 'water', thai: 'วอเทอร์' },
        { english: 'in', thai: 'อิน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'morning.', thai: 'มอร์นิ่ง' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'usually', thai: 'ยูชวลลี่' },
        { english: 'exercises', thai: 'เอ็กเซอร์ไซเซส' },
        { english: 'after', thai: 'อาฟเตอร์' },
        { english: 'school.', thai: 'สกูล' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'sometimes', thai: 'ซัมไทม์ส' },
        { english: 'cooks', thai: 'คุ๊คส์' },
        { english: 'with', thai: 'วิธ' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'mom.', thai: 'มัม' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'never', thai: 'เนฟเวอร์' },
        { english: 'skips', thai: 'สกิปส์' },
        { english: 'breakfast.', thai: 'เบรคฟาสท์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'is', thai: 'อิส' },
        { english: 'a', thai: 'อะ' },
        { english: 'healthy', thai: 'เฮลธี่' },
        { english: 'girl!', thai: 'เกิร์ล' },
      ],
    ],
    article_translation:
      'แบมดื่มน้ำตอนเช้าเสมอ เธอมักจะออกกำลังกายหลังเลิกเรียน เธอทำอาหารกับแม่บางครั้ง แบมไม่เคยข้ามมื้อเช้า เธอเป็นเด็กสุขภาพดี!',
    image_prompt:
      'A healthy and active Thai girl named Bam exercising in a park, drinking water, with a Thai neighborhood background, cartoon style, energetic, bright colors',
    quiz: [
      {
        question: '"always" แปลว่าอะไร?',
        options: ['ไม่เคย', 'บางครั้ง', 'เสมอ', 'นานๆ ที'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"never" แปลว่าอะไร?',
        options: ['เสมอ', 'ไม่เคย', 'บ่อยๆ', 'บางครั้ง'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'แบมทำอะไรตอนเช้าเสมอ?',
        options: ['ออกกำลังกาย', 'ทำอาหาร', 'ดื่มน้ำ', 'ดูทีวี'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'แบมไม่เคยทำอะไร?',
        options: ['ออกกำลังกาย', 'ดื่มน้ำ', 'ทำอาหาร', 'ข้ามมื้อเช้า'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },
];
