'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'

interface Category {
  id: number
  slug: string
  title: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    model: '',
    description: '',
    image: '',
    category_id: '',
    is_active: true,
    is_highlighted: false,
    sort_order: 0,
    features: [''],
    specs: [{ key: '', value: '' }],
  })

  // Track form changes for unsaved changes detection
  const initialFormRef = useRef({
    name: '',
    slug: '',
    model: '',
    description: '',
    image: '',
    category_id: '',
    is_active: true,
    is_highlighted: false,
    sort_order: 0,
    features: [''],
    specs: [{ key: '', value: '' }],
  })

  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(initialFormRef.current)

  // Warn before leaving if has unsaved changes
  useUnsavedChanges(hasUnsavedChanges)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    // 先處理 ASCII 部分
    const asciiSlug = name
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    // 若結果為空或僅含中文字元，加入時間戳確保唯一性
    const stripped = asciiSlug.replace(/[\u4e00-\u9fff]/g, '').replace(/-+/g, '').trim()
    if (!stripped) {
      return `item-${Date.now().toString(36)}`
    }
    return asciiSlug.replace(/[\u4e00-\u9fff]+/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')  || `item-${Date.now().toString(36)}`
  }

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: '檔案過大',
        description: '圖片檔案大小不能超過 5MB',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '不支援的格式',
        description: '僅支援 JPG、PNG、WebP 格式的圖片',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'products')

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setForm(prev => ({ ...prev, image: data.data.url }))
        toast({
          title: '上傳成功',
          description: '圖片已上傳',
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

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...form.features]
    newFeatures[index] = value
    setForm(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index: number) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = form.specs.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    )
    setForm(prev => ({ ...prev, specs: newSpecs }))
  }

  const addSpec = () => {
    setForm(prev => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }))
  }

  const removeSpec = (index: number) => {
    setForm(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.category_id) {
      toast({
        title: '必填欄位未填寫',
        description: '請填寫產品名稱並選擇分類',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      // Convert specs array to object
      const specsObj: Record<string, string> = {}
      form.specs.forEach(spec => {
        if (spec.key.trim()) {
          specsObj[spec.key.trim()] = spec.value.trim()
        }
      })

      // Filter empty features
      const filteredFeatures = form.features.filter(f => f.trim())

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          category_id: parseInt(form.category_id),
          features: filteredFeatures,
          specs: specsObj,
        }),
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: '新增成功',
          description: `產品「${form.name}」已建立`,
        })
        router.push('/admin/products')
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
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">新增產品</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">建立新的產品資料</p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[oklch(0.50_0.15_50)/0.15] text-[oklch(0.80_0.15_50)]">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">有未儲存的變更</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
          <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">基本資訊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                產品名稱 *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：生化分析儀"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                網址代稱 (Slug)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="auto-generated"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                產品型號
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：BC-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                產品分類 *
              </label>
              <select
                value={form.category_id}
                onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
              >
                <option value="">請選擇分類</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                排序順序
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-[oklch(0.25_0.02_240)] bg-[oklch(0.12_0.01_240)] text-[oklch(0.70_0.08_160)] focus:ring-[oklch(0.70_0.08_160)]"
                />
                <span className="text-sm text-[oklch(0.80_0.01_90)]">啟用</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_highlighted}
                  onChange={(e) => setForm(prev => ({ ...prev, is_highlighted: e.target.checked }))}
                  className="w-4 h-4 rounded border-[oklch(0.25_0.02_240)] bg-[oklch(0.12_0.01_240)] text-[oklch(0.70_0.08_160)] focus:ring-[oklch(0.70_0.08_160)]"
                />
                <span className="text-sm text-[oklch(0.80_0.01_90)]">主打產品</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
              產品描述
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none resize-none"
              placeholder="請輸入產品描述..."
            />
          </div>
        </div>

        {/* Image */}
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
          <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">產品圖片</h2>

          <div className="flex items-start gap-6">
            {form.image ? (
              <div className="relative">
                <img
                  src={form.image}
                  alt="Product"
                  className="w-40 h-40 object-cover rounded-lg bg-[oklch(0.20_0.01_240)]"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-[oklch(0.40_0.15_25)] text-white hover:bg-[oklch(0.50_0.15_25)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-40 h-40 rounded-lg border-2 border-dashed border-[oklch(0.30_0.02_240)] flex flex-col items-center justify-center cursor-pointer hover:border-[oklch(0.70_0.08_160)] transition-colors">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.50_0.01_240)]" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[oklch(0.50_0.01_240)] mb-2" />
                    <span className="text-sm text-[oklch(0.50_0.01_240)]">上傳圖片</span>
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
              <p>建議尺寸: 800 x 600 像素</p>
              <p>支援格式: JPG, PNG, WebP</p>
              <p>檔案大小: 最大 5MB</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)]">產品特色</h2>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[oklch(0.24_0.01_240)] hover:bg-[oklch(0.28_0.01_240)] text-[oklch(0.80_0.01_90)] text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>

          <div className="space-y-3">
            {form.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                  placeholder="例：高精度檢測"
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 rounded-lg hover:bg-[oklch(0.40_0.15_25)/0.15] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.70_0.15_25)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)]">產品規格</h2>
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[oklch(0.24_0.01_240)] hover:bg-[oklch(0.28_0.01_240)] text-[oklch(0.80_0.01_90)] text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>

          <div className="space-y-3">
            {form.specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="w-1/3 px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                  placeholder="規格名稱"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                  placeholder="規格值"
                />
                {form.specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 rounded-lg hover:bg-[oklch(0.40_0.15_25)/0.15] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.70_0.15_25)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-lg border border-[oklch(0.30_0.02_240)] text-[oklch(0.80_0.01_90)] hover:bg-[oklch(0.20_0.01_240)] transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            儲存產品
          </button>
        </div>
      </form>
    </div>
  )
}
