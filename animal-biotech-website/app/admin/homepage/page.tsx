'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface HeroContent {
  id: number
  title: string
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  background_image: string | null
}

interface Stat {
  id: number
  value: string
  unit: string | null
  label: string
  sort_order: number
}

export default function HomepagePage() {
  const { toast } = useToast()
  const [hero, setHero] = useState<HeroContent | null>(null)
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [savingHero, setSavingHero] = useState(false)
  const [savingStats, setSavingStats] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    cta_text: '',
    cta_link: '',
    background_image: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/homepage')
      const data = await res.json()

      if (data.success) {
        if (data.data.hero) {
          const h = data.data.hero
          setHero(h)
          setHeroForm({
            title: h.title || '',
            subtitle: h.subtitle || '',
            cta_text: h.cta_text || '',
            cta_link: h.cta_link || '',
            background_image: h.background_image || '',
          })
        }
        if (data.data.stats) {
          setStats(data.data.stats)
        }
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'homepage')

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setHeroForm(prev => ({ ...prev, background_image: data.url }))
        toast({
          title: '上傳成功',
          description: '背景圖片已更新',
        })
      } else {
        toast({
          title: '上傳失敗',
          description: data.message || '請稍後再試',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: '上傳失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveHero = async () => {
    setSavingHero(true)
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hero',
          data: heroForm,
        }),
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: '儲存成功',
          description: 'Hero 大海報內容已更新',
        })
      } else {
        toast({
          title: '儲存失敗',
          description: data.message || '請稍後再試',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: '儲存失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setSavingHero(false)
    }
  }

  const handleStatChange = (index: number, field: keyof Stat, value: string | number) => {
    const newStats = [...stats]
    // @ts-ignore
    newStats[index][field] = value
    setStats(newStats)
  }

  const handleSaveStats = async () => {
    setSavingStats(true)
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'stats',
          data: stats.map(s => ({
            id: s.id,
            value: s.value,
            unit: s.unit,
            label: s.label,
            sort_order: s.sort_order,
          })),
        }),
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: '儲存成功',
          description: '統計數據已更新',
        })
      } else {
        toast({
          title: '儲存失敗',
          description: data.message || '請稍後再試',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: '儲存失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setSavingStats(false)
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
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">首頁內容編輯</h1>
        <p className="text-[oklch(0.60_0.01_240)] mt-1">
          編輯首頁的 Hero 區塊和統計數據
        </p>
      </div>

      {/* Hero Section */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)]">Hero 大海報</h2>
          <button
            onClick={handleSaveHero}
            disabled={savingHero}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
          >
            {savingHero ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            儲存
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
              主標題
            </label>
            <input
              type="text"
              value={heroForm.title}
              onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
              placeholder="例：專業動物醫療設備"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
              副標題
            </label>
            <textarea
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none resize-none"
              placeholder="例：提供最先進的診斷與治療設備"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                按鈕文字 (CTA)
              </label>
              <input
                type="text"
                value={heroForm.cta_text}
                onChange={(e) => setHeroForm(prev => ({ ...prev, cta_text: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：瀏覽產品"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                按鈕連結
              </label>
              <input
                type="text"
                value={heroForm.cta_link}
                onChange={(e) => setHeroForm(prev => ({ ...prev, cta_link: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：/products"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
              背景圖片
            </label>
            <div className="flex items-start gap-6">
              {heroForm.background_image ? (
                <div className="relative">
                  <img
                    src={heroForm.background_image}
                    alt="Hero background"
                    className="w-48 h-28 object-cover rounded-lg bg-[oklch(0.20_0.01_240)]"
                  />
                  <button
                    type="button"
                    onClick={() => setHeroForm(prev => ({ ...prev, background_image: '' }))}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-[oklch(0.40_0.15_25)] text-white hover:bg-[oklch(0.50_0.15_25)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-48 h-28 rounded-lg border-2 border-dashed border-[oklch(0.30_0.02_240)] flex flex-col items-center justify-center cursor-pointer hover:border-[oklch(0.70_0.08_160)] transition-colors">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[oklch(0.50_0.01_240)]" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-[oklch(0.50_0.01_240)] mb-1" />
                      <span className="text-xs text-[oklch(0.50_0.01_240)]">上傳背景</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
              <div className="text-sm text-[oklch(0.55_0.01_240)]">
                <p>建議尺寸: 1920 x 600 像素</p>
                <p>支援格式: JPG, PNG, WebP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)]">統計數據</h2>
          <button
            onClick={handleSaveStats}
            disabled={savingStats}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
          >
            {savingStats ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            儲存
          </button>
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="grid grid-cols-12 gap-4 p-4 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.20_0.02_240)]"
            >
              <div className="col-span-3">
                <label className="block text-xs font-medium text-[oklch(0.60_0.01_240)] mb-1">
                  數值
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm"
                  placeholder="30+"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[oklch(0.60_0.01_240)] mb-1">
                  單位
                </label>
                <input
                  type="text"
                  value={stat.unit || ''}
                  onChange={(e) => handleStatChange(index, 'unit', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm"
                  placeholder="年"
                />
              </div>
              <div className="col-span-5">
                <label className="block text-xs font-medium text-[oklch(0.60_0.01_240)] mb-1">
                  標籤
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm"
                  placeholder="專業經驗"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[oklch(0.60_0.01_240)] mb-1">
                  排序
                </label>
                <input
                  type="number"
                  value={stat.sort_order}
                  onChange={(e) => handleStatChange(index, 'sort_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm text-center"
                />
              </div>
            </div>
          ))}
        </div>

        {stats.length === 0 && (
          <div className="text-center py-8 text-[oklch(0.55_0.01_240)]">
            尚無統計數據
          </div>
        )}
      </div>
    </div>
  )
}
