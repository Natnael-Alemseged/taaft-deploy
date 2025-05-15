// "use client"
//
// import { useRef, useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Bookmark, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
// import clsx from "clsx"
// import { usePopularTools } from "@/hooks/use-tools"
// import type { Tool } from "@/types/tool"
// import { useAuth } from "@/contexts/auth-context"
// import { robotSvg } from "@/lib/reusable_assets"
// import { ShareButtonWithPopover } from "../ShareButtonWithPopover"
// import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
// import { SignInModal } from "@/components/home/sign-in-modal"
// import { useRouter, usePathname } from "next/navigation"
//
// export default function SponsoredTools() {
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const [currentPage, setCurrentPage] = useState(0)
//   const { isAuthenticated } = useAuth()
//   const router = useRouter()
//   const pathname = usePathname()
//   const saveTool = useSaveTool()
//   const unsaveTool = useUnsaveTool()
//   const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
//   const [previousRoute, setPreviousRoute] = useState<string | undefined>()
//
//
//   const { data, isLoading, isError,refetch } = usePopularTools()
//   const sponsoredTools: Tool[] = data?.tools || []
//   const itemsPerPage = 2
//   const totalPages = Math.ceil(sponsoredTools.length / itemsPerPage)
//
//   // Effect to add and clean up scroll listener
//   useEffect(() => {
//     const element = scrollRef.current
//     if (!element) return
//
//     const handleScroll = () => {
//       const newPage = Math.round(element.scrollLeft / element.clientWidth)
//       setCurrentPage(newPage)
//     }
//
//     element.addEventListener("scroll", handleScroll)
//     return () => {
//       element.removeEventListener("scroll", handleScroll)
//     }
//   }, [scrollRef, sponsoredTools])
//
//   const scroll = (direction: "left" | "right") => {
//     if (!scrollRef.current) return
//     const { clientWidth } = scrollRef.current
//     const pageWidth = clientWidth
//     const targetPage = direction === "left" ? Math.max(currentPage - 1, 0) : Math.min(currentPage + 1, totalPages - 1)
//     scrollRef.current.scrollTo({ left: targetPage * pageWidth, behavior: "smooth" })
//   }
//
//   const openSignInModal = () => {
//     setIsSignInModalOpen(true)
//   }
//
//   const closeAllModals = () => {
//     setIsSignInModalOpen(false)
//     setPreviousRoute(undefined)
//   }
//
//   const handleSaveToggle = (toolId: string, saved_by_user: boolean) => {
//     if (!isAuthenticated) {
//       setPreviousRoute(pathname)
//       setIsSignInModalOpen(true)
//       return
//     }
//
//     const mutation = saved_by_user ? unsaveTool : saveTool
//     mutation.mutate(toolId, {
//       onSuccess: () => {
//         refetch()
//       }
//     })
//   }
//
//   if (isLoading) {
//     return (
//       <section className="py-8 bg-white">
//         <div className="container mx-auto px-4 flex justify-center py-12">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
//         </div>
//       </section>
//     )
//   }
//
//   if (isError || sponsoredTools.length === 0) {
//     return null
//   }
//
//   return (
//     <>
//       <SignInModal
//         isOpen={isSignInModalOpen}
//         onClose={closeAllModals}
//         onSwitchToSignUp={() => {}}
//         previousRoute={previousRoute}
//       />
//       <section className="py-8 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-purple-700">Sponsored</h2>
//             {totalPages > 1 && (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => scroll("left")}
//                   className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={currentPage === 0}
//                   aria-label="Previous sponsored tool"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => scroll("right")}
//                   className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={currentPage >= totalPages - 1}
//                   aria-label="Next sponsored tool"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//
//           <div
//             ref={scrollRef}
//             className="flex gap-6 overflow-x-auto scroll-smooth transition-all duration-300 focus:outline-none scrollbar-hide"
//             style={{ scrollSnapType: "x mandatory" }}
//             tabIndex={0}
//             role="region"
//             aria-label="Sponsored Tools Carousel"
//           >
//             {sponsoredTools.map((tool) => (
//               <Card
//                 key={tool.id}
//                 className="min-w-full md:min-w-[calc(50%-12px)] flex-shrink-0 border border-gray-200 shadow-lg scroll-snap-align-start"
//                 aria-roledescription="slide"
//                 aria-label={tool.name}
//               >
//                 <CardContent className="p-4">
//                   <div className="mb-2 flex items-center gap-4">
//                     {tool.categories.length > 0 && (
//                       <span className="text-xs font-bold text-purple-500 border border-purple-300 rounded-full px-2 py-1">
//                         {tool.categories[0].name}
//                       </span>
//                     )}
//                   </div>
//                   <span className="flex items-center gap-2 pb-3">
//                     {tool.image?? robotSvg}
//                     <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
//                   </span>
//                   <p className="mb-4 text-sm text-gray-600 pt-3">
//                     {tool.description && tool.description.length > 80
//                       ? `${tool.description.substring(0, 80)}...`
//                       : tool.description}
//                   </p>
//                   <div className="mb-4 flex flex-wrap gap-1">
//                     {tool.keywords?.slice(0, 5).map((tag: string) => (
//                       <span key={tag} className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="flex items-center gap-2">
//                       <button
//                         className={`rounded p-1 ${tool.saved_by_user ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
//                         onClick={() => handleSaveToggle(tool.unique_id, !!tool.saved_by_user)}
//                       >
//                         <Bookmark className="h-4 w-4" fill={tool.saved_by_user ? "currentColor" : "none"} />
//                       </button>
//                       <ShareButtonWithPopover itemLink={`/tools/${tool.id}`} />
//                     </span>
//                     <Button
//                       className="bg-purple-600 hover:bg-purple-700 text-white"
//                       onClick={() => {
//                         if (!isAuthenticated) {
//                           setPreviousRoute(pathname)
//                           openSignInModal()
//                         } else {
//                           window.location.href = `/tools/${tool.id}`
//                         }
//                       }}
//                     >
//                       Try Tool <ExternalLink className="h-4 w-4 ml-1" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//
//           {/* Pagination Indicators */}
//           {totalPages > 1 && (
//             <div className="mt-6 flex justify-center space-x-2" role="tablist" aria-label="Sponsored Tools Pagination">
//               {Array.from({ length: totalPages }).map((_, i) => (
//                 <div
//                   key={i}
//                   className={clsx(
//                     "h-1.5 transition-all duration-300 cursor-pointer",
//                     currentPage === i ? "w-6 h-1 bg-purple-600" : "w-1.5 rounded-full bg-gray-300 opacity-50"
//                   )}
//                   role="tab"
//                   aria-controls={`sponsored-tool-page-${i}`}
//                   aria-selected={currentPage === i}
//                   tabIndex={currentPage === i ? 0 : -1}
//                   onClick={() => {
//                     if (scrollRef.current) {
//                       const pageWidth = scrollRef.current.clientWidth
//                       scrollRef.current.scrollTo({ left: i * pageWidth, behavior: "smooth" })
//                     }
//                   }}
//                   aria-label={`Go to page ${i + 1} of sponsored tools`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   )
// }


