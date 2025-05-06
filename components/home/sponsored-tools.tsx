"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import clsx from "clsx"
import { usePopularTools } from "@/hooks/use-tools"
import type { Tool } from "@/types/tool"
import { useAuth } from "@/contexts/auth-context"
import { robotSvg } from "@/lib/reusable_assets"
import { ShareButtonWithPopover } from "../ShareButtonWithPopover"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { SignInModal } from "@/components/home/sign-in-modal"
import { useRouter, usePathname } from "next/navigation"

export default function SponsoredTools() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [previousRoute, setPreviousRoute] = useState<string | undefined>()

  const { data, isLoading, isError } = usePopularTools()
  const sponsoredTools: Tool[] = data?.tools || []
  const itemsPerPage = 2
  const totalPages = Math.ceil(sponsoredTools.length / itemsPerPage)

  // Effect to add and clean up scroll listener
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      const newPage = Math.round(element.scrollLeft / element.clientWidth)
      setCurrentPage(newPage)
    }

    element.addEventListener("scroll", handleScroll)
    return () => {
      element.removeEventListener("scroll", handleScroll)
    }
  }, [scrollRef, sponsoredTools])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    const pageWidth = clientWidth
    const targetPage = direction === "left" ? Math.max(currentPage - 1, 0) : Math.min(currentPage + 1, totalPages - 1)
    scrollRef.current.scrollTo({ left: targetPage * pageWidth, behavior: "smooth" })
  }

  const openSignInModal = () => {
    setIsSignInModalOpen(true)
  }

  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setPreviousRoute(undefined)
  }

  const handleSaveToggle = (toolId: string, savedByUser: boolean) => {
    if (!isAuthenticated) {
      setPreviousRoute(pathname)
      openSignInModal()
      return
    }

    if (savedByUser) {
      unsaveTool.mutate(toolId)
    } else {
      saveTool.mutate(toolId)
    }
  }

  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
        </div>
      </section>
    )
  }

  if (isError || sponsoredTools.length === 0) {
    return null
  }

  return (
    <>
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeAllModals} 
        onSwitchToSignUp={() => {}} 
        previousRoute={previousRoute}
      />
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-purple-700">Sponsored</h2>
            {totalPages > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => scroll("left")}
                  className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 0}
                  aria-label="Previous sponsored tool"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage >= totalPages - 1}
                  aria-label="Next sponsored tool"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth transition-all duration-300 focus:outline-none scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
            tabIndex={0}
            role="region"
            aria-label="Sponsored Tools Carousel"
          >
            {sponsoredTools.map((tool) => (
              <Card
                key={tool.id}
                className="min-w-full md:min-w-[calc(50%-12px)] flex-shrink-0 border border-gray-200 shadow-lg scroll-snap-align-start"
                aria-roledescription="slide"
                aria-label={tool.name}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-4">
                    {tool.categories.length > 0 && (
                      <span className="text-xs font-bold text-purple-500 border border-purple-300 rounded-full px-2 py-1">
                        {tool.categories[0].name}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-2 pb-3">
                    {robotSvg}
                    <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  </span>
                  <p className="mb-4 text-sm text-gray-600 pt-3">
                    {tool.description && tool.description.length > 80
                      ? `${tool.description.substring(0, 80)}...`
                      : tool.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-1">
                    {tool.keywords?.slice(0, 5).map((tag: string) => (
                      <span key={tag} className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <button
                        className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                        onClick={() => handleSaveToggle(tool.unique_id, !!tool.savedByUser)}
                      >
                        <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                      </button>
                      <ShareButtonWithPopover itemLink={`/tools/${tool.id}`} />
                    </span>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setPreviousRoute(pathname)
                          openSignInModal()
                        } else {
                          window.location.href = `/tools/${tool.id}`
                        }
                      }}
                    >
                      Try Tool <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
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
                    currentPage === i ? "w-6 h-1 bg-purple-600" : "w-1.5 rounded-full bg-gray-300 opacity-50"
                  )}
                  role="tab"
                  aria-controls={`sponsored-tool-page-${i}`}
                  aria-selected={currentPage === i}
                  tabIndex={currentPage === i ? 0 : -1}
                  onClick={() => {
                    if (scrollRef.current) {
                      const pageWidth = scrollRef.current.clientWidth
                      scrollRef.current.scrollTo({ left: i * pageWidth, behavior: "smooth" })
                    }
                  }}
                  aria-label={`Go to page ${i + 1} of sponsored tools`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
