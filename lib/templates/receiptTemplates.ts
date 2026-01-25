import { ReceiptLayout } from '../ai/extractLayout'

export interface ReceiptTemplate {
  id: string
  name: string
  description: string
  preview: string // emoji or icon identifier
  layout: ReceiptLayout
}

export const receiptTemplates: ReceiptTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional centered receipt layout',
    preview: '📄',
    layout: {
      page: { width: 384, padding: 20 },
      header: {
        alignment: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        fields: ['businessName', 'businessAddress', 'businessPhone', 'businessEmail'],
      },
      table: {
        columns: [
          { label: 'Item', width: 45, alignment: 'left' },
          { label: 'Qty', width: 15, alignment: 'center' },
          { label: 'Price', width: 20, alignment: 'right' },
          { label: 'Total', width: 20, alignment: 'right' },
        ],
        rowHeight: 22,
        showBorders: false,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 14, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Thank you for your business!', fontSize: 12, alignment: 'center' },
      colors: { primary: '#000000', secondary: '#666666', text: '#000000' },
      fonts: { primary: 'Inter', secondary: 'Inter' },
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimal with accent colors',
    preview: '✨',
    layout: {
      page: { width: 384, padding: 24 },
      header: {
        alignment: 'left',
        fontSize: 24,
        fontWeight: 'bold',
        fields: ['businessName', 'businessAddress', 'businessPhone'],
      },
      table: {
        columns: [
          { label: 'Description', width: 50, alignment: 'left' },
          { label: 'Qty', width: 12, alignment: 'center' },
          { label: 'Rate', width: 18, alignment: 'right' },
          { label: 'Amount', width: 20, alignment: 'right' },
        ],
        rowHeight: 24,
        showBorders: true,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 15, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'We appreciate your business!', fontSize: 11, alignment: 'center' },
      colors: { primary: '#2563eb', secondary: '#64748b', text: '#1e293b' },
      fonts: { primary: 'Inter', secondary: 'Inter' },
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated with refined typography',
    preview: '🎩',
    layout: {
      page: { width: 384, padding: 28 },
      header: {
        alignment: 'center',
        fontSize: 26,
        fontWeight: 'bold',
        fields: ['businessName', 'businessAddress', 'businessPhone', 'businessEmail'],
        logoPosition: 'top',
      },
      table: {
        columns: [
          { label: 'Item', width: 48, alignment: 'left' },
          { label: 'Qty', width: 12, alignment: 'center' },
          { label: 'Price', width: 20, alignment: 'right' },
          { label: 'Total', width: 20, alignment: 'right' },
        ],
        rowHeight: 26,
        showBorders: false,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 14, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Thank you for choosing us', fontSize: 13, alignment: 'center' },
      colors: { primary: '#1a1a2e', secondary: '#4a4e69', text: '#1a1a2e' },
      fonts: { primary: 'Playfair Display', secondary: 'Inter' },
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Space-efficient for thermal printers',
    preview: '🧾',
    layout: {
      page: { width: 300, padding: 12 },
      header: {
        alignment: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        fields: ['businessName', 'businessPhone'],
      },
      table: {
        columns: [
          { label: 'Item', width: 50, alignment: 'left' },
          { label: 'Qty', width: 15, alignment: 'center' },
          { label: 'Price', width: 17, alignment: 'right' },
          { label: 'Total', width: 18, alignment: 'right' },
        ],
        rowHeight: 18,
        showBorders: false,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 12, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Thanks!', fontSize: 10, alignment: 'center' },
      colors: { primary: '#000000', secondary: '#333333', text: '#000000' },
      fonts: { primary: 'Courier New', secondary: 'Courier New' },
    },
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Perfect for stores and shops',
    preview: '🛒',
    layout: {
      page: { width: 384, padding: 20 },
      header: {
        alignment: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        fields: ['businessName', 'businessAddress', 'businessPhone'],
        logoPosition: 'top',
      },
      table: {
        columns: [
          { label: 'Product', width: 45, alignment: 'left' },
          { label: 'Qty', width: 15, alignment: 'center' },
          { label: 'Unit $', width: 20, alignment: 'right' },
          { label: 'Total', width: 20, alignment: 'right' },
        ],
        rowHeight: 22,
        showBorders: true,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 14, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Thank you for shopping with us!', fontSize: 11, alignment: 'center' },
      colors: { primary: '#16a34a', secondary: '#4b5563', text: '#111827' },
      fonts: { primary: 'Inter', secondary: 'Inter' },
    },
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Ideal for food service',
    preview: '🍽️',
    layout: {
      page: { width: 384, padding: 20 },
      header: {
        alignment: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        fields: ['businessName', 'businessAddress', 'businessPhone'],
      },
      table: {
        columns: [
          { label: 'Item', width: 55, alignment: 'left' },
          { label: 'Qty', width: 10, alignment: 'center' },
          { label: 'Price', width: 17, alignment: 'right' },
          { label: 'Total', width: 18, alignment: 'right' },
        ],
        rowHeight: 24,
        showBorders: false,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 14, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Thank you! Please come again!', fontSize: 12, alignment: 'center' },
      colors: { primary: '#dc2626', secondary: '#78716c', text: '#1c1917' },
      fonts: { primary: 'Inter', secondary: 'Inter' },
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and business services',
    preview: '💼',
    layout: {
      page: { width: 420, padding: 30 },
      header: {
        alignment: 'left',
        fontSize: 24,
        fontWeight: 'bold',
        fields: ['businessName', 'businessAddress', 'businessPhone', 'businessEmail'],
        logoPosition: 'left',
      },
      table: {
        columns: [
          { label: 'Service', width: 45, alignment: 'left' },
          { label: 'Hours', width: 15, alignment: 'center' },
          { label: 'Rate', width: 20, alignment: 'right' },
          { label: 'Amount', width: 20, alignment: 'right' },
        ],
        rowHeight: 26,
        showBorders: true,
        headerBold: true,
      },
      totals: { position: 'right', fontSize: 15, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Payment due within 30 days. Thank you!', fontSize: 11, alignment: 'center' },
      colors: { primary: '#0f172a', secondary: '#475569', text: '#0f172a' },
      fonts: { primary: 'Inter', secondary: 'Inter' },
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: '⬜',
    layout: {
      page: { width: 360, padding: 24 },
      header: {
        alignment: 'center',
        fontSize: 18,
        fontWeight: 'normal',
        fields: ['businessName', 'businessPhone'],
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
        headerBold: false,
      },
      totals: { position: 'right', fontSize: 13, fields: ['subtotal', 'tax', 'total'] },
      footer: { text: 'Thank you', fontSize: 11, alignment: 'center' },
      colors: { primary: '#374151', secondary: '#9ca3af', text: '#374151' },
      fonts: { primary: 'Inter', secondary: 'Inter' },
    },
  },
]

export function getTemplateById(id: string): ReceiptTemplate | undefined {
  return receiptTemplates.find(t => t.id === id)
}

export function getTemplateLayout(id: string): ReceiptLayout | undefined {
  return getTemplateById(id)?.layout
}
