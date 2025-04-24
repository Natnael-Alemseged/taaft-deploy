// Categories.tsx
"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
// Import the useCategories hook
import { useCategories } from "@/hooks/use-categories"
// Import the reusable CategoryCard component
import CategoryCard from "@/components/category-card"
// You might need a loading spinner component
// import LoadingSpinner from "@/components/loading-spinner";
// You might need an error message component
// import ErrorMessage from "@/components/error-message";

export default function Categories() {
  // Use the hook to fetch ALL categories
  const { data: categoriesData, isLoading, isError } = useCategories()

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center">
        {" "}
        {/* Added dark mode */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p> {/* Added dark mode */}
      </div>
    )
  }

  // Render error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center text-red-600">
        {" "}
        {/* Added dark mode */}
        <p className="mb-4">Failed to load categories.</p>
        {/* Optional: Retry button */}
        {/* <button onClick={() => window.location.reload()}>Retry</button> */}
      </div>
    )
  }

  // Render empty state if no categories are found after loading
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
        {" "}
        {/* Added dark mode */}
        <p>No categories found.</p>
      </div>
    )
  }

  // Render the categories grid if data is loaded and no error
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {" "}
      {/* Added dark mode */}
      {/* Header is already in layout, this page focuses on content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-[#a855f7] dark:text-purple-400 mb-6 hover:text-[#9333ea] dark:hover:text-purple-300"
        >
          {" "}
          {/* Added dark mode & hover */}
          <ArrowLeft className="mr-2 h-5 w-5" /> {/* Adjusted size for consistency */}
          Back to Home
        </Link>
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-1">All Categories</h1>{" "}
        {/* Added dark mode */}
        <p className="text-[#6b7280] dark:text-gray-400 mb-8">
          {" "}
          {/* Added dark mode */}
          Browse our comprehensive collection of AI tool categories to find exactly what you need.
        </p>
        {/* Categories Grid - Map over ALL fetched categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>
      {/* Assuming Footer is rendered elsewhere or needs to be imported */}
      {/* <Footer /> */}
    </div>
  )
}
