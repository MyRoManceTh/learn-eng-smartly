export interface ConversationMessage {
  speaker: "npc" | "player";
  text: string;
  textThai: string;
  /** If speaker is "player", provide options for the player to choose */
  options?: { text: string; textThai: string; isCorrect: boolean }[];
}

export interface ConversationScenario {
  id: string;
  icon: string;
  title: string;
  titleThai: string;
  description: string;
  level: 1 | 2 | 3;
  color: string;
  npcName: string;
  npcRole: string;
  messages: ConversationMessage[];
  /** vocab learned in this conversation */
  keyPhrases: { english: string; thai: string }[];
}

export const conversationScenarios: ConversationScenario[] = [
  {
    id: "coffee-shop",
    icon: "☕",
    title: "Ordering Coffee",
    titleThai: "สั่งกาแฟ",
    description: "Order your favorite drink at a coffee shop",
    level: 1,
    color: "from-amber-400 to-orange-400",
    npcName: "Barista",
    npcRole: "พนักงานร้านกาแฟ",
    keyPhrases: [
      { english: "Can I have...?", thai: "ขอ...ได้ไหมครับ/คะ?" },
      { english: "What size?", thai: "ขนาดไหนคะ/ครับ?" },
      { english: "For here or to go?", thai: "ทานที่ร้านหรือกลับบ้านคะ?" },
      { english: "That'll be...", thai: "ทั้งหมด...ค่ะ/ครับ" },
    ],
    messages: [
      { speaker: "npc", text: "Hi! Welcome to Cafe Bloom. What can I get for you today?", textThai: "สวัสดีค่ะ! ยินดีต้อนรับสู่ Cafe Bloom วันนี้รับอะไรดีคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Can I have an iced latte, please?", textThai: "ขอลาเต้เย็นหนึ่งแก้วครับ/ค่ะ", isCorrect: true },
        { text: "Give me coffee now!", textThai: "เอากาแฟมาเดี๋ยวนี้!", isCorrect: false },
        { text: "I don't know what coffee is.", textThai: "ฉันไม่รู้จักกาแฟ", isCorrect: false },
      ]},
      { speaker: "npc", text: "Sure! What size would you like? Small, medium, or large?", textThai: "ได้ค่ะ! รับไซส์ไหนดีคะ? เล็ก กลาง หรือใหญ่?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Medium, please.", textThai: "ไซส์กลางครับ/ค่ะ", isCorrect: true },
        { text: "The biggest one you have!", textThai: "แก้วใหญ่ที่สุดเลย!", isCorrect: false },
        { text: "I'll have a small, thank you.", textThai: "ขอเล็กนะครับ/ค่ะ ขอบคุณ", isCorrect: true },
      ]},
      { speaker: "npc", text: "Great choice! For here or to go?", textThai: "เลือกดีมากค่ะ! ทานที่ร้านหรือกลับบ้านคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "To go, please.", textThai: "กลับบ้านครับ/ค่ะ", isCorrect: true },
        { text: "For here, please.", textThai: "ทานที่ร้านครับ/ค่ะ", isCorrect: true },
        { text: "I want to sit on the floor.", textThai: "อยากนั่งพื้น", isCorrect: false },
      ]},
      { speaker: "npc", text: "That'll be 85 baht. Thank you! Enjoy your coffee!", textThai: "ทั้งหมด 85 บาทค่ะ ขอบคุณค่ะ! ดื่มให้อร่อยนะคะ!" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Thank you! Have a nice day!", textThai: "ขอบคุณครับ/ค่ะ! ขอให้เป็นวันที่ดีนะ!", isCorrect: true },
        { text: "Thanks!", textThai: "ขอบคุณ!", isCorrect: true },
        { text: "Whatever.", textThai: "อะไรก็ได้", isCorrect: false },
      ]},
    ],
  },
  {
    id: "hotel-checkin",
    icon: "🏨",
    title: "Hotel Check-in",
    titleThai: "เช็คอินโรงแรม",
    description: "Check into a hotel and ask about your room",
    level: 1,
    color: "from-blue-400 to-indigo-400",
    npcName: "Receptionist",
    npcRole: "พนักงานต้อนรับ",
    keyPhrases: [
      { english: "I have a reservation.", thai: "ผม/ฉันจองไว้แล้วครับ/ค่ะ" },
      { english: "Under the name...", thai: "จองในชื่อ..." },
      { english: "What time is...?", thai: "...กี่โมงคะ/ครับ?" },
      { english: "Here's your key.", thai: "กุญแจห้องค่ะ/ครับ" },
    ],
    messages: [
      { speaker: "npc", text: "Good evening! Welcome to Grand Hotel. How may I help you?", textThai: "สวัสดีตอนเย็นค่ะ! ยินดีต้อนรับสู่ Grand Hotel ให้ช่วยอะไรดีคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Hi, I have a reservation under the name Smith.", textThai: "สวัสดีครับ/ค่ะ ผม/ฉันจองไว้ในชื่อ Smith", isCorrect: true },
        { text: "Give me the best room!", textThai: "เอาห้องดีที่สุดมา!", isCorrect: false },
        { text: "I'd like to check in, please.", textThai: "ขอเช็คอินครับ/ค่ะ", isCorrect: true },
      ]},
      { speaker: "npc", text: "Let me check... Yes! Room 305 for two nights. May I see your ID, please?", textThai: "ขอเช็คนะคะ... ค่ะ! ห้อง 305 สองคืน ขอดูบัตรประจำตัวหน่อยได้ไหมคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Of course, here you go.", textThai: "ได้เลยครับ/ค่ะ นี่ครับ/ค่ะ", isCorrect: true },
        { text: "No, I won't show you.", textThai: "ไม่ ไม่ให้ดู", isCorrect: false },
        { text: "Sure! Here's my passport.", textThai: "ได้เลย! นี่พาสปอร์ตครับ/ค่ะ", isCorrect: true },
      ]},
      { speaker: "npc", text: "Thank you! Here's your key card. Your room is on the third floor.", textThai: "ขอบคุณค่ะ! นี่คีย์การ์ดค่ะ ห้องอยู่ชั้นสามค่ะ" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "What time is breakfast?", textThai: "อาหารเช้ากี่โมงครับ/คะ?", isCorrect: true },
        { text: "Is there a pool?", textThai: "มีสระว่ายน้ำไหมครับ/คะ?", isCorrect: true },
        { text: "I don't like the third floor!", textThai: "ไม่ชอบชั้นสาม!", isCorrect: false },
      ]},
      { speaker: "npc", text: "Breakfast is from 7 to 10 AM at the restaurant on the first floor. Enjoy your stay!", textThai: "อาหารเช้าตั้งแต่ 7 โมงถึง 10 โมงเช้า ที่ร้านอาหารชั้นหนึ่งค่ะ ขอให้พักผ่อนให้สบายนะคะ!" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Thank you very much!", textThai: "ขอบคุณมากครับ/ค่ะ!", isCorrect: true },
        { text: "Great, thanks for your help!", textThai: "เยี่ยม ขอบคุณที่ช่วยครับ/ค่ะ!", isCorrect: true },
        { text: "OK fine.", textThai: "โอเค", isCorrect: false },
      ]},
    ],
  },
  {
    id: "taxi-ride",
    icon: "🚕",
    title: "Taking a Taxi",
    titleThai: "เรียกแท็กซี่",
    description: "Tell the taxi driver where you want to go",
    level: 1,
    color: "from-yellow-400 to-amber-400",
    npcName: "Driver",
    npcRole: "คนขับแท็กซี่",
    keyPhrases: [
      { english: "Can you take me to...?", thai: "ไป...ได้ไหมครับ/คะ?" },
      { english: "How long will it take?", thai: "ใช้เวลานานแค่ไหน?" },
      { english: "How much is it?", thai: "เท่าไหร่ครับ/คะ?" },
      { english: "Keep the change.", thai: "ไม่ต้องทอนครับ/ค่ะ" },
    ],
    messages: [
      { speaker: "npc", text: "Hello! Where are you going?", textThai: "สวัสดีครับ! ไปไหนครับ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Can you take me to Central World, please?", textThai: "ไปเซ็นทรัลเวิลด์ได้ไหมครับ/คะ?", isCorrect: true },
        { text: "Take me to Central World.", textThai: "ไปเซ็นทรัลเวิลด์", isCorrect: true },
        { text: "Just drive around!", textThai: "ขับไปเรื่อยเลย!", isCorrect: false },
      ]},
      { speaker: "npc", text: "Sure! It might take about 20 minutes because of traffic.", textThai: "ได้ครับ! อาจใช้เวลาประมาณ 20 นาทีเพราะรถติดครับ" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "That's fine, no rush.", textThai: "ไม่เป็นไรครับ/ค่ะ ไม่รีบ", isCorrect: true },
        { text: "Can you go faster?", textThai: "ขับเร็วกว่านี้ได้ไหม?", isCorrect: false },
        { text: "OK, thank you.", textThai: "โอเค ขอบคุณครับ/ค่ะ", isCorrect: true },
      ]},
      { speaker: "npc", text: "Here we are! That'll be 120 baht.", textThai: "ถึงแล้วครับ! ทั้งหมด 120 บาทครับ" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Here you go. Keep the change!", textThai: "นี่ครับ/ค่ะ ไม่ต้องทอนนะ!", isCorrect: true },
        { text: "Thank you! Here's 120 baht.", textThai: "ขอบคุณครับ/ค่ะ! นี่ 120 บาท", isCorrect: true },
        { text: "Too expensive!", textThai: "แพงไป!", isCorrect: false },
      ]},
    ],
  },
  {
    id: "restaurant",
    icon: "🍽️",
    title: "At the Restaurant",
    titleThai: "ที่ร้านอาหาร",
    description: "Order food at a nice restaurant",
    level: 2,
    color: "from-red-400 to-pink-400",
    npcName: "Waiter",
    npcRole: "พนักงานเสิร์ฟ",
    keyPhrases: [
      { english: "Can I see the menu?", thai: "ขอดูเมนูหน่อยได้ไหม?" },
      { english: "I'd like to order...", thai: "ขอสั่ง..." },
      { english: "Could I have the bill?", thai: "ขอบิลหน่อยได้ไหม?" },
      { english: "It was delicious!", thai: "อร่อยมากเลย!" },
    ],
    messages: [
      { speaker: "npc", text: "Good evening! Table for how many?", textThai: "สวัสดีตอนเย็นค่ะ! กี่ท่านคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Table for two, please.", textThai: "สองที่ครับ/ค่ะ", isCorrect: true },
        { text: "Just me, a table for one.", textThai: "คนเดียวครับ/ค่ะ หนึ่งที่", isCorrect: true },
        { text: "I don't want a table.", textThai: "ไม่ต้องการโต๊ะ", isCorrect: false },
      ]},
      { speaker: "npc", text: "Right this way! Here's your menu. I'll give you a moment.", textThai: "ทางนี้เลยค่ะ! นี่เมนูค่ะ ค่อยๆ เลือกก่อนนะคะ" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "I'd like to order the green curry with rice, please.", textThai: "ขอแกงเขียวหวานกับข้าวครับ/ค่ะ", isCorrect: true },
        { text: "What do you recommend?", textThai: "แนะนำอะไรดีครับ/คะ?", isCorrect: true },
        { text: "Everything looks bad.", textThai: "ดูไม่อร่อยเลย", isCorrect: false },
      ]},
      { speaker: "npc", text: "Excellent choice! Would you like something to drink?", textThai: "เลือกได้ดีมากค่ะ! รับเครื่องดื่มอะไรไหมคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Just water, please.", textThai: "ขอน้ำเปล่าครับ/ค่ะ", isCorrect: true },
        { text: "An iced tea, please.", textThai: "ขอชาเย็นหนึ่งแก้วครับ/ค่ะ", isCorrect: true },
        { text: "No!", textThai: "ไม่!", isCorrect: false },
      ]},
      { speaker: "npc", text: "Here's your food! Enjoy your meal!", textThai: "อาหารมาแล้วค่ะ! ทานให้อร่อยนะคะ!" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Thank you! It looks amazing!", textThai: "ขอบคุณค่ะ! ดูอร่อยมากเลย!", isCorrect: true },
        { text: "Could I have the bill when you get a chance?", textThai: "ขอบิลด้วยนะครับ/คะ เดี๋ยวก็ได้", isCorrect: true },
        { text: "It was delicious, thank you!", textThai: "อร่อยมากเลยค่ะ ขอบคุณ!", isCorrect: true },
      ]},
    ],
  },
  {
    id: "doctor-visit",
    icon: "🏥",
    title: "Visiting the Doctor",
    titleThai: "ไปพบแพทย์",
    description: "Describe your symptoms to the doctor",
    level: 2,
    color: "from-green-400 to-teal-400",
    npcName: "Dr. Sarah",
    npcRole: "แพทย์",
    keyPhrases: [
      { english: "I don't feel well.", thai: "รู้สึกไม่สบายครับ/ค่ะ" },
      { english: "I have a headache.", thai: "ปวดหัวครับ/ค่ะ" },
      { english: "How often should I...?", thai: "ควร...บ่อยแค่ไหน?" },
      { english: "Get well soon!", thai: "หายไวๆ นะ!" },
    ],
    messages: [
      { speaker: "npc", text: "Good morning! What brings you in today?", textThai: "สวัสดีตอนเช้าค่ะ! มีอาการอะไรมาวันนี้คะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "I don't feel well. I have a headache and sore throat.", textThai: "รู้สึกไม่สบายครับ/ค่ะ ปวดหัวและเจ็บคอ", isCorrect: true },
        { text: "I have a fever and cough since yesterday.", textThai: "มีไข้กับไอตั้งแต่เมื่อวาน", isCorrect: true },
        { text: "Nothing, I just wanted to visit.", textThai: "ไม่มีอะไร แค่อยากมาเยี่ยม", isCorrect: false },
      ]},
      { speaker: "npc", text: "I see. How long have you had these symptoms?", textThai: "เข้าใจค่ะ มีอาการมานานแค่ไหนแล้วคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "About three days now.", textThai: "ประมาณสามวันแล้วครับ/ค่ะ", isCorrect: true },
        { text: "Since last week.", textThai: "ตั้งแต่อาทิตย์ที่แล้ว", isCorrect: true },
        { text: "I don't remember.", textThai: "จำไม่ได้", isCorrect: false },
      ]},
      { speaker: "npc", text: "Let me check... You have a mild cold. I'll prescribe some medicine. Take it three times a day after meals.", textThai: "ขอตรวจนะคะ... เป็นหวัดเล็กน้อยค่ะ จะสั่งยาให้ กินวันละสามครั้งหลังอาหารนะคะ" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "How often should I take the medicine?", textThai: "ต้องกินยาบ่อยแค่ไหนครับ/คะ?", isCorrect: true },
        { text: "Thank you, doctor. Should I come back?", textThai: "ขอบคุณครับ/ค่ะคุณหมอ ต้องมาตรวจอีกไหม?", isCorrect: true },
        { text: "I don't want medicine.", textThai: "ไม่อยากกินยา", isCorrect: false },
      ]},
      { speaker: "npc", text: "Drink plenty of water and rest well. If you don't feel better in 3 days, come see me again. Take care!", textThai: "ดื่มน้ำเยอะๆ แล้วพักผ่อนให้เพียงพอนะคะ ถ้าไม่ดีขึ้นใน 3 วัน มาหาอีกนะคะ ดูแลตัวเองด้วยค่ะ!" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Thank you so much, doctor! I will.", textThai: "ขอบคุณมากครับ/ค่ะคุณหมอ! จะทำตามครับ/ค่ะ", isCorrect: true },
        { text: "I appreciate your help. Thank you!", textThai: "ขอบคุณที่ช่วยครับ/ค่ะ!", isCorrect: true },
        { text: "OK bye.", textThai: "โอเค บาย", isCorrect: false },
      ]},
    ],
  },
  {
    id: "market-shopping",
    icon: "🛒",
    title: "At the Market",
    titleThai: "ที่ตลาด",
    description: "Buy fruits and bargain at the local market",
    level: 1,
    color: "from-lime-400 to-green-400",
    npcName: "Vendor",
    npcRole: "แม่ค้า",
    keyPhrases: [
      { english: "How much is this?", thai: "อันนี้เท่าไหร่?" },
      { english: "Can you give me a discount?", thai: "ลดได้ไหม?" },
      { english: "I'll take...", thai: "เอา..." },
      { english: "Thank you!", thai: "ขอบคุณ!" },
    ],
    messages: [
      { speaker: "npc", text: "Hello! Fresh fruits today! Come have a look!", textThai: "สวัสดีค่ะ! ผลไม้สดวันนี้! มาดูเลยค่ะ!" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "How much are the mangoes?", textThai: "มะม่วงเท่าไหร่ครับ/คะ?", isCorrect: true },
        { text: "These fruits look nice! How much for one kilo?", textThai: "ผลไม้สวยดี! กิโลละเท่าไหร่ครับ/คะ?", isCorrect: true },
        { text: "These look terrible.", textThai: "ดูแย่จัง", isCorrect: false },
      ]},
      { speaker: "npc", text: "The mangoes are 60 baht per kilo. They're very sweet!", textThai: "มะม่วงกิโลละ 60 บาทค่ะ หวานมากเลยค่ะ!" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Can you give me a discount if I buy two kilos?", textThai: "ซื้อสองกิโลลดได้ไหมครับ/คะ?", isCorrect: true },
        { text: "I'll take one kilo, please.", textThai: "เอาหนึ่งกิโลครับ/ค่ะ", isCorrect: true },
        { text: "Too expensive!", textThai: "แพงไป!", isCorrect: false },
      ]},
      { speaker: "npc", text: "For two kilos, I can do 100 baht. Deal?", textThai: "สองกิโล ให้ 100 บาทเลยค่ะ ตกลงไหมคะ?" },
      { speaker: "player", text: "", textThai: "", options: [
        { text: "Deal! I'll take two kilos.", textThai: "ตกลง! เอาสองกิโลครับ/ค่ะ", isCorrect: true },
        { text: "That sounds fair. Thank you!", textThai: "ราคาดีเลยครับ/ค่ะ ขอบคุณ!", isCorrect: true },
        { text: "Make it 50 baht!", textThai: "ขอ 50 บาท!", isCorrect: false },
      ]},
    ],
  },
];
