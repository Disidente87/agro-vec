import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl) throw new Error('supabaseUrl is required')
  if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required')
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl) throw new Error('supabaseUrl is required')
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
  return createClient(supabaseUrl, serviceRoleKey)
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          address: string
          role: 'producer' | 'technician' | 'distributor' | 'consumer'
          name: string | null
          email: string | null
          organization: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          address: string
          role?: 'producer' | 'technician' | 'distributor' | 'consumer'
          name?: string | null
          email?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          address?: string
          role?: 'producer' | 'technician' | 'distributor' | 'consumer'
          name?: string | null
          email?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parcels: {
        Row: {
          id: string
          name: string
          location: unknown | null
          area: number | null
          crop_type: string | null
          producer_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: unknown | null
          area?: number | null
          crop_type?: string | null
          producer_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: unknown | null
          area?: number | null
          crop_type?: string | null
          producer_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          parcel_id: string
          event_type: string
          description: string | null
          event_date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          parcel_id: string
          event_type: string
          description?: string | null
          event_date: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          parcel_id?: string
          event_type?: string
          description?: string | null
          event_date?: string
          created_by?: string
          created_at?: string
        }
      }
      batches: {
        Row: {
          id: string
          name: string
          parcel_id: string
          product_type: string | null
          quantity: number | null
          unit: string | null
          harvest_date: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parcel_id: string
          product_type?: string | null
          quantity?: number | null
          unit?: string | null
          harvest_date?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parcel_id?: string
          product_type?: string | null
          quantity?: number | null
          unit?: string | null
          harvest_date?: string | null
          created_by?: string
          created_at?: string
        }
      }
    }
  }
} 