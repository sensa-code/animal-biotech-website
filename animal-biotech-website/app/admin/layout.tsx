import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata = {
  title: '後台管理 | 上弦動物生技',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 檢查使用者是否已登入
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 未登入時，只渲染 children（登入頁面會自帶全螢幕 layout）
  if (!user) {
    return <>{children}</>
  }

  // 已登入時，顯示完整後台 layout
  return (
    <div className="flex min-h-screen bg-[oklch(0.12_0.01_240)]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
