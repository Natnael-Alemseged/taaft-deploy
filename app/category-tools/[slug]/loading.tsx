export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>

        <div className="h-10 w-64 bg-gray-200 rounded mb-1"></div>
        <div className="h-6 w-96 bg-gray-200 rounded mb-8"></div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 w-full md:w-48 bg-gray-200 rounded"></div>
        </div>

        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

              <div className="flex gap-2 mb-2">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>

              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
