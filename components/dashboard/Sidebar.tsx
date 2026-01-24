'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Sparkles,
  BarChart3,
  User,
} from 'lucide-react'

interface SidebarProps {
  onSignOut: () => void
  userEmail?: string
  isAdmin?: boolean
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'Generator', href: '/generator' },
  { icon: FileText, label: 'Receipts', href: '/dashboard', active: true },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard' },
  { icon: Settings, label: 'Settings', href: '/dashboard' },
]

export default function Sidebar({ onSignOut, userEmail, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-6 bg-white/10 backdrop-blur-xl border-r border-white/20 z-40">
      {/* Logo */}
      <Link href="/" className="mb-8 p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
        <Sparkles className="h-6 w-6 text-white" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative p-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-white/20 shadow-lg shadow-purple-500/20"
                  : "hover:bg-white/10"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-white/60 group-hover:text-white"
                )}
              />
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </Link>
          )
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className="group relative p-3 rounded-xl transition-all duration-300 hover:bg-white/10 mt-2"
          >
            <User className="h-5 w-5 text-yellow-400" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Admin Panel
            </span>
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onSignOut}
          className="group relative p-3 rounded-xl transition-all duration-300 hover:bg-red-500/20"
        >
          <LogOut className="h-5 w-5 text-white/60 group-hover:text-red-400 transition-colors" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Sign Out
          </span>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
          {userEmail?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </aside>
  )
}
