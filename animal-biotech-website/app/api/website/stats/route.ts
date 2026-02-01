import { NextResponse } from 'next/server'
import { getStats } from '@/lib/queries'

export async function GET() {
  try {
    const stats = await getStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ success: false, message: '無法取得統計數據' }, { status: 500 })
  }
}
