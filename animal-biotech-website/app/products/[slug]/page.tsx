import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSiteSettings, getProductCategories } from "@/lib/queries"
import { getProductBySlug } from "@/lib/queries"
import { defaultProductCategories } from "@/lib/defaults"
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Activity,
  TestTube,
  Stethoscope,
  Scissors,
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    // Try fallback
    for (const cat of defaultProductCategories) {
      const p = cat.products.find((p) => p.id === slug)
      if (p) {
        return {
          title: `${p.name} | 上弦動物生技`,
          description: p.description,
        }
      }
    }
    return { title: "產品未找到 | 上弦動物生技" }
  }

  return {
    title: `${product.name} | 上弦動物生技`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [dbProduct, settings, categories] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
    getProductCategories(),
  ])

  // Try DB first, then fallback
  let product: {
    name: string
    model: string
    description: string
    features: string[]
    specs: Record<string, string>
    highlight?: boolean
    image?: string | null
    category_title?: string
    category_subtitle?: string
    category_slug?: string
    category_icon?: string
  } | null = null

  if (dbProduct) {
    product = {
      name: dbProduct.name,
      model: dbProduct.model || "",
      description: dbProduct.description,
      features: Array.isArray(dbProduct.features) ? dbProduct.features : [],
      specs: (typeof dbProduct.specs === "object" && dbProduct.specs !== null ? dbProduct.specs : {}) as Record<string, string>,
      highlight: dbProduct.is_highlighted || false,
      image: dbProduct.image || null,
      category_title: dbProduct.category_title,
      category_subtitle: dbProduct.category_subtitle,
      category_slug: dbProduct.category_slug,
      category_icon: dbProduct.category_icon,
    }
  } else {
    // Fallback to defaults
    for (const cat of defaultProductCategories) {
      const p = cat.products.find((p) => p.id === slug)
      if (p) {
        product = {
          name: p.name,
          model: p.model,
          description: p.description,
          features: p.features,
          specs: p.specs,
          highlight: p.highlight,
          category_title: cat.title,
          category_subtitle: cat.subtitle,
          category_slug: cat.id,
          category_icon: cat.icon_name,
        }
        break
      }
    }
  }

  if (!product) notFound()

  const CategoryIcon = iconMap[product.category_icon || ""] || Activity

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="pt-28 pb-4 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">首頁</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">產品</Link>
            {product.category_title && (
              <>
                <span>/</span>
                <span className="text-foreground">{product.category_title}</span>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* Product Hero */}
      <section className="pb-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-96 h-96 border border-accent rounded-full" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="flex items-center gap-4 mb-6">
            {product.category_title && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-sm">
                <CategoryIcon className="w-4 h-4 text-accent" />
                <span className="text-accent tracking-wide">{product.category_title}</span>
              </div>
            )}
            {product.highlight && (
              <span className="px-3 py-1 bg-accent text-background text-xs tracking-wider uppercase">
                主打推薦
              </span>
            )}
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">{product.model}</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
            {product.name}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {product.description}
          </p>

          {product.image && (
            <div className="mt-10">
              <div className="relative w-full max-w-lg aspect-[4/3] bg-secondary/30 overflow-hidden border border-border">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 512px"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Details */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Features */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-foreground mb-8">產品特色</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-4 p-4 border border-border hover:border-accent/50 transition-colors"
                  >
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div>
              <h2 className="font-serif text-2xl text-foreground mb-8">產品規格</h2>
              <div className="border border-border divide-y divide-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="p-4">
                    <dt className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{key}</dt>
                    <dd className="text-foreground">{value}</dd>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="mt-8 p-6 bg-card border border-border">
                <h3 className="font-serif text-lg text-foreground mb-3">需要更多資訊？</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  歡迎與我們聯繫，取得詳細報價或產品資料
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
                >
                  詢問產品
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Products */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回產品列表
          </Link>
        </div>
      </section>

      <Footer settings={settings} categories={categories} />
    </main>
  )
}
