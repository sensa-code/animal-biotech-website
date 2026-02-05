import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getSiteSettings, getProductCategories } from '@/lib/queries'
import { TraceClient } from './trace-client'
import { QrCode, Shield, Search } from 'lucide-react'

export const metadata = {
  title: '產品溯源查詢 | 上弦動物生技',
  description: '輸入產品編碼，查詢上弦動物生技產品的出貨資訊，驗證產品真偽。',
}

export default async function TracePage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 border border-accent rounded-full" />
          <div className="absolute bottom-10 right-20 w-96 h-96 border border-foreground rounded-full" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">
              Product Traceability
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance">
              產品溯源查詢
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              輸入產品編碼，查詢產品出貨資訊，確保您使用的是上弦動物生技正品。
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <TraceClient />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-12">
              為什麼需要產品溯源？
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">確保正品</h3>
                <p className="text-sm text-muted-foreground">
                  透過編碼驗證，確認產品為上弦動物生技正品，保障醫療品質
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">追蹤來源</h3>
                <p className="text-sm text-muted-foreground">
                  查詢產品出貨日期及通路，掌握完整的產品流向資訊
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">即時查詢</h3>
                <p className="text-sm text-muted-foreground">
                  系統即時回應查詢結果，快速完成產品驗證
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} categories={categories} />
    </main>
  )
}
