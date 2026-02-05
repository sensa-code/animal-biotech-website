import { supabaseAdmin } from './supabase'

// ============ Products ============

export async function getProducts(categoryId?: number) {
  if (!supabaseAdmin) return []

  // First get all categories for mapping
  const { data: categories } = await supabaseAdmin
    .from('product_categories')
    .select('id, slug, title')

  const categoryMap = new Map(categories?.map(c => [c.id, c]) || [])

  let query = supabaseAdmin
    .from('products')
    .select('*')
    .order('sort_order')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  // Manually join category data
  return (data || []).map(product => ({
    ...product,
    product_categories: categoryMap.get(product.category_id) || null
  }))
}

export async function getProductById(id: number) {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  if (!data) return null

  // Get category data separately
  const { data: category } = await supabaseAdmin
    .from('product_categories')
    .select('id, slug, title')
    .eq('id', data.category_id)
    .single()

  return {
    ...data,
    product_categories: category || null
  }
}

export async function createProduct(product: {
  category_id: number
  slug: string
  name: string
  model?: string
  description?: string
  features?: string[]
  specs?: Record<string, string>
  image?: string
  is_highlighted?: boolean
  sort_order?: number
  is_active?: boolean
}) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      ...product,
      features: product.features || [],
      specs: product.specs || {},
      is_active: product.is_active ?? true,
      sort_order: product.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProduct(id: number, product: Partial<{
  category_id: number
  slug: string
  name: string
  model: string
  description: string
  features: string[]
  specs: Record<string, string>
  image: string
  is_highlighted: boolean
  sort_order: number
  is_active: boolean
}>) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProduct(id: number) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ Categories ============

export async function getCategories() {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('product_categories')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getCategoryById(id: number) {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createCategory(category: {
  slug: string
  icon_name?: string
  title: string
  subtitle?: string
  description?: string
  hero_image?: string
  sort_order?: number
  is_active?: boolean
}) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('product_categories')
    .insert({
      ...category,
      is_active: category.is_active ?? true,
      sort_order: category.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(id: number, category: Partial<{
  slug: string
  icon_name: string
  title: string
  subtitle: string
  description: string
  hero_image: string
  sort_order: number
  is_active: boolean
}>) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('product_categories')
    .update({ ...category, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: number) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  // Check if category has products
  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)

  if (count && count > 0) {
    throw new Error('此分類下還有產品，無法刪除')
  }

  const { error } = await supabaseAdmin
    .from('product_categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ Featured Products ============

export async function getFeaturedProducts() {
  if (!supabaseAdmin) return []

  // Get all products for mapping
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, slug, name, description, image')

  const productMap = new Map(products?.map(p => [p.id, p]) || [])

  const { data, error } = await supabaseAdmin
    .from('featured_products')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  // Manually join product data
  return (data || []).map(fp => ({
    ...fp,
    products: productMap.get(fp.product_id) || null
  }))
}

export async function updateFeaturedProducts(items: Array<{
  id?: number
  product_id: number
  category_label: string
  badge_text?: string
  highlight_text?: string
  sort_order: number
  is_active: boolean
}>) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  // Delete all existing and re-insert
  await supabaseAdmin.from('featured_products').delete().neq('id', 0)

  if (items.length === 0) return []

  const { data, error } = await supabaseAdmin
    .from('featured_products')
    .insert(items.map((item, index) => ({
      product_id: item.product_id,
      category_label: item.category_label,
      badge_text: item.badge_text || null,
      highlight_text: item.highlight_text || null,
      sort_order: index,
      is_active: item.is_active,
    })))
    .select()

  if (error) throw error
  return data
}

// ============ Hero Content ============

export async function getHeroContent() {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('hero_content')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function updateHeroContent(id: number, content: Partial<{
  title: string
  subtitle: string
  description: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
  cta_secondary_link: string
}>) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('hero_content')
    .update({ ...content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ Stats ============

export async function getStatsAdmin() {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('stats')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching stats:', error)
    return []
  }

  return data || []
}

export async function updateStat(id: number, stat: Partial<{
  value: string
  suffix: string
  label: string
  sort_order: number
  is_active: boolean
}>) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('stats')
    .update({ ...stat, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ Site Settings ============

export async function getSiteSettingsAdmin() {
  if (!supabaseAdmin) return {}

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')

  if (error || !data) return {}

  const settings: Record<string, { id: number; value: string }> = {}
  for (const row of data) {
    settings[row.key] = { id: row.id, value: row.value }
  }
  return settings
}

export async function updateSiteSetting(key: string, value: string) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ News ============

export async function getNewsAdmin() {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
}

export async function getNewsById(id: number) {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createNews(news: {
  title: string
  content: string
  summary?: string
  is_published?: boolean
  published_at?: string
}) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { data, error } = await supabaseAdmin
    .from('news')
    .insert({
      ...news,
      is_published: news.is_published ?? false,
      published_at: news.is_published ? (news.published_at || new Date().toISOString()) : null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNews(id: number, news: Partial<{
  title: string
  content: string
  summary: string
  is_published: boolean
  published_at: string
}>) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const updateData: Record<string, unknown> = {
    ...news,
    updated_at: new Date().toISOString(),
  }

  // If publishing for the first time, set published_at
  if (news.is_published && !news.published_at) {
    updateData.published_at = new Date().toISOString()
  }

  const { data, error } = await supabaseAdmin
    .from('news')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNews(id: number) {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const { error } = await supabaseAdmin
    .from('news')
    .delete()
    .eq('id', id)

  if (error) throw error
}
