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

export const coreA1PlacesLessons: LessonSeedData[] = [
  // ─────────────────────────────────────────────
  // Lesson 1: Places in town (สถานที่ในเมือง)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-places',
    lesson_order: 1,
    level: 1,
    topic: 'Places in town',
    title: 'A Day Around Town',
    title_thai: 'วันหนึ่งในเมือง',
    vocabulary: [
      { word: 'hospital', phonetic: 'ฮอสพิเทิล', meaning: 'โรงพยาบาล', partOfSpeech: 'n.' },
      { word: 'school', phonetic: 'สคูล', meaning: 'โรงเรียน', partOfSpeech: 'n.' },
      { word: 'market', phonetic: 'มาร์เก็ต', meaning: 'ตลาด', partOfSpeech: 'n.' },
      { word: 'bank', phonetic: 'แบงค์', meaning: 'ธนาคาร', partOfSpeech: 'n.' },
      { word: 'park', phonetic: 'พาร์ค', meaning: 'สวนสาธารณะ', partOfSpeech: 'n.' },
      { word: 'temple', phonetic: 'เทมเพิล', meaning: 'วัด', partOfSpeech: 'n.' },
      { word: 'mall', phonetic: 'มอลล์', meaning: 'ห้างสรรพสินค้า', partOfSpeech: 'n.' },
      { word: 'post office', phonetic: 'โพสท์-ออฟฟิศ', meaning: 'ไปรษณีย์', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'lives', thai: 'ลิฟส์' },
        { english: 'near', thai: 'เนียร์' },
        { english: 'a', thai: 'อะ' },
        { english: 'big', thai: 'บิก' },
        { english: 'market.', thai: 'มาร์เก็ต' },
      ],
      [
        { english: 'There', thai: 'แดร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'a', thai: 'อะ' },
        { english: 'school', thai: 'สคูล' },
        { english: 'next', thai: 'เน็กซ์ท' },
        { english: 'to', thai: 'ทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'temple.', thai: 'เทมเพิล' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'bank', thai: 'แบงค์' },
        { english: 'every', thai: 'เอฟรี' },
        { english: 'Monday.', thai: 'มันเดย์' },
      ],
      [
        { english: 'After', thai: 'อาฟเทอะ' },
        { english: 'that,', thai: 'แดท' },
        { english: 'she', thai: 'ชี' },
        { english: 'walks', thai: 'วอล์คส' },
        { english: 'to', thai: 'ทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'park.', thai: 'พาร์ค' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'mall', thai: 'มอลล์' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี' },
        { english: 'big.', thai: 'บิก' },
      ],
    ],
    article_translation:
      'พลอยอาศัยอยู่ใกล้ตลาดใหญ่ มีโรงเรียนอยู่ข้างวัด เธอไปธนาคารทุกวันจันทร์ หลังจากนั้นเธอเดินไปสวนสาธารณะ ห้างสรรพสินค้าใหญ่มาก',
    image_prompt: 'Thai town street with temple, market, park, and mall in cartoon style',
    quiz: [
      {
        question: "คำว่า 'hospital' แปลว่าอะไร?",
        options: ['โรงเรียน', 'โรงพยาบาล', 'ธนาคาร', 'ตลาด'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'temple' หมายถึงอะไร?",
        options: ['ห้างสรรพสินค้า', 'ไปรษณีย์', 'วัด', 'สวนสาธารณะ'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'พลอยอาศัยอยู่ใกล้อะไร?',
        options: ['โรงพยาบาล', 'วัด', 'ห้าง', 'ตลาด'],
        correctIndex: 3,
        type: 'comprehension',
      },
      {
        question: 'พลอยไปธนาคารวันอะไร?',
        options: ['ทุกวัน', 'วันจันทร์', 'วันศุกร์', 'วันเสาร์'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 2: Left, right, straight (ซ้าย ขวา ตรงไป)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-places',
    lesson_order: 2,
    level: 1,
    topic: 'Left, right, straight',
    title: 'Which Way to Go?',
    title_thai: 'ไปทางไหนดี?',
    vocabulary: [
      { word: 'left', phonetic: 'เลฟท์', meaning: 'ซ้าย', partOfSpeech: 'n.' },
      { word: 'right', phonetic: 'ไรท์', meaning: 'ขวา', partOfSpeech: 'n.' },
      { word: 'straight', phonetic: 'สเตรท', meaning: 'ตรงไป', partOfSpeech: 'adv.' },
      { word: 'turn', phonetic: 'เทิร์น', meaning: 'เลี้ยว', partOfSpeech: 'v.' },
      { word: 'walk', phonetic: 'วอล์ค', meaning: 'เดิน', partOfSpeech: 'v.' },
      { word: 'corner', phonetic: 'คอร์เนอะ', meaning: 'มุม, หัวมุม', partOfSpeech: 'n.' },
      { word: 'road', phonetic: 'โรด', meaning: 'ถนน', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'Win', thai: 'วิน' },
        { english: 'wants', thai: 'ว็อนท์ส' },
        { english: 'to', thai: 'ทู' },
        { english: 'find', thai: 'ไฟนด์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'market.', thai: 'มาร์เก็ต' },
      ],
      [
        { english: 'A', thai: 'อะ' },
        { english: 'man', thai: 'แมน' },
        { english: 'says,', thai: 'เซส' },
        { english: '"Walk', thai: 'วอล์ค' },
        { english: 'straight."', thai: 'สเตรท' },
      ],
      [
        { english: '"Then', thai: 'เด็น' },
        { english: 'turn', thai: 'เทิร์น' },
        { english: 'left', thai: 'เลฟท์' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'corner."', thai: 'คอร์เนอะ' },
      ],
      [
        { english: 'Win', thai: 'วิน' },
        { english: 'turns', thai: 'เทิร์นส์' },
        { english: 'left.', thai: 'เลฟท์' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'sees', thai: 'ซีส์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'market', thai: 'มาร์เก็ต' },
        { english: 'on', thai: 'ออน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'right.', thai: 'ไรท์' },
      ],
    ],
    article_translation:
      'วินอยากหาตลาด ชายคนหนึ่งบอกว่า "เดินตรงไป" "แล้วเลี้ยวซ้ายตรงหัวมุม" วินเลี้ยวซ้าย เขาเห็นตลาดอยู่ทางขวา',
    image_prompt: 'Thai man asking for directions on a Bangkok street with arrows showing left, right, straight',
    quiz: [
      {
        question: "คำว่า 'turn' แปลว่าอะไร?",
        options: ['เดิน', 'เลี้ยว', 'หยุด', 'วิ่ง'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "คำว่า 'straight' หมายถึงอะไร?",
        options: ['ซ้าย', 'ขวา', 'ตรงไป', 'ข้างหลัง'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ชายคนนั้นบอกให้วินทำอะไรก่อน?',
        options: ['เลี้ยวขวา', 'เลี้ยวซ้าย', 'เดินตรงไป', 'หยุดรอ'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ตลาดอยู่ทางไหน?',
        options: ['ทางซ้าย', 'ทางขวา', 'ตรงไป', 'ข้างหลัง'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 3: Where is the...? (...อยู่ที่ไหน?)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-places',
    lesson_order: 3,
    level: 1,
    topic: 'Where is the...?',
    title: 'Lost at the Mall',
    title_thai: 'หลงในห้าง',
    vocabulary: [
      { word: 'where', phonetic: 'แวร์', meaning: 'ที่ไหน', partOfSpeech: 'adv.' },
      { word: 'toilet', phonetic: 'ทอยเล็ท', meaning: 'ห้องน้ำ', partOfSpeech: 'n.' },
      { word: 'floor', phonetic: 'ฟลอร์', meaning: 'ชั้น', partOfSpeech: 'n.' },
      { word: 'elevator', phonetic: 'เอเลเวเทอะ', meaning: 'ลิฟต์', partOfSpeech: 'n.' },
      { word: 'food court', phonetic: 'ฟูด-คอร์ท', meaning: 'ศูนย์อาหาร', partOfSpeech: 'n.' },
      { word: 'find', phonetic: 'ไฟนด์', meaning: 'หา, พบ', partOfSpeech: 'v.' },
      { word: 'excuse me', phonetic: 'เอ็กซ์คิวส์-มี', meaning: 'ขอโทษครับ/ค่ะ', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'is', thai: 'อิส' },
        { english: 'at', thai: 'แอท' },
        { english: 'Siam', thai: 'สยาม' },
        { english: 'Paragon.', thai: 'พารากอน' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'asks,', thai: 'อาสค์ส' },
        { english: '"Excuse', thai: 'เอ็กซ์คิวส์' },
        { english: 'me,', thai: 'มี' },
        { english: 'where', thai: 'แวร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'toilet?"', thai: 'ทอยเล็ท' },
      ],
      [
        { english: 'A', thai: 'อะ' },
        { english: 'guard', thai: 'การ์ด' },
        { english: 'says,', thai: 'เซส' },
        { english: '"It', thai: 'อิท' },
        { english: 'is', thai: 'อิส' },
        { english: 'on', thai: 'ออน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'third', thai: 'เธิร์ด' },
        { english: 'floor."', thai: 'ฟลอร์' },
      ],
      [
        { english: '"Take', thai: 'เทค' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'elevator', thai: 'เอเลเวเทอะ' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'turn', thai: 'เทิร์น' },
        { english: 'right."', thai: 'ไรท์' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'also', thai: 'ออลโซ' },
        { english: 'finds', thai: 'ไฟนด์ส' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'food', thai: 'ฟูด' },
        { english: 'court.', thai: 'คอร์ท' },
      ],
    ],
    article_translation:
      'แบมอยู่ที่สยามพารากอน เธอถามว่า "ขอโทษค่ะ ห้องน้ำอยู่ที่ไหนคะ?" รปภ.บอกว่า "อยู่ชั้นสาม" "ขึ้นลิฟต์แล้วเลี้ยวขวา" แบมยังหาศูนย์อาหารเจอด้วย',
    image_prompt: 'Thai girl asking security guard for directions inside a modern shopping mall',
    quiz: [
      {
        question: "คำว่า 'elevator' แปลว่าอะไร?",
        options: ['บันไดเลื่อน', 'ลิฟต์', 'ทางออก', 'ห้องน้ำ'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "'Excuse me' ใช้ในสถานการณ์ไหน?",
        options: ['ขอบคุณ', 'ลาก่อน', 'ขอโทษ/เรียกสนใจ', 'สวัสดี'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ห้องน้ำอยู่ชั้นอะไร?',
        options: ['ชั้นหนึ่ง', 'ชั้นสอง', 'ชั้นสาม', 'ชั้นสี่'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'แบมอยู่ที่ไหน?',
        options: ['เซ็นทรัลเวิลด์', 'สยามพารากอน', 'เทอร์มินอล 21', 'ไอคอนสยาม'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 4: Near and far (ใกล้และไกล)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-places',
    lesson_order: 4,
    level: 1,
    topic: 'Near and far',
    title: 'Near or Far?',
    title_thai: 'ใกล้หรือไกล?',
    vocabulary: [
      { word: 'near', phonetic: 'เนียร์', meaning: 'ใกล้', partOfSpeech: 'prep.' },
      { word: 'far', phonetic: 'ฟาร์', meaning: 'ไกล', partOfSpeech: 'adj.' },
      { word: 'between', phonetic: 'บิทวีน', meaning: 'ระหว่าง', partOfSpeech: 'prep.' },
      { word: 'next to', phonetic: 'เน็กซ์ท-ทู', meaning: 'ข้างๆ', partOfSpeech: 'prep.' },
      { word: 'across from', phonetic: 'อะครอส-ฟรอม', meaning: 'ตรงข้าม', partOfSpeech: 'prep.' },
      { word: 'minute', phonetic: 'มินิท', meaning: 'นาที', partOfSpeech: 'n.' },
      { word: 'can', phonetic: 'แคน', meaning: 'สามารถ', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Petch', thai: 'เพชร' },
        { english: 'lives', thai: 'ลิฟส์' },
        { english: 'near', thai: 'เนียร์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'BTS', thai: 'บีทีเอส' },
        { english: 'station.', thai: 'สเตชั่น' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'school', thai: 'สคูล' },
        { english: 'is', thai: 'อิส' },
        { english: 'next', thai: 'เน็กซ์ท' },
        { english: 'to', thai: 'ทู' },
        { english: 'his', thai: 'ฮิส' },
        { english: 'house.', thai: 'เฮาส์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'hospital', thai: 'ฮอสพิเทิล' },
        { english: 'is', thai: 'อิส' },
        { english: 'across', thai: 'อะครอส' },
        { english: 'from', thai: 'ฟรอม' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'park.', thai: 'พาร์ค' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'mall', thai: 'มอลล์' },
        { english: 'is', thai: 'อิส' },
        { english: 'far.', thai: 'ฟาร์' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'can', thai: 'แคน' },
        { english: 'walk', thai: 'วอล์ค' },
        { english: 'to', thai: 'ทู' },
        { english: 'school', thai: 'สคูล' },
        { english: 'in', thai: 'อิน' },
        { english: 'five', thai: 'ไฟว์' },
        { english: 'minutes.', thai: 'มินิทส์' },
      ],
      [
        { english: 'But', thai: 'บัท' },
        { english: 'he', thai: 'ฮี' },
        { english: 'takes', thai: 'เทคส์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'BTS', thai: 'บีทีเอส' },
        { english: 'to', thai: 'ทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'mall.', thai: 'มอลล์' },
      ],
    ],
    article_translation:
      'เพชรอาศัยอยู่ใกล้สถานี BTS โรงเรียนอยู่ข้างๆ บ้านเขา โรงพยาบาลอยู่ตรงข้ามสวนสาธารณะ ห้างอยู่ไกล เขาเดินไปโรงเรียนได้ในห้านาที แต่เขาต้องนั่ง BTS ไปห้าง',
    image_prompt: 'Map view of Thai neighborhood showing BTS station, school, hospital, park, and mall with distance indicators',
    quiz: [
      {
        question: "คำว่า 'far' แปลว่าอะไร?",
        options: ['ใกล้', 'ไกล', 'ข้างๆ', 'ตรงข้าม'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: "'next to' หมายถึงอะไร?",
        options: ['ตรงข้าม', 'ระหว่าง', 'ข้างๆ', 'ไกลจาก'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'โรงพยาบาลอยู่ตรงไหน?',
        options: ['ข้างบ้านเพชร', 'ตรงข้ามสวนสาธารณะ', 'ใกล้ BTS', 'ในห้าง'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'เพชรไปห้างยังไง?',
        options: ['เดิน', 'นั่ง BTS', 'นั่งแท็กซี่', 'ขี่จักรยาน'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 5: At the station (ที่สถานี)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-places',
    lesson_order: 5,
    level: 1,
    topic: 'At the station',
    title: 'Taking the BTS',
    title_thai: 'นั่งรถไฟฟ้า BTS',
    vocabulary: [
      { word: 'station', phonetic: 'สเตชั่น', meaning: 'สถานี', partOfSpeech: 'n.' },
      { word: 'ticket', phonetic: 'ทิคเก็ท', meaning: 'ตั๋ว', partOfSpeech: 'n.' },
      { word: 'platform', phonetic: 'แพลทฟอร์ม', meaning: 'ชานชาลา', partOfSpeech: 'n.' },
      { word: 'train', phonetic: 'เทรน', meaning: 'รถไฟ', partOfSpeech: 'n.' },
      { word: 'get off', phonetic: 'เก็ท-ออฟ', meaning: 'ลง (จากรถ)', partOfSpeech: 'phr.' },
      { word: 'get on', phonetic: 'เก็ท-ออน', meaning: 'ขึ้น (รถ)', partOfSpeech: 'phr.' },
      { word: 'line', phonetic: 'ไลน์', meaning: 'สาย (รถไฟ)', partOfSpeech: 'n.' },
      { word: 'stop', phonetic: 'สต็อป', meaning: 'ป้าย, หยุด', partOfSpeech: 'n.' },
    ],
    article_sentences: [
      [
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'Win', thai: 'วิน' },
        { english: 'are', thai: 'อาร์' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'BTS', thai: 'บีทีเอส' },
        { english: 'station.', thai: 'สเตชั่น' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'buy', thai: 'บาย' },
        { english: 'two', thai: 'ทู' },
        { english: 'tickets.', thai: 'ทิคเก็ทส์' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'wait', thai: 'เวท' },
        { english: 'on', thai: 'ออน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'platform.', thai: 'แพลทฟอร์ม' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'train', thai: 'เทรน' },
        { english: 'comes.', thai: 'คัมส์' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'get', thai: 'เก็ท' },
        { english: 'on', thai: 'ออน' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'sit', thai: 'ซิท' },
        { english: 'down.', thai: 'ดาวน์' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'get', thai: 'เก็ท' },
        { english: 'off', thai: 'ออฟ' },
        { english: 'at', thai: 'แอท' },
        { english: 'Siam', thai: 'สยาม' },
        { english: 'stop.', thai: 'สต็อป' },
      ],
    ],
    article_translation:
      'พลอยกับวินอยู่ที่สถานี BTS พวกเขาซื้อตั๋วสองใบ พวกเขารอบนชานชาลา รถไฟมาแล้ว พวกเขาขึ้นรถไฟและนั่งลง พวกเขาลงที่ป้ายสยาม',
    image_prompt: 'Two Thai friends buying tickets and waiting at a BTS skytrain station in Bangkok',
    quiz: [
      {
        question: "คำว่า 'ticket' แปลว่าอะไร?",
        options: ['สถานี', 'ชานชาลา', 'ตั๋ว', 'รถไฟ'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: "'get off' หมายถึงอะไร?",
        options: ['ขึ้นรถ', 'ลงจากรถ', 'ซื้อตั๋ว', 'รอรถ'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'พลอยกับวินซื้อตั๋วกี่ใบ?',
        options: ['หนึ่งใบ', 'สองใบ', 'สามใบ', 'สี่ใบ'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'พวกเขาลงที่ป้ายอะไร?',
        options: ['อารีย์', 'อโศก', 'สยาม', 'ชิดลม'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },
];
