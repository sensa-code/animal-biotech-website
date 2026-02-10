export const revalidate = 60 // ISR: revalidate every 60 seconds

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ResearchSection } from "@/components/research-section"
import { ProductsSection } from "@/components/discoveries-section"
import { NewsSection } from "@/components/team-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { AuthCallbackHandler } from "@/components/auth-callback-handler"
import {
  getSiteSettings,
  getHeroContent,
  getStats,
  getProductCategories,
  getFeaturedProducts,
} from "@/lib/queries"

export default async function HomePage() {
  let settings: Record<string, string> = {}
  let hero: Awaited<ReturnType<typeof getHeroContent>> = null
  let stats: Awaited<ReturnType<typeof getStats>> = []
  let categories: Awaited<ReturnType<typeof getProductCategories>> = []
  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = []

  try {
    const results = await Promise.all([
      getSiteSettings(),
      getHeroContent(),
      getStats(),
      getProductCategories(),
      getFeaturedProducts(),
    ])
    settings = results[0]
    hero = results[1]
    stats = results[2] ?? []
    categories = results[3] ?? []
    featured = results[4] ?? []
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
  }

  return (
    <main className="min-h-screen bg-background">
      <AuthCallbackHandler />
      <Header />
      <HeroSection hero={hero} />
      <AboutSection stats={stats} />
      <ResearchSection categories={categories} />
      <ProductsSection featured={featured} />
      <NewsSection settings={settings} categories={categories} />
      <CTASection settings={settings} />
      <Footer settings={settings} categories={categories} />
    </main>
  )
}
