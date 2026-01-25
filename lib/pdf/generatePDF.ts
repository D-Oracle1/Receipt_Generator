import { ReceiptLayout } from '../ai/extractLayout'
import { jsPDF } from 'jspdf'

export interface BusinessInfo {
  name: string
  address: string
  phone: string
  email: string
  logoUrl?: string
}

export interface ReceiptItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface ReceiptData {
  businessInfo: BusinessInfo
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  receiptNumber?: string
  date?: string
  notes?: string
}

export async function generatePDF(
  layout: ReceiptLayout,
  data: ReceiptData
): Promise<Buffer> {
  const { page, header, table, totals, footer, colors } = layout
  const { businessInfo, items, subtotal, tax, total, receiptNumber, date, notes } = data

  // Create PDF with receipt dimensions
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [page.width, Math.max(600, 400 + items.length * 25)],
  })

  const primaryColor = colors?.primary || '#000000'
  const secondaryColor = colors?.secondary || '#666666'
  const textColor = colors?.text || '#000000'

  let y = page.padding

  // Header - Business Name
  doc.setFontSize(header.fontSize)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor)

  const headerX = header.alignment === 'center'
    ? page.width / 2
    : header.alignment === 'right'
      ? page.width - page.padding
      : page.padding

  doc.text(businessInfo.name || 'Business Name', headerX, y, {
    align: header.alignment as 'left' | 'center' | 'right'
  })
  y += header.fontSize + 8

  // Business details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(secondaryColor)

  if (businessInfo.address) {
    doc.text(businessInfo.address, headerX, y, { align: header.alignment as 'left' | 'center' | 'right' })
    y += 14
  }
  if (businessInfo.phone) {
    doc.text(businessInfo.phone, headerX, y, { align: header.alignment as 'left' | 'center' | 'right' })
    y += 14
  }
  if (businessInfo.email) {
    doc.text(businessInfo.email, headerX, y, { align: header.alignment as 'left' | 'center' | 'right' })
    y += 14
  }

  y += 15

  // Dashed line
  doc.setDrawColor(200, 200, 200)
  doc.setLineDashPattern([3, 3], 0)
  doc.line(page.padding, y, page.width - page.padding, y)
  y += 15

  // Receipt info
  doc.setFontSize(11)
  doc.setTextColor(textColor)
  doc.text(`Receipt #: ${receiptNumber || 'N/A'}`, page.padding, y)
  doc.text(date || new Date().toLocaleDateString(), page.width - page.padding, y, { align: 'right' })
  y += 20

  // Dashed line
  doc.line(page.padding, y, page.width - page.padding, y)
  y += 20

  // Table header
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')

  const colWidths = [140, 40, 60, 60]
  const colX = [page.padding, page.padding + 140, page.padding + 180, page.padding + 240]

  doc.text('Item', colX[0], y)
  doc.text('Qty', colX[1], y)
  doc.text('Price', colX[2], y)
  doc.text('Total', colX[3], y)
  y += 5

  // Header line
  doc.setLineDashPattern([], 0)
  doc.line(page.padding, y, page.width - page.padding, y)
  y += 15

  // Items
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  for (const item of items) {
    doc.text(item.name.substring(0, 20), colX[0], y)
    doc.text(item.quantity.toString(), colX[1], y)
    doc.text(`$${item.price.toFixed(2)}`, colX[2], y)
    doc.text(`$${item.total.toFixed(2)}`, colX[3], y)
    y += 18
  }

  y += 10

  // Totals section
  doc.setLineDashPattern([3, 3], 0)
  doc.line(page.padding, y, page.width - page.padding, y)
  y += 20

  const totalsX = page.width - page.padding - 100

  doc.setFontSize(totals.fontSize)
  doc.text('Subtotal:', totalsX, y)
  doc.text(`$${subtotal.toFixed(2)}`, page.width - page.padding, y, { align: 'right' })
  y += 18

  doc.text('Tax:', totalsX, y)
  doc.text(`$${tax.toFixed(2)}`, page.width - page.padding, y, { align: 'right' })
  y += 5

  // Total line
  doc.setLineDashPattern([], 0)
  doc.setLineWidth(1.5)
  doc.line(totalsX - 10, y, page.width - page.padding, y)
  y += 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(totals.fontSize + 2)
  doc.text('Total:', totalsX, y)
  doc.text(`$${total.toFixed(2)}`, page.width - page.padding, y, { align: 'right' })
  y += 30

  // Notes
  if (notes) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor)
    doc.text(notes, page.width / 2, y, { align: 'center' })
    y += 20
  }

  // Footer
  doc.setLineDashPattern([3, 3], 0)
  doc.setLineWidth(0.5)
  doc.line(page.padding, y, page.width - page.padding, y)
  y += 15

  doc.setFontSize(footer.fontSize || 11)
  doc.setTextColor(secondaryColor)
  doc.text(footer.text || 'Thank you for your business!', page.width / 2, y, { align: 'center' })

  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer')
  return Buffer.from(pdfOutput)
}

