'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase/client'
import Sidebar from '@/components/dashboard/Sidebar'
import BarChartComponent from '@/components/dashboard/BarChartComponent'
import DonutChart from '@/components/dashboard/DonutChart'
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
  Download,
  Eye,
} from 'lucide-react'

interface UserData {
  id: string
  email: string
  credits: number
  is_admin: boolean
}

interface Receipt {
  id: string
  created_at: string
  pdf_url: string | null
  png_url: string | null
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) {
      window.location.href = '/auth/login'
      return
    }

    const [userRes, receiptsRes] = await Promise.all([
      fetch('/api/user'),
      fetch('/api/receipts'),
    ])

    if (userRes.ok) {
      const { user } = await userRes.json()
      setUser(user)
    }
    if (receiptsRes.ok) {
      const { receipts } = await receiptsRes.json()
      setReceipts(receipts)
    }
    setLoading(false)
  }

  async function handleSignOut() {
    await getSupabase().auth.signOut()
    window.location.href = '/'
  }

  // Calculate stats
  const thisMonthReceipts = receipts.filter(r => {
    const date = new Date(r.created_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  const lastMonthReceipts = receipts.filter(r => {
    const date = new Date(r.created_at)
    const now = new Date()
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
    return date.getMonth() === lastMonth && date.getFullYear() === year
  }).length

  const percentChange = lastMonthReceipts > 0
    ? Math.round(((thisMonthReceipts - lastMonthReceipts) / lastMonthReceipts) * 100)
    : thisMonthReceipts > 0 ? 100 : 0

  // Monthly chart data
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const data = []

    for (let i = 11; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12
      const year = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear()
      const count = receipts.filter(r => {
        const date = new Date(r.created_at)
        return date.getMonth() === monthIndex && date.getFullYear() === year
      }).length
      data.push({ name: months[monthIndex], value: count })
    }

    return data
  }

  // Weekly data
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const now = new Date()
    const data = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const count = receipts.filter(r => {
        const rDate = new Date(r.created_at)
        return rDate.toDateString() === date.toDateString()
      }).length
      data.push({ name: days[date.getDay()], value: count })
    }

    return data
  }

  const pdfCount = receipts.filter(r => r.pdf_url).length
  const pngCount = receipts.filter(r => r.png_url).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onSignOut={handleSignOut} userEmail={user?.email} isAdmin={user?.is_admin} />

      <main className="md:ml-20 p-4 md:p-6 pt-20 md:pt-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your receipt generation activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-purple-500" />
              {percentChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{receipts.length}</p>
            <p className="text-sm text-muted-foreground">Total Receipts</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className={`text-xs px-2 py-1 rounded-full ${
                percentChange >= 0 ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                {percentChange >= 0 ? '+' : ''}{percentChange}%
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{thisMonthReceipts}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Download className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{pdfCount}</p>
            <p className="text-sm text-muted-foreground">PDF Downloads</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{pngCount}</p>
            <p className="text-sm text-muted-foreground">PNG Exports</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Activity */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Activity</h2>
            <BarChartComponent
              data={getMonthlyData()}
              title=""
            />
          </div>

          {/* Weekly Activity */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">This Week</h2>
            <BarChartComponent
              data={getWeeklyData()}
              title=""
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Format Distribution */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Format Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">PDF</span>
                  <span className="text-foreground font-medium">
                    {receipts.length > 0 ? Math.round((pdfCount / receipts.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                    style={{ width: `${receipts.length > 0 ? (pdfCount / receipts.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">PNG</span>
                  <span className="text-foreground font-medium">
                    {receipts.length > 0 ? Math.round((pngCount / receipts.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${receipts.length > 0 ? (pngCount / receipts.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credits Usage */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Credits</h2>
            <DonutChart
              percentage={user?.credits === 999999 ? 100 : Math.min(user?.credits || 0, 100)}
              label="Available"
              value={user?.credits === 999999 ? 'Unlimited' : `${user?.credits || 0}`}
              subValue={user?.credits === 999999 ? 'Pro Plan' : 'Credits left'}
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <span className="text-muted-foreground">Avg. per day</span>
                <span className="text-foreground font-semibold">
                  {receipts.length > 0 ? (receipts.length / 30).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <span className="text-muted-foreground">Best month</span>
                <span className="text-foreground font-semibold">
                  {Math.max(...getMonthlyData().map(d => d.value))} receipts
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <span className="text-muted-foreground">Total storage</span>
                <span className="text-foreground font-semibold">
                  {(receipts.length * 0.2).toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
