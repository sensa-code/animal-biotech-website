import { NextResponse } from 'next/server'
import { getFeaturedProducts } from '@/lib/queries'

export async function GET() {
  try {
    const featured = await getFeaturedProducts()
    return NextResponse.json({ success: true, data: featured })
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return NextResponse.json({ success: false, message: '無法取得主打產品' }, { status: 500 })
  }
}
