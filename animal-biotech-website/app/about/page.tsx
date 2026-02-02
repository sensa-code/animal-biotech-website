import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSiteSettings, getStats, getProductCategories } from "@/lib/queries"
import { AboutPageClient } from "./about-client"

export const metadata = {
  title: "關於上弦 | 上弦動物生技",
  description: "上弦動物生技以獸醫師角度出發，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材。了解我們的使命、願景與服務。",
}

export default async function AboutPage() {
  const [settings, stats, categories] = await Promise.all([
    getSiteSettings(),
    getStats(),
    getProductCategories(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AboutPageClient stats={stats} categories={categories} />
      <Footer settings={settings} categories={categories} />
    </main>
  )
}
