import { NextResponse } from 'next/server'
import { getAllProductsGrouped, getProductsByCategory } from '@/lib/queries'
import { defaultProductCategories } from '@/lib/defaults'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (category) {
      const products = await getProductsByCategory(category)
      // Fallback: 如果 DB 沒資料，從預設資料中找
      if (!products || products.length === 0) {
        const fallbackCat = defaultProductCategories.find((c) => c.id === category)
        if (fallbackCat) {
          return NextResponse.json({ success: true, data: fallbackCat.products })
        }
      }
      return NextResponse.json({ success: true, data: products })
    }

    const grouped = await getAllProductsGrouped()
    // Fallback: 如果 DB 沒資料，使用預設分類
    if (!grouped || Object.keys(grouped).length === 0) {
      const fallbackGrouped: Record<string, { category: { id: string; slug: string; icon_name: string; title: string; subtitle: string; description: string }; products: typeof defaultProductCategories[0]['products'] }> = {}
      for (const cat of defaultProductCategories) {
        fallbackGrouped[cat.id] = {
          category: {
            id: cat.id,
            slug: cat.id,
            icon_name: cat.icon_name,
            title: cat.title,
            subtitle: cat.subtitle,
            description: cat.description,
          },
          products: cat.products,
        }
      }
      return NextResponse.json({ success: true, data: fallbackGrouped })
    }
    return NextResponse.json({ success: true, data: grouped })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ success: false, message: '無法取得產品資料' }, { status: 500 })
  }
}
