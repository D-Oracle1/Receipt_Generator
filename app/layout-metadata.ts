import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'AI Receipt Generator - Create Professional Receipts Instantly',
  description:
    'Upload any receipt sample and let AI recreate the layout. Generate professional receipts with your own data in seconds.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Receipt Generator',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b84db8',
}
