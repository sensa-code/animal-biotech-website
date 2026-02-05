import { NextResponse } from 'next/server'
import { verifyProductCode } from '@/lib/traceability-queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: '請提供產品編碼',
        },
        { status: 400 }
      )
    }

    const record = await verifyProductCode(code)

    if (!record) {
      return NextResponse.json({
        success: true,
        verified: false,
        message: '查無此產品編碼',
      })
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: {
        product_code: record.product_code,
        product_name: record.product_name,
        hospital_name: record.hospital_name,
        purchase_date: record.purchase_date,
      },
    })
  } catch (error) {
    console.error('Error verifying product code:', error)
    return NextResponse.json(
      {
        success: false,
        verified: false,
        message: '伺服器錯誤，請稍後再試',
      },
      { status: 500 }
    )
  }
}
