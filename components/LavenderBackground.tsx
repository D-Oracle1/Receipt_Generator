'use client'

import React from 'react'

interface LavenderBackgroundProps {
  children?: React.ReactNode
  variant?: 'light' | 'dark' | 'field'
  className?: string
}

export const LavenderBackground: React.FC<LavenderBackgroundProps> = ({
  children,
  variant = 'light',
  className = '',
}) => {
  const backgroundClass = (() => {
    switch (variant) {
      case 'dark':
        return 'bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950'
      case 'field':
        return 'bg-gradient-to-b from-purple-400 via-purple-300 to-purple-200'
      case 'light':
      default:
        return 'bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50'
    }
  })()

  return (
    <div suppressHydrationWarning className={`relative min-h-screen w-full overflow-hidden ${backgroundClass} ${className}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blurred circles for depth */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-pink-300/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default LavenderBackground
