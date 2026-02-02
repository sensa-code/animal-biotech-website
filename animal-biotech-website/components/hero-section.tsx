"use client"

import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

interface HeroData {
  title: string
  subtitle: string
  description: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
  cta_secondary_link: string
}

const defaultHero: HeroData = {
  title: "專業動物醫療設備與耗材",
  subtitle: "Professional Veterinary Solutions",
  description: "上弦動物生技以獸醫師的角度為出發點，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材，致力打造更優質的動物醫療環境。",
  cta_primary_text: "主打產品",
  cta_primary_link: "/products",
  cta_secondary_text: "了解更多",
  cta_secondary_link: "/about",
}

export function HeroSection({ hero }: { hero?: HeroData | null }) {
  const data = hero || defaultHero
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const particles: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      alpha: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(140, 200, 180, ${0.15 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(140, 200, 180, ${particle.alpha})`
        ctx.fill()
      })

      drawConnections()
      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "linear-gradient(180deg, rgba(18,22,35,1) 0%, rgba(12,15,25,1) 100%)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {data.subtitle}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          <span className="block text-balance">{data.title}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
          <a
            href={data.cta_primary_link}
            className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent hover:text-background transition-all duration-300"
          >
            {data.cta_primary_text}
          </a>
          <a
            href={data.cta_secondary_link}
            className="inline-flex items-center justify-center px-8 py-4 border border-foreground/30 text-foreground text-sm tracking-widest uppercase hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
          >
            {data.cta_secondary_text}
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  )
}
