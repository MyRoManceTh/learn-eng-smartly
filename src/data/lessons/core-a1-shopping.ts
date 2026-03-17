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

export const coreA1ShoppingLessons: LessonSeedData[] = [
  // ========================================
  // Lesson 1: At the shop (ที่ร้านค้า)
  // ========================================
  {
    module_id: 'core-a1-shopping',
    lesson_order: 1,
    level: 1,
    topic: 'At the shop',
    title: 'At the Shop',
    title_thai: 'ที่ร้านค้า',
    vocabulary: [
      { word: 'shop', phonetic: 'ช็อป', meaning: 'ร้านค้า', partOfSpeech: 'n.' },
      { word: 'buy', phonetic: 'บาย', meaning: 'ซื้อ', partOfSpeech: 'v.' },
      { word: 'sell', phonetic: 'เซลล์', meaning: 'ขาย', partOfSpeech: 'v.' },
      { word: 'market', phonetic: 'มาร์เก็ต', meaning: 'ตลาด', partOfSpeech: 'n.' },
      { word: 'customer', phonetic: 'คัสเทอะเมอร์', meaning: 'ลูกค้า', partOfSpeech: 'n.' },
      { word: 'bag', phonetic: 'แบ็ก', meaning: 'ถุง, กระเป๋า', partOfSpeech: 'n.' },
      { word: 'look for', phonetic: 'ลุค-ฟอร์', meaning: 'มองหา', partOfSpeech: 'phr.' },
      { word: 'welcome', phonetic: 'เวลคัม', meaning: 'ยินดีต้อนรับ', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Aom', thai: 'ออม' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'Chatuchak', thai: 'จตุจักร' },
        { english: 'Market', thai: 'มาร์เก็ต' },
        { english: 'today.', thai: 'ทูเดย์' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'walks', thai: 'วอล์คส์' },
        { english: 'into', thai: 'อินทู' },
        { english: 'a', thai: 'อะ' },
        { english: 'small', thai: 'สมอลล์' },
        { english: 'shop.', thai: 'ช็อป' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'seller', thai: 'เซลเลอร์' },
        { english: 'says,', thai: 'เซส์' },
        { english: '"Welcome!', thai: 'เวลคัม' },
        { english: 'Can', thai: 'แคน' },
        { english: 'I', thai: 'ไอ' },
        { english: 'help?"', thai: 'เฮลพ์' },
      ],
      [
        { english: 'Aom', thai: 'ออม' },
        { english: 'is', thai: 'อิส' },
        { english: 'looking', thai: 'ลุคกิ้ง' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'a', thai: 'อะ' },
        { english: 'new', thai: 'นิว' },
        { english: 'bag.', thai: 'แบ็ก' },
      ],
      [
        { english: 'There', thai: 'แดร์' },
        { english: 'are', thai: 'อาร์' },
        { english: 'many', thai: 'เมนนี' },
        { english: 'bags', thai: 'แบ็กส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'buy.', thai: 'บาย' },
      ],
    ],
    article_translation:
      'วันนี้ออมไปตลาดจตุจักร เธอเดินเข้าไปในร้านเล็กๆ แห่งหนึ่ง คนขายพูดว่า "ยินดีต้อนรับค่ะ! ให้ช่วยอะไรไหมคะ?" ออมกำลังมองหากระเป๋าใบใหม่ มีกระเป๋าหลายใบให้เลือกซื้อ',
    image_prompt: 'Chatuchak weekend market Bangkok, colorful shops and bags',
    quiz: [
      {
        question: 'คำว่า "shop" แปลว่าอะไร?',
        options: ['ตลาด', 'ร้านค้า', 'ถุง', 'ลูกค้า'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'คำว่า "buy" ตรงข้ามกับคำใด?',
        options: ['look', 'walk', 'sell', 'help'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'ออมไปที่ไหนในวันนี้?',
        options: [
          'ห้างสยาม',
          'เซเว่นอีเลฟเว่น',
          'ตลาดจตุจักร',
          'ร้านสะดวกซื้อ',
        ],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ออมกำลังมองหาอะไร?',
        options: ['รองเท้า', 'เสื้อผ้า', 'อาหาร', 'กระเป๋า'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ========================================
  // Lesson 2: How much is this? (ราคาเท่าไหร่?)
  // ========================================
  {
    module_id: 'core-a1-shopping',
    lesson_order: 2,
    level: 1,
    topic: 'How much is this?',
    title: 'How Much Is This?',
    title_thai: 'ราคาเท่าไหร่?',
    vocabulary: [
      { word: 'price', phonetic: 'ไพรซ์', meaning: 'ราคา', partOfSpeech: 'n.' },
      { word: 'how much', phonetic: 'ฮาว-มัช', meaning: 'เท่าไหร่', partOfSpeech: 'phr.' },
      { word: 'baht', phonetic: 'บาท', meaning: 'บาท (สกุลเงิน)', partOfSpeech: 'n.' },
      { word: 'expensive', phonetic: 'เอ็กซ์เพนซีฟ', meaning: 'แพง', partOfSpeech: 'adj.' },
      { word: 'cheap', phonetic: 'ชีพ', meaning: 'ถูก', partOfSpeech: 'adj.' },
      { word: 'discount', phonetic: 'ดิสเคาท์', meaning: 'ส่วนลด', partOfSpeech: 'n.' },
      { word: 'cost', phonetic: 'คอสท์', meaning: 'มีราคา, ค่าใช้จ่าย', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Pla', thai: 'ปลา' },
        { english: 'sees', thai: 'ซีส์' },
        { english: 'a', thai: 'อะ' },
        { english: 'nice', thai: 'ไนซ์' },
        { english: 'shirt.', thai: 'เชิ้ต' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'asks,', thai: 'แอสค์ส' },
        { english: '"How', thai: 'ฮาว' },
        { english: 'much', thai: 'มัช' },
        { english: 'is', thai: 'อิส' },
        { english: 'this?"', thai: 'ดิส' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'price', thai: 'ไพรซ์' },
        { english: 'is', thai: 'อิส' },
        { english: 'five', thai: 'ไฟว์' },
        { english: 'hundred', thai: 'ฮันเดรด' },
        { english: 'baht.', thai: 'บาท' },
      ],
      [
        { english: '"Too', thai: 'ทู' },
        { english: 'expensive!', thai: 'เอ็กซ์เพนซีฟ' },
        { english: 'Can', thai: 'แคน' },
        { english: 'I', thai: 'ไอ' },
        { english: 'get', thai: 'เก็ท' },
        { english: 'a', thai: 'อะ' },
        { english: 'discount?"', thai: 'ดิสเคาท์' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'seller', thai: 'เซลเลอร์' },
        { english: 'says,', thai: 'เซส์' },
        { english: '"OK,', thai: 'โอเค' },
        { english: 'three', thai: 'ธรี' },
        { english: 'hundred', thai: 'ฮันเดรด' },
        { english: 'baht."', thai: 'บาท' },
      ],
      [
        { english: 'Now', thai: 'นาว' },
        { english: 'it', thai: 'อิท' },
        { english: 'is', thai: 'อิส' },
        { english: 'cheap!', thai: 'ชีพ' },
      ],
    ],
    article_translation:
      'ปลาเห็นเสื้อสวยตัวหนึ่ง เธอถามว่า "อันนี้ราคาเท่าไหร่คะ?" ราคาคือห้าร้อยบาท "แพงไป! ลดได้ไหมคะ?" คนขายบอก "โอเค สามร้อยบาทค่ะ" ตอนนี้ถูกแล้ว!',
    image_prompt: 'Thai market stall with colorful shirts and price tags, bargaining scene',
    quiz: [
      {
        question: 'คำว่า "expensive" แปลว่าอะไร?',
        options: ['ถูก', 'สวย', 'แพง', 'ใหญ่'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"How much" ใช้ถามเกี่ยวกับอะไร?',
        options: ['เวลา', 'ราคา', 'สี', 'ขนาด'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ราคาเสื้อเริ่มต้นที่เท่าไหร่?',
        options: ['300 บาท', '200 บาท', '500 บาท', '100 บาท'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'สุดท้ายปลาได้เสื้อในราคาเท่าไหร่?',
        options: ['500 บาท', '400 บาท', '200 บาท', '300 บาท'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ========================================
  // Lesson 3: Colors and sizes (สีและขนาด)
  // ========================================
  {
    module_id: 'core-a1-shopping',
    lesson_order: 3,
    level: 1,
    topic: 'Colors and sizes',
    title: 'Colors and Sizes',
    title_thai: 'สีและขนาด',
    vocabulary: [
      { word: 'color', phonetic: 'คัลเลอร์', meaning: 'สี', partOfSpeech: 'n.' },
      { word: 'size', phonetic: 'ไซส์', meaning: 'ขนาด', partOfSpeech: 'n.' },
      { word: 'red', phonetic: 'เรด', meaning: 'สีแดง', partOfSpeech: 'adj.' },
      { word: 'blue', phonetic: 'บลู', meaning: 'สีน้ำเงิน', partOfSpeech: 'adj.' },
      { word: 'small', phonetic: 'สมอลล์', meaning: 'เล็ก', partOfSpeech: 'adj.' },
      { word: 'large', phonetic: 'ลาร์จ', meaning: 'ใหญ่', partOfSpeech: 'adj.' },
      { word: 'try on', phonetic: 'ทราย-ออน', meaning: 'ลองสวม', partOfSpeech: 'phr.' },
      { word: 'fit', phonetic: 'ฟิท', meaning: 'พอดี', partOfSpeech: 'v.' },
    ],
    article_sentences: [
      [
        { english: 'Film', thai: 'ฟิล์ม' },
        { english: 'wants', thai: 'วอนท์ส' },
        { english: 'to', thai: 'ทู' },
        { english: 'buy', thai: 'บาย' },
        { english: 'a', thai: 'อะ' },
        { english: 'T-shirt', thai: 'ที-เชิ้ต' },
        { english: 'at', thai: 'แอท' },
        { english: 'Siam.', thai: 'สยาม' },
      ],
      [
        { english: '"Do', thai: 'ดู' },
        { english: 'you', thai: 'ยู' },
        { english: 'have', thai: 'แฮฟ' },
        { english: 'this', thai: 'ดิส' },
        { english: 'in', thai: 'อิน' },
        { english: 'blue?"', thai: 'บลู' },
      ],
      [
        { english: '"Yes!', thai: 'เยส' },
        { english: 'What', thai: 'ว็อท' },
        { english: 'size', thai: 'ไซส์' },
        { english: 'do', thai: 'ดู' },
        { english: 'you', thai: 'ยู' },
        { english: 'need?"', thai: 'นีด' },
      ],
      [
        { english: '"Size', thai: 'ไซส์' },
        { english: 'large,', thai: 'ลาร์จ' },
        { english: 'please."', thai: 'พลีส' },
      ],
      [
        { english: 'Film', thai: 'ฟิล์ม' },
        { english: 'tries', thai: 'ทรายส์' },
        { english: 'it', thai: 'อิท' },
        { english: 'on.', thai: 'ออน' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'blue', thai: 'บลู' },
        { english: 'T-shirt', thai: 'ที-เชิ้ต' },
        { english: 'fits', thai: 'ฟิทส์' },
        { english: 'him', thai: 'ฮิม' },
        { english: 'well!', thai: 'เวล' },
      ],
    ],
    article_translation:
      'ฟิล์มอยากซื้อเสื้อยืดที่สยาม "มีสีน้ำเงินไหมครับ?" "มีค่ะ! ต้องการไซส์อะไรคะ?" "ไซส์ใหญ่ครับ" ฟิล์มลองสวมดู เสื้อยืดสีน้ำเงินพอดีตัวเขาเลย!',
    image_prompt: 'Siam shopping mall Bangkok, young Thai man trying on blue T-shirt in clothing store',
    quiz: [
      {
        question: 'คำว่า "size" แปลว่าอะไร?',
        options: ['สี', 'ราคา', 'ขนาด', 'รูปร่าง'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: '"try on" หมายถึงอะไร?',
        options: ['ซื้อ', 'ลองสวม', 'มองหา', 'ถอด'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'ฟิล์มต้องการเสื้อยืดสีอะไร?',
        options: ['แดง', 'เขียว', 'ดำ', 'น้ำเงิน'],
        correctIndex: 3,
        type: 'comprehension',
      },
      {
        question: 'ฟิล์มต้องการเสื้อยืดไซส์อะไร?',
        options: ['Small', 'Medium', 'Large', 'Extra Large'],
        correctIndex: 2,
        type: 'comprehension',
      },
    ],
  },

  // ========================================
  // Lesson 4: Paying and change (จ่ายเงินและทอน)
  // ========================================
  {
    module_id: 'core-a1-shopping',
    lesson_order: 4,
    level: 1,
    topic: 'Paying and change',
    title: 'Paying and Change',
    title_thai: 'จ่ายเงินและทอน',
    vocabulary: [
      { word: 'pay', phonetic: 'เพย์', meaning: 'จ่ายเงิน', partOfSpeech: 'v.' },
      { word: 'change', phonetic: 'เชนจ์', meaning: 'เงินทอน', partOfSpeech: 'n.' },
      { word: 'cash', phonetic: 'แคช', meaning: 'เงินสด', partOfSpeech: 'n.' },
      { word: 'receipt', phonetic: 'รีซีท', meaning: 'ใบเสร็จ', partOfSpeech: 'n.' },
      { word: 'total', phonetic: 'โทเทิล', meaning: 'รวมทั้งหมด', partOfSpeech: 'adj.' },
      { word: 'money', phonetic: 'มันนี', meaning: 'เงิน', partOfSpeech: 'n.' },
      { word: 'here you go', phonetic: 'เฮียร์-ยู-โก', meaning: 'นี่ค่ะ/ครับ (ให้ของ)', partOfSpeech: 'phr.' },
    ],
    article_sentences: [
      [
        { english: 'Mook', thai: 'มุก' },
        { english: 'buys', thai: 'บายส์' },
        { english: 'snacks', thai: 'สแน็คส์' },
        { english: 'at', thai: 'แอท' },
        { english: '7-Eleven.', thai: 'เซเว่น-อีเลฟเว่น' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'total', thai: 'โทเทิล' },
        { english: 'is', thai: 'อิส' },
        { english: 'eighty-five', thai: 'เอทตี-ไฟว์' },
        { english: 'baht.', thai: 'บาท' },
      ],
      [
        { english: 'She', thai: 'ชี' },
        { english: 'pays', thai: 'เพย์ส' },
        { english: 'with', thai: 'วิธ' },
        { english: 'one', thai: 'วัน' },
        { english: 'hundred', thai: 'ฮันเดรด' },
        { english: 'baht.', thai: 'บาท' },
      ],
      [
        { english: 'The', thai: 'เดอะ' },
        { english: 'cashier', thai: 'แคชเชียร์' },
        { english: 'gives', thai: 'กิฟส์' },
        { english: 'her', thai: 'เฮอร์' },
        { english: 'the', thai: 'เดอะ' },
        { english: 'change.', thai: 'เชนจ์' },
      ],
      [
        { english: '"Here', thai: 'เฮียร์' },
        { english: 'you', thai: 'ยู' },
        { english: 'go,', thai: 'โก' },
        { english: 'fifteen', thai: 'ฟิฟทีน' },
        { english: 'baht', thai: 'บาท' },
        { english: 'and', thai: 'แอนด์' },
        { english: 'your', thai: 'ยัวร์' },
        { english: 'receipt."', thai: 'รีซีท' },
      ],
    ],
    article_translation:
      'มุกซื้อขนมที่เซเว่นฯ ราคารวมทั้งหมด 85 บาท เธอจ่ายด้วยแบงก์ร้อย พนักงานทอนเงินให้ "นี่ค่ะ เงินทอน 15 บาท และใบเสร็จค่ะ"',
    image_prompt: '7-Eleven store in Thailand, young Thai woman paying at the counter, snacks on counter',
    quiz: [
      {
        question: 'คำว่า "change" ในบทเรียนนี้แปลว่าอะไร?',
        options: ['เปลี่ยน', 'เงินทอน', 'เหรียญ', 'เงินสด'],
        correctIndex: 1,
        type: 'vocab',
      },
      {
        question: 'คำว่า "receipt" แปลว่าอะไร?',
        options: ['เงินสด', 'บัตรเครดิต', 'ใบเสร็จ', 'ส่วนลด'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'มุกจ่ายเงินเท่าไหร่?',
        options: ['85 บาท', '50 บาท', '100 บาท', '15 บาท'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'มุกได้เงินทอนเท่าไหร่?',
        options: ['85 บาท', '100 บาท', '20 บาท', '15 บาท'],
        correctIndex: 3,
        type: 'comprehension',
      },
    ],
  },

  // ========================================
  // Lesson 5: I want to buy... (ฉันอยากซื้อ...)
  // ========================================
  {
    module_id: 'core-a1-shopping',
    lesson_order: 5,
    level: 1,
    topic: 'I want to buy...',
    title: 'I Want to Buy...',
    title_thai: 'ฉันอยากซื้อ...',
    vocabulary: [
      { word: 'want', phonetic: 'วอนท์', meaning: 'ต้องการ, อยาก', partOfSpeech: 'v.' },
      { word: 'gift', phonetic: 'กิฟท์', meaning: 'ของขวัญ', partOfSpeech: 'n.' },
      { word: 'souvenir', phonetic: 'ซูเวอะเนียร์', meaning: 'ของที่ระลึก', partOfSpeech: 'n.' },
      { word: 'beautiful', phonetic: 'บิวทิฟูล', meaning: 'สวยงาม', partOfSpeech: 'adj.' },
      { word: 'friend', phonetic: 'เฟรนด์', meaning: 'เพื่อน', partOfSpeech: 'n.' },
      { word: 'choose', phonetic: 'ชูส', meaning: 'เลือก', partOfSpeech: 'v.' },
      { word: 'wrap', phonetic: 'แร็พ', meaning: 'ห่อ', partOfSpeech: 'v.' },
      { word: 'happy', phonetic: 'แฮปปี้', meaning: 'มีความสุข', partOfSpeech: 'adj.' },
    ],
    article_sentences: [
      [
        { english: 'Film', thai: 'ฟิล์ม' },
        { english: 'wants', thai: 'วอนท์ส' },
        { english: 'to', thai: 'ทู' },
        { english: 'buy', thai: 'บาย' },
        { english: 'a', thai: 'อะ' },
        { english: 'gift', thai: 'กิฟท์' },
        { english: 'for', thai: 'ฟอร์' },
        { english: 'Mook.', thai: 'มุก' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'goes', thai: 'โกส์' },
        { english: 'to', thai: 'ทู' },
        { english: 'a', thai: 'อะ' },
        { english: 'souvenir', thai: 'ซูเวอะเนียร์' },
        { english: 'shop.', thai: 'ช็อป' },
      ],
      [
        { english: '"I', thai: 'ไอ' },
        { english: 'want', thai: 'วอนท์' },
        { english: 'to', thai: 'ทู' },
        { english: 'buy', thai: 'บาย' },
        { english: 'something', thai: 'ซัมธิง' },
        { english: 'beautiful."', thai: 'บิวทิฟูล' },
      ],
      [
        { english: 'He', thai: 'ฮี' },
        { english: 'chooses', thai: 'ชูสซิส' },
        { english: 'a', thai: 'อะ' },
        { english: 'small', thai: 'สมอลล์' },
        { english: 'elephant', thai: 'เอเลเฟ่นท์' },
        { english: 'souvenir.', thai: 'ซูเวอะเนียร์' },
      ],
      [
        { english: '"Can', thai: 'แคน' },
        { english: 'you', thai: 'ยู' },
        { english: 'wrap', thai: 'แร็พ' },
        { english: 'it,', thai: 'อิท' },
        { english: 'please?"', thai: 'พลีส' },
      ],
      [
        { english: 'Mook', thai: 'มุก' },
        { english: 'will', thai: 'วิล' },
        { english: 'be', thai: 'บี' },
        { english: 'very', thai: 'เวรี' },
        { english: 'happy!', thai: 'แฮปปี้' },
      ],
    ],
    article_translation:
      'ฟิล์มอยากซื้อของขวัญให้มุก เขาไปที่ร้านขายของที่ระลึก "ผมอยากซื้อของสวยๆ สักชิ้นครับ" เขาเลือกของที่ระลึกรูปช้างตัวเล็กๆ "ช่วยห่อให้หน่อยได้ไหมครับ?" มุกจะต้องมีความสุขแน่นอน!',
    image_prompt: 'Thai souvenir shop with small elephant figurines, gift wrapping, warm lighting',
    quiz: [
      {
        question: 'คำว่า "gift" แปลว่าอะไร?',
        options: ['ร้านค้า', 'ของที่ระลึก', 'ของขวัญ', 'กระเป๋า'],
        correctIndex: 2,
        type: 'vocab',
      },
      {
        question: 'คำว่า "wrap" แปลว่าอะไร?',
        options: ['ห่อ', 'เปิด', 'ส่ง', 'ซื้อ'],
        correctIndex: 0,
        type: 'vocab',
      },
      {
        question: 'ฟิล์มซื้อของขวัญให้ใคร?',
        options: ['ออม', 'ปลา', 'มุก', 'แม่'],
        correctIndex: 2,
        type: 'comprehension',
      },
      {
        question: 'ฟิล์มเลือกของที่ระลึกรูปอะไร?',
        options: ['แมว', 'ช้าง', 'ปลา', 'นก'],
        correctIndex: 1,
        type: 'comprehension',
      },
    ],
  },
];
