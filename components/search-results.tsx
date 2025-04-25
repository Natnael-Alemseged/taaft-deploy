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
import {clsx} from "clsx"; // Keep this import

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

  // --- New State Variables to Hold Data for Display ---
  const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availablePricing, setAvailablePricing] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // To track if we are on the first render
  const [isLoadingState, setIsLoadingState] = useState(true); // Combined loading state
  const [isErrorState, setIsErrorState] = useState(false); // Combined error state
  // --- End New State Variables ---


  const isChatSource = typeof window !== "undefined" && searchParams.get("source") === "chat";

  // Effect to handle data loading from either sessionStorage or API
  useEffect(() => {
    console.log("SearchResults useEffect running");
    setIsInitialLoad(true); // Mark initial load start
    setIsLoadingState(true); // Set loading true initially
    setIsErrorState(false); // Reset error state

    if (isChatSource) {
      console.log("Source is chat, checking sessionStorage...");
      try {
        const chatToolsJson = sessionStorage.getItem("chatResponseTools");
        console.log("Chat tools from sessionStorage:", chatToolsJson ? "Found" : "Not found");

        if (chatToolsJson) {
          const chatTools = JSON.parse(chatToolsJson);
          console.log("Parsed chat tools data:", chatTools);

          let transformedTools: Tool[] = [];

          // Handle both possible data structures (array or { hits: array })
          if (Array.isArray(chatTools)) {
            transformedTools = chatTools.map((tool: any) => ({
              id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
              name: tool.name || "Unknown Tool",
              slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
              category: tool.category_id || "AI Tool",
              description: tool.description || "No description available",
              // Ensure pricing is one of the expected values or default
              pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
              isFeatured: Number(tool.rating || "0") > 4.5,
              savedByUser: false, // Chat data won't know this
              features: [], // Chat data might not have features in this format
              website: tool.link || "#",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: "approved" as const, // Assume approved
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
              // Ensure pricing is one of the expected values or default
              pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
              isFeatured: Number(tool.rating || "0") > 4.5,
              savedByUser: false, // Chat data won't know this
              features: [], // Chat data might not have features in this format
              website: tool.link || "#",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: "approved" as const, // Assume approved
              hasFreeVersion: tool.price?.toLowerCase().includes("free"),
              contactName: "",
              contactEmail: "",
            }));
          }


          if (transformedTools.length > 0) {
            console.log("Setting displayed tools from chat data:", transformedTools.length);
            setDisplayedTools(transformedTools);
            setTotalResults(transformedTools.length);
            // Set available categories/pricing based on chat data if needed, or default
            setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category)))); // Extract categories from chat data
            setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing)))); // Extract pricing from chat data
            setIsLoadingState(false); // Loading finished
            setIsInitialLoad(false); // Initial load complete

            // Optional: Remove session storage item after use
            // sessionStorage.removeItem("chatResponseTools");
          } else {
            // No chat tools found in session storage, proceed to API search
            console.log("No chat tools found or empty array, proceeding to API search if query exists.");
            setIsInitialLoad(false); // Initial load complete
            // Loading state will be handled by the API hook below
          }
        } else {
          // No chat tools found in session storage, proceed to API search
          console.log("No chat tools found in sessionStorage, proceeding to API search if query exists.");
          setIsInitialLoad(false); // Initial load complete
          // Loading state will be handled by the API hook below
        }
      } catch (error) {
        console.error("Error processing chat tools data from sessionStorage:", error);
        setIsErrorState(true); // Set error state
        setIsLoadingState(false); // Loading finished
        setIsInitialLoad(false); // Initial load complete
        // Proceed to API search if query exists and there's no chat data error preventing it? Or just show error?
        // For now, if session storage fails, we stop and show error/no results from session.
        // You might want to add logic to fallback to API search here if appropriate.
      }
    } else {
      // Source is not chat, allow the API hook to run
      console.log("Source is not chat, will use API search.");
      setIsInitialLoad(false); // Initial load complete
      // Loading/Error/Data will be handled by the API hook below
    }

  }, [searchParams, isChatSource]); // Depend on searchParams and isChatSource


  // Use the search API hook, but ONLY enable it if we are NOT loading from chat sessionStorage
  // We also check !isInitialLoad to ensure the useEffect has had a chance to check sessionStorage first.
  const {
    data: apiData, // Renamed to apiData to avoid conflict
    isLoading: isApiLoading,
    isError: isApiError
  } = useSearchTools({
    query,
    category: categoryParam,
    pricing: pricingParam,
    page,
    limit,
  }, {
    // Only enable this hook if the source is NOT chat AND the initial load check is done
    enabled: !isChatSource && !isInitialLoad,
    // Optionally, keep previous data while loading new page results for API search
    // keepPreviousData: true,
  });

  // Effect to update state when API data loads (only runs if API hook is enabled)
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
      } else if (!isApiLoading && !isApiData) {
        // API returned no data (e.g., empty results)
        setDisplayedTools([]);
        setTotalResults(0);
        // Keep existing filter options or reset? Resetting might be clearer.
        setAvailableCategories([]);
        setAvailablePricing([]);
      }
    }
  }, [apiData, isApiLoading, isApiError, isChatSource, isInitialLoad]); // Dependencies for API data effect


  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const toggleCategory = (cat: string) => { // Renamed param to avoid conflict with `category` prop
    setSelectedCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
    setPage(1) // Reset to first page when changing filters
  }

  const togglePricing = (price: string) => {
    setSelectedPricing((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]))
    setPage(1) // Reset to first page when changing filters
  }

  const handleSaveToggle = (tool: Tool) => {
    if (!isAuthenticated) {
      // Handle unauthenticated state (e.g., show login prompt) - Implement your auth modal/redirect here
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

  // Use the state variables for rendering
  const categories = availableCategories.length > 0 ? availableCategories : [
    "Image Generation",
    "Text Generation",
    "Development",
    "Voice Synthesis",
    "Data Visualization",
    "Video Creation",
    "Chatbots",
  ];

  // Use the state variables for rendering
  const pricing = availablePricing.length > 0 ? availablePricing : ["free", "freemium", "subscription", "one-time", "usage-based"];

  // Helper function to format pricing option label
  const formatPricingLabel = (pricing: string): string => {
    return pricing?.charAt(0).toUpperCase() + pricing?.slice(1).replace("-", " ") || "Unknown";
  }

  // Truncate description helper function
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
                            // Disable filters if showing chat results? Or allow filtering chat results?
                            // For now, allowing filtering which would trigger a new API search
                            // Consider disabling if filtering chat results isn't supported by your backend/data structure
                            disabled={isChatSource} // Disable filters when showing chat results
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
                            disabled={isChatSource} // Disable filters when showing chat results
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
              {isLoadingState && ( // Use the combined loading state
                  <div className="flex items-center justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
                  </div>
              )}

              {/* Error state */}
              {!isLoadingState && isErrorState && ( // Use the combined error state
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <p className="text-red-600">Failed to load results. Please try again.</p>
                    {/* Retry might trigger API fetch if not chat source, or re-read session storage */}
                    <Button
                        onClick={() => {
                          if(isChatSource) {
                            // If chat source, try re-reading session storage
                            setIsLoadingState(true);
                            setIsErrorState(false);
                            // Manually trigger the effect logic for chat source
                            const chatToolsJson = typeof window !== "undefined" ? sessionStorage.getItem("chatResponseTools") : null;
                            try {
                              if (chatToolsJson) {
                                const chatTools = JSON.parse(chatToolsJson);
                                // Re-apply the transformation and state update logic here
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
                                    savedByUser: false, features: [], website: tool.link || "#",
                                    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: "approved" as const,
                                    hasFreeVersion: tool.price?.toLowerCase().includes("free"), contactName: "", contactEmail: "",
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
                                    savedByUser: false, features: [], website: tool.link || "#",
                                    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: "approved" as const,
                                    hasFreeVersion: tool.price?.toLowerCase().includes("free"), contactName: "", contactEmail: "",
                                  }));
                                }

                                setDisplayedTools(transformedTools);
                                setTotalResults(transformedTools.length);
                                setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category))));
                                setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing))));

                                setIsLoadingState(false); // Loading finished
                              } else {
                                // Still no data after retry attempt
                                setIsLoadingState(false);
                                setIsErrorState(true); // Keep error state or set a specific "no data found" state
                              }
                            } catch (e) {
                              console.error("Retry failed to process chat tools data:", e);
                              setIsLoadingState(false);
                              setIsErrorState(true);
                            }

                          } else {
                            // If not chat source, reload the window to trigger a new API fetch via the hook
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
              {!isLoadingState && !isErrorState && displayedTools.length === 0 && ( // Use combined states and displayedTools
                  <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <p className="mb-4 text-lg text-gray-600">No results found for your search criteria.</p>
                    {!isChatSource && ( // Only show clear filters if not chat source
                        <>
                          <p className="mb-6 text-gray-500">Try adjusting your filters or search with different keywords.</p>
                          <Button
                              onClick={() => {
                                setSelectedCategories([])
                                setSelectedPricing([])
                                // setPage(1) // This is handled by the state setters above
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
              {!isLoadingState && !isErrorState && displayedTools.length > 0 && viewMode === "list" && ( // Use combined states and displayedTools
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedTools.map((tool) => ( // Map over displayedTools
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
                            {/* Use truncateDescription helper */}
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
                                    disabled={isChatSource && !isAuthenticated} // Disable save toggle for chat results if not authenticated (optional based on desired behavior)
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
              {!isLoadingState && !isErrorState && displayedTools.length > 0 && viewMode === "grid" && ( // Use combined states and displayedTools
                  <div className="space-y-4">
                    {displayedTools.map((tool) => ( // Map over displayedTools
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
                                {/* Use truncateDescription helper */}
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
                                      disabled={isChatSource && !isAuthenticated} // Disable save toggle for chat results if not authenticated (optional)
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

              {/* Pagination - Only show if not chat source results and total results > limit */}
              {!isLoadingState && !isErrorState && !isChatSource && totalResults > limit && ( // Use combined states and totalResults
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
                    Page {page} of {Math.ceil(totalResults / limit)} {/* Use totalResults */}
                  </span>
                      <Button
                          variant="outline"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={page * limit >= totalResults} {/* Use totalResults */}
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

// The SearchPage component remains the same as it correctly passes searchParams
// The ChatResponsePopup component remains the same as the window.location.href logic is there

/*
import SearchResults from "@/components/search-results"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""

  return <SearchResults query={query} category={category} />
}
*/

/*
"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation" // Although window.location is used, keep useRouter if used elsewhere

interface ChatResponsePopupProps {
  message: string
  formattedData?: {
    hits?: Array<{
      objectID: string
      name: string
      description: string
      link: string
      logo_url: string
      category_id: string
      unique_id: string
      price: string
      rating: string
    }>
  }
  onClose: () => void
}

export default function ChatResponsePopup({ message, formattedData, onClose }: ChatResponsePopupProps) {
  // const router = useRouter() // useRouter is not strictly needed if only using window.location

  const handleGoToTools = () => {
    try {
      // Store the formatted data in sessionStorage for the search page to access
      if (formattedData && formattedData.hits) {
        sessionStorage.setItem("chatResponseTools", JSON.stringify(formattedData.hits))
        console.log("Successfully stored chat tools (hits array) in sessionStorage")
      } else if (formattedData) {
        // Fallback to storing the whole formattedData if hits is not present
        sessionStorage.setItem("chatResponseTools", JSON.stringify(formattedData))
        console.log("Successfully stored chat tools (whole object) in sessionStorage")
      } else {
          console.warn("No formattedData to store in sessionStorage");
      }

      // IMPORTANT: Navigate first, then close the popup
      // Use window.location for a hard navigation that won't be intercepted
      window.location.href = "/search?source=chat"

      // Don't call onClose() here - the page will reload anyway
      // onClose() // This would close the popup *before* navigation, remove it
    } catch (error: any) { // Catch error as 'any' for easier access to message
      console.error("Error in Go to Tools handler:", error.message || error);
      // If there's an error storing data, we might still want to navigate
      // Optionally, show a user-friendly error message here before navigating
      alert("Error preparing tool data. Navigating to search anyway."); // Basic alert for debugging
       window.location.href = "/search?source=chat";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleGoToTools} className="bg-purple-600 hover:bg-purple-700 text-white">
            Go to Tools
          </Button>
        </div>
      </div>
    </div>
  )
}
*/