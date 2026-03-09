export interface PathNode {
  index: number;
  topic: string;
  topicThai: string;
  level: number;
  icon: string;
}

export const pathNodes: PathNode[] = [
  // Level 1 - Beginner (nodes 0-9)
  { index: 0, topic: "Greetings", topicThai: "การทักทาย", level: 1, icon: "👋" },
  { index: 1, topic: "Numbers", topicThai: "ตัวเลข", level: 1, icon: "🔢" },
  { index: 2, topic: "Colors", topicThai: "สี", level: 1, icon: "🎨" },
  { index: 3, topic: "My Family", topicThai: "ครอบครัว", level: 1, icon: "👨‍👩‍👧‍👦" },
  { index: 4, topic: "Food and Drinks", topicThai: "อาหารและเครื่องดื่ม", level: 1, icon: "🍔" },
  { index: 5, topic: "Animals", topicThai: "สัตว์", level: 1, icon: "🐶" },
  { index: 6, topic: "Days and Time", topicThai: "วันและเวลา", level: 1, icon: "📅" },
  { index: 7, topic: "My House", topicThai: "บ้านของฉัน", level: 1, icon: "🏠" },
  { index: 8, topic: "School Things", topicThai: "ของใช้ในโรงเรียน", level: 1, icon: "📚" },
  { index: 9, topic: "Weather", topicThai: "สภาพอากาศ", level: 1, icon: "☀️" },

  // Level 2 - Elementary (nodes 10-19)
  { index: 10, topic: "Going Shopping", topicThai: "ไปซื้อของ", level: 2, icon: "🛒" },
  { index: 11, topic: "At the Restaurant", topicThai: "ที่ร้านอาหาร", level: 2, icon: "🍽️" },
  { index: 12, topic: "Hobbies", topicThai: "งานอดิเรก", level: 2, icon: "⚽" },
  { index: 13, topic: "Traveling by Bus", topicThai: "เดินทางโดยรถเมล์", level: 2, icon: "🚌" },
  { index: 14, topic: "Going to the Doctor", topicThai: "ไปหาหมอ", level: 2, icon: "🏥" },
  { index: 15, topic: "Weekend Plans", topicThai: "แผนวันหยุด", level: 2, icon: "🗓️" },
  { index: 16, topic: "Cooking", topicThai: "การทำอาหาร", level: 2, icon: "👨‍🍳" },
  { index: 17, topic: "Clothes and Fashion", topicThai: "เสื้อผ้าและแฟชั่น", level: 2, icon: "👗" },
  { index: 18, topic: "My Neighborhood", topicThai: "ละแวกบ้าน", level: 2, icon: "🏘️" },
  { index: 19, topic: "Pets at Home", topicThai: "สัตว์เลี้ยง", level: 2, icon: "🐱" },

  // Level 3 - Intermediate (nodes 20-29)
  { index: 20, topic: "Social Media", topicThai: "โซเชียลมีเดีย", level: 3, icon: "📱" },
  { index: 21, topic: "Thai Festivals", topicThai: "เทศกาลไทย", level: 3, icon: "🎉" },
  { index: 22, topic: "Exercise and Health", topicThai: "ออกกำลังกายและสุขภาพ", level: 3, icon: "🏃" },
  { index: 23, topic: "Online Learning", topicThai: "เรียนออนไลน์", level: 3, icon: "💻" },
  { index: 24, topic: "Street Food Culture", topicThai: "วัฒนธรรมอาหารริมทาง", level: 3, icon: "🍜" },
  { index: 25, topic: "Job Interview", topicThai: "สัมภาษณ์งาน", level: 3, icon: "💼" },
  { index: 26, topic: "Environmental Problems", topicThai: "ปัญหาสิ่งแวดล้อม", level: 3, icon: "🌍" },
  { index: 27, topic: "Public Transportation", topicThai: "ขนส่งสาธารณะ", level: 3, icon: "🚇" },
  { index: 28, topic: "Thai Music", topicThai: "เพลงไทย", level: 3, icon: "🎵" },
  { index: 29, topic: "Recycling", topicThai: "การรีไซเคิล", level: 3, icon: "♻️" },

  // Level 4 - Upper Intermediate (nodes 30-39)
  { index: 30, topic: "Climate Change in Thailand", topicThai: "การเปลี่ยนแปลงสภาพภูมิอากาศ", level: 4, icon: "🌡️" },
  { index: 31, topic: "Digital Nomad Life", topicThai: "ชีวิตดิจิทัลโนแมด", level: 4, icon: "🌏" },
  { index: 32, topic: "Startup Culture", topicThai: "วัฒนธรรมสตาร์ทอัพ", level: 4, icon: "🚀" },
  { index: 33, topic: "Mental Health", topicThai: "สุขภาพจิต", level: 4, icon: "🧠" },
  { index: 34, topic: "Sustainable Tourism", topicThai: "การท่องเที่ยวยั่งยืน", level: 4, icon: "🌿" },
  { index: 35, topic: "AI in Daily Life", topicThai: "AI ในชีวิตประจำวัน", level: 4, icon: "🤖" },
  { index: 36, topic: "Cultural Preservation", topicThai: "การอนุรักษ์วัฒนธรรม", level: 4, icon: "🏛️" },
  { index: 37, topic: "Urban vs Rural", topicThai: "เมืองกับชนบท", level: 4, icon: "🏙️" },
  { index: 38, topic: "Financial Literacy", topicThai: "ความรู้ทางการเงิน", level: 4, icon: "💰" },
  { index: 39, topic: "Remote Work", topicThai: "ทำงานทางไกล", level: 4, icon: "🏡" },

  // Level 5 - Advanced (nodes 40-49)
  { index: 40, topic: "Geopolitics and Trade", topicThai: "ภูมิรัฐศาสตร์และการค้า", level: 5, icon: "🌐" },
  { index: 41, topic: "Philosophy of Technology", topicThai: "ปรัชญาเทคโนโลยี", level: 5, icon: "💡" },
  { index: 42, topic: "Socioeconomic Inequality", topicThai: "ความเหลื่อมล้ำทางเศรษฐกิจ", level: 5, icon: "⚖️" },
  { index: 43, topic: "Bioethics", topicThai: "จริยธรรมชีวภาพ", level: 5, icon: "🧬" },
  { index: 44, topic: "Psychology of Decisions", topicThai: "จิตวิทยาการตัดสินใจ", level: 5, icon: "🎯" },
  { index: 45, topic: "Globalization and Identity", topicThai: "โลกาภิวัตน์กับอัตลักษณ์", level: 5, icon: "🗺️" },
  { index: 46, topic: "Cryptocurrency", topicThai: "คริปโตเคอร์เรนซี", level: 5, icon: "₿" },
  { index: 47, topic: "Media Literacy", topicThai: "การรู้เท่าทันสื่อ", level: 5, icon: "📰" },
  { index: 48, topic: "Space Exploration", topicThai: "การสำรวจอวกาศ", level: 5, icon: "🚀" },
  { index: 49, topic: "Future of Education", topicThai: "อนาคตของการศึกษา", level: 5, icon: "🎓" },
];

export const levelColors: Record<number, string> = {
  1: "hsl(var(--primary))",
  2: "hsl(var(--accent))",
  3: "hsl(220 60% 50%)",
  4: "hsl(280 60% 50%)",
  5: "hsl(340 60% 50%)",
};

export const levelLabels: Record<number, string> = {
  1: "เริ่มต้น",
  2: "พื้นฐาน",
  3: "ปานกลาง",
  4: "ก้าวหน้า",
  5: "เชี่ยวชาญ",
};
