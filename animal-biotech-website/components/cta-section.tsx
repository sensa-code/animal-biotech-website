"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const defaultSettings: Record<string, string> = {
  phone: "02-2600-8387",
}

export function CTASection({ settings }: { settings?: Record<string, string> }) {
  const s = settings && Object.keys(settings).length > 0 ? settings : defaultSettings

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-[800px] h-[800px] border border-foreground rounded-full" />
        <div className="absolute w-[600px] h-[600px] border border-foreground rounded-full" />
        <div className="absolute w-[400px] h-[400px] border border-foreground rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-6">
            Your Veterinary Partner
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-8 text-balance">
            為毛小孩打造更好的醫療環境
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            無論您是動物醫院、獸醫師或動物醫療相關從業人員，
            上弦動物生技期待與您合作，共同為台灣的動物醫療環境貢獻力量。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
            >
              聯繫我們
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${s.phone}`}
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground/30 text-foreground text-sm tracking-widest uppercase hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
            >
              立即來電諮詢
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
