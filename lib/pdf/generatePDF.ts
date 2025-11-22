import puppeteer from 'puppeteer'
import { ReceiptLayout } from '../ai/extractLayout'

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

function generateReceiptHTML(
  layout: ReceiptLayout,
  data: ReceiptData
): string {
  const { page, header, table, totals, footer, colors, fonts } = layout
  const { businessInfo, items, subtotal, tax, total, receiptNumber, date, notes } = data

  const headerFields: Record<string, string> = {
    businessName: businessInfo.name,
    businessAddress: businessInfo.address,
    businessPhone: businessInfo.phone,
    businessEmail: businessInfo.email,
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=${fonts?.primary || 'Inter'}:wght@400;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: '${fonts?.primary || 'Inter'}', sans-serif;
      color: ${colors?.text || '#000000'};
      width: ${page.width}px;
      padding: ${page.padding}px;
      background: white;
    }

    .header {
      text-align: ${header.alignment};
      margin-bottom: 20px;
    }

    .logo {
      max-width: 120px;
      max-height: 80px;
      margin-bottom: 10px;
    }

    .business-name {
      font-size: ${header.fontSize}px;
      font-weight: ${header.fontWeight};
      margin-bottom: 8px;
      color: ${colors?.primary || '#000000'};
    }

    .header-field {
      font-size: ${header.fontSize * 0.6}px;
      margin-bottom: 4px;
      color: ${colors?.secondary || '#666666'};
    }

    .receipt-info {
      margin: 20px 0;
      font-size: 12px;
      border-top: 1px dashed #ccc;
      border-bottom: 1px dashed #ccc;
      padding: 10px 0;
    }

    .receipt-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .items-table {
      width: 100%;
      margin: 20px 0;
      border-collapse: collapse;
    }

    .items-table th {
      font-weight: ${table.headerBold ? 'bold' : 'normal'};
      padding: 8px 4px;
      border-bottom: ${table.showBorders ? '1px solid #ccc' : '1px dashed #ccc'};
      font-size: 12px;
    }

    .items-table td {
      padding: ${table.rowHeight / 3}px 4px;
      ${table.showBorders ? 'border-bottom: 1px solid #eee;' : ''}
      font-size: 11px;
    }

    ${table.columns.map((col, idx) => `
      .items-table th:nth-child(${idx + 1}),
      .items-table td:nth-child(${idx + 1}) {
        text-align: ${col.alignment || 'left'};
        width: ${col.width}%;
      }
    `).join('\n')}

    .totals {
      margin-top: 20px;
      ${totals.position === 'right' ? 'margin-left: auto;' : ''}
      width: 200px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: ${totals.fontSize}px;
    }

    .total-row.grand-total {
      font-weight: bold;
      border-top: 2px solid ${colors?.primary || '#000000'};
      padding-top: 8px;
      margin-top: 4px;
      font-size: ${totals.fontSize + 2}px;
    }

    .footer {
      margin-top: 30px;
      text-align: ${footer.alignment || 'center'};
      font-size: ${footer.fontSize || 12}px;
      color: ${colors?.secondary || '#666666'};
      border-top: 1px dashed #ccc;
      padding-top: 15px;
    }

    .notes {
      margin-top: 15px;
      font-size: 10px;
      color: ${colors?.secondary || '#666666'};
    }
  </style>
</head>
<body>
  <div class="header">
    ${businessInfo.logoUrl ? `<img src="${businessInfo.logoUrl}" class="logo" alt="Logo" />` : ''}
    ${header.fields.map(field => {
      if (field === 'businessName') {
        return `<div class="business-name">${headerFields[field]}</div>`
      }
      return `<div class="header-field">${headerFields[field] || ''}</div>`
    }).join('\n')}
  </div>

  <div class="receipt-info">
    <div class="receipt-info-row">
      <span>Receipt #:</span>
      <span>${receiptNumber || 'N/A'}</span>
    </div>
    <div class="receipt-info-row">
      <span>Date:</span>
      <span>${date || new Date().toLocaleDateString()}</span>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        ${table.columns.map(col => `<th>${col.label}</th>`).join('\n')}
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${item.total.toFixed(2)}</td>
        </tr>
      `).join('\n')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="total-row">
      <span>Tax:</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div class="total-row grand-total">
      <span>Total:</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  </div>

  ${notes ? `<div class="notes">${notes}</div>` : ''}

  <div class="footer">
    ${footer.text}
  </div>
</body>
</html>
  `.trim()
}

export async function generatePDF(
  layout: ReceiptLayout,
  data: ReceiptData
): Promise<Buffer> {
  const html = generateReceiptHTML(layout, data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      width: `${layout.page.width}px`,
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    })

    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

export async function generatePNG(
  layout: ReceiptLayout,
  data: ReceiptData
): Promise<Buffer> {
  const html = generateReceiptHTML(layout, data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: layout.page.width,
      height: 1000,
    })

    await page.setContent(html, { waitUntil: 'networkidle0' })

    const element = await page.$('body')
    if (!element) {
      throw new Error('Failed to find body element')
    }

    const screenshot = await element.screenshot({
      type: 'png',
    })

    return Buffer.from(screenshot)
  } finally {
    await browser.close()
  }
}
