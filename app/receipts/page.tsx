'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSupabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import Sidebar from '@/components/dashboard/Sidebar'
import {
  Plus,
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Grid,
  List,
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
  business_info_json: any
}

export default function ReceiptsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { toast } = useToast()

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
      setReceipts(receipts.filter(r => r.id !== id))
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete receipt',
        variant: 'destructive',
      })
    }
  }

  function handlePreview(url: string | null) {
    if (url) {
      setPreviewUrl(url)
      setIsPreviewOpen(true)
    }
  }

  const filteredReceipts = receipts.filter(r =>
    (r.business_info_json?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.business_info_json?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Receipts</h1>
            <p className="text-muted-foreground mt-1">{receipts.length} total receipts</p>
          </div>
          <Link href="/generator">
            <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Receipt
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-colors">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredReceipts.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              {searchTerm ? 'No receipts found' : 'No receipts yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try a different search term' : 'Get started by creating your first receipt'}
            </p>
            {!searchTerm && (
              <Link href="/generator">
                <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  <Plus className="h-4 w-4" />
                  Create Receipt
                </Button>
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="aspect-[3/4] bg-muted/50 flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handlePreview(receipt.png_url || receipt.pdf_url)}
                >
                  {receipt.png_url ? (
                    <img
                      src={receipt.png_url}
                      alt="Receipt preview"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <FileText className="h-16 w-16 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground truncate">
                    {receipt.business_info_json?.name || 'Untitled Receipt'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(receipt.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {receipt.pdf_url && (
                      <a
                        href={receipt.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 text-sm text-center bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        PDF
                      </a>
                    )}
                    {receipt.png_url && (
                      <a
                        href={receipt.png_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 text-sm text-center bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        PNG
                      </a>
                    )}
                    <button
                      onClick={() => deleteReceipt(receipt.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
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
                  {filteredReceipts.map((receipt) => (
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {isPreviewOpen && (
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
