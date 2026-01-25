'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSupabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Settings } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await getSupabase().auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        toast({
          title: 'Account created',
          description: 'Please check your email to verify your account',
        })
      } else {
        const { data, error } = await getSupabase().auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Wait for session to be properly established
        if (data.session) {
          // Force a small delay to ensure cookies are set
          await new Promise(resolve => setTimeout(resolve, 100))

          // Verify the session is accessible
          const { data: { user } } = await getSupabase().auth.getUser()
          if (user) {
            toast({
              title: 'Signed in',
              description: 'Welcome back!',
            })

            // Use window.location for a full page refresh to ensure cookies are applied
            window.location.href = '/dashboard'
            return
          }
        }

        toast({
          title: 'Signed in',
          description: 'Welcome back!',
        })

        router.refresh()
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Authentication failed',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div suppressHydrationWarning className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-400 via-purple-400 to-purple-200 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute top-32 left-1/4 w-1 h-1 bg-white rounded-full opacity-40" />
        <div className="absolute top-16 right-1/3 w-1 h-1 bg-white rounded-full opacity-60" />

        {/* Mountain-like shapes using blur */}
        <div className="absolute bottom-0 left-0 w-96 h-64 bg-gradient-to-t from-purple-600 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-80 h-72 bg-gradient-to-t from-purple-700 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-1/3 w-96 h-48 bg-gradient-to-t from-purple-800 to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Header with settings icon */}
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-white/20 rounded-full border border-white/30">
              <Settings className="w-5 h-5 text-white opacity-70" />
            </div>
          </div>

          {/* Title and subtitle */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-light text-white tracking-wide">
              {isSignUp ? 'Create Account' : 'Welcome back!'}
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">
              {isSignUp
                ? 'Create an account to start generating smart receipts with AI'
                : 'Sign in to manage your receipts and expenses'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs text-white/80 font-medium block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition backdrop-blur-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/80 font-medium block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition backdrop-blur-sm"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/20 border border-white/30 accent-white cursor-pointer"
                />
                <span className="text-xs text-white/70">Remember me</span>
              </label>
              <button
                type="button"
                className="text-xs text-white/70 hover:text-white transition font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-purple-900 font-semibold rounded-full hover:bg-white/95 transition disabled:opacity-70 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait
                </span>
              ) : (
                'Log In'
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-xs text-white/60 bg-white/5">Or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-white/10 border border-white/30 text-white font-medium rounded-full hover:bg-white/20 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="white"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="white"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="white"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="white"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Sign Up / Sign In toggle */}
          <div className="text-center text-sm text-white/80 pt-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-white hover:text-white/90 transition"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
