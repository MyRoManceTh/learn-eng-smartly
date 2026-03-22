import { LessonSeedData } from './core-a1-greetings';

export const corePreFirstwordsLessons: LessonSeedData[] = [
  // ==========================================
  // Lesson 1: Yes, No, Please, Thank You
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 1,
    level: 0,
    topic: 'Yes, No, Please, Thank You',
    title: 'Magic Words',
    title_thai: 'คำวิเศษ',
    vocabulary: [
      { word: 'yes', phonetic: 'เยส', meaning: 'ใช่ / ตกลง', partOfSpeech: 'adv.' },
      { word: 'no', phonetic: 'โน', meaning: 'ไม่ / ไม่ใช่', partOfSpeech: 'adv.' },
      { word: 'please', phonetic: 'พลีส', meaning: 'ได้โปรด / กรุณา', partOfSpeech: 'adv.' },
      { word: 'thank you', phonetic: 'แธงค์ยู', meaning: 'ขอบคุณ', partOfSpeech: 'phr.' },
      { word: 'sorry', phonetic: 'ซอร์รี', meaning: 'ขอโทษ', partOfSpeech: 'interj.' },
      { word: 'excuse me', phonetic: 'เอ็กซ์คิวสมี', meaning: 'ขอโทษ (ขอทาง)', partOfSpeech: 'phr.' },
      { word: 'okay', phonetic: 'โอเค', meaning: 'โอเค / ดีแล้ว', partOfSpeech: 'adv.' },
      { word: 'help', phonetic: 'เฮลพ์', meaning: 'ช่วย / ช่วยเหลือ', partOfSpeech: 'v.' },
      { word: 'again', phonetic: 'อะเกน', meaning: 'อีกครั้ง', partOfSpeech: 'adv.' },
      { word: 'understand', phonetic: 'อันเดอสแตนด์', meaning: 'เข้าใจ', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Nong', thai: 'น้อง' },
        { english: 'wants', thai: 'วอนทส์' },
        { english: 'water.', thai: 'วอเตอร์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Water,', thai: '"วอเตอร์,' },
        { english: 'please."', thai: 'พลีส."' },
      ],
      [
        { english: 'Her', thai: 'เฮอร์' },
        { english: 'friend', thai: 'เฟรนด์' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Yes!', thai: '"เยส!' },
        { english: 'Here', thai: 'เฮียร์' },
        { english: 'you', thai: 'ยู' },
        { english: 'go."', thai: 'โก."' },
      ],
      [
        { english: 'Nong', thai: 'น้อง' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Thank', thai: '"แธงค์' },
        { english: 'you!"', thai: 'ยู!"' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'does', thai: 'ดัส' },
        { english: 'not', thai: 'น็อท' },
        { english: 'understand.', thai: 'อันเดอสแตนด์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"Sorry,', thai: '"ซอร์รี,' },
        { english: 'can', thai: 'แคน' },
        { english: 'you', thai: 'ยู' },
        { english: 'say', thai: 'เซ' },
        { english: 'that', thai: 'แดท' },
        { english: 'again?"', thai: 'อะเกน?"' },
      ],
    ],
    article_translation:
      'น้องอยากได้น้ำ เธอพูดว่า "ขอน้ำหน่อยได้โปรด" เพื่อนของเธอพูดว่า "ได้เลย! นี่เลย" น้องพูดว่า "ขอบคุณ!" เธอไม่เข้าใจ เธอถามว่า "ขอโทษ พูดอีกครั้งได้ไหม?"',
    image_prompt: 'Two Thai children sharing a drink, one says thank you politely, bright cheerful scene',
    quiz: [
      {
        question: '"Please" ใช้เพื่ออะไร?',
        options: ['พูดขอบคุณ', 'ขอสิ่งของอย่างสุภาพ', 'บอกว่าไม่', 'ทักทาย'],
        correctIndex: 1,
        explanation: '"Please" ใช้เมื่อขอสิ่งของหรือขอความช่วยเหลืออย่างสุภาพ เช่น "Water, please."',
      },
      {
        question: 'ถ้าไม่เข้าใจ ควรพูดว่าอะไร?',
        options: ['Thank you', 'Okay', 'Can you say that again?', 'Yes'],
        correctIndex: 2,
        explanation: '"Can you say that again?" แปลว่า "พูดอีกครั้งได้ไหม?" ใช้เมื่อไม่เข้าใจ',
      },
      {
        question: '"Sorry" แปลว่าอะไร?',
        options: ['ขอบคุณ', 'โอเค', 'ขอโทษ', 'ได้โปรด'],
        correctIndex: 2,
        explanation: '"Sorry" แปลว่า "ขอโทษ" ใช้เมื่อทำผิดหรือต้องการขอโทษ',
      },
      {
        question: '"No" แปลว่าอะไร?',
        options: ['ใช่', 'ไม่', 'โอเค', 'ขอบคุณ'],
        correctIndex: 1,
        explanation: '"No" แปลว่า "ไม่" หรือ "ไม่ใช่" ตรงข้ามกับ "Yes"',
      },
    ],
  },

  // ==========================================
  // Lesson 2: My name is... / I am...
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 2,
    level: 0,
    topic: 'My name is... / I am...',
    title: 'Nice to Meet You',
    title_thai: 'ยินดีที่ได้รู้จัก',
    vocabulary: [
      { word: 'name', phonetic: 'เนม', meaning: 'ชื่อ', partOfSpeech: 'n.' },
      { word: 'I', phonetic: 'ไอ', meaning: 'ฉัน / ผม', partOfSpeech: 'pron.' },
      { word: 'am', phonetic: 'แอม', meaning: 'เป็น / คือ (ใช้กับ I)', partOfSpeech: 'v.' },
      { word: 'my', phonetic: 'มาย', meaning: 'ของฉัน', partOfSpeech: 'pron.' },
      { word: 'you', phonetic: 'ยู', meaning: 'คุณ / เธอ', partOfSpeech: 'pron.' },
      { word: 'your', phonetic: 'ยัวร์', meaning: 'ของคุณ', partOfSpeech: 'pron.' },
      { word: 'is', phonetic: 'อิส', meaning: 'เป็น / คือ', partOfSpeech: 'v.' },
      { word: 'meet', phonetic: 'มีท', meaning: 'พบ / รู้จัก', partOfSpeech: 'v.' },
      { word: 'nice', phonetic: 'ไนส์', meaning: 'ดี / น่ายินดี', partOfSpeech: 'adj.' },
      { word: 'from', phonetic: 'ฟรอม', meaning: 'มาจาก', partOfSpeech: 'prep.' },
    ],
    article_sentences: [
      [
        { english: 'My', thai: 'มาย' },
        { english: 'name', thai: 'เนม' },
        { english: 'is', thai: 'อิส' },
        { english: 'Ploy.', thai: 'พลอย' },
      ],
      [
        { english: 'I', thai: 'ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'from', thai: 'ฟรอม' },
        { english: 'Thailand.', thai: 'ไทยแลนด์' },
      ],
      [
        { english: 'A', thai: 'อะ' },
        { english: 'boy', thai: 'บอย' },
        { english: 'walks', thai: 'วอล์คส' },
        { english: 'in.', thai: 'อิน' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Hi!', thai: '"ไฮ!' },
        { english: 'My', thai: 'มาย' },
        { english: 'name', thai: 'เนม' },
        { english: 'is', thai: 'อิส' },
        { english: 'Mark."', thai: 'มาร์ค."' },
      ],
      [
        { english: 'Ploy', thai: 'พลอย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Nice', thai: '"ไนส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'meet', thai: 'มีท' },
        { english: 'you!"', thai: 'ยู!"' },
      ],
      [
        { english: 'Mark', thai: 'มาร์ค' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"What', thai: '"วอท' },
        { english: 'is', thai: 'อิส' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'name?"', thai: 'เนม?"' },
      ],
    ],
    article_translation:
      'ชื่อของฉันคือพลอย ฉันมาจากประเทศไทย เด็กผู้ชายคนหนึ่งเดินเข้ามา เขาพูดว่า "สวัสดี! ชื่อของฉันคือมาร์ค" พลอยพูดว่า "ยินดีที่ได้รู้จัก!" มาร์คถามว่า "ชื่อของคุณคืออะไร?"',
    image_prompt: 'Two students introducing themselves in a classroom, smiling and shaking hands',
    quiz: [
      {
        question: '"My name is Ploy." แปลว่าอะไร?',
        options: ['ฉันชอบพลอย', 'ชื่อของฉันคือพลอย', 'พลอยเป็นเพื่อนของฉัน', 'ฉันรู้จักพลอย'],
        correctIndex: 1,
        explanation: '"My name is..." แปลว่า "ชื่อของฉันคือ..." เป็นวิธีแนะนำตัวเองขั้นพื้นฐาน',
      },
      {
        question: 'ถ้าอยากถามชื่อคนอื่น ควรพูดว่าอะไร?',
        options: ['What is your name?', 'I am from Thailand.', 'Nice to meet you.', 'My name is Mark.'],
        correctIndex: 0,
        explanation: '"What is your name?" แปลว่า "ชื่อของคุณคืออะไร?" ใช้เมื่อถามชื่อคนอื่น',
      },
      {
        question: '"I am from Thailand." แปลว่าอะไร?',
        options: ['ฉันชอบประเทศไทย', 'ฉันไปประเทศไทย', 'ฉันมาจากประเทศไทย', 'ประเทศไทยสวยงาม'],
        correctIndex: 2,
        explanation: '"I am from..." แปลว่า "ฉันมาจาก..." ใช้บอกว่ามาจากที่ไหน',
      },
      {
        question: '"Nice to meet you!" ใช้ในสถานการณ์ใด?',
        options: ['เมื่อลาจาก', 'เมื่อพบคนครั้งแรก', 'เมื่อขอบคุณ', 'เมื่อขอโทษ'],
        correctIndex: 1,
        explanation: '"Nice to meet you!" แปลว่า "ยินดีที่ได้รู้จัก!" ใช้เมื่อพบคนเป็นครั้งแรก',
      },
    ],
  },

  // ==========================================
  // Lesson 3: This, That, Here, There
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 3,
    level: 0,
    topic: 'This, That, Here, There',
    title: 'Point and Say',
    title_thai: 'ชี้และพูด',
    vocabulary: [
      { word: 'this', phonetic: 'ดิส', meaning: 'นี่ / อันนี้ (ใกล้)', partOfSpeech: 'pron.' },
      { word: 'that', phonetic: 'แดท', meaning: 'นั่น / อันนั้น (ไกล)', partOfSpeech: 'pron.' },
      { word: 'here', phonetic: 'เฮียร์', meaning: 'ที่นี่ / ตรงนี้', partOfSpeech: 'adv.' },
      { word: 'there', phonetic: 'แดร์', meaning: 'ที่นั่น / ตรงนั้น', partOfSpeech: 'adv.' },
      { word: 'these', phonetic: 'ดีส', meaning: 'เหล่านี้ (พหูพจน์)', partOfSpeech: 'pron.' },
      { word: 'those', phonetic: 'โธส', meaning: 'เหล่านั้น (พหูพจน์)', partOfSpeech: 'pron.' },
      { word: 'what', phonetic: 'วอท', meaning: 'อะไร', partOfSpeech: 'pron.' },
      { word: 'where', phonetic: 'แวร์', meaning: 'ที่ไหน', partOfSpeech: 'adv.' },
      { word: 'look', phonetic: 'ลุค', meaning: 'ดู / มอง', partOfSpeech: 'v.' },
      { word: 'put', phonetic: 'พุท', meaning: 'วาง', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Kai', thai: 'ไก่' },
        { english: 'is', thai: 'อิส' },
        { english: 'in', thai: 'อิน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'kitchen.', thai: 'คิทเชิน' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"This', thai: '"ดิส' },
        { english: 'is', thai: 'อิส' },
        { english: 'my', thai: 'มาย' },
        { english: 'cup."', thai: 'คัพ."' },
      ],
      [
        { english: '"What', thai: '"วอท' },
        { english: 'is', thai: 'อิส' },
        { english: 'that?"', thai: 'แดท?"' },
        { english: 'she', thai: 'ชี' },
        { english: 'asks.', thai: 'อาสค์ส' },
      ],
      [
        { english: '"Put', thai: '"พุท' },
        { english: 'it', thai: 'อิท' },
        { english: 'here,"', thai: 'เฮียร์,"' },
        { english: 'says', thai: 'เซส์' },
        { english: 'Mum.', thai: 'มัม' },
      ],
      [
        { english: '"Look', thai: '"ลุค' },
        { english: 'over', thai: 'โอเวอร์' },
        { english: 'there!"', thai: 'แดร์!"' },
        { english: 'Kai', thai: 'ไก่' },
        { english: 'shouts.', thai: 'เชาทส์' },
      ],
      [
        { english: 'Those', thai: 'โธส' },
        { english: 'are', thai: 'อาร์' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'cookies!', thai: 'คุกกี้ส์!' },
      ],
    ],
    article_translation:
      'ไก่อยู่ในครัว เธอพูดว่า "นี่คือแก้วของฉัน" "นั่นคืออะไร?" เธอถาม "วางตรงนี้" แม่พูด "ดูที่นั่น!" ไก่ตะโกน นั่นคือคุกกี้ของเธอ!',
    image_prompt: 'Child pointing at objects in a kitchen, looking curious and happy, colorful items on the counter',
    quiz: [
      {
        question: '"This" และ "That" ต่างกันอย่างไร?',
        options: [
          '"This" ใช้กับของพหูพจน์ "That" ใช้กับของเอกพจน์',
          '"This" ใช้กับของใกล้ "That" ใช้กับของไกล',
          '"This" ใช้กับคน "That" ใช้กับสิ่งของ',
          'ไม่ต่างกัน',
        ],
        correctIndex: 1,
        explanation: '"This" ใช้ชี้สิ่งของที่อยู่ใกล้ ส่วน "That" ใช้ชี้สิ่งของที่อยู่ไกลออกไป',
      },
      {
        question: '"Where is my bag?" แปลว่าอะไร?',
        options: ['กระเป๋าของฉันคืออะไร', 'กระเป๋าของฉันอยู่ที่ไหน', 'ฉันมีกระเป๋า', 'กระเป๋าของฉันใหม่'],
        correctIndex: 1,
        explanation: '"Where" แปลว่า "ที่ไหน" ดังนั้น "Where is my bag?" = "กระเป๋าของฉันอยู่ที่ไหน?"',
      },
      {
        question: '"Put it here." แปลว่าอะไร?',
        options: ['วางที่นั่น', 'วางตรงนี้', 'เอามาที่นี่', 'ดูตรงนี้'],
        correctIndex: 1,
        explanation: '"Here" แปลว่า "ตรงนี้ / ที่นี่" ดังนั้น "Put it here" = "วางตรงนี้"',
      },
      {
        question: '"Those" ใช้แทน "That" เมื่อไหร่?',
        options: ['เมื่อพูดถึงสิ่งของใกล้ๆ', 'เมื่อพูดถึงสิ่งของมากกว่าหนึ่งชิ้น', 'เมื่อถามคำถาม', 'เมื่อพูดถึงคน'],
        correctIndex: 1,
        explanation: '"Those" คือรูปพหูพจน์ของ "That" ใช้เมื่อพูดถึงสิ่งของหลายชิ้นที่อยู่ไกล',
      },
    ],
  },

  // ==========================================
  // Lesson 4: Big, Small, Good, Bad
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 4,
    level: 0,
    topic: 'Big, Small, Good, Bad',
    title: 'Describe the World',
    title_thai: 'บรรยายโลกรอบตัว',
    vocabulary: [
      { word: 'big', phonetic: 'บิก', meaning: 'ใหญ่', partOfSpeech: 'adj.' },
      { word: 'small', phonetic: 'สมอล', meaning: 'เล็ก', partOfSpeech: 'adj.' },
      { word: 'good', phonetic: 'กู๊ด', meaning: 'ดี', partOfSpeech: 'adj.' },
      { word: 'bad', phonetic: 'แบด', meaning: 'แย่ / ไม่ดี', partOfSpeech: 'adj.' },
      { word: 'hot', phonetic: 'ฮอท', meaning: 'ร้อน', partOfSpeech: 'adj.' },
      { word: 'cold', phonetic: 'โคลด์', meaning: 'เย็น / หนาว', partOfSpeech: 'adj.' },
      { word: 'fast', phonetic: 'ฟาสท์', meaning: 'เร็ว', partOfSpeech: 'adj.' },
      { word: 'slow', phonetic: 'สโลว์', meaning: 'ช้า', partOfSpeech: 'adj.' },
      { word: 'new', phonetic: 'นิว', meaning: 'ใหม่', partOfSpeech: 'adj.' },
      { word: 'old', phonetic: 'โอลด์', meaning: 'เก่า / แก่', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Mee', thai: 'หมี' },
        { english: 'has', thai: 'แฮส' },
        { english: 'two', thai: 'ทู' },
        { english: 'dogs.', thai: 'ด็อกส์' },
      ],
      [
        { english: 'One', thai: 'วัน' },
        { english: 'dog', thai: 'ด็อก' },
        { english: 'is', thai: 'อิส' },
        { english: 'big.', thai: 'บิก' },
        { english: 'One', thai: 'วัน' },
        { english: 'dog', thai: 'ด็อก' },
        { english: 'is', thai: 'อิส' },
        { english: 'small.', thai: 'สมอล' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'big', thai: 'บิก' },
        { english: 'dog', thai: 'ด็อก' },
        { english: 'is', thai: 'อิส' },
        { english: 'fast.', thai: 'ฟาสท์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'small', thai: 'สมอล' },
        { english: 'dog', thai: 'ด็อก' },
        { english: 'is', thai: 'อิส' },
        { english: 'slow', thai: 'สโลว์' },
        { english: 'but', thai: 'บัท' },
        { english: 'good.', thai: 'กู๊ด' },
      ],
      [
        { english: 'Today', thai: 'ทูเดย์' },
        { english: 'is', thai: 'อิส' },
        { english: 'hot.', thai: 'ฮอท' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'cold', thai: 'โคลด์' },
        { english: 'water', thai: 'วอเตอร์' },
        { english: 'is', thai: 'อิส' },
        { english: 'very', thai: 'เวรี่' },
        { english: 'good!', thai: 'กู๊ด!' },
      ],
    ],
    article_translation:
      'หมีมีสุนัขสองตัว สุนัขตัวหนึ่งตัวใหญ่ อีกตัวหนึ่งตัวเล็ก สุนัขตัวใหญ่วิ่งเร็ว สุนัขตัวเล็กวิ่งช้าแต่ดีมาก วันนี้อากาศร้อน น้ำเย็นอร่อยมาก!',
    image_prompt: 'Two dogs of different sizes playing in a sunny Thai garden, one big and energetic, one small and calm',
    quiz: [
      {
        question: '"Big" ตรงข้ามกับคำว่าอะไร?',
        options: ['Good', 'Fast', 'Small', 'Old'],
        correctIndex: 2,
        explanation: '"Big" แปลว่า "ใหญ่" ตรงข้ามกับ "Small" ซึ่งแปลว่า "เล็ก"',
      },
      {
        question: '"The weather is cold." แปลว่าอะไร?',
        options: ['อากาศดี', 'อากาศร้อน', 'อากาศหนาว', 'อากาศเย็น'],
        correctIndex: 2,
        explanation: '"Cold" แปลว่า "เย็น / หนาว" ดังนั้น "The weather is cold" = "อากาศหนาว"',
      },
      {
        question: 'คำใดเป็น adjective (คำคุณศัพท์) ทั้งหมด?',
        options: ['run, jump, walk', 'big, good, fast', 'I, you, he', 'and, but, or'],
        correctIndex: 1,
        explanation: 'Big (ใหญ่), good (ดี), fast (เร็ว) ล้วนเป็นคำคุณศัพท์ที่ใช้บรรยายลักษณะ',
      },
      {
        question: '"New" ตรงข้ามกับคำว่าอะไร?',
        options: ['Bad', 'Hot', 'Old', 'Slow'],
        correctIndex: 2,
        explanation: '"New" แปลว่า "ใหม่" ตรงข้ามกับ "Old" ซึ่งแปลว่า "เก่า"',
      },
    ],
  },
];
