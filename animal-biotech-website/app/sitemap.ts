import type { MetadataRoute } from "next"
import { defaultProductCategories } from "@/lib/defaults"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.senbio.tech"

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Generate product detail pages from defaults
  const productPages: MetadataRoute.Sitemap = defaultProductCategories.flatMap((cat) =>
    cat.products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  )

  return [...staticPages, ...productPages]
}
