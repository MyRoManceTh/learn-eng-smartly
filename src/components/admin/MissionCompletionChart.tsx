import { MissionCompletionData } from "@/types/admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Target } from "lucide-react";

interface Props {
  data: MissionCompletionData[];
}

const MissionCompletionChart = ({ data }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold font-thai text-sm mb-4 flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        อัตราทำภารกิจสำเร็จ (7 วัน)
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28} layout="vertical">
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
            <YAxis
              type="category"
              dataKey="label"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as MissionCompletionData;
                return (
                  <div className="rounded-lg bg-popover border border-border p-2 shadow-lg text-sm font-thai">
                    <p className="font-bold">{d.label}</p>
                    <p>สำเร็จ: {d.totalCompleted}/{d.totalAssigned} ({d.completionRate}%)</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="completionRate" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MissionCompletionChart;
