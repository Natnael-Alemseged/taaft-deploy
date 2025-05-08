"use client" // Keep this as it's a Client Component
import { FaStar } from "react-icons/fa"
import { type SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, Share2, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTool } from "@/hooks/use-tools" // Assuming this hook exists and works
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools" // Assuming these hooks exist and works
import { useAuth } from "@/contexts/auth-context" // Assuming useAuth hook is available
import Header from "@/components/header" // Assuming Header component path
import { useRouter } from "next/navigation" // Correct import for App Router
/// if api fails use fallback
import { withFallbackTool } from "@/lib/utils" // Assuming this utility exists
import { useParams } from "next/navigation" // Correct import for App Router
import LoadingToolDetailSkeleton from "@/components/skeletons/loading-tool-detail-skeleton" // Assuming skeleton component exists
// Add the import for the new tool detail service at the top
import { getToolByUniqueId, getToolByUniqueName } from "@/services/tool-detail-service" // Assuming these service functions exist
import { useQueryClient } from "@tanstack/react-query" // Assuming React Query is used
import Script from "next/script" // Add this import for schema markup
import { showLoginModal } from "@/lib/auth-events"
import { ShareButtonWithPopover } from "@/components/ShareButtonWithPopover"

// Add TypeScript interfaces
interface Tool {
  id: string;
  name: string;
  slug: string;
  link: string;
  category: string;
  description: string;
  features: string[];
  keywords: string[];
  pricing: string;
  hasFreeVersion: boolean;
  logoUrl: string;
  screenshotUrls: string[];
  rating?: number;
  reviewCount?: number;
  company?: string;
  image?: string;
  website?: string;
  pricingPlans?: Array<{
    name: string;
    price: string;
    description: string;
    ctaUrl?: string;
  }>;
  savedByUser?: boolean;
  // Assuming reviews and relatedTools might be part of the Tool data
  reviews?: Array<{
      id: string;
      rating: number;
      content: string;
      createdAt: string;
      user: { name: string }; // Basic user info for review
  }>;
  relatedTools?: Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      // Add other relevant fields for related tools preview
  }>;
  updatedAt?: string; // Assuming updatedAt might be part of the data
}

// Keep Schema interface as is, not used in the render logic directly, but good for reference
interface Schema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  softwareRequirements: string;
  operatingSystem: string;
  featureList: string[];
  image?: string;
  author: {
    "@type": string;
    name: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    reviewCount: number;
    bestRating: string;
    worstRating: string;
  };
  offers?: Array<{
    "@type": string;
    name: string;
    priceCurrency: string;
    price: number | string;
    description?: string;
    url: string;
    availability: string;
  }>;
}


