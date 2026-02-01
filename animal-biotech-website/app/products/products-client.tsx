"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
  ChevronRight,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
}

interface Product {
  id: string
  name: string
  model: string
  description: string
  features: string[]
  specs: Record<string, string>
  highlight?: boolean
}

interface Category {
  id: string
  icon_name: string
  title: string
  subtitle: string
  description: string
  products: Product[]
}

export function ProductsPageClient({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "diagnostic")
  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0]

  if (!currentCategory) return null

  const CurrentIcon = iconMap[currentCategory.icon_name] || Activity

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 border border-accent rounded-full" />
          <div className="absolute bottom-10 right-20 w-96 h-96 border border-foreground rounded-full" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">
              Products & Services
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance">
              產品與服務總覽
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              上弦動物生技以獸醫師角度出發，提供完整的動物醫療解決方案，
              從診斷設備、快篩試劑到傷口護理及手術耗材，全方位守護動物健康。
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
            {categories.map((category) => {
              const Icon = iconMap[category.icon_name] || Activity
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-sm tracking-wide transition-all duration-300 border whitespace-nowrap",
                    activeCategory === category.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Category Header */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <CurrentIcon className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2">
                  {currentCategory.subtitle}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
                  {currentCategory.title}
                </h2>
                <p className="text-muted-foreground max-w-xl leading-relaxed">
                  {currentCategory.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>共 {currentCategory.products.length} 項產品</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid gap-8">
            {currentCategory.products.map((product, index) => (
              <article
                key={product.id}
                className={cn(
                  "group relative border border-border hover:border-accent/50 transition-all duration-500",
                  product.highlight && "ring-1 ring-accent/20"
                )}
              >
                {product.highlight && (
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-accent text-background text-xs tracking-wider uppercase">
                    主打推薦
                  </div>
                )}

                <div className="p-8 lg:p-12">
                  <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs tracking-[0.2em] uppercase text-accent">
                          {product.model}
                        </span>
                        <span className="w-8 h-px bg-border" />
                        <span className="font-serif text-4xl text-foreground/10">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                        {product.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {product.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 text-foreground"
                          >
                            <Check className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:border-l lg:border-border lg:pl-12">
                      <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                        產品規格
                      </h4>
                      <dl className="space-y-4">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-xs text-muted-foreground mb-1">{key}</dt>
                            <dd className="text-sm text-foreground">{value}</dd>
                          </div>
                        ))}
                      </dl>

                      <button
                        type="button"
                        className="mt-8 inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors group/btn"
                      >
                        <span>詢問產品</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            需要產品諮詢？
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            我們的專業團隊隨時為您服務，歡迎來電或來信洽詢
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:02-2600-8387"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
            >
              立即來電
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:service@senbio.tech"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground/30 text-foreground text-sm tracking-widest uppercase hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
            >
              發送郵件
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
