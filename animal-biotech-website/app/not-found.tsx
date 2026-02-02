import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-32 flex items-center justify-center min-h-[70vh]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <span className="font-serif text-[10rem] md:text-[14rem] leading-none text-foreground/5 select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border border-accent/30 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border border-accent/50 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">Page Not Found</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              找不到此頁面
            </h1>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto">
              您要找的頁面不存在或已被移動。請確認網址是否正確，或返回首頁瀏覽。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                返回首頁
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-8 py-4 border border-foreground/30 text-foreground text-sm tracking-widest uppercase hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                瀏覽產品
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
