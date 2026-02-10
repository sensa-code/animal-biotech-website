import { Suspense } from "react"
import { getAllProductsGrouped, getSiteSettings } from "@/lib/queries"
import { defaultProductCategories } from "@/lib/defaults"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsPageClient } from "./products-client"

export const revalidate = 60 // ISR: revalidate every 60 seconds

export const metadata = {
  title: "產品與服務 | 上弦動物生技",
  description: "瀏覽上弦動物生技的完整產品線：診斷設備、快篩試劑、傷口護理及手術耗材。",
}

export default async function ProductsPage() {
  const [grouped, settings] = await Promise.all([
    getAllProductsGrouped(),
    getSiteSettings(),
  ])

  const hasDbData = Object.keys(grouped).length > 0

  // Transform DB data into the format the client component expects
  const categoriesData = hasDbData
    ? Object.entries(grouped).map(([slug, { category, products }]) => ({
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
          image: p.image || null,
        })),
      }))
    : defaultProductCategories

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense>
        <ProductsPageClient categories={categoriesData} />
      </Suspense>
      <Footer settings={settings} />
    </main>
  )
}
