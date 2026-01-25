import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClientWithResponse } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { supabase, applyResponseCookies } = createRouteHandlerClientWithResponse(req)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: receipts, error } = await (supabase
      .from('receipts') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch receipts error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch receipts' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({ receipts })
    return applyResponseCookies(response)
  } catch (error) {
    console.error('Get receipts error:', error)
    return NextResponse.json(
      { error: 'Failed to get receipts' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { supabase, applyResponseCookies } = createRouteHandlerClientWithResponse(req)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const receiptId = searchParams.get('id')

    if (!receiptId) {
      return NextResponse.json(
        { error: 'Receipt ID required' },
        { status: 400 }
      )
    }

    const { error } = await (supabase
      .from('receipts') as any)
      .delete()
      .eq('id', receiptId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete receipt error:', error)
      return NextResponse.json(
        { error: 'Failed to delete receipt' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({ success: true })
    return applyResponseCookies(response)
  } catch (error) {
    console.error('Delete receipt error:', error)
    return NextResponse.json(
      { error: 'Failed to delete receipt' },
      { status: 500 }
    )
  }
}
