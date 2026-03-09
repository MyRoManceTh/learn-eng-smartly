export interface PronunciationWord {
  english: string;
  phonetic: string;
  thai: string;
  /** IPA pronunciation */
  ipa: string;
}

export interface PronunciationGroup {
  id: string;
  icon: string;
  title: string;
  titleThai: string;
  description: string;
  color: string;
  difficulty: 1 | 2 | 3;
  words: PronunciationWord[];
}

export const pronunciationGroups: PronunciationGroup[] = [
  {
    id: "r-vs-l",
    icon: "🔤",
    title: "R vs L",
    titleThai: "เสียง R กับ L",
    description: "Practice the difference between R and L sounds",
    color: "from-blue-400 to-cyan-400",
    difficulty: 1,
    words: [
      { english: "rice", phonetic: "ไรซ์", thai: "ข้าว", ipa: "/raɪs/" },
      { english: "lice", phonetic: "ไลซ์", thai: "เหา", ipa: "/laɪs/" },
      { english: "right", phonetic: "ไรท์", thai: "ถูกต้อง", ipa: "/raɪt/" },
      { english: "light", phonetic: "ไลท์", thai: "แสง", ipa: "/laɪt/" },
      { english: "read", phonetic: "รีด", thai: "อ่าน", ipa: "/riːd/" },
      { english: "lead", phonetic: "ลีด", thai: "นำ", ipa: "/liːd/" },
      { english: "road", phonetic: "โรด", thai: "ถนน", ipa: "/roʊd/" },
      { english: "load", phonetic: "โลด", thai: "โหลด", ipa: "/loʊd/" },
      { english: "rock", phonetic: "ร็อค", thai: "หิน", ipa: "/rɒk/" },
      { english: "lock", phonetic: "ล็อค", thai: "ล็อค", ipa: "/lɒk/" },
      { english: "rain", phonetic: "เรน", thai: "ฝน", ipa: "/reɪn/" },
      { english: "lane", phonetic: "เลน", thai: "เลน", ipa: "/leɪn/" },
    ],
  },
  {
    id: "th-sound",
    icon: "👅",
    title: "TH Sounds",
    titleThai: "เสียง TH",
    description: "Learn voiced and voiceless TH sounds",
    color: "from-purple-400 to-pink-400",
    difficulty: 2,
    words: [
      { english: "think", phonetic: "ธิงค์", thai: "คิด", ipa: "/θɪŋk/" },
      { english: "this", phonetic: "ดิส", thai: "นี้", ipa: "/ðɪs/" },
      { english: "three", phonetic: "ธรี", thai: "สาม", ipa: "/θriː/" },
      { english: "the", phonetic: "เดอะ", thai: "เดอะ", ipa: "/ðə/" },
      { english: "thank", phonetic: "แธ็งค์", thai: "ขอบคุณ", ipa: "/θæŋk/" },
      { english: "that", phonetic: "แด็ท", thai: "นั่น", ipa: "/ðæt/" },
      { english: "thought", phonetic: "ธอท", thai: "ความคิด", ipa: "/θɔːt/" },
      { english: "though", phonetic: "โดว", thai: "ถึงแม้ว่า", ipa: "/ðoʊ/" },
      { english: "bath", phonetic: "บาธ", thai: "อ่างอาบน้ำ", ipa: "/bæθ/" },
      { english: "bathe", phonetic: "เบธ", thai: "อาบน้ำ", ipa: "/beɪð/" },
      { english: "mouth", phonetic: "เมาธ", thai: "ปาก", ipa: "/maʊθ/" },
      { english: "weather", phonetic: "เว็ทเธอร์", thai: "สภาพอากาศ", ipa: "/ˈweðər/" },
    ],
  },
  {
    id: "v-vs-w",
    icon: "💨",
    title: "V vs W",
    titleThai: "เสียง V กับ W",
    description: "Distinguish V and W sounds correctly",
    color: "from-emerald-400 to-green-400",
    difficulty: 1,
    words: [
      { english: "very", phonetic: "เวรี่", thai: "มาก", ipa: "/ˈveri/" },
      { english: "wary", phonetic: "แวรี่", thai: "ระวัง", ipa: "/ˈweri/" },
      { english: "vine", phonetic: "ไวน์", thai: "เถาวัลย์", ipa: "/vaɪn/" },
      { english: "wine", phonetic: "ไวน์", thai: "ไวน์", ipa: "/waɪn/" },
      { english: "vet", phonetic: "เว็ท", thai: "สัตวแพทย์", ipa: "/vet/" },
      { english: "wet", phonetic: "เว็ท", thai: "เปียก", ipa: "/wet/" },
      { english: "vest", phonetic: "เว็สท์", thai: "เสื้อกั๊ก", ipa: "/vest/" },
      { english: "west", phonetic: "เว็สท์", thai: "ตะวันตก", ipa: "/west/" },
      { english: "van", phonetic: "แวน", thai: "รถตู้", ipa: "/væn/" },
      { english: "want", phonetic: "วอนท์", thai: "ต้องการ", ipa: "/wɒnt/" },
      { english: "voice", phonetic: "วอยซ์", thai: "เสียง", ipa: "/vɔɪs/" },
      { english: "water", phonetic: "วอเทอร์", thai: "น้ำ", ipa: "/ˈwɔːtər/" },
    ],
  },
  {
    id: "short-long-vowels",
    icon: "🔊",
    title: "Short vs Long Vowels",
    titleThai: "สระสั้น vs สระยาว",
    description: "Practice short and long vowel sounds",
    color: "from-orange-400 to-red-400",
    difficulty: 2,
    words: [
      { english: "ship", phonetic: "ชิพ", thai: "เรือ", ipa: "/ʃɪp/" },
      { english: "sheep", phonetic: "ชีพ", thai: "แกะ", ipa: "/ʃiːp/" },
      { english: "bit", phonetic: "บิท", thai: "นิดหน่อย", ipa: "/bɪt/" },
      { english: "beat", phonetic: "บีท", thai: "ตี/เต้น", ipa: "/biːt/" },
      { english: "pull", phonetic: "พุล", thai: "ดึง", ipa: "/pʊl/" },
      { english: "pool", phonetic: "พูล", thai: "สระว่ายน้ำ", ipa: "/puːl/" },
      { english: "full", phonetic: "ฟุล", thai: "เต็ม", ipa: "/fʊl/" },
      { english: "fool", phonetic: "ฟูล", thai: "คนโง่", ipa: "/fuːl/" },
      { english: "look", phonetic: "ลุก", thai: "มอง", ipa: "/lʊk/" },
      { english: "Luke", phonetic: "ลูค", thai: "ลูค (ชื่อ)", ipa: "/luːk/" },
      { english: "cat", phonetic: "แค็ท", thai: "แมว", ipa: "/kæt/" },
      { english: "cart", phonetic: "คาร์ท", thai: "รถเข็น", ipa: "/kɑːrt/" },
    ],
  },
  {
    id: "silent-letters",
    icon: "🤫",
    title: "Silent Letters",
    titleThai: "ตัวอักษรที่ไม่ออกเสียง",
    description: "Words with letters you don't pronounce",
    color: "from-indigo-400 to-violet-400",
    difficulty: 3,
    words: [
      { english: "knife", phonetic: "ไนฟ์", thai: "มีด", ipa: "/naɪf/" },
      { english: "know", phonetic: "โน", thai: "รู้", ipa: "/noʊ/" },
      { english: "knee", phonetic: "นี", thai: "เข่า", ipa: "/niː/" },
      { english: "walk", phonetic: "วอค", thai: "เดิน", ipa: "/wɔːk/" },
      { english: "talk", phonetic: "ทอค", thai: "พูด", ipa: "/tɔːk/" },
      { english: "half", phonetic: "ฮาฟ", thai: "ครึ่ง", ipa: "/hæf/" },
      { english: "would", phonetic: "วูด", thai: "จะ", ipa: "/wʊd/" },
      { english: "should", phonetic: "ชูด", thai: "ควร", ipa: "/ʃʊd/" },
      { english: "island", phonetic: "ไอแลนด์", thai: "เกาะ", ipa: "/ˈaɪlənd/" },
      { english: "listen", phonetic: "ลิสเซิน", thai: "ฟัง", ipa: "/ˈlɪsən/" },
      { english: "Wednesday", phonetic: "เว็นส์เดย์", thai: "วันพุธ", ipa: "/ˈwenzdeɪ/" },
      { english: "muscle", phonetic: "มัสเซิล", thai: "กล้ามเนื้อ", ipa: "/ˈmʌsəl/" },
    ],
  },
  {
    id: "ending-sounds",
    icon: "🔚",
    title: "Ending Sounds",
    titleThai: "เสียงท้ายคำ",
    description: "Practice tricky word endings (-ed, -s, -th)",
    color: "from-teal-400 to-cyan-400",
    difficulty: 2,
    words: [
      { english: "walked", phonetic: "วอคท์", thai: "เดิน (อดีต)", ipa: "/wɔːkt/" },
      { english: "called", phonetic: "คอลด์", thai: "โทร (อดีต)", ipa: "/kɔːld/" },
      { english: "wanted", phonetic: "วอนเท็ด", thai: "ต้องการ (อดีต)", ipa: "/ˈwɒntɪd/" },
      { english: "played", phonetic: "เพลด์", thai: "เล่น (อดีต)", ipa: "/pleɪd/" },
      { english: "watched", phonetic: "วอชท์", thai: "ดู (อดีต)", ipa: "/wɒtʃt/" },
      { english: "decided", phonetic: "ดิไซเด็ด", thai: "ตัดสินใจ (อดีต)", ipa: "/dɪˈsaɪdɪd/" },
      { english: "cats", phonetic: "แค็ทส์", thai: "แมว (พหูพจน์)", ipa: "/kæts/" },
      { english: "dogs", phonetic: "ด็อกซ์", thai: "หมา (พหูพจน์)", ipa: "/dɒɡz/" },
      { english: "boxes", phonetic: "บ็อกเซส", thai: "กล่อง (พหูพจน์)", ipa: "/ˈbɒksɪz/" },
      { english: "laughed", phonetic: "ลาฟท์", thai: "หัวเราะ (อดีต)", ipa: "/lɑːft/" },
      { english: "clothes", phonetic: "โคลธส์", thai: "เสื้อผ้า", ipa: "/kloʊðz/" },
      { english: "months", phonetic: "มันธส์", thai: "เดือน (พหูพจน์)", ipa: "/mʌnθs/" },
    ],
  },
];
