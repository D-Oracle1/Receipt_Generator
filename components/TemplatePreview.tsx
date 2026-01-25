'use client'

import { ReceiptTemplate } from '@/lib/templates/receiptTemplates'

interface TemplatePreviewProps {
  template: ReceiptTemplate
  isSelected: boolean
  onClick: () => void
}

// Sample data for preview
const sampleData = {
  businessName: 'ACME Store',
  items: [
    { name: 'Item 1', qty: 2, price: 10.00, total: 20.00 },
    { name: 'Item 2', qty: 1, price: 15.00, total: 15.00 },
  ],
  subtotal: 35.00,
  tax: 2.80,
  total: 37.80,
}

export function TemplatePreview({ template, isSelected, onClick }: TemplatePreviewProps) {
  const { layout } = template
  const colors = layout.colors || { primary: '#000', secondary: '#666', text: '#000' }

  return (
    <button
      onClick={onClick}
      className={`relative w-full rounded-xl border-2 transition-all hover:shadow-lg overflow-hidden ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
          Selected
        </div>
      )}

      {/* Mini Receipt Preview */}
      <div className="p-3 bg-white">
        <div
          className="bg-white rounded border shadow-sm p-3 text-left"
          style={{
            fontSize: '6px',
            lineHeight: '1.4',
            minHeight: '140px',
          }}
        >
          {/* Header */}
          <div
            className="mb-2 pb-1 border-b border-dashed"
            style={{
              textAlign: layout.header.alignment,
              borderColor: '#ddd',
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: '8px',
                color: colors.primary,
              }}
            >
              {sampleData.businessName}
            </div>
            <div style={{ color: colors.secondary, fontSize: '5px' }}>
              123 Main Street
            </div>
          </div>

          {/* Items */}
          <div className="mb-2">
            <div
              className="flex justify-between font-bold pb-0.5 mb-1 border-b"
              style={{
                borderColor: '#eee',
                fontSize: '5px',
              }}
            >
              <span>Item</span>
              <span>Total</span>
            </div>
            {sampleData.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between"
                style={{ color: colors.text, fontSize: '5px' }}
              >
                <span>{item.name}</span>
                <span>${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            className="pt-1 border-t border-dashed"
            style={{ borderColor: '#ddd' }}
          >
            <div
              className="flex justify-between"
              style={{ fontSize: '5px', color: colors.secondary }}
            >
              <span>Subtotal</span>
              <span>${sampleData.subtotal.toFixed(2)}</span>
            </div>
            <div
              className="flex justify-between"
              style={{ fontSize: '5px', color: colors.secondary }}
            >
              <span>Tax</span>
              <span>${sampleData.tax.toFixed(2)}</span>
            </div>
            <div
              className="flex justify-between font-bold pt-0.5 mt-0.5 border-t"
              style={{
                fontSize: '6px',
                color: colors.primary,
                borderColor: colors.primary,
              }}
            >
              <span>Total</span>
              <span>${sampleData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-2 pt-1 border-t border-dashed text-center"
            style={{
              borderColor: '#ddd',
              color: colors.secondary,
              fontSize: '5px',
            }}
          >
            Thank you!
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-3 pt-0 bg-white">
        <div className="text-sm font-medium text-gray-900">{template.name}</div>
        <div className="text-xs text-gray-500 line-clamp-1">{template.description}</div>
      </div>
    </button>
  )
}

export function TemplateGrid({
  templates,
  selectedId,
  onSelect,
}: {
  templates: ReceiptTemplate[]
  selectedId: string
  onSelect: (template: ReceiptTemplate) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <TemplatePreview
          key={template.id}
          template={template}
          isSelected={selectedId === template.id}
          onClick={() => onSelect(template)}
        />
      ))}
    </div>
  )
}
