export interface MatchPair {
  english: string;
  thai: string;
}

export interface FillBlankQuestion {
  sentence: string;
  answer: string;
  options: string[];
  translation: string;
}

export interface WordGameSet {
  id: string;
  level: 1 | 2 | 3;
  category: string;
  categoryThai: string;
  matching: MatchPair[];
  fillBlanks: FillBlankQuestion[];
}

export const wordGameSets: WordGameSet[] = [
  {
    id: "daily-1",
    level: 1,
    category: "Daily Routine",
    categoryThai: "กิจวัตรประจำวัน",
    matching: [
      { english: "wake up", thai: "ตื่นนอน" },
      { english: "breakfast", thai: "อาหารเช้า" },
      { english: "brush teeth", thai: "แปรงฟัน" },
      { english: "go to school", thai: "ไปโรงเรียน" },
      { english: "lunch", thai: "อาหารกลางวัน" },
      { english: "go home", thai: "กลับบ้าน" },
      { english: "dinner", thai: "อาหารเย็น" },
      { english: "sleep", thai: "นอน" },
    ],
    fillBlanks: [
      { sentence: "I ___ at 7 o'clock every morning.", answer: "wake up", options: ["wake up", "sleep", "eat", "run"], translation: "ฉันตื่นนอนตอน 7 โมงทุกเช้า" },
      { sentence: "She eats ___ before going to school.", answer: "breakfast", options: ["breakfast", "dinner", "lunch", "snack"], translation: "เธอกินอาหารเช้าก่อนไปโรงเรียน" },
      { sentence: "Don't forget to ___ your teeth!", answer: "brush", options: ["brush", "wash", "clean", "fix"], translation: "อย่าลืมแปรงฟันนะ!" },
      { sentence: "I'm tired. I want to ___.", answer: "sleep", options: ["sleep", "eat", "play", "run"], translation: "ฉันเหนื่อย อยากนอน" },
    ],
  },
  {
    id: "food-1",
    level: 1,
    category: "Food & Drinks",
    categoryThai: "อาหารและเครื่องดื่ม",
    matching: [
      { english: "rice", thai: "ข้าว" },
      { english: "chicken", thai: "ไก่" },
      { english: "water", thai: "น้ำ" },
      { english: "egg", thai: "ไข่" },
      { english: "milk", thai: "นม" },
      { english: "fruit", thai: "ผลไม้" },
      { english: "bread", thai: "ขนมปัง" },
      { english: "coffee", thai: "กาแฟ" },
    ],
    fillBlanks: [
      { sentence: "I drink ___ every morning.", answer: "coffee", options: ["coffee", "rice", "bread", "egg"], translation: "ฉันดื่มกาแฟทุกเช้า" },
      { sentence: "Can I have a glass of ___?", answer: "water", options: ["water", "rice", "chicken", "bread"], translation: "ขอน้ำหนึ่งแก้วได้ไหม?" },
      { sentence: "Thai people eat ___ with every meal.", answer: "rice", options: ["rice", "bread", "cake", "pizza"], translation: "คนไทยกินข้าวทุกมื้อ" },
      { sentence: "An apple is a type of ___.", answer: "fruit", options: ["fruit", "meat", "drink", "vegetable"], translation: "แอปเปิ้ลเป็นผลไม้ชนิดหนึ่ง" },
    ],
  },
  {
    id: "feelings-1",
    level: 1,
    category: "Feelings",
    categoryThai: "ความรู้สึก",
    matching: [
      { english: "happy", thai: "มีความสุข" },
      { english: "sad", thai: "เศร้า" },
      { english: "angry", thai: "โกรธ" },
      { english: "tired", thai: "เหนื่อย" },
      { english: "scared", thai: "กลัว" },
      { english: "excited", thai: "ตื่นเต้น" },
      { english: "hungry", thai: "หิว" },
      { english: "bored", thai: "เบื่อ" },
    ],
    fillBlanks: [
      { sentence: "I passed the exam! I'm so ___!", answer: "happy", options: ["happy", "sad", "angry", "scared"], translation: "ฉันสอบผ่าน! ดีใจมาก!" },
      { sentence: "The movie is not fun. I'm ___.", answer: "bored", options: ["bored", "excited", "happy", "scared"], translation: "หนังไม่สนุก เบื่อจัง" },
      { sentence: "I haven't eaten all day. I'm very ___.", answer: "hungry", options: ["hungry", "tired", "angry", "happy"], translation: "ไม่ได้กินอะไรทั้งวัน หิวมาก" },
      { sentence: "After running 5 km, I feel very ___.", answer: "tired", options: ["tired", "hungry", "bored", "scared"], translation: "หลังวิ่ง 5 กม. เหนื่อยมาก" },
    ],
  },
  {
    id: "travel-1",
    level: 2,
    category: "Travel",
    categoryThai: "การเดินทาง",
    matching: [
      { english: "airport", thai: "สนามบิน" },
      { english: "passport", thai: "หนังสือเดินทาง" },
      { english: "luggage", thai: "กระเป๋าเดินทาง" },
      { english: "ticket", thai: "ตั๋ว" },
      { english: "hotel", thai: "โรงแรม" },
      { english: "reservation", thai: "การจอง" },
      { english: "departure", thai: "ขาออก" },
      { english: "arrival", thai: "ขาเข้า" },
    ],
    fillBlanks: [
      { sentence: "Don't forget your ___ when traveling abroad.", answer: "passport", options: ["passport", "ticket", "luggage", "hotel"], translation: "อย่าลืมพาสปอร์ตเวลาไปต่างประเทศ" },
      { sentence: "The flight ___ is at gate 5.", answer: "departure", options: ["departure", "arrival", "reservation", "ticket"], translation: "เที่ยวบินขาออกอยู่ที่ประตู 5" },
      { sentence: "I made a ___ at the hotel for two nights.", answer: "reservation", options: ["reservation", "departure", "passport", "luggage"], translation: "ฉันจองโรงแรมไว้สองคืน" },
      { sentence: "My ___ is too heavy. I packed too many things!", answer: "luggage", options: ["luggage", "passport", "ticket", "hotel"], translation: "กระเป๋าหนักเกินไป แพ็คของมาเยอะ!" },
    ],
  },
  {
    id: "work-1",
    level: 2,
    category: "Work & Office",
    categoryThai: "ทำงาน",
    matching: [
      { english: "meeting", thai: "ประชุม" },
      { english: "deadline", thai: "กำหนดส่ง" },
      { english: "colleague", thai: "เพื่อนร่วมงาน" },
      { english: "salary", thai: "เงินเดือน" },
      { english: "resign", thai: "ลาออก" },
      { english: "promote", thai: "เลื่อนตำแหน่ง" },
      { english: "overtime", thai: "ทำงานล่วงเวลา" },
      { english: "project", thai: "โปรเจค" },
    ],
    fillBlanks: [
      { sentence: "The ___ is tomorrow. We need to finish the report.", answer: "deadline", options: ["deadline", "meeting", "salary", "project"], translation: "กำหนดส่งคือพรุ่งนี้ ต้องทำรายงานให้เสร็จ" },
      { sentence: "I have a ___ at 2 PM with the marketing team.", answer: "meeting", options: ["meeting", "deadline", "salary", "project"], translation: "มีประชุมตอนบ่าย 2 กับทีมการตลาด" },
      { sentence: "My ___ helped me with the presentation.", answer: "colleague", options: ["colleague", "salary", "deadline", "overtime"], translation: "เพื่อนร่วมงานช่วยทำพรีเซนเทชั่น" },
      { sentence: "She worked ___ to finish the project.", answer: "overtime", options: ["overtime", "deadline", "salary", "meeting"], translation: "เธอทำงานล่วงเวลาเพื่อทำโปรเจคให้เสร็จ" },
    ],
  },
  {
    id: "tech-1",
    level: 3,
    category: "Technology",
    categoryThai: "เทคโนโลยี",
    matching: [
      { english: "download", thai: "ดาวน์โหลด" },
      { english: "upload", thai: "อัพโหลด" },
      { english: "password", thai: "รหัสผ่าน" },
      { english: "update", thai: "อัพเดท" },
      { english: "notification", thai: "การแจ้งเตือน" },
      { english: "screenshot", thai: "ภาพหน้าจอ" },
      { english: "battery", thai: "แบตเตอรี่" },
      { english: "wifi", thai: "ไวไฟ" },
    ],
    fillBlanks: [
      { sentence: "My phone's ___ is low. I need to charge it.", answer: "battery", options: ["battery", "wifi", "password", "screenshot"], translation: "แบตโทรศัพท์เหลือน้อย ต้องชาร์จแล้ว" },
      { sentence: "I forgot my ___ and can't log in.", answer: "password", options: ["password", "battery", "notification", "wifi"], translation: "ลืมรหัสผ่าน เข้าสู่ระบบไม่ได้" },
      { sentence: "Please ___ the app to the latest version.", answer: "update", options: ["update", "download", "upload", "delete"], translation: "กรุณาอัพเดทแอปเป็นเวอร์ชั่นล่าสุด" },
      { sentence: "I can't connect to the ___. Is it working?", answer: "wifi", options: ["wifi", "battery", "password", "screenshot"], translation: "เชื่อมต่อไวไฟไม่ได้ ใช้ได้ปกติไหม?" },
    ],
  },
];
