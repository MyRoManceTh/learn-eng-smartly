export interface Achievement {
  id: string;
  name: string;
  nameThai: string;
  description: string;
  emoji: string;
  category: "learning" | "social" | "streak" | "collection" | "special";
  condition: (stats: UserStats) => boolean;
  reward: { coins: number; exp: number };
}

export interface UserStats {
  lessonsCompleted: number;
  totalExp: number;
  currentStreak: number;
  longestStreak: number;
  friendCount: number;
  gachaTickets: number;
  coins: number;
  evolutionStage: number;
  currentLevel: number;
  totalMissionsCompleted: number;
  dailyMissionStreak: number;
}

export const achievements: Achievement[] = [
  // ── Learning ──────────────────────────────────
  { id: "first_lesson", name: "First Step", nameThai: "ก้าวแรก", description: "เรียนจบบทแรก", emoji: "📖", category: "learning", condition: (s) => s.lessonsCompleted >= 1, reward: { coins: 10, exp: 10 } },
  { id: "lessons_10", name: "Bookworm", nameThai: "หนอนหนังสือ", description: "เรียนจบ 10 บท", emoji: "📚", category: "learning", condition: (s) => s.lessonsCompleted >= 10, reward: { coins: 30, exp: 30 } },
  { id: "lessons_25", name: "Scholar", nameThai: "นักวิชาการ", description: "เรียนจบ 25 บท", emoji: "🎓", category: "learning", condition: (s) => s.lessonsCompleted >= 25, reward: { coins: 50, exp: 50 } },
  { id: "lessons_50", name: "Professor", nameThai: "ศาสตราจารย์", description: "เรียนจบ 50 บท", emoji: "🏛️", category: "learning", condition: (s) => s.lessonsCompleted >= 50, reward: { coins: 100, exp: 100 } },
  { id: "lessons_100", name: "Master", nameThai: "ปรมาจารย์", description: "เรียนจบ 100 บท", emoji: "👑", category: "learning", condition: (s) => s.lessonsCompleted >= 100, reward: { coins: 200, exp: 200 } },
  { id: "exp_1000", name: "XP Hunter", nameThai: "นักล่า XP", description: "สะสม 1,000 XP", emoji: "⚡", category: "learning", condition: (s) => s.totalExp >= 1000, reward: { coins: 20, exp: 0 } },
  { id: "exp_5000", name: "XP Legend", nameThai: "ตำนาน XP", description: "สะสม 5,000 XP", emoji: "💫", category: "learning", condition: (s) => s.totalExp >= 5000, reward: { coins: 50, exp: 0 } },
  { id: "level_3", name: "Intermediate", nameThai: "ระดับกลาง", description: "ถึง Level 3", emoji: "📊", category: "learning", condition: (s) => s.currentLevel >= 3, reward: { coins: 30, exp: 30 } },
  { id: "level_5", name: "Advanced", nameThai: "ระดับสูง", description: "ถึง Level 5", emoji: "🏆", category: "learning", condition: (s) => s.currentLevel >= 5, reward: { coins: 100, exp: 100 } },

  // ── Streak ────────────────────────────────────
  { id: "streak_3", name: "On Fire", nameThai: "ไฟลุก", description: "Streak 3 วัน", emoji: "🔥", category: "streak", condition: (s) => s.longestStreak >= 3, reward: { coins: 10, exp: 15 } },
  { id: "streak_7", name: "Inferno", nameThai: "เปลวเพลิง", description: "Streak 7 วัน", emoji: "🌋", category: "streak", condition: (s) => s.longestStreak >= 7, reward: { coins: 25, exp: 25 } },
  { id: "streak_14", name: "Unstoppable", nameThai: "หยุดไม่อยู่", description: "Streak 14 วัน", emoji: "☄️", category: "streak", condition: (s) => s.longestStreak >= 14, reward: { coins: 50, exp: 50 } },
  { id: "streak_30", name: "Legendary Streak", nameThai: "Streak ตำนาน", description: "Streak 30 วัน", emoji: "💎", category: "streak", condition: (s) => s.longestStreak >= 30, reward: { coins: 100, exp: 100 } },
  { id: "missions_10", name: "Mission Runner", nameThai: "นักทำภารกิจ", description: "ทำภารกิจครบ 10 ครั้ง", emoji: "📋", category: "streak", condition: (s) => s.totalMissionsCompleted >= 10, reward: { coins: 20, exp: 20 } },
  { id: "missions_50", name: "Mission Master", nameThai: "เจ้าแห่งภารกิจ", description: "ทำภารกิจครบ 50 ครั้ง", emoji: "🎯", category: "streak", condition: (s) => s.totalMissionsCompleted >= 50, reward: { coins: 50, exp: 50 } },

  // ── Social ────────────────────────────────────
  { id: "first_friend", name: "Friendly", nameThai: "มีเพื่อนแล้ว", description: "เพิ่มเพื่อน 1 คน", emoji: "🤝", category: "social", condition: (s) => s.friendCount >= 1, reward: { coins: 10, exp: 10 } },
  { id: "friends_5", name: "Popular", nameThai: "ขวัญใจ", description: "เพิ่มเพื่อน 5 คน", emoji: "🌟", category: "social", condition: (s) => s.friendCount >= 5, reward: { coins: 30, exp: 30 } },
  { id: "friends_10", name: "Social Star", nameThai: "ดาวสังคม", description: "เพิ่มเพื่อน 10 คน", emoji: "⭐", category: "social", condition: (s) => s.friendCount >= 10, reward: { coins: 50, exp: 50 } },

  // ── Collection ────────────────────────────────
  { id: "coins_500", name: "Piggy Bank", nameThai: "กระปุกออมสิน", description: "มีเหรียญ 500", emoji: "🐷", category: "collection", condition: (s) => s.coins >= 500, reward: { coins: 0, exp: 20 } },
  { id: "coins_2000", name: "Rich", nameThai: "เศรษฐี", description: "มีเหรียญ 2,000", emoji: "💰", category: "collection", condition: (s) => s.coins >= 2000, reward: { coins: 0, exp: 50 } },
  { id: "evolution_3", name: "Student Form", nameThai: "ร่างนักเรียน", description: "วิวัฒนาการถึง stage 3", emoji: "🧑‍🎓", category: "collection", condition: (s) => s.evolutionStage >= 3, reward: { coins: 30, exp: 30 } },
  { id: "evolution_5", name: "Legend Form", nameThai: "ร่างตำนาน", description: "วิวัฒนาการถึง stage 5", emoji: "👑", category: "collection", condition: (s) => s.evolutionStage >= 5, reward: { coins: 100, exp: 100 } },
];

export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return achievements.filter((a) => a.condition(stats));
}

export function getLockedAchievements(stats: UserStats): Achievement[] {
  return achievements.filter((a) => !a.condition(stats));
}

export const categoryLabels: Record<string, { label: string; emoji: string }> = {
  learning: { label: "การเรียน", emoji: "📚" },
  streak: { label: "ความต่อเนื่อง", emoji: "🔥" },
  social: { label: "สังคม", emoji: "🤝" },
  collection: { label: "สะสม", emoji: "💰" },
  special: { label: "พิเศษ", emoji: "✨" },
};
