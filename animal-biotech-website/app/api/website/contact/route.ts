import { NextResponse } from 'next/server'
import { submitContactForm } from '@/lib/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: '姓名、Email 及訊息為必填欄位' },
        { status: 400 }
      )
    }

    await submitContactForm({ name, email, phone, company, message })

    return NextResponse.json({ success: true, message: '感謝您的來信，我們將盡快回覆' })
  } catch (error) {
    console.error('Failed to submit contact form:', error)
    const message = error instanceof Error && error.message === 'Database not configured'
      ? '系統尚未設定資料庫，請聯繫管理員'
      : '提交失敗，請稍後再試'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
