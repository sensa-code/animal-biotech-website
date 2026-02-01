"use client"

import { useEffect, useRef, useState } from "react"

interface StatItem {
  value: number
  suffix: string
  label: string
}

const defaultStats: StatItem[] = [
  { value: 295, suffix: "萬", label: "全台貓狗數量" },
  { value: 12, suffix: "分鐘", label: "生化檢查報告" },
  { value: 22, suffix: "項", label: "單次檢查項目" },
  { value: 100, suffix: "+", label: "合作動物醫院" },
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

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return (
    <div ref={ref} className="font-serif text-5xl md:text-6xl text-foreground">
      {count}{suffix}
    </div>
  )
}

export function AboutSection({ stats }: { stats?: StatItem[] }) {
  const data = stats && stats.length > 0 ? stats : defaultStats

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-20">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">關於上弦</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-6 text-balance">
            以獸醫師角度出發 <br className="hidden md:block" />
            守護動物健康
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            根據統計，2021 年全台貓狗數量達到 295 萬隻，超越 0~14 歲幼年人口 289 萬人。
            隨著毛小孩數量增加，專業醫療需求也大幅增加。上弦動物生技致力於提供動物醫院
            更完善的檢測設備、滅菌服務及醫療耗材，期許為台灣動物醫療環境貢獻一己之力。
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20">
          {data.map((stat, index) => (
            <div
              key={stat.label}
              className="relative p-6 border border-border hover:border-accent/50 transition-colors duration-500 group"
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/30 group-hover:border-accent transition-colors duration-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/30 group-hover:border-accent transition-colors duration-500" />
              <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000 + index * 200} />
              <p className="text-sm text-muted-foreground mt-2 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h3 className="font-serif text-2xl text-foreground mb-4">專業服務</h3>
            <p className="text-muted-foreground leading-relaxed">
              我們提供全方位的動物醫療解決方案，從診斷設備、快篩試劑到手術耗材，
              協助第一線臨床打拼的動物醫院及獸醫師，打造更優質的醫療環境。
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-foreground mb-4">使命願景</h3>
            <p className="text-muted-foreground leading-relaxed">
              上弦動物生技期許在不久的將來，為台灣動物用藥窘境貢獻一己之力，
              持續引進先進的檢測技術與醫療設備，讓每一隻毛小孩都能獲得最好的照護。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
