import { createClient } from '@supabase/supabase-js'

// 建立直接連接的 Supabase client（使用 service role key 執行 SQL）
function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ============================================
// 類型定義
// ============================================

export interface ProductRecord {
  id: number
  product_code: string
  product_name: string
  hospital_name: string
  purchase_date: string
  created_at: string
  updated_at: string
}

export interface CreateProductRecordInput {
  product_code: string
  product_name: string
  hospital_name: string
  purchase_date: string
}

export interface UpdateProductRecordInput {
  product_code?: string
  product_name?: string
  hospital_name?: string
  purchase_date?: string
}

export interface PaginationOptions {
  page?: number
  perPage?: number
  search?: string
  sortBy?: 'product_code' | 'product_name' | 'hospital_name' | 'purchase_date' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

// ============================================
// 公開查詢函數
// ============================================

/**
 * 透過產品編碼驗證產品真偽
 * @param code 產品編碼
 * @returns 產品記錄或 null
 */
export async function verifyProductCode(code: string): Promise<ProductRecord | null> {
  const supabase = createSupabaseAdmin()

  const { data, error } = await supabase.rpc('verify_product_code', {
    p_code: code.trim().toUpperCase()
  })

  if (error) {
    // 如果 RPC 不存在，使用直接 SQL 查詢
    const { data: sqlData, error: sqlError } = await supabase
      .from('traceability.product_records')
      .select('*')
      .ilike('product_code', code.trim())
      .single()

    if (sqlError) {
      // 最後嘗試直接用 SQL
      const result = await supabase.rpc('exec_sql', {
        query: `SELECT * FROM traceability.product_records WHERE UPPER(product_code) = UPPER('${code.trim().replace(/'/g, "''")}') LIMIT 1`
      })

      if (result.error || !result.data || result.data.length === 0) {
        return null
      }
      return result.data[0] as ProductRecord
    }

    return sqlData as ProductRecord
  }

  if (!data || data.length === 0) {
    return null
  }

  return data[0] as ProductRecord
}

// ============================================
// 管理後台查詢函數（使用直接 SQL）
// ============================================

/**
 * 執行 SQL 查詢的輔助函數
 */
async function executeSql<T>(sql: string): Promise<{ data: T[] | null; error: Error | null; count?: number }> {
  const supabase = createSupabaseAdmin()

  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sql })

    if (error) {
      // 如果 exec_sql RPC 不存在，回傳錯誤
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as T[], error: null }
  } catch (err) {
    return { data: null, error: err as Error }
  }
}

/**
 * 取得溯源記錄列表（支援分頁和搜尋）
 */
