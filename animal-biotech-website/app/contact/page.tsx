import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { getSiteSettings, getProductCategories } from "@/lib/queries"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata = {
  title: "聯絡我們 | 上弦動物生技",
  description: "聯繫上弦動物生技，取得動物醫療設備與耗材的產品諮詢、報價或技術支援。",
}

const defaultSettings: Record<string, string> = {
  address: "新北市林口區忠福路131號",
  phone: "02-2600-8387",
  email: "service@senbio.tech",
  business_hours: "週一至週五 09:00 - 18:00",
}

export default async function ContactPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
  ])

  const s = settings && Object.keys(settings).length > 0 ? settings : defaultSettings

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
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">Contact Us</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance">
              聯絡我們
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              如有任何產品諮詢、報價需求或技術問題，歡迎填寫表單或直接與我們聯繫。
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-2xl text-foreground mb-8">填寫聯絡表單</h2>
              <ContactForm />
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-foreground mb-8">聯絡資訊</h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">公司地址</p>
                    <p className="text-foreground">{s.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">聯絡電話</p>
                    <a href={`tel:${s.phone}`} className="text-foreground hover:text-accent transition-colors">
                      {s.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">電子信箱</p>
                    <a href={`mailto:${s.email}`} className="text-foreground hover:text-accent transition-colors">
                      {s.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">營業時間</p>
                    <p className="text-foreground">{s.business_hours}</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="border border-border bg-card p-8">
                <h3 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">公司位置</h3>
                <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{s.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} categories={categories} />
    </main>
  )
}
