export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 max-w-xl mx-auto mb-5"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>

        {/* Mobile Alphabetical Navigation Skeleton */}
        <div className="md:hidden mb-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-12 bg-gray-50 flex items-center justify-between p-3">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Sidebar Skeleton */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-8">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="md:col-span-3">
            {[...Array(3)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="mb-10">
                <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>

                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {[...Array(2)].map((_, cardIndex) => (
                    <div key={cardIndex} className="border border-gray-200 rounded-lg p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