export default function ToolDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const queryClient = useQueryClient()

  // Get auth state and loading state from useAuth
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // Get tool data and loading/error state from useTool
  const { data: tool, isLoading: isToolLoading, isError } = useTool(slug)

  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const [selectedPlan, setSelectedPlan] = useState<SetStateAction<null> | null>(null) // State to manage the selected plan

  // Handle Plan Click (toggle selection)
  const handlePlanClick = (planName: SetStateAction<null>) => {
    setSelectedPlan(selectedPlan === planName ? null : planName) // Deselect if it's already selected
  }

  // Add useEffect to try the unique name endpoint first, then fall back to unique ID if that fails
  useEffect(() => {
    const fetchToolData = async () => {
      // Only attempt fallback fetches if the primary useTool hook failed and is not loading
      if (isError && !isToolLoading && !tool) { // Ensure no tool data exists
        console.log("Primary fetch failed, attempting fallback lookups for slug:", slug);
        try {
          // First try to fetch by unique name
          const uniqueNameTool = await getToolByUniqueName(slug)
          if (uniqueNameTool) {
            console.log("Found tool by unique name:", uniqueNameTool.name);
            // Replace the tool data in the React Query cache
            queryClient.setQueryData(["tool", slug], uniqueNameTool)
            return // Stop here if successful
          }
        } catch (nameError) {
          console.log("Name lookup failed for slug:", slug, nameError);

          // If name lookup fails, try fetching by unique ID
          try {
            const uniqueIdTool = await getToolByUniqueId(slug)
            if (uniqueIdTool) {
              console.log("Found tool by unique ID:", uniqueIdTool.name);
              // Replace the tool data in the React Query cache
              queryClient.setQueryData(["tool", slug], uniqueIdTool)
              return // Stop here if successful
            }
          } catch (idError) {
            console.error("Failed to fetch by unique ID as well for slug:", slug, idError);
            // If both fail, the isError state from useTool will remain true
          }
        }
      }
    }

    // Trigger the fallback fetch logic if the initial hook indicates an error
    if (isError && !isToolLoading && !tool) {
      fetchToolData()
    }
    // Ensure the effect reruns if slug changes, assuming useTool might not cover all edge cases
    // React Query's useQuery with [tool, slug] as key should refetch when slug changes,
    // but keeping isError as a dependency is important for the *fallback* logic.
  }, [isError, isToolLoading, tool, slug, router, queryClient]) // Dependencies

  // Effect to show login modal if not authenticated.
  // This effect will run when isAuthenticated changes.
  useEffect(() => {
    // Only show the modal if not authenticated and auth check is complete
    // Checking !isAuthLoading ensures the modal doesn't flash before the initial check
    // However, if you want it to show immediately while auth is checked, remove !isAuthLoading
    if (!isAuthenticated && !isAuthLoading) {
      console.log("Showing login modal because not authenticated and auth check finished");
      console.log("isAuthenticated:", isAuthenticated);
 showLoginModal(router.asPath, () => {
  // This callback will be executed when the modal is closed
  router.push('/') // Redirect to home
});
    } else if (isAuthenticated && !isAuthLoading) {
        console.log("User is authenticated and auth check finished.");
    } else if (isAuthLoading) {
        console.log("Authentication state is still loading...");
    }
  }, [isAuthenticated, isAuthLoading]); // Add isAuthLoading as a dependency


  // --- Handle Loading State ---
  // Show loading skeleton if either tool data OR auth state is loading
  if (isToolLoading || isAuthLoading) {
    console.log(`Loading state: Tool loading: ${isToolLoading}, Auth loading: ${isAuthLoading}`);
    return <LoadingToolDetailSkeleton />;
  }

  // --- Handle Error State After Loading ---
  // Show error message if tool loading finished but resulted in an error AND no tool data is available
  if (isError && !tool) {
    console.error("Failed to load tool details after attempts.");
    // Redirect to 404 or show an error message
    router.push("/404");
    return null; // Return null while redirecting
  }

  // --- Handle Case Where No Tool Found After Loading/Error Check ---
  // This might catch scenarios where the tool was found but is null for some reason,
  // or the error handling above wasn't triggered but no tool exists.
  // This is a final safeguard before attempting to render the rest of the page.
  if (!tool) {
     console.error("Tool data is unexpectedly null after loading and error checks.");
     router.push("/404"); // Redirect if no tool object exists
     return null; // Return null while redirecting
  }


  // --- If we reach here, loading is complete, and we have a tool object ---

  // Apply fallback data if the fetched tool is incomplete (use `tool` directly here)
  const safeTool = withFallbackTool(tool ?? {}); // Using 'tool' state directly


  // Handle save toggle
