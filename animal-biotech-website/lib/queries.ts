import { query } from './db'

export async function getSiteSettings() {
  const result = await query('SELECT key, value FROM site_settings')
  const settings: Record<string, string> = {}
  for (const row of result.rows) {
    settings[row.key] = row.value
  }
  return settings
}

export async function getHeroContent() {
  const result = await query(
    'SELECT * FROM hero_content WHERE is_active = true ORDER BY sort_order LIMIT 1'
  )
  return result.rows[0] || null
}

export async function getStats() {
  const result = await query(
    'SELECT value, suffix, label FROM stats WHERE is_active = true ORDER BY sort_order'
  )
  return result.rows
}

export async function getProductCategories() {
  const result = await query(
    'SELECT id, slug, icon_name, title, subtitle, description, hero_image FROM product_categories WHERE is_active = true ORDER BY sort_order'
  )
  return result.rows
}

export async function getProductsByCategory(categorySlug: string) {
  const result = await query(
    `SELECT p.id, p.slug, p.name, p.model, p.description, p.features, p.specs, p.image, p.is_highlighted
     FROM products p
     JOIN product_categories c ON p.category_id = c.id
     WHERE c.slug = $1 AND p.is_active = true
     ORDER BY p.sort_order`,
    [categorySlug]
  )
  return result.rows
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
  const result = await query(
    `SELECT fp.id, fp.category_label, fp.badge_text, fp.highlight_text,
            p.slug, p.name, p.description
     FROM featured_products fp
     JOIN products p ON fp.product_id = p.id
     WHERE fp.is_active = true
     ORDER BY fp.sort_order`
  )
  return result.rows
}

export async function getNews() {
  const result = await query(
    `SELECT id, title, summary, published_at
     FROM news
     WHERE is_published = true
     ORDER BY published_at DESC
     LIMIT 10`
  )
  return result.rows
}
