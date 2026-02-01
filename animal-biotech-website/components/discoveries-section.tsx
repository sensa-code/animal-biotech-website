"use client"

import { ArrowUpRight } from "lucide-react"

interface FeaturedProduct {
  id: number
  category_label: string
  badge_text: string
  highlight_text: string
  slug: string
  name: string
  description: string
}

const defaultFeatured: FeaturedProduct[] = [
  {
    id: 1,
    category_label: "診斷設備",
    name: "全自動臨床生化分析儀",
    description: "LOCMEDT 動物用全自動臨床生化分析儀，只需 90~120uL 全血，12 分鐘自動完成 22 項生化檢查，自動離心稀釋、自動 QC。",
    badge_text: "主打產品",
    highlight_text: "0.1cc 全血 / 12 分鐘 / 22 項檢查",
    slug: "biochem-analyzer",
  },
  {
    id: 2,
    category_label: "快篩試劑",
    name: "貓毛滴蟲抗原快篩",
    description: "貓感染毛滴蟲會造成反覆慢性下痢、血痢、黏液便、消瘦等症狀，且可能被誤判為梨形鞭毛蟲感染導致無效治療。",
    badge_text: "精準診斷",
    highlight_text: "避免誤診 / 快速檢測",
    slug: "cat-trichomonas",
  },
  {
    id: 3,
    category_label: "快篩試劑",
    name: "犬下痢套組",
    description: "為全齡犬常見消化道傳染病提供完整檢查，包含犬小病毒、冠狀病毒、梨型鞭毛蟲及輪狀病毒檢測。",
    badge_text: "完整檢測",
    highlight_text: "4 合 1 檢測套組",
    slug: "canine-diarrhea",
  },
  {
    id: 4,
    category_label: "快篩試劑",
    name: "抗體力價檢測",
    description: "適用於接種疫苗前後、健康檢查、疑似早期病毒感染、或動物經歷外宿寄養等可能交叉感染場所後使用。",
    badge_text: "免疫評估",
    highlight_text: "需搭配快篩判讀機",
    slug: "antibody-titer",
  },
]

export function ProductsSection({ featured }: { featured?: FeaturedProduct[] }) {
  const data = featured && featured.length > 0 ? featured : defaultFeatured

  return (
    <section id="featured" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">主打產品</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight text-balance">
              專業檢測與診斷方案
            </h2>
          </div>
          <a
            href="/products"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-foreground hover:text-accent transition-colors group"
          >
            查看全部產品
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {data.map((item, index) => (
            <article
              key={item.id}
              className="group relative p-8 lg:p-10 bg-card border border-border hover:border-accent/50 transition-all duration-500 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/0 group-hover:border-accent transition-colors duration-500" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-[0.2em] uppercase text-accent">
                  {item.category_label}
                </span>
                <span className="w-8 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{item.badge_text}</span>
              </div>

              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-foreground group-hover:text-accent transition-colors">
                <span className="tracking-wide">閱讀更多</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <span className="absolute bottom-4 right-4 font-serif text-6xl text-foreground/5 group-hover:text-accent/10 transition-colors duration-500">
                0{index + 1}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
