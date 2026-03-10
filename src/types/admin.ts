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

// Admin management types
export interface AdminUserProfile {
  user_id: string;
  display_name: string | null;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  total_exp: number;
  coins: number;
  lessons_completed: number;
  is_premium: boolean;
  is_admin: boolean;
  is_banned: boolean;
  banned_at: string | null;
  ban_reason: string | null;
  friend_code: string | null;
  last_activity_date: string | null;
  created_at: string;
  energy: number;
  evolution_stage: number;
}

export interface AdminLesson {
  id: string;
  level: number;
  lesson_order: number;
  title: string;
  title_thai: string;
  vocabulary: any[];
  article_sentences: any[];
  article_translation: string;
  quiz: any[];
  image_url: string | null;
  created_at: string;
}

export interface AdminEvent {
  id: string;
  name: string;
  description: string;
  theme: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  exclusive_items: any[];
  created_at: string;
}
