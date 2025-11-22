import { test, expect } from '@playwright/test'

test('landing page loads correctly', async ({ page }) => {
  await page.goto('/')

  // Check for main heading
  await expect(page.getByRole('heading', { name: /Create Professional Receipts/i })).toBeVisible()

  // Check for CTA buttons
  await expect(page.getByRole('button', { name: /Start Creating/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /Learn More/i })).toBeVisible()

  // Check for pricing section
  await expect(page.getByText(/Simple Pricing/i)).toBeVisible()
})

test('navigation works', async ({ page }) => {
  await page.goto('/')

  // Click on Get Started button
  await page.getByRole('button', { name: /Get Started/i }).first().click()

  // Should navigate to dashboard (or login if not authenticated)
  await expect(page).toHaveURL(/\/(dashboard|auth\/login)/)
})
