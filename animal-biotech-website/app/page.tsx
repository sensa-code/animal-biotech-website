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
  const [settings, hero, stats, categories, featured] = await Promise.all([
    getSiteSettings(),
    getHeroContent(),
    getStats(),
    getProductCategories(),
    getFeaturedProducts(),
  ])

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
