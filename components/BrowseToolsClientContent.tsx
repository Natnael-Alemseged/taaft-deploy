"use client"

import type React from "react"
import {useState, useEffect, useMemo} from "react"
import Link from "next/link"
import {Search, ChevronDown, ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

// Import hooks for data fetching
import {useTools} from "@/hooks/use-tools"
import {useCategories} from "@/hooks/use-categories"


// Import reusable ToolCard component
import ToolCard from "@/components/cards/tool-card"

// Import Next.js router and pathname hooks for App Router
import {useRouter, useSearchParams, usePathname} from "next/navigation"

// Import types
import type {Tool} from "@/types/tool"
import type {Category} from "@/types/category"
import {useAuth} from "@/contexts/auth-context";

interface ToolsData {
    tools: Tool[];
    total: number;
}

interface BrowseToolsClientContentProps {
    initialToolsData: ToolsData | null,
    isErrorInitial: boolean,
    isFeaturedPage?: boolean,
    categoryName?: string,
    categorySlug?: string,
    isCategoryPage?: boolean,
    isFromBrowsePage?: boolean
    isFromCategoryPage?: boolean
}

export default function BrowseToolsClientContent({
                                                     isFromBrowsePage = false,
                                                     isFromCategoryPage = false,
                                                     initialToolsData,
                                                     isErrorInitial,
                                                     isFeaturedPage = false,
                                                     categoryName,
                                                     categorySlug,
                                                     isCategoryPage = false,
                                                 }: BrowseToolsClientContentProps) {
    // --- Hooks ---
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const {user, logout, isAuthenticated} = useAuth()

    // --- State Management ---
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all-categories")
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [page, setPage] = useState(1)
    const limit = 12 // Items per page
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

    // --- Effect for Search Query Debounce and URL Update ---
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

            // When search changes, we always reset to page 1.
            current.delete("page")

            const search = current.toString()
            const query = search ? `?${search}` : ""
            router.replace(`${pathname}${query}`)
        }, 100)

        return () => {
            clearTimeout(handler)
        }
    }, [searchQuery, searchParams, pathname, router])

    // --- Sync state with URL query parameter on mount and URL changes ---
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category")
        const pageFromUrl = searchParams.get("page")
        const searchFromUrl = searchParams.get("q")

        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl)
        }

        if (pageFromUrl) {
            const parsedPage = Number.parseInt(pageFromUrl, 10)
            if (!isNaN(parsedPage) && parsedPage > 0) {
                setPage(parsedPage)
            }
        }

        if (searchFromUrl) {
            setSearchQuery(searchFromUrl)
            setDebouncedQuery(searchFromUrl)
        }
    }, [searchParams])

    // --- Data Fetching Hooks ---
    const {
        data: toolsData,
        isLoading: isLoadingTools,
        isError: isErrorTools,
    } = useTools({
        isPublic: !isAuthenticated,
        category: isCategoryPage ? categorySlug : selectedCategory !== "all-categories" ? selectedCategory : undefined,
        search: debouncedQuery || undefined,
        page,
        limit,
        featured: isFeaturedPage ? true : undefined,
        sort_by: isCategoryPage ? 'name' : undefined,
        sort_order: isCategoryPage ? 'asc' : undefined,
    }) as { data: ToolsData | undefined; isLoading: boolean; isError: boolean }

    // Fetch categories data for the dropdown
    const {
        data: categoriesData,
        isLoading: isLoadingCategories,
        isError: isErrorCategories
    } = useCategories() as { data: Category[] | undefined; isLoading: boolean; isError: boolean }

    // --- Prepare data for UI ---
    const categoryDropdownList = useMemo(() => {
        const allCatsEntry = {
            id: "all",
            name: "All Categories",
            slug: "all-categories",
            count: toolsData?.total || 0,
            imageUrl: "",
        }

        if (!categoriesData) return [allCatsEntry]

        const fetchedCategories = categoriesData.map((cat) => ({
            ...cat,
            slug: cat.slug || cat.id,
        }))

        // Sort categories alphabetically, keeping "All Categories" first
        fetchedCategories.sort((a, b) => a.name.localeCompare(b.name))

        return [allCatsEntry, ...fetchedCategories]
    }, [categoriesData, toolsData?.total])

    // --- Handlers for UI interactions ---
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchQuery = e.target.value
        setSearchQuery(newSearchQuery)
        setPage(1) // Reset to first page when search changes
    }

    const handleCategorySelect = (category: { name: string; slug: string; count?: number }) => {
        const newSelectedCategorySlug = category.slug

        if (selectedCategory === newSelectedCategorySlug) {
            setShowCategoryDropdown(false)
            return
        }

        setSelectedCategory(newSelectedCategorySlug)
        setPage(1)
        setShowCategoryDropdown(false)

        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (newSelectedCategorySlug === "all-categories") {
            current.delete("category")
        } else {
            current.set("category", newSelectedCategorySlug)
        }
        current.delete("page")
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

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumb - Back to Home or Category Page */}
                <div className="mb-6">
                    <Link
                        href={isFromCategoryPage ? "/categories" : '/'}
                        className="inline-flex items-center text-[#a855f7] dark:text-purple-400 hover:text-[#9333ea] dark:hover:text-purple-300"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5"/>
                        {isFromCategoryPage ? "Back To Categories" : "Back to Home"}
                    </Link>
                </div>

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-1">
                        {categoryName
                            ? `${categoryName} AI Tools`
                            : isFeaturedPage
                                ? "Featured AI Tools"
                                : "Browse AI Tools"
                        }
                    </h1>
                    <p className="text-[#6b7280] dark:text-gray-400">
                        {categoryName
                            ? `Discover and explore the best ${categoryName} AI tools`
                            : isFeaturedPage
                                ? "Discover and explore our featured AI tools"
                                : "Discover and compare the best AI tools for your needs"
                        }
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-600"/>
                        </div>
                        <Input
                            type="text"
                            placeholder={isCategoryPage ? `Search ${categoryName} tools...` : "Search for tools..."}
                            className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Category Dropdown - Only show if not on a category page */}
                    {!isCategoryPage && (
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
                                <div
                                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    <div className="py-1">
                                        {isLoadingCategories ? (
                                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading
                                                categories...</div>
                                        ) : isErrorCategories ? (
                                            <div className="px-4 py-2 text-sm text-red-600">Error loading
                                                categories.</div>
                                        ) : (
                                            categoryDropdownList.map((category) => (
                                                <button
                                                    key={category.slug}
                                                    onClick={() => handleCategorySelect(category)}
                                                    className={`
      flex items-center justify-between w-full px-4 py-2 text-sm text-left 
      text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
      ${selectedCategory === category.slug ? "font-medium bg-gray-50 dark:bg-gray-700" : ""}
    `}
                                                >
                                                    <span className="truncate flex-1 min-w-0">{category.name}</span>
                                                    {typeof category.count === "number" && (
                                                        <span
                                                            className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
        {category.count}
      </span>
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tool Count Display */}
                <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-6">{toolCountText}</p>

                {/* Conditional Rendering for Loading, Error, and Tools Grid */}
                {isLoadingTools && (
                    <div className="flex justify-center items-center py-12">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                )}

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

                {!isLoadingTools && !isErrorTools && toolsData?.tools && toolsData.tools.length > 0 && (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {toolsData.tools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} hideFavoriteButton={isFromBrowsePage}/>
                        ))}
                    </div>
                )}

                {!isLoadingTools && !isErrorTools && (!toolsData?.tools || toolsData.tools.length === 0) && (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">
                            <p className="text-lg font-semibold">No tools found</p>
                            {selectedCategory !== "all-categories" || searchQuery ? (
                                <>
                                    <p className="mt-2">Try adjusting your search criteria or filters.</p>
                                    <Button
                                        onClick={() => {
                                            setSelectedCategory("all-categories")
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

                {/* Pagination */}
                {showPagination && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1 || isLoadingTools}
                                className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </Button>
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