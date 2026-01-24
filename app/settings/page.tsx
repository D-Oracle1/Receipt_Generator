'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSupabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { useTheme } from '@/components/ThemeProvider'
import Sidebar from '@/components/dashboard/Sidebar'
import {
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Monitor,
  Check,
  Loader2,
} from 'lucide-react'

interface UserData {
  id: string
  email: string
  credits: number
  is_admin: boolean
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { toast } = useToast()
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [receiptAlerts, setReceiptAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  useEffect(() => {
    loadUserData()
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

  async function handleSignOut() {
    await getSupabase().auth.signOut()
    window.location.href = '/'
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await getSupabase().auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences</p>
          </div>

          {/* Profile Section */}
          <section className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                <p className="text-sm text-muted-foreground">Your account information</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user?.email}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Account Type</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {user?.credits === 999999 ? 'Pro' : 'Free'} Plan
                  </span>
                  {user?.is_admin && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Credits</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {user?.credits === 999999 ? 'Unlimited' : `${user?.credits} credits remaining`}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize how the app looks</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <span className="text-sm text-foreground block">Light</span>
                {theme === 'light' && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Moon className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <span className="text-sm text-foreground block">Dark</span>
                {theme === 'dark' && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  theme === 'system'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Monitor className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-foreground block">System</span>
                {theme === 'system' && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-foreground font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-foreground font-medium">Receipt Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when receipts are generated</p>
                </div>
                <input
                  type="checkbox"
                  checked={receiptAlerts}
                  onChange={(e) => setReceiptAlerts(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-foreground font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive product updates and offers</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground">Update your password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="mt-1"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={saving || !newPassword || !confirmPassword}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="outline"
              className="border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
            >
              Delete Account
            </Button>
          </section>
        </div>
      </main>
    </div>
  )
}
