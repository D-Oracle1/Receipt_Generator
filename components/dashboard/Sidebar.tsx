'use client'

import { useState, useEffect } from 'react'
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface SidebarProps {
  onSignOut: () => void
  userEmail?: string
  isAdmin?: boolean
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'Generator', href: '/generator' },
  { icon: FileText, label: 'Receipts', href: '/receipts' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Sidebar({ onSignOut, userEmail, isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Link>
        {isExpanded && (
          <span className="text-xl font-bold text-foreground whitespace-nowrap">
            Receipt Gen
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary/20 dark:bg-white/20 shadow-lg shadow-purple-500/20"
                  : "hover:bg-primary/10 dark:hover:bg-white/10"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors flex-shrink-0",
                  isActive ? "text-primary dark:text-white" : "text-muted-foreground group-hover:text-primary dark:group-hover:text-white"
                )}
              />
              {isExpanded && (
                <span className={cn(
                  "whitespace-nowrap transition-colors",
                  isActive ? "text-primary dark:text-white font-medium" : "text-muted-foreground group-hover:text-primary dark:group-hover:text-white"
                )}>
                  {item.label}
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg border border-border">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 mt-2",
              pathname === '/admin'
                ? "bg-yellow-500/20 shadow-lg"
                : "hover:bg-yellow-500/10"
            )}
          >
            <User className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            {isExpanded && (
              <span className="text-yellow-500 whitespace-nowrap font-medium">
                Admin Panel
              </span>
            )}
            {!isExpanded && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg border border-border">
                Admin Panel
              </span>
            )}
          </Link>
        )}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col gap-3 pt-4 border-t border-border dark:border-white/20">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-primary/10 dark:hover:bg-white/10"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
          {isExpanded && (
            <span className="text-muted-foreground whitespace-nowrap">
              {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
          {!isExpanded && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg border border-border">
              {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className="group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-red-500/20"
        >
          <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-red-400 transition-colors flex-shrink-0" />
          {isExpanded && (
            <span className="text-muted-foreground group-hover:text-red-400 whitespace-nowrap">
              Sign Out
            </span>
          )}
          {!isExpanded && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg border border-border">
              Sign Out
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className={cn(
          "flex items-center gap-3 p-2",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm shadow-lg flex-shrink-0">
            {userEmail?.charAt(0).toUpperCase() || 'U'}
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {userEmail?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-card/80 backdrop-blur-xl border border-border shadow-lg"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 h-screen w-64 flex flex-col p-4 bg-card/95 backdrop-blur-xl border-r border-border z-50 transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex flex-col h-full" style={{ paddingTop: '2rem' }}>
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-screen flex-col p-4 bg-card/80 dark:bg-white/10 backdrop-blur-xl border-r border-border dark:border-white/20 z-40 transition-all duration-300",
          isExpanded ? "w-64" : "w-20"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SidebarContent />

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-card border border-border shadow-md hover:shadow-lg transition-all"
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </aside>
    </>
  )
}
