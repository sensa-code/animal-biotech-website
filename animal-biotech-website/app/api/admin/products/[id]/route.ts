import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getProductById, updateProduct, deleteProduct } from '@/lib/admin-queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const { id } = await params
    const product = await getProductById(parseInt(id))

    if (!product) {
      return NextResponse.json(
        { success: false, message: '產品不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, message: '取得產品失敗' },
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

    const product = await updateProduct(parseInt(id), body)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, message: '更新產品失敗' },
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
    await deleteProduct(parseInt(id))
    return NextResponse.json({ success: true, message: '產品已刪除' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: '刪除產品失敗' },
      { status: 500 }
    )
  }
}
