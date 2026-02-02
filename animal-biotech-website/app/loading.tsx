export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border border-accent/30 rounded-full animate-ping" />
          <div className="absolute inset-2 border border-accent/50 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-accent rounded-full" />
          </div>
        </div>
        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">Loading</p>
      </div>
    </div>
  )
}
