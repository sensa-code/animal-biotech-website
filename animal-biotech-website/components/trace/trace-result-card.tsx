'use client'

import { CheckCircle, XCircle, Package, Building2, Calendar } from 'lucide-react'

interface VerifiedData {
  product_code: string
  product_name: string
  hospital_name: string
  purchase_date: string
}

interface TraceResultCardProps {
  verified: boolean
  data?: VerifiedData
  searchedCode?: string
}

export function TraceResultCard({ verified, data, searchedCode }: TraceResultCardProps) {
  if (verified && data) {
    return (
      <div className="w-full max-w-xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                驗證成功
              </h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                此產品為上弦動物生技正品
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg">
              <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">產品編碼</p>
                <p className="font-mono font-medium text-emerald-900 dark:text-emerald-100">
                  {data.product_code}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg">
              <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">產品名稱</p>
                <p className="font-medium text-emerald-900 dark:text-emerald-100">
                  {data.product_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">購買醫院</p>
                <p className="font-medium text-emerald-900 dark:text-emerald-100">
                  {data.hospital_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">出貨日期</p>
                <p className="font-medium text-emerald-900 dark:text-emerald-100">
                  {new Date(data.purchase_date).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              查無此編碼
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              找不到產品編碼「{searchedCode}」的相關記錄
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/60 dark:bg-white/5 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">
            請確認：
          </p>
          <ul className="mt-2 text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
            <li>產品編碼是否輸入正確</li>
            <li>產品是否為上弦動物生技出品</li>
            <li>如有疑問，請聯繫我們進行查詢</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
