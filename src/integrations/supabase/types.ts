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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      album_challenge_done: {
        Row: {
          challenge_id: string
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      album_chat: {
        Row: {
          class_name: string
          created_at: string
          id: string
          message: string
          school: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          class_name?: string
          created_at?: string
          id?: string
          message: string
          school?: string | null
          user_id: string
          user_name?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          id?: string
          message?: string
          school?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      album_feed: {
        Row: {
          class_name: string
          created_at: string
          event_type: string
          id: string
          payload: Json
          school: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          class_name?: string
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          school?: string | null
          user_id: string
          user_name?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          school?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      album_inventory: {
        Row: {
          card_id: string
          id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      album_trades: {
        Row: {
          created_at: string
          from_class: string
          from_name: string
          from_user_id: string
          id: string
          message: string | null
          offered_cards: Json
          requested_cards: Json
          status: string
          to_name: string
          to_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_class?: string
          from_name?: string
          from_user_id: string
          id?: string
          message?: string | null
          offered_cards?: Json
          requested_cards?: Json
          status?: string
          to_name?: string
          to_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_class?: string
          from_name?: string
          from_user_id?: string
          id?: string
          message?: string | null
          offered_cards?: Json
          requested_cards?: Json
          status?: string
          to_name?: string
          to_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      album_user_stats: {
        Row: {
          coins: number
          legendaries: number
          packs_avail: number
          total_packs: number
          updated_at: string
          user_id: string
        }
        Insert: {
          coins?: number
          legendaries?: number
          packs_avail?: number
          total_packs?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          coins?: number
          legendaries?: number
          packs_avail?: number
          total_packs?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          answer_text: string
          created_at: string
          id: string
          is_correct: boolean | null
          manual_points: number
          question_number: number
          question_type: string
          submission_id: string
        }
        Insert: {
          answer_text: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          manual_points?: number
          question_number: number
          question_type: string
          submission_id: string
        }
        Update: {
          answer_text?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          manual_points?: number
          question_number?: number
          question_type?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      bafo_matches: {
        Row: {
          challenged_cards: Json
          challenged_id: string
          challenged_name: string
          challenged_power: number | null
          challenger_cards: Json
          challenger_id: string
          challenger_name: string
          challenger_power: number | null
          class_name: string
          created_at: string
          id: string
          status: string
          updated_at: string
          winner_id: string | null
          winner_name: string | null
        }
        Insert: {
          challenged_cards?: Json
          challenged_id: string
          challenged_name?: string
          challenged_power?: number | null
          challenger_cards?: Json
          challenger_id: string
          challenger_name?: string
          challenger_power?: number | null
          class_name: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          winner_id?: string | null
          winner_name?: string | null
        }
        Update: {
          challenged_cards?: Json
          challenged_id?: string
          challenged_name?: string
          challenged_power?: number | null
          challenger_cards?: Json
          challenger_id?: string
          challenger_name?: string
          challenger_power?: number | null
          class_name?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          winner_id?: string | null
          winner_name?: string | null
        }
        Relationships: []
      }
      bafo_rankings: {
        Row: {
          best_streak: number
          cards_lost: number
          cards_won: number
          class_name: string
          id: string
          losses: number
          player_name: string
          streak: number
          total_matches: number
          updated_at: string
          user_id: string
          wins: number
        }
        Insert: {
          best_streak?: number
          cards_lost?: number
          cards_won?: number
          class_name: string
          id?: string
          losses?: number
          player_name?: string
          streak?: number
          total_matches?: number
          updated_at?: string
          user_id: string
          wins?: number
        }
        Update: {
          best_streak?: number
          cards_lost?: number
          cards_won?: number
          class_name?: string
          id?: string
          losses?: number
          player_name?: string
          streak?: number
          total_matches?: number
          updated_at?: string
          user_id?: string
          wins?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          author_name: string
          body: string
          class_name: string
          created_at: string
          id: string
          profile_photo_url: string | null
          reply_to_body: string | null
          reply_to_id: string | null
          reply_to_name: string | null
          school: string | null
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          class_name: string
          created_at?: string
          id?: string
          profile_photo_url?: string | null
          reply_to_body?: string | null
          reply_to_id?: string | null
          reply_to_name?: string | null
          school?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          class_name?: string
          created_at?: string
          id?: string
          profile_photo_url?: string | null
          reply_to_body?: string | null
          reply_to_id?: string | null
          reply_to_name?: string | null
          school?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_reactions: {
        Row: {
          author_name: string
          class_name: string
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          author_name?: string
          class_name?: string
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          class_name?: string
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: []
      }
      class_photos: {
        Row: {
          author_name: string
          caption: string | null
          class_name: string
          created_at: string
          id: string
          school: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          author_name: string
          caption?: string | null
          class_name: string
          created_at?: string
          id?: string
          school?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          author_name?: string
          caption?: string | null
          class_name?: string
          created_at?: string
          id?: string
          school?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      class_settings: {
        Row: {
          chat_enabled: boolean
          class_name: string
          photos_enabled: boolean
          updated_at: string
        }
        Insert: {
          chat_enabled?: boolean
          class_name: string
          photos_enabled?: boolean
          updated_at?: string
        }
        Update: {
          chat_enabled?: boolean
          class_name?: string
          photos_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      code_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string
          id: string
          stars: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          id?: string
          stars?: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          id?: string
          stars?: number
          user_id?: string
        }
        Relationships: []
      }
      code_projects: {
        Row: {
          created_at: string
          css: string
          html: string
          id: string
          js: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          css?: string
          html?: string
          id?: string
          js?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          css?: string
          html?: string
          id?: string
          js?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      moderation_flags: {
        Row: {
          author_name: string | null
          class_name: string | null
          context: string
          created_at: string
          id: string
          original_text: string
          reason: string | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          author_name?: string | null
          class_name?: string | null
          context: string
          created_at?: string
          id?: string
          original_text: string
          reason?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          author_name?: string | null
          class_name?: string | null
          context?: string
          created_at?: string
          id?: string
          original_text?: string
          reason?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      monthly_reports: {
        Row: {
          created_at: string
          data: Json
          id: string
          period_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          period_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          period_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_3d_url: string | null
          avatar_photo_url: string | null
          avatar_url: string | null
          chat_photo_url: string | null
          chat_wallpaper: string
          class_name: string | null
          created_at: string
          full_name: string
          grade_year: number | null
          id: string
          is_blocked: boolean
          level: number
          nickname: string | null
          school: string | null
          theme_palette: string
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_3d_url?: string | null
          avatar_photo_url?: string | null
          avatar_url?: string | null
          chat_photo_url?: string | null
          chat_wallpaper?: string
          class_name?: string | null
          created_at?: string
          full_name: string
          grade_year?: number | null
          id?: string
          is_blocked?: boolean
          level?: number
          nickname?: string | null
          school?: string | null
          theme_palette?: string
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_3d_url?: string | null
          avatar_photo_url?: string | null
          avatar_url?: string | null
          chat_photo_url?: string | null
          chat_wallpaper?: string
          class_name?: string | null
          created_at?: string
          full_name?: string
          grade_year?: number | null
          id?: string
          is_blocked?: boolean
          level?: number
          nickname?: string | null
          school?: string | null
          theme_palette?: string
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_comments: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          author_name: string
          caption: string
          class_name: string
          created_at: string
          id: string
          image_path: string | null
          school: string | null
          user_id: string
        }
        Insert: {
          author_name: string
          caption?: string
          class_name: string
          created_at?: string
          id?: string
          image_path?: string | null
          school?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          caption?: string
          class_name?: string
          created_at?: string
          id?: string
          image_path?: string | null
          school?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_card_comments: {
        Row: {
          author_name: string
          body: string
          card_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          card_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          card_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_card_comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "student_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      student_card_likes: {
        Row: {
          card_id: string
          created_at: string
          id: string
          reaction: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          reaction?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_card_likes_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "student_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      student_cards: {
        Row: {
          class_name: string
          club: string
          country: string
          country_flag: string
          created_at: string
          foot: string
          frame: string
          id: string
          jersey_color: string
          jersey_number: number
          jersey_style: string
          photo_url: string
          player_name: string
          position: string
          school: string | null
          updated_at: string
          user_id: string
          views: number
        }
        Insert: {
          class_name?: string
          club?: string
          country?: string
          country_flag?: string
          created_at?: string
          foot?: string
          frame?: string
          id?: string
          jersey_color?: string
          jersey_number?: number
          jersey_style?: string
          photo_url: string
          player_name: string
          position?: string
          school?: string | null
          updated_at?: string
          user_id: string
          views?: number
        }
        Update: {
          class_name?: string
          club?: string
          country?: string
          country_flag?: string
          created_at?: string
          foot?: string
          frame?: string
          id?: string
          jersey_color?: string
          jersey_number?: number
          jersey_style?: string
          photo_url?: string
          player_name?: string
          position?: string
          school?: string | null
          updated_at?: string
          user_id?: string
          views?: number
        }
        Relationships: []
      }
      student_credentials: {
        Row: {
          class_name: string | null
          created_at: string
          full_name: string
          login_email: string
          plain_password: string
          school: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          class_name?: string | null
          created_at?: string
          full_name: string
          login_email: string
          plain_password: string
          school?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          class_name?: string | null
          created_at?: string
          full_name?: string
          login_email?: string
          plain_password?: string
          school?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_squad_matches: {
        Row: {
          away_goals: Json
          away_score: number
          away_squad_id: string
          class_name: string
          home_goals: Json
          home_score: number
          home_squad_id: string
          id: string
          played_at: string
        }
        Insert: {
          away_goals?: Json
          away_score?: number
          away_squad_id: string
          class_name: string
          home_goals?: Json
          home_score?: number
          home_squad_id: string
          id?: string
          played_at?: string
        }
        Update: {
          away_goals?: Json
          away_score?: number
          away_squad_id?: string
          class_name?: string
          home_goals?: Json
          home_score?: number
          home_squad_id?: string
          id?: string
          played_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_squad_matches_away_squad_id_fkey"
            columns: ["away_squad_id"]
            isOneToOne: false
            referencedRelation: "student_squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_squad_matches_home_squad_id_fkey"
            columns: ["home_squad_id"]
            isOneToOne: false
            referencedRelation: "student_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      student_squads: {
        Row: {
          class_name: string
          created_at: string
          formation: string
          id: string
          jersey_color: string
          jersey_style: string
          lineup: Json
          owner_name: string
          power_score: number
          shield_config: Json
          strategy: string
          team_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          class_name: string
          created_at?: string
          formation?: string
          id?: string
          jersey_color?: string
          jersey_style?: string
          lineup?: Json
          owner_name?: string
          power_score?: number
          shield_config?: Json
          strategy?: string
          team_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          class_name?: string
          created_at?: string
          formation?: string
          id?: string
          jersey_color?: string
          jersey_style?: string
          lineup?: Json
          owner_name?: string
          power_score?: number
          shield_config?: Json
          strategy?: string
          team_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          auto_score: number
          class_number: string
          created_at: string
          id: string
          manual_score: number
          platform: string
          student_name: string
          total_score: number
          updated_at: string
        }
        Insert: {
          auto_score?: number
          class_number: string
          created_at?: string
          id?: string
          manual_score?: number
          platform?: string
          student_name: string
          total_score?: number
          updated_at?: string
        }
        Update: {
          auto_score?: number
          class_number?: string
          created_at?: string
          id?: string
          manual_score?: number
          platform?: string
          student_name?: string
          total_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          amount: number
          awarded_by: string | null
          created_at: string
          id: string
          reason: string | null
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          awarded_by?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          awarded_by?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      class_chat_enabled: { Args: { _class: string }; Returns: boolean }
      class_photos_enabled: { Args: { _class: string }; Returns: boolean }
      current_user_class: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_is_blocked: { Args: { _uid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "student"
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
    Enums: {
      app_role: ["admin", "student"],
    },
  },
} as const
