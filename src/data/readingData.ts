import { VocabWord, InterlinearWord, QuizQuestion } from "@/types/lesson";

export interface ReadingCategory {
  id: string;
  icon: string;
  name: string;
  nameThai: string;
  color: string;
  storiesCount: number;
}

export interface ReadingStory {
  id: string;
  categoryId: string;
  level: 1 | 2 | 3;
  title: string;
  titleThai: string;
  preview: string;
  vocabulary: VocabWord[];
  articleSentences: InterlinearWord[][];
  articleTranslation: string;
  quiz: QuizQuestion[];
  imagePrompt: string;
}

export const readingCategories: ReadingCategory[] = [
  { id: "food", icon: "🍳", name: "Food & Cooking", nameThai: "อาหาร & ทำกิน", color: "from-orange-400 to-red-400", storiesCount: 3 },
  { id: "travel", icon: "✈️", name: "Travel", nameThai: "เดินทาง & ท่องเที่ยว", color: "from-blue-400 to-cyan-400", storiesCount: 3 },
  { id: "health", icon: "🏥", name: "Health", nameThai: "สุขภาพ", color: "from-green-400 to-emerald-400", storiesCount: 3 },
  { id: "shopping", icon: "🛒", name: "Shopping", nameThai: "ซื้อของ & บริการ", color: "from-pink-400 to-rose-400", storiesCount: 3 },
  { id: "work", icon: "💼", name: "Work", nameThai: "ทำงาน", color: "from-indigo-400 to-blue-400", storiesCount: 3 },
  { id: "home", icon: "🏠", name: "Home & Family", nameThai: "บ้าน & ครอบครัว", color: "from-amber-400 to-yellow-400", storiesCount: 3 },
  { id: "tech", icon: "📱", name: "Technology", nameThai: "เทคโนโลยี", color: "from-purple-400 to-violet-400", storiesCount: 3 },
];

