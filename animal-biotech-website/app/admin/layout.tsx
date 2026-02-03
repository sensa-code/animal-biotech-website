import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata = {
  title: '後台管理 | 上弦動物生技',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[oklch(0.12_0.01_240)]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
