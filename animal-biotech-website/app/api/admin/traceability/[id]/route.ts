import { NextResponse } from 'next/server'
import {
  getProductRecordById,
  updateProductRecord,
  deleteProductRecord,
} from '@/lib/traceability-queries'

// GET: 取得單筆溯源記錄
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const recordId = parseInt(id)

    if (isNaN(recordId)) {
      return NextResponse.json(
        { success: false, message: '無效的記錄 ID' },
        { status: 400 }
      )
    }

    const record = await getProductRecordById(recordId)

    if (!record) {
      return NextResponse.json(
        { success: false, message: '找不到此記錄' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    console.error('Error fetching traceability record:', error)
    return NextResponse.json(
      { success: false, message: '無法取得溯源記錄' },
      { status: 500 }
    )
  }
}

// PUT: 更新溯源記錄
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const recordId = parseInt(id)

    if (isNaN(recordId)) {
      return NextResponse.json(
        { success: false, message: '無效的記錄 ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { product_code, product_name, hospital_name, purchase_date } = body

    // 至少要有一個欄位更新
    if (!product_code && !product_name && !hospital_name && !purchase_date) {
      return NextResponse.json(
        { success: false, message: '請至少提供一個要更新的欄位' },
        { status: 400 }
      )
    }

    const result = await updateProductRecord(recordId, {
      product_code,
      product_name,
      hospital_name,
      purchase_date,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: '更新成功',
    })
  } catch (error) {
    console.error('Error updating traceability record:', error)
    return NextResponse.json(
      { success: false, message: '無法更新溯源記錄' },
      { status: 500 }
    )
  }
}

// DELETE: 刪除溯源記錄
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const recordId = parseInt(id)

    if (isNaN(recordId)) {
      return NextResponse.json(
        { success: false, message: '無效的記錄 ID' },
        { status: 400 }
      )
    }

    const result = await deleteProductRecord(recordId)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '刪除成功',
    })
  } catch (error) {
    console.error('Error deleting traceability record:', error)
    return NextResponse.json(
      { success: false, message: '無法刪除溯源記錄' },
      { status: 500 }
    )
  }
}