export async function getProductRecords(
  options: PaginationOptions = {}
): Promise<PaginatedResult<ProductRecord>> {
  const {
    page = 1,
    perPage = 20,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options

  const supabase = createSupabaseAdmin()
  const offset = (page - 1) * perPage

  // 構建 WHERE 條件
  let whereClause = ''
  if (search) {
    const searchEscaped = search.replace(/'/g, "''")
    whereClause = `WHERE product_code ILIKE '%${searchEscaped}%' OR product_name ILIKE '%${searchEscaped}%' OR hospital_name ILIKE '%${searchEscaped}%'`
  }

  // 使用 Postgres 函數執行查詢
  const countSql = `SELECT COUNT(*) as total FROM traceability.product_records ${whereClause}`
  const dataSql = `SELECT * FROM traceability.product_records ${whereClause} ORDER BY ${sortBy} ${sortOrder.toUpperCase()} LIMIT ${perPage} OFFSET ${offset}`

  try {
    // 嘗試直接查詢
    const { data: countResult, error: countError } = await supabase.rpc('get_traceability_count', {
      search_term: search || null
    })

    const { data: records, error: dataError } = await supabase.rpc('get_traceability_records', {
      search_term: search || null,
      sort_column: sortBy,
      sort_direction: sortOrder,
      page_limit: perPage,
      page_offset: offset
    })

    if (countError || dataError) {
      throw new Error('RPC not available')
    }

    const total = countResult || 0
    const totalPages = Math.ceil(total / perPage)

    return {
      data: (records || []) as ProductRecord[],
      pagination: { page, perPage, total, totalPages },
    }
  } catch {
    // RPC 不存在時返回空結果
    console.error('Traceability RPC functions not available')
    return {
      data: [],
      pagination: { page, perPage, total: 0, totalPages: 0 },
    }
  }
}

/**
 * 取得單筆溯源記錄
 */
export async function getProductRecordById(id: number): Promise<ProductRecord | null> {
  const supabase = createSupabaseAdmin()

  try {
    const { data, error } = await supabase.rpc('get_traceability_record_by_id', { record_id: id })

    if (error || !data || data.length === 0) {
      return null
    }

    return data[0] as ProductRecord
  } catch {
    return null
  }
}

/**
 * 新增單筆溯源記錄
 */
export async function createProductRecord(
  input: CreateProductRecordInput
): Promise<{ success: boolean; data?: ProductRecord; error?: string }> {
  const supabase = createSupabaseAdmin()

  const normalizedInput = {
    p_product_code: input.product_code.trim().toUpperCase(),
    p_product_name: input.product_name,
    p_hospital_name: input.hospital_name,
    p_purchase_date: input.purchase_date.replace(/\//g, '-'),
  }

  try {
    const { data, error } = await supabase.rpc('insert_traceability_record', normalizedInput)

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('23505')) {
        return { success: false, error: '此產品編碼已存在' }
      }
      return { success: false, error: error.message }
    }

    return { success: true, data: data as ProductRecord }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * 更新溯源記錄
 */
export async function updateProductRecord(
  id: number,
  input: UpdateProductRecordInput
): Promise<{ success: boolean; data?: ProductRecord; error?: string }> {
  const supabase = createSupabaseAdmin()

  const params: Record<string, unknown> = { record_id: id }
  if (input.product_code) params.p_product_code = input.product_code.trim().toUpperCase()
  if (input.product_name) params.p_product_name = input.product_name
  if (input.hospital_name) params.p_hospital_name = input.hospital_name
  if (input.purchase_date) params.p_purchase_date = input.purchase_date.replace(/\//g, '-')

  try {
    const { data, error } = await supabase.rpc('update_traceability_record', params)

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('23505')) {
        return { success: false, error: '此產品編碼已存在' }
      }
      return { success: false, error: error.message }
    }

    return { success: true, data: data as ProductRecord }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * 刪除溯源記錄
 */
export async function deleteProductRecord(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseAdmin()

  try {
    const { error } = await supabase.rpc('delete_traceability_record', { record_id: id })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * 批次新增溯源記錄
 */
export async function batchCreateProductRecords(
  records: CreateProductRecordInput[]
): Promise<{
  success: boolean
  inserted: number
  skipped: number
  errors: string[]
}> {
  const supabase = createSupabaseAdmin()
  const errors: string[] = []
  let inserted = 0
  let skipped = 0

  // 正規化所有記錄
  const normalizedRecords = records.map((record) => ({
    product_code: record.product_code.trim().toUpperCase(),
    product_name: record.product_name,
    hospital_name: record.hospital_name,
    purchase_date: record.purchase_date.replace(/\//g, '-'),
  }))

  try {
    const { data, error } = await supabase.rpc('batch_insert_traceability_records', {
      records: normalizedRecords
    })

    if (error) {
      errors.push(error.message)
      return { success: false, inserted: 0, skipped: records.length, errors }
    }

    inserted = data?.inserted || 0
    skipped = data?.skipped || 0

    return { success: true, inserted, skipped, errors }
  } catch (err) {
    errors.push((err as Error).message)
    return { success: false, inserted: 0, skipped: records.length, errors }
  }
}

/**
 * 取得溯源統計資料
 */
export async function getTraceabilityStats(): Promise<{
  totalRecords: number
  totalHospitals: number
  recentRecords: number
}> {
  const supabase = createSupabaseAdmin()

  try {
    const { data, error } = await supabase.rpc('get_traceability_stats')

    if (error || !data) {
      return { totalRecords: 0, totalHospitals: 0, recentRecords: 0 }
    }

    return {
      totalRecords: data.total_records || 0,
      totalHospitals: data.total_hospitals || 0,
      recentRecords: data.recent_records || 0,
    }
  } catch {
    return { totalRecords: 0, totalHospitals: 0, recentRecords: 0 }
  }
}
