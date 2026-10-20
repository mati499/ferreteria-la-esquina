export default function CatalogLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-32 rounded-md bg-secondary animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-secondary animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 w-full rounded-lg bg-secondary animate-pulse" />
              <div className="h-4 w-24 rounded-md bg-secondary animate-pulse" />
              <div className="h-4 w-16 rounded-md bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
