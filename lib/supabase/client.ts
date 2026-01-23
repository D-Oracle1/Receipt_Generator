import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to ensure environment variables are available at runtime
let _supabase: ReturnType<typeof createClientComponentClient> | null = null
let _supabaseAdmin: SupabaseClient | null = null

export const getSupabase = () => {
  if (!_supabase) {
    _supabase = createClientComponentClient()
  }
  return _supabase
}

// For backwards compatibility - lazy getter
export const supabase = new Proxy({} as ReturnType<typeof createClientComponentClient>, {
  get(_, prop) {
    return (getSupabase() as any)[prop]
  }
})

export const getSupabaseAdmin = () => {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables for admin client')
    }

    _supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return _supabaseAdmin
}

// For backwards compatibility
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseAdmin() as any)[prop]
  }
})

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
