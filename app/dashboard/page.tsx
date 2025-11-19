'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Plus, FileText, Download, Trash2, LogOut, Sparkles } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

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
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
    loadReceipts()
  }, [])

  async function loadUserData() {
    const { data: { session } } = await supabase.auth.getSession()
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
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">AI Receipt Generator</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm font-medium">
                  {user?.credits === 999999 ? 'Unlimited' : user?.credits} Credits
                </p>
              </div>
              {user?.is_admin && (
                <Link href="/admin">
                  <Button variant="outline">Admin Panel</Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.credits === 999999 ? 'Unlimited' : user?.credits}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.credits === 999999
                  ? 'Pro subscription active'
                  : 'Upgrade for unlimited receipts'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receipts.length}</div>
              <p className="text-xs text-muted-foreground">
                Generated receipts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/generator">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Receipt
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Receipts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Receipts</CardTitle>
            <CardDescription>
              Your generated receipts appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {receipts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No receipts yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first receipt
                </p>
                <Link href="/generator">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Receipt
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-blue-600" />
                      <div>
                        <h4 className="font-medium">
                          {receipt.business_info_json?.name || 'Untitled Receipt'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(receipt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {receipt.pdf_url && (
                        <a
                          href={receipt.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
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
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            PNG
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReceipt(receipt.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
