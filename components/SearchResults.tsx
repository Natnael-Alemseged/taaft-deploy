"use client"

import { useState, useEffect } from "react"
import { Bookmark, Grid, List, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSearchTools } from "@/hooks/use-search"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { useAuth } from "@/contexts/auth-context"
import type { Tool } from "@/types/tool"
import { useSearchParams } from "next/navigation"
import ChatResultCard from "@/components/chat-result-card"
import Link from "next/link"

interface SearchResultsProps {
  initialQuery?: string
  category?: string
  source?: string
}

export default function SearchResults({ initialQuery, category, source }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category] : [])
  const [selectedPricing, setSelectedPricing] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const limit = 12
  const { isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery || "")

  const [displayedTools, setDisplayedTools] = useState<Tool[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availablePricing, setAvailablePricing] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [chatResults, setChatResults] = useState<any[]>([])

  useEffect(() => {
    setQuery(initialQuery || "")
    if (category) {
      setSelectedCategories([category])
    }
  }, [initialQuery, category])

  const {
    data: apiData,
    isLoading: isApiLoading,
    isError: isApiError,
    refetch,
  } = useSearchTools(
    {
      query: query,
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      pricing: selectedPricing.length > 0 ? selectedPricing[0] : undefined,
      page,
      limit,
    },
    { enabled: true },
  )

  useEffect(() => {
    setIsLoading(isApiLoading)
    setIsError(isApiError)

    if (!isApiLoading && !isApiError && apiData) {
      setDisplayedTools(apiData.tools)
      setTotalResults(apiData.total)
      setAvailableCategories(apiData.categories || [])
      setAvailablePricing(apiData.pricingOptions || [])
    }
  }, [apiData, isApiLoading, isApiError])

  // Handle chat results from sessionStorage
  useEffect(() => {
    if (source === "chat") {
      try {
        const chatData = sessionStorage.getItem("chatResponseTools")
        if (chatData) {
          const parsedData = JSON.parse(chatData)
          if (parsedData && parsedData.hits && Array.isArray(parsedData.hits)) {
            setChatResults(parsedData.hits)
            setTotalResults(parsedData.hits.length)
            setIsLoading(false)
          }
        }
      } catch (error) {
        console.error("Error parsing chat data:", error)
      }
    }
  }, [source])

  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [cat]))
    setPage(1)
  }

  const togglePricing = (price: string) => {
    setSelectedPricing((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [price]))
    setPage(1)
  }

  const handleSaveToggle = (tool: Tool) => {
    if (!isAuthenticated) {
      console.log("Authentication required to save tools.")
      return
    }

    if (tool.savedByUser) {
      setDisplayedTools((prev) => prev.map((t) => (t.id === tool.id ? { ...t, savedByUser: false } : t)))
      unsaveTool.mutate(tool.id)
    } else {
      setDisplayedTools((prev) => prev.map((t) => (t.id === tool.id ? { ...t, savedByUser: true } : t)))
      saveTool.mutate(tool.id)
    }
  }

  const getBadgeClass = (label: string | undefined | null) => {
    if (!label) return "bg-gray-100 text-gray-600"
    const lowerLabel = label.toLowerCase()
    switch (lowerLabel) {
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

  const formatPricingLabel = (pricing: string | undefined | null): string => {
    if (!pricing) return "Unknown"
    return pricing?.charAt(0).toUpperCase() + pricing?.slice(1).replace("-", " ") || "Unknown"
  }

  const truncateDescription = (description: string | undefined | null, limit = 150) => {
    if (!description) return "No description available."
    if (description.length <= limit) return description
    return `${description.substring(0, limit)}...`
  }

  const categories =
    availableCategories.length > 0
      ? availableCategories
      : [
          "Image Generation",
          "Text Generation",
          "Development",
          "Voice Synthesis",
          "Data Visualization",
          "Video Creation",
          "Chatbots",
          "Other",
        ]

  const pricing =
    availablePricing.length > 0
      ? availablePricing
      : ["free", "freemium", "subscription", "one-time", "usage-based", "unknown"]

  // Function to get the tool slug for navigation
  const getToolDetailUrl = (tool: Tool) => {
    // If we're coming from search results, use the name as the slug
    // This will trigger the unique name endpoint in the tool detail page
    return `/tools/${encodeURIComponent(tool.name)}`
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Fixed Sidebar with Filters */}
      <div className="md:w-64 md:flex-shrink-0 md:sticky md:top-20 md:self-start h-auto">
        <div className="rounded-lg border border-gray-200 p-4 mb-6 md:mb-0">
          <h3 className="mb-4 font-medium text-gray-700">Categories</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span className="ml-2 text-sm text-gray-800">{cat}</span>
              </label>
            ))}
            {categories.length === 0 && <div className="text-sm text-gray-500">No categories available.</div>}
          </div>

          <h3 className="mb-4 mt-6 font-medium text-gray-700">Pricing</h3>
          <div className="space-y-2">
            {pricing.map((price) => (
              <label key={price} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  checked={selectedPricing.includes(price)}
                  onChange={() => togglePricing(price)}
                />
                <span className="ml-2 text-sm text-gray-800">{formatPricingLabel(price)}</span>
              </label>
            ))}
            {pricing.length === 0 && <div className="text-sm text-gray-500">No pricing info available.</div>}
          </div>

          {/* Clear Filters Button */}
          <Button
            onClick={() => {
              setSelectedCategories([])
              setSelectedPricing([])
              setPage(1)
            }}
            variant="outline"
            className="w-full mt-6"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Search Results {query ? `for "${query}"` : ""}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{totalResults} Results</span>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
              aria-label="Switch to grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
              aria-label="Switch to list view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="overflow-hidden border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-20"></div>
                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <div className="rounded-lg bg-red-50 p-4 text-center border border-red-100">
            <p className="text-red-700 mb-3">Failed to load results.</p>
            <p className="text-sm text-red-600 mb-4">An error occurred while fetching the AI tools.</p>
            <Button onClick={() => refetch()} className="mt-4 bg-red-600 text-white hover:bg-red-700">
              Retry
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && displayedTools.length === 0 && chatResults.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-8 text-center border border-gray-200">
            <p className="mb-4 text-lg text-gray-700">No results found for your search criteria.</p>
            <p className="mb-6 text-gray-600">Try adjusting your filters or search with different keywords.</p>
            <Button
              onClick={() => {
                setSelectedCategories([])
                setSelectedPricing([])
                setPage(1)
              }}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && (
          <div>
            {/* Regular search results */}
            {displayedTools.length > 0 && (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {displayedTools.map((tool) => (
                  <Card
                    key={tool.id}
                    className={`overflow-hidden border border-gray-200 flex flex-col ${viewMode === "list" ? "flex-row" : ""}`}
                  >
                    <CardContent
                      className={`p-4 flex-grow ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}
                    >
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-800">
                          <Link href={getToolDetailUrl(tool)} className="hover:text-purple-600 transition-colors">
                            {tool.name}
                          </Link>
                        </h3>
                        <div className="mb-2 flex flex-wrap gap-1">
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                            {tool.category || "AI Tool"}
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
                        <p className="mb-3 text-sm text-gray-600">{truncateDescription(tool.description)}</p>

                        <div className="mb-4 flex flex-wrap gap-1">
                          {tool.features &&
                            Array.isArray(tool.features) &&
                            tool.features.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="p-0 border-t border-gray-100 flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-1">
                          <button
                            className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                            onClick={() => handleSaveToggle(tool)}
                            aria-label={tool.savedByUser ? "Unsave tool" : "Save tool"}
                          >
                            <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                          </button>
                          <button
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            aria-label={`Share ${tool.name}`}
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5"
                            asChild
                          >
                            <Link href={getToolDetailUrl(tool)}>View Details</Link>
                          </Button>
                          {tool.website && (
                            <Button
                              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5"
                              asChild
                            >
                              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                                Try Tool
                                <svg
                                  className="ml-1 h-3 w-3"
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
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Chat results */}
            {source === "chat" && chatResults.length > 0 && (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {chatResults.map((result, index) => (
                  <ChatResultCard key={index} result={result} index={index} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination - only show for regular search results */}
            {!source && totalResults > limit && (
              <div className="flex justify-center mt-8 space-x-4 items-center">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                  className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Previous
                </Button>
                <span className="text-gray-700 text-sm">
                  Page {page} of {Math.ceil(totalResults / limit)}
                </span>
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= totalResults || isLoading}
                  className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
