import { NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/admin-queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')

    const products = await getProducts(categoryId ? parseInt(categoryId) : undefined)
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: '取得產品失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { category_id, slug, name, model, description, features, specs, image, is_highlighted, sort_order, is_active } = body

    if (!category_id || !slug || !name) {
      return NextResponse.json(
        { success: false, message: '分類、代碼和名稱為必填' },
        { status: 400 }
      )
    }

    const product = await createProduct({
      category_id,
      slug,
      name,
      model,
      description,
      features,
      specs,
      image,
      is_highlighted,
      sort_order,
      is_active,
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: '新增產品失敗' },
      { status: 500 }
    )
  }
}