export const readingStories: ReadingStory[] = [
  // ===== FOOD =====
  {
    id: "food-1",
    categoryId: "food",
    level: 1,
    title: "The Lost Pizza",
    titleThai: "พิซซ่าหลงทาง",
    preview: "A delivery man gets lost trying to deliver a pizza...",
    vocabulary: [
      { word: "pizza", phonetic: "พิซซ่า", meaning: "พิซซ่า", partOfSpeech: "n." },
      { word: "delivery", phonetic: "ดิลิเวอรี่", meaning: "การส่งของ", partOfSpeech: "n." },
      { word: "lost", phonetic: "ลอสท์", meaning: "หลงทาง", partOfSpeech: "adj." },
      { word: "cold", phonetic: "โคลด์", meaning: "เย็น", partOfSpeech: "adj." },
      { word: "delicious", phonetic: "ดิลิเชิส", meaning: "อร่อย", partOfSpeech: "adj." },
      { word: "laugh", phonetic: "ลาฟ", meaning: "หัวเราะ", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "Tom", thai: "ทอม" }, { english: "ordered", thai: "ออร์เดอร์ด" }, { english: "a", thai: "อะ" }, { english: "pizza", thai: "พิซซ่า" }, { english: "for", thai: "ฟอร์" }, { english: "dinner.", thai: "ดินเนอร์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "delivery", thai: "ดิลิเวอรี่" }, { english: "man", thai: "แมน" }, { english: "got", thai: "ก็อท" }, { english: "lost.", thai: "ลอสท์" }],
      [{ english: "He", thai: "ฮี" }, { english: "called", thai: "คอลด์" }, { english: "Tom", thai: "ทอม" }, { english: "on", thai: "ออน" }, { english: "the", thai: "เดอะ" }, { english: "phone.", thai: "โฟน" }],
      [{ english: "Tom", thai: "ทอม" }, { english: "looked", thai: "ลุคท์" }, { english: "outside", thai: "เอาท์ไซด์" }, { english: "and", thai: "แอนด์" }, { english: "saw", thai: "ซอว์" }, { english: "him", thai: "ฮิม" }, { english: "across", thai: "อะครอส" }, { english: "the", thai: "เดอะ" }, { english: "street!", thai: "สตรีท" }],
      [{ english: "They", thai: "เดย์" }, { english: "both", thai: "โบธ" }, { english: "laughed.", thai: "ลาฟท์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "pizza", thai: "พิซซ่า" }, { english: "was", thai: "วอส" }, { english: "cold,", thai: "โคลด์" }, { english: "but", thai: "บัท" }, { english: "still", thai: "สติล" }, { english: "delicious!", thai: "ดิลิเชิส" }],
    ],
    articleTranslation: "ทอมสั่งพิซซ่ามากินตอนเย็น คนส่งของหลงทาง เขาโทรหาทอม ทอมมองออกไปข้างนอกแล้วเห็นเขาอยู่อีกฝั่งถนน! ทั้งสองคนหัวเราะ พิซซ่าเย็นแล้ว แต่ก็ยังอร่อย!",
    quiz: [
      { question: "ทอมสั่งอะไรมากิน?", options: ["เบอร์เกอร์", "พิซซ่า", "ซูชิ", "ข้าวผัด"], correctIndex: 1, type: "comprehension" },
      { question: "'delivery' แปลว่าอะไร?", options: ["การส่งของ", "อาหาร", "ถนน", "โทรศัพท์"], correctIndex: 0, type: "vocab" },
      { question: "คนส่งพิซซ่าเป็นอย่างไร?", options: ["โกรธ", "หลงทาง", "ป่วย", "เหนื่อย"], correctIndex: 1, type: "comprehension" },
      { question: "'delicious' แปลว่าอะไร?", options: ["เย็น", "ร้อน", "อร่อย", "แพง"], correctIndex: 2, type: "vocab" },
    ],
    imagePrompt: "cartoon pizza delivery man looking confused on a street",
  },
  {
    id: "food-2",
    categoryId: "food",
    level: 2,
    title: "Cooking Disaster",
    titleThai: "หายนะในครัว",
    preview: "Mia tries to cook for her boyfriend, but things go wrong...",
    vocabulary: [
      { word: "recipe", phonetic: "เรซิพี", meaning: "สูตรอาหาร", partOfSpeech: "n." },
      { word: "ingredient", phonetic: "อินกรีเดียนท์", meaning: "ส่วนผสม", partOfSpeech: "n." },
      { word: "burn", phonetic: "เบิร์น", meaning: "ไหม้", partOfSpeech: "v." },
      { word: "smoke", phonetic: "สโมค", meaning: "ควัน", partOfSpeech: "n." },
      { word: "surprised", phonetic: "เซอร์ไพรสด์", meaning: "ประหลาดใจ", partOfSpeech: "adj." },
      { word: "order", phonetic: "ออร์เดอร์", meaning: "สั่ง", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "Mia", thai: "มีอา" }, { english: "wanted", thai: "วอนเท็ด" }, { english: "to", thai: "ทู" }, { english: "cook", thai: "คุก" }, { english: "a", thai: "อะ" }, { english: "special", thai: "สเปเชียล" }, { english: "dinner.", thai: "ดินเนอร์" }],
      [{ english: "She", thai: "ชี" }, { english: "found", thai: "ฟาวนด์" }, { english: "a", thai: "อะ" }, { english: "recipe", thai: "เรซิพี" }, { english: "online.", thai: "ออนไลน์" }],
      [{ english: "She", thai: "ชี" }, { english: "bought", thai: "บอท" }, { english: "all", thai: "ออล" }, { english: "the", thai: "เดอะ" }, { english: "ingredients.", thai: "อินกรีเดียนท์ส" }],
      [{ english: "But", thai: "บัท" }, { english: "she", thai: "ชี" }, { english: "forgot", thai: "ฟอร์ก็อท" }, { english: "to", thai: "ทู" }, { english: "set", thai: "เซ็ท" }, { english: "the", thai: "เดอะ" }, { english: "timer.", thai: "ไทเมอร์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "food", thai: "ฟูด" }, { english: "burned", thai: "เบิร์นด์" }, { english: "and", thai: "แอนด์" }, { english: "smoke", thai: "สโมค" }, { english: "filled", thai: "ฟิลด์" }, { english: "the", thai: "เดอะ" }, { english: "kitchen!", thai: "คิทเช่น" }],
      [{ english: "Her", thai: "เฮอร์" }, { english: "boyfriend", thai: "บอยเฟรนด์" }, { english: "was", thai: "วอส" }, { english: "surprised.", thai: "เซอร์ไพรสด์" }],
      [{ english: "They", thai: "เดย์" }, { english: "ordered", thai: "ออร์เดอร์ด" }, { english: "fried", thai: "ฟรายด์" }, { english: "chicken", thai: "ชิคเค่น" }, { english: "instead", thai: "อินสเต็ด" }, { english: "and", thai: "แอนด์" }, { english: "laughed", thai: "ลาฟท์" }, { english: "together.", thai: "ทูเก็ทเธอร์" }],
    ],
    articleTranslation: "มีอาอยากทำอาหารมื้อพิเศษ เธอหาสูตรจากอินเทอร์เน็ต ซื้อส่วนผสมมาครบ แต่เธอลืมตั้งเวลา อาหารไหม้และควันเต็มครัว! แฟนของเธอตกใจ สุดท้ายพวกเขาสั่งไก่ทอดกินแทน แล้วก็หัวเราะด้วยกัน",
    quiz: [
      { question: "มีอาหาสูตรอาหารจากไหน?", options: ["แม่บอก", "อินเทอร์เน็ต", "หนังสือ", "เพื่อน"], correctIndex: 1, type: "comprehension" },
      { question: "'ingredient' แปลว่าอะไร?", options: ["สูตรอาหาร", "ส่วนผสม", "เตาอบ", "จานชาม"], correctIndex: 1, type: "vocab" },
      { question: "ทำไมอาหารถึงไหม้?", options: ["ไฟแรงเกินไป", "ลืมตั้งเวลา", "ใส่น้ำมันเยอะ", "เตาเสีย"], correctIndex: 1, type: "comprehension" },
      { question: "สุดท้ายพวกเขากินอะไร?", options: ["พิซซ่า", "ส้มตำ", "ไก่ทอด", "บะหมี่"], correctIndex: 2, type: "comprehension" },
    ],
    imagePrompt: "cartoon girl in smoky kitchen looking at burnt food, funny scene",
  },
  {
    id: "food-3",
    categoryId: "food",
    level: 3,
    title: "The Street Food Challenge",
    titleThai: "ท้าชิมอาหารริมทาง",
    preview: "Two friends challenge each other to try the spiciest street food...",
    vocabulary: [
      { word: "challenge", phonetic: "ชาเลนจ์", meaning: "ท้าทาย", partOfSpeech: "n." },
      { word: "spicy", phonetic: "สไปซี่", meaning: "เผ็ด", partOfSpeech: "adj." },
      { word: "sweat", phonetic: "สเว็ท", meaning: "เหงื่อ", partOfSpeech: "n." },
      { word: "regret", phonetic: "รีเกร็ท", meaning: "เสียใจ", partOfSpeech: "v." },
      { word: "vendor", phonetic: "เว็นเดอร์", meaning: "คนขาย", partOfSpeech: "n." },
      { word: "survive", phonetic: "เซอร์ไวฟ์", meaning: "รอดชีวิต", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "Jack", thai: "แจ็ค" }, { english: "and", thai: "แอนด์" }, { english: "Pam", thai: "แพม" }, { english: "loved", thai: "เลิฟด์" }, { english: "street", thai: "สตรีท" }, { english: "food.", thai: "ฟูด" }],
      [{ english: "One", thai: "วัน" }, { english: "day,", thai: "เดย์" }, { english: "Jack", thai: "แจ็ค" }, { english: "challenged", thai: "ชาเลนจ์ด" }, { english: "Pam", thai: "แพม" }, { english: "to", thai: "ทู" }, { english: "eat", thai: "อีท" }, { english: "the", thai: "เดอะ" }, { english: "spiciest", thai: "สไปซีเอสท์" }, { english: "noodles.", thai: "นูดเดิลส์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "vendor", thai: "เว็นเดอร์" }, { english: "warned", thai: "วอร์นด์" }, { english: "them:", thai: "เด็ม" }, { english: "\"This", thai: "ดิส" }, { english: "is", thai: "อิส" }, { english: "very", thai: "เวรี่" }, { english: "hot!\"", thai: "ฮ็อท" }],
      [{ english: "After", thai: "อาฟเทอร์" }, { english: "one", thai: "วัน" }, { english: "bite,", thai: "ไบท์" }, { english: "sweat", thai: "สเว็ท" }, { english: "covered", thai: "คัฟเวอร์ด" }, { english: "their", thai: "แดร์" }, { english: "faces.", thai: "เฟซเซส" }],
      [{ english: "Jack", thai: "แจ็ค" }, { english: "turned", thai: "เทิร์นด์" }, { english: "bright", thai: "ไบรท์" }, { english: "red.", thai: "เร็ด" }],
      [{ english: "Pam", thai: "แพม" }, { english: "drank", thai: "แดร็งค์" }, { english: "three", thai: "ธรี" }, { english: "glasses", thai: "กลาสเซส" }, { english: "of", thai: "ออฟ" }, { english: "water!", thai: "วอเทอร์" }],
      [{ english: "They", thai: "เดย์" }, { english: "both", thai: "โบธ" }, { english: "regretted", thai: "รีเกร็ทเท็ด" }, { english: "the", thai: "เดอะ" }, { english: "challenge,", thai: "ชาเลนจ์" }, { english: "but", thai: "บัท" }, { english: "survived!", thai: "เซอร์ไวฟ์ด" }],
    ],
    articleTranslation: "แจ็คกับแพมชอบกินอาหารริมทาง วันหนึ่งแจ็คท้าแพมกินบะหมี่ที่เผ็ดที่สุด คนขายเตือนพวกเขาว่า 'เผ็ดมาก!' พอกินคำแรก เหงื่อท่วมหน้า แจ็คหน้าแดงเป็นมะเขือเทศ แพมดื่มน้ำสามแก้ว! ทั้งคู่เสียใจที่รับคำท้า แต่ก็รอดมาได้!",
    quiz: [
      { question: "แจ็คท้าแพมกินอะไร?", options: ["ส้มตำ", "บะหมี่เผ็ด", "แกงเขียวหวาน", "ข้าวผัดพริก"], correctIndex: 1, type: "comprehension" },
      { question: "'vendor' แปลว่าอะไร?", options: ["ลูกค้า", "พ่อครัว", "คนขาย", "เพื่อน"], correctIndex: 2, type: "vocab" },
      { question: "'regret' แปลว่าอะไร?", options: ["สนุก", "เสียใจ", "โกรธ", "ดีใจ"], correctIndex: 1, type: "vocab" },
      { question: "แพมทำอะไรหลังจากกินบะหมี่?", options: ["วิ่งหนี", "ร้องไห้", "ดื่มน้ำสามแก้ว", "สั่งเพิ่ม"], correctIndex: 2, type: "comprehension" },
    ],
    imagePrompt: "two friends eating extremely spicy noodles at street food stall, sweating and laughing",
  },

  // ===== TRAVEL =====
  {
    id: "travel-1",
    categoryId: "travel",
    level: 1,
    title: "At the Airport",
    titleThai: "ที่สนามบิน",
    preview: "A family goes to the airport for the first time...",
    vocabulary: [
      { word: "airport", phonetic: "แอร์พอร์ท", meaning: "สนามบิน", partOfSpeech: "n." },
      { word: "ticket", phonetic: "ทิคเค็ท", meaning: "ตั๋ว", partOfSpeech: "n." },
      { word: "passport", phonetic: "พาสพอร์ท", meaning: "หนังสือเดินทาง", partOfSpeech: "n." },
      { word: "gate", phonetic: "เกท", meaning: "ประตูขึ้นเครื่อง", partOfSpeech: "n." },
      { word: "excited", phonetic: "เอ็กไซเท็ด", meaning: "ตื่นเต้น", partOfSpeech: "adj." },
      { word: "heavy", phonetic: "เฮฟวี่", meaning: "หนัก", partOfSpeech: "adj." },
    ],
    articleSentences: [
      [{ english: "Nong", thai: "น้อง" }, { english: "was", thai: "วอส" }, { english: "very", thai: "เวรี่" }, { english: "excited.", thai: "เอ็กไซเท็ด" }],
      [{ english: "Today", thai: "ทูเดย์" }, { english: "she", thai: "ชี" }, { english: "would", thai: "วูด" }, { english: "fly", thai: "ฟลาย" }, { english: "for", thai: "ฟอร์" }, { english: "the", thai: "เดอะ" }, { english: "first", thai: "เฟิร์สท์" }, { english: "time!", thai: "ไทม์" }],
      [{ english: "Dad", thai: "แด็ด" }, { english: "carried", thai: "แคริด" }, { english: "the", thai: "เดอะ" }, { english: "heavy", thai: "เฮฟวี่" }, { english: "bags.", thai: "แบ็กส์" }],
      [{ english: "Mom", thai: "มอม" }, { english: "held", thai: "เฮลด์" }, { english: "the", thai: "เดอะ" }, { english: "tickets", thai: "ทิคเค็ทส์" }, { english: "and", thai: "แอนด์" }, { english: "passports.", thai: "พาสพอร์ทส์" }],
      [{ english: "They", thai: "เดย์" }, { english: "found", thai: "ฟาวนด์" }, { english: "gate", thai: "เกท" }, { english: "number", thai: "นัมเบอร์" }, { english: "twelve.", thai: "ทเว็ลฟ์" }],
      [{ english: "Nong", thai: "น้อง" }, { english: "smiled", thai: "สไมลด์" }, { english: "and", thai: "แอนด์" }, { english: "said,", thai: "เซ็ด" }, { english: "\"Let's", thai: "เล็ทส์" }, { english: "go!\"", thai: "โก" }],
    ],
    articleTranslation: "น้องตื่นเต้นมาก วันนี้เธอจะได้นั่งเครื่องบินครั้งแรก! พ่อหิ้วกระเป๋าหนักๆ แม่ถือตั๋วและพาสปอร์ต พวกเขาหาเจอประตูขึ้นเครื่องหมายเลขสิบสอง น้องยิ้มแล้วพูดว่า 'ไปเลย!'",
    quiz: [
      { question: "น้องรู้สึกอย่างไร?", options: ["เศร้า", "กลัว", "ตื่นเต้น", "เบื่อ"], correctIndex: 2, type: "comprehension" },
      { question: "'passport' แปลว่าอะไร?", options: ["ตั๋ว", "กระเป๋า", "หนังสือเดินทาง", "ที่นั่ง"], correctIndex: 2, type: "vocab" },
      { question: "ใครถือตั๋ว?", options: ["พ่อ", "แม่", "น้อง", "พี่"], correctIndex: 1, type: "comprehension" },
      { question: "'heavy' แปลว่าอะไร?", options: ["เบา", "หนัก", "ใหญ่", "เล็ก"], correctIndex: 1, type: "vocab" },
    ],
    imagePrompt: "excited little girl at airport with parents, colorful cartoon illustration",
  },
  {
    id: "travel-2",
    categoryId: "travel",
    level: 2,
    title: "The Wrong Train",
    titleThai: "ขึ้นรถไฟผิดขบวน",
    preview: "Mark takes the wrong train and ends up somewhere unexpected...",
    vocabulary: [
      { word: "platform", phonetic: "แพล็ทฟอร์ม", meaning: "ชานชาลา", partOfSpeech: "n." },
      { word: "announce", phonetic: "อะเนาซ์", meaning: "ประกาศ", partOfSpeech: "v." },
      { word: "realize", phonetic: "เรียลไลซ์", meaning: "ตระหนัก", partOfSpeech: "v." },
      { word: "adventure", phonetic: "แอดเวนเจอร์", meaning: "การผจญภัย", partOfSpeech: "n." },
      { word: "confused", phonetic: "คอนฟิวสด์", meaning: "สับสน", partOfSpeech: "adj." },
      { word: "destination", phonetic: "เดสทิเนชั่น", meaning: "จุดหมาย", partOfSpeech: "n." },
    ],
    articleSentences: [
      [{ english: "Mark", thai: "มาร์ค" }, { english: "was", thai: "วอส" }, { english: "going", thai: "โกอิ้ง" }, { english: "to", thai: "ทู" }, { english: "visit", thai: "วิซิท" }, { english: "his", thai: "ฮิส" }, { english: "friend", thai: "เฟรนด์" }, { english: "in", thai: "อิน" }, { english: "Chiang Mai.", thai: "เชียงใหม่" }],
      [{ english: "At", thai: "แอ็ท" }, { english: "the", thai: "เดอะ" }, { english: "station,", thai: "สเตชั่น" }, { english: "he", thai: "ฮี" }, { english: "was", thai: "วอส" }, { english: "confused", thai: "คอนฟิวสด์" }, { english: "by", thai: "บาย" }, { english: "the", thai: "เดอะ" }, { english: "platforms.", thai: "แพล็ทฟอร์มส์" }],
      [{ english: "He", thai: "ฮี" }, { english: "jumped", thai: "จัมพ์ด" }, { english: "on", thai: "ออน" }, { english: "the", thai: "เดอะ" }, { english: "train", thai: "เทรน" }, { english: "just", thai: "จัสท์" }, { english: "before", thai: "บีฟอร์" }, { english: "it", thai: "อิท" }, { english: "left.", thai: "เล็ฟท์" }],
      [{ english: "Then", thai: "เด็น" }, { english: "the", thai: "เดอะ" }, { english: "speaker", thai: "สปีคเคอร์" }, { english: "announced:", thai: "อะเนาซ์ด" }, { english: "\"Next", thai: "เน็กซ์ท" }, { english: "stop:", thai: "สต็อป" }, { english: "Hua Hin.\"", thai: "หัวหิน" }],
      [{ english: "Mark", thai: "มาร์ค" }, { english: "realized", thai: "เรียลไลซ์ด" }, { english: "he", thai: "ฮี" }, { english: "was", thai: "วอส" }, { english: "on", thai: "ออน" }, { english: "the", thai: "เดอะ" }, { english: "wrong", thai: "รอง" }, { english: "train!", thai: "เทรน" }],
      [{ english: "But", thai: "บัท" }, { english: "Hua Hin", thai: "หัวหิน" }, { english: "was", thai: "วอส" }, { english: "beautiful.", thai: "บิวทิฟุล" }],
      [{ english: "It", thai: "อิท" }, { english: "became", thai: "บีเคม" }, { english: "the", thai: "เดอะ" }, { english: "best", thai: "เบสท์" }, { english: "adventure!", thai: "แอดเวนเจอร์" }],
    ],
    articleTranslation: "มาร์คจะไปหาเพื่อนที่เชียงใหม่ ที่สถานีเขาสับสนกับชานชาลา เขาโดดขึ้นรถไฟก่อนที่มันจะออก แล้วเสียงประกาศก็พูดว่า 'ป้ายต่อไป: หัวหิน' มาร์คตระหนักว่าขึ้นรถไฟผิดขบวน! แต่หัวหินสวยมาก มันกลายเป็นการผจญภัยที่ดีที่สุด!",
    quiz: [
      { question: "มาร์คจะไปไหน?", options: ["หัวหิน", "เชียงใหม่", "ภูเก็ต", "กรุงเทพ"], correctIndex: 1, type: "comprehension" },
      { question: "'platform' แปลว่าอะไร?", options: ["ตั๋ว", "ชานชาลา", "รถไฟ", "ที่นั่ง"], correctIndex: 1, type: "vocab" },
      { question: "'realize' แปลว่าอะไร?", options: ["ลืม", "ตระหนัก", "วิ่ง", "นอน"], correctIndex: 1, type: "vocab" },
      { question: "มาร์ครู้สึกอย่างไรตอนจบ?", options: ["โกรธมาก", "ร้องไห้", "สนุกกับการผจญภัย", "กลัว"], correctIndex: 2, type: "comprehension" },
    ],
    imagePrompt: "surprised man on train looking at window seeing beach town instead of mountains",
  },
  {
    id: "travel-3",
    categoryId: "travel",
    level: 1,
    title: "Asking for Directions",
    titleThai: "ถามทาง",
    preview: "A tourist in Bangkok asks for directions to the temple...",
    vocabulary: [
      { word: "direction", phonetic: "ไดเร็คชั่น", meaning: "ทิศทาง", partOfSpeech: "n." },
      { word: "temple", phonetic: "เท็มเปิ้ล", meaning: "วัด", partOfSpeech: "n." },
      { word: "straight", phonetic: "สเตรท", meaning: "ตรงไป", partOfSpeech: "adv." },
      { word: "turn", phonetic: "เทิร์น", meaning: "เลี้ยว", partOfSpeech: "v." },
      { word: "thank", phonetic: "แธ็งค์", meaning: "ขอบคุณ", partOfSpeech: "v." },
      { word: "kind", phonetic: "ไคนด์", meaning: "ใจดี", partOfSpeech: "adj." },
    ],
    articleSentences: [
      [{ english: "A", thai: "อะ" }, { english: "tourist", thai: "ทัวริสท์" }, { english: "wanted", thai: "วอนเท็ด" }, { english: "to", thai: "ทู" }, { english: "see", thai: "ซี" }, { english: "the", thai: "เดอะ" }, { english: "temple.", thai: "เท็มเปิ้ล" }],
      [{ english: "She", thai: "ชี" }, { english: "asked", thai: "อาสค์ท" }, { english: "a", thai: "อะ" }, { english: "kind", thai: "ไคนด์" }, { english: "man", thai: "แมน" }, { english: "for", thai: "ฟอร์" }, { english: "directions.", thai: "ไดเร็คชั่นส์" }],
      [{ english: "He", thai: "ฮี" }, { english: "said,", thai: "เซ็ด" }, { english: "\"Go", thai: "โก" }, { english: "straight", thai: "สเตรท" }, { english: "and", thai: "แอนด์" }, { english: "turn", thai: "เทิร์น" }, { english: "left.\"", thai: "เล็ฟท์" }],
      [{ english: "She", thai: "ชี" }, { english: "thanked", thai: "แธ็งค์ท" }, { english: "him", thai: "ฮิม" }, { english: "and", thai: "แอนด์" }, { english: "walked", thai: "วอคท์" }, { english: "there.", thai: "แดร์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "temple", thai: "เท็มเปิ้ล" }, { english: "was", thai: "วอส" }, { english: "beautiful!", thai: "บิวทิฟุล" }],
    ],
    articleTranslation: "นักท่องเที่ยวคนหนึ่งอยากไปดูวัด เธอถามทางจากผู้ชายใจดีคนหนึ่ง เขาบอกว่า 'ตรงไปแล้วเลี้ยวซ้าย' เธอขอบคุณเขาแล้วเดินไป วัดสวยมาก!",
    quiz: [
      { question: "นักท่องเที่ยวจะไปไหน?", options: ["ร้านอาหาร", "วัด", "โรงแรม", "ห้าง"], correctIndex: 1, type: "comprehension" },
      { question: "'straight' แปลว่าอะไร?", options: ["เลี้ยว", "หยุด", "ตรงไป", "ย้อนกลับ"], correctIndex: 2, type: "vocab" },
      { question: "'kind' แปลว่าอะไร?", options: ["ใจดี", "ตลก", "หล่อ", "แก่"], correctIndex: 0, type: "vocab" },
      { question: "ต้องเลี้ยวทางไหน?", options: ["ขวา", "ซ้าย", "ตรงไปเลย", "กลับหลัง"], correctIndex: 1, type: "comprehension" },
    ],
    imagePrompt: "tourist asking local man for directions near a beautiful Thai temple",
  },

  // ===== HEALTH =====
  {
    id: "health-1",
    categoryId: "health",
    level: 1,
    title: "Going to the Doctor",
    titleThai: "ไปหาหมอ",
    preview: "Sam has a stomachache and visits the doctor...",
    vocabulary: [
      { word: "doctor", phonetic: "ด็อกเทอร์", meaning: "หมอ", partOfSpeech: "n." },
      { word: "stomachache", phonetic: "สตัมเมคเอค", meaning: "ปวดท้อง", partOfSpeech: "n." },
      { word: "medicine", phonetic: "เมดิซิน", meaning: "ยา", partOfSpeech: "n." },
      { word: "rest", phonetic: "เรสท์", meaning: "พักผ่อน", partOfSpeech: "v." },
      { word: "better", phonetic: "เบ็ทเทอร์", meaning: "ดีขึ้น", partOfSpeech: "adj." },
      { word: "worry", phonetic: "เวอร์รี่", meaning: "กังวล", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "Sam", thai: "แซม" }, { english: "had", thai: "แฮด" }, { english: "a", thai: "อะ" }, { english: "bad", thai: "แบ็ด" }, { english: "stomachache.", thai: "สตัมเมคเอค" }],
      [{ english: "He", thai: "ฮี" }, { english: "went", thai: "เว็นท์" }, { english: "to", thai: "ทู" }, { english: "see", thai: "ซี" }, { english: "the", thai: "เดอะ" }, { english: "doctor.", thai: "ด็อกเทอร์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "doctor", thai: "ด็อกเทอร์" }, { english: "said,", thai: "เซ็ด" }, { english: "\"Don't", thai: "โดนท์" }, { english: "worry!", thai: "เวอร์รี่" }, { english: "Take", thai: "เทค" }, { english: "this", thai: "ดิส" }, { english: "medicine.\"", thai: "เมดิซิน" }],
      [{ english: "Sam", thai: "แซม" }, { english: "took", thai: "ทุก" }, { english: "the", thai: "เดอะ" }, { english: "medicine", thai: "เมดิซิน" }, { english: "and", thai: "แอนด์" }, { english: "rested", thai: "เรสเท็ด" }, { english: "at", thai: "แอ็ท" }, { english: "home.", thai: "โฮม" }],
      [{ english: "The", thai: "เดอะ" }, { english: "next", thai: "เน็กซ์ท" }, { english: "day,", thai: "เดย์" }, { english: "he", thai: "ฮี" }, { english: "felt", thai: "เฟ็ลท์" }, { english: "much", thai: "มัช" }, { english: "better!", thai: "เบ็ทเทอร์" }],
    ],
    articleTranslation: "แซมปวดท้องมาก เขาไปหาหมอ หมอบอกว่า 'ไม่ต้องกังวล กินยานี้' แซมกินยาและพักผ่อนที่บ้าน วันรุ่งขึ้นเขารู้สึกดีขึ้นมาก!",
    quiz: [
      { question: "แซมเป็นอะไร?", options: ["ปวดหัว", "ปวดท้อง", "เป็นหวัด", "ปวดขา"], correctIndex: 1, type: "comprehension" },
      { question: "'medicine' แปลว่าอะไร?", options: ["ยา", "อาหาร", "น้ำ", "ผ้าพันแผล"], correctIndex: 0, type: "vocab" },
      { question: "'rest' แปลว่าอะไร?", options: ["วิ่ง", "พักผ่อน", "กิน", "นอน"], correctIndex: 1, type: "vocab" },
      { question: "วันรุ่งขึ้นแซมรู้สึกอย่างไร?", options: ["แย่ลง", "เหมือนเดิม", "ดีขึ้น", "ปวดหัว"], correctIndex: 2, type: "comprehension" },
    ],
    imagePrompt: "friendly doctor checking patient with warm smile in clinic",
  },

  // ===== SHOPPING =====
  {
    id: "shopping-1",
    categoryId: "shopping",
    level: 1,
    title: "The Big Sale",
    titleThai: "ลดราคาครั้งใหญ่",
    preview: "Lily finds an amazing deal but there's a catch...",
    vocabulary: [
      { word: "sale", phonetic: "เซล", meaning: "ลดราคา", partOfSpeech: "n." },
      { word: "expensive", phonetic: "เอ็กซ์เพนซีฟ", meaning: "แพง", partOfSpeech: "adj." },
      { word: "cheap", phonetic: "ชีป", meaning: "ถูก", partOfSpeech: "adj." },
      { word: "size", phonetic: "ไซส์", meaning: "ขนาด", partOfSpeech: "n." },
      { word: "fit", phonetic: "ฟิท", meaning: "พอดี", partOfSpeech: "v." },
      { word: "return", phonetic: "รีเทิร์น", meaning: "คืน", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "Lily", thai: "ลิลี่" }, { english: "saw", thai: "ซอว์" }, { english: "a", thai: "อะ" }, { english: "big", thai: "บิก" }, { english: "sale", thai: "เซล" }, { english: "sign.", thai: "ไซน์" }],
      [{ english: "A", thai: "อะ" }, { english: "beautiful", thai: "บิวทิฟุล" }, { english: "dress", thai: "เดรส" }, { english: "was", thai: "วอส" }, { english: "very", thai: "เวรี่" }, { english: "cheap!", thai: "ชีป" }],
      [{ english: "She", thai: "ชี" }, { english: "bought", thai: "บอท" }, { english: "it", thai: "อิท" }, { english: "quickly.", thai: "ควิคลี่" }],
      [{ english: "At", thai: "แอ็ท" }, { english: "home,", thai: "โฮม" }, { english: "she", thai: "ชี" }, { english: "tried", thai: "ไทรด์" }, { english: "it", thai: "อิท" }, { english: "on.", thai: "ออน" }],
      [{ english: "The", thai: "เดอะ" }, { english: "size", thai: "ไซส์" }, { english: "didn't", thai: "ดิดดึ้นท์" }, { english: "fit!", thai: "ฟิท" }],
      [{ english: "She", thai: "ชี" }, { english: "had", thai: "แฮด" }, { english: "to", thai: "ทู" }, { english: "return", thai: "รีเทิร์น" }, { english: "it.", thai: "อิท" }],
    ],
    articleTranslation: "ลิลี่เห็นป้ายลดราคาใหญ่ ชุดเดรสสวยราคาถูกมาก! เธอรีบซื้อเลย กลับถึงบ้านแล้วลองใส่ ไซส์ไม่พอดี! เธอต้องเอาไปคืน",
    quiz: [
      { question: "ลิลี่ซื้ออะไร?", options: ["กระเป๋า", "รองเท้า", "ชุดเดรส", "หมวก"], correctIndex: 2, type: "comprehension" },
      { question: "'cheap' แปลว่าอะไร?", options: ["แพง", "ถูก", "สวย", "ใหญ่"], correctIndex: 1, type: "vocab" },
      { question: "ปัญหาคืออะไร?", options: ["สีไม่สวย", "ไซส์ไม่พอดี", "ขาด", "แพงเกินไป"], correctIndex: 1, type: "comprehension" },
      { question: "'return' แปลว่าอะไร?", options: ["ซื้อ", "ใส่", "คืน", "เปลี่ยน"], correctIndex: 2, type: "vocab" },
    ],
    imagePrompt: "girl looking disappointed holding a dress that is too small in front of mirror",
  },

  // ===== WORK =====
  {
    id: "work-1",
    categoryId: "work",
    level: 2,
    title: "The Job Interview",
    titleThai: "สัมภาษณ์งาน",
    preview: "Ben prepares for his first job interview...",
    vocabulary: [
      { word: "interview", phonetic: "อินเทอร์วิว", meaning: "สัมภาษณ์", partOfSpeech: "n." },
      { word: "nervous", phonetic: "เนอร์เวิส", meaning: "กังวล", partOfSpeech: "adj." },
      { word: "confident", phonetic: "คอนฟิเดนท์", meaning: "มั่นใจ", partOfSpeech: "adj." },
      { word: "experience", phonetic: "เอ็กซ์พีเรียนซ์", meaning: "ประสบการณ์", partOfSpeech: "n." },
      { word: "hire", phonetic: "ไฮร์", meaning: "จ้าง", partOfSpeech: "v." },
      { word: "congratulations", phonetic: "คอนแกร็ทชูเลชั่นส์", meaning: "ยินดีด้วย", partOfSpeech: "interj." },
    ],
    articleSentences: [
      [{ english: "Ben", thai: "เบน" }, { english: "had", thai: "แฮด" }, { english: "a", thai: "อะ" }, { english: "job", thai: "จ็อบ" }, { english: "interview", thai: "อินเทอร์วิว" }, { english: "today.", thai: "ทูเดย์" }],
      [{ english: "He", thai: "ฮี" }, { english: "was", thai: "วอส" }, { english: "very", thai: "เวรี่" }, { english: "nervous.", thai: "เนอร์เวิส" }],
      [{ english: "His", thai: "ฮิส" }, { english: "friend", thai: "เฟรนด์" }, { english: "told", thai: "โทลด์" }, { english: "him,", thai: "ฮิม" }, { english: "\"Be", thai: "บี" }, { english: "confident!\"", thai: "คอนฟิเดนท์" }],
      [{ english: "Ben", thai: "เบน" }, { english: "took", thai: "ทุก" }, { english: "a", thai: "อะ" }, { english: "deep", thai: "ดีป" }, { english: "breath", thai: "เบร็ธ" }, { english: "and", thai: "แอนด์" }, { english: "walked", thai: "วอคท์" }, { english: "in.", thai: "อิน" }],
      [{ english: "He", thai: "ฮี" }, { english: "talked", thai: "ทอคท์" }, { english: "about", thai: "อะเบาท์" }, { english: "his", thai: "ฮิส" }, { english: "experience.", thai: "เอ็กซ์พีเรียนซ์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "boss", thai: "บอส" }, { english: "smiled", thai: "สไมลด์" }, { english: "and", thai: "แอนด์" }, { english: "said,", thai: "เซ็ด" }, { english: "\"You're", thai: "ยัวร์" }, { english: "hired!\"", thai: "ไฮร์ด" }],
      [{ english: "Congratulations,", thai: "คอนแกร็ทชูเลชั่นส์" }, { english: "Ben!", thai: "เบน" }],
    ],
    articleTranslation: "วันนี้เบนมีสัมภาษณ์งาน เขากังวลมาก เพื่อนบอกว่า 'มั่นใจเข้าไว้!' เบนหายใจลึกแล้วเดินเข้าไป เขาเล่าเรื่องประสบการณ์ของตัวเอง หัวหน้ายิ้มแล้วพูดว่า 'คุณได้งานแล้ว!' ยินดีด้วยเบน!",
    quiz: [
      { question: "เบนรู้สึกอย่างไรก่อนสัมภาษณ์?", options: ["มั่นใจ", "สนุก", "กังวล", "เบื่อ"], correctIndex: 2, type: "comprehension" },
      { question: "'confident' แปลว่าอะไร?", options: ["กลัว", "มั่นใจ", "เหนื่อย", "ดีใจ"], correctIndex: 1, type: "vocab" },
      { question: "'hire' แปลว่าอะไร?", options: ["ไล่ออก", "จ้าง", "สอน", "ช่วย"], correctIndex: 1, type: "vocab" },
      { question: "ผลสัมภาษณ์เป็นอย่างไร?", options: ["ไม่ผ่าน", "รอผล", "ได้งาน", "ต้องสัมภาษณ์ใหม่"], correctIndex: 2, type: "comprehension" },
    ],
    imagePrompt: "happy young man in suit shaking hands with boss in office after job interview",
  },

  // ===== HOME =====
  {
    id: "home-1",
    categoryId: "home",
    level: 1,
    title: "The New Puppy",
    titleThai: "ลูกหมาตัวใหม่",
    preview: "The family gets a new puppy but it causes chaos...",
    vocabulary: [
      { word: "puppy", phonetic: "พัพพี่", meaning: "ลูกหมา", partOfSpeech: "n." },
      { word: "cute", phonetic: "คิวท์", meaning: "น่ารัก", partOfSpeech: "adj." },
      { word: "naughty", phonetic: "น็อตี้", meaning: "ซน", partOfSpeech: "adj." },
      { word: "shoe", phonetic: "ชู", meaning: "รองเท้า", partOfSpeech: "n." },
      { word: "mess", phonetic: "เมส", meaning: "ความยุ่งเหยิง", partOfSpeech: "n." },
      { word: "love", phonetic: "เลิฟ", meaning: "รัก", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "The", thai: "เดอะ" }, { english: "family", thai: "แฟมิลี่" }, { english: "got", thai: "ก็อท" }, { english: "a", thai: "อะ" }, { english: "new", thai: "นิว" }, { english: "puppy.", thai: "พัพพี่" }],
      [{ english: "It", thai: "อิท" }, { english: "was", thai: "วอส" }, { english: "very", thai: "เวรี่" }, { english: "cute!", thai: "คิวท์" }],
      [{ english: "But", thai: "บัท" }, { english: "the", thai: "เดอะ" }, { english: "puppy", thai: "พัพพี่" }, { english: "was", thai: "วอส" }, { english: "naughty.", thai: "น็อตี้" }],
      [{ english: "It", thai: "อิท" }, { english: "ate", thai: "เอท" }, { english: "Dad's", thai: "แด็ดส์" }, { english: "shoes.", thai: "ชูส์" }],
      [{ english: "It", thai: "อิท" }, { english: "made", thai: "เมด" }, { english: "a", thai: "อะ" }, { english: "big", thai: "บิก" }, { english: "mess.", thai: "เมส" }],
      [{ english: "But", thai: "บัท" }, { english: "everyone", thai: "เอฟรี่วัน" }, { english: "loved", thai: "เลิฟด์" }, { english: "the", thai: "เดอะ" }, { english: "puppy", thai: "พัพพี่" }, { english: "so", thai: "โซ" }, { english: "much!", thai: "มัช" }],
    ],
    articleTranslation: "ครอบครัวได้ลูกหมาตัวใหม่ มันน่ารักมาก! แต่ลูกหมาซนมาก มันกัดรองเท้าพ่อ มันทำบ้านรก แต่ทุกคนรักลูกหมาตัวนี้มาก!",
    quiz: [
      { question: "ลูกหมาเป็นอย่างไร?", options: ["เงียบ", "น่ารักแต่ซน", "น่ากลัว", "ขี้เกียจ"], correctIndex: 1, type: "comprehension" },
      { question: "'naughty' แปลว่าอะไร?", options: ["น่ารัก", "ซน", "เชื่อง", "ง่วง"], correctIndex: 1, type: "vocab" },
      { question: "ลูกหมากินอะไร?", options: ["ข้าว", "ขนม", "รองเท้า", "หมอน"], correctIndex: 2, type: "comprehension" },
      { question: "'mess' แปลว่าอะไร?", options: ["ความสุข", "ความสะอาด", "ความยุ่งเหยิง", "ของเล่น"], correctIndex: 2, type: "vocab" },
    ],
    imagePrompt: "adorable naughty puppy chewing on shoes surrounded by mess, family laughing",
  },

  // ===== TECH =====
  {
    id: "tech-1",
    categoryId: "tech",
    level: 2,
    title: "The Phone Addiction",
    titleThai: "ติดโทรศัพท์",
    preview: "Bam realizes she spends too much time on her phone...",
    vocabulary: [
      { word: "screen", phonetic: "สกรีน", meaning: "หน้าจอ", partOfSpeech: "n." },
      { word: "notification", phonetic: "โนติฟิเคชั่น", meaning: "การแจ้งเตือน", partOfSpeech: "n." },
      { word: "hour", phonetic: "อาวเออร์", meaning: "ชั่วโมง", partOfSpeech: "n." },
      { word: "realize", phonetic: "เรียลไลซ์", meaning: "ตระหนัก", partOfSpeech: "v." },
      { word: "habit", phonetic: "แฮบิท", meaning: "นิสัย", partOfSpeech: "n." },
      { word: "outside", phonetic: "เอาท์ไซด์", meaning: "ข้างนอก", partOfSpeech: "adv." },
    ],
    articleSentences: [
      [{ english: "Bam", thai: "แบม" }, { english: "checked", thai: "เช็คท์" }, { english: "her", thai: "เฮอร์" }, { english: "phone", thai: "โฟน" }, { english: "every", thai: "เอฟรี่" }, { english: "five", thai: "ไฟฟ์" }, { english: "minutes.", thai: "มินิทส์" }],
      [{ english: "Notifications", thai: "โนติฟิเคชั่นส์" }, { english: "popped", thai: "พ็อปท์" }, { english: "up", thai: "อัพ" }, { english: "all", thai: "ออล" }, { english: "day.", thai: "เดย์" }],
      [{ english: "One", thai: "วัน" }, { english: "day,", thai: "เดย์" }, { english: "she", thai: "ชี" }, { english: "checked", thai: "เช็คท์" }, { english: "her", thai: "เฮอร์" }, { english: "screen", thai: "สกรีน" }, { english: "time:", thai: "ไทม์" }, { english: "8", thai: "เอท" }, { english: "hours!", thai: "อาวเออร์ส" }],
      [{ english: "She", thai: "ชี" }, { english: "realized", thai: "เรียลไลซ์ด" }, { english: "this", thai: "ดิส" }, { english: "was", thai: "วอส" }, { english: "a", thai: "อะ" }, { english: "bad", thai: "แบ็ด" }, { english: "habit.", thai: "แฮบิท" }],
      [{ english: "She", thai: "ชี" }, { english: "put", thai: "พุท" }, { english: "the", thai: "เดอะ" }, { english: "phone", thai: "โฟน" }, { english: "down", thai: "ดาวน์" }, { english: "and", thai: "แอนด์" }, { english: "went", thai: "เว็นท์" }, { english: "outside.", thai: "เอาท์ไซด์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "sunshine", thai: "ซันไชน์" }, { english: "felt", thai: "เฟ็ลท์" }, { english: "wonderful!", thai: "วันเดอร์ฟุล" }],
    ],
    articleTranslation: "แบมดูโทรศัพท์ทุก 5 นาที แจ้งเตือนขึ้นทั้งวัน วันหนึ่งเธอเช็คเวลาใช้หน้าจอ: 8 ชั่วโมง! เธอตระหนักว่านี่เป็นนิสัยที่ไม่ดี เธอวางโทรศัพท์แล้วออกไปข้างนอก แสงแดดรู้สึกดีมาก!",
    quiz: [
      { question: "แบมใช้โทรศัพท์วันละกี่ชั่วโมง?", options: ["3 ชั่วโมง", "5 ชั่วโมง", "8 ชั่วโมง", "10 ชั่วโมง"], correctIndex: 2, type: "comprehension" },
      { question: "'screen' แปลว่าอะไร?", options: ["ลำโพง", "กล้อง", "หน้าจอ", "แบตเตอรี่"], correctIndex: 2, type: "vocab" },
      { question: "'habit' แปลว่าอะไร?", options: ["ความสุข", "นิสัย", "ปัญหา", "เกม"], correctIndex: 1, type: "vocab" },
      { question: "แบมทำอะไรหลังจากรู้ตัว?", options: ["ดูต่อ", "ลบแอป", "ออกไปข้างนอก", "ซื้อโทรศัพท์ใหม่"], correctIndex: 2, type: "comprehension" },
    ],
    imagePrompt: "girl putting phone down and going outside into sunshine, happy expression",
  },
];

export function getStoriesByCategory(categoryId: string): ReadingStory[] {
  return readingStories.filter(s => s.categoryId === categoryId);
}

export function getStoryById(storyId: string): ReadingStory | undefined {
  return readingStories.find(s => s.id === storyId);
}
