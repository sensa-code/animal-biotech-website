'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.12_0.01_240)]">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.25_0.10_25)] mb-4">
          <AlertTriangle className="w-8 h-8 text-[oklch(0.70_0.15_25)]" />
        </div>
        <h2 className="text-2xl font-bold text-[oklch(0.95_0.01_90)] mb-4">
          後台載入發生錯誤
        </h2>
        <p className="text-[oklch(0.60_0.01_240)] mb-6">
          {error.message || '頁面載入時發生了問題，請重新整理或聯繫技術支援。'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[oklch(0.70_0.08_160)] text-[oklch(0.15_0.01_240)] rounded-lg font-medium hover:bg-[oklch(0.65_0.08_160)] transition-colors"
        >
          重新整理
        </button>
      </div>
    </div>
  )
}
