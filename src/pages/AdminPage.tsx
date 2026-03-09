import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import OverviewCards from "@/components/admin/OverviewCards";
import DAUChart from "@/components/admin/DAUChart";
import QuizScoreChart from "@/components/admin/QuizScoreChart";
import LevelDistributionChart from "@/components/admin/LevelDistributionChart";
import MissionCompletionChart from "@/components/admin/MissionCompletionChart";
import UserEngagementTable from "@/components/admin/UserEngagementTable";
import AIInsightsPanel from "@/components/admin/AIInsightsPanel";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { useAdminAIInsights } from "@/hooks/useAdminAIInsights";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useAdminAnalytics();
  const ai = useAdminAIInsights();

  useEffect(() => {
    // Auto-analyze on first load
    ai.analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Bot className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-thai">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> Admin Analytics Agent
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <OverviewCards metrics={data.overview} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DAUChart data={data.dauTrend} />
          <QuizScoreChart data={data.quizDistribution} />
          <LevelDistributionChart data={data.levelDistribution} />
          <MissionCompletionChart data={data.missionCompletion} />
        </div>

        {/* User Table */}
        <UserEngagementTable
          topUsers={data.topUsers}
          churnRiskUsers={data.churnRiskUsers}
          newUsers={data.newUsers}
        />

        {/* AI Analysis */}
        <AIInsightsPanel
          data={ai.data}
          loading={ai.loading}
          error={ai.error}
          onAnalyze={ai.analyze}
        />
      </main>
    </div>
  );
};

const AdminPage = () => {
  return (
    <AdminAuthGate>
      <AdminDashboard />
    </AdminAuthGate>
  );
};

export default AdminPage;
