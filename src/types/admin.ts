// =============================================
// Admin Analytics Agent - Types
// =============================================

export interface AdminOverviewMetrics {
  totalUsers: number;
  dailyActiveUsers: number;
  averageStreak: number;
  retentionRate: number;
  lessonsCompletedToday: number;
  missionsCompletedToday: number;
  premiumUsersCount: number;
}

export interface DAUDataPoint {
  date: string;
  activeUsers: number;
}

export interface QuizScoreBucket {
  range: string;
  count: number;
}

export interface LevelDistribution {
  level: number;
  label: string;
  count: number;
}

export interface MissionCompletionData {
  missionType: string;
  label: string;
  completionRate: number;
  totalAssigned: number;
  totalCompleted: number;
}

export interface ActiveUser {
  userId: string;
  displayName: string;
  totalExp: number;
  currentStreak: number;
  lessonsCompleted: number;
  lastActivityDate: string | null;
  isPremium: boolean;
  createdAt?: string;
}

export interface ChurnRiskUser extends ActiveUser {
  daysSinceLastActivity: number;
}

export interface AIInsight {
  category: "finding" | "suggestion" | "feature" | "risk";
  title: string;
  description: string;
  severity?: "info" | "warning" | "critical";
}

export interface AIAnalysisResult {
  insights: AIInsight[];
  analyzedAt: string;
  summary: string;
}

export interface AdminAnalyticsData {
  overview: AdminOverviewMetrics;
  dauTrend: DAUDataPoint[];
  quizDistribution: QuizScoreBucket[];
  levelDistribution: LevelDistribution[];
  missionCompletion: MissionCompletionData[];
  topUsers: ActiveUser[];
  churnRiskUsers: ChurnRiskUser[];
  newUsers: ActiveUser[];
}

// Admin password (simple MVP approach)
export const ADMIN_PASSWORD = "admin2026";
