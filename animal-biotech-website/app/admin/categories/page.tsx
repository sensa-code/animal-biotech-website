'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import { CategoryListSkeleton } from '@/components/admin/loading-skeleton'

interface Category {
  id: number
  slug: string
  title: string
  description: string | null
  icon: string | null
  sort_order: number
  products_count?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    category: Category | null
  }>({ open: false, category: null })

  const { toast } = useToast()

  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: '',
    sort_order: 0,
  })

  const [newForm, setNewForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: '',
    sort_order: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: '載入失敗',
        description: '無法載入分類資料',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

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

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditForm({
      title: category.title,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      sort_order: category.sort_order,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: '', slug: '', description: '', icon: '', sort_order: 0 })
  }

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) {
      toast({
        title: '請填寫必要欄位',
        description: '分類名稱為必填項目',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()

      if (data.success) {
        setCategories(categories.map(c =>
          c.id === editingId ? { ...c, ...editForm } : c
        ))
        cancelEdit()
        toast({
          title: '儲存成功',
          description: '分類資料已更新',
        })
      } else {
        toast({
          title: '儲存失敗',
          description: data.message || '無法儲存分類資料',
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

  const handleDeleteClick = (category: Category) => {
    if (category.products_count && category.products_count > 0) {
      toast({
        title: '無法刪除',
        description: `此分類下有 ${category.products_count} 個產品，請先移除或重新分類這些產品`,
        variant: 'destructive',
      })
      return
    }
    setDeleteDialog({ open: true, category })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.category) return

    const id = deleteDialog.category.id
    setDeleting(id)

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setCategories(categories.filter(c => c.id !== id))
        toast({
          title: '刪除成功',
          description: `已成功刪除分類「${deleteDialog.category.title}」`,
        })
      } else {
        toast({
          title: '刪除失敗',
          description: data.message || '無法刪除分類',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: '刪除失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleCreateNew = async () => {
    if (!newForm.title.trim()) {
      toast({
        title: '請填寫必要欄位',
        description: '分類名稱為必填項目',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newForm,
          slug: newForm.slug || generateSlug(newForm.title),
        }),
      })
      const data = await res.json()

      if (data.success) {
        setCategories([...categories, data.data])
        setShowNewForm(false)
        setNewForm({ title: '', slug: '', description: '', icon: '', sort_order: 0 })
        toast({
          title: '新增成功',
          description: `已成功新增分類「${newForm.title}」`,
        })
      } else {
        toast({
          title: '新增失敗',
          description: data.message || '無法新增分類',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Create error:', error)
      toast({
        title: '新增失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">分類管理</h1>
            <p className="text-[oklch(0.60_0.01_240)] mt-1">載入中...</p>
          </div>
        </div>
        <CategoryListSkeleton />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">分類管理</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">
            共 {categories.length} 個分類
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增分類
        </button>
      </div>

      {/* New Category Form */}
      {showNewForm && (
        <div className="mb-6 rounded-xl bg-[oklch(0.18_0.01_240)] border border-[oklch(0.30_0.02_240)] p-6">
          <h3 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">新增分類</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                分類名稱 <span className="text-[oklch(0.70_0.15_25)]">*</span>
              </label>
              <input
                type="text"
                value={newForm.title}
                onChange={(e) => setNewForm(prev => ({
                  ...prev,
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：診斷設備"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                網址代稱 (Slug)
              </label>
              <input
                type="text"
                value={newForm.slug}
                onChange={(e) => setNewForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="auto-generated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                圖示 (Lucide icon name)
              </label>
              <input
                type="text"
                value={newForm.icon}
                onChange={(e) => setNewForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
                placeholder="例：stethoscope"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                排序順序
              </label>
              <input
                type="number"
                value={newForm.sort_order}
                onChange={(e) => setNewForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[oklch(0.70_0.01_240)] mb-2">
                描述
              </label>
              <textarea
                value={newForm.description}
                onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none resize-none"
                placeholder="分類描述..."
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setShowNewForm(false)
                setNewForm({ title: '', slug: '', description: '', icon: '', sort_order: 0 })
              }}
              className="px-4 py-2 rounded-lg border border-[oklch(0.30_0.02_240)] text-[oklch(0.80_0.01_90)] hover:bg-[oklch(0.20_0.01_240)] transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleCreateNew}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              新增
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[oklch(0.22_0.02_240)]">
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                分類名稱
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                Slug
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                描述
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                排序
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[oklch(0.55_0.01_240)]">
                  尚無分類
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-[oklch(0.20_0.02_240)] last:border-0 hover:bg-[oklch(0.18_0.01_240)]"
                >
                  {editingId === category.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.slug}
                          onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          value={editForm.sort_order}
                          onChange={(e) => setEditForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                          className="w-16 px-3 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none text-sm text-center"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="p-2 rounded-lg hover:bg-[oklch(0.50_0.15_145)/0.15] text-[oklch(0.70_0.08_160)] hover:text-[oklch(0.80_0.08_160)] transition-colors disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[oklch(0.95_0.01_90)]">{category.title}</p>
                      </td>
                      <td className="px-6 py-4 text-[oklch(0.55_0.01_240)]">{category.slug}</td>
                      <td className="px-6 py-4 text-[oklch(0.70_0.01_240)]">
                        {category.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-[oklch(0.70_0.01_240)]">
                        {category.sort_order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(category)}
                            className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
                            title="編輯分類"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            disabled={deleting === category.id}
                            className="p-2 rounded-lg hover:bg-[oklch(0.40_0.15_25)/0.15] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.70_0.15_25)] transition-colors disabled:opacity-50"
                            title="刪除分類"
                          >
                            {deleting === category.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, category: open ? deleteDialog.category : null })}
        title="確定要刪除此分類？"
        description="刪除後將無法恢復，請確認是否要繼續。"
        itemName={deleteDialog.category?.title}
        confirmText="確認刪除"
        variant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
