'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'gradient'
  className?: string
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  const isNeutral = change === 0

  return (
    <div
      className={cn(
        "relative p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]",
        variant === 'default'
          ? "bg-white/10 border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
          : "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:border-purple-400/50",
        className
      )}
    >
      {/* Trend badge */}
      {change !== undefined && (
        <div
          className={cn(
            "absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            isPositive && "bg-green-500/20 text-green-400",
            isNegative && "bg-red-500/20 text-red-400",
            isNeutral && "bg-gray-500/20 text-gray-400"
          )}
        >
          {isPositive && <TrendingUp className="h-3 w-3" />}
          {isNegative && <TrendingDown className="h-3 w-3" />}
          {isNeutral && <Minus className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{change}%</span>
        </div>
      )}

      {/* Icon */}
      {icon && (
        <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/10">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <p className="text-white/60 text-sm">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {changeLabel && (
            <span className="text-white/40 text-lg">- {changeLabel}</span>
          )}
        </div>
      </div>
    </div>
  )
}
