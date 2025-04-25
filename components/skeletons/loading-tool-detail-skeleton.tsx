// components/skeletons/loading-tool-detail-skeleton.tsx

export default function LoadingToolDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="h-4 w-32 bg-gray-200 rounded mb-6 animate-pulse" />

        {/* Title and Badges */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="w-full">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-10 w-40 bg-purple-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />

            {/* Features */}
            <div className="space-y-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>

            {/* Screenshot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right column (Sidebar) */}
          <div className="space-y-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
