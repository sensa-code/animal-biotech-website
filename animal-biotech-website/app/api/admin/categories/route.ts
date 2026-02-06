import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getCategories, createCategory } from '@/lib/admin-queries'

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const categories = await getCategories()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, message: '取得分類失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const body = await request.json()
    const { slug, icon_name, title, subtitle, description, hero_image, sort_order, is_active } = body

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, message: '代碼和標題為必填' },
        { status: 400 }
      )
    }

    const category = await createCategory({
      slug,
      icon_name,
      title,
      subtitle,
      description,
      hero_image,
      sort_order,
      is_active,
    })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, message: '新增分類失敗' },
      { status: 500 }
    )
  }
}
