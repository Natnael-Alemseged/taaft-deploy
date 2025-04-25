"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import clsx from "clsx"
// Import the usePopularTools hook
import { usePopularTools } from "@/hooks/use-tools"
import type { Tool } from "@/types/tool" // Assuming Tool type is defined in types/tool

export default function SponsoredTools() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)

  // Use the usePopularTools hook to fetch data
  // You can adjust the limit if needed, e.g., usePopularTools(4) to match the static data count
  const { data, isLoading, isError } = usePopularTools();

  // Access the tools array from the fetched data, defaulting to an empty array if data or data.tools is null/undefined
  const sponsoredTools: Tool[] = data?.tools || [];

  // itemsPerPage should represent the number of items visible in one scroll "page".
  // Based on the CSS `md:min-w-[calc(50%-12px)]`, it seems designed to show 2 items on medium screens and above.
  // We'll keep this as 2 for the pagination calculation.
  const itemsPerPage = 2;

  // Calculate total pages based on the fetched tools length
  const totalPages = Math.ceil(sponsoredTools.length / itemsPerPage);

  // Effect to add and clean up scroll listener
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      // Calculate the current page based on scroll position
      // Divide scrollLeft by the width of one "page" (clientWidth)
      // Round to the nearest whole number.
      const newPage = Math.round(element.scrollLeft / element.clientWidth)
      setCurrentPage(newPage)
    }

    element.addEventListener("scroll", handleScroll)

    // Clean up the event listener
    return () => {
      element.removeEventListener("scroll", handleScroll)
    }
  }, [scrollRef, sponsoredTools]); // Added sponsoredTools to dependencies to recalculate totalPages if tools change


  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    const pageWidth = clientWidth; // Assume clientWidth is the width of one "page"

    // Calculate the target page index
    const targetPage = direction === "left" ? Math.max(currentPage - 1, 0) : Math.min(currentPage + 1, totalPages - 1);

    // Scroll to the calculated position
    scrollRef.current.scrollTo({ left: targetPage * pageWidth, behavior: "smooth" });

    // The scroll event listener will update the currentPage state based on the actual scroll position.
    // Removed explicit setCurrentPage(newPage) call here to avoid potential state conflicts.
  }

  // Function to format pricing label (copied from FeaturedTools for consistency)
  const formatPricingLabel = (pricing: string): string => {
    switch (pricing) {
      case "free": return "Free";
      case "freemium": return "Freemium";
      case "subscription": return "Subscription";
      case "one-time": return "One-time";
      case "usage-based": return "Usage-based";
      default: return pricing?.charAt(0).toUpperCase() + pricing?.slice(1) || "Unknown";
    }
  };

  // Function to get badge class (copied from FeaturedTools for consistency)
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


  // If loading, show a loading indicator
  if (isLoading) {
    return (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
          </div>
        </section>
    );
  }

  // If error or no tools, don't render the section
  if (isError || sponsoredTools.length === 0) {
    return null;
  }


  return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-purple-700">Sponsored</h2>
            {/* Only show navigation if there's more than one page */}
            {totalPages > 1 && (
                <div className="flex space-x-2">
                  <button
                      onClick={() => scroll("left")}
                      className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 0} // Disable left button on first page
                      aria-label="Previous sponsored tool"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                      onClick={() => scroll("right")}
                      className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage >= totalPages - 1} // Disable right button on last page
                      aria-label="Next sponsored tool"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
            )}
          </div>

          {/* Make the scrollable container focusable and add aria-live for accessibility */}
          <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth transition-all duration-300 focus:outline-none scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
              tabIndex={0} // Make it focusable
              role="region" // Indicate this is a section of content
              aria-label="Sponsored Tools Carousel" // Label for screen readers
          >
            {sponsoredTools.map((tool) => (
                // Use the fetched tool data properties
                <Card
                    key={tool.id} // Use tool.id from fetched data
                    className="min-w-full md:min-w-[calc(50%-12px)] flex-shrink-0 border border-gray-200 shadow-lg scroll-snap-align-start"
                    // Add aria-roledescription and aria-label for each card for better accessibility with carousel pattern
                    aria-roledescription="slide"
                    aria-label={`${tool.name}, ${tool.category}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-4">
                      {/* Use fetched category and pricing */}
                      <span className="text-xs font-medium text-gray-500">{tool.category}</span>
                      {/* Assuming you have a way to determine if a sponsored tool is "Premium" vs "Free"
                      This might need adjustment based on your Tool type and API response */}
                      <span className={`rounded ${getBadgeClass(tool.pricing)} px-2 py-0.5 text-xs font-medium`}>
                     {formatPricingLabel(tool.pricing)}
                   </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3> {/* Use fetched name */}
                    {/* Modified line to truncate description */}
                    <p className="mb-4 text-sm text-gray-600">
                      {tool.description && tool.description.length > 80 // Check if description exists and is longer than 200 chars
                          ? `${tool.description.substring(0, 80)}...` // Truncate and add ellipsis
                          : tool.description} {/* Display full description if not too long */}
                    </p>

                    {/* Assuming fetched tools might have tags or similar properties */}
                    {/* If tags are not directly available, you might need to adapt this or remove */}
                    {/* For now, keeping the structure but it might not display anything if tool.tags is undefined */}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {/* Replace tool.tags with appropriate property from your fetched Tool type if different */}
                      {(tool as any).tags?.map((tag: string) => (
                          <span key={tag} className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {tag}
                    </span>
                      ))}
                    </div>


                    <div className="flex items-center justify-between">
                      {/* Update Link/Button destination if needed based on tool ID */}
                      {/* Assuming a link to a tool detail page */}
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                        <a href={`/tools/${tool.id}`}>Try Tool</a>
                      </Button>
                      <button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500" aria-label={`Share ${tool.name}`}>
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {/* Pagination Indicators */}
          {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2" role="tablist" aria-label="Sponsored Tools Pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "h-1.5 transition-all duration-300 cursor-pointer",
                            currentPage === i ? "w-6 h-1 bg-purple-600 " : "w-1.5 rounded-full bg-gray-300 opacity-50",
                        )}
                        role="tab"
                        aria-controls={`sponsored-tool-page-${i}`} // Adjust if needed
                        aria-selected={currentPage === i}
                        tabIndex={currentPage === i ? 0 : -1}
                        onClick={() => {
                          if (scrollRef.current) {
                            const pageWidth = scrollRef.current.clientWidth
                            scrollRef.current.scrollTo({ left: i * pageWidth, behavior: "smooth" })
                          }
                        }}
                        aria-label={`Go to page ${i + 1} of sponsored tools`}
                    ></div>
                ))}
              </div>
          )}
        </div>
      </section>
  )
}

// The Card component definition remains unchanged
/*
import * as React from "react"
import { cn } from "@/lib/utils"
// ... Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent definitions ...
*/