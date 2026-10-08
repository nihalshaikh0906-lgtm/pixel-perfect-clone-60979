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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          ai_summary: string | null
          bedrooms: number[] | null
          broker_id: string
          budget_max_aed: number | null
          budget_min_aed: number | null
          created_at: string | null
          email: string | null
          full_name: string
          handover_before: string | null
          id: string
          last_contact_at: string | null
          nationality: string | null
          notes: string | null
          payment_preference: string | null
          phone: string | null
          preferred_areas: string[] | null
          preferred_location: string | null
          purpose: string | null
          source: string | null
          stage: string | null
          telegram_chat_id: string | null
          temperature: string | null
          unit_types: string[] | null
        }
        Insert: {
          ai_summary?: string | null
          bedrooms?: number[] | null
          broker_id?: string
          budget_max_aed?: number | null
          budget_min_aed?: number | null
          created_at?: string | null
          email?: string | null
          full_name: string
          handover_before?: string | null
          id?: string
          last_contact_at?: string | null
          nationality?: string | null
          notes?: string | null
          payment_preference?: string | null
          phone?: string | null
          preferred_areas?: string[] | null
          preferred_location?: string | null
          purpose?: string | null
          source?: string | null
          stage?: string | null
          telegram_chat_id?: string | null
          temperature?: string | null
          unit_types?: string[] | null
        }
        Update: {
          ai_summary?: string | null
          bedrooms?: number[] | null
          broker_id?: string
          budget_max_aed?: number | null
          budget_min_aed?: number | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          handover_before?: string | null
          id?: string
          last_contact_at?: string | null
          nationality?: string | null
          notes?: string | null
          payment_preference?: string | null
          phone?: string | null
          preferred_areas?: string[] | null
          preferred_location?: string | null
          purpose?: string | null
          source?: string | null
          stage?: string | null
          telegram_chat_id?: string | null
          temperature?: string | null
          unit_types?: string[] | null
        }
        Relationships: []
      }
      followups: {
        Row: {
          broker_id: string
          client_id: string | null
          created_at: string | null
          done: boolean | null
          due_at: string | null
          id: string
          title: string | null
        }
        Insert: {
          broker_id?: string
          client_id?: string | null
          created_at?: string | null
          done?: boolean | null
          due_at?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          broker_id?: string
          client_id?: string | null
          created_at?: string | null
          done?: boolean | null
          due_at?: string | null
          id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "followups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_messages: {
        Row: {
          body: string
          channel: string | null
          created_at: string
          id: string
          lead_id: string
          sender: string
        }
        Insert: {
          body: string
          channel?: string | null
          created_at?: string
          id?: string
          lead_id: string
          sender?: string
        }
        Update: {
          body?: string
          channel?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ai_summary: string | null
          assigned_to: string | null
          bedrooms: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          next_follow_up_at: string | null
          org_id: string
          phone: string | null
          preferred_areas: string[] | null
          priority: string
          score: number | null
          source: string | null
          stage: string
          type: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          assigned_to?: string | null
          bedrooms?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name: string
          next_follow_up_at?: string | null
          org_id: string
          phone?: string | null
          preferred_areas?: string[] | null
          priority?: string
          score?: number | null
          source?: string | null
          stage?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          assigned_to?: string | null
          bedrooms?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          next_follow_up_at?: string | null
          org_id?: string
          phone?: string | null
          preferred_areas?: string[] | null
          priority?: string
          score?: number | null
          source?: string | null
          stage?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          ai_summary: string | null
          broker_id: string
          client_id: string | null
          created_at: string | null
          id: string
          starts_at: string | null
          summary: string | null
        }
        Insert: {
          ai_summary?: string | null
          broker_id?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          starts_at?: string | null
          summary?: string | null
        }
        Update: {
          ai_summary?: string | null
          broker_id?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          starts_at?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          body: string | null
          broker_id: string
          channel: string | null
          client_id: string | null
          created_at: string | null
          direction: string | null
          id: string
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          broker_id?: string
          channel?: string | null
          client_id?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          broker_id?: string
          channel?: string | null
          client_id?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          org_id: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          org_id: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          org_id?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          plan: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          plan?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          plan?: string | null
        }
        Relationships: []
      }
      parking: {
        Row: {
          bedrooms: number | null
          id: string
          project_id: number | null
          spaces: number | null
          unit_type: string | null
        }
        Insert: {
          bedrooms?: number | null
          id?: string
          project_id?: number | null
          spaces?: number | null
          unit_type?: string | null
        }
        Update: {
          bedrooms?: number | null
          id?: string
          project_id?: number | null
          spaces?: number | null
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plan_steps: {
        Row: {
          id: string
          name: string | null
          parent_step_id: string | null
          percentage: number | null
          plan_id: string | null
          position: number | null
          stage_type: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          parent_step_id?: string | null
          percentage?: number | null
          plan_id?: string | null
          position?: number | null
          stage_type?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          parent_step_id?: string | null
          percentage?: number | null
          plan_id?: string | null
          position?: number | null
          stage_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_plan_steps_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          applies_to_bedrooms: number[] | null
          has_post_handover: boolean | null
          id: string
          name: string | null
          project_id: number | null
        }
        Insert: {
          applies_to_bedrooms?: number[] | null
          has_post_handover?: boolean | null
          id?: string
          name?: string | null
          project_id?: number | null
        }
        Update: {
          applies_to_bedrooms?: number[] | null
          has_post_handover?: boolean | null
          id?: string
          name?: string | null
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          id: string
          name: string | null
          project_id: number | null
          type: string | null
          url: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          project_id?: number | null
          type?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          project_id?: number | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          amenities: string[] | null
          broker_agency: Json | null
          build_progress_pct: number | null
          construction_start: string | null
          cover_image_url: string | null
          developer_description: string | null
          developer_logo_url: string | null
          developer_name: string | null
          district: string | null
          dld: Json | null
          emirate_or_country: string | null
          escrow: Json | null
          floors_text: string | null
          furnishing: string | null
          handover_date: string | null
          id: number
          latitude: number | null
          longitude: number | null
          media: Json | null
          name: string
          overview: string | null
          sale_status: string | null
          service_charge: string | null
          total_area_sqft: number | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          broker_agency?: Json | null
          build_progress_pct?: number | null
          construction_start?: string | null
          cover_image_url?: string | null
          developer_description?: string | null
          developer_logo_url?: string | null
          developer_name?: string | null
          district?: string | null
          dld?: Json | null
          emirate_or_country?: string | null
          escrow?: Json | null
          floors_text?: string | null
          furnishing?: string | null
          handover_date?: string | null
          id: number
          latitude?: number | null
          longitude?: number | null
          media?: Json | null
          name: string
          overview?: string | null
          sale_status?: string | null
          service_charge?: string | null
          total_area_sqft?: number | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          broker_agency?: Json | null
          build_progress_pct?: number | null
          construction_start?: string | null
          cover_image_url?: string | null
          developer_description?: string | null
          developer_logo_url?: string | null
          developer_name?: string | null
          district?: string | null
          dld?: Json | null
          emirate_or_country?: string | null
          escrow?: Json | null
          floors_text?: string | null
          furnishing?: string | null
          handover_date?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          media?: Json | null
          name?: string
          overview?: string | null
          sale_status?: string | null
          service_charge?: string | null
          total_area_sqft?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shortlists: {
        Row: {
          broker_id: string
          client_id: string | null
          created_at: string | null
          id: string
          project_id: number | null
          reason: string | null
          score: number | null
          sent_at: string | null
          status: string | null
          unit_id: number | null
        }
        Insert: {
          broker_id?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          project_id?: number | null
          reason?: string | null
          score?: number | null
          sent_at?: string | null
          status?: string | null
          unit_id?: number | null
        }
        Update: {
          broker_id?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          project_id?: number | null
          reason?: string | null
          score?: number | null
          sent_at?: string | null
          status?: string | null
          unit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shortlists_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlists_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bedrooms: number | null
          building_id: number | null
          floor_label: string | null
          floor_plan_urls: string[] | null
          id: number
          is_typical: boolean | null
          layout_name: string | null
          listing_type: string | null
          price_aed: number | null
          price_per_sqft: number | null
          project_id: number | null
          size_sqft: number | null
          status: string | null
          unit_number: string | null
          unit_type: string | null
        }
        Insert: {
          bedrooms?: number | null
          building_id?: number | null
          floor_label?: string | null
          floor_plan_urls?: string[] | null
          id: number
          is_typical?: boolean | null
          layout_name?: string | null
          listing_type?: string | null
          price_aed?: number | null
          price_per_sqft?: number | null
          project_id?: number | null
          size_sqft?: number | null
          status?: string | null
          unit_number?: string | null
          unit_type?: string | null
        }
        Update: {
          bedrooms?: number | null
          building_id?: number | null
          floor_label?: string | null
          floor_plan_urls?: string[] | null
          id?: number
          is_typical?: boolean | null
          layout_name?: string | null
          listing_type?: string | null
          price_aed?: number | null
          price_per_sqft?: number | null
          project_id?: number | null
          size_sqft?: number | null
          status?: string | null
          unit_number?: string | null
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bot_find_options: {
        Args: {
          p_areas?: string
          p_bedrooms?: string
          p_budget_max?: number
          p_budget_min?: number
          p_handover_year?: number
          p_location?: string
          p_post_handover?: boolean
          p_unit_type?: string
        }
        Returns: {
          area: string
          availability: string
          project: string
          unit: string
        }[]
      }
      bot_log_message: {
        Args: {
          p_body: string
          p_broker_email?: string
          p_chat_id: string
          p_direction: string
          p_name?: string
          p_username?: string
        }
        Returns: Json
      }
      bot_parse_beds: { Args: { p: string }; Returns: number[] }
      bot_parse_list: { Args: { p: string }; Returns: string[] }
      bot_parse_type: { Args: { p: string }; Returns: string[] }
      bot_save_lead: {
        Args: {
          p_areas?: string
          p_bedrooms?: string
          p_broker_email?: string
          p_budget_max?: number
          p_budget_min?: number
          p_chat_id: string
          p_full_name?: string
          p_handover_year?: number
          p_location?: string
          p_meeting_at?: string
          p_payment_preference?: string
          p_phone?: string
          p_purpose?: string
          p_summary?: string
          p_unit_type?: string
        }
        Returns: Json
      }
      create_my_organization: {
        Args: { p_full_name?: string; p_name: string }
        Returns: string
      }
      get_property_pack: {
        Args: { p_project_id: number; p_unit_id?: number }
        Returns: Json
      }
      is_org_admin: { Args: never; Returns: boolean }
      match_client: {
        Args: { p_client_id: string; p_limit?: number }
        Returns: {
          bedrooms: number
          cover_image_url: string
          developer: string
          district: string
          handover_date: string
          has_brochure: boolean
          has_floor_plan: boolean
          has_post_handover: boolean
          location: string
          price_aed: number
          price_per_sqft: number
          project_id: number
          project_name: string
          score: number
          size_sqft: number
          unit_id: number
          unit_number: string
          unit_type: string
        }[]
      }
      my_org: { Args: never; Returns: string }
      search_units: {
        Args: {
          p_areas?: string[]
          p_bedrooms?: number[]
          p_budget_max?: number
          p_budget_min?: number
          p_handover_before?: string
          p_limit?: number
          p_location?: string
          p_post_handover?: boolean
          p_unit_types?: string[]
        }
        Returns: {
          bedrooms: number
          cover_image_url: string
          developer: string
          district: string
          handover_date: string
          has_brochure: boolean
          has_floor_plan: boolean
          has_post_handover: boolean
          location: string
          price_aed: number
          price_per_sqft: number
          project_id: number
          project_name: string
          score: number
          size_sqft: number
          unit_id: number
          unit_number: string
          unit_type: string
        }[]
      }
    }
    Enums: {
      org_role: "company_admin" | "agent"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      org_role: ["company_admin", "agent"],
    },
  },
} as const
