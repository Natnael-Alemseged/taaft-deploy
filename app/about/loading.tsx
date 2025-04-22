export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between px-4 py-3 bg-white md:px-20">
        <div className="h-6 bg-gray-200 rounded w-40"></div>

        <div className="hidden md:flex items-center space-x-8">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </header>
      {/* Hero Section Skeleton */}
      <section className="bg-white py-16 border-b border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
        </div>
      </section>

      {/* Our Story Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section Skeleton */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-40 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative">
                <div className="bg-gray-100 w-12 h-12 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section Skeleton */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="h-8 bg-gray-200 rounded w-40 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-xl mx-auto mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </section>
    </div>
  )
}
