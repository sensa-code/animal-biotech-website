import { NextResponse } from 'next/server'
import { getNewsById, updateNews, deleteNews } from '@/lib/admin-queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const news = await getNewsById(parseInt(id))

    if (!news) {
      return NextResponse.json(
        { success: false, message: '消息不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, message: '取得消息失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const news = await updateNews(parseInt(id), body)
    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { success: false, message: '更新消息失敗' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteNews(parseInt(id))
    return NextResponse.json({ success: true, message: '消息已刪除' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { success: false, message: '刪除消息失敗' },
      { status: 500 }
    )
  }
}
