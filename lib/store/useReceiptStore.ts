import { create } from 'zustand'
import { ReceiptLayout, getDefaultLayout } from '../ai/extractLayout'
import { BusinessInfo, ReceiptItem, ReceiptData } from '../pdf/generatePDF'

interface ReceiptStore {
  layout: ReceiptLayout
  businessInfo: BusinessInfo
  items: ReceiptItem[]
  subtotal: number
  tax: number
  taxRate: number
  discount: number
  total: number
  receiptNumber: string
  notes: string
  logoUrl: string | null

  setLayout: (layout: ReceiptLayout) => void
  setBusinessInfo: (info: Partial<BusinessInfo>) => void
  addItem: (item: ReceiptItem) => void
  updateItem: (index: number, item: ReceiptItem) => void
  removeItem: (index: number) => void
  setTaxRate: (rate: number) => void
  setDiscount: (discount: number) => void
  setReceiptNumber: (number: string) => void
  setNotes: (notes: string) => void
  setLogoUrl: (url: string | null) => void
  calculateTotals: () => void
  reset: () => void
  getReceiptData: () => ReceiptData
}

const initialBusinessInfo: BusinessInfo = {
  name: '',
  address: '',
  phone: '',
  email: '',
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  layout: getDefaultLayout(),
  businessInfo: initialBusinessInfo,
  items: [],
  subtotal: 0,
  tax: 0,
  taxRate: 0,
  discount: 0,
  total: 0,
  receiptNumber: '',
  notes: '',
  logoUrl: null,

  setLayout: (layout) => set({ layout }),

  setBusinessInfo: (info) =>
    set((state) => ({
      businessInfo: { ...state.businessInfo, ...info },
    })),

  addItem: (item) =>
    set((state) => {
      const newItems = [...state.items, item]
      return { items: newItems }
    }),

  updateItem: (index, item) =>
    set((state) => {
      const newItems = [...state.items]
      newItems[index] = item
      return { items: newItems }
    }),

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),

  setTaxRate: (rate) => {
    set({ taxRate: rate })
    get().calculateTotals()
  },

  setDiscount: (discount) => {
    set({ discount })
    get().calculateTotals()
  },

  setReceiptNumber: (number) => set({ receiptNumber: number }),

  setNotes: (notes) => set({ notes }),

  setLogoUrl: (url) =>
    set((state) => ({
      logoUrl: url,
      businessInfo: { ...state.businessInfo, logoUrl: url || undefined },
    })),

  calculateTotals: () =>
    set((state) => {
      const subtotal = state.items.reduce((sum, item) => sum + item.total, 0)
      const discountAmount = (subtotal * state.discount) / 100
      const taxableAmount = subtotal - discountAmount
      const tax = (taxableAmount * state.taxRate) / 100
      const total = taxableAmount + tax

      return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
      }
    }),

  reset: () =>
    set({
      layout: getDefaultLayout(),
      businessInfo: initialBusinessInfo,
      items: [],
      subtotal: 0,
      tax: 0,
      taxRate: 0,
      discount: 0,
      total: 0,
      receiptNumber: '',
      notes: '',
      logoUrl: null,
    }),

  getReceiptData: () => {
    const state = get()
    return {
      businessInfo: state.businessInfo,
      items: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      total: state.total,
      receiptNumber: state.receiptNumber,
      date: new Date().toLocaleDateString(),
      notes: state.notes,
    }
  },
}))
