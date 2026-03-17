// =============================================
// Dopamine Loop System - Types
// =============================================

// === Daily Rewards ===
export interface DailyReward {
  id: string;
  user_id: string;
  reward_date: string;
  reward_type: 'mystery_box' | 'login_bonus' | 'streak_bonus';
  reward_data: RewardData;
  claimed: boolean;
  claimed_at?: string;
}

export interface RewardData {
  coins?: number;
  exp?: number;
  items?: string[];
  message?: string;
}

// === Daily Missions ===
export type MissionType =
  | 'streak_login'
  | 'complete_lesson'
  | 'answer_quiz'
  | 'visit_avatar'
  | 'read_article'
  | 'path_node';

export interface MissionTemplate {
  type: MissionType;
  title: string;
  icon: string;
  targetCount: number;
  rewardCoins: number;
  rewardExp: number;
}

export interface DailyMission {
  id: string;
  user_id: string;
  mission_date: string;
  mission_type: MissionType;
  mission_title: string;
  target_count: number;
  current_count: number;
  reward_coins: number;
  reward_exp: number;
  completed: boolean;
  completed_at?: string;
}

// === Evolution System ===
export interface EvolutionStage {
  stage: number;
  name: string;
  nameThai: string;
  minExp: number;
  icon: string;
  effects: string[];
  color: string;
}

// === Gacha System ===
export type GachaRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface GachaResult {
  itemId: string;
  rarity: GachaRarity;
  isNew: boolean;
}

export interface GachaHistory {
  id: string;
  user_id: string;
  item_id: string;
  rarity: string;
  created_at: string;
}

// === Social - Friendships ===
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  // Joined profile data
  friend_profile?: {
    display_name: string;
    total_exp: number;
    current_streak: number;
    equipped: any;
    evolution_stage: number;
  };
}

// === Social - Gifts ===
export interface GiftTransaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  item_id?: string;
  coins: number;
  message?: string;
  claimed: boolean;
  created_at: string;
  // Joined
  sender_name?: string;
}

// === Social - Challenges ===
export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'expired';

export interface QuizChallenge {
  id: string;
  challenger_id: string;
  opponent_id: string;
  lesson_id?: string;
  challenger_score?: number;
  opponent_score?: number;
  status: ChallengeStatus;
  expires_at: string;
  created_at: string;
  // Joined
  challenger_name?: string;
  opponent_name?: string;
}

// === Leaderboard ===
export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_exp: number;
  current_streak: number;
  equipped: any;
  evolution_stage: number;
  rank: number;
}

// === Season Pass ===
export interface SeasonTier {
  tier: number;
  expRequired: number;
  freeReward: RewardData;
  premiumReward: RewardData & { item?: string };
}

export interface SeasonPassProgress {
  id: string;
  user_id: string;
  season_month: string;
  current_tier: number;
  exp_earned: number;
  rewards_claimed: number[];
  is_premium: boolean;
}

// === Events ===
export interface GameEvent {
  id: string;
  name: string;
  name_thai: string;
  description?: string;
  theme: string;
  exclusive_items: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// === Notifications ===
export type NotificationType =
  | 'friend_request'
  | 'gift_received'
  | 'challenge_received'
  | 'streak_warning'
  | 'event_start'
  | 'mission_complete'
  | 'evolution';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  created_at: string;
}

// === Energy ===
export interface EnergyState {
  current: number;
  max: number;
  nextRefillAt: Date | null;
  isFull: boolean;
}

// === Profile (extended) ===
export interface ExtendedProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  education_level: string | null;
  school_name: string | null;
  current_level: number;
  lessons_completed: number;
  total_exp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  coins: number;
  inventory: string[];
  equipped: any;
  daily_mission_streak: number;
  last_mission_complete_date: string | null;
  mystery_box_last_claimed: string | null;
  evolution_stage: number;
  last_free_gacha: string | null;
  gacha_tickets: number;
  energy: number;
  energy_last_refill: string;
  is_premium: boolean;
  total_missions_completed: number;
  friend_code: string | null;
  placement_completed: boolean | null;
  placement_level: number | null;
  active_path: string | null;
}
