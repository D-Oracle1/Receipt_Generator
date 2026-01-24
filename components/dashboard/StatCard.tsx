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
        "relative p-4 md:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02]",
        variant === 'default'
          ? "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
          : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-primary/30 hover:border-primary/50",
        className
      )}
    >
      {/* Trend badge */}
      {change !== undefined && (
        <div
          className={cn(
            "absolute top-3 md:top-4 right-3 md:right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            isPositive && "bg-green-500/20 text-green-600 dark:text-green-400",
            isNegative && "bg-red-500/20 text-red-600 dark:text-red-400",
            isNeutral && "bg-muted text-muted-foreground"
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
        <div className="absolute top-3 md:top-4 right-3 md:right-4 p-2 rounded-xl bg-muted">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs md:text-sm">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold text-foreground">{value}</span>
          {changeLabel && (
            <span className="text-muted-foreground text-base md:text-lg">- {changeLabel}</span>
          )}
        </div>
      </div>
    </div>
  )
}
