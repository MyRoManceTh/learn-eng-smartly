import { useState } from "react";
import { ActiveUser, ChurnRiskUser } from "@/types/admin";
import { Crown, AlertTriangle, UserPlus } from "lucide-react";

interface Props {
  topUsers: ActiveUser[];
  churnRiskUsers: ChurnRiskUser[];
  newUsers: ActiveUser[];
}

type Tab = "active" | "churn" | "new";

const tabs: { key: Tab; label: string; icon: typeof Crown }[] = [
  { key: "active", label: "Active Top 20", icon: Crown },
  { key: "churn", label: "Churn Risk", icon: AlertTriangle },
  { key: "new", label: "ผู้ใช้ใหม่", icon: UserPlus },
];

const UserEngagementTable = ({ topUsers, churnRiskUsers, newUsers }: Props) => {
  const [tab, setTab] = useState<Tab>("active");

  const renderRows = () => {
    if (tab === "active") {
      return topUsers.map((u, i) => (
        <tr key={u.userId} className="border-b border-border/50 last:border-0">
          <td className="py-2 px-3 text-sm font-bold text-muted-foreground">{i + 1}</td>
          <td className="py-2 px-3 text-sm font-thai">
            {u.displayName}
            {u.isPremium && <span className="ml-1 text-yellow-500 text-xs">VIP</span>}
          </td>
          <td className="py-2 px-3 text-sm text-right">{u.totalExp.toLocaleString()}</td>
          <td className="py-2 px-3 text-sm text-right">{u.currentStreak}</td>
          <td className="py-2 px-3 text-sm text-right">{u.lessonsCompleted}</td>
        </tr>
      ));
    }

    if (tab === "churn") {
      return churnRiskUsers.map((u, i) => (
        <tr key={u.userId} className="border-b border-border/50 last:border-0">
          <td className="py-2 px-3 text-sm font-bold text-muted-foreground">{i + 1}</td>
          <td className="py-2 px-3 text-sm font-thai">{u.displayName}</td>
          <td className="py-2 px-3 text-sm text-right text-destructive font-bold">
            {u.daysSinceLastActivity} วัน
          </td>
          <td className="py-2 px-3 text-sm text-right">{u.totalExp.toLocaleString()}</td>
          <td className="py-2 px-3 text-sm text-right">{u.currentStreak}</td>
        </tr>
      ));
    }

    return newUsers.map((u, i) => (
      <tr key={u.userId} className="border-b border-border/50 last:border-0">
        <td className="py-2 px-3 text-sm font-bold text-muted-foreground">{i + 1}</td>
        <td className="py-2 px-3 text-sm font-thai">{u.displayName}</td>
        <td className="py-2 px-3 text-sm text-right">{u.totalExp.toLocaleString()}</td>
        <td className="py-2 px-3 text-sm text-right">{u.lessonsCompleted}</td>
        <td className="py-2 px-3 text-sm text-right text-muted-foreground">
          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("th-TH") : "-"}
        </td>
      </tr>
    ));
  };

  const headers = {
    active: ["#", "ชื่อ", "EXP", "Streak", "บทเรียน"],
    churn: ["#", "ชื่อ", "หายไป", "EXP", "Streak"],
    new: ["#", "ชื่อ", "EXP", "บทเรียน", "สมัครเมื่อ"],
  };

  const currentList = tab === "active" ? topUsers : tab === "churn" ? churnRiskUsers : newUsers;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-thai transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {currentList.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm font-thai py-8">
          ไม่มีข้อมูล
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {headers[tab].map((h) => (
                  <th key={h} className="py-2 px-3 text-xs text-muted-foreground font-thai font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserEngagementTable;
