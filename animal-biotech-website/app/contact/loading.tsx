export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20" />
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl space-y-4">
            <div className="h-4 w-24 bg-secondary animate-pulse" />
            <div className="h-12 w-1/2 bg-secondary animate-pulse" />
            <div className="h-6 w-2/3 bg-secondary animate-pulse" />
          </div>
        </div>
      </section>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-8 w-40 bg-secondary animate-pulse" />
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-secondary animate-pulse" />
                ))}
              </div>
              <div className="h-32 bg-secondary animate-pulse" />
              <div className="h-12 w-40 bg-secondary animate-pulse" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 w-32 bg-secondary animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-secondary animate-pulse" />
                    <div className="h-5 w-full bg-secondary animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
