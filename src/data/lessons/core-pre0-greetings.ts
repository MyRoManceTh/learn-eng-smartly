import { LessonSeedData } from './core-a1-greetings';

export const corePreGreetingsLessons: LessonSeedData[] = [
  // ==========================================
  // Lesson 1: Hello and Goodbye
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 1,
    level: 0,
    topic: 'Hello and Goodbye',
    title: 'Hi! Bye!',
    title_thai: 'สวัสดี! ลาก่อน!',
    vocabulary: [
      { word: 'hi', phonetic: 'ไฮ', meaning: 'สวัสดี (ไม่เป็นทางการ)', partOfSpeech: 'interj.' },
      { word: 'hello', phonetic: 'เฮลโล', meaning: 'สวัสดี', partOfSpeech: 'interj.' },
      { word: 'bye', phonetic: 'บาย', meaning: 'บ๊ายบาย', partOfSpeech: 'interj.' },
      { word: 'goodbye', phonetic: 'กู๊ดบาย', meaning: 'ลาก่อน', partOfSpeech: 'interj.' },
    ],
    article_sentences: [
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'sees', thai: 'ซีส์' },
        { english: 'Noi.', thai: 'น้อย' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Hi!"', thai: '"ไฮ!"' },
      ],
      [
        { english: 'Noi', thai: 'น้อย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Hello!"', thai: '"เฮลโล!"' },
      ],
      [
        { english: 'Later,', thai: 'เลเตอร์,' },
        { english: 'Noi', thai: 'น้อย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Goodbye!"', thai: '"กู๊ดบาย!"' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Bye!"', thai: '"บาย!"' },
      ],
    ],
    article_translation:
      'ส้มเห็นน้อย ส้มพูดว่า "สวัสดี!" น้อยพูดว่า "สวัสดี!" ต่อมา น้อยพูดว่า "ลาก่อน!" ส้มพูดว่า "บ๊ายบาย!"',
    image_prompt: 'Two Thai children Som and Noi waving hello and goodbye to each other at a Thai school gate, cute cartoon style',
    quiz: [
      {
        question: 'hello แปลว่าอะไร?',
        options: ['ลาก่อน', 'สวัสดี', 'ขอบคุณ', 'ขอโทษ'],
        correctIndex: 1,
        explanation: 'hello แปลว่า สวัสดี',
      },
      {
        question: 'goodbye แปลว่าอะไร?',
        options: ['สวัสดี', 'ยินดีต้อนรับ', 'ลาก่อน', 'แล้วเจอกัน'],
        correctIndex: 2,
        explanation: 'goodbye แปลว่า ลาก่อน',
      },
      {
        question: 'ถ้าจะทักทายเพื่อนแบบไม่เป็นทางการ พูดว่าอะไร?',
        options: ['goodbye', 'hi', 'bye', 'later'],
        correctIndex: 1,
        explanation: 'hi ใช้ทักทายแบบไม่เป็นทางการ',
      },
      {
        question: 'bye กับ goodbye แปลว่าอะไรเหมือนกัน?',
        options: ['สวัสดี', 'ลาก่อน', 'ขอบคุณ', 'ยินดีต้อนรับ'],
        correctIndex: 1,
        explanation: 'ทั้ง bye และ goodbye แปลว่า ลาก่อน',
      },
    ],
  },

  // ==========================================
  // Lesson 2: How Are You?
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 2,
    level: 0,
    topic: 'How Are You?',
    title: 'I Am Fine',
    title_thai: 'ฉันสบายดี',
    vocabulary: [
      { word: 'fine', phonetic: 'ไฟน์', meaning: 'ดี / สบายดี', partOfSpeech: 'adj.' },
      { word: 'happy', phonetic: 'แฮปปี้', meaning: 'มีความสุข', partOfSpeech: 'adj.' },
      { word: 'sad', phonetic: 'แซด', meaning: 'เศร้า', partOfSpeech: 'adj.' },
      { word: 'tired', phonetic: 'ไทเออร์ด', meaning: 'เหนื่อย', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Chai', thai: 'ชาย' },
        { english: 'asks,', thai: 'อาสกส์,' },
        { english: '"How', thai: '"ฮาว' },
        { english: 'are', thai: 'อาร์' },
        { english: 'you?"', thai: 'ยู?"' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'fine!"', thai: 'ไฟน์!"' },
      ],
      [
        { english: 'Noi', thai: 'น้อย' },
        { english: 'is', thai: 'อิส' },
        { english: 'happy', thai: 'แฮปปี้' },
        { english: 'today.', thai: 'ทูเดย์' },
      ],
      [
        { english: 'Chai', thai: 'ชาย' },
        { english: 'is', thai: 'อิส' },
        { english: 'tired.', thai: 'ไทเออร์ด' },
      ],
    ],
    article_translation:
      'ชายถามว่า "คุณเป็นยังไงบ้าง?" ส้มพูดว่า "ฉันสบายดี!" น้อยมีความสุขวันนี้ ชายรู้สึกเหนื่อย',
    image_prompt: 'Thai children asking and answering "How are you?" with emotion expression cards, happy, sad, tired, fine, cartoon style',
    quiz: [
      {
        question: '"How are you?" แปลว่าอะไร?',
        options: ['ชื่ออะไร?', 'คุณเป็นยังไงบ้าง?', 'คุณอยู่ที่ไหน?', 'คุณอายุเท่าไหร่?'],
        correctIndex: 1,
        explanation: '"How are you?" แปลว่า คุณเป็นยังไงบ้าง?',
      },
      {
        question: '"I am fine." แปลว่าอะไร?',
        options: ['ฉันเศร้า', 'ฉันเหนื่อย', 'ฉันสบายดี', 'ฉันหิว'],
        correctIndex: 2,
        explanation: 'fine แปลว่า ดี หรือ สบายดี',
      },
      {
        question: 'happy แปลว่าอะไร?',
        options: ['เศร้า', 'เหนื่อย', 'โกรธ', 'มีความสุข'],
        correctIndex: 3,
        explanation: 'happy แปลว่า มีความสุข',
      },
      {
        question: 'sad แปลว่าอะไร?',
        options: ['มีความสุข', 'เศร้า', 'เหนื่อย', 'สบายดี'],
        correctIndex: 1,
        explanation: 'sad แปลว่า เศร้า',
      },
    ],
  },

  // ==========================================
  // Lesson 3: What Is Your Name?
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 3,
    level: 0,
    topic: 'What Is Your Name?',
    title: 'My Name Is...',
    title_thai: 'ชื่อของฉันคือ...',
    vocabulary: [
      { word: 'name', phonetic: 'เนม', meaning: 'ชื่อ', partOfSpeech: 'n.' },
      { word: 'my', phonetic: 'มาย', meaning: 'ของฉัน', partOfSpeech: 'pron.' },
      { word: 'your', phonetic: 'ยัวร์', meaning: 'ของคุณ', partOfSpeech: 'pron.' },
      { word: 'meet', phonetic: 'มีท', meaning: 'พบ / รู้จัก', partOfSpeech: 'v.' },
      { word: 'nice', phonetic: 'ไนซ์', meaning: 'ดี / น่ายินดี', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: '"What', thai: '"วอท' },
        { english: 'is', thai: 'อิส' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'name?"', thai: 'เนม?"' },
      ],
      [
        { english: '"My', thai: '"มาย' },
        { english: 'name', thai: 'เนม' },
        { english: 'is', thai: 'อิส' },
        { english: 'Som."', thai: 'ส้ม."' },
      ],
      [
        { english: '"Nice', thai: '"ไนซ์' },
        { english: 'to', thai: 'ทู' },
        { english: 'meet', thai: 'มีท' },
        { english: 'you!"', thai: 'ยู!"' },
      ],
      [
        { english: '"Nice', thai: '"ไนซ์' },
        { english: 'to', thai: 'ทู' },
        { english: 'meet', thai: 'มีท' },
        { english: 'you', thai: 'ยู' },
        { english: 'too!"', thai: 'ทู!"' },
      ],
    ],
    article_translation:
      '"ชื่อของคุณคืออะไร?" "ชื่อของฉันคือส้ม" "ยินดีที่ได้รู้จัก!" "ยินดีที่ได้รู้จักเช่นกัน!"',
    image_prompt: 'Two Thai students Som and Chai introducing themselves and shaking hands, name tags visible, friendly cartoon scene',
    quiz: [
      {
        question: '"What is your name?" แปลว่าอะไร?',
        options: ['คุณอายุเท่าไหร่?', 'คุณอยู่ที่ไหน?', 'ชื่อของคุณคืออะไร?', 'คุณเป็นยังไงบ้าง?'],
        correctIndex: 2,
        explanation: '"What is your name?" แปลว่า ชื่อของคุณคืออะไร?',
      },
      {
        question: '"My name is Noi." แปลว่าอะไร?',
        options: ['ชื่อของคุณคือน้อย', 'ชื่อของฉันคือน้อย', 'ฉันรู้จักน้อย', 'น้อยเป็นเพื่อนฉัน'],
        correctIndex: 1,
        explanation: 'my แปลว่า ของฉัน ดังนั้น "My name is Noi" แปลว่า ชื่อของฉันคือน้อย',
      },
      {
        question: '"Nice to meet you!" แปลว่าอะไร?',
        options: ['ลาก่อน', 'สวัสดี', 'ยินดีที่ได้รู้จัก', 'ขอบคุณ'],
        correctIndex: 2,
        explanation: '"Nice to meet you!" แปลว่า ยินดีที่ได้รู้จัก',
      },
      {
        question: 'name แปลว่าอะไร?',
        options: ['อายุ', 'ชื่อ', 'เบอร์โทร', 'ที่อยู่'],
        correctIndex: 1,
        explanation: 'name แปลว่า ชื่อ',
      },
    ],
  },

  // ==========================================
  // Lesson 4: Please and Thank You
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 4,
    level: 0,
    topic: 'Please and Thank You',
    title: 'Polite Words',
    title_thai: 'คำสุภาพ',
    vocabulary: [
      { word: 'please', phonetic: 'พลีส', meaning: 'ได้โปรด / กรุณา', partOfSpeech: 'adv.' },
      { word: 'thank you', phonetic: 'แธงค์ยู', meaning: 'ขอบคุณ', partOfSpeech: 'phr.' },
      { word: "you're welcome", phonetic: 'ยัวร์เวลคัม', meaning: 'ไม่เป็นไร / ด้วยความยินดี', partOfSpeech: 'phr.' },
      { word: 'sorry', phonetic: 'ซอร์รี', meaning: 'ขอโทษ', partOfSpeech: 'interj.' },
    ],
    article_sentences: [
      [
        { english: 'Noi', thai: 'น้อย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Water,', thai: '"วอเตอร์,' },
        { english: 'please!"', thai: 'พลีส!"' },
      ],
      [
        { english: 'Chai', thai: 'ชาย' },
        { english: 'gives', thai: 'กิฟส์' },
        { english: 'water.', thai: 'วอเตอร์' },
      ],
      [
        { english: 'Noi', thai: 'น้อย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Thank', thai: '"แธงค์' },
        { english: 'you!"', thai: 'ยู!"' },
      ],
      [
        { english: 'Chai', thai: 'ชาย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"You\'re', thai: '"ยัวร์' },
        { english: 'welcome!"', thai: 'เวลคัม!"' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Sorry!"', thai: '"ซอร์รี!"' },
      ],
    ],
    article_translation:
      'น้อยพูดว่า "ขอน้ำหน่อย ได้โปรด!" ชายให้น้ำ น้อยพูดว่า "ขอบคุณ!" ชายพูดว่า "ด้วยความยินดี!" ส้มพูดว่า "ขอโทษ!"',
    image_prompt: 'Thai children Noi and Chai exchanging water politely, Som apologizing with a bow, soft friendly cartoon scene',
    quiz: [
      {
        question: 'please แปลว่าอะไร?',
        options: ['ขอบคุณ', 'ขอโทษ', 'กรุณา / ได้โปรด', 'ลาก่อน'],
        correctIndex: 2,
        explanation: 'please แปลว่า กรุณา หรือ ได้โปรด',
      },
      {
        question: '"Thank you!" แปลว่าอะไร?',
        options: ['ขอโทษ', 'ขอบคุณ', 'ด้วยความยินดี', 'ไม่เป็นไร'],
        correctIndex: 1,
        explanation: '"Thank you!" แปลว่า ขอบคุณ',
      },
      {
        question: 'เมื่อมีคนพูดว่า "Thank you" ควรตอบว่าอย่างไร?',
        options: ['Sorry', 'Please', "You're welcome", 'Goodbye'],
        correctIndex: 2,
        explanation: '"You\'re welcome" แปลว่า ด้วยความยินดี หรือ ไม่เป็นไร',
      },
      {
        question: 'sorry แปลว่าอะไร?',
        options: ['ขอบคุณ', 'กรุณา', 'ขอโทษ', 'สวัสดี'],
        correctIndex: 2,
        explanation: 'sorry แปลว่า ขอโทษ',
      },
    ],
  },

  // ==========================================
  // Lesson 5: Yes and No
  // ==========================================
  {
    module_id: 'core-a0-firstwords',
    lesson_order: 5,
    level: 0,
    topic: 'Yes and No',
    title: 'Yes, No, OK',
    title_thai: 'ใช่ ไม่ใช่ โอเค',
    vocabulary: [
      { word: 'yes', phonetic: 'เยส', meaning: 'ใช่ / ได้', partOfSpeech: 'adv.' },
      { word: 'no', phonetic: 'โน', meaning: 'ไม่ / ไม่ใช่', partOfSpeech: 'adv.' },
      { word: 'ok', phonetic: 'โอเค', meaning: 'โอเค / ได้', partOfSpeech: 'adv.' },
      { word: 'understand', phonetic: 'อันเดอร์สแตนด์', meaning: 'เข้าใจ', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: '"Do', thai: '"ดู' },
        { english: 'you', thai: 'ยู' },
        { english: 'understand?"', thai: 'อันเดอร์สแตนด์?"' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Yes!"', thai: '"เยส!"' },
      ],
      [
        { english: 'Chai', thai: 'ชาย' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"No.', thai: '"โน' },
        { english: 'I', thai: 'ไอ' },
        { english: "don't", thai: 'โดนท์' },
        { english: 'understand."', thai: 'อันเดอร์สแตนด์."' },
      ],
      [
        { english: '"OK.', thai: '"โอเค' },
        { english: "Let's", thai: 'เล็ทส์' },
        { english: 'try', thai: 'ทราย' },
        { english: 'again!"', thai: 'อะเกน!"' },
      ],
    ],
    article_translation:
      '"คุณเข้าใจไหม?" ส้มพูดว่า "ใช่!" ชายพูดว่า "ไม่ ฉันไม่เข้าใจ" "โอเค ลองอีกครั้ง!"',
    image_prompt: 'Thai teacher asking students if they understand, Som nodding yes, Chai shaking head no, OK thumbs up gesture, classroom cartoon',
    quiz: [
      {
        question: 'yes แปลว่าอะไร?',
        options: ['ไม่', 'ใช่ / ได้', 'โอเค', 'เข้าใจ'],
        correctIndex: 1,
        explanation: 'yes แปลว่า ใช่ หรือ ได้',
      },
      {
        question: '"I don\'t understand." แปลว่าอะไร?',
        options: ['ฉันเข้าใจ', 'ฉันไม่เข้าใจ', 'ฉันชอบ', 'ฉันรู้จัก'],
        correctIndex: 1,
        explanation: "don't understand แปลว่า ไม่เข้าใจ",
      },
      {
        question: 'no แปลว่าอะไร?',
        options: ['ใช่', 'โอเค', 'ไม่', 'ได้'],
        correctIndex: 2,
        explanation: 'no แปลว่า ไม่ หรือ ไม่ใช่',
      },
      {
        question: 'ok แปลว่าอะไร?',
        options: ['ขอโทษ', 'ขอบคุณ', 'โอเค / ได้', 'สวัสดี'],
        correctIndex: 2,
        explanation: 'ok แปลว่า โอเค หรือ ได้',
      },
    ],
  },
];
