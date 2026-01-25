import { NextRequest, NextResponse } from 'next/server'
import { generatePDF, generatePNG } from '@/lib/pdf/generatePDF'
import { createRouteHandlerClient } from '@/lib/supabase/server'

// Increase timeout for PDF generation with Puppeteer
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(req)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user credits
    const { data: userData, error: userError } = await (supabase
      .from('users') as any)
      .select('credits, is_banned')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userData.is_banned) {
      return NextResponse.json({ error: 'User is banned' }, { status: 403 })
    }

    if (userData.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      )
    }

    const body = await req.json()
    const { layout, businessInfo, items, subtotal, tax, total, receiptNumber, notes } = body

    if (!layout || !businessInfo || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const receiptData = {
      businessInfo,
      items,
      subtotal,
      tax,
      total,
      receiptNumber,
      date: new Date().toLocaleDateString(),
      notes,
    }

    // Generate PDF and PNG
    const [pdfBuffer, pngBuffer] = await Promise.all([
      generatePDF(layout, receiptData),
      generatePNG(layout, receiptData),
    ])

    // Upload to Supabase storage
    const timestamp = Date.now()
    const pdfFileName = `${user.id}/${timestamp}-receipt.pdf`
    const pngFileName = `${user.id}/${timestamp}-receipt.png`

    const [pdfUpload, pngUpload] = await Promise.all([
      supabase.storage.from('receipts').upload(pdfFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      }),
      supabase.storage.from('receipts').upload(pngFileName, pngBuffer, {
        contentType: 'image/png',
        upsert: false,
      }),
    ])

    if (pdfUpload.error || pngUpload.error) {
      console.error('Upload errors:', { pdfUpload, pngUpload })
      return NextResponse.json(
        { error: 'Failed to upload files' },
        { status: 500 }
      )
    }

    // Get public URLs
    const { data: { publicUrl: pdfUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(pdfFileName)

    const { data: { publicUrl: pngUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(pngFileName)

    // Save receipt record
    const { data: receiptRecord, error: receiptError } = await (supabase
      .from('receipts') as any)
      .insert({
        user_id: user.id,
        template_json: layout,
        business_info_json: businessInfo,
        items_json: items,
        pdf_url: pdfUrl,
        png_url: pngUrl,
      })
      .select()
      .single()

    if (receiptError) {
      console.error('Receipt insert error:', receiptError)
    }

    // Decrement user credits
    await (supabase
      .from('users') as any)
      .update({ credits: userData.credits - 1 })
      .eq('id', user.id)

    return NextResponse.json({
      pdfUrl,
      pngUrl,
      receipt: receiptRecord,
      remainingCredits: userData.credits - 1,
    })
  } catch (error) {
    console.error('Generate receipt error:', error)
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    )
  }
}
