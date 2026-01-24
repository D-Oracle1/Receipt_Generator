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
        return 'bg-gray-900'
      case 'field':
        return 'bg-gray-50'
      case 'light':
      default:
        return 'bg-white'
    }
  })()

  return (
    <div suppressHydrationWarning className={`relative min-h-screen w-full overflow-hidden ${backgroundClass} ${className}`}>
      {/* Animated bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Static bubbles with different sizes and positions */}
        <div className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/40 animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 animate-float" style={{ animationDelay: '1s', animationDuration: '10s' }} />
        <div className="absolute top-[60%] left-[15%] w-20 h-20 rounded-full bg-gradient-to-br from-pink-200/35 to-purple-200/35 animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }} />
        <div className="absolute top-[40%] right-[20%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-200/40 to-blue-200/40 animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }} />
        <div className="absolute top-[80%] left-[40%] w-28 h-28 rounded-full bg-gradient-to-br from-blue-200/25 to-pink-200/25 animate-float" style={{ animationDelay: '4s', animationDuration: '11s' }} />
        <div className="absolute top-[5%] left-[60%] w-14 h-14 rounded-full bg-gradient-to-br from-pink-200/45 to-blue-200/45 animate-float" style={{ animationDelay: '0.5s', animationDuration: '6s' }} />
        <div className="absolute top-[70%] right-[5%] w-36 h-36 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 animate-float" style={{ animationDelay: '2.5s', animationDuration: '12s' }} />
        <div className="absolute top-[30%] left-[35%] w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/35 to-purple-200/35 animate-float" style={{ animationDelay: '1.5s', animationDuration: '8s' }} />
        <div className="absolute top-[50%] left-[70%] w-20 h-20 rounded-full bg-gradient-to-br from-pink-200/30 to-blue-200/30 animate-float" style={{ animationDelay: '3.5s', animationDuration: '9s' }} />
        <div className="absolute top-[85%] right-[30%] w-18 h-18 rounded-full bg-gradient-to-br from-purple-200/35 to-pink-200/35 animate-float" style={{ animationDelay: '4.5s', animationDuration: '7s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default LavenderBackground