const handleSaveToggle = (toolId: string, savedByUser: boolean) => {
 

  // Optimistic update
  queryClient.setQueryData(["tool", toolId], (oldTool: Tool | undefined) => {
    if (oldTool) {
      return { ...oldTool, savedByUser: !oldTool.savedByUser };
    }
    return oldTool;
  });

  if (savedByUser) {
    unsaveTool.mutate(toolId)
  } else {
    saveTool.mutate(toolId)
  }
}

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

  const formatPricingLabel = (pricing: string): string => {
    switch (pricing) {
      case "free":
        return "Free"
      case "freemium":
        return "Freemium"
      case "subscription":
        return "Subscription"
      case "one-time":
        return "One-time"
      case "usage-based":
        return "Usage-based"
      default:
        return pricing.charAt(0).toUpperCase() + pricing.slice(1)
    }
  }

  // Note: Schema markup using <Script> is typically placed within the <Head>
   // or body depending on the strategy, often managed outside the main component render function
   // if it needs to be dynamically generated based on data. For simplicity,
   // if you need it here, ensure you handle the JSON structure correctly based on safeTool.

   return (
    <div>
      {/* Example of adding schema markup - ensure this is correctly placed in your _document or layout */}
      {/* If adding here, consider the structure and use safeTool data */}
      {/* <Script
        id="tool-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": safeTool.name,
          "description": safeTool.description,
          "url": safeTool.link || safeTool.website, // Use link or website
          // Add other relevant schema properties based on safeTool
        })}}
      /> */}
  
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="text-[#6b7280]">
            Home
          </Link>
          <span className="mx-2 text-[#6b7280]">{">"}</span>
          <Link href="/browse" className="text-[#6b7280]">
            Tools
          </Link>
          <span className="mx-2 text-[#6b7280]">{">"}</span>
          <span className="text-[#6b7280]">{safeTool.name}</span>
        </div>
  
        {/* Tool Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">{safeTool?.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {safeTool?.keywords?.map((keyword, index) => (
                  <span key={index} className="text-sm bg-[#f5f0ff] text-[#a855f7] px-3 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
  
              <span className={`text-sm px-3 py-1 rounded-full ${getBadgeClass(safeTool?.pricing)}`}>
                {formatPricingLabel(safeTool?.pricing)}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {/* Try Tool Button - Moved to sidebar */}
          </div>
        </div>
  
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Description and Features */}
          <div className="md:col-span-2">
            <p className="text-[#4b5563] mb-8">{safeTool?.description}</p>
  
            {/* Key Features */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeTool?.features?.map((feature, index) => (
                  <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <div className="w-5 h-5 rounded-full bg-[#f5f0ff] flex items-center justify-center mr-2 mt-1">
                        <Check className="w-3 h-3 text-[#a855f7]" />
                      </div>
                      <h3 className="font-semibold text-[#111827]">{feature}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Screenshot Section */}
            {safeTool.screenshotUrls && safeTool.screenshotUrls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-[#111827] mb-6">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safeTool.screenshotUrls.map((screenshot, index) => (
                    <div
                      key={index}
                      className="border border-[#e5e7eb] rounded-lg overflow-hidden"
                      style={{
                        width: "100%",
                        maxWidth: "952px",
                        height: "fit-content",
                        aspectRatio: "952/643.5",
                      }}
                    >
                      <img
                        src={screenshot || "/placeholder.svg"}
                        alt={`${safeTool?.name} screenshot ${index + 1}`}
                        className="w-full h-auto object-cover"
                        style={{
                          maxHeight: "643.5px",
                          width: "100%",
                        }}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                          (e.target as HTMLImageElement).className = "w-full h-auto object-contain";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
  
            {/* User Reviews */}
            {safeTool?.reviews && safeTool.reviews.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-[#111827] mb-6">User Reviews</h2>
                {safeTool.reviews.map((review) => (
                  <div key={review.id} className="border border-[#e5e7eb] rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-[#111827] mr-2">{review.user.name}</h4>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, index) => (
                          <FaStar
                            key={index}
                            className={`w-4 h-4 mr-1 ${index + 1 <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#4b5563]">{review.content}</p>
                    <p className="text-sm text-[#6b7280] mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
  
            {/* Related Tools */}
            {safeTool?.relatedTools && safeTool.relatedTools.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-6">Similar Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {safeTool.relatedTools.map((similarTool) => (
                    <div key={similarTool.id} className="border border-[#e5e7eb] rounded-lg p-4">
                      <h3 className="font-semibold text-[#111827] mb-2">{similarTool.name}</h3>
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">
                          {similarTool.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#6b7280] mb-4">{similarTool.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button className="p-1 border border-[#e5e7eb] rounded">
                            <Bookmark className="w-3 h-3 text-[#6b7280]" />
                          </button>
                          <ShareButtonWithPopover itemLink={`/tools/${similarTool.id}`} />
                        </div>
                        <Button
                          className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-7 rounded-md flex items-center"
                          asChild
                        >
                          <Link href={`/tools/${similarTool.id}`}>
                            Try Tool <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          {/* Right Column - Sidebar */}
          <div className="md:col-span-1">
            <div className="border border-[#e5e7eb] rounded-lg p-6 sticky top-8">
              <div className="mb-6">
                {/* Try This Tool Button */}
                {safeTool?.link && (
                  <Button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-md flex items-center justify-center" asChild>
                    <a href={safeTool.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Try This Tool <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
  
              {safeTool?.logoUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={safeTool.logoUrl || "/placeholder.svg"}
                    alt={`${safeTool?.name} logo`}
                    className="h-16 w-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                      (e.target as HTMLImageElement).className = "w-16 h-16 object-contain";
                    }}
                  />
                </div>
              )}
  
              <h3 className="font-semibold text-[#111827] mb-2">Use Cases</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {safeTool?.features?.slice(0, 5).map((feature, index) => (
                  <span key={index} className="text-sm bg-[#f3f4f6] text-[#6b7280] px-3 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
  
              <div className="border-t border-[#e5e7eb] pt-4 mb-6">
                <h3 className="font-semibold text-[#111827] mb-2">Website</h3>
                {safeTool?.link ? (
                  <div
                    className="text-sm text-[#a855f7] hover:underline break-words max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                    title={safeTool.link}
                  >
                    <a href={safeTool.link} target="_blank" rel="noopener noreferrer" className="block">
                      {safeTool.link}
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-[#6b7280]">N/A</p>
                )}
              </div>
  
              <div className="border-t border-[#e5e7eb] pt-4">
                <h3 className="font-semibold text-[#111827] mb-2">Last Updated</h3>
                <p className="text-sm text-[#6b7280]">
                  {safeTool?.updatedAt ? new Date(safeTool.updatedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
  
              <div className="flex items-center justify-between mt-8">
                <button
                  className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                  onClick={() => handleSaveToggle(tool.unique_id, !!tool.savedByUser)}
                >
                  <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                </button>
                <ShareButtonWithPopover itemLink={`/tools/${tool.id}`} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}