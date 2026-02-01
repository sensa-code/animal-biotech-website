import { getAllProductsGrouped, getSiteSettings } from "@/lib/queries"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsPageClient } from "./products-client"

export default async function ProductsPage() {
  const [grouped, settings] = await Promise.all([
    getAllProductsGrouped(),
    getSiteSettings(),
  ])

  // Transform DB data into the format the client component expects
  const categoriesData = Object.entries(grouped).map(([slug, { category, products }]) => ({
    id: slug,
    icon_name: category.icon_name,
    title: category.title,
    subtitle: category.subtitle,
    description: category.description,
    products: products.map((p) => ({
      id: p.slug,
      name: p.name,
      model: p.model || "",
      description: p.description,
      features: Array.isArray(p.features) ? p.features : [],
      specs: (typeof p.specs === "object" && p.specs !== null ? p.specs : {}) as Record<string, string>,
      highlight: p.is_highlighted || false,
    })),
  }))

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ProductsPageClient categories={categoriesData} />
      <Footer settings={settings} />
    </main>
  )
}
