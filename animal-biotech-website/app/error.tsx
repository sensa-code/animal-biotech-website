'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          頁面載入發生錯誤
        </h2>
        <p className="text-muted-foreground mb-6">
          很抱歉，頁面載入時發生了問題。請重新整理頁面或稍後再試。
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          重新整理
        </button>
      </div>
    </div>
  )
}
