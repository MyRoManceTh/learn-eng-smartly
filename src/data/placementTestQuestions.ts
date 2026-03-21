// Placement Test Question Bank
// 50 questions: Grammar(15) + Vocabulary(15) + Reading(10) + Listening(10)
// Each category has 3 questions per difficulty level (1-5) except Reading/Listening (2 per level)

export interface PlacementQuestion {
  id: string;
  stage: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  questionThai?: string;
  options: string[];
  correctIndex: number;
  context?: string;
}

export const placementQuestions: PlacementQuestion[] = [
  // =============================================
  // GRAMMAR (15 questions: 3 per level)
  // =============================================

  // Level 1 (A1) - Basic grammar
  {
    id: 'g1-1',
    stage: 'grammar',
    difficulty: 1,
    question: 'She _____ a student.',
    questionThai: 'เธอ___นักเรียน',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
  },
  {
    id: 'g1-2',
    stage: 'grammar',
    difficulty: 1,
    question: 'I _____ two cats.',
    questionThai: 'ฉัน___แมวสองตัว',
    options: ['has', 'have', 'having', 'haves'],
    correctIndex: 1,
  },
  {
    id: 'g1-3',
    stage: 'grammar',
    difficulty: 1,
    question: 'This is _____ apple.',
    questionThai: 'นี่คือ___แอปเปิ้ล',
    options: ['a', 'an', 'the', 'some'],
    correctIndex: 1,
  },

  // Level 2 (A2) - Simple tenses
  {
    id: 'g2-1',
    stage: 'grammar',
    difficulty: 2,
    question: 'He _____ to school every day.',
    options: ['go', 'goes', 'going', 'went'],
    correctIndex: 1,
  },
  {
    id: 'g2-2',
    stage: 'grammar',
    difficulty: 2,
    question: 'They _____ football yesterday.',
    options: ['play', 'plays', 'played', 'playing'],
    correctIndex: 2,
  },
  {
    id: 'g2-3',
    stage: 'grammar',
    difficulty: 2,
    question: 'She is _____ than her sister.',
    options: ['tall', 'taller', 'tallest', 'more tall'],
    correctIndex: 1,
  },

  // Level 3 (B1) - Intermediate grammar
  {
    id: 'g3-1',
    stage: 'grammar',
    difficulty: 3,
    question: 'I have _____ to Japan three times.',
    options: ['go', 'went', 'been', 'going'],
    correctIndex: 2,
  },
  {
    id: 'g3-2',
    stage: 'grammar',
    difficulty: 3,
    question: 'If it rains tomorrow, I _____ stay home.',
    options: ['will', 'would', 'can', 'am'],
    correctIndex: 0,
  },
  {
    id: 'g3-3',
    stage: 'grammar',
    difficulty: 3,
    question: 'The book _____ by a famous author.',
    options: ['wrote', 'was written', 'has wrote', 'is writing'],
    correctIndex: 1,
  },

  // Level 4 (B2) - Upper-intermediate
  {
    id: 'g4-1',
    stage: 'grammar',
    difficulty: 4,
    question: 'Had I known about the delay, I _____ earlier.',
    options: ['would leave', 'would have left', 'will leave', 'had left'],
    correctIndex: 1,
  },
  {
    id: 'g4-2',
    stage: 'grammar',
    difficulty: 4,
    question: 'The project, _____ was completed last month, received great reviews.',
    options: ['that', 'which', 'what', 'who'],
    correctIndex: 1,
  },
  {
    id: 'g4-3',
    stage: 'grammar',
    difficulty: 4,
    question: 'Not only _____ the exam, but she also got the highest score.',
    options: ['she passed', 'did she pass', 'she did pass', 'passed she'],
    correctIndex: 1,
  },

  // Level 5 (C1) - Advanced
  {
    id: 'g5-1',
    stage: 'grammar',
    difficulty: 5,
    question: 'Rarely _____ such an impressive performance.',
    options: ['I have seen', 'have I seen', 'I saw', 'did I saw'],
    correctIndex: 1,
  },
  {
    id: 'g5-2',
    stage: 'grammar',
    difficulty: 5,
    question: 'It is imperative that he _____ the report by Friday.',
    options: ['submits', 'submit', 'submitted', 'will submit'],
    correctIndex: 1,
  },
  {
    id: 'g5-3',
    stage: 'grammar',
    difficulty: 5,
    question: 'The CEO, along with the board members, _____ to resign.',
    options: ['have decided', 'has decided', 'are deciding', 'were decided'],
    correctIndex: 1,
  },

  // =============================================
  // VOCABULARY (15 questions: 3 per level)
  // =============================================

  // Level 1 (A1)
  {
    id: 'v1-1',
    stage: 'vocabulary',
    difficulty: 1,
    question: 'What is the opposite of "hot"?',
    questionThai: 'อะไรตรงข้ามกับ "ร้อน"?',
    options: ['warm', 'cold', 'cool', 'nice'],
    correctIndex: 1,
  },
  {
    id: 'v1-2',
    stage: 'vocabulary',
    difficulty: 1,
    question: 'Which one is a fruit?',
    questionThai: 'ข้อไหนเป็นผลไม้?',
    options: ['carrot', 'banana', 'rice', 'bread'],
    correctIndex: 1,
  },
  {
    id: 'v1-3',
    stage: 'vocabulary',
    difficulty: 1,
    question: 'Where do you sleep?',
    questionThai: 'คุณนอนที่ไหน?',
    options: ['kitchen', 'bathroom', 'bedroom', 'garden'],
    correctIndex: 2,
  },

  // Level 2 (A2)
  {
    id: 'v2-1',
    stage: 'vocabulary',
    difficulty: 2,
    question: 'To "borrow" something means to _____.',
    options: ['give it away', 'take it temporarily', 'buy it', 'sell it'],
    correctIndex: 1,
  },
  {
    id: 'v2-2',
    stage: 'vocabulary',
    difficulty: 2,
    question: 'A person who cooks food in a restaurant is called a _____.',
    options: ['waiter', 'manager', 'chef', 'customer'],
    correctIndex: 2,
  },
  {
    id: 'v2-3',
    stage: 'vocabulary',
    difficulty: 2,
    question: 'Which word means "very happy"?',
    options: ['angry', 'delighted', 'worried', 'bored'],
    correctIndex: 1,
  },

  // Level 3 (B1)
  {
    id: 'v3-1',
    stage: 'vocabulary',
    difficulty: 3,
    question: 'The word "deadline" refers to _____.',
    options: ['a dangerous line', 'the last date to complete something', 'a type of headline', 'a finish line in a race'],
    correctIndex: 1,
  },
  {
    id: 'v3-2',
    stage: 'vocabulary',
    difficulty: 3,
    question: '"She tends to procrastinate." What does "procrastinate" mean?',
    options: ['work hard', 'delay doing things', 'plan ahead', 'multitask'],
    correctIndex: 1,
  },
  {
    id: 'v3-3',
    stage: 'vocabulary',
    difficulty: 3,
    question: 'Which word best completes: "The company decided to _____ 50 new employees."',
    options: ['fire', 'hire', 'retire', 'admire'],
    correctIndex: 1,
  },

  // Level 4 (B2)
  {
    id: 'v4-1',
    stage: 'vocabulary',
    difficulty: 4,
    question: '"The politician tried to undermine his opponent." What does "undermine" mean?',
    options: ['support strongly', 'weaken gradually', 'praise publicly', 'ignore completely'],
    correctIndex: 1,
  },
  {
    id: 'v4-2',
    stage: 'vocabulary',
    difficulty: 4,
    question: 'Which word means "existing everywhere"?',
    options: ['ambiguous', 'ubiquitous', 'precarious', 'meticulous'],
    correctIndex: 1,
  },
  {
    id: 'v4-3',
    stage: 'vocabulary',
    difficulty: 4,
    question: '"A pragmatic approach" is one that is _____.',
    options: ['theoretical', 'emotional', 'practical and realistic', 'creative and artistic'],
    correctIndex: 2,
  },

  // Level 5 (C1)
  {
    id: 'v5-1',
    stage: 'vocabulary',
    difficulty: 5,
    question: '"The juxtaposition of the two styles created an interesting effect." What does "juxtaposition" mean?',
    options: ['mixing together', 'placing side by side for contrast', 'removing one element', 'exaggerating differences'],
    correctIndex: 1,
  },
  {
    id: 'v5-2',
    stage: 'vocabulary',
    difficulty: 5,
    question: 'Which word best describes someone who is "sycophantic"?',
    options: ['genuinely kind', 'excessively flattering for personal gain', 'brutally honest', 'emotionally distant'],
    correctIndex: 1,
  },
  {
    id: 'v5-3',
    stage: 'vocabulary',
    difficulty: 5,
    question: '"The report was deliberately obfuscated." This means it was _____.',
    options: ['simplified', 'made confusing on purpose', 'published quickly', 'translated accurately'],
    correctIndex: 1,
  },

  // =============================================
  // READING (10 questions: 2 per level)
  // =============================================

  // Level 1 (A1)
  {
    id: 'r1-1',
    stage: 'reading',
    difficulty: 1,
    question: 'What does Tom like?',
    context: 'My name is Tom. I am 10 years old. I like cats and dogs. I have one cat. Her name is Mimi.',
    options: ['fish and birds', 'cats and dogs', 'cats and fish', 'dogs and birds'],
    correctIndex: 1,
  },
  {
    id: 'r1-2',
    stage: 'reading',
    difficulty: 1,
    question: 'What is the name of Tom\'s cat?',
    context: 'My name is Tom. I am 10 years old. I like cats and dogs. I have one cat. Her name is Mimi.',
    options: ['Tom', 'Kitty', 'Mimi', 'Nana'],
    correctIndex: 2,
  },

  // Level 2 (A2)
  {
    id: 'r2-1',
    stage: 'reading',
    difficulty: 2,
    question: 'Why was Sara late for school?',
    context: 'Sara woke up late this morning because her alarm clock was broken. She quickly ate breakfast and ran to the bus stop, but the bus had already left. She had to walk to school and arrived 20 minutes late.',
    options: ['She was sick', 'Her alarm clock was broken', 'The bus was cancelled', 'She forgot her bag'],
    correctIndex: 1,
  },
  {
    id: 'r2-2',
    stage: 'reading',
    difficulty: 2,
    question: 'How did Sara get to school?',
    context: 'Sara woke up late this morning because her alarm clock was broken. She quickly ate breakfast and ran to the bus stop, but the bus had already left. She had to walk to school and arrived 20 minutes late.',
    options: ['By bus', 'By car', 'She walked', 'By bicycle'],
    correctIndex: 2,
  },

  // Level 3 (B1)
  {
    id: 'r3-1',
    stage: 'reading',
    difficulty: 3,
    question: 'What is the main advantage of remote work mentioned in the text?',
    context: 'Remote work has become increasingly popular since 2020. Many companies discovered that employees can be just as productive working from home. The biggest benefit for workers is the flexibility to manage their own schedules. However, some people struggle with loneliness and find it difficult to separate work from personal life.',
    options: ['Higher salary', 'Schedule flexibility', 'Better technology', 'More holidays'],
    correctIndex: 1,
  },
  {
    id: 'r3-2',
    stage: 'reading',
    difficulty: 3,
    question: 'What problem do some remote workers face?',
    context: 'Remote work has become increasingly popular since 2020. Many companies discovered that employees can be just as productive working from home. The biggest benefit for workers is the flexibility to manage their own schedules. However, some people struggle with loneliness and find it difficult to separate work from personal life.',
    options: ['Lower pay', 'Too many meetings', 'Loneliness and work-life balance', 'Lack of internet'],
    correctIndex: 2,
  },

  // Level 4 (B2)
  {
    id: 'r4-1',
    stage: 'reading',
    difficulty: 4,
    question: 'What does the author imply about social media algorithms?',
    context: 'Social media platforms use sophisticated algorithms that curate content based on user behavior. While this creates a personalized experience, critics argue it leads to "filter bubbles" where users are only exposed to viewpoints they already agree with. This phenomenon has significant implications for democratic discourse, as citizens may become increasingly polarized without even realizing it.',
    options: ['They are always beneficial', 'They may unintentionally limit exposure to diverse viewpoints', 'They are designed to cause conflict', 'They have no real impact on society'],
    correctIndex: 1,
  },
  {
    id: 'r4-2',
    stage: 'reading',
    difficulty: 4,
    question: 'What is the "filter bubble" effect described in the passage?',
    context: 'Social media platforms use sophisticated algorithms that curate content based on user behavior. While this creates a personalized experience, critics argue it leads to "filter bubbles" where users are only exposed to viewpoints they already agree with. This phenomenon has significant implications for democratic discourse, as citizens may become increasingly polarized without even realizing it.',
    options: ['A way to filter spam messages', 'Being exposed only to similar viewpoints', 'A privacy protection feature', 'A method to block unwanted content'],
    correctIndex: 1,
  },

  // Level 5 (C1)
  {
    id: 'r5-1',
    stage: 'reading',
    difficulty: 5,
    question: 'What is the central paradox described in the passage?',
    context: 'The pursuit of happiness, paradoxically, often leads to its opposite. Psychologists have found that people who explicitly prioritize happiness tend to experience greater dissatisfaction than those who pursue meaning and purpose instead. This phenomenon, known as the "happiness paradox," suggests that well-being is best achieved as a byproduct of engagement with meaningful activities rather than as a direct goal in itself.',
    options: ['Money cannot buy happiness', 'Pursuing happiness directly can make you less happy', 'Some cultures define happiness differently', 'Happiness is purely genetic'],
    correctIndex: 1,
  },
  {
    id: 'r5-2',
    stage: 'reading',
    difficulty: 5,
    question: 'According to the passage, what leads to greater well-being?',
    context: 'The pursuit of happiness, paradoxically, often leads to its opposite. Psychologists have found that people who explicitly prioritize happiness tend to experience greater dissatisfaction than those who pursue meaning and purpose instead. This phenomenon, known as the "happiness paradox," suggests that well-being is best achieved as a byproduct of engagement with meaningful activities rather than as a direct goal in itself.',
    options: ['Setting specific happiness goals', 'Engaging in meaningful activities', 'Avoiding stressful situations', 'Comparing yourself to others'],
    correctIndex: 1,
  },

  // =============================================
  // LISTENING (10 questions: 2 per level)
  // Note: Phase 1 uses text-based context (no audio yet)
  // =============================================

  // Level 1 (A1)
  {
    id: 'l1-1',
    stage: 'listening',
    difficulty: 1,
    question: 'Where is the woman going?',
    context: '🎧 Dialogue:\nMan: "Hi! Where are you going?"\nWoman: "I\'m going to the supermarket. I need to buy some milk and eggs."',
    options: ['To school', 'To the supermarket', 'To the park', 'To work'],
    correctIndex: 1,
  },
  {
    id: 'l1-2',
    stage: 'listening',
    difficulty: 1,
    question: 'What does the woman need to buy?',
    context: '🎧 Dialogue:\nMan: "Hi! Where are you going?"\nWoman: "I\'m going to the supermarket. I need to buy some milk and eggs."',
    options: ['Bread and butter', 'Milk and eggs', 'Rice and fish', 'Fruit and juice'],
    correctIndex: 1,
  },

  // Level 2 (A2)
  {
    id: 'l2-1',
    stage: 'listening',
    difficulty: 2,
    question: 'What time does the train leave?',
    context: '🎧 Announcement:\n"Attention passengers. The next train to Bangkok will depart from Platform 3 at 2:45 PM. Please have your tickets ready. The journey will take approximately 3 hours."',
    options: ['2:30 PM', '2:45 PM', '3:00 PM', '3:45 PM'],
    correctIndex: 1,
  },
  {
    id: 'l2-2',
    stage: 'listening',
    difficulty: 2,
    question: 'How long is the journey?',
    context: '🎧 Announcement:\n"Attention passengers. The next train to Bangkok will depart from Platform 3 at 2:45 PM. Please have your tickets ready. The journey will take approximately 3 hours."',
    options: ['2 hours', '2 hours 45 minutes', '3 hours', '3 hours 45 minutes'],
    correctIndex: 2,
  },

  // Level 3 (B1)
  {
    id: 'l3-1',
    stage: 'listening',
    difficulty: 3,
    question: 'Why does the man want to change his appointment?',
    context: '🎧 Phone call:\nReceptionist: "Good morning, Dr. Smith\'s office."\nMan: "Hi, I have an appointment on Thursday at 10 AM, but I just found out I have an important meeting at work. Could I reschedule to Friday afternoon instead?"\nReceptionist: "Let me check... Yes, we have 2 PM available on Friday."',
    options: ['He is feeling sick', 'He has a work meeting', 'The doctor is unavailable', 'He is traveling'],
    correctIndex: 1,
  },
  {
    id: 'l3-2',
    stage: 'listening',
    difficulty: 3,
    question: 'When is the new appointment?',
    context: '🎧 Phone call:\nReceptionist: "Good morning, Dr. Smith\'s office."\nMan: "Hi, I have an appointment on Thursday at 10 AM, but I just found out I have an important meeting at work. Could I reschedule to Friday afternoon instead?"\nReceptionist: "Let me check... Yes, we have 2 PM available on Friday."',
    options: ['Thursday 10 AM', 'Friday 10 AM', 'Friday 2 PM', 'Saturday 2 PM'],
    correctIndex: 2,
  },

  // Level 4 (B2)
  {
    id: 'l4-1',
    stage: 'listening',
    difficulty: 4,
    question: 'What is the speaker\'s main concern about AI in education?',
    context: '🎧 Lecture excerpt:\n"While AI-powered tutoring systems show promising results in standardized test scores, we must consider the broader implications. These systems excel at drilling factual knowledge but struggle to develop critical thinking and creativity. My concern isn\'t that AI will replace teachers, but rather that we\'ll narrow our definition of education to only what AI can measure and optimize."',
    options: ['AI will make teachers unemployed', 'Education may become too focused on measurable outcomes', 'AI tutoring is too expensive', 'Students will become dependent on technology'],
    correctIndex: 1,
  },
  {
    id: 'l4-2',
    stage: 'listening',
    difficulty: 4,
    question: 'What does the speaker say AI tutoring systems are good at?',
    context: '🎧 Lecture excerpt:\n"While AI-powered tutoring systems show promising results in standardized test scores, we must consider the broader implications. These systems excel at drilling factual knowledge but struggle to develop critical thinking and creativity. My concern isn\'t that AI will replace teachers, but rather that we\'ll narrow our definition of education to only what AI can measure and optimize."',
    options: ['Developing creativity', 'Drilling factual knowledge', 'Building social skills', 'Teaching critical thinking'],
    correctIndex: 1,
  },

  // Level 5 (C1)
  {
    id: 'l5-1',
    stage: 'listening',
    difficulty: 5,
    question: 'What does the speaker suggest about the relationship between language and thought?',
    context: '🎧 Academic discussion:\n"The Sapir-Whorf hypothesis, in its strong form, posits that language determines thought — that we can only conceive of ideas our language has words for. While this deterministic view has largely been discredited, the weaker version — that language influences thought patterns — has gained considerable empirical support. Studies with bilingual speakers consistently show subtle shifts in perception and categorization depending on which language they\'re operating in at the time."',
    options: ['Language completely determines what we can think', 'Language has no effect on thought', 'Language subtly influences how we think', 'Only bilingual people think differently'],
    correctIndex: 2,
  },
  {
    id: 'l5-2',
    stage: 'listening',
    difficulty: 5,
    question: 'What evidence supports the weak version of the Sapir-Whorf hypothesis?',
    context: '🎧 Academic discussion:\n"The Sapir-Whorf hypothesis, in its strong form, posits that language determines thought — that we can only conceive of ideas our language has words for. While this deterministic view has largely been discredited, the weaker version — that language influences thought patterns — has gained considerable empirical support. Studies with bilingual speakers consistently show subtle shifts in perception and categorization depending on which language they\'re operating in at the time."',
    options: ['Ancient philosophical texts', 'Studies showing bilingual speakers perceive things differently in each language', 'Brain scanning technology', 'Experiments with artificial languages'],
    correctIndex: 1,
  },
];

