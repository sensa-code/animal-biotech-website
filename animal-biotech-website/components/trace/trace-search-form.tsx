'use client'

import { useState, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TraceSearchFormProps {
  onSearch: (code: string) => Promise<void>
  isLoading: boolean
}

export function TraceSearchForm({ onSearch, isLoading }: TraceSearchFormProps) {
  const [code, setCode] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (code.trim()) {
        await onSearch(code.trim())
      }
    },
    [code, onSearch]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 自動轉大寫
    setCode(e.target.value.toUpperCase())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={code}
              onChange={handleInputChange}
              placeholder="請輸入產品編碼（如 T501603）"
              className="w-full pl-12 pr-4 py-4 text-lg bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              disabled={isLoading}
              autoComplete="off"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!code.trim() || isLoading}
            className="px-8 py-4 h-auto text-base bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                驗證中
              </>
            ) : (
              '立即驗證'
            )}
          </Button>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        產品編碼通常印製於產品包裝上，格式如 T501603
      </p>
    </form>
  )
}
