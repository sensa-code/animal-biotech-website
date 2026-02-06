import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getFeaturedProducts, updateFeaturedProducts } from '@/lib/admin-queries'

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const featured = await getFeaturedProducts()
    return NextResponse.json({ success: true, data: featured })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { success: false, message: '取得主打產品失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const body = await request.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: '無效的資料格式' },
        { status: 400 }
      )
    }

    const featured = await updateFeaturedProducts(items)
    return NextResponse.json({ success: true, data: featured })
  } catch (error) {
    console.error('Error updating featured products:', error)
    return NextResponse.json(
      { success: false, message: '更新主打產品失敗' },
      { status: 500 }
    )
  }
}
