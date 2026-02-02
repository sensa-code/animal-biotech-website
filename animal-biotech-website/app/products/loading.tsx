export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header placeholder */}
      <div className="h-20" />

      {/* Hero skeleton */}
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl space-y-4">
            <div className="h-4 w-32 bg-secondary animate-pulse" />
            <div className="h-12 w-3/4 bg-secondary animate-pulse" />
            <div className="h-6 w-1/2 bg-secondary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Category nav skeleton */}
      <div className="border-b border-border py-4">
        <div className="container mx-auto px-6 lg:px-12 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 bg-secondary animate-pulse" />
          ))}
        </div>
      </div>

      {/* Product cards skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border p-8 lg:p-12">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 w-24 bg-secondary animate-pulse" />
                  <div className="h-8 w-2/3 bg-secondary animate-pulse" />
                  <div className="h-20 w-full bg-secondary animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-20 bg-secondary animate-pulse" />
                  <div className="h-6 w-full bg-secondary animate-pulse" />
                  <div className="h-6 w-3/4 bg-secondary animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
