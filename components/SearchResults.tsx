"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronDown, ArrowLeft, Bookmark, Grid, List, Share2, Star } from "lucide-react" // Added Star icon
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card" // Assuming Card components are available
import { useSearchTools } from "@/hooks/use-search" // Assuming this hook exists and works
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools" // Assuming these hooks exist and work
import { useAuth } from "@/contexts/auth-context" // Assuming this hook exists and works
import type { Tool } from "@/types/tool" // Assuming Tool type is defined
import { useSearchParams } from "next/navigation" // Correct import for App Router
import ChatResultCard from "@/components/chat-result-card" // Assuming this component exists

interface SearchResultsProps {
  initialQuery?: string
  category?: string
  source?: string // To indicate if results are from chat
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
  const [chatResults, setChatResults] = useState<any[]>([]) // State for chat results

  // Sync query and category from URL on initial load
  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    const urlCategory = searchParams.get("category")
    const urlSource = searchParams.get("source") || ""

    setQuery(urlQuery)
    if (urlCategory) {
      setSelectedCategories([urlCategory])
    } else {
      setSelectedCategories([])
    }

    // Handle chat results from sessionStorage if source is 'chat'
    if (urlSource === "chat") {
      try {
        const chatData = sessionStorage.getItem("chatResponseTools")
        if (chatData) {
          const parsedData = JSON.parse(chatData)
          if (parsedData && parsedData.hits && Array.isArray(parsedData.hits)) {
            // Map chat results to a structure compatible with ToolCard if needed, or use a dedicated card
            // For now, we'll use a separate state and potentially a different card component
            setChatResults(parsedData.hits)
            setTotalResults(parsedData.hits.length)
            setIsLoading(false) // Stop loading if chat results are found
            // Clear regular search results if showing chat results
            setDisplayedTools([]);
          } else {
            // If source is chat but no valid data, clear chat results
            setChatResults([]);
            // Proceed with regular search based on URL query/category
            setIsLoading(true); // Start loading for regular search
          }
        } else {
          // If source is chat but no data in session storage, clear chat results
          setChatResults([]);
          // Proceed with regular search based on URL query/category
          setIsLoading(true); // Start loading for regular search
        }
      } catch (error) {
        console.error("Error parsing chat data:", error)
        setChatResults([]); // Clear chat results on error
        setIsLoading(true); // Start loading for regular search
      }
    } else {
      // If source is not chat, clear chat results and proceed with regular search
      setChatResults([]);
      setIsLoading(true); // Start loading for regular search
    }

  }, [searchParams]) // Depend on searchParams to react to URL changes


  // --- Fetch tools with React Query ---
  // Only fetch if source is NOT 'chat' OR if chat results were not found/parsed
  const shouldFetchRegularTools = source !== "chat" || (source === "chat" && chatResults.length === 0 && !isLoading);

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
      { enabled: shouldFetchRegularTools }, // Only enable if not showing chat results or if chat results failed
  )

  // Effect to update state from API data
  useEffect(() => {
    if (shouldFetchRegularTools) {
      setIsLoading(isApiLoading)
      setIsError(isApiError)

      if (!isApiLoading && !isApiError && apiData) {
        setDisplayedTools(apiData.tools)
        setTotalResults(apiData.total)
        // Assuming API returns available categories and pricing options
        setAvailableCategories(apiData.categories || [])
        setAvailablePricing(apiData.pricingOptions || [])
      } else if (!isApiLoading && isApiError) {
        // If API call finished with error, clear tools but keep error state
        setDisplayedTools([]);
        setTotalResults(0);
        setAvailableCategories([]);
        setAvailablePricing([]);
      }
    }
  }, [apiData, isApiLoading, isApiError, shouldFetchRegularTools])


  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const toggleCategory = (cat: string) => {
    // Toggle logic: if already selected, unselect. Otherwise, select only this one.
    const newSelectedCategories = selectedCategories.includes(cat) ? [] : [cat];
    setSelectedCategories(newSelectedCategories);
    setPage(1); // Reset to first page

    // Update URL
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newSelectedCategories.length === 0) {
      current.delete('category');
    } else {
      current.set('category', newSelectedCategories[0]);
    }
    current.delete('page'); // Remove page param on filter change
    const search = current.toString();
    router.replace(`${window.location.pathname}${search ? `?${search}` : ''}`);
  }

  const togglePricing = (price: string) => {
    // Toggle logic: if already selected, unselect. Otherwise, select only this one.
    const newSelectedPricing = selectedPricing.includes(price) ? [] : [price];
    setSelectedPricing(newSelectedPricing);
    setPage(1); // Reset to first page

    // Update URL
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newSelectedPricing.length === 0) {
      current.delete('pricing');
    } else {
      current.set('pricing', newSelectedPricing[0]);
    }
    current.delete('page'); // Remove page param on filter change
    const search = current.toString();
    router.replace(`${window.location.pathname}${search ? `?${search}` : ''}`);
  }


  const handleSaveToggle = (tool: Tool) => {
    if (!isAuthenticated) {
      console.log("Authentication required to save tools.")
      // Optionally trigger login modal here
      return
    }

    // Optimistically update the UI
    setDisplayedTools((prev) =>
        prev.map((t) => (t.id === tool.id ? { ...t, savedByUser: !tool.savedByUser } : t))
    );
    if (source === "chat") {
      setChatResults((prev) =>
          prev.map((t) => (t.id === tool.id ? { ...t, saved_by_user: !tool.savedByUser } : t)) // Note: chat results might use snake_case
      );
    }


    if (tool.savedByUser) {
      unsaveTool.mutate(tool.id)
    } else {
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
      case "featured": // This badge is applied separately in the card structure
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatPricingLabel = (pricing: string | undefined | null): string => {
    if (!pricing) return "Unknown"
    // Handle potential snake_case from chat results
    const formatted = pricing.replace(/_/g, ' ').replace(/-/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  const truncateDescription = (description: string | undefined | null, limit = 150) => {
    if (!description) return "No description available."
    if (description.length <= limit) return description
    return `${description.substring(0, limit)}...`
  }

  // Use available categories if fetched, otherwise use a default list
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

  // Use available pricing if fetched, otherwise use a default list
  const pricing =
      availablePricing.length > 0
          ? availablePricing
          : ["free", "freemium", "subscription", "one-time", "usage-based", "unknown"]

  // Function to get the tool detail URL - use slug if available, otherwise name
  const getToolDetailUrl = (tool: Tool | any) => { // Allow any type for chat results
    // Prioritize slug if it exists, otherwise use name
    const identifier = tool.slug || tool.name || tool.id; // Use id as fallback
    return `/tools/${encodeURIComponent(identifier)}`;
  }

  // Determine which tools to display (regular search results or chat results)
  const toolsToDisplay = source === "chat" ? chatResults : displayedTools;
  const totalResultsToDisplay = source === "chat" ? chatResults.length : totalResults;

  return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Header is assumed to be in the layout */}
        {/* <Header /> */}

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb - Back to Home */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#a855f7] dark:text-purple-400 mb-6 hover:text-[#9333ea] dark:hover:text-purple-300">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-1">
              {source === "chat" ? "AI Assistant Results" : "Browse AI Tools"}
            </h1>
            <p className="text-[#6b7280] dark:text-gray-400">
              {source === "chat" ? "Tools recommended by the AI assistant" : "Discover and compare the best AI tools for your needs"}
            </p>
          </div>

          {/* Search and Filter Controls (Hidden if showing chat results) */}
          {source !== "chat" && (
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                  </div>
                  <Input
                      type="text"
                      placeholder="Search for tools..."
                      className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                      value={query} // Use query state here
                      onChange={(e) => {
                        setQuery(e.target.value); // Update query state
                        setPage(1); // Reset page
                        // Update URL with search query
                        const current = new URLSearchParams(Array.from(searchParams.entries()));
                        if (e.target.value) {
                          current.set('q', e.target.value);
                        } else {
                          current.delete('q');
                        }
                        current.delete('page'); // Remove page param on search change
                        const search = current.toString();
                        router.replace(`${window.location.pathname}${search ? `?${search}` : ''}`);
                      }}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative w-full md:w-48">
                  <button
                      className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none text-gray-900 dark:text-white"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      disabled={isLoadingCategories || isErrorCategories}
                  >
                    <span>{categoryDropdownList.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}</span>
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showCategoryDropdown ? 'rotate-180' : 'rotate-0'} text-gray-500 dark:text-gray-400`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showCategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="py-1">
                          {isLoadingCategories ? (
                              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading categories...</div>
                          ) : isErrorCategories ? (
                              <div className="px-4 py-2 text-sm text-red-600">Error loading categories.</div>
                          ) : (
                              categoryDropdownList.map((cat) => (
                                  <button
                                      key={cat.slug}
                                      onClick={() => handleCategorySelect(cat)}
                                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                          selectedCategory === cat.slug ? "font-medium bg-gray-50 dark:bg-gray-700" : ""
                                      }`}
                                  >
                                    <span>{cat.name}</span>
                                    {typeof cat.count === 'number' && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{cat.count}</span>
                                    )}
                                  </button>
                              ))
                          )}
                        </div>
                      </div>
                  )}
                </div>
              </div>
          )}


          {/* Tool Count Display */}
          <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-6">
            {isLoading ? "Loading tools..." : totalResultsToDisplay === 0 ? `No tools found${(selectedCategory !== "all-categories" || query) ? " for your criteria" : ""}` : `Showing ${toolsToDisplay.length} of ${totalResultsToDisplay} tools`}
          </p>

          {/* View Mode Toggle (Hidden if showing chat results) */}
          {source !== "chat" && toolsToDisplay.length > 0 && (
              <div className="mb-6 flex justify-end items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded p-1 ${viewMode === "grid" ? "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"}`}
                    aria-label="Switch to grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                    onClick={() => setViewMode("list")}
                    className={`rounded p-1 ${viewMode === "list" ? "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"}`}
                    aria-label="Switch to list view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
          )}


          {/* Conditional Rendering for Loading, Error, and Tools Grid */}
          {isLoading && toolsToDisplay.length === 0 && ( // Only show loading if no tools are currently displayed
              // Loading spinner
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
              </div>
          )}

          {isError && !isLoading && toolsToDisplay.length === 0 && ( // Only show error if not loading and no tools are displayed
              // Error message
              <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 text-center border border-red-100 dark:border-red-800">
                <p className="text-red-700 dark:text-red-300 mb-3">Failed to load results.</p>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">An error occurred while fetching the AI tools.</p>
                <Button
                    onClick={() => refetch()}
                    className="mt-4 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Retry
                </Button>
              </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && toolsToDisplay.length === 0 && (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-8 text-center border border-gray-200 dark:border-gray-700">
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">No results found for your criteria.</p>
                <p className="mb-6 text-gray-600 dark:text-gray-400">Try adjusting your filters or search with different keywords.</p>
                <Button
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedPricing([])
                      setPage(1)
                      // Clear search query and update URL
                      setQuery("");
                      const current = new URLSearchParams(Array.from(searchParams.entries()));
                      current.delete('q');
                      current.delete('category');
                      current.delete('pricing');
                      current.delete('page');
                      const search = current.toString();
                      router.replace(`${window.location.pathname}${search ? `?${search}` : ''}`);
                    }}
                    variant="outline"
                    className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800" // Adjusted button style
                >
                  Clear Filters
                </Button>
              </div>
          )}


          {/* Tools Grid/List */}
          {!isLoading && toolsToDisplay.length > 0 && (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {toolsToDisplay.map((tool, index) => (
                    // Use ChatResultCard for chat results, and a new custom card for regular tools
                    source === "chat" ? (
                        <ChatResultCard key={tool.id || index} result={tool} index={index} viewMode={viewMode} onSaveToggle={handleSaveToggle} isAuthenticated={isAuthenticated} />
                    ) : (
                        // Custom Card for regular search results
                        <Card
                            key={tool.id}
                            className={`overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col ${viewMode === "list" ? "md:flex-row" : ""}`} // Added dark modes, adjusted list view flex
                        >
                          {/* Optional: Add Tool Logo/Image here if available */}
                          {/* {tool.logoUrl && (
                           <div className={`p-4 ${viewMode === "list" ? "md:w-1/4 flex items-center justify-center" : ""}`}>
                               <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-16 h-16 object-contain" />
                           </div>
                       )} */}
                          <CardContent
                              className={`p-4 flex-grow ${viewMode === "list" ? "md:flex md:flex-col md:justify-between md:w-3/4" : ""}`} // Adjusted padding, added list view flex
                          >
                            <div>
                              <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white"> {/* Added dark mode */}
                                <Link href={getToolDetailUrl(tool)} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"> {/* Added dark mode hover */}
                                  {tool.name}
                                </Link>
                              </h3>
                              <div className="mb-2 flex flex-wrap gap-1">
                                   <span className="rounded-full bg-purple-100 dark:bg-purple-900 px-2 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-300"> {/* Added dark mode */}
                                     {tool.category || "AI Tool"}
                                   </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}
                                >
                                       {formatPricingLabel(tool.pricing)}
                                   </span>
                                {/* Assuming isFeatured comes from your Tool type */}
                                {tool.isFeatured && (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}
                                    >
                                         Featured
                                       </span>
                                )}
                              </div>
                              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{truncateDescription(tool.description)}</p> {/* Added dark mode */}

                              {/* Display Features/Tags */}
                              <div className="mb-4 flex flex-wrap gap-1">
                                {tool.features &&
                                    Array.isArray(tool.features) &&
                                    tool.features.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300"> {/* Added dark mode */}
                                          {tag}
                                           </span>
                                    ))}
                              </div>
                            </div>
                            {/* Card Footer / Actions */}
                            <div className="p-0 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between pt-4"> {/* Added dark mode border */}
                              <div className="flex items-center space-x-1">
                                <button
                                    className={`rounded p-1 ${tool.savedByUser ? "text-purple-600 dark:text-purple-400" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400"}`} // Added dark modes
                                    onClick={() => handleSaveToggle(tool)}
                                    aria-label={tool.savedByUser ? "Unsave tool" : "Save tool"}
                                >
                                  <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                                </button>
                                <button
                                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400" // Added dark modes
                                    aria-label={`Share ${tool.name}`}
                                >
                                  <Share2 className="h-4 w-4" />
                                </button>
                                {/* Optional: Add Rating display here if available in Tool type */}
                                {/* {tool.rating && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 ml-2">
                                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                                            <span>{tool.rating.toFixed(1)}</span>
                                        </div>
                                    )} */}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                    className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white" // Added dark modes
                                    asChild
                                >
                                  <Link href={getToolDetailUrl(tool)}>View Details</Link>
                                </Button>
                                {tool.website && ( // Assuming 'website' is the link to try the tool
                                    <Button
                                        className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 dark:bg-purple-700 dark:hover:bg-purple-600" // Added dark modes
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
                    )
                ))}
              </div>
          )}


          {/* Pagination - only show for regular search results */}
          {source !== "chat" && !isLoading && !isError && totalResults > limit && (
              <div className="flex justify-center mt-8 space-x-4 items-center">
                <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-purple-700 dark:hover:bg-purple-600" // Added dark modes
                >
                  Previous
                </Button>
                <span className="text-gray-700 dark:text-gray-300 text-sm"> {/* Added dark mode */}
                  Page {page} of {Math.ceil(totalResults / limit)}
            </span>
                <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= totalResults || isLoading}
                    className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-purple-700 dark:hover:bg-purple-600" // Added dark modes
                >
                  Next
                </Button>
              </div>
          )}
        </main>

        {/* Assuming Footer is rendered elsewhere */}
        {/* <Footer /> */}
      </div>
  )
}
