import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './client'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
