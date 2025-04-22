"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, ChevronDown, Search, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { useTools } from "@/hooks/use-tools"
import { useCategories } from "@/hooks/use-categories"
import {Footer} from "react-day-picker";

export default function BrowseTools() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 12

  // Fetch tools with React Query
  const {
    data: toolsData,
    isLoading,
    isError,
  } = useTools({
    category: selectedCategory !== "All Categories" ? selectedCategory.toLowerCase() : undefined,
    search: searchQuery,
    page,
    limit,
  })

  // Fetch categories with React Query
  const { data: categoriesData } = useCategories()

  // Prepare categories for dropdown
  const categories = ["All Categories", ...(categoriesData?.map((cat) => cat.name) || [])]

  const getBadgeClass = (label: string) => {
    switch (label) {
      case "Premium":
        return "bg-yellow-100 text-yellow-600"
      case "Free":
        return "bg-green-100 text-green-600"
      case "Featured":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getCategoryClass = (category: string) => {
    switch (category) {
      case "Image Generation":
        return "bg-purple-100 text-purple-600"
      case "Development":
        return "bg-blue-100 text-blue-600"
      case "Writing":
        return "bg-pink-100 text-pink-600"
      case "Audio":
        return "bg-green-100 text-green-600"
      case "Data & Analytics":
        return "bg-indigo-100 text-indigo-600"
      case "Video":
        return "bg-red-100 text-red-600"
      case "Language":
        return "bg-violet-100 text-violet-600"
      case "Business":
        return "bg-orange-100 text-orange-600"
      case "Design":
        return "bg-teal-100 text-teal-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header is already included in the layout */}

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse AI Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover and compare the best AI tools for your needs</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/2">
            <Input
              type="text"
              placeholder="Search for tools..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <button
              className="flex items-center justify-between w-full md:w-48 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category} className="px-2">
                      <button
                        className={`flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedCategory === category ? "font-medium" : ""
                        }`}
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowCategoryDropdown(false)
                        }}
                      >
                        {selectedCategory === category && (
                          <svg
                            className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                        <span className={selectedCategory === category ? "ml-0" : "ml-6"}>{category}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tool Count */}
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {isLoading
            ? "Loading tools..."
            : isError
              ? "Error loading tools"
              : `Showing ${toolsData?.tools.length || 0} of ${toolsData?.total || 0} tools`}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Failed to load tools</div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Tools Grid */}
        {!isLoading && !isError && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {toolsData?.tools.map((tool) => (
              <Card
                key={tool.id}
                className="max-w-sm overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg w-full mx-auto"
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryClass(tool.category)}`}
                        >
                          {tool.category}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}>
                          {tool.pricing === "free" ? "Free" : "Premium"}
                        </span>
                      </div>
                    </div>

                    <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {tool.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs text-gray-600 dark:text-gray-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                        asChild
                      >
                        <Link href={`/tools/${tool.id}`}>Try Tool</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && toolsData && toolsData.total > limit && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-200 dark:border-gray-700"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= toolsData.total}
                className="border-gray-200 dark:border-gray-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
