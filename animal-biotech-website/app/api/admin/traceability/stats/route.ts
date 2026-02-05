import { NextResponse } from 'next/server'
import { getTraceabilityStats } from '@/lib/traceability-queries'

// GET: 取得溯源統計資料
export async function GET() {
  try {
    const stats = await getTraceabilityStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching traceability stats:', error)
    return NextResponse.json(
      { success: false, message: '無法取得統計資料' },
      { status: 500 }
    )
  }
}
