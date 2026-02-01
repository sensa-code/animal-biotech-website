"use client"

import { MapPin, Phone, Mail, Globe, Clock } from "lucide-react"

interface CategoryData {
  slug: string
  title: string
}

const defaultSettings: Record<string, string> = {
  address: "新北市林口區忠福路131號",
  phone: "02-2600-8387",
  email: "service@senbio.tech",
  website_url: "www.senbio.tech",
  business_hours: "週一至週五 09:00 - 18:00",
}

const defaultCategories: CategoryData[] = [
  { slug: "diagnostic", title: "診斷設備" },
  { slug: "rapid", title: "快篩試劑" },
  { slug: "wound", title: "傷口護理" },
  { slug: "surgical", title: "手術耗材" },
]

export function NewsSection({
  settings,
  categories,
}: {
  settings?: Record<string, string>
  categories?: CategoryData[]
}) {
  const s = settings && Object.keys(settings).length > 0 ? settings : defaultSettings
  const cats = categories && categories.length > 0 ? categories : defaultCategories

  return (
    <section id="contact" className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">聯絡我們</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight text-balance">
            專業服務 隨時為您
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h3 className="font-serif text-2xl text-foreground mb-8">聯絡資訊</h3>

            <div className="space-y-6">
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
                  <p className="text-foreground">{s.phone}</p>
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
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">官方網站</p>
                  <a href={`https://${s.website_url}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                    {s.website_url}
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
          </div>

          <div>
            <h3 className="font-serif text-2xl text-foreground mb-8">產品總覽</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {cats.map((category) => (
                <div key={category.slug} className="p-6 bg-background border border-border hover:border-accent/50 transition-colors">
                  <h4 className="text-sm tracking-[0.2em] uppercase text-accent mb-4">{category.title}</h4>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-medium">電漿滅菌服務</span> - 我們提供專業的電漿滅菌服務，
                歡迎來電洽詢或透過 Email 聯繫我們了解更多詳情。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
