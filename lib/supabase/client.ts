import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClientComponentClient()

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          credits: number
          is_admin: boolean
          is_banned: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          credits?: number
          is_admin?: boolean
          is_banned?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          credits?: number
          is_admin?: boolean
          is_banned?: boolean
          created_at?: string
        }
      }
      receipts: {
        Row: {
          id: string
          user_id: string
          template_json: any
          business_info_json: any
          items_json: any
          pdf_url: string | null
          png_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_json: any
          business_info_json: any
          items_json: any
          pdf_url?: string | null
          png_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_json?: any
          business_info_json?: any
          items_json?: any
          pdf_url?: string | null
          png_url?: string | null
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          file_url: string
          file_type: 'sample' | 'logo'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_url: string
          file_type: 'sample' | 'logo'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_url?: string
          file_type?: 'sample' | 'logo'
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}
