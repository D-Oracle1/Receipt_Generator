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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/80 text-sm font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors">
              Yearly Statement
            </button>
            <button className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors">
              View History
            </button>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
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
