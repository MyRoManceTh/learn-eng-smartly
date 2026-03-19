export interface League {
  id: string;
  name: string;
  nameThai: string;
  tier: number;
  emoji: string;
  color: string;
  bgGradient: string;
  minExp: number;
}

export const leagues: League[] = [
  { id: "bronze", name: "Bronze", nameThai: "ทองแดง", tier: 1, emoji: "🥉", color: "#cd7f32", bgGradient: "from-amber-700 to-orange-800", minExp: 0 },
  { id: "silver", name: "Silver", nameThai: "เงิน", tier: 2, emoji: "🥈", color: "#c0c0c0", bgGradient: "from-gray-400 to-slate-500", minExp: 500 },
  { id: "gold", name: "Gold", nameThai: "ทอง", tier: 3, emoji: "🏅", color: "#ffd700", bgGradient: "from-yellow-400 to-amber-500", minExp: 2000 },
  { id: "diamond", name: "Diamond", nameThai: "เพชร", tier: 4, emoji: "💎", color: "#00bfff", bgGradient: "from-cyan-400 to-blue-500", minExp: 5000 },
  { id: "champion", name: "Champion", nameThai: "แชมเปี้ยน", tier: 5, emoji: "👑", color: "#9333ea", bgGradient: "from-purple-500 to-pink-500", minExp: 10000 },
];

export function getLeagueByExp(totalExp: number): League {
  for (let i = leagues.length - 1; i >= 0; i--) {
    if (totalExp >= leagues[i].minExp) return leagues[i];
  }
  return leagues[0];
}

export function getNextLeague(league: League): League | null {
  const idx = leagues.findIndex((l) => l.id === league.id);
  return idx < leagues.length - 1 ? leagues[idx + 1] : null;
}
