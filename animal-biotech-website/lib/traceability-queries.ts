import { createTraceabilityClient } from './supabase-server'

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
  const supabase = await createTraceabilityClient()

  const { data, error } = await supabase
    .from('product_records')
    .select('*')
    .ilike('product_code', code.trim())
    .single()

  if (error || !data) {
    return null
  }

  return data as ProductRecord
}

// ============================================
// 管理後台查詢函數
// ============================================

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

  const supabase = await createTraceabilityClient()
  const offset = (page - 1) * perPage

  // 建立基礎查詢
  let query = supabase
    .from('product_records')
    .select('*', { count: 'exact' })

  // 搜尋條件
  if (search) {
    query = query.or(
      `product_code.ilike.%${search}%,product_name.ilike.%${search}%,hospital_name.ilike.%${search}%`
    )
  }

  // 排序和分頁
  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + perPage - 1)

  if (error) {
    console.error('Error fetching product records:', error)
    return {
      data: [],
      pagination: { page, perPage, total: 0, totalPages: 0 },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / perPage)

  return {
    data: (data || []) as ProductRecord[],
    pagination: { page, perPage, total, totalPages },
  }
}

/**
 * 取得單筆溯源記錄
 */
export async function getProductRecordById(id: number): Promise<ProductRecord | null> {
  const supabase = await createTraceabilityClient()

  const { data, error } = await supabase
    .from('product_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as ProductRecord
}

/**
 * 新增單筆溯源記錄
 */
export async function createProductRecord(
  input: CreateProductRecordInput
): Promise<{ success: boolean; data?: ProductRecord; error?: string }> {
  const supabase = await createTraceabilityClient()

  // 轉換產品編碼為大寫
  const normalizedInput = {
    ...input,
    product_code: input.product_code.trim().toUpperCase(),
    purchase_date: input.purchase_date.replace(/\//g, '-'), // 轉換日期格式
  }

  const { data, error } = await supabase
    .from('product_records')
    .insert(normalizedInput)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '此產品編碼已存在' }
    }
    return { success: false, error: error.message }
  }

  return { success: true, data: data as ProductRecord }
}

/**
 * 更新溯源記錄
 */
export async function updateProductRecord(
  id: number,
  input: UpdateProductRecordInput
): Promise<{ success: boolean; data?: ProductRecord; error?: string }> {
  const supabase = await createTraceabilityClient()

  // 正規化輸入
  const normalizedInput: UpdateProductRecordInput = { ...input }
  if (normalizedInput.product_code) {
    normalizedInput.product_code = normalizedInput.product_code.trim().toUpperCase()
  }
  if (normalizedInput.purchase_date) {
    normalizedInput.purchase_date = normalizedInput.purchase_date.replace(/\//g, '-')
  }

  const { data, error } = await supabase
    .from('product_records')
    .update(normalizedInput)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '此產品編碼已存在' }
    }
    return { success: false, error: error.message }
  }

  return { success: true, data: data as ProductRecord }
}

/**
 * 刪除溯源記錄
 */
export async function deleteProductRecord(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createTraceabilityClient()

  const { error } = await supabase
    .from('product_records')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
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
  const supabase = await createTraceabilityClient()
  const errors: string[] = []
  let inserted = 0
  let skipped = 0

  // 正規化所有記錄
  const normalizedRecords = records.map((record) => ({
    ...record,
    product_code: record.product_code.trim().toUpperCase(),
    purchase_date: record.purchase_date.replace(/\//g, '-'),
  }))

  // 批次插入，忽略重複
  const { data, error } = await supabase
    .from('product_records')
    .upsert(normalizedRecords, {
      onConflict: 'product_code',
      ignoreDuplicates: true,
    })
    .select()

  if (error) {
    errors.push(error.message)
    return { success: false, inserted: 0, skipped: records.length, errors }
  }

  inserted = data?.length || 0
  skipped = records.length - inserted

  return {
    success: true,
    inserted,
    skipped,
    errors,
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
  const supabase = await createTraceabilityClient()

  // 總記錄數
  const { count: totalRecords } = await supabase
    .from('product_records')
    .select('*', { count: 'exact', head: true })

  // 不重複醫院數
  const { data: hospitals } = await supabase
    .from('product_records')
    .select('hospital_name')

  const uniqueHospitals = new Set(hospitals?.map((h) => h.hospital_name) || [])

  // 最近 30 天新增的記錄數
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: recentRecords } = await supabase
    .from('product_records')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  return {
    totalRecords: totalRecords || 0,
    totalHospitals: uniqueHospitals.size,
    recentRecords: recentRecords || 0,
  }
}
