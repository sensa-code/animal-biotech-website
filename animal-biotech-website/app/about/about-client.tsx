"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
  Shield,
  Heart,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
}

interface StatItem {
  value: number
  suffix: string
  label: string
}

interface CategoryData {
  slug: string
  icon_name: string
  title: string
  subtitle: string
  description: string
}

const defaultStats: StatItem[] = [
  { value: 295, suffix: "萬", label: "全台貓狗數量" },
  { value: 12, suffix: "分鐘", label: "生化檢查報告" },
  { value: 22, suffix: "項", label: "單次檢查項目" },
  { value: 100, suffix: "+", label: "合作動物醫院" },
]

const values = [
  {
    icon: Shield,
    title: "品質至上",
    description: "嚴選每一項產品，確保符合最高品質標準，讓獸醫師能安心使用。",
  },
  {
    icon: Heart,
    title: "以愛為本",
    description: "以對動物的關愛為出發點，每一個決策都以動物福祉為優先考量。",
  },
  {
    icon: Target,
    title: "專業導向",
    description: "深入了解臨床需求，提供最切合實務的醫療解決方案。",
  },
  {
    icon: Zap,
    title: "持續創新",
    description: "積極引進國際先進技術，為台灣動物醫療注入新能量。",
  },
]

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * value))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <div ref={ref} className="font-serif text-4xl md:text-5xl text-foreground">
      {count}{suffix}
    </div>
  )
}

export function AboutPageClient({
  stats,
  categories,
}: {
  stats?: StatItem[]
  categories?: CategoryData[]
}) {
  const data = stats && stats.length > 0 ? stats : defaultStats
  const cats = categories && categories.length > 0 ? categories : []

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 border border-accent rounded-full" />
          <div className="absolute bottom-10 right-20 w-96 h-96 border border-foreground rounded-full" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">About Us</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance">
              關於上弦動物生技
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              以獸醫師角度出發，致力於提供動物醫院完善的檢測設備、滅菌服務及醫療耗材，
              打造更優質的動物醫療環境。
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight mb-6">
                守護每一個毛小孩的健康
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  根據統計，2021 年全台貓狗數量達到 295 萬隻，超越 0~14 歲幼年人口 289 萬人。
                  隨著毛小孩數量增加，專業醫療需求也大幅增加。
                </p>
                <p>
                  上弦動物生技深知第一線獸醫師的辛勞與挑戰，因此我們從獸醫師的角度出發，
                  嚴選國際優質的動物醫療產品，從全自動生化分析儀、快篩試劑、傷口護理用品到手術耗材，
                  提供一站式的醫療解決方案。
                </p>
                <p>
                  我們期許在不久的將來，能為台灣動物用藥窘境貢獻一己之力，
                  讓每一隻毛小孩都能獲得最好的照護。
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-accent/5 -rotate-3" />
              <div className="relative bg-card border border-border p-8 lg:p-12">
                <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic mb-6">
                  &ldquo;協助第一線臨床打拼的動物醫院及獸醫師，打造更優質的醫療環境。&rdquo;
                </blockquote>
                <p className="text-sm text-accent tracking-wide">— 上弦動物生技 創辦理念</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 md:py-32 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">By The Numbers</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
              數字會說話
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {data.map((stat, index) => (
              <div
                key={stat.label}
                className="relative p-6 border border-border hover:border-accent/50 transition-colors duration-500 group text-center"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/30 group-hover:border-accent transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/30 group-hover:border-accent transition-colors duration-500" />
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000 + index * 200} />
                <p className="text-sm text-muted-foreground mt-2 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">Our Values</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
              核心價值
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item) => (
              <div
                key={item.title}
                className="p-8 border border-border hover:border-accent/50 transition-all duration-500 group"
              >
                <div className="w-12 h-12 bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      {cats.length > 0 && (
        <section className="py-24 md:py-32 bg-card">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">Our Services</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                服務項目
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {cats.map((cat) => {
                const Icon = iconMap[cat.icon_name] || Activity
                return (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="group p-8 border border-border hover:border-accent/50 transition-all duration-500"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-accent mb-1">{cat.subtitle}</p>
                        <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                        <span className="inline-flex items-center gap-2 mt-4 text-sm text-foreground group-hover:text-accent transition-colors">
                          查看產品 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            想了解更多？
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            歡迎與我們聯繫，讓我們為您提供最適合的動物醫療解決方案
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
            >
              聯繫我們
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground/30 text-foreground text-sm tracking-widest uppercase hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
            >
              瀏覽產品
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
