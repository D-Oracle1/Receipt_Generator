'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSupabase } from '@/lib/supabase/client'
import {
  Plus,
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  Bell,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import LavenderBackground from '@/components/LavenderBackground'
import Sidebar from '@/components/dashboard/Sidebar'
import StatCard from '@/components/dashboard/StatCard'
import DonutChart from '@/components/dashboard/DonutChart'
import BarChartComponent from '@/components/dashboard/BarChartComponent'

interface User {
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
  business_info_json: any
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    loadUserData()
    loadReceipts()
  }, [])

  async function loadUserData() {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) {
      window.location.href = '/auth/login'
      return
    }

    const response = await fetch('/api/user')
    if (response.ok) {
      const { user } = await response.json()
      setUser(user)
    }
    setLoading(false)
  }

  async function loadReceipts() {
    const response = await fetch('/api/receipts')
    if (response.ok) {
      const { receipts } = await response.json()
      setReceipts(receipts)
    }
  }

  async function deleteReceipt(id: string) {
    if (!confirm('Are you sure you want to delete this receipt?')) return

    const response = await fetch(`/api/receipts?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      toast({
        title: 'Receipt deleted',
        description: 'The receipt has been deleted successfully',
      })
      loadReceipts()
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete receipt',
        variant: 'destructive',
      })
    }
  }

  async function handleSignOut() {
    await getSupabase().auth.signOut()
    window.location.href = '/'
  }

  function handlePreview(url: string | null) {
    if (url) {
      setPreviewUrl(url)
      setIsPreviewOpen(true)
    }
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

    for (let i = 5; i >= 0; i--) {
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

  // Credits usage percentage
  const maxCredits = user?.credits === 999999 ? 999999 : 100
  const usedCredits = user?.credits === 999999 ? 0 : (100 - (user?.credits || 0))
  const creditsPercentage = user?.credits === 999999 ? 100 : Math.round((user?.credits || 0))

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const userName = user?.email?.split('@')[0] || 'User'

  if (loading) {
    return (
      <LavenderBackground variant="dark">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading...</p>
          </div>
        </div>
      </LavenderBackground>
    )
  }

  return (
    <LavenderBackground variant="dark">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar onSignOut={handleSignOut} userEmail={user?.email} isAdmin={user?.is_admin} />

        {/* Main Content */}
        <main className="flex-1 ml-20 p-6 overflow-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {getGreeting()}, {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </h1>
              <p className="text-white/60 mt-1">Your weekly financial update</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search here"
                  className="search-input pl-10 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                <Bell className="h-5 w-5 text-white/70" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          {/* Bills Section */}
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Receipts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Receipts"
                value={receipts.length}
                change={percentChange}
                changeLabel={lastMonthReceipts.toString()}
              />
              <StatCard
                title="This Month"
                value={thisMonthReceipts}
                change={percentChange > 0 ? percentChange : undefined}
              />
              <StatCard
                title="Downloaded"
                value={receipts.filter(r => r.pdf_url || r.png_url).length}
              />
              <StatCard
                title="Credits Left"
                value={user?.credits === 999999 ? '∞' : user?.credits || 0}
                icon={<Zap className="h-4 w-4 text-yellow-400" />}
              />
            </div>
          </section>

          {/* Invoices Section */}
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Donut Chart */}
              <div className="lg:col-span-4 glass-panel p-6">
                <DonutChart
                  percentage={creditsPercentage}
                  label="Credits Available"
                  value={user?.credits === 999999 ? 'Unlimited' : `${user?.credits || 0} credits`}
                  subValue={user?.credits === 999999 ? 'Pro subscription active' : 'Upgrade for more'}
                />
              </div>

              {/* Middle Stats */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="glass-panel p-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Total Generated</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">+{percentChange}%</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{receipts.length}</p>
                  <p className="text-white/40 text-sm mt-1">All time receipts</p>
                </div>

                <div className="glass-panel p-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Storage Used</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">85%</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{(receipts.length * 0.2).toFixed(1)} MB</p>
                  <p className="text-white/40 text-sm mt-1">Of 100 MB storage</p>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="lg:col-span-5 glass-panel p-6">
                <BarChartComponent
                  data={getMonthlyData()}
                  title="Monthly Activity"
                />
              </div>
            </div>
          </section>

          {/* History Section */}
          <section className="dashboard-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dashboard-section-title mb-0">History</h2>
              <Link href="/generator">
                <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  <Plus className="h-4 w-4" />
                  New Receipt
                </Button>
              </Link>
            </div>

            <div className="glass-panel overflow-hidden">
              {receipts.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No receipts yet</h3>
                  <p className="text-white/50 mb-6">Get started by creating your first receipt</p>
                  <Link href="/generator">
                    <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                      <Plus className="h-4 w-4" />
                      Create Receipt
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/50 text-sm font-medium">Business</th>
                        <th className="text-left p-4 text-white/50 text-sm font-medium">Date</th>
                        <th className="text-left p-4 text-white/50 text-sm font-medium">Format</th>
                        <th className="text-left p-4 text-white/50 text-sm font-medium">Status</th>
                        <th className="text-right p-4 text-white/50 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.slice(0, 10).map((receipt) => (
                        <tr
                          key={receipt.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-purple-300" />
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {receipt.business_info_json?.name || 'Untitled Receipt'}
                                </p>
                                <p className="text-white/40 text-sm">
                                  {receipt.business_info_json?.email || 'No email'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-white/70">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(receipt.created_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {receipt.pdf_url && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-lg">PDF</span>
                              )}
                              {receipt.png_url && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">PNG</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="status-badge status-completed flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              {(receipt.pdf_url || receipt.png_url) && (
                                <button
                                  onClick={() => handlePreview(receipt.png_url || receipt.pdf_url)}
                                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              )}
                              {receipt.pdf_url && (
                                <a
                                  href={receipt.pdf_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                  title="Download PDF"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                onClick={() => deleteReceipt(receipt.id)}
                                className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Preview Modal */}
      {mounted && isPreviewOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="glass-panel max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/10 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Receipt Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {previewUrl?.endsWith('.pdf') ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96 border border-white/20 rounded-lg"
                  title="Receipt Preview"
                />
              ) : (
                <img
                  src={previewUrl || ''}
                  alt="Receipt Preview"
                  className="w-full max-w-md mx-auto border border-white/20 rounded-lg shadow-2xl"
                />
              )}
            </div>
            <div className="border-t border-white/10 p-4 flex justify-end gap-2">
              {previewUrl && (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </LavenderBackground>
  )
}
