import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getHeroContent, updateHeroContent, getStatsAdmin, updateStat } from '@/lib/admin-queries'

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const [hero, stats] = await Promise.all([
      getHeroContent(),
      getStatsAdmin(),
    ])

    return NextResponse.json({
      success: true,
      data: { hero, stats },
    })
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      { success: false, message: '取得首頁內容失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const body = await request.json()
    const { hero, stats } = body

    const results: { hero?: unknown; stats?: unknown[] } = {}

    if (hero && hero.id) {
      results.hero = await updateHeroContent(hero.id, hero)
    }

    if (stats && Array.isArray(stats)) {
      results.stats = await Promise.all(
        stats.map((stat: { id: number; value?: string; suffix?: string; label?: string; sort_order?: number; is_active?: boolean }) =>
          updateStat(stat.id, stat)
        )
      )
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Error updating homepage content:', error)
    return NextResponse.json(
      { success: false, message: '更新首頁內容失敗' },
      { status: 500 }
    )
  }
}
