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
      barber_notifications: {
        Row: {
          barber_id: string
          booking_id: string
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          type: string
        }
        Insert: {
          barber_id: string
          booking_id: string
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          type?: string
        }
        Update: {
          barber_id?: string
          booking_id?: string
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_notifications_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_profiles: {
        Row: {
          bio: string | null
          business_name: string | null
          completed_cuts: number | null
          created_at: string | null
          experience: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          phone: string | null
          portfolio_images: string[] | null
          profile_image_url: string | null
          rating: number | null
          services: string[] | null
          specialty: string | null
          updated_at: string | null
          user_id: string
          working_hours: Json | null
        }
        Insert: {
          bio?: string | null
          business_name?: string | null
          completed_cuts?: number | null
          created_at?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          phone?: string | null
          portfolio_images?: string[] | null
          profile_image_url?: string | null
          rating?: number | null
          services?: string[] | null
          specialty?: string | null
          updated_at?: string | null
          user_id: string
          working_hours?: Json | null
        }
        Update: {
          bio?: string | null
          business_name?: string | null
          completed_cuts?: number | null
          created_at?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          phone?: string | null
          portfolio_images?: string[] | null
          profile_image_url?: string | null
          rating?: number | null
          services?: string[] | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string
          working_hours?: Json | null
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_time_slot_availability: {
        Args: {
          barber_id_param: string
          appointment_date_param: string
          appointment_time_param: string
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "barber" | "client"
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
    Enums: {
      app_role: ["admin", "barber", "client"],
    },
  },
} as const
