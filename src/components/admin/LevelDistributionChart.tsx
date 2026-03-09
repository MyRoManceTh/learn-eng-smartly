import { LevelDistribution } from "@/types/admin";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";

interface Props {
  data: LevelDistribution[];
}

const COLORS = [
  "hsl(25, 65%, 45%)",
  "hsl(160, 50%, 42%)",
  "hsl(220, 65%, 52%)",
  "hsl(275, 55%, 52%)",
  "hsl(340, 65%, 50%)",
];

const LevelDistributionChart = ({ data }: Props) => {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold font-thai text-sm mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        กระจาย Level ผู้เล่น
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div className="rounded-lg bg-popover border border-border p-2 shadow-lg text-sm font-thai">
                    <p className="font-bold">{d.label}</p>
                    <p>{d.count} คน ({pct}%)</p>
                  </div>
                );
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-xs font-thai">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LevelDistributionChart;
