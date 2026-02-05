'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AuthCallbackHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have a recovery token in the hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')

      if (type === 'recovery' && accessToken) {
        // Redirect to reset password page with the hash
        router.push('/admin/reset-password' + window.location.hash)
      }
    }
  }, [router])

  return null
}
