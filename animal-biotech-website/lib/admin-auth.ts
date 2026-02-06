import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * 驗證 Admin API 請求的身份。
 * 每個 admin API route handler 都應在處理請求前呼叫此函式，
 * 作為縱深防禦（defense-in-depth），不僅依賴 middleware。
 *
 * @returns user 物件（驗證通過）或 NextResponse 401（驗證失敗）
 */
export async function requireAdmin(): Promise<
  | { authenticated: true; user: { id: string; email?: string } }
  | { authenticated: false; response: NextResponse }
> {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server Component context - ignore
            }
          },
        },
      }
    )

    // 使用 getUser() 而非 getSession()，確保 JWT 經過伺服器端驗證
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { success: false, message: '未授權存取，請先登入' },
          { status: 401 }
        ),
      }
    }

    return { authenticated: true, user: { id: user.id, email: user.email } }
  } catch {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, message: '身份驗證失敗' },
        { status: 401 }
      ),
    }
  }
}
