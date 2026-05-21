export default function MenuLoading() {
  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="h-16 bg-card rounded-2xl w-64 mx-auto animate-pulse" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-16 bg-bg py-3 z-30">
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-24 bg-card rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-full sm:w-48 bg-card rounded-full animate-pulse" />
        </div>

        <div className="space-y-10 w-full mt-10">
          {[1, 2].map(cat => (
            <div key={cat} className="w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 bg-card rounded-full animate-pulse" />
                <div className="h-8 w-40 bg-card rounded-lg animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
                    <div className="w-full aspect-square bg-bg rounded-xl mb-4" />
                    <div className="h-5 w-3/4 bg-bg rounded mb-2" />
                    <div className="h-3 w-full bg-bg rounded mb-1" />
                    <div className="h-3 w-2/3 bg-bg rounded mb-4" />
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <div className="h-5 w-16 bg-bg rounded" />
                      <div className="h-4 w-12 bg-bg rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