"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import clsx from "clsx"
import { usePopularTools } from "@/hooks/use-tools" // Assuming this fetches data with a key
import type { Tool } from "@/types/tool"
import { useAuth } from "@/contexts/auth-context"
import { robotSvg } from "@/lib/reusable_assets"
import { ShareButtonWithPopover } from "../ShareButtonWithPopover"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools" // Assuming these are React Query mutations
import { SignInModal } from "@/components/home/sign-in-modal"
import { useRouter, usePathname } from "next/navigation"

// Import useQueryClient from the query library you are using (e.g., '@tanstack/react-query')
import { useQueryClient } from '@tanstack/react-query';
import SponsoredToolCard from "@/components/cards/sponsored-tool-card";
import ToolCard from "@/components/cards/tool-card"; // Or 'react-query' depending on your version

// --- Define the query key used by usePopularTools ---
// This is crucial for setQueryData. Replace 'yourPopularToolsQueryKey'
// with the actual key used in your usePopularTools hook.
// A common pattern is an array like ['popularTools']
const POPULAR_TOOLS_QUERY_KEY = ['popularTools'];
// ----------------------------------------------------


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
                  <div
                      key={tool.unique_id}
                      className="w-full lg:w-auto flex-shrink-0 transition-transform duration-300"
                      style={{ scrollSnapAlign: "center" }}
                  >
                    {/* Use ToolCard for mobile and SponsoredToolCard for larger screens */}
                    <div className="block lg:hidden">
                      <ToolCard tool={tool} key={tool.unique_id} />
                    </div>
                    <div className="hidden lg:block">
                      <SponsoredToolCard tool={tool} />
                    </div>
                  </div>
              ))}
            </div>

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
                              const pageWidth = scrollRef.current.clientWidth;
                              scrollRef.current.scrollTo({ left: i * pageWidth, behavior: "smooth" });
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
  );

}
