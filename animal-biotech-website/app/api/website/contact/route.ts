import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

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

    await query(
      'INSERT INTO contact_submissions (name, email, phone, company, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone || null, company || null, message]
    )

    return NextResponse.json({ success: true, message: '感謝您的來信，我們將盡快回覆' })
  } catch (error) {
    console.error('Failed to submit contact form:', error)
    return NextResponse.json({ success: false, message: '提交失敗，請稍後再試' }, { status: 500 })
  }
}
