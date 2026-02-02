import { supabaseAdmin } from './supabase'

export async function getSiteSettings() {
  if (!supabaseAdmin) return {}
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
  if (error || !data) return {}
  const settings: Record<string, string> = {}
  for (const row of data) {
    settings[row.key] = row.value
  }
  return settings
}

export async function getHeroContent() {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin
    .from('hero_content')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(1)
    .single()
  if (error || !data) return null
  return data
}

export async function getStats() {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('stats')
    .select('value, suffix, label')
    .eq('is_active', true)
    .order('sort_order')
  if (error || !data) return []
  return data
}

export async function getProductCategories() {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('product_categories')
    .select('id, slug, icon_name, title, subtitle, description, hero_image')
    .eq('is_active', true)
    .order('sort_order')
  if (error || !data) return []
  return data
}

export async function getProductsByCategory(categorySlug: string) {
  if (!supabaseAdmin) return []
  // First get category id
  const { data: cat } = await supabaseAdmin
    .from('product_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()
  if (!cat) return []

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, slug, name, model, description, features, specs, image, is_highlighted')
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('sort_order')
  if (error || !data) return []
  return data
}

export async function getAllProductsGrouped() {
  const categories = await getProductCategories()
  const grouped: Record<string, { category: typeof categories[0]; products: Awaited<ReturnType<typeof getProductsByCategory>> }> = {}

  for (const cat of categories) {
    const products = await getProductsByCategory(cat.slug)
    grouped[cat.slug] = { category: cat, products }
  }

  return grouped
}

export async function getFeaturedProducts() {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('featured_products')
    .select(`
      id, category_label, badge_text, highlight_text, sort_order,
      products!inner(slug, name, description)
    `)
    .eq('is_active', true)
    .order('sort_order')
  if (error || !data) return []

  // Flatten the joined data
  return data.map((fp: Record<string, unknown>) => {
    const product = fp.products as Record<string, unknown>
    return {
      id: fp.id,
      category_label: fp.category_label,
      badge_text: fp.badge_text,
      highlight_text: fp.highlight_text,
      slug: product.slug,
      name: product.name,
      description: product.description,
    }
  })
}

export async function getProductBySlug(slug: string) {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      id, slug, name, model, description, features, specs, image, is_highlighted,
      product_categories!inner(title, subtitle, slug, icon_name)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .limit(1)
    .single()
  if (error || !data) return null

  const cat = data.product_categories as Record<string, unknown>
  return {
    ...data,
    product_categories: undefined,
    category_title: cat.title,
    category_subtitle: cat.subtitle,
    category_slug: cat.slug,
    category_icon: cat.icon_name,
  }
}

export async function getNews() {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('id, title, summary, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(10)
  if (error || !data) return []
  return data
}

// Contact form submission
export async function submitContactForm(formData: {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}) {
  if (!supabaseAdmin) {
    throw new Error('Database not configured')
  }
  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      company: formData.company || null,
      message: formData.message,
    })
  if (error) throw error
}
