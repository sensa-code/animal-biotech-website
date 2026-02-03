'use client'

import { useState, useEffect } from 'react'
import { Loader2, GripVertical, Save, Star, ArrowUp, ArrowDown } from 'lucide-react'

interface FeaturedProduct {
  id: number
  product_id: number
  sort_order: number
  products: {
    id: number
    name: string
    model: string | null
    image: string | null
    product_categories: {
      title: string
    }
  }
}

export default function FeaturedPage() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/admin/featured')
      const data = await res.json()
      if (data.success) {
        setFeatured(data.data)
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= featured.length) return

    const newFeatured = [...featured]
    const [item] = newFeatured.splice(index, 1)
    newFeatured.splice(newIndex, 0, item)

    // Update sort_order values
    newFeatured.forEach((item, i) => {
      item.sort_order = i + 1
    })

    setFeatured(newFeatured)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = featured.map(item => ({
        id: item.id,
        sort_order: item.sort_order,
      }))

      const res = await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: updates }),
      })
      const data = await res.json()

      if (data.success) {
        setHasChanges(false)
        alert('排序已儲存')
      } else {
        alert(data.message || '儲存失敗')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.70_0.08_160)]" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">主打產品排序</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">
            調整首頁主打產品的顯示順序
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            儲存排序
          </button>
        )}
      </div>

      {featured.length === 0 ? (
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-12 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-[oklch(0.40_0.01_240)]" />
          <p className="text-[oklch(0.55_0.01_240)]">尚無主打產品</p>
          <p className="text-[oklch(0.45_0.01_240)] text-sm mt-2">
            請在產品管理中將產品設為主打產品
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {featured.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-4 hover:border-[oklch(0.30_0.02_240)] transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[oklch(0.24_0.01_240)] text-[oklch(0.60_0.01_240)] font-medium">
                {index + 1}
              </div>

              <GripVertical className="w-5 h-5 text-[oklch(0.40_0.01_240)]" />

              {item.products.image ? (
                <img
                  src={item.products.image}
                  alt={item.products.name}
                  className="w-16 h-16 rounded-lg object-cover bg-[oklch(0.20_0.01_240)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[oklch(0.20_0.01_240)] flex items-center justify-center">
                  <span className="text-[oklch(0.45_0.01_240)] text-xs">無圖</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-[oklch(0.95_0.01_90)] truncate">
                  {item.products.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[oklch(0.70_0.08_160)/0.15] text-[oklch(0.70_0.08_160)]">
                    {item.products.product_categories.title}
                  </span>
                  {item.products.model && (
                    <span className="text-sm text-[oklch(0.55_0.01_240)]">
                      {item.products.model}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === featured.length - 1}
                  className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-[oklch(0.70_0.10_250)/0.1] border border-[oklch(0.70_0.10_250)/0.2]">
        <p className="text-sm text-[oklch(0.70_0.10_250)]">
          <strong>提示：</strong> 使用上下箭頭調整產品順序，完成後點擊「儲存排序」按鈕。
          如需新增或移除主打產品，請前往產品管理編輯產品的「主打產品」選項。
        </p>
      </div>
    </div>
  )
}
