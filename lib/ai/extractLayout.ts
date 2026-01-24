import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export interface ReceiptLayout {
  page: {
    width: number
    padding: number
  }
  header: {
    alignment: 'left' | 'center' | 'right'
    fontSize: number
    fontWeight: string
    fields: string[]
    logoPosition?: 'top' | 'left' | 'right'
  }
  table: {
    columns: Array<{
      label: string
      width: number
      alignment?: 'left' | 'center' | 'right'
    }>
    rowHeight: number
    showBorders?: boolean
    headerBold?: boolean
  }
  totals: {
    position: 'right' | 'left'
    fontSize: number
    fields: string[]
  }
  footer: {
    text: string
    fontSize?: number
    alignment?: 'left' | 'center' | 'right'
  }
  colors?: {
    primary?: string
    secondary?: string
    text?: string
  }
  fonts?: {
    primary?: string
    secondary?: string
  }
}

const LAYOUT_EXTRACTION_PROMPT = `You are an expert document layout analysis engine. Analyze the receipt image provided and extract its structural layout.

Your task is to examine the receipt and identify:
1. Page dimensions and margins
2. Header section (logo position, business name, address, contact info)
3. Table structure (columns, alignment, spacing)
4. Totals section (subtotal, tax, total positioning)
5. Footer (thank you message, additional info)
6. Typography (approximate font sizes, weights)
7. Colors (if any distinctive colors are used)
8. Spacing and alignment patterns

Output ONLY a valid JSON object with this exact structure (no markdown, no explanations):

{
  "page": {
    "width": <number in pixels, typically 384 for receipt>,
    "padding": <number in pixels>
  },
  "header": {
    "alignment": "center|left|right",
    "fontSize": <number>,
    "fontWeight": "normal|bold",
    "fields": ["businessName", "businessAddress", "businessPhone", ...],
    "logoPosition": "top|left|right" (optional)
  },
  "table": {
    "columns": [
      {"label": "Item", "width": <percentage>, "alignment": "left|center|right"},
      {"label": "Qty", "width": <percentage>, "alignment": "left|center|right"},
      {"label": "Price", "width": <percentage>, "alignment": "right"},
      {"label": "Total", "width": <percentage>, "alignment": "right"}
    ],
    "rowHeight": <number in pixels>,
    "showBorders": <boolean>,
    "headerBold": <boolean>
  },
  "totals": {
    "position": "right|left",
    "fontSize": <number>,
    "fields": ["subtotal", "tax", "total"]
  },
  "footer": {
    "text": "<default footer text if visible>",
    "fontSize": <number>,
    "alignment": "center|left|right"
  },
  "colors": {
    "primary": "<hex color if distinctive>",
    "secondary": "<hex color>",
    "text": "<hex color>"
  },
  "fonts": {
    "primary": "<suggested Google Font name>",
    "secondary": "<suggested Google Font name>"
  }
}

Be precise with measurements. Analyze the visual hierarchy carefully. Output ONLY the JSON, nothing else.`

export async function extractLayoutFromImage(
  imageBase64: string
): Promise<ReceiptLayout> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
      { text: LAYOUT_EXTRACTION_PROMPT },
    ])

    const response = await result.response
    const textContent = response.text()

    if (!textContent) {
      throw new Error('No text response from Gemini')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = textContent.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '')
    }

    const layout: ReceiptLayout = JSON.parse(jsonText)

    // Validate the structure
    if (!layout.page || !layout.header || !layout.table || !layout.totals || !layout.footer) {
      throw new Error('Invalid layout structure returned')
    }

    return layout
  } catch (error) {
    console.error('Error extracting layout:', error)

    // Return a default layout as fallback
    return getDefaultLayout()
  }
}

export function getDefaultLayout(): ReceiptLayout {
  return {
    page: {
      width: 384,
      padding: 20,
    },
    header: {
      alignment: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      fields: ['businessName', 'businessAddress', 'businessPhone', 'businessEmail'],
    },
    table: {
      columns: [
        { label: 'Item', width: 50, alignment: 'left' },
        { label: 'Qty', width: 15, alignment: 'center' },
        { label: 'Price', width: 17, alignment: 'right' },
        { label: 'Total', width: 18, alignment: 'right' },
      ],
      rowHeight: 20,
      showBorders: false,
      headerBold: true,
    },
    totals: {
      position: 'right',
      fontSize: 14,
      fields: ['subtotal', 'tax', 'total'],
    },
    footer: {
      text: 'Thank you for your business!',
      fontSize: 12,
      alignment: 'center',
    },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      text: '#000000',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter',
    },
  }
}
