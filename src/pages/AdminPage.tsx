import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, BarChart3, BookOpen, Users, FolderOpen, Calendar, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import OverviewCards from "@/components/admin/OverviewCards";
import DAUChart from "@/components/admin/DAUChart";
import QuizScoreChart from "@/components/admin/QuizScoreChart";
import LevelDistributionChart from "@/components/admin/LevelDistributionChart";
import MissionCompletionChart from "@/components/admin/MissionCompletionChart";
import UserEngagementTable from "@/components/admin/UserEngagementTable";
import AIInsightsPanel from "@/components/admin/AIInsightsPanel";
import LessonManagement from "@/components/admin/LessonManagement";
import UserManagement from "@/components/admin/UserManagement";
import EventManagement from "@/components/admin/EventManagement";
import ContentOverview from "@/components/admin/ContentOverview";
import ShopGachaManagement from "@/components/admin/ShopGachaManagement";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { useAdminAIInsights } from "@/hooks/useAdminAIInsights";

const AnalyticsTab = () => {
  const { data, isLoading } = useAdminAnalytics();
  const ai = useAdminAIInsights();

  useEffect(() => {
    ai.analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Bot className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-thai">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewCards metrics={data.overview} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DAUChart data={data.dauTrend} />
        <QuizScoreChart data={data.quizDistribution} />
        <LevelDistributionChart data={data.levelDistribution} />
        <MissionCompletionChart data={data.missionCompletion} />
      </div>
      <UserEngagementTable
        topUsers={data.topUsers}
        churnRiskUsers={data.churnRiskUsers}
        newUsers={data.newUsers}
      />
      <AIInsightsPanel
        data={ai.data}
        loading={ai.loading}
        error={ai.error}
        onAnalyze={ai.analyze}
      />
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> Admin Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="analytics">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="analytics" className="font-thai">
              <BarChart3 className="w-4 h-4 mr-1" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="lessons" className="font-thai">
              <BookOpen className="w-4 h-4 mr-1" /> บทเรียน
            </TabsTrigger>
            <TabsTrigger value="users" className="font-thai">
              <Users className="w-4 h-4 mr-1" /> ผู้ใช้
            </TabsTrigger>
            <TabsTrigger value="content" className="font-thai">
              <FolderOpen className="w-4 h-4 mr-1" /> เนื้อหา
            </TabsTrigger>
            <TabsTrigger value="events" className="font-thai">
              <Calendar className="w-4 h-4 mr-1" /> อีเวนท์
            </TabsTrigger>
            <TabsTrigger value="shop" className="font-thai">
              <ShoppingBag className="w-4 h-4 mr-1" /> ร้านค้า
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="lessons">
            <LessonManagement />
          </TabsContent>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="content">
            <ContentOverview />
          </TabsContent>
          <TabsContent value="events">
            <EventManagement />
          </TabsContent>
          <TabsContent value="shop">
            <ShopGachaManagement />
          </TabsContent>
        </Tabs>
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
