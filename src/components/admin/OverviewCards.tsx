import { AdminOverviewMetrics } from "@/types/admin";
import { Users, Activity, Flame, BookOpen, Crown, Target, TrendingUp } from "lucide-react";

interface Props {
  metrics: AdminOverviewMetrics;
}

const cards = [
  { key: "totalUsers", label: "ผู้ใช้ทั้งหมด", icon: Users, color: "text-blue-500" },
  { key: "dailyActiveUsers", label: "DAU วันนี้", icon: Activity, color: "text-green-500" },
  { key: "averageStreak", label: "Streak เฉลี่ย", icon: Flame, color: "text-orange-500", suffix: " วัน" },
  { key: "retentionRate", label: "Retention 7 วัน", icon: TrendingUp, color: "text-purple-500", suffix: "%" },
  { key: "lessonsCompletedToday", label: "บทเรียนวันนี้", icon: BookOpen, color: "text-cyan-500" },
  { key: "missionsCompletedToday", label: "ภารกิจวันนี้", icon: Target, color: "text-pink-500" },
  { key: "premiumUsersCount", label: "พรีเมียม", icon: Crown, color: "text-yellow-500" },
] as const;

const OverviewCards = ({ metrics }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = metrics[card.key as keyof AdminOverviewMetrics];
        return (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-card p-4 text-center animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Icon className={`w-5 h-5 mx-auto mb-1.5 ${card.color}`} />
            <p className="text-2xl font-bold text-foreground">
              {value}
              {"suffix" in card && <span className="text-sm font-normal">{card.suffix}</span>}
            </p>
            <p className="text-xs text-muted-foreground font-thai mt-0.5">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
