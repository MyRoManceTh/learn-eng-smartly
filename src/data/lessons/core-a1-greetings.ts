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

export const coreA1GreetingsLessons: LessonSeedData[] = [
  // ==========================================
  // Lesson 1: Hello and Goodbye
  // ==========================================
  {
    module_id: 'core-a1-greetings',
    lesson_order: 1,
    level: 1,
    topic: 'Hello and Goodbye',
    title: 'First Day at the New Office',
    title_thai: 'วันแรกที่ออฟฟิศใหม่',
    vocabulary: [
      { word: 'hello', phonetic: 'เฮลโล', meaning: 'สวัสดี', partOfSpeech: 'interj.' },
      { word: 'goodbye', phonetic: 'กู๊ดบาย', meaning: 'ลาก่อน', partOfSpeech: 'interj.' },
      { word: 'good morning', phonetic: 'กู๊ดมอร์นิง', meaning: 'สวัสดีตอนเช้า', partOfSpeech: 'phr.' },
      { word: 'good evening', phonetic: 'กู๊ดอีฟนิง', meaning: 'สวัสดีตอนเย็น', partOfSpeech: 'phr.' },
      { word: 'see you', phonetic: 'ซียู', meaning: 'แล้วเจอกัน', partOfSpeech: 'phr.' },
      { word: 'hi', phonetic: 'ไฮ', meaning: 'สวัสดี (ไม่เป็นทางการ)', partOfSpeech: 'interj.' },
      { word: 'bye', phonetic: 'บาย', meaning: 'บ๊ายบาย', partOfSpeech: 'interj.' },
      { word: 'welcome', phonetic: 'เวลคัม', meaning: 'ยินดีต้อนรับ', partOfSpeech: 'interj.' },
    ],
    article_sentences: [
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'walks', thai: 'วอล์คส' },
        { english: 'into', thai: 'อินทู' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'new', thai: 'นิว' },
        { english: 'office.', thai: 'ออฟฟิศ' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'says', thai: 'เซส์' },
        { english: '"Good morning!"', thai: '"กู๊ดมอร์นิง!"' },
      ],
      [
        { english: 'A', thai: 'อะ' },
        { english: 'man', thai: 'แมน' },
        { english: 'says', thai: 'เซส์' },
        { english: '"Hello!', thai: '"เฮลโล!' },
        { english: 'Welcome!"', thai: 'เวลคัม!"' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'is', thai: 'อิส' },
        { english: 'happy.', thai: 'แฮปปี้' },
      ],
      [
        { english: 'At', thai: 'แอท' },
        { english: 'six,', thai: 'ซิกซ์,' },
        { english: 'she', thai: 'ชี' },
        { english: 'says', thai: 'เซส์' },
        { english: '"Goodbye!', thai: '"กู๊ดบาย!' },
        { english: 'See you!"', thai: 'ซียู!"' },
      ],
    ],
    article_translation:
      'ส้มเดินเข้าไปในออฟฟิศใหม่ เธอพูดว่า "สวัสดีตอนเช้า!" ผู้ชายคนหนึ่งพูดว่า "สวัสดี! ยินดีต้อนรับ!" ส้มมีความสุข ตอนหกโมง เธอพูดว่า "ลาก่อน! แล้วเจอกัน!"',
    image_prompt: 'Thai woman entering a modern office, greeted by a friendly coworker, bright morning',
    quiz: [
      {
        question: 'คำว่า "hello" แปลว่าอะไร?',
        options: ['ลาก่อน', 'สวัสดี', 'ขอบคุณ', 'ขอโทษ'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'คำว่า "goodbye" แปลว่าอะไร?',
        options: ['สวัสดี', 'ยินดีต้อนรับ', 'ลาก่อน', 'แล้วเจอกัน'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ส้มพูดว่าอะไรตอนเช้า?',
        options: ['Good evening', 'Goodbye', 'Good morning', 'See you'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ส้มพูดว่าอะไรตอนกลับบ้าน?',
        options: ['Good morning!', 'Hello!', 'Welcome!', 'Goodbye! See you!'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ==========================================
  // Lesson 2: What is your name?
  // ==========================================
  {
    module_id: 'core-a1-greetings',
    lesson_order: 2,
    level: 1,
    topic: 'What is your name?',
    title: 'The Coffee Shop Encounter',
    title_thai: 'พบกันที่ร้านกาแฟ',
    vocabulary: [
      { word: 'name', phonetic: 'เนม', meaning: 'ชื่อ', partOfSpeech: 'n.' },
      { word: 'my', phonetic: 'มาย', meaning: 'ของฉัน', partOfSpeech: 'pron.' },
      { word: 'your', phonetic: 'ยัวร์', meaning: 'ของคุณ', partOfSpeech: 'pron.' },
      { word: 'what', phonetic: 'ว็อท', meaning: 'อะไร', partOfSpeech: 'pron.' },
      { word: 'is', phonetic: 'อิส', meaning: 'คือ/เป็น', partOfSpeech: 'v.' },
      { word: 'I', phonetic: 'ไอ', meaning: 'ฉัน', partOfSpeech: 'pron.' },
      { word: 'am', phonetic: 'แอม', meaning: 'เป็น/อยู่', partOfSpeech: 'v.' },
      { word: 'call', phonetic: 'คอล', meaning: 'เรียก', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'sits', thai: 'ซิทส์' },
        { english: 'at', thai: 'แอท' },
        { english: 'a', thai: 'อะ' },
        { english: 'coffee', thai: 'คอฟฟี่' },
        { english: 'shop.', thai: 'ช็อป' },
      ],
      [
        { english: 'A', thai: 'อะ' },
        { english: 'girl', thai: 'เกิร์ล' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"What', thai: '"ว็อท' },
        { english: 'is', thai: 'อิส' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'name?"', thai: 'เนม?"' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"My', thai: '"มาย' },
        { english: 'name', thai: 'เนม' },
        { english: 'is', thai: 'อิส' },
        { english: 'Bam."', thai: 'แบม"' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'Fon."', thai: 'ฝน"' },
      ],
      [
        { english: '"You', thai: '"ยู' },
        { english: 'can', thai: 'แคน' },
        { english: 'call', thai: 'คอล' },
        { english: 'me', thai: 'มี' },
        { english: 'Fon!"', thai: 'ฝน!"' },
      ],
    ],
    article_translation:
      'แบมนั่งอยู่ที่ร้านกาแฟ ผู้หญิงคนหนึ่งถามว่า "คุณชื่ออะไร?" เขาตอบว่า "ผมชื่อแบม" เธอพูดว่า "ฉันชื่อฝน" "เรียกฉันว่าฝนก็ได้!"',
    image_prompt: 'Two Thai young people talking at a cozy coffee shop, introducing themselves',
    quiz: [
      {
        question: 'คำว่า "name" แปลว่าอะไร?',
        options: ['อาหาร', 'ชื่อ', 'บ้าน', 'เพื่อน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"My" แปลว่าอะไร?',
        options: ['ของคุณ', 'ของเขา', 'ของฉัน', 'ของเธอ'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'แบมอยู่ที่ไหน?',
        options: ['ที่โรงเรียน', 'ที่ร้านกาแฟ', 'ที่บ้าน', 'ที่ออฟฟิศ'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ผู้หญิงที่คุยกับแบมชื่ออะไร?',
        options: ['ส้ม', 'ปลา', 'ฝน', 'นัท'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ==========================================
  // Lesson 3: How are you?
  // ==========================================
  {
    module_id: 'core-a1-greetings',
    lesson_order: 3,
    level: 1,
    topic: 'How are you?',
    title: 'A Chat Between Old Friends',
    title_thai: 'คุยกันระหว่างเพื่อนเก่า',
    vocabulary: [
      { word: 'how', phonetic: 'ฮาว', meaning: 'อย่างไร/ยังไง', partOfSpeech: 'adv.' },
      { word: 'are', phonetic: 'อาร์', meaning: 'เป็น/อยู่', partOfSpeech: 'v.' },
      { word: 'you', phonetic: 'ยู', meaning: 'คุณ', partOfSpeech: 'pron.' },
      { word: 'fine', phonetic: 'ไฟน์', meaning: 'สบายดี', partOfSpeech: 'adj.' },
      { word: 'thank you', phonetic: 'แธงค์ยู', meaning: 'ขอบคุณ', partOfSpeech: 'phr.' },
      { word: 'great', phonetic: 'เกรท', meaning: 'ดีมาก', partOfSpeech: 'adj.' },
      { word: 'not bad', phonetic: 'น็อทแบด', meaning: 'ก็ไม่เลว', partOfSpeech: 'phr.' },
      { word: 'tired', phonetic: 'ไทเออร์ด', meaning: 'เหนื่อย', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'sees', thai: 'ซีส์' },
        { english: 'Nut', thai: 'นัท' },
        { english: 'at', thai: 'แอท' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'market.', thai: 'มาร์เก็ต' },
      ],
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"How', thai: '"ฮาว' },
        { english: 'are', thai: 'อาร์' },
        { english: 'you?"', thai: 'ยู?"' },
      ],
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'fine,', thai: 'ไฟน์,' },
        { english: 'thank you!"', thai: 'แธงค์ยู!"' },
      ],
      [
        { english: '"But', thai: '"บัท' },
        { english: 'I', thai: 'ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'a little', thai: 'อะลิตเทิล' },
        { english: 'tired."', thai: 'ไทเออร์ด"' },
      ],
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'great!', thai: 'เกรท!' },
        { english: 'Let\'s', thai: 'เล็ทส์' },
        { english: 'eat!"', thai: 'อีท!"' },
      ],
    ],
    article_translation:
      'ปลาเจอนัทที่ตลาด ปลาถามว่า "คุณสบายดีมั้ย?" นัทตอบว่า "สบายดี ขอบคุณ!" "แต่ฉันเหนื่อยนิดหน่อย" ปลาพูดว่า "ฉันดีมาก! ไปกินข้าวกัน!"',
    image_prompt: 'Two Thai friends meeting at a colorful Thai street market, smiling',
    quiz: [
      {
        question: '"Fine" แปลว่าอะไร?',
        options: ['เหนื่อย', 'หิว', 'สบายดี', 'ดีมาก'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"Tired" แปลว่าอะไร?',
        options: ['มีความสุข', 'เหนื่อย', 'หิว', 'ง่วงนอน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ปลากับนัทเจอกันที่ไหน?',
        options: ['ที่ร้านกาแฟ', 'ที่โรงเรียน', 'ที่ตลาด', 'ที่บ้าน'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'นัทรู้สึกยังไง?',
        options: ['สบายดีแต่เหนื่อยนิดหน่อย', 'ไม่สบาย', 'มีความสุขมาก', 'เศร้า'],
        correctIndex: 0,
        type: 'comprehension',
      },
    ],
  },

  // ==========================================
  // Lesson 4: Where are you from?
  // ==========================================
  {
    module_id: 'core-a1-greetings',
    lesson_order: 4,
    level: 1,
    topic: 'Where are you from?',
    title: 'New Friends on the Train',
    title_thai: 'เพื่อนใหม่บนรถไฟฟ้า',
    vocabulary: [
      { word: 'where', phonetic: 'แวร์', meaning: 'ที่ไหน', partOfSpeech: 'adv.' },
      { word: 'from', phonetic: 'ฟรอม', meaning: 'จาก', partOfSpeech: 'prep.' },
      { word: 'Thailand', phonetic: 'ไทแลนด์', meaning: 'ประเทศไทย', partOfSpeech: 'n.' },
      { word: 'country', phonetic: 'คันทรี', meaning: 'ประเทศ', partOfSpeech: 'n.' },
      { word: 'city', phonetic: 'ซิตี้', meaning: 'เมือง', partOfSpeech: 'n.' },
      { word: 'live', phonetic: 'ลิฟว์', meaning: 'อาศัยอยู่', partOfSpeech: 'v.' },
      { word: 'Bangkok', phonetic: 'แบงค็อก', meaning: 'กรุงเทพฯ', partOfSpeech: 'n.' },
      { word: 'here', phonetic: 'เฮียร์', meaning: 'ที่นี่', partOfSpeech: 'adv.' },
    ],
    article_sentences: [
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'is', thai: 'อิส' },
        { english: 'on', thai: 'ออน' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'BTS', thai: 'บีทีเอส' },
        { english: 'train.', thai: 'เทรน' },
      ],
      [
        { english: 'A', thai: 'อะ' },
        { english: 'man', thai: 'แมน' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"Where', thai: '"แวร์' },
        { english: 'are', thai: 'อาร์' },
        { english: 'you', thai: 'ยู' },
        { english: 'from?"', thai: 'ฟรอม?"' },
      ],
      [
        { english: 'Nut', thai: 'นัท' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'from', thai: 'ฟรอม' },
        { english: 'Thailand."', thai: 'ไทแลนด์"' },
      ],
      [
        { english: '"I', thai: '"ไอ' },
        { english: 'live', thai: 'ลิฟว์' },
        { english: 'in', thai: 'อิน' },
        { english: 'Bangkok."', thai: 'แบงค็อก"' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'man', thai: 'แมน' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'love', thai: 'เลิฟ' },
        { english: 'this', thai: 'ดิส' },
        { english: 'city!"', thai: 'ซิตี้!"' },
      ],
    ],
    article_translation:
      'นัทอยู่บนรถไฟฟ้าบีทีเอส ผู้ชายคนหนึ่งถามว่า "คุณมาจากไหน?" นัทตอบว่า "ผมมาจากประเทศไทย" "ผมอาศัยอยู่ในกรุงเทพฯ" ผู้ชายคนนั้นพูดว่า "ผมชอบเมืองนี้!"',
    image_prompt: 'Thai man chatting with a tourist on the BTS Skytrain in Bangkok',
    quiz: [
      {
        question: '"Where" แปลว่าอะไร?',
        options: ['เมื่อไหร่', 'ที่ไหน', 'อย่างไร', 'ทำไม'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"Live" แปลว่าอะไร?',
        options: ['ทำงาน', 'กิน', 'อาศัยอยู่', 'เดินทาง'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'นัทอยู่บนอะไร?',
        options: ['รถเมล์', 'รถไฟฟ้า BTS', 'เรือ', 'แท็กซี่'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'นัทอาศัยอยู่ที่ไหน?',
        options: ['เชียงใหม่', 'ภูเก็ต', 'กรุงเทพฯ', 'พัทยา'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ==========================================
  // Lesson 5: My job and hobbies
  // ==========================================
  {
    module_id: 'core-a1-greetings',
    lesson_order: 5,
    level: 1,
    topic: 'My job and hobbies',
    title: 'Telling Your Story at a Party',
    title_thai: 'เล่าเรื่องตัวเองในงานปาร์ตี้',
    vocabulary: [
      { word: 'job', phonetic: 'จ็อบ', meaning: 'งาน/อาชีพ', partOfSpeech: 'n.' },
      { word: 'teacher', phonetic: 'ทีชเชอร์', meaning: 'ครู', partOfSpeech: 'n.' },
      { word: 'hobby', phonetic: 'ฮ็อบบี้', meaning: 'งานอดิเรก', partOfSpeech: 'n.' },
      { word: 'like', phonetic: 'ไลค์', meaning: 'ชอบ', partOfSpeech: 'v.' },
      { word: 'cook', phonetic: 'คุก', meaning: 'ทำอาหาร', partOfSpeech: 'v.' },
      { word: 'read', phonetic: 'รีด', meaning: 'อ่าน', partOfSpeech: 'v.' },
      { word: 'play', phonetic: 'เพลย์', meaning: 'เล่น', partOfSpeech: 'v.' },
      { word: 'work', phonetic: 'เวิร์ค', meaning: 'ทำงาน', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Fon', thai: 'ฝน' },
        { english: 'is', thai: 'อิส' },
        { english: 'at', thai: 'แอท' },
        { english: 'a', thai: 'อะ' },
        { english: 'party.', thai: 'ปาร์ตี้' },
      ],
      [
        { english: 'Someone', thai: 'ซัมวัน' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"What', thai: '"ว็อท' },
        { english: 'is', thai: 'อิส' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'job?"', thai: 'จ็อบ?"' },
      ],
      [
        { english: 'Fon', thai: 'ฝน' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"I', thai: '"ไอ' },
        { english: 'am', thai: 'แอม' },
        { english: 'a', thai: 'อะ' },
        { english: 'teacher."', thai: 'ทีชเชอร์"' },
      ],
      [
        { english: '"I', thai: '"ไอ' },
        { english: 'like', thai: 'ไลค์' },
        { english: 'to', thai: 'ทู' },
        { english: 'cook', thai: 'คุก' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'read."', thai: 'รีด"' },
      ],
      [
        { english: '"I', thai: '"ไอ' },
        { english: 'also', thai: 'ออลโซ' },
        { english: 'play', thai: 'เพลย์' },
        { english: 'guitar!"', thai: 'กีตาร์!"' },
      ],
      [
        { english: '"I', thai: '"ไอ' },
        { english: 'love', thai: 'เลิฟ' },
        { english: 'my', thai: 'มาย' },
        { english: 'job', thai: 'จ็อบ' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'my', thai: 'มาย' },
        { english: 'hobbies!"', thai: 'ฮ็อบบี้ส!"' },
      ],
    ],
    article_translation:
      'ฝนอยู่ในงานปาร์ตี้ มีคนถามว่า "คุณทำงานอะไร?" ฝนตอบว่า "ฉันเป็นครู" "ฉันชอบทำอาหารและอ่านหนังสือ" "ฉันยังเล่นกีตาร์ด้วย!" "ฉันรักงานและงานอดิเรกของฉัน!"',
    image_prompt:
      'Thai woman at a casual house party, talking about her hobbies, guitar and books nearby',
    quiz: [
      {
        question: '"Job" แปลว่าอะไร?',
        options: ['บ้าน', 'งาน/อาชีพ', 'งานอดิเรก', 'โรงเรียน'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: '"Cook" แปลว่าอะไร?',
        options: ['อ่านหนังสือ', 'เล่นดนตรี', 'ทำอาหาร', 'ทำงาน'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ฝนทำอาชีพอะไร?',
        options: ['หมอ', 'ครู', 'พ่อครัว', 'นักดนตรี'],
        correctIndex: 1,
        type: 'comprehension',
      },
      {
        question: 'ฝนชอบทำอะไรบ้าง?',
        options: [
          'วาดรูปและร้องเพลง',
          'วิ่งและว่ายน้ำ',
          'ทำอาหาร อ่านหนังสือ และเล่นกีตาร์',
          'ดูหนังและนอนหลับ',
        ],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ==========================================
  // Lesson 6: Nice to meet you
  // ==========================================
  {
    module_id: 'core-a1-greetings',
    lesson_order: 6,
    level: 1,
    topic: 'Nice to meet you',
    title: 'Making Friends at the Weekend Market',
    title_thai: 'ได้เพื่อนใหม่ที่ตลาดนัดวันหยุด',
    vocabulary: [
      { word: 'nice', phonetic: 'ไนซ์', meaning: 'ดี/น่ายินดี', partOfSpeech: 'adj.' },
      { word: 'meet', phonetic: 'มีท', meaning: 'พบ/เจอ', partOfSpeech: 'v.' },
      { word: 'too', phonetic: 'ทู', meaning: 'เช่นกัน', partOfSpeech: 'adv.' },
      { word: 'friend', phonetic: 'เฟรนด์', meaning: 'เพื่อน', partOfSpeech: 'n.' },
      { word: 'new', phonetic: 'นิว', meaning: 'ใหม่', partOfSpeech: 'adj.' },
      { word: 'please', phonetic: 'พลีส', meaning: 'ได้โปรด/กรุณา', partOfSpeech: 'adv.' },
      { word: 'number', phonetic: 'นัมเบอร์', meaning: 'หมายเลข', partOfSpeech: 'n.' },
      { word: 'sure', phonetic: 'ชัวร์', meaning: 'แน่นอน/ได้เลย', partOfSpeech: 'adv.' },
    ],
    article_sentences: [
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'Bam', thai: 'แบม' },
        { english: 'are', thai: 'อาร์' },
        { english: 'at', thai: 'แอท' },
        { english: 'Chatuchak', thai: 'จตุจักร' },
        { english: 'Market.', thai: 'มาร์เก็ต' },
      ],
      [
        { english: 'They', thai: 'เดย์' },
        { english: 'meet', thai: 'มีท' },
        { english: 'a', thai: 'อะ' },
        { english: 'new', thai: 'นิว' },
        { english: 'friend.', thai: 'เฟรนด์' },
      ],
      [
        { english: 'Som', thai: 'ส้ม' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Nice', thai: '"ไนซ์' },
        { english: 'to', thai: 'ทู' },
        { english: 'meet', thai: 'มีท' },
        { english: 'you!"', thai: 'ยู!"' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'friend', thai: 'เฟรนด์' },
        { english: 'says,', thai: 'เซส์,' },
        { english: '"Nice', thai: '"ไนซ์' },
        { english: 'to', thai: 'ทู' },
        { english: 'meet', thai: 'มีท' },
        { english: 'you', thai: 'ยู' },
        { english: 'too!"', thai: 'ทู!"' },
      ],
      [
        { english: 'Bam', thai: 'แบม' },
        { english: 'asks,', thai: 'อาสค์ส,' },
        { english: '"Can', thai: '"แคน' },
        { english: 'I', thai: 'ไอ' },
        { english: 'have', thai: 'แฮฟว์' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'number,', thai: 'นัมเบอร์,' },
        { english: 'please?"', thai: 'พลีส?"' },
      ],
      [
        { english: '"Sure!', thai: '"ชัวร์!' },
        { english: 'We', thai: 'วี' },
        { english: 'are', thai: 'อาร์' },
        { english: 'friends', thai: 'เฟรนด์ส' },
        { english: 'now!"', thai: 'นาว!"' },
      ],
    ],
    article_translation:
      'ส้มกับแบมอยู่ที่ตลาดจตุจักร พวกเขาเจอเพื่อนใหม่ ส้มพูดว่า "ยินดีที่ได้รู้จัก!" เพื่อนตอบว่า "ยินดีที่ได้รู้จักเช่นกัน!" แบมถามว่า "ขอเบอร์โทรได้มั้ย?" "ได้เลย! เราเป็นเพื่อนกันแล้ว!"',
    image_prompt:
      'Three Thai friends exchanging phone numbers at Chatuchak weekend market, happy and friendly',
    quiz: [
      {
        question: '"Nice to meet you" แปลว่าอะไร?',
        options: ['สวัสดี', 'ลาก่อน', 'ยินดีที่ได้รู้จัก', 'ขอบคุณ'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"Friend" แปลว่าอะไร?',
        options: ['ครอบครัว', 'เพื่อน', 'ครู', 'คนแปลกหน้า'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ส้มกับแบมอยู่ที่ไหน?',
        options: ['ตลาดจตุจักร', 'ห้างสรรพสินค้า', 'ร้านอาหาร', 'สวนสาธารณะ'],
        correctIndex: 0,
        type: 'comprehension',
      },
      {
        question: 'แบมขออะไรจากเพื่อนใหม่?',
        options: ['อีเมล', 'ที่อยู่', 'เบอร์โทร', 'ชื่อ'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },
];
