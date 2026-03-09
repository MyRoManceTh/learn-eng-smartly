import { AIAnalysisResult, AIInsight } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bot, Lightbulb, AlertTriangle, Sparkles, Search } from "lucide-react";

interface Props {
  data: AIAnalysisResult | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
}

const categoryConfig: Record<string, { icon: typeof Lightbulb; bg: string; border: string; text: string; label: string }> = {
  finding: {
    icon: Search,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600",
    label: "Finding",
  },
  suggestion: {
    icon: Lightbulb,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600",
    label: "Suggestion",
  },
  feature: {
    icon: Sparkles,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600",
    label: "Feature",
  },
  risk: {
    icon: AlertTriangle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-600",
    label: "Risk",
  },
};

const severityDot: Record<string, string> = {
  info: "bg-blue-400",
  warning: "bg-amber-400",
  critical: "bg-red-500",
};

const InsightCard = ({ insight }: { insight: AIInsight }) => {
  const config = categoryConfig[insight.category] || categoryConfig.finding;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4 animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-1.5 rounded-lg ${config.bg}`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold ${config.text} uppercase`}>{config.label}</span>
            {insight.severity && (
              <span className={`w-2 h-2 rounded-full ${severityDot[insight.severity] || severityDot.info}`} />
            )}
          </div>
          <h4 className="font-semibold text-sm font-thai text-foreground">{insight.title}</h4>
          <p className="text-xs text-muted-foreground font-thai mt-1 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const AIInsightsPanel = ({ data, loading, error, onAnalyze }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-thai text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          AI Agent วิเคราะห์
        </h3>
        <div className="flex items-center gap-2">
          {data?.analyzedAt && (
            <span className="text-xs text-muted-foreground font-thai">
              {new Date(data.analyzedAt).toLocaleString("th-TH")}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onAnalyze}
            disabled={loading}
            className="font-thai text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ใหม่"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 mb-4">
          <p className="text-sm text-destructive font-thai">{error}</p>
        </div>
      )}

      {data?.summary && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 mb-4">
          <p className="text-sm font-thai text-foreground">{data.summary}</p>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="text-center py-8">
          <Bot className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground font-thai">
            กดปุ่ม "วิเคราะห์ใหม่" เพื่อให้ AI วิเคราะห์ข้อมูล
          </p>
        </div>
      )}

      {loading && !data && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/50 p-4 animate-pulse">
              <div className="h-3 w-20 bg-muted rounded mb-2" />
              <div className="h-4 w-3/4 bg-muted rounded mb-1" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {data?.insights && data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
