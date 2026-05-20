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
      chat_messages: {
        Row: {
          author_name: string
          body: string
          class_name: string
          created_at: string
          id: string
          reply_to_id: string | null
          school: string | null
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          class_name: string
          created_at?: string
          id?: string
          reply_to_id?: string | null
          school?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          class_name?: string
          created_at?: string
          id?: string
          reply_to_id?: string | null
          school?: string | null
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
