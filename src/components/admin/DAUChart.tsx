import { DAUDataPoint } from "@/types/admin";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  data: DAUDataPoint[];
}

const DAUChart = ({ data }: Props) => {
  const formatted = data.map((d) => ({
    ...d,
    label: d.date.slice(5), // MM-DD
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold font-thai text-sm mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        DAU 30 วันล่าสุด
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg bg-popover border border-border p-2 shadow-lg text-sm font-thai">
                    <p className="font-bold">{d.date}</p>
                    <p>ผู้ใช้: {d.activeUsers} คน</p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DAUChart;