// Stage metadata for UI
export const stageInfo = {
  grammar: {
    name: 'Grammar Arena',
    nameThai: 'สนามไวยากรณ์',
    icon: '⚔️',
    questionCount: 5,
    color: 'from-red-500 to-orange-500',
  },
  vocabulary: {
    name: 'Vocabulary Quest',
    nameThai: 'ภารกิจคำศัพท์',
    icon: '🗣️',
    questionCount: 5,
    color: 'from-blue-500 to-cyan-500',
  },
  reading: {
    name: 'Reading Dungeon',
    nameThai: 'ดันเจี้ยนการอ่าน',
    icon: '📖',
    questionCount: 3,
    color: 'from-green-500 to-emerald-500',
  },
  listening: {
    name: 'Listening Tower',
    nameThai: 'หอคอยการฟัง',
    icon: '👂',
    questionCount: 3,
    color: 'from-purple-500 to-pink-500',
  },
} as const;

export type PlacementStage = keyof typeof stageInfo;

// Level result metadata
export const levelInfo = {
  1: { name: 'Egg', nameThai: 'ไข่', icon: '🥚', cefr: 'A1', description: 'เริ่มต้นการผจญภัย! เรียนรู้พื้นฐานภาษาอังกฤษ' },
  2: { name: 'Hatchling', nameThai: 'ลูกนก', icon: '🐣', cefr: 'A2', description: 'พร้อมสำหรับบทสนทนาง่ายๆ ในชีวิตประจำวัน' },
  3: { name: 'Adventurer', nameThai: 'นักผจญภัย', icon: '🐥', cefr: 'B1', description: 'สื่อสารได้ค่อนข้างคล่อง แสดงความเห็นได้' },
  4: { name: 'Warrior', nameThai: 'นักรบ', icon: '🦅', cefr: 'B2', description: 'สื่อสารได้คล่อง เข้าใจเนื้อหาซับซ้อน' },
  5: { name: 'Dragon', nameThai: 'มังกร', icon: '🐉', cefr: 'C1', description: 'ใช้ภาษาอังกฤษได้อย่างมั่นใจในทุกสถานการณ์' },
} as const;
