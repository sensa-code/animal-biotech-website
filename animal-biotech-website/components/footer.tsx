"use client"

import Link from "next/link"
import { Linkedin, Twitter } from "lucide-react"

interface CategoryData {
  slug: string
  title: string
}

const defaultSettings: Record<string, string> = {
  phone: "02-2600-8387",
  email: "service@senbio.tech",
  address: "新北市林口區忠福路131號",
  website_url: "www.senbio.tech",
  company_description: "以獸醫師角度出發，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材，致力打造更優質的動物醫療環境。",
}

const companyLinks = [
  { label: "關於上弦", href: "/about" },
  { label: "產品服務", href: "/products" },
  { label: "聯絡我們", href: "/contact" },
]

export function Footer({
  settings,
  categories,
}: {
  settings?: Record<string, string>
  categories?: CategoryData[]
}) {
  const s = settings && Object.keys(settings).length > 0 ? settings : defaultSettings
  const defaultCategories: CategoryData[] = [
    { slug: "diagnostic", title: "診斷設備" },
    { slug: "rapid", title: "快篩試劑" },
    { slug: "wound", title: "傷口護理" },
    { slug: "surgical", title: "手術耗材" },
  ]
  const cats = categories && categories.length > 0 ? categories : defaultCategories

  const contactLinks = [
    { label: s.phone, href: `tel:${s.phone}` },
    { label: s.email, href: `mailto:${s.email}` },
    { label: s.address, href: "#contact" },
    { label: s.website_url, href: `https://${s.website_url}` },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <svg
                  viewBox="0 0 40 40"
                  className="w-full h-full"
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
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              {s.company_description}
            </p>
            <div className="flex items-center gap-4">
              {/* TODO: Replace href="#" with real LinkedIn URL */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              {/* TODO: Replace href="#" with real Twitter URL */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-6">公司</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-6">產品分類</h4>
            <ul className="space-y-3">
              {cats.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-6">聯絡資訊</h4>
            <ul className="space-y-3">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    {...(link.href.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 上弦動物生技有限公司. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              隱私政策
            </span>
            <span className="text-xs text-muted-foreground">
              使用條款
            </span>
            <span className="text-xs text-muted-foreground">
              Cookie 設定
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
