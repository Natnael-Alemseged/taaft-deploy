"use client"

import { useRef, useState, useEffect } from "react" // Import useEffect
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import clsx from "clsx"

export default function SponsoredTools() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const sponsoredTools = [
    {
      id: 1,
      name: "VideoGen AI",
      category: "Video Creation",
      description:
        "Create professional videos from text in minutes with AI-powered editing, animations, and voiceover.",
      tags: ["Marketing", "Social Media", "Education"],
      isPopular: true,
    },
    {
      id: 2,
      name: "DataViz AI",
      category: "Data Visualization",
      description: "Transform complex data into beautiful, interactive visualizations with natural language commands.",
      tags: ["Business", "Research", "Reporting"],
      isFree: true,
    },
    {
      id: 3,
      name: "Designify AI",
      category: "Design Automation",
      description: "Automate design tasks with smart AI tools for UI, branding, and more.",
      tags: ["Design", "Productivity"],
      isFree: true,
    },
    {
      id: 4,
      name: "PromptHero",
      category: "Prompt Marketplace",
      description: "Explore and share the best AI prompts for various use cases.",
      tags: ["AI", "Community"],
      isFree: true,
    },
  ]

  const itemsPerPage = 2
  const totalPages = Math.ceil(sponsoredTools.length / itemsPerPage)

  // Effect to add and clean up scroll listener
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      // Calculate the current page based on scroll position
      // We divide the scrollLeft by the clientWidth (width of the visible area)
      // and round to the nearest whole number to get the page index.
      const newPage = Math.round(element.scrollLeft / element.clientWidth)
      setCurrentPage(newPage)
    }

    element.addEventListener("scroll", handleScroll)

    // Clean up the event listener
    return () => {
      element.removeEventListener("scroll", handleScroll)
    }
  }, [scrollRef]) // Re-run effect if scrollRef changes (though it won't in this case)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    const pageWidth = clientWidth
    const newPage = direction === "left" ? Math.max(currentPage - 1, 0) : Math.min(currentPage + 1, totalPages - 1)
    scrollRef.current.scrollTo({ left: newPage * pageWidth, behavior: "smooth" })
    // setCurrentPage is now handled by the scroll event listener, but keeping this
    // might help if scrollTo doesn't immediately trigger scroll events on some platforms.
    // However, for clean state management based on actual scroll position, the event listener is better.
    // Let's remove the setCurrentPage from here to rely purely on the scroll event.
    // setCurrentPage(newPage);
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-700">Sponsored</h2>
          {sponsoredTools.length > itemsPerPage && (
            <div className="flex space-x-2">
              <button
                onClick={() => scroll("left")}
                className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100"
                disabled={currentPage === 0} // Disable left button on first page
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100"
                disabled={currentPage === totalPages - 1} // Disable right button on last page
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Make the scrollable container focusable and add aria-live for accessibility */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth transition-all duration-300 focus:outline-none" // Added overflow-x-auto and focus:outline-none
          style={{ scrollSnapType: "x mandatory" }}
          tabIndex={0} // Make it focusable
          role="region" // Indicate this is a section of content
          aria-label="Sponsored Tools" // Label for screen readers
        >
          {sponsoredTools.map((tool) => (
            <Card
              key={tool.id}
              className="min-w-full md:min-w-[calc(50%-12px)] flex-shrink-0 border border-gray-200 shadow-lg scroll-snap-align-start"
              // Add aria-roledescription and aria-label for each card for better accessibility with carousel pattern
              aria-roledescription="slide"
              aria-label={`${tool.name}, ${tool.category}`}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-4">
                  <span className="text-xs font-medium text-gray-500">{tool.category}</span>
                  {tool.isPopular && (
                    <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                      Premium
                    </span>
                  )}
                  {tool.isFree && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">Free</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                <p className="mb-4 text-sm text-gray-600">{tool.description}</p>

                <div className="mb-4 flex flex-wrap gap-1">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Try Tool</Button>
                  <button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Indicators */}
        {totalPages > 1 && (
          // Add role="tablist" and aria-label for accessibility
          <div className="mt-6 flex justify-center space-x-2" role="tablist" aria-label="Pagination indicators">
            {Array.from({ length: totalPages }).map((_, i) => (
              // Add role="tab" and aria-controls for accessibility
              <div
                key={i}
                className={clsx(
                  "h-1.5 transition-all duration-300 cursor-pointer",
                  currentPage === i ? "w-6 h-1 bg-purple-600 " : "w-1.5 rounded-full bg-gray-300 opacity-50",
                )}
                role="tab"
                aria-controls={`sponsored-tool-page-${i}`}
                aria-selected={currentPage === i}
                tabIndex={currentPage === i ? 0 : -1}
                onClick={() => {
                  // Allow clicking dots to navigate
                  if (scrollRef.current) {
                    // Calculate the scroll position for the clicked page.
                    // Need to consider the width of one "page" which is likely the clientWidth of the container.
                    const pageWidth = scrollRef.current.clientWidth
                    scrollRef.current.scrollTo({ left: i * pageWidth, behavior: "smooth" })
                  }
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
