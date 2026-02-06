import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getNewsAdmin, createNews } from '@/lib/admin-queries'

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const news = await getNewsAdmin()
    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, message: '取得消息失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const body = await request.json()
    const { title, content, summary, is_published, published_at } = body

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: '標題和內容為必填' },
        { status: 400 }
      )
    }

    const news = await createNews({
      title,
      content,
      summary,
      is_published,
      published_at,
    })

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { success: false, message: '新增消息失敗' },
      { status: 500 }
    )
  }
}
