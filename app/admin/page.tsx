'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Users, FileText, Shield, Ban } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  credits: number
  is_admin: boolean
  is_banned: boolean
  created_at: string
}

interface Stats {
  totalUsers: number
  totalReceipts: number
  activeSubscriptions: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalReceipts: 0,
    activeSubscriptions: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAccess()
    loadData()
  }, [])

  async function checkAdminAccess() {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) {
      window.location.href = '/auth/login'
      return
    }

    const { data: userData } = await getSupabase()
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single() as { data: AdminUser | null }

    if (!userData?.is_admin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin permissions',
        variant: 'destructive',
      })
      window.location.href = '/dashboard'
    }
  }

  async function loadData() {
    setLoading(true)

    // Load users
    const { data: usersData } = await getSupabase()
      .from('users')
      .select('*')
      .order('created_at', { ascending: false }) as { data: AdminUser[] | null }

    if (usersData) {
      setUsers(usersData)
    }

    // Load stats
    const { count: usersCount } = await getSupabase()
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: receiptsCount } = await getSupabase()
      .from('receipts')
      .select('*', { count: 'exact', head: true })

    const { count: subscriptionsCount } = await getSupabase()
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    setStats({
      totalUsers: usersCount || 0,
      totalReceipts: receiptsCount || 0,
      activeSubscriptions: subscriptionsCount || 0,
    })

    setLoading(false)
  }

  async function toggleBanUser(userId: string, currentBanStatus: boolean) {
    const { error } = await getSupabase()
      .from('users')
      .update({ is_banned: !currentBanStatus })
      .eq('id', userId)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: `User ${!currentBanStatus ? 'banned' : 'unbanned'} successfully`,
      })
      loadData()
    }
  }

  async function updateUserCredits(userId: string, credits: number) {
    const { error } = await getSupabase()
      .from('users')
      .update({ credits })
      .eq('id', userId)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update credits',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Credits updated successfully',
      })
      loadData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-bold">Admin Panel</span>
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReceipts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>
              Manage user accounts, credits, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Credits</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          {user.is_admin && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={user.credits}
                          onChange={(e) =>
                            updateUserCredits(user.id, parseInt(e.target.value))
                          }
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="p-3">
                        {user.is_banned ? (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Banned
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant={user.is_banned ? 'outline' : 'destructive'}
                          size="sm"
                          onClick={() => toggleBanUser(user.id, user.is_banned)}
                          className="gap-2"
                        >
                          <Ban className="h-4 w-4" />
                          {user.is_banned ? 'Unban' : 'Ban'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
