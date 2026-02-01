import { NextResponse } from 'next/server'
import { getAllProductsGrouped, getProductsByCategory } from '@/lib/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (category) {
      const products = await getProductsByCategory(category)
      return NextResponse.json({ success: true, data: products })
    }

    const grouped = await getAllProductsGrouped()
    return NextResponse.json({ success: true, data: grouped })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ success: false, message: '無法取得產品資料' }, { status: 500 })
  }
}
