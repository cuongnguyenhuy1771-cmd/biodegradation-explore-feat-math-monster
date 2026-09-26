export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type NotificationType =
  | 'welcome'
  | 'system'
  | 'area_unlock'
  | 'monster_unlock'
  | 'daily_task'
  | 'practice_reminder'
  | 'achievement'

export type HomeTab = 'home' | 'collection' | 'leaderboard' | 'profile'

export type QuestionType = 'multiple_choice' | 'true_false' | 'input' | 'matching'

export type DailyTaskType =
  | 'complete_matches'
  | 'correct_answers'
  | 'collect_stars'
  | 'earn_coins'

export type DailyTaskStatus = 'in_progress' | 'completed' | 'claimed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          avatar_preset_id: string | null
          selected_hero_id: string | null
          level: number
          total_points: number
          total_coins: number
          total_stars: number
          dark_mode_enabled: boolean
          notifications_enabled: boolean
          preferred_language: string
          default_home_tab: HomeTab
          onboarding_completed_at: string | null
          hero_selected_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          avatar_preset_id?: string | null
          selected_hero_id?: string | null
          level?: number
          total_points?: number
          total_coins?: number
          total_stars?: number
          dark_mode_enabled?: boolean
          notifications_enabled?: boolean
          preferred_language?: string
          default_home_tab?: HomeTab
          onboarding_completed_at?: string | null
          hero_selected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          avatar_preset_id?: string | null
          selected_hero_id?: string | null
          level?: number
          total_points?: number
          total_coins?: number
          total_stars?: number
          dark_mode_enabled?: boolean
          notifications_enabled?: boolean
          preferred_language?: string
          default_home_tab?: HomeTab
          onboarding_completed_at?: string | null
          hero_selected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      heroes: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_default?: boolean
          created_at?: string
        }
        Relationships: []
      }
      worlds: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image_url: string | null
          background_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          image_url?: string | null
          background_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          image_url?: string | null
          background_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      areas: {
        Row: {
          id: string
          world_id: string
          slug: string
          name: string
          description: string | null
          order_index: number
          total_questions: number
          required_stars_to_unlock: number
          points_reward: number
          coins_reward: number
          monster_id: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          world_id: string
          slug: string
          name: string
          description?: string | null
          order_index?: number
          total_questions?: number
          required_stars_to_unlock?: number
          points_reward?: number
          coins_reward?: number
          monster_id?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          world_id?: string
          slug?: string
          name?: string
          description?: string | null
          order_index?: number
          total_questions?: number
          required_stars_to_unlock?: number
          points_reward?: number
          coins_reward?: number
          monster_id?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      monsters: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image_url: string | null
          unlock_area_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          image_url?: string | null
          unlock_area_id?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          image_url?: string | null
          unlock_area_id?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          type: QuestionType
          difficulty: number
          content: Json
          hint: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: QuestionType
          difficulty?: number
          content?: Json
          hint?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: QuestionType
          difficulty?: number
          content?: Json
          hint?: string | null
          created_at?: string
        }
        Relationships: []
      }
      area_questions: {
        Row: {
          id: string
          area_id: string
          question_id: string
          question_index: number
        }
        Insert: {
          id?: string
          area_id: string
          question_id: string
          question_index?: number
        }
        Update: {
          id?: string
          area_id?: string
          question_id?: string
          question_index?: number
        }
        Relationships: [
          {
            foreignKeyName: 'area_questions_area_id_fkey',
            columns: ['area_id'],
            isOneToOne: false,
            referencedRelation: 'areas',
            referencedColumns: ['id'],
          },
          {
            foreignKeyName: 'area_questions_question_id_fkey',
            columns: ['question_id'],
            isOneToOne: false,
            referencedRelation: 'questions',
            referencedColumns: ['id'],
          },
        ]
      }
      user_area_progress: {
        Row: {
          id: string
          user_id: string
          area_id: string
          stars_earned: number
          best_score: number
          is_unlocked: boolean
          attempts_count: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          area_id: string
          stars_earned?: number
          best_score?: number
          is_unlocked?: boolean
          attempts_count?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          area_id?: string
          stars_earned?: number
          best_score?: number
          is_unlocked?: boolean
          attempts_count?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      battle_sessions: {
        Row: {
          id: string
          user_id: string
          area_id: string
          hero_id: string | null
          score: number
          stars_earned: number
          correct_answers: number
          total_questions: number
          accuracy_pct: number
          duration_seconds: number | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          area_id: string
          hero_id?: string | null
          score?: number
          stars_earned?: number
          correct_answers?: number
          total_questions: number
          duration_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          area_id?: string
          hero_id?: string | null
          score?: number
          stars_earned?: number
          correct_answers?: number
          total_questions?: number
          duration_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
        Relationships: []
      }
      battle_answers: {
        Row: {
          id: string
          session_id: string
          question_id: string
          is_correct: boolean
          answer_given: Json | null
          time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          is_correct: boolean
          answer_given?: Json | null
          time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          is_correct?: boolean
          answer_given?: Json | null
          time_ms?: number | null
          created_at?: string
        }
        Relationships: []
      }
      user_monsters: {
        Row: {
          id: string
          user_id: string
          monster_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monster_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          monster_id?: string
          unlocked_at?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          task_type: DailyTaskType
          goal_value: number
          reward_coins: number
          reward_points: number
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          task_type: DailyTaskType
          goal_value?: number
          reward_coins?: number
          reward_points?: number
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          task_type?: DailyTaskType
          goal_value?: number
          reward_coins?: number
          reward_points?: number
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      user_daily_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          task_date: string
          current_value: number
          status: DailyTaskStatus
          claimed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          task_date?: string
          current_value?: number
          status?: DailyTaskStatus
          claimed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          task_date?: string
          current_value?: number
          status?: DailyTaskStatus
          claimed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_daily_tasks_task_id_fkey',
            columns: ['task_id'],
            isOneToOne: false,
            referencedRelation: 'daily_tasks',
            referencedColumns: ['id'],
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          icon: string
          icon_bg: string
          is_read: boolean
          related_id: string | null
          metadata: Json
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type?: NotificationType
          title: string
          message: string
          icon?: string
          icon_bg?: string
          is_read?: boolean
          related_id?: string | null
          metadata?: Json
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          icon?: string
          icon_bg?: string
          is_read?: boolean
          related_id?: string | null
          metadata?: Json
          created_at?: string
          read_at?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          id: string
          user_id: string
          practice_reminder_enabled: boolean
          practice_reminder_time: string
          daily_task_reminder_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          practice_reminder_enabled?: boolean
          practice_reminder_time?: string
          daily_task_reminder_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          practice_reminder_enabled?: boolean
          practice_reminder_time?: string
          daily_task_reminder_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_content: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          level: number
          total_points: number
          total_stars: number
          rank: number
        }
        Relationships: []
      }
    }
    Functions: {
      complete_battle: {
        Args: {
          p_area_id: string
          p_correct_answers: number
          p_total_questions: number
          p_duration_seconds?: number | null
          p_score?: number
        }
        Returns: Json
      }
      claim_daily_task: {
        Args: {
          p_user_daily_task_id: string
        }
        Returns: Json
      }
      init_user_daily_tasks: {
        Args: {
          p_user_id: string
          p_task_date?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      home_tab: HomeTab
      question_type: QuestionType
      daily_task_type: DailyTaskType
      daily_task_status: DailyTaskStatus
      notification_type: NotificationType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/** Kết quả trả về từ RPC complete_battle */
export interface CompleteBattleResult {
  session_id: string
  stars_earned: number
  best_stars: number
  points_earned: number
  coins_earned: number
  monster_unlocked: boolean
}

/** Kết quả trả về từ RPC claim_daily_task */
export interface ClaimDailyTaskResult {
  coins: number
  points: number
  title: string
}

/** Cấu trúc content JSONB theo loại câu hỏi */
export interface MultipleChoiceContent {
  prompt: string
  options: string[]
  correct_index: number
}

export interface TrueFalseContent {
  prompt: string
  correct: boolean
}

export interface InputContent {
  prompt: string
  correct_answer: string
}

export interface MatchingContent {
  prompt: string
  pairs: Array<{ left: string; right: string }>
}
