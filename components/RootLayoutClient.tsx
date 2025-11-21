'use client'

import { useEffect } from 'react'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Handle online/offline events
    const handleOnline = () => {
      console.log('App is back online')
      // You can dispatch an event or update state here if needed
    }

    const handleOffline = () => {
      console.log('App is offline')
      // You can dispatch an event or update state here if needed
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return <>{children}</>
}
