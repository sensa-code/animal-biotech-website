import { NextResponse } from 'next/server'
import { getSiteSettingsAdmin, updateSiteSetting } from '@/lib/admin-queries'

export async function GET() {
  try {
    const settings = await getSiteSettingsAdmin()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: '取得設定失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, message: '無效的資料格式' },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        updateSiteSetting(key, value as string)
      )
    )

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, message: '更新設定失敗' },
      { status: 500 }
    )
  }
}
