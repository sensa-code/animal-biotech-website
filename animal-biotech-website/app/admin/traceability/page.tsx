'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Loader2, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import { useDebounce } from '@/hooks/use-debounce'

interface ProductRecord {
  id: number
  product_code: string
  product_name: string
  hospital_name: string
  purchase_date: string
  created_at: string
}

interface Pagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export default function TraceabilityPage() {
  const [records, setRecords] = useState<ProductRecord[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    record: ProductRecord | null
  }>({ open: false, record: null })

  const { toast } = useToast()
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    fetchData()
  }, [pagination.page, debouncedSearch])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.perPage.toString(),
      })
      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }

      const res = await fetch(`/api/admin/traceability?${params}`)
      const data = await res.json()

      if (data.success) {
        setRecords(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: '載入失敗',
        description: '無法載入溯源記錄',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (record: ProductRecord) => {
    setDeleteDialog({ open: true, record })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.record) return

    const id = deleteDialog.record.id
    setDeleting(id)

    try {
      const res = await fetch(`/api/admin/traceability/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setRecords(records.filter((r) => r.id !== id))
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }))
        toast({
          title: '刪除成功',
          description: `已刪除產品編碼「${deleteDialog.record.product_code}」`,
        })
      } else {
        toast({
          title: '刪除失敗',
          description: data.message || '無法刪除記錄',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting record:', error)
      toast({
        title: '刪除失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">溯源記錄</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">
            共 {pagination.total} 筆記錄
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/traceability/batch"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[oklch(0.30_0.02_240)] hover:bg-[oklch(0.20_0.01_240)] text-[oklch(0.80_0.01_90)] transition-colors"
          >
            <Upload className="w-5 h-5" />
            批次匯入
          </Link>
          <Link
            href="/admin/traceability/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            新增記錄
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
          <input
            type="text"
            placeholder="搜尋編碼、產品名稱或醫院..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[oklch(0.22_0.02_240)]">
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                產品編碼
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                產品名稱
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                購買醫院
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                出貨日期
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[oklch(0.55_0.01_240)]" />
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[oklch(0.55_0.01_240)]">
                  {search ? '沒有符合條件的記錄' : '尚無溯源記錄'}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[oklch(0.20_0.02_240)] last:border-0 hover:bg-[oklch(0.18_0.01_240)]"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-[oklch(0.95_0.01_90)]">
                      {record.product_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.80_0.01_90)]">
                    {record.product_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.70_0.08_160)/0.15] text-[oklch(0.70_0.08_160)]">
                      {record.hospital_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.70_0.01_240)]">
                    {new Date(record.purchase_date).toLocaleDateString('zh-TW')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/traceability/${record.id}`}
                        className="p-2 rounded-lg hover:bg-[oklch(0.24_0.01_240)] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors"
                        title="編輯"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(record)}
                        disabled={deleting === record.id}
                        className="p-2 rounded-lg hover:bg-[oklch(0.40_0.15_25)/0.15] text-[oklch(0.70_0.01_240)] hover:text-[oklch(0.70_0.15_25)] transition-colors disabled:opacity-50"
                        title="刪除"
                      >
                        {deleting === record.id ? (
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[oklch(0.55_0.01_240)]">
            第 {pagination.page} 頁，共 {pagination.totalPages} 頁
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-[oklch(0.25_0.02_240)] hover:bg-[oklch(0.20_0.01_240)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[oklch(0.70_0.01_240)]" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-[oklch(0.25_0.02_240)] hover:bg-[oklch(0.20_0.01_240)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[oklch(0.70_0.01_240)]" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, record: open ? deleteDialog.record : null })}
        title="確定要刪除此記錄？"
        description="刪除後將無法恢復，請確認是否要繼續。"
        itemName={deleteDialog.record?.product_code}
        confirmText="確認刪除"
        variant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
