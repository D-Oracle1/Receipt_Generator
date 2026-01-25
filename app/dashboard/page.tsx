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
  MoreVertical,
  Moon,
  Sun,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useTheme } from '@/components/ThemeProvider'
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
  const [greeting, setGreeting] = useState('Hello')
  const { toast } = useToast()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Set greeting on client to avoid hydration mismatch
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  useEffect(() => {
    loadUserData()
    loadReceipts()
  }, [])

  async function loadUserData() {
    try {
      // Use getUser() which validates the session with the server
      const { data: { user: authUser }, error } = await getSupabase().auth.getUser()
      if (error || !authUser) {
        console.log('No authenticated user, redirecting to login')
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('/api/user', {
        credentials: 'include', // Ensure cookies are sent
      })
      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
      } else if (response.status === 401) {
        // Session might be stale, try refreshing
        const { error: refreshError } = await getSupabase().auth.refreshSession()
        if (refreshError) {
          window.location.href = '/auth/login'
          return
        }
        // Retry the request
        const retryResponse = await fetch('/api/user', { credentials: 'include' })
        if (retryResponse.ok) {
          const { user } = await retryResponse.json()
          setUser(user)
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err)
    }
    setLoading(false)
  }

  async function loadReceipts() {
    try {
      const response = await fetch('/api/receipts', { credentials: 'include' })
      if (response.ok) {
        const { receipts } = await response.json()
        setReceipts(receipts)
      } else if (response.status === 401) {
        // Try refreshing the session
        await getSupabase().auth.refreshSession()
        const retryResponse = await fetch('/api/receipts', { credentials: 'include' })
        if (retryResponse.ok) {
          const { receipts } = await retryResponse.json()
          setReceipts(receipts)
        }
      }
    } catch (err) {
      console.error('Error loading receipts:', err)
    }
  }

  async function deleteReceipt(id: string) {
    if (!confirm('Are you sure you want to delete this receipt?')) return

    let response = await fetch(`/api/receipts?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    // Handle 401 by refreshing session and retrying
    if (response.status === 401) {
      await getSupabase().auth.refreshSession()
      response = await fetch(`/api/receipts?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
    }

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
  const creditsPercentage = user?.credits === 999999 ? 100 : Math.round((user?.credits || 0))

  const userName = user?.email?.split('@')[0] || 'User'

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
      {/* Sidebar */}
      <Sidebar onSignOut={handleSignOut} userEmail={user?.email} isAdmin={user?.is_admin} />

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-6 pt-20 md:pt-6 overflow-auto transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {greeting} {userName.charAt(0).toUpperCase() + userName.slice(1)}
            </h1>
            <p className="text-muted-foreground mt-1">Your weekly financial update</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search here"
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
              title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* User Avatar - Hidden on mobile since it's in sidebar */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Bills Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Receipts</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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

        {/* Overview Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Donut Chart */}
            <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-4 md:p-6">
              <DonutChart
                percentage={creditsPercentage}
                label="Credits Available"
                value={user?.credits === 999999 ? 'Unlimited' : `${user?.credits || 0} credits`}
                subValue={user?.credits === 999999 ? 'Pro subscription active' : 'Upgrade for more'}
              />
            </div>

            {/* Middle Stats */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-card border border-border rounded-3xl p-4 md:p-6 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Total Generated</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">+{percentChange}%</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{receipts.length}</p>
                <p className="text-muted-foreground text-sm mt-1">All time receipts</p>
              </div>

              <div className="bg-card border border-border rounded-3xl p-4 md:p-6 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Storage Used</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">85%</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{(receipts.length * 0.2).toFixed(1)} MB</p>
                <p className="text-muted-foreground text-sm mt-1">Of 100 MB storage</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-4 md:p-6">
              <BarChartComponent
                data={getMonthlyData()}
                title="Monthly Activity"
              />
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-foreground">History</h2>
            <Link href="/generator">
              <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                New Receipt
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            {receipts.length === 0 ? (
              <div className="text-center py-16 px-4">
                <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">No receipts yet</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first receipt</p>
                <Link href="/generator">
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                    <Plus className="h-4 w-4" />
                    Create Receipt
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-muted-foreground text-sm font-medium">Business</th>
                      <th className="text-left p-4 text-muted-foreground text-sm font-medium hidden sm:table-cell">Date</th>
                      <th className="text-left p-4 text-muted-foreground text-sm font-medium hidden md:table-cell">Format</th>
                      <th className="text-left p-4 text-muted-foreground text-sm font-medium">Status</th>
                      <th className="text-right p-4 text-muted-foreground text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.slice(0, 10).map((receipt) => (
                      <tr
                        key={receipt.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-foreground font-medium truncate">
                                {receipt.business_info_json?.name || 'Untitled Receipt'}
                              </p>
                              <p className="text-muted-foreground text-sm truncate sm:hidden">
                                {new Date(receipt.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(receipt.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {receipt.pdf_url && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-300 text-xs rounded-lg">PDF</span>
                            )}
                            {receipt.png_url && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs rounded-lg">PNG</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            <span className="hidden sm:inline">Completed</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            {(receipt.pdf_url || receipt.png_url) && (
                              <button
                                onClick={() => handlePreview(receipt.png_url || receipt.pdf_url)}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Download PDF"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                            <button
                              onClick={() => deleteReceipt(receipt.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
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

      {/* Preview Modal */}
      {mounted && isPreviewOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Receipt Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {previewUrl?.endsWith('.pdf') ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96 border border-border rounded-lg"
                  title="Receipt Preview"
                />
              ) : (
                <img
                  src={previewUrl || ''}
                  alt="Receipt Preview"
                  className="w-full max-w-md mx-auto border border-border rounded-lg shadow-2xl"
                />
              )}
            </div>
            <div className="border-t border-border p-4 flex flex-col sm:flex-row justify-end gap-2">
              {previewUrl && (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 w-full">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
