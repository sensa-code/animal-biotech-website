'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Upload, X, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'

export default function NewNewsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    is_published: false,
  })

  // Track form changes for unsaved changes detection
  const initialFormRef = useRef({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    is_published: false,
  })

  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(initialFormRef.current)

  // Warn before leaving if has unsaved changes
  useUnsavedChanges(hasUnsavedChanges)

  const generateSlug = (title: string) => {
    // 先處理 ASCII 部分
    const asciiSlug = title
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

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '不支援的格式',
        description: '僅支援 JPG、PNG、GIF、WebP 格式的圖片',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'news')

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setForm(prev => ({ ...prev, image: data.url }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim()) {
      toast({
        title: '請填寫標題',
        description: '消息標題為必填欄位',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          published_at: form.is_published ? new Date().toISOString() : null,
        }),
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: '儲存成功',
          description: '消息已建立',
        })
        router.push('/admin/news')
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

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/news"
          className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">新增消息</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">建立新的消息文章</p>
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                標題 *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：公司參展消息"
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
                摘要
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none resize-none"
                placeholder="簡短描述此消息..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                內容
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none resize-none"
                placeholder="消息內容..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={(e) => setForm(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 rounded border-[oklch(0.25_0.02_240)] bg-[oklch(0.12_0.01_240)] text-[oklch(0.70_0.08_160)] focus:ring-[oklch(0.70_0.08_160)]"
              />
              <label htmlFor="is_published" className="text-sm text-[oklch(0.80_0.01_90)] cursor-pointer">
                立即發布
              </label>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
          <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">封面圖片</h2>

          <div className="flex items-start gap-6">
            {form.image ? (
              <div className="relative">
                <img
                  src={form.image}
                  alt="News cover"
                  className="w-48 h-32 object-cover rounded-lg bg-[oklch(0.20_0.01_240)]"
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
              <label className="w-48 h-32 rounded-lg border-2 border-dashed border-[oklch(0.30_0.02_240)] flex flex-col items-center justify-center cursor-pointer hover:border-[oklch(0.70_0.08_160)] transition-colors">
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
              <p>建議尺寸: 800 x 450 像素</p>
              <p>支援格式: JPG, PNG, WebP</p>
              <p>檔案大小: 最大 5MB</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/news"
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
            儲存消息
          </button>
        </div>
      </form>
    </div>
  )
}
