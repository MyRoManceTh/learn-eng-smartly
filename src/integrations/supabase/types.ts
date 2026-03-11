export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_count: number
          id: string
          mission_date: string
          mission_title: string
          mission_type: string
          reward_coins: number | null
          reward_exp: number | null
          target_count: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number
          id?: string
          mission_date?: string
          mission_title: string
          mission_type: string
          reward_coins?: number | null
          reward_exp?: number | null
          target_count?: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number
          id?: string
          mission_date?: string
          mission_title?: string
          mission_type?: string
          reward_coins?: number | null
          reward_exp?: number | null
          target_count?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_rewards: {
        Row: {
          claimed: boolean | null
          claimed_at: string | null
          created_at: string | null
          id: string
          reward_data: Json
          reward_date: string
          reward_type: string
          user_id: string
        }
        Insert: {
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_data?: Json
          reward_date?: string
          reward_type: string
          user_id: string
        }
        Update: {
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_data?: Json
          reward_date?: string
          reward_type?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          exclusive_items: Json | null
          id: string
          is_active: boolean | null
          name: string
          name_thai: string
          start_date: string
          theme: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          exclusive_items?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          name_thai: string
          start_date: string
          theme?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          exclusive_items?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_thai?: string
          start_date?: string
          theme?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string | null
          id: string
          requester_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          addressee_id: string
          created_at?: string | null
          id?: string
          requester_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string
          created_at?: string | null
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gacha_history: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          rarity: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          rarity: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          rarity?: string
          user_id?: string
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          claimed: boolean | null
          coins: number | null
          created_at: string | null
          id: string
          item_id: string | null
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          claimed?: boolean | null
          coins?: number | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          claimed?: boolean | null
          coins?: number | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          message?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      learning_history: {
        Row: {
          completed_at: string
          id: string
          lesson_level: number
          lesson_title: string
          quiz_score: number | null
          quiz_total: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_level: number
          lesson_title: string
          quiz_score?: number | null
          quiz_total?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_level?: number
          lesson_title?: string
          quiz_score?: number | null
          quiz_total?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          article_sentences: Json
          article_translation: string
          created_at: string
          id: string
          image_prompt: string | null
          image_url: string | null
          is_published: boolean
          lesson_order: number
          level: number
          quiz: Json
          title: string
          title_thai: string
          vocabulary: Json
        }
        Insert: {
          article_sentences?: Json
          article_translation?: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          is_published?: boolean
          lesson_order?: number
          level?: number
          quiz?: Json
          title: string
          title_thai: string
          vocabulary?: Json
        }
        Update: {
          article_sentences?: Json
          article_translation?: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          is_published?: boolean
          lesson_order?: number
          level?: number
          quiz?: Json
          title?: string
          title_thai?: string
          vocabulary?: Json
        }
        Relationships: []
      }
      path_progress: {
        Row: {
          completed_at: string
          id: string
          node_index: number
          quiz_score: number | null
          quiz_total: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          node_index: number
          quiz_score?: number | null
          quiz_total?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          node_index?: number
          quiz_score?: number | null
          quiz_total?: number | null
          user_id?: string
        }
        Relationships: []
      }
      placement_test_results: {
        Row: {
          created_at: string | null
          detail: Json | null
          grammar_score: number
          id: string
          listening_score: number
          overall_level: number
          reading_score: number
          total_questions: number
          total_score: number
          user_id: string
          vocabulary_score: number
        }
        Insert: {
          created_at?: string | null
          detail?: Json | null
          grammar_score?: number
          id?: string
          listening_score?: number
          overall_level: number
          reading_score?: number
          total_questions?: number
          total_score?: number
          user_id: string
          vocabulary_score?: number
        }
        Update: {
          created_at?: string | null
          detail?: Json | null
          grammar_score?: number
          id?: string
          listening_score?: number
          overall_level?: number
          reading_score?: number
          total_questions?: number
          total_score?: number
          user_id?: string
          vocabulary_score?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_path: string | null
          age: number | null
          avatar_url: string | null
          coins: number
          created_at: string
          current_level: number
          current_streak: number
          daily_mission_streak: number | null
          display_name: string | null
          education_level: string | null
          energy: number | null
          energy_last_refill: string | null
          equipped: Json
          evolution_stage: number | null
          friend_code: string | null
          gacha_tickets: number | null
          gender: string | null
          id: string
          inventory: Json
          is_premium: boolean | null
          last_activity_date: string | null
          last_free_gacha: string | null
          last_mission_complete_date: string | null
          lessons_completed: number
          longest_streak: number
          mystery_box_last_claimed: string | null
          placement_completed: boolean | null
          placement_level: number | null
          school_name: string | null
          total_exp: number
          total_missions_completed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_path?: string | null
          age?: number | null
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_level?: number
          current_streak?: number
          daily_mission_streak?: number | null
          display_name?: string | null
          education_level?: string | null
          energy?: number | null
          energy_last_refill?: string | null
          equipped?: Json
          evolution_stage?: number | null
          friend_code?: string | null
          gacha_tickets?: number | null
          gender?: string | null
          id?: string
          inventory?: Json
          is_premium?: boolean | null
          last_activity_date?: string | null
          last_free_gacha?: string | null
          last_mission_complete_date?: string | null
          lessons_completed?: number
          longest_streak?: number
          mystery_box_last_claimed?: string | null
          placement_completed?: boolean | null
          placement_level?: number | null
          school_name?: string | null
          total_exp?: number
          total_missions_completed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_path?: string | null
          age?: number | null
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_level?: number
          current_streak?: number
          daily_mission_streak?: number | null
          display_name?: string | null
          education_level?: string | null
          energy?: number | null
          energy_last_refill?: string | null
          equipped?: Json
          evolution_stage?: number | null
          friend_code?: string | null
          gacha_tickets?: number | null
          gender?: string | null
          id?: string
          inventory?: Json
          is_premium?: boolean | null
          last_activity_date?: string | null
          last_free_gacha?: string | null
          last_mission_complete_date?: string | null
          lessons_completed?: number
          longest_streak?: number
          mystery_box_last_claimed?: string | null
          placement_completed?: boolean | null
          placement_level?: number | null
          school_name?: string | null
          total_exp?: number
          total_missions_completed?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_challenges: {
        Row: {
          challenger_id: string
          challenger_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          lesson_id: string | null
          opponent_id: string
          opponent_score: number | null
          status: string | null
        }
        Insert: {
          challenger_id: string
          challenger_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          lesson_id?: string | null
          opponent_id: string
          opponent_score?: number | null
          status?: string | null
        }
        Update: {
          challenger_id?: string
          challenger_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          lesson_id?: string | null
          opponent_id?: string
          opponent_score?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_challenges_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      season_pass: {
        Row: {
          created_at: string | null
          current_tier: number | null
          exp_earned: number | null
          id: string
          is_premium: boolean | null
          rewards_claimed: Json | null
          season_month: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_tier?: number | null
          exp_earned?: number | null
          id?: string
          is_premium?: boolean | null
          rewards_claimed?: Json | null
          season_month: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_tier?: number | null
          exp_earned?: number | null
          id?: string
          is_premium?: boolean | null
          rewards_claimed?: Json | null
          season_month?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_tree_progress: {
        Row: {
          completed_at: string | null
          id: string
          module_id: string
          node_id: string
          path_id: string
          quiz_score: number | null
          quiz_total: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          module_id: string
          node_id: string
          path_id?: string
          quiz_score?: number | null
          quiz_total?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          module_id?: string
          node_id?: string
          path_id?: string
          quiz_score?: number | null
          quiz_total?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          quiz_score: number | null
          quiz_total: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          quiz_score?: number | null
          quiz_total?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          quiz_score?: number | null
          quiz_total?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
