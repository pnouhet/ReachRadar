
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "profiles": {
                  Row: {
                    "avatar_path": string | null,"banner_path": string | null,"bio": string | null,"created_at": string,"curator_type": Database["public"]['Enums']["curator_type"] | null,"display_name": string,"genres": (string)[],"id": string,"links": NonNullable<Json>,"location": string | null,"previous_role": Database["public"]['Enums']["user_role"] | null,"role": Database["public"]['Enums']["user_role"],"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_path"?: string | null,"banner_path"?: string | null,"bio"?: string | null,"created_at"?: string,"curator_type"?: Database["public"]['Enums']["curator_type"] | null,"display_name": string,"genres"?: (string)[],"id": string,"links"?: NonNullable<Json>,"location"?: string | null,"previous_role"?: Database["public"]['Enums']["user_role"] | null,"role": Database["public"]['Enums']["user_role"],"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "avatar_path"?: string | null,"banner_path"?: string | null,"bio"?: string | null,"created_at"?: string,"curator_type"?: Database["public"]['Enums']["curator_type"] | null,"display_name"?: string,"genres"?: (string)[],"id"?: string,"links"?: NonNullable<Json>,"location"?: string | null,"previous_role"?: Database["public"]['Enums']["user_role"] | null,"role"?: Database["public"]['Enums']["user_role"],"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"tracks": {
                  Row: {
                    "audio_format": string | null,"audio_path": string | null,"audio_size_bytes": number | null,"bpm": number | null,"cover_path": string | null,"created_at": string,"duration_seconds": number | null,"explicit": boolean,"featuring": string | null,"genre_primary": string | null,"genre_secondary": string | null,"id": string,"isrc": string | null,"moods": (string)[],"musical_key": string | null,"owner_id": string,"private_link": string | null,"published_at": string | null,"release_date": string | null,"release_status": Database["public"]['Enums']["release_status"] | null,"rights_confirmed": boolean,"status": Database["public"]['Enums']["track_status"],"title": string | null,"updated_at": string,"vocals": string | null,"waveform": Json | null
                  }
                  ComputedFields: never
                  Insert: {
                    "audio_format"?: string | null,"audio_path"?: string | null,"audio_size_bytes"?: number | null,"bpm"?: number | null,"cover_path"?: string | null,"created_at"?: string,"duration_seconds"?: number | null,"explicit"?: boolean,"featuring"?: string | null,"genre_primary"?: string | null,"genre_secondary"?: string | null,"id"?: string,"isrc"?: string | null,"moods"?: (string)[],"musical_key"?: string | null,"owner_id": string,"private_link"?: string | null,"published_at"?: string | null,"release_date"?: string | null,"release_status"?: Database["public"]['Enums']["release_status"] | null,"rights_confirmed"?: boolean,"status"?: Database["public"]['Enums']["track_status"],"title"?: string | null,"updated_at"?: string,"vocals"?: string | null,"waveform"?: Json | null
                  }
                  Update: {
                    "audio_format"?: string | null,"audio_path"?: string | null,"audio_size_bytes"?: number | null,"bpm"?: number | null,"cover_path"?: string | null,"created_at"?: string,"duration_seconds"?: number | null,"explicit"?: boolean,"featuring"?: string | null,"genre_primary"?: string | null,"genre_secondary"?: string | null,"id"?: string,"isrc"?: string | null,"moods"?: (string)[],"musical_key"?: string | null,"owner_id"?: string,"private_link"?: string | null,"published_at"?: string | null,"release_date"?: string | null,"release_status"?: Database["public"]['Enums']["release_status"] | null,"rights_confirmed"?: boolean,"status"?: Database["public"]['Enums']["track_status"],"title"?: string | null,"updated_at"?: string,"vocals"?: string | null,"waveform"?: Json | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "tracks_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "grant_admin":
{ Args: { "p_email": string }; Returns: undefined
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"revoke_admin":
{ Args: { "p_email": string }; Returns: undefined
                           },
"slugify_unique":
{ Args: { "name": string }; Returns: string
                           }
          }
          Enums: {
            "curator_type": "playlist"|"label"|"radio"|"blog","release_status": "released"|"upcoming"|"demo","track_status": "draft"|"published","user_role": "artist"|"curator"|"admin"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "curator_type": ["playlist", "label", "radio", "blog"],"release_status": ["released", "upcoming", "demo"],"track_status": ["draft", "published"],"user_role": ["artist", "curator", "admin"]
          }
        }
} as const
