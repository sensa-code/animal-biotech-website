import { NextResponse } from 'next/server'
import { getProductCategories } from '@/lib/queries'

export async function GET() {
  try {
    const categories = await getProductCategories()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ success: false, message: '無法取得產品分類' }, { status: 500 })
  }
}
