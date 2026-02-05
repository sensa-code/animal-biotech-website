'use client'

import { useState, useCallback } from 'react'
import { TraceSearchForm } from '@/components/trace/trace-search-form'
import { TraceResultCard } from '@/components/trace/trace-result-card'

interface VerifyResult {
  success: boolean
  verified: boolean
  message?: string
  data?: {
    product_code: string
    product_name: string
    hospital_name: string
    purchase_date: string
  }
}

export function TraceClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [searchedCode, setSearchedCode] = useState('')

  const handleSearch = useCallback(async (code: string) => {
    setIsLoading(true)
    setSearchedCode(code)
    setResult(null)

    try {
      const response = await fetch(`/api/trace/verify/${encodeURIComponent(code)}`)
      const data: VerifyResult = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error verifying product:', error)
      setResult({
        success: false,
        verified: false,
        message: '查詢失敗，請稍後再試',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div>
      <TraceSearchForm onSearch={handleSearch} isLoading={isLoading} />

      {result && (
        <TraceResultCard
          verified={result.verified}
          data={result.data}
          searchedCode={searchedCode}
        />
      )}
    </div>
  )
}
