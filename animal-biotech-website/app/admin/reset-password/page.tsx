'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      const supabase = createClient()

      // Handle the hash fragment from Supabase recovery URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      if (type === 'recovery' && accessToken && refreshToken) {
        // Set the session from the recovery tokens
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          setError('密碼重設連結無效或已過期')
          setChecking(false)
          return
        }

        setHasSession(true)
        setChecking(false)
        // Clear the hash to prevent re-processing
        window.history.replaceState(null, '', window.location.pathname)
        return
      }

      // Check if there's an existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setHasSession(true)
      } else {
        setError('請透過密碼重設信件中的連結進入此頁面')
      }
      setChecking(false)
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords
    if (password.length < 6) {
      setError('密碼長度至少需要 6 個字元')
      return
    }

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)

      // Redirect to admin after 2 seconds
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch {
      setError('密碼更新失敗，請稍後再試')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.12_0.01_240)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[oklch(0.70_0.08_160)]" />
          <p className="mt-4 text-[oklch(0.60_0.01_240)]">驗證中...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.12_0.01_240)]">
        <div className="w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.25_0.10_160)] mb-4">
            <CheckCircle className="w-8 h-8 text-[oklch(0.70_0.15_160)]" />
          </div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">
            密碼已更新
          </h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-2">
            正在導向後台管理頁面...
          </p>
        </div>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.12_0.01_240)]">
        <div className="w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.25_0.10_25)] mb-4">
            <AlertCircle className="w-8 h-8 text-[oklch(0.70_0.15_25)]" />
          </div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">
            連結無效
          </h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-2">
            {error || '請透過密碼重設信件中的連結進入此頁面'}
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="mt-6 px-6 py-3 rounded-lg bg-[oklch(0.20_0.02_240)] hover:bg-[oklch(0.25_0.02_240)] text-[oklch(0.80_0.01_90)] font-medium transition-colors"
          >
            返回登入頁面
          </button>
        </div>
      </div>
    )
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
            重設密碼
          </h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-2">
            請輸入您的新密碼
          </p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-[oklch(0.30_0.10_25)] border border-[oklch(0.50_0.15_25)] text-[oklch(0.90_0.05_25)]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              新密碼
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 個字元"
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[oklch(0.18_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-2">
              確認新密碼
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.50_0.01_240)]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次輸入新密碼"
                required
                minLength={6}
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
                更新中...
              </>
            ) : (
              '更新密碼'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
