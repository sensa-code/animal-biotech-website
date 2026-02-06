"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "關於上弦", href: "/about" },
  { label: "產品服務", href: "/products" },
  { label: "產品驗證", href: "/trace" },
  { label: "聯絡我們", href: "/contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
              <svg
                viewBox="0 0 40 40"
                className="relative w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" className="text-accent" />
                <path
                  d="M20 8C20 8 28 14 28 22C28 26.4183 24.4183 30 20 30C15.5817 30 12 26.4183 12 22C12 14 20 8 20 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-foreground"
                />
                <circle cx="20" cy="20" r="4" fill="currentColor" className="text-accent" />
              </svg>
            </div>
            <span className="font-serif text-xl tracking-wide text-foreground">上弦動物生技</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background tracking-widest text-xs uppercase px-6 bg-transparent"
              >
                聯繫我們
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        role="navigation"
        aria-label="主選單"
        className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            <Button
              variant="outline"
              className="mt-4 w-full border-foreground/30 text-foreground hover:bg-foreground hover:text-background tracking-widest text-xs uppercase bg-transparent"
            >
              聯繫我們
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
