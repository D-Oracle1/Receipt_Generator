'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface DonutChartProps {
  percentage: number
  label: string
  value: string
  subValue?: string
}

export default function DonutChart({ percentage, label, value, subValue }: DonutChartProps) {
  // Create data for the gauge effect
  const data = [
    { value: percentage, color: 'url(#gradient)' },
    { value: 100 - percentage, color: 'var(--muted)' },
  ]

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="60%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? entry.color : 'hsl(var(--muted))'}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-3xl md:text-4xl font-bold text-foreground">{percentage}%</span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
        {subValue && <p className="text-muted-foreground text-sm">{subValue}</p>}
      </div>
    </div>
  )
}
