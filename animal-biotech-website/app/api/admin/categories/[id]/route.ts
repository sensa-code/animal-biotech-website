import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/admin-queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const { id } = await params
    const category = await getCategoryById(parseInt(id))

    if (!category) {
      return NextResponse.json(
        { success: false, message: '分類不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, message: '取得分類失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const { id } = await params
    const body = await request.json()

    const category = await updateCategory(parseInt(id), body)
    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, message: '更新分類失敗' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const { id } = await params
    await deleteCategory(parseInt(id))
    return NextResponse.json({ success: true, message: '分類已刪除' })
  } catch (error) {
    console.error('Error deleting category:', error)
    const message = error instanceof Error ? error.message : '刪除分類失敗'
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
