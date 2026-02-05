'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewTraceabilityPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '動物專用顯影安全氣管插管',
    hospital_name: '',
    purchase_date: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'product_code' ? value.toUpperCase() : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/traceability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: '新增成功',
          description: `已新增產品編碼「${formData.product_code}」`,
        })
        router.push('/admin/traceability')
      } else {
        toast({
          title: '新增失敗',
          description: data.message || '無法新增記錄',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating record:', error)
      toast({
        title: '新增失敗',
        description: '發生錯誤，請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/traceability"
          className="inline-flex items-center gap-2 text-[oklch(0.60_0.01_240)] hover:text-[oklch(0.90_0.01_90)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
        <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">新增溯源記錄</h1>
        <p className="text-[oklch(0.60_0.01_240)] mt-1">
          新增單筆產品溯源記錄
        </p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              產品編碼 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="product_code"
              value={formData.product_code}
              onChange={handleChange}
              placeholder="如 T501985"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              產品名稱 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              購買醫院 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              placeholder="如 上弦動物醫院"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              出貨日期 <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.16_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  新增中...
                </>
              ) : (
                '新增記錄'
              )}
            </button>
            <Link
              href="/admin/traceability"
              className="px-6 py-3 rounded-lg border border-[oklch(0.30_0.02_240)] hover:bg-[oklch(0.20_0.01_240)] text-[oklch(0.80_0.01_90)] transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
