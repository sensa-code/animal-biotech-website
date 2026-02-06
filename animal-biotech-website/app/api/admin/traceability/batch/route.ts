import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { batchCreateProductRecords } from '@/lib/traceability-queries'

// POST: 批次新增溯源記錄
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const body = await request.json()
    const { records } = body

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, message: '請提供要匯入的記錄' },
        { status: 400 }
      )
    }

    // 驗證每筆記錄的必填欄位
    const invalidRecords: number[] = []
    records.forEach((record, index) => {
      if (
        !record.product_code ||
        !record.product_name ||
        !record.hospital_name ||
        !record.purchase_date
      ) {
        invalidRecords.push(index + 1)
      }
    })

    if (invalidRecords.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `第 ${invalidRecords.slice(0, 5).join(', ')}${invalidRecords.length > 5 ? '...' : ''} 筆記錄缺少必填欄位`,
        },
        { status: 400 }
      )
    }

    const result = await batchCreateProductRecords(records)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.errors.join(', ') || '批次匯入失敗',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `成功匯入 ${result.inserted} 筆記錄，跳過 ${result.skipped} 筆重複記錄`,
      inserted: result.inserted,
      skipped: result.skipped,
    })
  } catch (error) {
    console.error('Error batch importing traceability records:', error)
    return NextResponse.json(
      { success: false, message: '批次匯入失敗' },
      { status: 500 }
    )
  }
}
