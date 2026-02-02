export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20" />
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl space-y-4">
            <div className="h-4 w-24 bg-secondary animate-pulse" />
            <div className="h-12 w-3/4 bg-secondary animate-pulse" />
            <div className="h-6 w-1/2 bg-secondary animate-pulse" />
          </div>
        </div>
      </section>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-secondary animate-pulse" />
              <div className="h-8 w-2/3 bg-secondary animate-pulse" />
              <div className="h-32 w-full bg-secondary animate-pulse" />
            </div>
            <div className="h-64 bg-secondary animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  )
}
