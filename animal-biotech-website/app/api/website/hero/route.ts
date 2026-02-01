import { NextResponse } from 'next/server'
import { getHeroContent } from '@/lib/queries'

export async function GET() {
  try {
    const hero = await getHeroContent()
    return NextResponse.json({ success: true, data: hero })
  } catch (error) {
    console.error('Failed to fetch hero content:', error)
    return NextResponse.json({ success: false, message: '無法取得 Hero 內容' }, { status: 500 })
  }
}
