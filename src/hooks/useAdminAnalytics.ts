import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminAnalyticsData,
  AdminOverviewMetrics,
  DAUDataPoint,
  QuizScoreBucket,
  LevelDistribution,
  MissionCompletionData,
  ActiveUser,
  ChurnRiskUser,
} from "@/types/admin";

const levelLabels: Record<number, string> = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

const missionLabels: Record<string, string> = {
  complete_lesson: "เรียนบทเรียน",
  quiz_score_80: "ควิซ 80%+",
  visit_avatar: "เยี่ยมอวาตาร์",
  login_streak: "เข้าติดต่อกัน",
  share_challenge: "ท้าดวลเพื่อน",
  gacha_pull: "สุ่มกาชา",
};

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async (): Promise<AdminAnalyticsData> => {
      const today = new Date().toISOString().split("T")[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

      const [
        profilesRes,
        premiumRes,
        analyticsRes,
        lessonsRes,
        missionsTodayRes,
        missionsWeekRes,
      ] = await Promise.all([
        supabase.from("profiles").select(
          "user_id, display_name, current_level, current_streak, total_exp, last_activity_date, is_premium, lessons_completed, created_at"
        ),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_premium", true),
        supabase.from("analytics_events").select("user_id, created_at").gte("created_at", thirtyDaysAgo),
        supabase.from("learning_history").select("quiz_score, quiz_total, completed_at").gte("completed_at", thirtyDaysAgo),
        supabase.from("daily_missions").select("*", { count: "exact", head: true }).eq("mission_date", today).eq("completed", true),
        supabase.from("daily_missions").select("mission_type, completed").gte("mission_date", sevenDaysAgo.split("T")[0]),
      ]);

      const profiles = (profilesRes.data || []) as any[];
      const analytics = (analyticsRes.data || []) as any[];
      const lessons = (lessonsRes.data || []) as any[];
      const missionsWeek = (missionsWeekRes.data || []) as any[];
      const totalUsers = profiles.length;

      // === Overview ===
      const todayUserIds = new Set(
        analytics.filter((e: any) => e.created_at?.startsWith(today)).map((e: any) => e.user_id)
      );
      const dau = todayUserIds.size;

      const avgStreak = totalUsers > 0
        ? Math.round((profiles.reduce((s: number, p: any) => s + (p.current_streak || 0), 0) / totalUsers) * 10) / 10
        : 0;

      const sevenDaysAgoDate = sevenDaysAgo.split("T")[0];
      const retainedUsers = profiles.filter((p: any) => p.last_activity_date && p.last_activity_date >= sevenDaysAgoDate).length;
      const retentionRate = totalUsers > 0 ? Math.round((retainedUsers / totalUsers) * 100) : 0;

      const lessonsToday = lessons.filter((l: any) => l.completed_at?.startsWith(today)).length;
      const missionsToday = missionsTodayRes.count || 0;

      const overview: AdminOverviewMetrics = {
        totalUsers,
        dailyActiveUsers: dau,
        averageStreak: avgStreak,
        retentionRate,
        lessonsCompletedToday: lessonsToday,
        missionsCompletedToday: missionsToday,
        premiumUsersCount: premiumRes.count || 0,
      };

      // === DAU Trend ===
      const dauByDay: Record<string, Set<string>> = {};
      analytics.forEach((e: any) => {
        const day = e.created_at?.split("T")[0];
        if (day) {
          if (!dauByDay[day]) dauByDay[day] = new Set();
          dauByDay[day].add(e.user_id);
        }
      });
      const dauTrend: DAUDataPoint[] = Object.entries(dauByDay)
        .map(([date, users]) => ({ date, activeUsers: users.size }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // === Quiz Score Distribution ===
      const buckets = [
        { range: "0-20%", min: 0, max: 20 },
        { range: "21-40%", min: 21, max: 40 },
        { range: "41-60%", min: 41, max: 60 },
        { range: "61-80%", min: 61, max: 80 },
        { range: "81-100%", min: 81, max: 100 },
      ];
      const quizDistribution: QuizScoreBucket[] = buckets.map((b) => {
        const count = lessons.filter((l: any) => {
          if (l.quiz_score == null || l.quiz_total == null || l.quiz_total === 0) return false;
          const pct = (l.quiz_score / l.quiz_total) * 100;
          return pct >= b.min && pct <= b.max;
        }).length;
        return { range: b.range, count };
      });

      // === Level Distribution ===
      const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      profiles.forEach((p: any) => {
        const lv = p.current_level || 1;
        if (levelCounts[lv] !== undefined) levelCounts[lv]++;
      });
      const levelDistribution: LevelDistribution[] = Object.entries(levelCounts).map(([lv, count]) => ({
        level: Number(lv),
        label: `Lv.${lv} ${levelLabels[Number(lv)] || ""}`,
        count,
      }));

      // === Mission Completion ===
      const missionByType: Record<string, { total: number; completed: number }> = {};
      missionsWeek.forEach((m: any) => {
        const t = m.mission_type;
        if (!missionByType[t]) missionByType[t] = { total: 0, completed: 0 };
        missionByType[t].total++;
        if (m.completed) missionByType[t].completed++;
      });
      const missionCompletion: MissionCompletionData[] = Object.entries(missionByType).map(([type, data]) => ({
        missionType: type,
        label: missionLabels[type] || type,
        completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        totalAssigned: data.total,
        totalCompleted: data.completed,
      }));

      // === User Lists ===
      const mapUser = (p: any): ActiveUser => ({
        userId: p.user_id,
        displayName: p.display_name || "ไม่ระบุชื่อ",
        totalExp: p.total_exp || 0,
        currentStreak: p.current_streak || 0,
        lessonsCompleted: p.lessons_completed || 0,
        lastActivityDate: p.last_activity_date,
        isPremium: p.is_premium || false,
        createdAt: p.created_at,
      });

      const topUsers = [...profiles]
        .sort((a: any, b: any) => (b.total_exp || 0) - (a.total_exp || 0))
        .slice(0, 20)
        .map(mapUser);

      const churnRiskUsers: ChurnRiskUser[] = profiles
        .filter((p: any) => p.last_activity_date && p.last_activity_date < threeDaysAgo)
        .map((p: any) => {
          const days = Math.floor(
            (Date.now() - new Date(p.last_activity_date).getTime()) / 86400000
          );
          return { ...mapUser(p), daysSinceLastActivity: days };
        })
        .sort((a, b) => b.daysSinceLastActivity - a.daysSinceLastActivity)
        .slice(0, 20);

      const newUsers = profiles
        .filter((p: any) => p.created_at && p.created_at >= sevenDaysAgo)
        .map(mapUser)
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

      return {
        overview,
        dauTrend,
        quizDistribution,
        levelDistribution,
        missionCompletion,
        topUsers,
        churnRiskUsers,
        newUsers,
      };
    },
    staleTime: 60_000,
  });
}
