import { QuizScoreBucket } from "@/types/admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BookOpen } from "lucide-react";

interface Props {
  data: QuizScoreBucket[];
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"];

const QuizScoreChart = ({ data }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold font-thai text-sm mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        กระจายคะแนน Quiz
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36}>
            <XAxis dataKey="range" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg bg-popover border border-border p-2 shadow-lg text-sm font-thai">
                    <p className="font-bold">{d.range}</p>
                    <p>{d.count} ครั้ง</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuizScoreChart;
