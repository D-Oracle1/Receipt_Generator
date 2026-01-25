import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClientWithResponse } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { supabase, applyResponseCookies } = createRouteHandlerClientWithResponse(req)
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user, error } = await (supabase
      .from('users') as any)
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error) {
      console.error('Fetch user error:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const response = NextResponse.json({ user })
    return applyResponseCookies(response)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
