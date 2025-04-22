"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, Grid, List, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "@/components/ui/footer"
import { useSearchTools } from "@/hooks/use-search"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { useAuth } from "@/contexts/auth-context"
import type { Tool } from "@/types/tool"

interface SearchResultsProps {
  query: string
  category: string
}

export default function SearchResults({ query, category }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category] : [])
  const [selectedPricing, setSelectedPricing] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const limit = 12
  const { isAuthenticated } = useAuth()

  // Convert selected categories and pricing to query format
  const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(",") : undefined
  const pricingParam = selectedPricing.length > 0 ? selectedPricing.join(",") : undefined

  // Use the search API
  const { data, isLoading, isError } = useSearchTools({
    query,
    category: categoryParam,
    pricing: pricingParam,
    page,
    limit,
  })

  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
    setPage(1) // Reset to first page when changing filters
  }

  const togglePricing = (price: string) => {
    setSelectedPricing((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]))
    setPage(1) // Reset to first page when changing filters
  }

  const handleSaveToggle = (tool: Tool) => {
    if (!isAuthenticated) {
      // Handle unauthenticated state (e.g., show login prompt)
      return
    }

    if (tool.savedByUser) {
      unsaveTool.mutate(tool.id)
    } else {
      saveTool.mutate(tool.id)
    }
  }

  const title = query
    ? `Search results for "${query}"`
    : category
      ? `Recommended AI Tools for ${category}`
      : "Recommended AI Tools"

  const getBadgeClass = (label: string) => {
    switch (label) {
      case "premium":
      case "subscription":
      case "one-time":
      case "usage-based":
        return "bg-yellow-100 text-yellow-600"
      case "free":
      case "freemium":
        return "bg-green-100 text-green-600"
      case "featured":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Use the memoized categories list from the query response or defaults
  const categories = data?.categories || [
    "Image Generation",
    "Text Generation",
    "Development",
    "Voice Synthesis",
    "Data Visualization",
    "Video Creation",
    "Chatbots",
  ]

  // Use the memoized pricing options from the query response or defaults
  const pricing = data?.pricingOptions || ["free", "freemium", "subscription", "one-time", "usage-based"]

  // Helper function to format pricing option label
  const formatPricingLabel = (pricing: string): string => {
    return pricing.charAt(0).toUpperCase() + pricing.slice(1).replace("-", " ")
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Search</span>
          </div>
        </div>

        {/* AI Assistant message */}
        <div className="mb-8 rounded-lg border border-purple-100 bg-purple-50 p-4">
          <div className="flex items-start">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <span className="text-sm font-medium text-purple-600">AI</span>
            </div>
            <div>
              <div className="font-medium">AI Assistant</div>
              <p className="text-sm text-gray-700">
                {query
                  ? `Here are the search results for "${query}". You can refine your search using the filters.`
                  : category
                    ? `Here are the recommended tools for ${category}. Feel free to explore or refine using the filters.`
                    : "Here are some AI tools you might find useful. Use the filters to refine your search."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar filters */}
          <div className="mb-6 w-full lg:mb-0 lg:w-64 lg:pr-8">
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 font-medium">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className="ml-2 text-sm">{cat}</span>
                  </label>
                ))}
              </div>

              <h3 className="mb-4 mt-6 font-medium">Pricing</h3>
              <div className="space-y-2">
                {pricing.map((price) => (
                  <label key={price} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedPricing.includes(price)}
                      onChange={() => togglePricing(price)}
                    />
                    <span className="ml-2 text-sm">{formatPricingLabel(price)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded p-1 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400"}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded p-1 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400"}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <p className="text-red-600">Failed to load results. Please try again.</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white hover:bg-red-700"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && data?.tools.length === 0 && (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="mb-4 text-lg text-gray-600">No results found for your search criteria.</p>
                <p className="mb-6 text-gray-500">Try adjusting your filters or search with different keywords.</p>
                <Button
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedPricing([])
                  }}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* List View (Grid Layout) */}
            {!isLoading && !isError && data?.tools.length > 0 && viewMode === "list" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.tools.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-4">
                      <h3 className="mb-1 text-lg font-semibold">{tool.name}</h3>
                      <div className="mb-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                          {tool.category}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}>
                          {formatPricingLabel(tool.pricing)}
                        </span>
                        {tool.isFeatured && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}>
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-gray-600">{tool.description}</p>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {tool.features &&
                          tool.features.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {tag}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <button
                            className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                            onClick={() => handleSaveToggle(tool)}
                          >
                            <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                          </button>
                          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                        <Button className="rounded-full bg-purple-600 hover:bg-purple-700" asChild>
                          <Link href={`/tools/${tool.id}`}>
                            Try Tool
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              ></path>
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Grid View (Vertical List) */}
            {!isLoading && !isError && data?.tools.length > 0 && viewMode === "grid" && (
              <div className="space-y-4">
                {data.tools.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="mb-1 text-lg font-semibold">{tool.name}</h3>
                          <div className="mb-2 flex flex-wrap gap-1">
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                              {tool.category}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}
                            >
                              {formatPricingLabel(tool.pricing)}
                            </span>
                            {tool.isFeatured && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-sm text-gray-600">{tool.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {tool.features &&
                              tool.features.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center md:mt-0">
                          <div className="flex items-center space-x-2 mr-4">
                            <button
                              className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                              onClick={() => handleSaveToggle(tool)}
                            >
                              <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                          <Button className="rounded-full bg-purple-600 hover:bg-purple-700" asChild>
                            <Link href={`/tools/${tool.id}`}>
                              Try Tool
                              <svg
                                className="ml-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                ></path>
                              </svg>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && data?.tools.length > 0 && data.total > limit && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-gray-200"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {page} of {Math.ceil(data.total / limit)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= data.total}
                    className="border-gray-200"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
