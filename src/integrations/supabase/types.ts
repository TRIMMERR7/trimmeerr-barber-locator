export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          ai_reasoning: string | null
          created_at: string
          id: string
          recommended_barber_ids: string[] | null
          user_id: string | null
          user_preferences: Json | null
        }
        Insert: {
          ai_reasoning?: string | null
          created_at?: string
          id?: string
          recommended_barber_ids?: string[] | null
          user_id?: string | null
          user_preferences?: Json | null
        }
        Update: {
          ai_reasoning?: string | null
          created_at?: string
          id?: string
          recommended_barber_ids?: string[] | null
          user_id?: string | null
          user_preferences?: Json | null
        }
        Relationships: []
      }
      barber_accounts: {
        Row: {
          account_status: string | null
          barber_id: string
          charges_enabled: boolean | null
          created_at: string
          details_submitted: boolean | null
          id: string
          onboarding_completed: boolean | null
          payouts_enabled: boolean | null
          stripe_account_id: string | null
          updated_at: string
        }
        Insert: {
          account_status?: string | null
          barber_id: string
          charges_enabled?: boolean | null
          created_at?: string
          details_submitted?: boolean | null
          id?: string
          onboarding_completed?: boolean | null
          payouts_enabled?: boolean | null
          stripe_account_id?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: string | null
          barber_id?: string
          charges_enabled?: boolean | null
          created_at?: string
          details_submitted?: boolean | null
          id?: string
          onboarding_completed?: boolean | null
          payouts_enabled?: boolean | null
          stripe_account_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          appointment_date: string
          appointment_time: string
          barber_id: string
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string
          id: string
          service_name: string
          service_price: number
          status: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          barber_id: string
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          id?: string
          service_name: string
          service_price: number
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          barber_id?: string
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          id?: string
          service_name?: string
          service_price?: number
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          service_type: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          service_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          service_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
