'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email 或密碼錯誤')
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }

      // Successful login - redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch {
      setError('登入失敗，請稍後再試')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.12_0.01_240)]">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.20_0.02_240)] mb-4">
            <Lock className="w-8 h-8 text-[oklch(0.70_0.08_160)]" />
          </div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">
            後台管理系統
          </h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-2">
            上弦動物生技
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-[oklch(0.30_0.10_25)] border border-[oklch(0.50_0.15_25)] text-[oklch(0.90_0.05_25)]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@senbio.tech"
                required
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[oklch(0.18_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              密碼
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[oklch(0.18_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                登入中...
              </>
            ) : (
              '登入'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[oklch(0.50_0.01_240)]">
          如需帳號，請聯繫系統管理員
        </p>
      </div>
    </div>
  )
}
