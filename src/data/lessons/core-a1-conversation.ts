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

export const coreA1ConversationLessons: LessonSeedData[] = [
  // ─────────────────────────────────────────────
  // Lesson 1: Starting a conversation (เริ่มบทสนทนา)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-conversation',
    lesson_order: 1,
    level: 1,
    topic: 'starting-a-conversation',
    title: 'Starting a Conversation',
    title_thai: 'เริ่มบทสนทนา',
    vocabulary: [
      { word: 'hello', phonetic: 'เฮลโล', meaning: 'สวัสดี', partOfSpeech: 'interjection' },
      { word: 'name', phonetic: 'เนม', meaning: 'ชื่อ', partOfSpeech: 'noun' },
      { word: 'nice', phonetic: 'ไนซ์', meaning: 'ดี / ยินดี', partOfSpeech: 'adjective' },
      { word: 'meet', phonetic: 'มีท', meaning: 'พบ / เจอ', partOfSpeech: 'verb' },
      { word: 'how', phonetic: 'ฮาว', meaning: 'อย่างไร / เป็นไง', partOfSpeech: 'adverb' },
      { word: 'fine', phonetic: 'ไฟน์', meaning: 'สบายดี', partOfSpeech: 'adjective' },
      { word: 'friend', phonetic: 'เฟรนด์', meaning: 'เพื่อน', partOfSpeech: 'noun' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'walks', thai: 'วอล์คส' },
        { english: 'into', thai: 'อินทู' },
        { english: 'a', thai: 'อะ' },
        { english: 'cafe.', thai: 'คาเฟ่' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'sees', thai: 'ซีส' },
        { english: 'Fon.', thai: 'ฟน' },
      ],
      [
        { english: '"Hello!', thai: 'เฮลโล' },
        { english: 'My', thai: 'มาย' },
        { english: 'name', thai: 'เนม' },
        { english: 'is', thai: 'อิส' },
        { english: 'Bam."', thai: 'แบม' },
      ],
      [
        { english: '"Nice', thai: 'ไนซ์' },
        { english: 'to', thai: 'ทู' },
        { english: 'meet', thai: 'มีท' },
        { english: 'you!', thai: 'ยู' },
        { english: 'I', thai: 'ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'Fon."', thai: 'ฟน' },
      ],
      [
        { english: '"How', thai: 'ฮาว' },
        { english: 'are', thai: 'อาร์' },
        { english: 'you?"', thai: 'ยู' },
      ],
      [
        { english: '"I', thai: 'ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'fine!', thai: 'ไฟน์' },
        { english: 'Let\'s', thai: 'เล็ทส์' },
        { english: 'be', thai: 'บี' },
        { english: 'friends."', thai: 'เฟรนด์ส' },
      ],
    ],
    article_translation:
      'แบมเดินเข้าไปในคาเฟ่ เธอเห็นฟน "สวัสดี! ฉันชื่อแบม" "ยินดีที่ได้เจอ! ฉันชื่อฟน" "เป็นไงบ้าง?" "ฉันสบายดี! มาเป็นเพื่อนกันเถอะ"',
    image_prompt:
      'Two young Thai women meeting for the first time at a cozy Bangkok cafe, smiling and waving hello, warm pastel colors, cute illustration style',
    quiz: [
      {
        question: '"nice" แปลว่าอะไร?',
        options: ['สวัสดี', 'ดี / ยินดี', 'ชื่อ', 'เพื่อน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"friend" แปลว่าอะไร?',
        options: ['พบ', 'สบายดี', 'เพื่อน', 'อย่างไร'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมเจอฟนที่ไหน?',
        options: ['ที่โรงเรียน', 'ที่คาเฟ่', 'ที่บ้าน', 'ที่สวน'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ฟนรู้สึกอย่างไรตอนเจอแบม?',
        options: ['เหนื่อย', 'เศร้า', 'สบายดี', 'โกรธ'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 2: Asking for help (ขอความช่วยเหลือ)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-conversation',
    lesson_order: 2,
    level: 1,
    topic: 'asking-for-help',
    title: 'Asking for Help',
    title_thai: 'ขอความช่วยเหลือ',
    vocabulary: [
      { word: 'help', phonetic: 'เฮลพ์', meaning: 'ช่วย', partOfSpeech: 'verb' },
      { word: 'please', phonetic: 'พลีส', meaning: 'ได้โปรด / กรุณา', partOfSpeech: 'adverb' },
      { word: 'where', phonetic: 'แวร์', meaning: 'ที่ไหน', partOfSpeech: 'adverb' },
      { word: 'find', phonetic: 'ไฟนด์', meaning: 'หา / พบ', partOfSpeech: 'verb' },
      { word: 'lost', phonetic: 'ลอสท์', meaning: 'หลง / หาย', partOfSpeech: 'adjective' },
      { word: 'sure', phonetic: 'ชัวร์', meaning: 'แน่นอน', partOfSpeech: 'adjective' },
      { word: 'follow', phonetic: 'ฟอลโล', meaning: 'ตาม', partOfSpeech: 'verb' },
      { word: 'way', phonetic: 'เวย์', meaning: 'ทาง', partOfSpeech: 'noun' },
    ],
    article_sentences: [
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'is', thai: 'อิส' },
        { english: 'lost', thai: 'ลอสท์' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'mall.', thai: 'มอลล์' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'sees', thai: 'ซีส' },
        { english: 'Ploy.', thai: 'พลอย' },
      ],
      [
        { english: '"Please', thai: 'พลีส' },
        { english: 'help', thai: 'เฮลพ์' },
        { english: 'me.', thai: 'มี' },
        { english: 'Where', thai: 'แวร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'exit?"', thai: 'เอ็กซิท' },
      ],
      [
        { english: '"Sure!', thai: 'ชัวร์' },
        { english: 'Follow', thai: 'ฟอลโล' },
        { english: 'me.', thai: 'มี' },
        { english: 'This', thai: 'ดิส' },
        { english: 'way."', thai: 'เวย์' },
      ],
      [
        { english: '"I', thai: 'ไอ' },
        { english: 'can', thai: 'แคน' },
        { english: 'find', thai: 'ไฟนด์' },
        { english: 'it', thai: 'อิท' },
        { english: 'now.', thai: 'นาว' },
        { english: 'Thank', thai: 'แธงค์' },
        { english: 'you!"', thai: 'ยู' },
      ],
    ],
    article_translation:
      'นัทหลงทางที่ห้าง เขาเห็นพลอย "ช่วยหน่อยได้ไหม ทางออกอยู่ไหน?" "ได้เลย! ตามฉันมา ทางนี้" "ตอนนี้หาเจอแล้ว ขอบคุณ!"',
    image_prompt:
      'A young Thai man looking confused in a shopping mall asking a Thai woman for directions, helpful and friendly atmosphere, cute illustration style',
    quiz: [
      {
        question: '"lost" แปลว่าอะไร?',
        options: ['หา', 'ตาม', 'หลง / หาย', 'ทาง'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"please" แปลว่าอะไร?',
        options: ['แน่นอน', 'ได้โปรด', 'ช่วย', 'ที่ไหน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'นัทหลงทางที่ไหน?',
        options: ['ที่โรงเรียน', 'ที่ห้าง', 'ที่สนามบิน', 'ที่สถานีรถไฟ'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ใครช่วยนัทหาทางออก?',
        options: ['แบม', 'ฟน', 'วิน', 'พลอย'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 3: Saying sorry and thank you (ขอโทษและขอบคุณ)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-conversation',
    lesson_order: 3,
    level: 1,
    topic: 'sorry-and-thank-you',
    title: 'Saying Sorry and Thank You',
    title_thai: 'ขอโทษและขอบคุณ',
    vocabulary: [
      { word: 'sorry', phonetic: 'ซอร์รี', meaning: 'ขอโทษ', partOfSpeech: 'adjective' },
      { word: 'thank', phonetic: 'แธงค์', meaning: 'ขอบคุณ', partOfSpeech: 'verb' },
      { word: 'okay', phonetic: 'โอเค', meaning: 'ไม่เป็นไร / ตกลง', partOfSpeech: 'adjective' },
      { word: 'drop', phonetic: 'ดรอป', meaning: 'ทำตก / ทำหล่น', partOfSpeech: 'verb' },
      { word: 'pick up', phonetic: 'พิคอัพ', meaning: 'หยิบขึ้น', partOfSpeech: 'verb' },
      { word: 'kind', phonetic: 'ไคนด์', meaning: 'ใจดี', partOfSpeech: 'adjective' },
      { word: 'welcome', phonetic: 'เวลคัม', meaning: 'ยินดี (ไม่เป็นไร)', partOfSpeech: 'adjective' },
    ],
    article_sentences: [
      [
        { english: 'Win', thai: 'วิน' },
        { english: 'walks', thai: 'วอล์คส' },
        { english: 'fast', thai: 'ฟาสท์' },
        { english: 'on', thai: 'ออน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'street.', thai: 'สตรีท' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'bumps', thai: 'บัมพ์ส' },
        { english: 'into', thai: 'อินทู' },
        { english: 'Bam.', thai: 'แบม' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'drops', thai: 'ดรอปส์' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'book.', thai: 'บุ๊ค' },
      ],
      [
        { english: '"Oh!', thai: 'โอ' },
        { english: 'I', thai: 'ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'sorry!"', thai: 'ซอร์รี' },
      ],
      [
        { english: 'Win', thai: 'วิน' },
        { english: 'picks', thai: 'พิคส์' },
        { english: 'up', thai: 'อัพ' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'book.', thai: 'บุ๊ค' },
      ],
      [
        { english: '"Thank', thai: 'แธงค์' },
        { english: 'you!', thai: 'ยู' },
        { english: 'You', thai: 'ยู' },
        { english: 'are', thai: 'อาร์' },
        { english: 'kind."', thai: 'ไคนด์' },
      ],
    ],
    article_translation:
      'วินเดินเร็วบนถนน เขาชนแบม แบมทำหนังสือตก "โอ้! ขอโทษ!" วินหยิบหนังสือขึ้นมา "ขอบคุณ! คุณใจดีจัง"',
    image_prompt:
      'A Thai young man apologizing after accidentally bumping into a Thai woman on a Bangkok street, he picks up her dropped book, polite and friendly, cute illustration style',
    quiz: [
      {
        question: '"sorry" แปลว่าอะไร?',
        options: ['ขอบคุณ', 'ขอโทษ', 'ใจดี', 'ยินดี'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"kind" แปลว่าอะไร?',
        options: ['ตกลง', 'ทำตก', 'ใจดี', 'หยิบขึ้น'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมทำอะไรตก?',
        options: ['โทรศัพท์', 'กระเป๋า', 'หนังสือ', 'แก้วน้ำ'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'วินทำอะไรหลังจากชนแบม?',
        options: ['เดินหนี', 'หยิบหนังสือขึ้นมา', 'หัวเราะ', 'นั่งลง'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 4: Making plans together (วางแผนด้วยกัน)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-conversation',
    lesson_order: 4,
    level: 1,
    topic: 'making-plans',
    title: 'Making Plans Together',
    title_thai: 'วางแผนด้วยกัน',
    vocabulary: [
      { word: 'plan', phonetic: 'แพลน', meaning: 'แผน / วางแผน', partOfSpeech: 'noun' },
      { word: 'together', phonetic: 'ทูเก็ทเธอะ', meaning: 'ด้วยกัน', partOfSpeech: 'adverb' },
      { word: 'when', phonetic: 'เว็น', meaning: 'เมื่อไหร่', partOfSpeech: 'adverb' },
      { word: 'tomorrow', phonetic: 'ทูมอร์โร', meaning: 'พรุ่งนี้', partOfSpeech: 'noun' },
      { word: 'movie', phonetic: 'มูฟวี่', meaning: 'หนัง', partOfSpeech: 'noun' },
      { word: 'great', phonetic: 'เกรท', meaning: 'เยี่ยม', partOfSpeech: 'adjective' },
      { word: 'free', phonetic: 'ฟรี', meaning: 'ว่าง', partOfSpeech: 'adjective' },
      { word: 'fun', phonetic: 'ฟัน', meaning: 'สนุก', partOfSpeech: 'adjective' },
    ],
    article_sentences: [
      [
        { english: 'Fon', thai: 'ฟน' },
        { english: 'sends', thai: 'เซนด์ส' },
        { english: 'a', thai: 'อะ' },
        { english: 'LINE', thai: 'ไลน์' },
        { english: 'message', thai: 'เมสเสจ' },
        { english: 'to', thai: 'ทู' },
        { english: 'Ploy.', thai: 'พลอย' },
      ],
      [
        { english: '"Are', thai: 'อาร์' },
        { english: 'you', thai: 'ยู' },
        { english: 'free', thai: 'ฟรี' },
        { english: 'tomorrow?"', thai: 'ทูมอร์โร' },
      ],
      [
        { english: '"Yes!', thai: 'เยส' },
        { english: 'What', thai: 'วอท' },
        { english: 'is', thai: 'อิส' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'plan?"', thai: 'แพลน' },
      ],
      [
        { english: '"Let\'s', thai: 'เล็ทส์' },
        { english: 'watch', thai: 'วอทช์' },
        { english: 'a', thai: 'อะ' },
        { english: 'movie', thai: 'มูฟวี่' },
        { english: 'together."', thai: 'ทูเก็ทเธอะ' },
      ],
      [
        { english: '"Great!', thai: 'เกรท' },
        { english: 'That', thai: 'แดท' },
        { english: 'sounds', thai: 'ซาวนด์ส' },
        { english: 'fun!"', thai: 'ฟัน' },
      ],
    ],
    article_translation:
      'ฟนส่งข้อความไลน์หาพลอย "พรุ่งนี้ว่างไหม?" "ว่าง! มีแผนอะไร?" "ไปดูหนังด้วยกันไหม" "เยี่ยม! ฟังดูสนุก!"',
    image_prompt:
      'Two Thai young women chatting on LINE app planning to watch a movie together, phone screen showing chat bubbles, happy and excited, cute illustration style',
    quiz: [
      {
        question: '"tomorrow" แปลว่าอะไร?',
        options: ['วันนี้', 'เมื่อวาน', 'พรุ่งนี้', 'สัปดาห์หน้า'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"together" แปลว่าอะไร?',
        options: ['คนเดียว', 'ด้วยกัน', 'เยี่ยม', 'สนุก'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ฟนติดต่อพลอยผ่านอะไร?',
        options: ['โทรศัพท์', 'อีเมล', 'ไลน์', 'เฟซบุ๊ก'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ฟนกับพลอยจะทำอะไรด้วยกัน?',
        options: ['ไปกินข้าว', 'ไปดูหนัง', 'ไปเที่ยวทะเล', 'ไปซื้อของ'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 5: Talking about the weather (คุยเรื่องอากาศ)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-conversation',
    lesson_order: 5,
    level: 1,
    topic: 'weather-talk',
    title: 'Talking About the Weather',
    title_thai: 'คุยเรื่องอากาศ',
    vocabulary: [
      { word: 'weather', phonetic: 'เวทเธอะ', meaning: 'อากาศ', partOfSpeech: 'noun' },
      { word: 'hot', phonetic: 'ฮอท', meaning: 'ร้อน', partOfSpeech: 'adjective' },
      { word: 'rain', phonetic: 'เรน', meaning: 'ฝน / ฝนตก', partOfSpeech: 'noun' },
      { word: 'today', phonetic: 'ทูเดย์', meaning: 'วันนี้', partOfSpeech: 'adverb' },
      { word: 'cold', phonetic: 'โคลด์', meaning: 'หนาว / เย็น', partOfSpeech: 'adjective' },
      { word: 'umbrella', phonetic: 'อัมเบรลล่า', meaning: 'ร่ม', partOfSpeech: 'noun' },
      { word: 'need', phonetic: 'นีด', meaning: 'ต้องการ', partOfSpeech: 'verb' },
    ],
    article_sentences: [
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'Win', thai: 'วิน' },
        { english: 'sit', thai: 'ซิท' },
        { english: 'at', thai: 'แอท' },
        { english: 'school.', thai: 'สคูล' },
      ],
      [
        { english: '"It', thai: 'อิท' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี่' },
        { english: 'hot', thai: 'ฮอท' },
        { english: 'today!"', thai: 'ทูเดย์' },
      ],
      [
        { english: '"Yes.', thai: 'เยส' },
        { english: 'But', thai: 'บัท' },
        { english: 'I', thai: 'ไอ' },
        { english: 'think', thai: 'ธิงค์' },
        { english: 'rain', thai: 'เรน' },
        { english: 'is', thai: 'อิส' },
        { english: 'coming."', thai: 'คัมมิง' },
      ],
      [
        { english: '"Do', thai: 'ดู' },
        { english: 'you', thai: 'ยู' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'an', thai: 'แอน' },
        { english: 'umbrella?"', thai: 'อัมเบรลล่า' },
      ],
      [
        { english: '"No.', thai: 'โน' },
        { english: 'I', thai: 'ไอ' },
        { english: 'need', thai: 'นีด' },
        { english: 'one!"', thai: 'วัน' },
      ],
      [
        { english: '"Here.', thai: 'เฮียร์' },
        { english: 'We', thai: 'วี' },
        { english: 'can', thai: 'แคน' },
        { english: 'share."', thai: 'แชร์' },
      ],
    ],
    article_translation:
      'นัทกับวินนั่งอยู่ที่โรงเรียน "วันนี้ร้อนมาก!" "ใช่ แต่ฉันว่าฝนกำลังจะตก" "มีร่มไหม?" "ไม่มี ต้องหาซักคัน!" "เอานี่ ใช้ร่วมกันได้"',
    image_prompt:
      'Two Thai teenage boys sitting at a school bench looking at a cloudy sky, one offering to share an umbrella, tropical weather, cute illustration style',
    quiz: [
      {
        question: '"hot" แปลว่าอะไร?',
        options: ['หนาว', 'ร้อน', 'ฝน', 'ร่ม'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"umbrella" แปลว่าอะไร?',
        options: ['ร่ม', 'ฝน', 'อากาศ', 'หนาว'],
        correctIndex: 0,
        type: 'vocab',
      },
      {
        question: 'อากาศวันนี้เป็นอย่างไร?',
        options: ['หนาว', 'ร้อนมาก', 'ฝนตก', 'มีหิมะ'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'วินเสนอทำอะไรให้นัท?',
        options: ['ซื้อร่มให้', 'ใช้ร่มร่วมกัน', 'พากลับบ้าน', 'โทรหาแม่'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Lesson 6: Goodbye and see you (ลาก่อนแล้วเจอกัน)
  // ─────────────────────────────────────────────
  {
    module_id: 'core-a1-conversation',
    lesson_order: 6,
    level: 1,
    topic: 'goodbye-see-you',
    title: 'Goodbye and See You',
    title_thai: 'ลาก่อนแล้วเจอกัน',
    vocabulary: [
      { word: 'goodbye', phonetic: 'กู๊ดบาย', meaning: 'ลาก่อน', partOfSpeech: 'interjection' },
      { word: 'see', phonetic: 'ซี', meaning: 'เจอ / เห็น', partOfSpeech: 'verb' },
      { word: 'later', phonetic: 'เลเทอะ', meaning: 'ทีหลัง', partOfSpeech: 'adverb' },
      { word: 'miss', phonetic: 'มิส', meaning: 'คิดถึง', partOfSpeech: 'verb' },
      { word: 'soon', phonetic: 'ซูน', meaning: 'เร็ว ๆ นี้', partOfSpeech: 'adverb' },
      { word: 'home', phonetic: 'โฮม', meaning: 'บ้าน', partOfSpeech: 'noun' },
      { word: 'take care', phonetic: 'เทคแคร์', meaning: 'ดูแลตัวด้วย', partOfSpeech: 'verb' },
      { word: 'again', phonetic: 'อะเกน', meaning: 'อีกครั้ง', partOfSpeech: 'adverb' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'finish', thai: 'ฟินิช' },
        { english: 'dinner.', thai: 'ดินเนอะ' },
      ],
      [
        { english: '"I', thai: 'ไอ' },
        { english: 'must', thai: 'มัสท์' },
        { english: 'go', thai: 'โก' },
        { english: 'home', thai: 'โฮม' },
        { english: 'now."', thai: 'นาว' },
      ],
      [
        { english: '"Okay.', thai: 'โอเค' },
        { english: 'Goodbye!', thai: 'กู๊ดบาย' },
        { english: 'Take', thai: 'เทค' },
        { english: 'care."', thai: 'แคร์' },
      ],
      [
        { english: '"See', thai: 'ซี' },
        { english: 'you', thai: 'ยู' },
        { english: 'again', thai: 'อะเกน' },
        { english: 'soon!"', thai: 'ซูน' },
      ],
      [
        { english: '"I', thai: 'ไอ' },
        { english: 'will', thai: 'วิล' },
        { english: 'miss', thai: 'มิส' },
        { english: 'you.', thai: 'ยู' },
        { english: 'See', thai: 'ซี' },
        { english: 'you', thai: 'ยู' },
        { english: 'later!"', thai: 'เลเทอะ' },
      ],
    ],
    article_translation:
      'แบมกับพลอยทานข้าวเย็นเสร็จ "ฉันต้องกลับบ้านแล้ว" "ตกลง ลาก่อน! ดูแลตัวด้วยนะ" "ไว้เจอกันอีกเร็ว ๆ นี้!" "จะคิดถึงนะ แล้วเจอกันทีหลัง!"',
    image_prompt:
      'Two Thai young women waving goodbye to each other after dinner at a Thai restaurant at night, warm street lights, friendly farewell, cute illustration style',
    quiz: [
      {
        question: '"goodbye" แปลว่าอะไร?',
        options: ['สวัสดี', 'ลาก่อน', 'คิดถึง', 'ดูแลตัว'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"miss" แปลว่าอะไร?',
        options: ['เจอ', 'กลับบ้าน', 'คิดถึง', 'เร็ว ๆ นี้'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมกับพลอยทำอะไรก่อนลากัน?',
        options: ['ดูหนัง', 'ทานข้าวเย็น', 'ไปเดินเล่น', 'ไปช้อปปิ้ง'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'พลอยพูดอะไรตอนแบมจะกลับ?',
        options: ['อย่าเพิ่งไป', 'ลาก่อน ดูแลตัวด้วย', 'ฉันจะไปด้วย', 'ไม่ต้องกลับ'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },
];
