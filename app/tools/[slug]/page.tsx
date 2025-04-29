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

// Add queryClient in the component
export default function ToolDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const queryClient = useQueryClient() // Add this line

  // Always call hooks unconditionally at the top level
  // Update the getToolById call in the component to try both endpoints
  // Replace the current useTool hook with:
  const { data: tool, isLoading, isError } = useTool(slug) // Assuming useTool handles initial fetch

  const { isAuthenticated } = useAuth()
  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const [selectedPlan, setSelectedPlan] = useState(null) // State to manage the selected plan

  // Handle Plan Click (toggle selection)
  const handlePlanClick = (planName: SetStateAction<null>) => {
    setSelectedPlan(selectedPlan === planName ? null : planName) // Deselect if it's already selected
  }

  // Add useEffect to try the unique name endpoint first, then fall back to unique ID if that fails
  // This effect should likely run after the initial useTool fetch attempt completes and fails
  useEffect(() => {
    const fetchToolData = async () => {
      // Only attempt fallback fetches if the primary useTool hook failed
      if (isError && !isLoading) {
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
      // If after all attempts, there's no tool data and not loading, redirect
      // This check should happen after the fetch attempts
      if (!isLoading && !tool && isError) { // Ensure isError is also true before redirecting on no tool
        console.log("No tool data found after all attempts, redirecting to 404 for slug:", slug);
        router.push("/404");
      }

    }

    // Trigger the fallback fetch logic if the initial hook indicates an error
    if (isError) {
      fetchToolData()
    }
    // Also consider if you need to refetch when slug changes, if useTool doesn't handle it
    // useTool should typically refetch when the query key ([tool, slug]) changes
  }, [isError, isLoading, tool, slug, router, queryClient]) // Dependencies


  // Handle save toggle
  const handleSaveToggle = () => {
    if (!isAuthenticated || !tool) return
    // Optimistically update the UI
    queryClient.setQueryData(["tool", slug], (oldTool: Tool | undefined) => {
      if (oldTool) {
        return { ...oldTool, savedByUser: !oldTool.savedByUser };
      }
      return oldTool;
    });

    if (tool?.savedByUser) {
      unsaveTool.mutate(tool.id)
    } else {
      saveTool.mutate(tool.id)
    }
  }

  // Show loading state
  if (isLoading) {
    return <LoadingToolDetailSkeleton /> // Assuming this component exists
  }

  // Show error state if loading is complete but there's an error and no tool data
  if (!isLoading && isError && !tool) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-red-600 mb-4">Failed to load tool details.</p>
          {/* Optionally add a retry button */}
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["tool", slug] })}>Retry Loading</Button>
        </div>
    );
  }


  // Return null briefly while we might redirect or if tool is still null after loading
  if (!tool) {
    return null; // Or a generic error message if redirect isn't desired
  }

  // Apply fallback data if the fetched tool is null or incomplete
  const safeTool = withFallbackTool(tool ?? {});


  // --- Generate JSON-LD Schema Markup ---
  const generateSchema = () => {
    if (!safeTool) return null;

    const schema: any = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication", // Or Product if more appropriate
      "name": safeTool.name,
      "description": safeTool.description,
      "url": safeTool.website || `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${slug}`, // Canonical URL for this page
      "applicationCategory": safeTool.category || "Other", // Use category, default to Other
      "softwareRequirements": "Web Browser", // Assuming web-based tools
      "operatingSystem": "All", // Assuming cross-platform web tools
      "aggregateRating": undefined as any, // Initialize as undefined
      "offers": undefined as any, // Initialize as undefined
      "featureList": safeTool.features || undefined, // Include features if available
    };

    // Add aggregateRating if rating data is available in the safeTool
    // Assuming safeTool has 'rating' (number) and 'reviewCount' (number) from fallback or API
    if (typeof safeTool.rating === 'number' && typeof safeTool.reviewCount === 'number' && safeTool.reviewCount > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": safeTool.rating.toFixed(1), // Format to one decimal place
        "reviewCount": safeTool.reviewCount,
      };
    }

    // Add offers if pricing plans are available in the safeTool
    // Assuming safeTool has 'pricingPlans' (array of objects with name, price, etc.)
    if (safeTool.pricingPlans && safeTool.pricingPlans.length > 0) {
      // You can represent multiple offers if you have different plans
      schema.offers = safeTool.pricingPlans.map(plan => ({
        "@type": "Offer",
        "name": plan.name,
        "priceCurrency": "USD", // Assuming USD, adjust if needed
        // Attempt to parse price as a number if possible, otherwise use the string
        "price": parseFloat(plan.price.replace(/[^0-9.]/g, '')) || plan.price,
        "description": plan.description,
        "url": plan.ctaUrl || safeTool.website || `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${slug}`, // Link to the offer/tool page
        "availability": "http://schema.org/InStock", // Assuming tools are generally available
      }));
      // If there's only one plan, or you want a single offer representation:
      // schema.offers = {
      //      "@type": "Offer",
      //      "priceCurrency": "USD",
      //      "price": parseFloat(safeTool.pricingPlans[0].price.replace(/[^0-9.]/g, '')) || safeTool.pricingPlans[0].price,
      //      "availability": "http://schema.org/InStock",
      //      "url": safeTool.pricingPlans[0].ctaUrl || safeTool.website || `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${slug}`,
      // };
    } else if (safeTool.pricing && (safeTool.pricing.toLowerCase() === 'free' || safeTool.pricing.toLowerCase() === 'freemium')) {
      // Fallback offer for free/freemium if no detailed plans
      schema.offers = {
        "@type": "Offer",
        "priceCurrency": "USD", // Assuming USD
        "price": "0",
        "availability": "http://schema.org/InStock",
        "url": safeTool.website || `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${slug}`,
      };
    }


    return JSON.stringify(schema);
  };

  const schemaMarkup = generateSchema();


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
  return (
      <div className="min-h-screen bg-white">
        {/* Add JSON-LD Schema Markup */}
        {schemaMarkup && (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaMarkup }}
            />
        )}

        <Header /> {/* Assuming Header component */}
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
                                maxWidth: "952px", // Max width constraint
                                height: "fit-content", // "Hug" behavior
                                aspectRatio: "952/643.5", // Maintain original ratio (≈1.48)
                              }}
                          >
                            <img
                                src={screenshot || "/placeholder.svg"} // Use placeholder on error
                                alt={`${safeTool?.name} screenshot ${index + 1}`}
                                className="w-full h-auto object-cover"
                                style={{
                                  maxHeight: "643.5px", // Constrain height
                                  width: "100%", // Fill available width
                                }}
                                loading="lazy"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                                  ;(e.target as HTMLImageElement).className = "w-full h-auto object-contain" // Adjust class for placeholder
                                }}
                            />
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Pricing */}
              {safeTool?.pricingPlans && safeTool.pricingPlans.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-bold text-[#111827] mb-6">Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {safeTool.pricingPlans.map((plan, index) => (
                          <div
                              key={plan.name}
                              className={`relative border rounded-lg p-6 transition-transform duration-200 cursor-pointer
                  ${selectedPlan === plan.name ? "border-4 border-[#a855f7] scale-105" : "border-[#e5e7eb] hover:shadow-md hover:scale-102"}
                  ${plan.isFeatured ? "shadow-md border-[#a855f7]" : ""}
                `}
                              onClick={() => handlePlanClick(plan.name)}
                          >
                            {plan.isFeatured && (
                                <div className="absolute top-0 right-0 bg-[#a855f7] text-white text-xs py-1 px-2 rounded-tl-lg rounded-br-sm">
                                  POPULAR
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-[#111827] mb-2">{plan.name}</h3>
                            <p className="text-2xl font-bold text-[#a855f7] mb-4">
                              {plan.price}
                              <span className="text-sm text-[#4b5563] ml-1">/mo</span>
                            </p>
                            <p className="text-sm text-[#6b7280] mb-4">{plan.description}</p>
                            <ul className="list-disc list-inside text-[#4b5563] mb-4">
                              {plan.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                              ))}
                            </ul>
                            <Button
                                className={`w-full ${
                                    plan.isFeatured
                                        ? "bg-[#a855f7] hover:bg-[#9333ea]"
                                        : "bg-white text-[#a855f7] border border-[#a855f7] hover:bg-[#f5f0ff]"
                                } text-white px-4 py-2 rounded-md`}
                                asChild // Use asChild to make the Button render as an anchor tag
                            >
                              <a href={plan.ctaUrl} target="_blank" rel="noopener noreferrer" className={plan.isFeatured ? "" : "text-[#a855f7]"}>
                                {plan.ctaText}
                              </a>
                            </Button>
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
                            {/* Star rating component */}
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
                                <button className="p-1 border border-[#e5e7eb] rounded">
                                  <Share2 className="w-3 h-3 text-[#6b7280]" />
                                </button>
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
                  {safeTool?.link && ( // Only show button if link exists
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
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                            ;(e.target as HTMLImageElement).className = "w-16 h-16 object-contain" // Ensure placeholder also has object-contain
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
                          title={safeTool.link} // Use safeTool.link for title
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
                      className={`p-2 border border-[#e5e7eb] rounded-lg ${
                          safeTool?.savedByUser ? "text-purple-600" : "text-gray-600"
                      }`}
                      onClick={handleSaveToggle}
                  >
                    <Bookmark className="w-5 h-5" fill={safeTool?.savedByUser ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2 border border-[#e5e7eb] rounded-lg">
                    <Share2 className="w-5 h-5 text-[#6b7280]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
