// BrowseTools.tsx
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTools } from "@/hooks/use-tools"
import { useCategories } from "@/hooks/use-categories"
import ToolCard from "@/components/cards/tool-card"
import type { Category } from "@/types/category"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useDebounce } from 'use-debounce'

export default function BrowseTools() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // State management
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 12

  // Sync URL params with state
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    const searchFromUrl = searchParams.get("search")
    const pageFromUrl = searchParams.get("page")

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    } else {
      setSelectedCategory("All Categories")
    }

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }

    if (pageFromUrl) {
      setPage(Number(pageFromUrl))
    }
  }, [searchParams])

  // Tool params with memoization
  const toolParams = React.useMemo(() => ({
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    search: debouncedSearchQuery.trim() || undefined,
    page,
    limit,
  }), [selectedCategory, debouncedSearchQuery, page, limit])

  // Fetch tools and categories
  const {
    data: toolsData,
    isLoading,
    isError,
    refetch,
  } = useTools(toolParams)

  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories()

  // Prepare categories dropdown
  const categoryDropdownList = React.useMemo(() => {
    const allCats = [{
      id: "all",
      name: "All Categories",
      slug: "all-categories",
      count: toolsData?.total || 0,
      imageUrl: "",
    }]
    if (!categoriesData) return allCats
    return [...allCats, ...categoriesData]
  }, [categoriesData, toolsData?.total])

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value
    setSearchQuery(newSearchQuery)
    setPage(1)
  }

  useEffect(() => {
    // Update URL when debounced search query changes
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (debouncedSearchQuery) {
      current.set("search", debouncedSearchQuery)
    } else {
      current.delete("search")
    }

    current.delete("page")
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`, { scroll: false })
  }, [debouncedSearchQuery])

  const handleCategorySelect = (category: Category | { name: string; slug: string }) => {
    if (selectedCategory === category.slug) {
      setShowCategoryDropdown(false)
      return
    }

    setSelectedCategory(category.slug)
    setPage(1)
    setShowCategoryDropdown(false)

    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (category.slug === "all-categories") {
      current.delete("category")
    } else {
      current.set("category", category.slug)
    }

    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (newPage === 1) {
      current.delete("page")
    } else {
      current.set("page", newPage.toString())
    }
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`)
  }

  // UI calculations
  const totalTools = toolsData?.total || 0
  const totalPages = Math.ceil(totalTools / limit)
  const showPagination = totalTools > limit

  const toolCountText = isLoading
      ? "Loading tools..."
      : isError
          ? "Error loading tools"
          : totalTools === 0
              ? `No tools found${selectedCategory !== "All Categories" || searchQuery ? " for your criteria" : ""}`
              : `Showing ${toolsData?.tools.length || 0} of ${totalTools} tools`

  return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#a855f7] dark:text-purple-400 mb-6 hover:text-[#9333ea] dark:hover:text-purple-300">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-1">Browse AI Tools</h1>
            <p className="text-[#6b7280] dark:text-gray-400">Discover and compare the best AI tools for your needs</p>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-600" />
              </div>
              <Input
                  type="text"
                  placeholder="Search for tools..."
                  className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
              />
              {isLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
              )}
            </div>

            <div className="relative w-full md:w-48">
              <button
                  className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none text-gray-900 dark:text-white"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  disabled={isLoadingCategories || isErrorCategories}
              >
                <span>{categoryDropdownList.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}</span>
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showCategoryDropdown ? 'rotate-180' : 'rotate-0'} text-gray-500 dark:text-gray-400`} />
              </button>

              {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      {isLoadingCategories ? (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading categories...</div>
                      ) : isErrorCategories ? (
                          <div className="px-4 py-2 text-sm text-red-600">Error loading categories.</div>
                      ) : (
                          categoryDropdownList.map((category) => (
                              <button
                                  key={category.slug}
                                  onClick={() => handleCategorySelect(category)}
                                  className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      selectedCategory === category.slug ? "font-medium bg-gray-50 dark:bg-gray-700" : ""
                                  }`}
                              >
                                <span>{category.name}</span>
                                {typeof category.count === 'number' && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{category.count}</span>
                                )}
                              </button>
                          ))
                      )}
                    </div>
                  </div>
              )}
            </div>
          </div>

          <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-6">
            {toolCountText}
          </p>

          {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
          )}

          {isError && !isLoading && (
              <div className="text-center py-12">
                <div className="mb-4 text-red-600 dark:text-red-500">
                  <p className="text-lg font-semibold">Failed to load tools</p>
                  <p className="mt-2">There was an error connecting to the server. Please try again later.</p>
                </div>
                <Button
                    onClick={() => refetch()}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Retry
                </Button>
              </div>
          )}

          {!isLoading && !isError && toolsData?.tools && toolsData.tools.length > 0 && (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {toolsData.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
          )}

          {!isLoading && !isError && (!toolsData?.tools || toolsData.tools.length === 0) && (
              <div className="text-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                  <p className="text-lg font-semibold">No tools found</p>
                  {(selectedCategory !== "All Categories" || searchQuery) ? (
                      <>
                        <p className="mt-2">Try adjusting your search criteria or filters.</p>
                        <Button
                            onClick={() => {
                              setSelectedCategory("All Categories")
                              setSearchQuery("")
                              router.replace(pathname)
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

          {!isLoading && !isError && showPagination && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
          )}
        </main>
      </div>
  )
}