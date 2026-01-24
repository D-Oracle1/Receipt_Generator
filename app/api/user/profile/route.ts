import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PUT(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { display_name, phone, company } = body

    const { data, error } = await (supabase
      .from('users') as any)
      .update({
        display_name,
        phone,
        company,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Update profile error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
