'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'

interface Category {
  id: number
  slug: string
  title: string
}

interface Product {
  id: number
  slug: string
  name: string
  model: string | null
  description: string | null
  image: string | null
  is_active: boolean
  is_highlighted: boolean
  sort_order: number
  product_categories: Category
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      if (productsData.success) setProducts(productsData.data)
      if (categoriesData.success) setCategories(categoriesData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除此產品嗎？')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert(data.message || '刪除失敗')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('刪除失敗')
    } finally {
      setDeleting(null)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.model?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      !categoryFilter || product.product_categories.id === parseInt(categoryFilter)

    return matchesSearch && matchesCategory
  })

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
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">產品列表</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">
            共 {filteredProducts.length} 個產品
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增產品
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
          <input
            type="text"
            placeholder="搜尋產品名稱或型號..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
        >
          <option value="">所有分類</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[oklch(0.22_0.02_240)]">
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                產品
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                分類
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                型號
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                狀態
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[oklch(0.55_0.01_240)]">
                  {search || categoryFilter ? '沒有符合條件的產品' : '尚無產品'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[oklch(0.20_0.02_240)] last:border-0 hover:bg-[oklch(0.18_0.01_240)]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[oklch(0.20_0.01_240)]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[oklch(0.20_0.01_240)] flex items-center justify-center">
                          <span className="text-[oklch(0.45_0.01_240)] text-xs">無圖</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[oklch(0.95_0.01_90)]">{product.name}</p>
                        <p className="text-sm text-[oklch(0.55_0.01_240)]">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.70_0.08_160)/0.15] text-[oklch(0.70_0.08_160)]">
                      {product.product_categories.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.80_0.01_90)]">
                    {product.model || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.is_active ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.50_0.15_145)/0.15] text-[oklch(0.70_0.15_145)]">
                        啟用
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.50_0.01_240)/0.15] text-[oklch(0.55_0.01_240)]">
                        停用
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="p-2 rounded-lg hover:bg-[oklch(0.40_0.15_25)/0.15] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.70_0.15_25)] transition-colors disabled:opacity-50"
                      >
                        {deleting === product.id ? (
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
