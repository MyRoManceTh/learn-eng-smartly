import { MissionTemplate } from "@/types/dopamine";

export const missionTemplates: MissionTemplate[] = [
  {
    type: "streak_login",
    title: "เข้าเรียนวันนี้",
    icon: "🔥",
    targetCount: 1,
    rewardCoins: 5,
    rewardExp: 5,
  },
  {
    type: "complete_lesson",
    title: "เรียนจบ 1 บทเรียน",
    icon: "📖",
    targetCount: 1,
    rewardCoins: 10,
    rewardExp: 15,
  },
  {
    type: "answer_quiz",
    title: "ตอบคำถาม 5 ข้อ",
    icon: "🧠",
    targetCount: 5,
    rewardCoins: 8,
    rewardExp: 10,
  },
  {
    type: "visit_avatar",
    title: "เยี่ยมชมร้านค้า",
    icon: "🛒",
    targetCount: 1,
    rewardCoins: 5,
    rewardExp: 5,
  },
  {
    type: "read_article",
    title: "อ่านบทความ 2 เรื่อง",
    icon: "📚",
    targetCount: 2,
    rewardCoins: 8,
    rewardExp: 10,
  },
  {
    type: "path_node",
    title: "ผ่านด่านเส้นทาง 1 ด่าน",
    icon: "🗺️",
    targetCount: 1,
    rewardCoins: 15,
    rewardExp: 20,
  },
];

/**
 * เลือก 4 ภารกิจจาก pool โดย streak_login จะถูกเลือกเสมอ
 * ส่วนที่เหลือสุ่มจาก pool (ไม่ซ้ำกัน)
 */
export function generateDailyMissions(date: string): MissionTemplate[] {
  // streak_login เป็นภารกิจบังคับ
  const mandatory = missionTemplates.find((m) => m.type === "streak_login")!;
  const pool = missionTemplates.filter((m) => m.type !== "streak_login");

  // สุ่มจาก seed ตามวันที่ (เพื่อให้ทุกคนได้ภารกิจเหมือนกันในวันเดียวกัน)
  const seed = dateToSeed(date);
  const shuffled = seededShuffle([...pool], seed);

  return [mandatory, ...shuffled.slice(0, 3)];
}

function dateToSeed(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  let s = seed;
  const next = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
