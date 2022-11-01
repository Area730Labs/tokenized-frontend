export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          id: string
          checksum: string
          finished_at: string | null
          migration_name: string
          logs: string | null
          rolled_back_at: string | null
          started_at: string
          applied_steps_count: number
        }
        Insert: {
          id: string
          checksum: string
          finished_at?: string | null
          migration_name: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
        Update: {
          id?: string
          checksum?: string
          finished_at?: string | null
          migration_name?: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
      }
      MarketApp: {
        Row: {
          name: string
          iconUrl: string
          description: string
          rating: number
          ratingCount: number
          id: number
          published: boolean
        }
        Insert: {
          name: string
          iconUrl: string
          description: string
          rating: number
          ratingCount: number
          id?: number
          published?: boolean
        }
        Update: {
          name?: string
          iconUrl?: string
          description?: string
          rating?: number
          ratingCount?: number
          id?: number
          published?: boolean
        }
      }
      Profile: {
        Row: {
          id: number
          owner_uid: string | null
          api_key: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          owner_uid?: string | null
          api_key?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          owner_uid?: string | null
          api_key?: string | null
          created_at?: string | null
        }
      }
      Project: {
        Row: {
          name: string
          logoUrl: string | null
          fee: number
          blockchain: string
          id: number
          mintCount: number | null
          minted: number | null
          traitCount: number | null
          owner_uid: string
        }
        Insert: {
          name: string
          logoUrl?: string | null
          fee: number
          blockchain: string
          id?: number
          mintCount?: number | null
          minted?: number | null
          traitCount?: number | null
          owner_uid: string
        }
        Update: {
          name?: string
          logoUrl?: string | null
          fee?: number
          blockchain?: string
          id?: number
          mintCount?: number | null
          minted?: number | null
          traitCount?: number | null
          owner_uid?: string
        }
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
  }
}
