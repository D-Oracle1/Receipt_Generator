'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface BarChartData {
  name: string
  value: number
}

interface BarChartComponentProps {
  data: BarChartData[]
  title?: string
}

export default function BarChartComponent({ data, title }: BarChartComponentProps) {
  return (
    <div className="w-full h-full">
      {title && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-foreground/80 text-sm font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors">
              Yearly Statement
            </button>
            <button className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors">
              View History
            </button>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