export async function generatePNG(
  layout: ReceiptLayout,
  data: ReceiptData
): Promise<Buffer> {
  // For PNG, we'll generate a simple text-based image using canvas-like approach
  // Since we can't use puppeteer, we'll create a simplified PNG
  // For now, return the PDF as the primary format

  // Generate the PDF and return it - the client can convert if needed
  // Or we use a simple SVG-to-PNG approach

  const pdfBuffer = await generatePDF(layout, data)

  // Return PDF buffer - PNG generation would require additional libraries
  // The frontend can handle PNG conversion if needed
  return pdfBuffer
}

// Generate HTML for client-side rendering/preview
export function generateReceiptHTMLString(
  layout: ReceiptLayout,
  data: ReceiptData
): string {
  const { page, header, table, totals, footer, colors, fonts } = layout
  const { businessInfo, items, subtotal, tax, total, receiptNumber, date, notes } = data

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      color: ${colors?.text || '#000000'};
      width: ${page.width}px;
      padding: ${page.padding}px;
      background: white;
    }
    .header { text-align: ${header.alignment}; margin-bottom: 20px; }
    .business-name {
      font-size: ${header.fontSize}px;
      font-weight: bold;
      color: ${colors?.primary || '#000000'};
      margin-bottom: 8px;
    }
    .header-field {
      font-size: ${header.fontSize * 0.6}px;
      color: ${colors?.secondary || '#666666'};
      margin-bottom: 4px;
    }
    .receipt-info {
      margin: 20px 0;
      border-top: 1px dashed #ccc;
      border-bottom: 1px dashed #ccc;
      padding: 10px 0;
      font-size: 12px;
    }
    .receipt-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .items-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
    .items-table th {
      font-weight: bold;
      padding: 8px 4px;
      border-bottom: 1px dashed #ccc;
      font-size: 12px;
      text-align: left;
    }
    .items-table td { padding: 8px 4px; font-size: 11px; }
    .totals { margin-top: 20px; margin-left: auto; width: 200px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: ${totals.fontSize}px; }
    .total-row.grand-total {
      font-weight: bold;
      border-top: 2px solid ${colors?.primary || '#000000'};
      padding-top: 8px;
      margin-top: 4px;
      font-size: ${totals.fontSize + 2}px;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: ${footer.fontSize || 12}px;
      color: ${colors?.secondary || '#666666'};
      border-top: 1px dashed #ccc;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="business-name">${businessInfo.name}</div>
    <div class="header-field">${businessInfo.address}</div>
    <div class="header-field">${businessInfo.phone}</div>
    <div class="header-field">${businessInfo.email}</div>
  </div>
  <div class="receipt-info">
    <div class="receipt-info-row"><span>Receipt #:</span><span>${receiptNumber || 'N/A'}</span></div>
    <div class="receipt-info-row"><span>Date:</span><span>${date || new Date().toLocaleDateString()}</span></div>
  </div>
  <table class="items-table">
    <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>
      ${items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td>$${item.total.toFixed(2)}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="total-row"><span>Tax:</span><span>$${tax.toFixed(2)}</span></div>
    <div class="total-row grand-total"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
  </div>
  ${notes ? `<div style="margin-top:15px;font-size:10px;color:${colors?.secondary || '#666'};">${notes}</div>` : ''}
  <div class="footer">${footer.text}</div>
</body>
</html>
  `.trim()
}
