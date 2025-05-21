
"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import clsx from "clsx"
import {useFeaturedTools, usePopularTools, useSavedTools} from "@/hooks/use-tools" // Assuming this fetches data with a key
import type { Tool } from "@/types/tool"
import { useAuth } from "@/contexts/auth-context"
import { robotSvg } from "@/lib/reusable_assets"
import { ShareButtonWithPopover } from "../ShareButtonWithPopover"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools" // Assuming these are React Query mutations
import { SignInModal } from "@/components/home/sign-in-modal"
import { useRouter, usePathname } from "next/navigation"


import { useQueryClient } from '@tanstack/react-query';
import SponsoredToolCard from "@/components/cards/sponsored-tool-card";
import ToolCard from "@/components/cards/tool-card";
import {PaginationArrows, PaginationIndicators} from "@/components/pagination-controls"; // Or 'react-query' depending on your version


const POPULAR_TOOLS_QUERY_KEY = ['popularTools'];



export default function SponsoredTools() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const saveTool = useSaveTool() // Assuming this returns a mutation object
  const unsaveTool = useUnsaveTool() // Assuming this returns a mutation object
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [previousRoute, setPreviousRoute] = useState<string | undefined>()

  // Get the query client instance
  const queryClient = useQueryClient();


  const { data, isLoading, isError, refetch } = usePopularTools() // Ensure usePopularTools uses the key defined above
  // const { data, isLoading, isError } = useFeaturedTools(4)
  const sponsoredTools: Tool[] = data?.tools || [] // Assuming data is { tools: Tool[] }
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

  // const scroll = (direction: "left" | "right") => {
  //   if (!scrollRef.current) return
  //   const { clientWidth } = scrollRef.current
  //   const pageWidth = clientWidth
  //   const targetPage = direction === "left" ? Math.max(currentPage - 1, 0) : Math.min(currentPage + 1, totalPages - 1)
  //   scrollRef.current.scrollTo({ left: targetPage * pageWidth, behavior: "smooth" })
  // }

  const openSignInModal = () => {
    setIsSignInModalOpen(true)
  }

  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setPreviousRoute(undefined)
  }

  // Modified handleSaveToggle for optimistic updates
  const handleSaveToggle = (toolUniqueId: string, currentSavedStatus: boolean) => {
    if (!isAuthenticated) {
      setPreviousRoute(pathname)
      setIsSignInModalOpen(true)
      return
    }

    // Determine the mutation function and the new saved status
    const mutation = currentSavedStatus ? unsaveTool : saveTool;
    const newSavedStatus = !currentSavedStatus;

    mutation.mutate(toolUniqueId, {
      // Optimistically update the cache
      onMutate: async (variables) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: POPULAR_TOOLS_QUERY_KEY });

        // Snapshot the previous value
        const previousToolsData = queryClient.getQueryData< { tools: Tool[] } >(POPULAR_TOOLS_QUERY_KEY);

        // Optimistically update the data in the cache
        if (previousToolsData) {
          const updatedTools = previousToolsData.tools.map(tool =>
              tool.unique_id === toolUniqueId
                  ? { ...tool, saved_by_user: newSavedStatus } // Toggle the saved status
                  : tool
          );

          queryClient.setQueryData<{ tools: Tool[] }>(POPULAR_TOOLS_QUERY_KEY, { tools: updatedTools });
        }

        // Return a context object with the snapshotted value
        return { previousToolsData };
      },
      // If the mutation fails, use the context we returned from onMutate to roll back
      onError: (err, variables, context) => {
        console.error("Mutation failed:", err); // Log the error
        // Optionally display a toast/notification about the failure

        if (context?.previousToolsData) {
          queryClient.setQueryData<{ tools: Tool[] }>(POPULAR_TOOLS_QUERY_KEY, context.previousToolsData);
        } else {
          // If no previous data was captured, you might need to refetch as a fallback
          queryClient.invalidateQueries({ queryKey: POPULAR_TOOLS_QUERY_KEY });
        }
      },
      // onSuccess is no longer strictly needed for the immediate UI update,
      // but can be used for other side effects if needed.
      // We remove the refetch() here as the optimistic update handles the UI
      // onSuccess: (data, variables, context) => {
      //   console.log("Mutation successful", data);
      // },
      // always runs after the mutation is either successful or fails
      onSettled: (data, error, variables, context) => {
        // Optional: Invalidate or refetch to ensure the cache is fully fresh
        // if you suspect backend changes other data, but often not needed for simple toggles
        // queryClient.invalidateQueries({ queryKey: POPULAR_TOOLS_QUERY_KEY });
      },
    });
  };
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const scrollAmount = container.clientWidth;
    const newPage = direction === "left"
        ? Math.max(currentPage - 1, 0)
        : Math.min(currentPage + 1, totalPages - 1);

    // Scroll to the exact position of the new page
    container.scrollTo({
      left: newPage * scrollAmount,
      behavior: "smooth"
    });

    // Immediately update the page state
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollPosition = element.scrollLeft;
      const containerWidth = element.clientWidth;
      const newPage = Math.round(scrollPosition / containerWidth);

      // Only update if we've scrolled at least 50% of a page
      const scrollThreshold = containerWidth * 0.5;
      const scrollRemainder = scrollPosition % containerWidth;

      if (scrollRemainder > scrollThreshold && newPage < currentPage) {
        // Scrolling left but not enough to change page
        return;
      }
      if (scrollRemainder < scrollThreshold && newPage > currentPage) {
        // Scrolling right but not enough to change page
        return;
      }

      setCurrentPage(newPage);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage]);


  if (isLoading) {
    // --- Placeholder Loading State ---
    // Mimic the section structure and the carousel layout
    return (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            {/* Placeholder for Header (Title and Navigation) */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple-700">Sponsored</h2>
              <div className="flex space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div> {/* Left arrow placeholder */}
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div> {/* Right arrow placeholder */}
              </div>
            </div>

            {/* Placeholder for Carousel (Horizontal list of skeleton cards) */}
            <div className="flex gap-6 overflow-x-auto scroll-smooth transition-all duration-300 focus:outline-none scrollbar-hide"
                 style={{ scrollSnapType: "x mandatory" }}>
              {/* Render a few skeleton cards */}
              {[...Array(3)].map((_, index) => ( // Showing 3 placeholders
                  <Card
                      key={index}
                      // Use sizing similar to your actual sponsored cards for layout consistency
                      className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.33%-16px)] flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-lg animate-pulse"
                      style={{ scrollSnapAlign: "center" }}
                  >
                    <CardContent className="p-4">
                      {/* Skeleton shapes for content within the card */}
                      <div className="mb-2 flex items-center gap-4">
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div> {/* Category tag placeholder */}
                      </div>
                      <span className="flex items-center gap-2 pb-3">
                                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div> {/* Image/Icon placeholder */}
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div> {/* Title placeholder */}
                                    </span>
                      <div className="mb-4 text-sm text-gray-600 pt-3">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div> {/* Description line 1 placeholder */}
                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div> {/* Description line 2 placeholder */}
                      </div>
                      <div className="mb-4 flex flex-wrap gap-1">
                        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div> {/* Tag 1 placeholder */}
                        <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div> {/* Tag 2 placeholder */}
                        <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div> {/* Tag 3 placeholder */}
                      </div>
                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div> {/* Bookmark icon placeholder */}
                                          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div> {/* Share icon placeholder */}
                                        </span>
                        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div> {/* Try Tool button placeholder */}
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>

            {/* Placeholder for Pagination Indicators */}
            <div className="mt-6 flex justify-center space-x-2">
              <div className="h-1.5 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div> {/* Active dot placeholder */}
              <div className="h-1.5 w-1.5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div> {/* Inactive dot placeholder */}
              <div className="h-1.5 w-1.5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div> {/* Inactive dot placeholder */}
            </div>
          </div>
        </section>
    );
    // --- End Placeholder Loading State ---
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
            <div className="mb-6 flex items-center justify-between"> {/* Changed to justify-between on all sizes */}
              <h2 className="text-2xl font-bold text-purple-700">Sponsored</h2>  <div className="block lg:hidden">
              {/*"right" "left"*/}
            </div>
              {/*{totalPages > 1 && (*/}
              {/*    <div className="flex space-x-2">*/}
              {/*      <button*/}
              {/*          onClick={() => scroll("left")}*/}
              {/*          className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"*/}
              {/*          disabled={currentPage === 0} // Disable left button on first page*/}
              {/*          aria-label="Previous sponsored tool"*/}
              {/*      >*/}
              {/*        <ChevronLeft className="h-4 w-4" />*/}
              {/*      </button>*/}
              {/*      <button*/}
              {/*          onClick={() => scroll("right")}*/}
              {/*          className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"*/}
              {/*          disabled={currentPage >= totalPages - 1} // Disable right button on last page*/}
              {/*          aria-label="Next sponsored tool"*/}
              {/*      >*/}
              {/*        <ChevronRight className="h-4 w-4" />*/}
              {/*      </button>*/}
              {/*    </div>*/}
              {/*)}*/}

            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth transition-all duration-300 focus:outline-none scrollbar-hide"
                style={{ scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth" // Ensure smooth scrolling is enabled
                }}
                tabIndex={0}
                role="region"
                aria-label="Sponsored Tools Carousel"
            >
              {sponsoredTools.map((tool) => (
                  <div
                      key={tool.unique_id}
                      className="w-full lg:w-auto flex-shrink-0 transition-transform duration-300"
                      style={{ scrollSnapAlign: "center" }}
                  >
                    {/* Use ToolCard for mobile and SponsoredToolCard for larger screens */}
                    <div className="block lg:hidden">
                      <ToolCard tool={tool} key={tool.unique_id}

                                breadcrumbItems={[{name: 'Home', path: '/'},
                                  {name: tool.name, path: null},
                      ]} />
                    </div>
                    <div className="hidden lg:block">
                      <SponsoredToolCard tool={tool} />
                    </div>
                  </div>
              ))}
            </div>

            {/* Pagination Indicators */}
            {sponsoredTools && sponsoredTools.length > 0 &&
                <PaginationIndicators
                    sponsoredToolsLength={sponsoredTools.length}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    scrollRef={scrollRef}
                />}
          </div>
        </section>
      </>
  );

}
