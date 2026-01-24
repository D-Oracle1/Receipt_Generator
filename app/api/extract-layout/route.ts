import { NextRequest, NextResponse } from 'next/server'
import { extractLayoutFromImage } from '@/lib/ai/extractLayout'
import { createServerClient } from '@/lib/supabase/server'

// Increase timeout for AI processing
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Extract layout using AI
    const layout = await extractLayoutFromImage(base64)

    // Save the uploaded file to Supabase storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName)

    // Save file record
    if (uploadData) {
      await (supabase.from('files') as any).insert({
        user_id: user.id,
        file_url: publicUrl,
        file_type: 'sample',
      })
    }

    return NextResponse.json({
      layout,
      sampleUrl: publicUrl,
    })
  } catch (error) {
    console.error('Extract layout error:', error)
    return NextResponse.json(
      { error: 'Failed to extract layout' },
      { status: 500 }
    )
  }
}
