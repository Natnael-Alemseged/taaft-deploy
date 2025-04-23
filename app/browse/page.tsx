// BrowseTools.tsx
"use client"; // Keep the directive

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ExternalLink, ChevronDown, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Import hooks for data fetching
import { useTools } from "@/hooks/use-tools";
import { useCategories } from "@/hooks/use-categories";

// Import reusable ToolCard component
import ToolCard from "@/components/tool-card";
// Import Category type (assuming you've updated it to include count and imageUrl/iconName)
import type { Category } from "@/types/category";

// Import Next.js router and pathname hooks for App Router
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // *** Corrected import ***

// You might need a Footer component import if it's part of this page's layout
// import Footer from "@/components/footer";

export default function BrowseTools() {
  // --- Hooks ---
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // *** Get the current pathname using usePathname ***

  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all-categories"); // Use slug or a consistent identifier
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12; // Items per page


  // --- Sync state with URL query parameter on mount and URL changes ---
  // This effect now correctly depends on searchParams to update state
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const pageFromUrl = searchParams.get('page');
    const searchFromUrl = searchParams.get('q'); // Assuming 'q' is the search param name

    // Update state based on URL parameters.
    // We need to be careful not to cause infinite loops if handlers also update searchParams.
    // React takes care of not rerunning the effect if the value of searchParams doesn't change.
    setSelectedCategory(categoryFromUrl || "all-categories");
    setPage(pageFromUrl ? parseInt(pageFromUrl, 10) || 1 : 1); // Parse page number, default to 1
    setSearchQuery(searchFromUrl || "");

  }, [searchParams]); // Effect depends on searchParams


  // --- Data Fetching Hooks ---
  // Fetch tools data based on current state
  const {
    data: toolsData,
    isLoading: isLoadingTools, // Renamed to avoid conflict
    isError: isErrorTools,     // Renamed to avoid conflict
    refetch: refetchTools, // Renamed
  } = useTools({
    category: selectedCategory !== "all-categories" ? selectedCategory : undefined, // Pass slug if not 'all-categories'
    search: searchQuery,
    page, // Pass the current page number
    limit, // Pass the limit per page
  });


  // Fetch categories data for the dropdown
  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories();


  // --- Prepare data for UI ---
  // Prepare the list of categories for the dropdown menu
  const categoryDropdownList = useMemo(() => {
    const allCatsEntry = {
      id: 'all',
      name: 'All Categories',
      slug: 'all-categories',
      count: toolsData?.total || 0, // Use total count from tools API if available
      imageUrl: '', /* or iconName */
      // Add other properties needed by the dropdown rendering if any
    };

    if (!categoriesData) return [allCatsEntry];

    const fetchedCategories = categoriesData.map(cat => ({
      ...cat,
      slug: cat.slug || cat.id, // Ensure a slug exists, fallback to id
    }));

    return [allCatsEntry, ...fetchedCategories]; // Include "All Categories" first
  }, [categoriesData, toolsData?.total]);


  // --- Handlers for UI interactions ---

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    // Update state locally
    setSearchQuery(newSearchQuery);
    setPage(1); // Reset to first page on new search

    // Update URL query parameter for search
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!newSearchQuery) {
      current.delete('q');
    } else {
      current.set('q', newSearchQuery);
    }
    current.delete('page'); // Also remove page param as we reset to page 1
    const search = current.toString();
    const query = search ? `?${search}` : '';
    // Use the 'pathname' variable obtained from usePathname hook
    router.replace(`${pathname}${query}`); // *** Corrected line ***
  };

  const handleCategorySelect = (category: { name: string, slug: string, count?: number }) => {
    const newSelectedCategorySlug = category.slug;

    if (selectedCategory === newSelectedCategorySlug) {
      setShowCategoryDropdown(false);
      return;
    }

    // Update state locally
    setSelectedCategory(newSelectedCategorySlug);
    setPage(1); // Reset to first page on new category selection
    setShowCategoryDropdown(false); // Close dropdown

    // Update URL query parameter for category
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newSelectedCategorySlug === 'all-categories') {
      current.delete('category');
    } else {
      current.set('category', newSelectedCategorySlug);
    }
    current.delete('page'); // Also remove page param as we reset to page 1
    const search = current.toString();
    const query = search ? `?${search}` : '';
    // Use the 'pathname' variable obtained from usePathname hook
    router.replace(`${pathname}${query}`); // *** Corrected line ***
  };

  const handlePageChange = (newPage: number) => {
    // Update state locally
    setPage(newPage);

    // Update URL query parameter for page
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newPage === 1) {
      current.delete('page');
    } else {
      current.set('page', newPage.toString());
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    // Use the 'pathname' variable obtained from usePathname hook
    router.replace(`${pathname}${query}`); // *** Corrected line ***
  };


  // --- Calculate pagination details ---
  const totalTools = toolsData?.total || 0;
  const displayedToolsCount = toolsData?.tools?.length || 0;
  const totalPages = Math.ceil(totalTools / limit);
  const showPagination = totalTools > limit;


  // --- Determine text for tool count display ---
  const toolCountText = isLoadingTools
      ? "Loading tools..."
      : isErrorTools
          ? "Error loading tools"
          : totalTools === 0
              ? `No tools found${selectedCategory !== 'all-categories' || searchQuery ? ' for your criteria' : ''}`
              : `Showing ${displayedToolsCount} of ${totalTools} tools`;


  // --- Determine which category name to display in the dropdown button ---
  const currentCategoryDisplayName = useMemo(() => {
    const selectedCat = categoryDropdownList.find(cat => cat.slug === selectedCategory);
    // If a category object is found with the matching slug, display its name.
    // Otherwise, default to "All Categories" if the slug is 'all-categories',
    // or display the raw selected slug if it's an unknown value (shouldn't happen with correct data).
    return selectedCat ? selectedCat.name : (selectedCategory === 'all-categories' ? 'All Categories' : selectedCategory);
  }, [selectedCategory, categoryDropdownList]);


  // --- Render ---
  return (<>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Header is assumed to be in the layout */}
        {/* <Header /> */}

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb - Back to Home */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#a855f7] dark:text-purple-400 hover:text-[#9333ea] dark:hover:text-purple-300">
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
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{category.count}</span> {/* Added ml-2 for spacing */}
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
          <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-6">
            {toolCountText}
          </p>

          {/* Conditional Rendering for Loading, Error, and Tools Grid */}

          {/* Show loading spinner when tools are loading */}
          {isLoadingTools && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
          )}

          {/* Show error message if tools failed to load and not loading */}
          {isErrorTools && !isLoadingTools && (
              <div className="text-center py-12 text-red-600 dark:text-red-500">
                <p>Failed to load tools. Please check your internet connection or try again later.</p>
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
          {!isLoadingTools && !isErrorTools && (!toolsData?.tools || toolsData.tools.length === 0) && totalTools === 0 && (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <p>No tools found matching your criteria.</p>
              </div>
          )}


          {/* Pagination */}
          {/* Show pagination controls only if needed */}
          {!isLoadingTools && !isErrorTools && showPagination && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {/* Previous Button */}
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  {/* Next Button */}
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

        {/* Assuming Footer is rendered elsewhere */}
        {/* <Footer /> */}
      </div>
  </>
);
}