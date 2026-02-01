"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Activity, TestTube, Stethoscope, Scissors, type LucideIcon } from "lucide-react"

interface CategoryData {
  id?: number
  slug: string
  icon_name: string
  title: string
  subtitle: string
  description: string
}

const iconMap: Record<string, LucideIcon> = {
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
}

const defaultCategories: CategoryData[] = [
  {
    slug: "diagnostic",
    icon_name: "Activity",
    title: "診斷設備",
    subtitle: "Diagnostic Equipment",
    description: "提供先進的全自動臨床生化分析儀，只需 0.1cc 全血即可在 12 分鐘內完成 22 項生化檢查，大幅提升診斷效率。",
  },
  {
    slug: "rapid",
    icon_name: "TestTube",
    title: "快篩試劑",
    subtitle: "Rapid Test Kits",
    description: "完整的膠體金快篩產品線，涵蓋貓毛滴蟲、犬下痢套組、抗體力價檢測等，協助獸醫師快速準確診斷。",
  },
  {
    slug: "wound",
    icon_name: "Stethoscope",
    title: "傷口護理",
    subtitle: "Wound Care",
    description: "專業的傷口護理產品，包含高濃度銀離子凝膠、藻酸鈣銀敷料等，有效促進傷口癒合並預防感染。",
  },
  {
    slug: "surgical",
    icon_name: "Scissors",
    title: "手術耗材",
    subtitle: "Surgical Supplies",
    description: "提供動物專用組織膠、拋棄式切割吻合器、皮釘等手術耗材，以及專業的電漿滅菌服務。",
  },
]

export function ResearchSection({ categories }: { categories?: CategoryData[] }) {
  const data = categories && categories.length > 0 ? categories : defaultCategories
  const [activeArea, setActiveArea] = useState(data[0].slug)
  const currentArea = data.find((area) => area.slug === activeArea) || data[0]

  return (
    <section id="products" className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">產品服務</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight text-balance">
            完整的動物醫療解決方案
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {data.map((area) => {
            const Icon = iconMap[area.icon_name] || Activity
            return (
              <button
                key={area.slug}
                type="button"
                onClick={() => setActiveArea(area.slug)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-sm tracking-wide transition-all duration-300 border",
                  activeArea === area.slug
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{area.title}</span>
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2">
              {currentArea.subtitle}
            </p>
            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
              {currentArea.title}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {currentArea.description}
            </p>
          </div>

          <div className="order-1 lg:order-2 relative aspect-square max-w-lg mx-auto w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full border border-border/50 rounded-full animate-pulse" style={{ animationDuration: "4s" }} />
            </div>
            <div className="absolute inset-8 flex items-center justify-center">
              <div className="w-full h-full border border-border/30 rounded-full animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
            </div>
            <div className="absolute inset-16 flex items-center justify-center">
              <div className="w-full h-full border border-accent/20 rounded-full animate-pulse" style={{ animationDuration: "2s", animationDelay: "1s" }} />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                {(() => {
                  const Icon = iconMap[currentArea.icon_name] || Activity
                  return <Icon className="w-12 h-12 md:w-16 md:h-16 text-accent" />
                })()}
              </div>
            </div>

            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-foreground/50 rounded-full animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent/70 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-foreground/30 rounded-full animate-ping" style={{ animationDuration: "2.2s" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
