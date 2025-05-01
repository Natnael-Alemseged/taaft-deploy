// components/BrowseToolsClientContent.tsx
"use client" // Keep the directive

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Import hooks for data fetching
import { useTools } from "@/hooks/use-tools"
import { useCategories } from "@/hooks/use-categories"

// Import reusable ToolCard component
import ToolCard from "@/components/tool-card"

// Import Next.js router and pathname hooks for App Router
import { useRouter, useSearchParams, usePathname } from "next/navigation"

// Import slugify (assuming it's in your lib/utils)
import { slugify } from "@/lib/utils" // Adjust path if necessary

// Assume you have a type for your tool data, maybe from your hook or service
// import type { Tool } from "@/types/tool"; // Example type matching useTools return structure


export default function BrowseToolsClientContent() {
  // --- Hooks ---
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all-categories")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 12 // Items per page
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)


  // --- Effect for Search Query Debounce and URL Update ---
  // This effect updates the URL based on user typing (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)

      // Update URL with search query and reset page
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (searchQuery) {
        current.set("q", searchQuery)
      } else {
        current.delete("q")
      }

      // Always reset page to 1 when search changes
      // No need to setPage(1) here as the URL sync effect handles it
      // setPage(1); // Removed this line as URL sync effect will set it based on URL change
      current.delete("page"); // Remove page param from URL

      const search = current.toString()
      const query = search ? `?${search}` : ""
      router.replace(`${pathname}${query}`)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
    // Depend on searchQuery to trigger the debounce
    // Depend on searchParams, pathname, router for building the new URL
  }, [searchQuery, searchParams, pathname, router])


  // --- Sync state with URL query parameter on mount and URL changes ---
  // This effect initializes state from the URL and keeps it in sync
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    const pageFromUrl = searchParams.get("page")
    const searchFromUrl = searchParams.get("q"); // <--- Get search query from URL

    // Sync category state
    if (categoryFromUrl !== null && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl)
    } else if (categoryFromUrl === null && selectedCategory !== "all-categories") {
         // If category param is removed, reset state to 'all-categories'
        setSelectedCategory("all-categories");
    }

    // Sync page state
    if (pageFromUrl !== null) {
      const parsedPage = Number.parseInt(pageFromUrl, 10)
      if (!isNaN(parsedPage) && parsedPage > 0 && parsedPage !== page) {
        setPage(parsedPage)
      }
    } else if (page !== 1) {
        // If page param is removed, reset state to 1
        setPage(1);
    }

    // Sync search query state <-- Added this
    // Only update if the URL param is different or null AND the state is not already matching the null/empty case
    if (searchFromUrl !== null && searchFromUrl !== searchQuery) {
         setSearchQuery(searchFromUrl);
         // Also update debouncedQuery immediately if loading from URL, skips the debounce delay visually
         setDebouncedQuery(searchFromUrl);
    } else if (searchFromUrl === null && searchQuery !== "") {
         // If search param is removed, reset state
         setSearchQuery("");
         setDebouncedQuery("");
    }

  }, [searchParams, searchQuery, selectedCategory, page]) // <-- Added state variables as dependencies


  // --- Data Fetching Hooks ---
  // Fetch tools data based on current state (which is synced with URL)
  const {
    data: toolsData, // toolsData is { tools: Tool[], total: number } | undefined
    isLoading: isLoadingTools,
    isError: isErrorTools,
  } = useTools({
    category: selectedCategory !== "all-categories" ? selectedCategory : undefined,
    search: debouncedQuery, // Use debouncedQuery for fetching
    page,
    limit,
  })


  // Fetch categories data for the dropdown
  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories()

  // --- Prepare data for UI ---
  const categoryDropdownList = useMemo(() => {
    const allCatsEntry = {
      id: "all",
      name: "All Categories",
      slug: "all-categories",
      count: toolsData?.total || 0, // Use total count from tools API if available
      imageUrl: "" /* or iconName */,
    }

    if (!categoriesData) return [allCatsEntry]

    const fetchedCategories = categoriesData.map((cat) => ({
      ...cat,
      slug: cat.slug || cat.id,
      // Add other properties needed by the dropdown rendering if any (e.g., count)
    }))

    // Sort categories alphabetically, keeping "All Categories" first
    fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));

    return [allCatsEntry, ...fetchedCategories]
  }, [categoriesData, toolsData?.total]) // Add toolsData.total as dependency if using its count


  // --- Schema.org Generation and Injection Effect ---
  // This effect runs when toolsData or URL params change to update the schema
  useEffect(() => {
    // Only generate schema if tools data is loaded and available
    if (!toolsData?.tools || toolsData.tools.length === 0) {
        // Clean up existing schema if no tools are displayed
        const existingSchema = document.getElementById('tool-list-schema');
        if (existingSchema) {
          existingSchema.remove();
        }
        return; // No tools to list, remove any existing schema
    }

    // Get site URL (accessible client-side via NEXT_PUBLIC prefix)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taaft.org'; // Replace with your actual default URL

    // Construct the canonical URL for the current page based on state/URL params
    const current = new URLSearchParams();
    if (selectedCategory !== 'all-categories') {
        current.set('category', selectedCategory);
    }
    // Use debouncedQuery for schema as it reflects the data fetched
    if (debouncedQuery) {
         current.set('q', debouncedQuery);
    }
    if (page > 1) {
        current.set('page', page.toString());
    }
    const queryString = current.toString();
    const canonicalUrl = `${siteUrl}${pathname}${queryString ? '?' + queryString : ''}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Dataset", // Type for the page displaying a collection
        "name": "Browse AI Tools | TAAFT", // Static title, or make dynamic if needed
        "description": "Discover and compare the best AI tools for your needs.", // Static description (can make dynamic)
        "url": canonicalUrl, // Canonical URL for this specific filtered/paginated page
        "mainEntity": { // The main content of the page is an ItemList
            "@type": "ItemList",
            // "numberOfItems": toolsData.total, // Optional: if total count is available
            "itemListElement": toolsData.tools.map((tool, index) => {

                // Map price string to Schema.org Offer if possible
                let offersSchema = undefined;
                if (tool.price !== undefined && tool.price !== null) {
                     const priceStr = String(tool.price).toLowerCase(); // Ensure string and lowercase
                     const priceValue = parseFloat(priceStr); // Attempt to parse number
                     offersSchema = {
                          "@type": "Offer",
                          "priceCurrency": "USD", // Or whatever currency is appropriate
                          "availability": "https://schema.org/InStock" // Assume in stock if listed
                     };

                     if (!isNaN(priceValue)) {
                         offersSchema.price = priceValue.toFixed(2);
                     } else if (priceStr === 'free') {
                         offersSchema.price = '0';
                     } else {
                         // For non-numeric/non-free strings like 'freemium' or 'paid',
                         // include the original string in 'name' or a category if appropriate,
                         // but 'price' must be a number or omitted if unknown.
                         // Omitting 'price' is safer if it's not a number.
                         // Add a name to the offer to clarify
                         offersSchema.name = `${tool.price} Plan`;
                         // You might add offers.category = tool.price; here if you want to categorize the offer type itself
                     }

                     if (tool.link) {
                         offersSchema.url = tool.link; // Use the external link for the offer URL
                     }

                     // Add priceValidUntil if applicable (optional but recommended)
                     // offersSchema.priceValidUntil = "YYYY-MM-DD"; // Replace with actual or omit

                }

                // Map rating string to Schema.org AggregateRating if available and valid
                let aggregateRatingSchema = undefined;
                if (tool.rating !== undefined && tool.rating !== null) {
                    const ratingValue = parseFloat(tool.rating);
                    // Schema requires ratingValue and bestRating, and optionally ratingCount
                    // Only include if ratingValue is a valid number
                    if (!isNaN(ratingValue)) {
                        aggregateRatingSchema = {
                             "@type": "AggregateRating",
                             "ratingValue": ratingValue.toFixed(2), // Use the parsed float, formatted
                             "bestRating": "5.0", // Assuming a 5-star scale
                             // ratingCount is needed if available from API, otherwise omit
                        };
                    }
                }


                return {
                "@type": "ListItem",
                // Calculate position across pages
                "position": ((page - 1) * limit) + index + 1,
                "item": {
                    "@type": "SoftwareApplication", // Type for an individual tool
                    "name": tool.name,
                    "description": tool.description, // Use the tool's description
                    // Assuming your tool object has an ID or slug for generating its page URL
                    "url": `${siteUrl}/tools/${tool.slug || slugify(tool.id)}`, // URL to the individual tool's page on your site
                    // Use tool.link for the external homepage URL if applicable, or for the offer URL
                    // Schema.org best practice is often to use 'url' for the primary page about the thing (your internal page)
                    // and 'offers.url' for the place to buy/access (external link).
                    ...(tool.link && !offersSchema?.url && { "applicationSuite": { "@type": "WebSite", "url": tool.link, "name": `${tool.name} Homepage` } }), // Optional: Link to external homepage

                    ...(tool.imageUrl && { "image": tool.imageUrl }), // Add image if available
                    // Add category if available and relevant for SoftwareApplication
                    // Assuming tool.categories is an array of strings or objects with 'name'
                    ...(tool.categories && tool.categories.length > 0 && {
                         "applicationCategory": tool.categories.map(cat => (typeof cat === 'string' ? cat : cat.name || cat.slug || cat.id)) // Map categories
                    }),
                    ...(tool.keywords && tool.keywords.length > 0 && {
                         // Schema expects a comma-delimited string or array of strings
                         "keywords": Array.isArray(tool.keywords) ? tool.keywords.join(',') : String(tool.keywords)
                    }),
                    ...(aggregateRatingSchema && { "aggregateRating": aggregateRatingSchema }), // Add aggregate rating
                    ...(offersSchema && { "offers": offersSchema }) // Add offers/pricing information
                }
            }))
        }
    };

    const jsonSchema = JSON.stringify(schema);

    // Remove existing schema tag if it exists to prevent duplicates
    const existingSchema = document.getElementById('tool-list-schema');
    if (existingSchema) {
      existingSchema.innerHTML = jsonSchema; // Update existing one
    } else {
      // Create and add the new schema tag
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', 'tool-list-schema'); // Give it an ID for easy removal
      script.textContent = jsonSchema; // Use textContent for security
      document.head.appendChild(script);
    }

    // Cleanup function: remove the script tag when the component unmounts or dependencies change
    return () => {
      const scriptToRemove = document.getElementById('tool-list-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };

  }, [toolsData, pathname, searchParams, page, limit, debouncedQuery, selectedCategory]); // Dependencies for the effect


  // --- Handlers for UI interactions ---

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value
    setSearchQuery(newSearchQuery)
    // Debounce effect handles URL update and page reset
  }

  const handleCategorySelect = (category: { name: string; slug: string; count?: number }) => {
    const newSelectedCategorySlug = category.slug

    if (selectedCategory === newSelectedCategorySlug) {
      setShowCategoryDropdown(false)
      return
    }

    setSelectedCategory(newSelectedCategorySlug)
    setPage(1) // Reset to first page
    setShowCategoryDropdown(false) // Close dropdown

    // Update URL query parameter for category and reset page
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (newSelectedCategorySlug === "all-categories") {
      current.delete("category")
    } else {
      current.set("category", newSelectedCategorySlug)
    }
    current.delete("page") // Also remove page param as we reset to page 1
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`${pathname}${query}`)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage) // Update state locally

    // Update URL query parameter for page
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


  // --- Calculate pagination details ---
  const totalTools = toolsData?.total || 0
  const displayedToolsCount = toolsData?.tools?.length || 0
  const totalPages = Math.ceil(totalTools / limit)
  const showPagination = totalTools > limit

  // --- Determine text for tool count display ---
  const toolCountText = isLoadingTools
    ? "Loading tools..."
    : isErrorTools
      ? "Error loading tools"
      : totalTools === 0
        ? `No tools found${selectedCategory !== "all-categories" || searchQuery ? " for your criteria" : ""}`
        : `Showing ${displayedToolsCount} of ${totalTools} tools`

  // --- Determine which category name to display in the dropdown button ---
  const currentCategoryDisplayName = useMemo(() => {
    const selectedCat = categoryDropdownList.find((cat) => cat.slug === selectedCategory)
    return selectedCat ? selectedCat.name : selectedCategory === "all-categories" ? "All Categories" : selectedCategory
  }, [selectedCategory, categoryDropdownList])


  // --- Render (Moved from original component) ---
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb - Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-[#a855f7] dark:text-purple-400 hover:text-[#9333ea] dark:hover:text-purple-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-1">Browse AI Tools</h1>
          <p className="text-[#6b7280] dark:text-gray-400">Discover and compare the best AI tools for your needs</p>
        </div>

        {/* Search and Filter Controls */}
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
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-48">
            <button
              className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none text-gray-900 dark:text-white"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              disabled={isLoadingCategories || isErrorCategories}
            >
              <span>{currentCategoryDisplayName}</span>
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${
                  showCategoryDropdown ? "rotate-180" : "rotate-0"
                } text-gray-500 dark:text-gray-400`}
              />
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
                    categoryDropdownList.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedCategory === category.slug ? "font-medium bg-gray-50 dark:bg-gray-700" : ""
                        }`}
                      >
                        <span>{category.name}</span>
                        {typeof category.count === "number" && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{category.count}</span>
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
        <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-6">{toolCountText}</p>

        {/* Conditional Rendering for Loading, Error, and Tools Grid */}

        {/* Show loading spinner when tools are loading */}
        {isLoadingTools && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Show error message if tools failed to load and not loading */}
        {isErrorTools && !isLoadingTools && (
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

        {/* Render tools grid if data is loaded successfully and there are tools */}
        {!isLoadingTools && !isErrorTools && toolsData?.tools && toolsData.tools.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Map over the fetched tools data and render ToolCard for each */}
            {toolsData.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Show empty state message if loaded, no error, but no tools found */}
        {!isLoadingTools && !isErrorTools && (!toolsData?.tools || toolsData.tools.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">
              <p className="text-lg font-semibold">No tools found</p>
              {selectedCategory !== "all-categories" || searchQuery ? (
                <>
                  <p className="mt-2">Try adjusting your search criteria or filters.</p>
                  <Button
                    onClick={() => {
                      // Reset all filters
                      setSelectedCategory("all-categories")
                      setSearchQuery("")
                      // Update URL (clearing search params)
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


        {/* Pagination */}
        {showPagination && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isLoadingTools}
                className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              {/* Next Button */}
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isLoadingTools}
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