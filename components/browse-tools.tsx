// BrowseTools.tsx
"use client" // Keep the directive

import React, { useState, useEffect } from "react" // Keep useState, need useEffect for initial category from URL
import Link from "next/link"
import { Search, ChevronDown, ArrowLeft } from "lucide-react" // Import icons
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Assuming this is your Input component

// Import hooks
import { useTools } from "@/hooks/use-tools"
import { useCategories } from "@/hooks/use-categories"

// Import reusable ToolCard component
import ToolCard from "@/components/tool-card"
// Import Category type (assuming it's updated)
import type { Category } from "@/types/category"

// Import Next.js router hooks to read query parameters
import { useRouter, useSearchParams, usePathname } from "next/navigation" // Correct import for App Router

// You might need a Footer component import
// import Footer from "@/components/footer";

export default function BrowseTools() {
  // Use router hooks for URL query parameters
  const router = useRouter()
  const searchParams = useSearchParams() // Hook to read query params
  const pathname = usePathname()

  // State for search, category filter, and pagination
  const [searchQuery, setSearchQuery] = useState("")
  // Initialize selected category from URL query param on mount
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 12 // Items per page

  // --- Sync state with URL query parameter for category ---
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      // Find the category by slug to get the correct case/name if needed
      // Or just use the slug directly if that's what the API expects
      // For now, let's just set the state with the slug from the URL
      setSelectedCategory(categoryFromUrl)
      // Optional: You could validate the slug against fetched categoriesData
    } else {
      // If no category param in URL, ensure state is "All Categories"
      setSelectedCategory("All Categories")
    }
    // Note: Adding searchParams to dependency array here could cause issues
    // if you are also updating searchParams from this component.
    // We primarily want to read the initial value on mount or when URL changes externally.
    // Let's keep the dependency array empty to only read on initial mount.
    // If you want the page to update when the URL changes (e.g., user clicks browser back/forward after clicking category link),
    // you might need searchParams as a dependency, but handle it carefully.
  }, [searchParams]) // Add searchParams to re-sync if URL changes

  // --- Fetch tools with React Query ---
  const {
    data: toolsData,
    isLoading,
    isError,
    // React Query gives us a refetch function if needed
    refetch,
  } = useTools({
    // Pass parameters to the useTools hook
    // category: selectedCategory !== "All Categories" ? selectedCategory.toLowerCase() : undefined,
    // It's better to pass the slug directly if your API uses slugs
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined, // Pass the slug/value directly
    search: searchQuery,
    page, // Pass the current page number
    limit, // Pass the limit per page
  })

  // --- Fetch categories with React Query ---
  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories()

  // --- Prepare categories for the dropdown ---
  // The dropdown list needs to include "All Categories" and the fetched categories
  // Use useMemo to avoid recreating this array on every render if categoriesData doesn't change
  const categoryDropdownList = React.useMemo(() => {
    const allCats = [
      {
        id: "all",
        name: "All Categories",
        slug: "all-categories",
        count: toolsData?.total || 0,
        imageUrl: "" /* or iconName */,
      },
    ] // Add a representation for "All Categories"
    if (!categoriesData) return allCats
    // Assuming categoriesData is an array of Category objects { id, name, slug, count, imageUrl/iconName }
    return [...allCats, ...categoriesData]
  }, [categoriesData, toolsData?.total]) // Recreate if categoriesData or total tool count changes

  // --- Handlers for UI interactions ---

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(1) // Reset to first page on new search
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`) // Use pathname from usePathname hook
  }

  const handleCategorySelect = (category: Category | { name: string; slug: string }) => {
    // If the selected category is the current one, toggle dropdown visibility
    if (selectedCategory === category.slug) {
      setShowCategoryDropdown(false)
      return
    }
    setSelectedCategory(category.slug) // Update selected category state with slug
    setPage(1) // Reset to first page on new category selection
    setShowCategoryDropdown(false) // Close dropdown

    // Optional: Update URL query parameter when category changes
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (category.slug === "all-categories") {
      current.delete("category") // Remove param for "All Categories"
    } else {
      current.set("category", category.slug) // Set param for selected category
    }
    // Use replace instead of push so it doesn't add to browser history heavily
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`) // Use pathname from usePathname hook
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Optional: Update URL query parameter for page if needed
    // This makes pagination state shareable via URL
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (newPage === 1) {
      current.delete("page")
    } else {
      current.set("page", newPage.toString())
    }
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`) // Use pathname from usePathname hook
  }

  // --- Calculate pagination details ---
  const totalTools = toolsData?.total || 0
  const totalPages = Math.ceil(totalTools / limit)
  const showPagination = totalTools > limit

  // --- Determine text for tool count display ---
  const toolCountText = isLoading
    ? "Loading tools..."
    : isError
      ? "Error loading tools"
      : totalTools === 0
        ? `No tools found${selectedCategory !== "All Categories" || searchQuery ? " for your criteria" : ""}` // More specific empty state
        : `Showing ${toolsData?.tools.length || 0} of ${totalTools} tools`

  // --- Conditional Rendering for Loading, Error, Content ---

  return (
      <div className="min-h-screen bg-white dark:bg-gray-950"> {/* Added dark mode */}
        {/* Header is already in layout, this page focuses on content */}
        {/* Assuming Header is rendered elsewhere */}
        {/* <Header /> */}

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb - Back to Home */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#a855f7] dark:text-purple-400 mb-6 hover:text-[#9333ea] dark:hover:text-purple-300"> {/* Added dark mode & hover */}
              <ArrowLeft className="mr-2 h-5 w-5" /> {/* Adjusted size for consistency */}
              Back to Home
            </Link>
          </div>


          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-1">Browse AI Tools</h1> {/* Added dark mode */}
            <p className="text-[#6b7280] dark:text-gray-400">Discover and compare the best AI tools for your needs</p> {/* Added dark mode */}
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-600" /> {/* Added dark mode */}
              </div>
              <Input
                  type="text"
                  placeholder="Search for tools..."
                  className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-500" // Added dark modes
                  value={searchQuery}
                  onChange={handleSearchChange}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full md:w-48"> {/* Added width */}
              <button
                  className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none text-gray-900 dark:text-white" // Added dark modes, text color
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  disabled={isLoadingCategories || isErrorCategories} // Disable while categories are loading or errored
              >
                <span>{categoryDropdownList.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}</span> {/* Display name, fallback to slug */}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showCategoryDropdown ? 'rotate-180' : 'rotate-0'} text-gray-500 dark:text-gray-400`} /> {/* Added animation, dark mode */}
              </button>

              {/* Dropdown Menu */}
              {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"> {/* Added max height, dark modes */}
                    <div className="py-1">
                      {isLoadingCategories ? (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading categories...</div> // Loading message
                      ) : isErrorCategories ? (
                          <div className="px-4 py-2 text-sm text-red-600">Error loading categories.</div> // Error message
                      ) : (
                          // Map over the prepared category list
                          categoryDropdownList.map((category) => (
                              <button
                                  key={category.slug} // Use slug as key
                                  onClick={() => handleCategorySelect(category)} // Call handler on click
                                  className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      selectedCategory === category.slug ? "font-medium bg-gray-50 dark:bg-gray-700" : "" // Highlight selected
                                  }`} // Added dark modes
                              >
                                <span>{category.name}</span>
                                {/* Display tool count */}

                                {typeof category.count === 'number' && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400\">{category.count}</span> {/* Added dark mode */}
                                  )}
                              </button>
                          ))
                      )}
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Tool Count Display */}
          <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-6"> {/* Added dark mode */}
            {toolCountText} {/* Display dynamic count text */}
          </p>

          {/* Conditional Rendering for Loading, Error, and Tools Grid */}
          {isLoading && (
              // Loading spinner
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
          )}

          {isError && !isLoading && (
              // Error message (handled by toolCountText, but could add a more prominent block)
              <div className="text-center py-12">
                <div className="mb-4 text-red-600 dark:text-red-500">
                  <p className="text-lg font-semibold">Failed to load tools</p>
                  <p className="mt-2">There was an error connecting to the server. Please try again later.</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Retry
                </Button>
              </div>
          )}

          {!isLoading && !isError && toolsData?.tools && toolsData.tools.length > 0 && (
              // Tools Grid - Map over fetched data
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {toolsData.tools.map((tool) => (
                    // Use the reusable ToolCard component
                    <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
          )}

          {/* Empty state after loading */}
          {!isLoading && !isError && (!toolsData?.tools || toolsData.tools.length === 0) && (
              <div className="text-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                  <p className="text-lg font-semibold">No tools found</p>
                  {(selectedCategory !== "All Categories" || searchQuery) ? (
                    <>
                      <p className="mt-2">Try adjusting your search criteria or filters.</p>
                      <Button 
                        onClick={() => {
                          // Reset all filters
                          setSelectedCategory("All Categories");
                          setSearchQuery("");
                          // Update URL
                          router.replace(pathname);
                        }} 
                        variant="outline"
                        className="mt-4 border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Clear all filters
                      </Button>
                    </>
                  ) : (
                    <p className="mt-2">There are currently no tools in our database.</p>
                  )}
                </div>
              </div>
          )}


          {/* Pagination */}
          {/* Show pagination only if needed */}
          {!isLoading && !isError && showPagination && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {/* Previous Button */}
                  <Button
                      variant="outline" // Assuming 'outline' variant exists
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" // Added dark mode, disabled styles
                  >
                    Previous
                  </Button>
                  {/* Next Button */}
                  <Button
                      variant="outline" // Assuming 'outline' variant exists
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" // Added dark mode, disabled styles
                  >
                    Next
                  </Button>
                </div>
              </div>
          )}
        </main>

        {/* Assuming Footer is rendered elsewhere */}
        {/* <Footer /> */}
      </div>
  );
}
