"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, Grid, List, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "@/components/ui/footer"
import { useSearchTools } from "@/hooks/use-search"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { useAuth } from "@/contexts/auth-context"
import type { Tool } from "@/types/tool"
import { useSearchParams } from "next/navigation"
import { clsx } from "clsx"

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
  const searchParams = useSearchParams()

  // State variables
  const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availablePricing, setAvailablePricing] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [isErrorState, setIsErrorState] = useState(false);

  const isChatSource = typeof window !== "undefined" && searchParams.get("source") === "chat";

  // Effect to handle data loading
  useEffect(() => {
    console.log("SearchResults useEffect running");
    setIsInitialLoad(true);
    setIsLoadingState(true);
    setIsErrorState(false);

    if (isChatSource) {
      console.log("Source is chat, checking sessionStorage...");
      try {
        const chatToolsJson = sessionStorage.getItem("chatResponseTools");
        console.log("Chat tools from sessionStorage:", chatToolsJson ? "Found" : "Not found");

        if (chatToolsJson) {
          const chatTools = JSON.parse(chatToolsJson);
          console.log("Parsed chat tools data:", chatTools);

          let transformedTools: Tool[] = [];

          if (Array.isArray(chatTools)) {
            transformedTools = chatTools.map((tool: any) => ({
              id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
              name: tool.name || "Unknown Tool",
              slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
              category: tool.category_id || "AI Tool",
              description: tool.description || "No description available",
              pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
              isFeatured: Number(tool.rating || "0") > 4.5,
              savedByUser: false,
              features: [],
              website: tool.link || "#",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: "approved" as const,
              hasFreeVersion: tool.price?.toLowerCase().includes("free"),
              contactName: "",
              contactEmail: "",
            }));
          } else if (chatTools && Array.isArray(chatTools.hits)) {
            transformedTools = chatTools.hits.map((tool: any) => ({
              id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
              name: tool.name || "Unknown Tool",
              slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
              category: tool.category_id || "AI Tool",
              description: tool.description || "No description available",
              pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
              isFeatured: Number(tool.rating || "0") > 4.5,
              savedByUser: false,
              features: [],
              website: tool.link || "#",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: "approved" as const,
              hasFreeVersion: tool.price?.toLowerCase().includes("free"),
              contactName: "",
              contactEmail: "",
            }));
          }

          if (transformedTools.length > 0) {
            console.log("Setting displayed tools from chat data:", transformedTools.length);
            setDisplayedTools(transformedTools);
            setTotalResults(transformedTools.length);
            setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category)));
            setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing)));
            setIsLoadingState(false);
            setIsInitialLoad(false);
          } else {
            console.log("No chat tools found or empty array, proceeding to API search if query exists.");
            setIsInitialLoad(false);
          }
        } else {
          console.log("No chat tools found in sessionStorage, proceeding to API search if query exists.");
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error("Error processing chat tools data from sessionStorage:", error);
        setIsErrorState(true);
        setIsLoadingState(false);
        setIsInitialLoad(false);
      }
    } else {
      console.log("Source is not chat, will use API search.");
      setIsInitialLoad(false);
    }
  }, [searchParams, isChatSource]);

  // Use the search API hook
  const {
    data: apiData,
    isLoading: isApiLoading,
    isError: isApiError
  } = useSearchTools({
    query,
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    pricing: selectedPricing.length > 0 ? selectedPricing[0] : undefined,
    page,
    limit,
  }, {
    enabled: !isChatSource && !isInitialLoad,
  });

  // Effect to update state when API data loads
  useEffect(() => {
    if (!isChatSource && !isInitialLoad) {
      setIsLoadingState(isApiLoading);
      setIsErrorState(isApiError);

      if (!isApiLoading && !isApiError && apiData) {
        console.log("Setting displayed tools from API data:", apiData.tools.length);
        setDisplayedTools(apiData.tools);
        setTotalResults(apiData.total);
        setAvailableCategories(apiData.categories);
        setAvailablePricing(apiData.pricingOptions);
      } else if (!isApiLoading && !apiData) {
        setDisplayedTools([]);
        setTotalResults(0);
        setAvailableCategories([]);
        setAvailablePricing([]);
      }
    }
  }, [apiData, isApiLoading, isApiError, isChatSource, isInitialLoad]);

  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
    setPage(1)
  }

  const togglePricing = (price: string) => {
    setSelectedPricing((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]))
    setPage(1)
  }

  const handleSaveToggle = (tool: Tool) => {
    if (!isAuthenticated) {
      console.log("Authentication required to save tools.");
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

  const categories = availableCategories.length > 0 ? availableCategories : [
    "Image Generation",
    "Text Generation",
    "Development",
    "Voice Synthesis",
    "Data Visualization",
    "Video Creation",
    "Chatbots",
  ];

  const pricing = availablePricing.length > 0 ? availablePricing : ["free", "freemium", "subscription", "one-time", "usage-based"];

  const formatPricingLabel = (pricing: string): string => {
    return pricing?.charAt(0).toUpperCase() + pricing?.slice(1).replace("-", " ") || "Unknown";
  }

  const truncateDescription = (description: string | undefined | null, limit: number = 200) => {
    if (!description) return "No description available.";
    if (description.length <= limit) return description;
    return `${description.substring(0, limit)}...`;
  };

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
                  {isChatSource
                      ? "Here are the AI tools recommended by the assistant."
                      : query
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
                            disabled={isChatSource}
                        />
                        <span className={clsx("ml-2 text-sm", isChatSource && "text-gray-400")}>{cat}</span>
                      </label>
                  ))}
                  {isChatSource && categories.length === 0 && (
                      <div className="text-sm text-gray-500">No categories available for these tools.</div>
                  )}
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
                            disabled={isChatSource}
                        />
                        <span className={clsx("ml-2 text-sm", isChatSource && "text-gray-400")}>{formatPricingLabel(price)}</span>
                      </label>
                  ))}
                  {isChatSource && pricing.length === 0 && (
                      <div className="text-sm text-gray-500">No pricing info available.</div>
                  )}
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
              {isLoadingState && (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
                  </div>
              )}

              {/* Error state */}
              {!isLoadingState && isErrorState && (
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <p className="text-red-600">Failed to load results. Please try again.</p>
                    <Button
                        onClick={() => {
                          if(isChatSource) {
                            setIsLoadingState(true);
                            setIsErrorState(false);
                            const chatToolsJson = typeof window !== "undefined" ? sessionStorage.getItem("chatResponseTools") : null;
                            try {
                              if (chatToolsJson) {
                                const chatTools = JSON.parse(chatToolsJson);
                                let transformedTools: Tool[] = [];
                                if (Array.isArray(chatTools)) {
                                  transformedTools = chatTools.map((tool: any) => ({
                                    id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
                                    name: tool.name || "Unknown Tool",
                                    slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
                                    category: tool.category_id || "AI Tool",
                                    description: tool.description || "No description available",
                                    pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
                                    isFeatured: Number(tool.rating || "0") > 4.5,
                                    savedByUser: false,
                                    features: [],
                                    website: tool.link || "#",
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                    status: "approved" as const,
                                    hasFreeVersion: tool.price?.toLowerCase().includes("free"),
                                    contactName: "",
                                    contactEmail: "",
                                  }));
                                } else if (chatTools && Array.isArray(chatTools.hits)) {
                                  transformedTools = chatTools.hits.map((tool: any) => ({
                                    id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
                                    name: tool.name || "Unknown Tool",
                                    slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
                                    category: tool.category_id || "AI Tool",
                                    description: tool.description || "No description available",
                                    pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
                                    isFeatured: Number(tool.rating || "0") > 4.5,
                                    savedByUser: false,
                                    features: [],
                                    website: tool.link || "#",
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                    status: "approved" as const,
                                    hasFreeVersion: tool.price?.toLowerCase().includes("free"),
                                    contactName: "",
                                    contactEmail: "",
                                  }));
                                }

                                setDisplayedTools(transformedTools);
                                setTotalResults(transformedTools.length);
                                setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category))));
                                setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing))));
                                setIsLoadingState(false);
                              } else {
                                setIsLoadingState(false);
                                setIsErrorState(true);
                              }
                            } catch (e) {
                              console.error("Retry failed to process chat tools data:", e);
                              setIsLoadingState(false);
                              setIsErrorState(true);
                            }
                          } else {
                            window.location.reload();
                          }
                        }}
                        className="mt-4 bg-red-600 text-white hover:bg-red-700"
                    >
                      Retry
                    </Button>
                  </div>
              )}

              {/* Empty state */}
              {!isLoadingState && !isErrorState && displayedTools.length === 0 && (
                  <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <p className="mb-4 text-lg text-gray-600">No results found for your search criteria.</p>
                    {!isChatSource && (
                        <>
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
                        </>
                    )}
                  </div>
              )}

              {/* Display Results (List View - Grid Layout) */}
              {!isLoadingState && !isErrorState && displayedTools.length > 0 && viewMode === "list" && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedTools.map((tool) => (
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
                            <p className="mb-3 text-sm text-gray-600">{truncateDescription(tool.description)}</p>

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
                                    disabled={isChatSource && !isAuthenticated}
                                >
                                  <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                                </button>
                                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" aria-label={`Share ${tool.name}`}>
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

              {/* Display Results (Grid View - Vertical List) */}
              {!isLoadingState && !isErrorState && displayedTools.length > 0 && viewMode === "grid" && (
                  <div className="space-y-4">
                    {displayedTools.map((tool) => (
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
                                <p className="mb-2 text-sm text-gray-600">{truncateDescription(tool.description)}</p>
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
                                      disabled={isChatSource && !isAuthenticated}
                                  >
                                    <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                                  </button>
                                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" aria-label={`Share ${tool.name}`}>
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
              {!isLoadingState && !isErrorState && !isChatSource && totalResults > limit && (
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
                    Page {page} of {Math.ceil(totalResults / limit)}
                  </span>
                      <Button
                          variant="outline"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={page * limit >= totalResults}
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