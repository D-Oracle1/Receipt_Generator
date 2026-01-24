'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSupabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Sparkles, Loader2, CheckCircle, Shield } from 'lucide-react'

interface SetupStep {
  id: number
  title: string
  description: string
  completed: boolean
}

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [existingAdmins, setExistingAdmins] = useState(0)
  const [checkingAdmins, setCheckingAdmins] = useState(true)
  const { toast } = useToast()

  const ADMIN_SETUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SETUP_KEY || 'ADMIN_KEY_2024'

  useEffect(() => {
    checkExistingAdmins()
  }, [])

  async function checkExistingAdmins() {
    setCheckingAdmins(true)
    try {
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin', true)

      setExistingAdmins(count || 0)
    } catch (error) {
      console.error('Error checking admins:', error)
    } finally {
      setCheckingAdmins(false)
    }
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Verify admin setup key
      if (adminKey !== ADMIN_SETUP_KEY) {
        toast({
          title: 'Invalid Setup Key',
          description: 'The admin setup key you provided is incorrect',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // Create admin account via Supabase Auth
      const { data: authData, error: authError } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Update user record to mark as admin
      const { error: updateError } = await supabase
        .from('users')
        .update({
          is_admin: true,
          credits: 999999, // Unlimited credits for admin
        })
        .eq('id', authData.user.id)

      if (updateError) throw updateError

      toast({
        title: 'Admin Account Created',
        description: 'Please check your email to verify your admin account',
      })

      setSetupComplete(true)
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 2000)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create admin account',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (checkingAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Checking admin setup status...</p>
        </div>
      </div>
    )
  }

  // If admins already exist, redirect to login
  if (existingAdmins > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" style={{
        backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(88, 28, 135, 0.9) 50%, rgba(17, 24, 39, 0.9) 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm78-10c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E")`,
      }}>
        <div className="w-full max-w-md relative z-10 px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">Admin Setup Complete</h2>
              <p className="text-purple-100 text-sm">Your application is already configured with admin accounts.</p>
            </div>

            <div className="px-6 py-6">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <p className="text-center text-gray-300 mb-6">
                Admin accounts have already been set up. Please log in with your admin credentials to access the admin panel.
              </p>
              <Link href="/auth/login" className="block">
                <Button className="w-full bg-white text-purple-900 hover:bg-white/90 rounded-lg font-semibold h-10">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" style={{
        backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(88, 28, 135, 0.9) 50%, rgba(17, 24, 39, 0.9) 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm78-10c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E")`,
      }}>
        <div className="w-full max-w-md relative z-10 px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">Admin Account Created</h2>
              <p className="text-purple-100 text-sm">Your admin account has been successfully created.</p>
            </div>

            <div className="px-6 py-6">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-400 animate-pulse" />
              </div>
              <p className="text-center text-gray-300 mb-6">
                Please check your email to verify your admin account. You'll be redirected to the login page shortly.
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(76, 29, 149, 0.9) 0%, rgba(67, 56, 202, 0.9) 50%, rgba(55, 48, 163, 0.9) 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm78-10c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-purple-300" />
          <span className="text-2xl font-bold text-white">Receipt Gen</span>
        </Link>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-purple-300" />
              <h2 className="text-2xl font-bold text-white">Admin Setup</h2>
            </div>
            <p className="text-purple-100 text-sm">
              Set up your first admin account to manage the Receipt Generator platform
            </p>
          </div>

          <form onSubmit={handleCreateAdmin}>
            <div className="px-6 py-6 space-y-5">
              {/* Info Box */}
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                <p className="text-sm text-purple-100">
                  This setup portal allows you to create the initial admin account. You'll need the admin setup key provided during installation.
                </p>
              </div>

              {/* Admin Email */}
              <div>
                <Label htmlFor="email" className="text-white/90 text-sm font-medium mb-2 block">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg focus:bg-white/20 focus:border-white/40"
                />
                <p className="text-xs text-gray-400 mt-2">Use a secure email address for your admin account</p>
              </div>

              {/* Admin Password */}
              <div>
                <Label htmlFor="password" className="text-white/90 text-sm font-medium mb-2 block">
                  Admin Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg focus:bg-white/20 focus:border-white/40"
                />
                <p className="text-xs text-gray-400 mt-2">Use a strong password with at least 8 characters</p>
              </div>

              {/* Admin Setup Key */}
              <div>
                <Label htmlFor="adminKey" className="text-white/90 text-sm font-medium mb-2 block">
                  Admin Setup Key
                </Label>
                <Input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter setup key"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg focus:bg-white/20 focus:border-white/40"
                />
                <p className="text-xs text-gray-400 mt-2">This key is provided during installation for security</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-purple-900 hover:bg-white/90 rounded-lg font-semibold h-10 transition-all duration-200 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Admin Account...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Create Admin Account
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-100">
                  Your admin account will have unlimited credits and full access to the platform.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 text-center">
              <p className="text-sm text-white/70">
                Already have an admin account?{' '}
                <Link href="/auth/login" className="text-purple-200 hover:text-white font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          Admin setup is restricted to authorized personnel only
        </p>
      </div>
    </div>
  )
}
