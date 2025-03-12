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
      activations: {
        Row: {
          activation_id: string
          created_at: string
          environment: string | null
          event_type: string
          game_id: string
          instructions: string
          location: string
          objective_id: string
          participant: string
          success_tips: string
        }
        Insert: {
          activation_id?: string
          created_at?: string
          environment?: string | null
          event_type?: string
          game_id: string
          instructions: string
          location?: string
          objective_id: string
          participant?: string
          success_tips: string
        }
        Update: {
          activation_id?: string
          created_at?: string
          environment?: string | null
          event_type?: string
          game_id?: string
          instructions?: string
          location?: string
          objective_id?: string
          participant?: string
          success_tips?: string
        }
        Relationships: [
          {
            foreignKeyName: "activations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "activations_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["objective_id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_id: string
          ai_prompt: string
          created_at: string
          description: string | null
          input_fields: Json
          is_active: boolean | null
          name: string
          output_fields: Json
          tools: Json | null
          updated_at: string
        }
        Insert: {
          agent_id?: string
          ai_prompt: string
          created_at?: string
          description?: string | null
          input_fields: Json
          is_active?: boolean | null
          name: string
          output_fields: Json
          tools?: Json | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          ai_prompt?: string
          created_at?: string
          description?: string | null
          input_fields?: Json
          is_active?: boolean | null
          name?: string
          output_fields?: Json
          tools?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          company: string | null
          created_at: string
          customer_id: string
          email: string
          name: string
          role: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          customer_id?: string
          email: string
          name: string
          role?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          customer_id?: string
          email?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          game_id: string
          game_type: string
          generated_game: Json | null
          objective_id: string
          options: Json
          question_style: string
        }
        Insert: {
          created_at?: string
          game_id?: string
          game_type: string
          generated_game?: Json | null
          objective_id: string
          options: Json
          question_style: string
        }
        Update: {
          created_at?: string
          game_id?: string
          game_type?: string
          generated_game?: Json | null
          objective_id?: string
          options?: Json
          question_style?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["objective_id"]
          },
        ]
      }
      objectives: {
        Row: {
          created_at: string
          customer_id: string
          objective_id: string
          product_service: string | null
          qquestion: Json
          relational_sentiment: string | null
          summary: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          objective_id?: string
          product_service?: string | null
          qquestion: Json
          relational_sentiment?: string | null
          summary: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          objective_id?: string
          product_service?: string | null
          qquestion?: Json
          relational_sentiment?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "objectives_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      onboarding_interviews: {
        Row: {
          created_at: string
          customer_id: string
          date: string
          interview_id: string
          raw_data: Json
        }
        Insert: {
          created_at?: string
          customer_id: string
          date?: string
          interview_id?: string
          raw_data: Json
        }
        Update: {
          created_at?: string
          customer_id?: string
          date?: string
          interview_id?: string
          raw_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_interviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      outcomes: {
        Row: {
          created_at: string
          drivers: Json
          insights: string
          objective_id: string
          outcome_id: string
        }
        Insert: {
          created_at?: string
          drivers: Json
          insights: string
          objective_id: string
          outcome_id?: string
        }
        Update: {
          created_at?: string
          drivers?: Json
          insights?: string
          objective_id?: string
          outcome_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcomes_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["objective_id"]
          },
        ]
      }
      results: {
        Row: {
          created_at: string
          data: Json
          game_id: string
          generated_at: string
          insights: string
          objective_id: string
          outcome_id: string
          result_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          game_id: string
          generated_at?: string
          insights: string
          objective_id: string
          outcome_id: string
          result_id?: string
        }
        Update: {
          created_at?: string
          data?: Json
          game_id?: string
          generated_at?: string
          insights?: string
          objective_id?: string
          outcome_id?: string
          result_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "results_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["objective_id"]
          },
          {
            foreignKeyName: "results_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "outcomes"
            referencedColumns: ["outcome_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_game_metadata_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
