'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Loader2, Eye, EyeOff } from 'lucide-react'

interface NewsItem {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  image: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news')
      const data = await res.json()

      if (data.success) {
        setNews(data.data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除此消息嗎？')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setNews(news.filter((n) => n.id !== id))
      } else {
        alert(data.message || '刪除失敗')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('刪除失敗')
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublish = async (item: NewsItem) => {
    setToggling(item.id)
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_published: !item.is_published,
          published_at: !item.is_published ? new Date().toISOString() : item.published_at,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setNews(news.map((n) =>
          n.id === item.id
            ? { ...n, is_published: !n.is_published }
            : n
        ))
      } else {
        alert(data.message || '更新失敗')
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
      alert('更新失敗')
    } finally {
      setToggling(null)
    }
  }

  const filteredNews = news.filter((item) =>
    !search ||
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.70_0.08_160)]" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">最新消息</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">
            共 {filteredNews.length} 則消息
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增消息
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
          <input
            type="text"
            placeholder="搜尋標題或內容..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[oklch(0.22_0.02_240)]">
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                標題
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                摘要
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                狀態
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                發布日期
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[oklch(0.55_0.01_240)]">
                  {search ? '沒有符合條件的消息' : '尚無消息'}
                </td>
              </tr>
            ) : (
              filteredNews.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[oklch(0.20_0.02_240)] last:border-0 hover:bg-[oklch(0.18_0.01_240)]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-12 rounded-lg object-cover bg-[oklch(0.20_0.01_240)]"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-[oklch(0.20_0.01_240)] flex items-center justify-center">
                          <span className="text-[oklch(0.45_0.01_240)] text-xs">無圖</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[oklch(0.95_0.01_90)]">{item.title}</p>
                        <p className="text-xs text-[oklch(0.55_0.01_240)]">{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[oklch(0.70_0.01_240)] text-sm truncate">
                      {item.excerpt || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.is_published ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.50_0.15_145)/0.15] text-[oklch(0.70_0.15_145)]">
                        已發布
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.50_0.10_50)/0.15] text-[oklch(0.70_0.10_50)]">
                        草稿
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-[oklch(0.70_0.01_240)]">
                    {formatDate(item.published_at || item.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        disabled={toggling === item.id}
                        className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors disabled:opacity-50"
                        title={item.is_published ? '取消發布' : '發布'}
                      >
                        {toggling === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : item.is_published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href={`/admin/news/${item.id}`}
                        className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="p-2 rounded-lg hover:bg-[oklch(0.40_0.15_25)/0.15] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.70_0.15_25)] transition-colors disabled:opacity-50"
                      >
                        {deleting === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
