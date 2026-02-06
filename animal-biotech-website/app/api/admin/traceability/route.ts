import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getProductRecords, createProductRecord } from '@/lib/traceability-queries'

// GET: 取得溯源記錄列表
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '20')
    const search = searchParams.get('search') || ''
    const sortBy = (searchParams.get('sort_by') || 'created_at') as
      | 'product_code'
      | 'product_name'
      | 'hospital_name'
      | 'purchase_date'
      | 'created_at'
    const sortOrder = (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc'

    const result = await getProductRecords({
      page,
      perPage,
      search,
      sortBy,
      sortOrder,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error fetching traceability records:', error)
    return NextResponse.json(
      { success: false, message: '無法取得溯源記錄' },
      { status: 500 }
    )
  }
}

// POST: 新增單筆溯源記錄
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authenticated) return auth.response
    const body = await request.json()

    const { product_code, product_name, hospital_name, purchase_date } = body

    // 驗證必填欄位
    if (!product_code || !product_name || !hospital_name || !purchase_date) {
      return NextResponse.json(
        { success: false, message: '請填寫所有必填欄位' },
        { status: 400 }
      )
    }

    const result = await createProductRecord({
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
      message: '新增成功',
    })
  } catch (error) {
    console.error('Error creating traceability record:', error)
    return NextResponse.json(
      { success: false, message: '無法新增溯源記錄' },
      { status: 500 }
    )
  }
}
