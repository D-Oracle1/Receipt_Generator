'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { getSupabase } from '@/lib/supabase/client'
import { Plus, FileText, Download, Trash2, LogOut, Sparkles, Zap, Eye } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import LavenderBackground from '@/components/LavenderBackground'

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
      {/* Header */}
      <header className="glass-dark sticky top-0 z-50 border-b border-white/10 my-4 mx-4 rounded-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <Sparkles className="h-6 w-6 text-purple-300" />
              <span className="text-xl font-bold text-white">AI Receipt Generator</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-white/70">{user?.email}</p>
                <p className="text-sm font-medium text-white flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-300" />
                  {user?.credits === 999999 ? 'Unlimited' : user?.credits} Credits
                </p>
              </div>
              {user?.is_admin && (
                <Link href="/admin">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white border-0">Admin Panel</Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.email?.split('@')[0]}</h1>
          <p className="text-white/70">Manage your receipts and generate new ones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <GlassCard glow className="flex flex-col justify-between">
            <GlassCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <GlassCardTitle className="text-sm font-medium text-white/80">Available Credits</GlassCardTitle>
              <Zap className="h-5 w-5 text-yellow-300" />
            </GlassCardHeader>
            <GlassCardContent>
              <div className="text-3xl font-bold text-white">
                {user?.credits === 999999 ? '∞' : user?.credits}
              </div>
              <p className="text-xs text-white/60 mt-2">
                {user?.credits === 999999
                  ? 'Pro subscription active'
                  : 'Upgrade for unlimited receipts'}
              </p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard glow className="flex flex-col justify-between">
            <GlassCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <GlassCardTitle className="text-sm font-medium text-white/80">Total Receipts</GlassCardTitle>
              <FileText className="h-5 w-5 text-purple-300" />
            </GlassCardHeader>
            <GlassCardContent>
              <div className="text-3xl font-bold text-white">{receipts.length}</div>
              <p className="text-xs text-white/60 mt-2">
                Generated receipts
              </p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard glow className="flex flex-col justify-between">
            <GlassCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <GlassCardTitle className="text-sm font-medium text-white/80">Quick Actions</GlassCardTitle>
              <Plus className="h-5 w-5 text-pink-300" />
            </GlassCardHeader>
            <GlassCardContent>
              <Link href="/generator" className="block">
                <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  <Plus className="h-4 w-4" />
                  Create New Receipt
                </Button>
              </Link>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Recent Receipts */}
        <GlassCard glow>
          <GlassCardHeader>
            <GlassCardTitle className="text-white">Recent Receipts</GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Your generated receipts appear here
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            {receipts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No receipts yet</h3>
                <p className="text-white/60 mb-4">
                  Get started by creating your first receipt
                </p>
                <Link href="/generator">
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                    <Plus className="h-4 w-4" />
                    Create Receipt
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {receipt.business_info_json?.name || 'Untitled Receipt'}
                        </h4>
                        <p className="text-sm text-white/60">
                          {new Date(receipt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(receipt.pdf_url || receipt.png_url) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(receipt.png_url || receipt.pdf_url)}
                          className="gap-2 text-blue-300 hover:text-blue-100 hover:bg-blue-500/20 border-blue-300/50 border"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      )}
                      {receipt.pdf_url && (
                        <a
                          href={receipt.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="gap-2 text-green-300 hover:text-green-100 hover:bg-green-500/20 border-green-300/50 border">
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </a>
                      )}
                      {receipt.png_url && (
                        <a
                          href={receipt.png_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 border-purple-300/50 border">
                            <Download className="h-4 w-4" />
                            PNG
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReceipt(receipt.id)}
                        className="text-red-300 hover:text-red-100 hover:bg-red-500/20 border-red-300/50 border"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </main>

      {/* Preview Modal */}
      {mounted && isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-800">Receipt Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {previewUrl?.endsWith('.pdf') ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96 border rounded-lg"
                  title="Receipt Preview"
                />
              ) : (
                <img
                  src={previewUrl || ''}
                  alt="Receipt Preview"
                  className="w-full max-w-md mx-auto border rounded-lg shadow"
                />
              )}
            </div>
            <div className="bg-gray-50 border-t p-4 rounded-b-2xl flex justify-end gap-2">
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
