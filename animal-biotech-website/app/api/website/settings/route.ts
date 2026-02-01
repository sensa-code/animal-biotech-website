import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/queries'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return NextResponse.json({ success: false, message: '無法取得網站設定' }, { status: 500 })
  }
}
