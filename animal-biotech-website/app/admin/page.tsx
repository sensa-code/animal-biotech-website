import { createAdminClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Package, FolderTree, Newspaper, MessageSquare } from 'lucide-react'

async function getStats() {
  const supabase = await createAdminClient()

  // Get counts using the website schema (already configured in createAdminClient)
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: categoriesCount } = await supabase
    .from('product_categories')
    .select('*', { count: 'exact', head: true })

  const { count: newsCount } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })

  const { count: contactsCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  return {
    products: productsCount || 0,
    categories: categoriesCount || 0,
    news: newsCount || 0,
    unreadContacts: contactsCount || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: '產品數量',
      value: stats.products,
      icon: Package,
      color: 'oklch(0.70 0.08 160)',
      href: '/admin/products',
    },
    {
      title: '產品分類',
      value: stats.categories,
      icon: FolderTree,
      color: 'oklch(0.70 0.10 250)',
      href: '/admin/categories',
    },
    {
      title: '最新消息',
      value: stats.news,
      icon: Newspaper,
      color: 'oklch(0.70 0.10 50)',
      href: '/admin/news',
    },
    {
      title: '未讀詢問',
      value: stats.unreadContacts,
      icon: MessageSquare,
      color: 'oklch(0.70 0.12 25)',
      href: '/admin/contacts',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">
          儀表板
        </h1>
        <p className="text-[oklch(0.60_0.01_240)] mt-1">
          歡迎回來，這是您的網站概覽
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="block p-6 rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] hover:border-[oklch(0.30_0.02_240)] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-[oklch(0.95_0.01_90)]">
                {card.value}
              </p>
              <p className="text-sm text-[oklch(0.60_0.01_240)] mt-1">
                {card.title}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
        <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">
          快速操作
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.20_0.01_240)] hover:bg-[oklch(0.24_0.01_240)] transition-colors"
          >
            <Package className="w-5 h-5 text-[oklch(0.70_0.08_160)]" />
            <span className="text-sm text-[oklch(0.85_0.01_90)]">新增產品</span>
          </Link>
          <Link
            href="/admin/news/new"
            className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.20_0.01_240)] hover:bg-[oklch(0.24_0.01_240)] transition-colors"
          >
            <Newspaper className="w-5 h-5 text-[oklch(0.70_0.10_50)]" />
            <span className="text-sm text-[oklch(0.85_0.01_90)]">發布消息</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.20_0.01_240)] hover:bg-[oklch(0.24_0.01_240)] transition-colors"
          >
            <FolderTree className="w-5 h-5 text-[oklch(0.70_0.10_250)]" />
            <span className="text-sm text-[oklch(0.85_0.01_90)]">編輯首頁</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.20_0.01_240)] hover:bg-[oklch(0.24_0.01_240)] transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-[oklch(0.70_0.12_25)]" />
            <span className="text-sm text-[oklch(0.85_0.01_90)]">網站設定</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
