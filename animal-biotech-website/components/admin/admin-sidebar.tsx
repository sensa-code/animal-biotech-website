'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Star,
  Home,
  Settings,
  Newspaper,
  LogOut,
  ChevronDown,
  QrCode,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    label: '儀表板',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: '產品管理',
    icon: Package,
    children: [
      { label: '產品列表', href: '/admin/products' },
      { label: '分類管理', href: '/admin/categories' },
      { label: '主打產品', href: '/admin/featured' },
    ],
  },
  {
    label: '溯源管理',
    icon: QrCode,
    children: [
      { label: '溯源記錄', href: '/admin/traceability' },
      { label: '批次匯入', href: '/admin/traceability/batch' },
    ],
  },
  {
    label: '首頁內容',
    href: '/admin/homepage',
    icon: Home,
  },
  {
    label: '網站設定',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    label: '最新消息',
    href: '/admin/news',
    icon: Newspaper,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedMenu, setExpandedMenu] = useState<string | null>('產品管理')

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 min-h-screen bg-[oklch(0.14_0.01_240)] border-r border-[oklch(0.22_0.02_240)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[oklch(0.22_0.02_240)]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[oklch(0.70_0.08_160)] flex items-center justify-center">
            <span className="text-lg font-bold text-[oklch(0.15_0.01_240)]">S</span>
          </div>
          <div>
            <h1 className="font-semibold text-[oklch(0.95_0.01_90)]">上弦生技</h1>
            <p className="text-xs text-[oklch(0.55_0.01_240)]">後台管理</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon

          if (item.children) {
            const isExpanded = expandedMenu === item.label
            const hasActiveChild = item.children.some((child) => isActive(child.href))

            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    hasActiveChild
                      ? 'bg-[oklch(0.70_0.08_160)/0.15] text-[oklch(0.70_0.08_160)]'
                      : 'text-[oklch(0.70_0.01_240)] hover:bg-[oklch(0.20_0.01_240)] hover:text-[oklch(0.90_0.01_90)]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(child.href)
                            ? 'bg-[oklch(0.70_0.08_160)/0.15] text-[oklch(0.70_0.08_160)]'
                            : 'text-[oklch(0.60_0.01_240)] hover:bg-[oklch(0.20_0.01_240)] hover:text-[oklch(0.90_0.01_90)]'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(item.href!)
                  ? 'bg-[oklch(0.70_0.08_160)/0.15] text-[oklch(0.70_0.08_160)]'
                  : 'text-[oklch(0.70_0.01_240)] hover:bg-[oklch(0.20_0.01_240)] hover:text-[oklch(0.90_0.01_90)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[oklch(0.22_0.02_240)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[oklch(0.70_0.01_240)] hover:bg-[oklch(0.20_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          登出
        </button>
      </div>
    </aside>
  )
}
