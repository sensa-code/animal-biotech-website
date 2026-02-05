'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ParsedRecord {
  product_code: string
  product_name: string
  hospital_name: string
  purchase_date: string
}

export default function BatchImportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<ParsedRecord[]>([])
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState<{
    success: boolean
    inserted: number
    skipped: number
    message: string
  } | null>(null)

  const parseCSV = useCallback((text: string): ParsedRecord[] => {
    const lines = text.trim().split('\n')
    const parsed: ParsedRecord[] = []

    // 跳過標題行
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''))

      if (parts.length >= 4) {
        parsed.push({
          product_code: parts[0],
          product_name: parts[1],
          hospital_name: parts[2],
          purchase_date: parts[3],
        })
      }
    }

    return parsed
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const parsed = parseCSV(text)
      setRecords(parsed)
    }
    reader.readAsText(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (!file) return

      if (!file.name.endsWith('.csv')) {
        toast({
          title: '格式錯誤',
          description: '請上傳 CSV 檔案',
          variant: 'destructive',
        })
        return
      }

      setFileName(file.name)
      setResult(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const parsed = parseCSV(text)
        setRecords(parsed)
      }
      reader.readAsText(file)
    },
    [parseCSV, toast]
  )

  const handleSubmit = async () => {
    if (records.length === 0) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/traceability/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      })

      const data = await res.json()

      setResult({
        success: data.success,
        inserted: data.inserted || 0,
        skipped: data.skipped || 0,
        message: data.message,
      })

      if (data.success) {
        toast({
          title: '匯入完成',
          description: data.message,
        })
      } else {
        toast({
          title: '匯入失敗',
          description: data.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error importing records:', error)
      toast({
        title: '匯入失敗',
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
        <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">批次匯入</h1>
        <p className="text-[oklch(0.60_0.01_240)] mt-1">
          上傳 CSV 檔案批次新增溯源記錄
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-[oklch(0.30_0.02_240)] rounded-xl p-8 text-center hover:border-[oklch(0.70_0.08_160)] transition-colors cursor-pointer"
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-[oklch(0.50_0.01_240)] mb-4" />
            <p className="text-[oklch(0.80_0.01_90)] mb-2">
              拖曳 CSV 檔案到此處，或點擊選擇檔案
            </p>
            <p className="text-sm text-[oklch(0.55_0.01_240)]">
              CSV 格式：產品編碼, 產品名稱, 購買醫院, 出貨日期
            </p>
          </label>
        </div>

        {/* File Info */}
        {fileName && (
          <div className="flex items-center gap-3 p-4 bg-[oklch(0.16_0.01_240)] rounded-lg border border-[oklch(0.22_0.02_240)]">
            <FileText className="w-5 h-5 text-[oklch(0.70_0.08_160)]" />
            <div className="flex-1">
              <p className="text-[oklch(0.90_0.01_90)] font-medium">{fileName}</p>
              <p className="text-sm text-[oklch(0.55_0.01_240)]">
                解析到 {records.length} 筆記錄
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        {records.length > 0 && (
          <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
            <div className="p-4 border-b border-[oklch(0.22_0.02_240)]">
              <h3 className="font-medium text-[oklch(0.90_0.01_90)]">預覽（前 10 筆）</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[oklch(0.22_0.02_240)]">
                    <th className="text-left px-4 py-3 text-xs font-medium text-[oklch(0.65_0.01_240)]">
                      編碼
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[oklch(0.65_0.01_240)]">
                      產品名稱
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[oklch(0.65_0.01_240)]">
                      醫院
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[oklch(0.65_0.01_240)]">
                      日期
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 10).map((record, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[oklch(0.20_0.02_240)] last:border-0"
                    >
                      <td className="px-4 py-2 font-mono text-sm text-[oklch(0.90_0.01_90)]">
                        {record.product_code}
                      </td>
                      <td className="px-4 py-2 text-sm text-[oklch(0.75_0.01_90)]">
                        {record.product_name}
                      </td>
                      <td className="px-4 py-2 text-sm text-[oklch(0.75_0.01_90)]">
                        {record.hospital_name}
                      </td>
                      <td className="px-4 py-2 text-sm text-[oklch(0.65_0.01_240)]">
                        {record.purchase_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {records.length > 10 && (
              <div className="p-3 text-center text-sm text-[oklch(0.55_0.01_240)] border-t border-[oklch(0.22_0.02_240)]">
                還有 {records.length - 10} 筆記錄...
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.success
                ? 'bg-emerald-950/30 border-emerald-800'
                : 'bg-red-950/30 border-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    result.success ? 'text-emerald-200' : 'text-red-200'
                  }`}
                >
                  {result.success ? '匯入完成' : '匯入失敗'}
                </p>
                <p
                  className={`text-sm ${
                    result.success ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading || records.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                匯入中...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                開始匯入
              </>
            )}
          </button>
          <Link
            href="/admin/traceability"
            className="px-6 py-3 rounded-lg border border-[oklch(0.30_0.02_240)] hover:bg-[oklch(0.20_0.01_240)] text-[oklch(0.80_0.01_90)] transition-colors"
          >
            取消
          </Link>
        </div>

        {/* Format Guide */}
        <div className="p-4 bg-[oklch(0.14_0.01_240)] rounded-lg border border-[oklch(0.20_0.02_240)]">
          <h4 className="text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">CSV 格式說明</h4>
          <p className="text-sm text-[oklch(0.55_0.01_240)] mb-3">
            CSV 檔案需包含以下欄位（第一行為標題）：
          </p>
          <code className="block p-3 bg-[oklch(0.12_0.01_240)] rounded text-xs text-[oklch(0.70_0.01_90)] font-mono">
            產品編碼,產品名稱,購買醫院,出貨日期
            <br />
            T501601,動物專用顯影安全氣管插管,上弦動物醫院,2025-12-18
            <br />
            T501602,動物專用顯影安全氣管插管,板橋上弦動物醫院,2025-12-18
          </code>
        </div>
      </div>
    </div>
  )
}
