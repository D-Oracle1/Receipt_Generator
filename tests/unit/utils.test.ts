import { formatCurrency, formatDate } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(10)).toBe('$10.00')
    expect(formatCurrency(10.5)).toBe('$10.50')
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })
})

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-15')
    const formatted = formatDate(date)
    expect(formatted).toContain('January')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2025')
  })
})
