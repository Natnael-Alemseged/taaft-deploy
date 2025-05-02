"use client" // Keep this as it's a Client Component

import { FaStar } from "react-icons/fa"
import { type SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, Share2, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTool } from "@/hooks/use-tools" // Assuming this hook exists and works
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools" // Assuming these hooks exist and works
// IMPORTANT: Ensure useAuth hook is available and provides `isAuthenticated` status
import { useAuth } from "@/contexts/auth-context"
import Header from "@/components/header" // Assuming Header component path
import { useRouter, usePathname } from "next/navigation" // Correct import for App Router
/// if api fails use fallback
import { withFallbackTool } from "@/lib/utils" // Assuming this utility exists
import { useParams } from "next/navigation" // Correct import for App Router
import LoadingToolDetailSkeleton from "@/components/skeletons/loading-tool-detail-skeleton" // Assuming skeleton component exists
// Add the import for the new tool detail service at the top
import { getToolByUniqueId, getToolByUniqueName } from "@/services/tool-detail-service" // Assuming these service functions exist
import { useQueryClient } from "@tanstack/react-query" // Assuming React Query is used
import Script from "next/script" // Add this import for schema markup

// Import the function to show the login modal
import { showLoginModal } from "@/lib/auth-events"


// Add TypeScript interfaces (keeping these as provided)
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
    isFeatured?: boolean; // Assuming isFeatured might be on the plan type
    ctaText?: string; // Assuming ctaText might be on the plan type
    features: string[]; // Assuming features are on the plan type
  }>;
  savedByUser?: boolean;
  reviews?: Array<{ // Assuming a reviews structure for schema markup
      id: string;
      rating: number;
      content: string;
      user: { name: string };
      createdAt: string;
  }>;
  updatedAt?: string; // Assuming this field exists for "Last Updated"
  relatedTools?: Array<{ // Assuming a structure for related tools
      id: string;
      name: string;
      category: string;
      description: string;
      link: string; // Added link for consistency, though similarTools might not need it
  }>;
}

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


// Add queryClient in the component
export default function ToolDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const queryClient = useQueryClient()
  const pathname = usePathname() // Get current path

  // --- Move useAuth hook call inside the component function ---
  const { isAuthenticated } = useAuth()
  // --- End of move ---

  // Always call hooks unconditionally at the top level
  // Update the getToolById call in the component to try both endpoints
  // Replace the current useTool hook with:
  // This hook will fetch the data IF the user is authenticated
  const { data: tool, isLoading, isError } = useTool(slug, { enabled: isAuthenticated }); // Pass enabled: isAuthenticated


  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const [selectedPlan, setSelectedPlan] = useState(null) // State to manage the selected plan


  // --- Add the authentication check here, BEFORE any rendering logic ---
  useEffect(() => {
      // If not authenticated, show the modal and do nothing else related to fetching
      // This check is done here in useEffect to avoid potential hydration issues
      // if showLoginModal has DOM manipulation side effects.
      // It also ensures the modal is shown after the initial render cycle.
      if (!isAuthenticated) {
          console.log("User not authenticated, showing login modal");
          showLoginModal(pathname); // Pass current path as previous route
          // We don't return null or redirect here in the effect,
          // the return null in the component body handles rendering nothing
          // until authenticated.
      }
  }, [isAuthenticated, pathname]);

  // Handle the case where the user is NOT authenticated
  if (!isAuthenticated) {
    // You can return null, a simple message, or a placeholder
    // Returning null prevents the rest of the component from rendering
    // the tool details or loading/error states when not logged in.
    console.log("Rendering null because user is not authenticated");
    return null;
  }
  // --- End of authentication check ---


  // Handle Plan Click (toggle selection)
  const handlePlanClick = (planName: SetStateAction<null>) => {
    setSelectedPlan(selectedPlan === planName ? null : planName) // Deselect if it's already selected
  }

  // Add useEffect to try the unique name endpoint first, then fall back to unique ID if that fails
  // This effect should likely run after the initial useTool fetch attempt completes and fails
  useEffect(() => {
    const fetchToolData = async () => {

      // REMOVED: This check is now handled at the top level component body and the useEffect dependency
      // if(!isAuthenticated) {
      // showLoginModal()
      // return
      // }

      // Only attempt fallback fetches if the primary useTool hook failed AND user is authenticated
      // The `enabled: isAuthenticated` on useTool ensures it only runs if authenticated initially.
      // This useEffect then handles the fallback if that initial authenticated fetch failed.
      if (isError && !isLoading && isAuthenticated) { // Add isAuthenticated check here as well
        console.log("Primary fetch failed (user authenticated), attempting fallback lookups for slug:", slug);
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
      // If after all attempts, there's no tool data and not loading, AND user is authenticated, redirect
      if (!isLoading && isError && !tool && isAuthenticated) { // Ensure isAuthenticated before redirecting on no tool/error
        console.log("No tool data found after all attempts (user authenticated), redirecting to 404 for slug:", slug);
        router.push("/404");
      }
    }

    // Trigger the fallback fetch logic if the initial hook indicates an error AND user is authenticated
    if (isError && isAuthenticated) { // Only trigger fallback if authenticated
      fetchToolData()
    }
    // Dependencies for this effect
  }, [isError, isLoading, tool, slug, router, queryClient, isAuthenticated]) // Add isAuthenticated to dependencies


  // Handle save toggle - should only work if authenticated (already handled by useSaveTool/useUnsaveTool logic often)
  const handleSaveToggle = () => {
    if (!isAuthenticated || !tool) {
      // If not authenticated, maybe show the modal again?
      console.log("Attempted save toggle while not authenticated, showing login modal.");
      showLoginModal(pathname);
      return;
    }
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

  // Show loading state ONLY IF authenticated (handled by the useTool enabled option)
  if (isLoading) {
    return <LoadingToolDetailSkeleton /> // Assuming this component exists
  }

  // Show error state if loading is complete but there's an error and no tool data
  // This state should only be reachable IF the user is authenticated
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
  // This check should ideally not be necessary now if isLoading/isError/!isAuthenticated cover all cases
  // but keeping it might be safe depending on how useTool behaves on initial load vs error.
  if (!tool) {
    return null; // Or a generic error message if redirect isn't desired
  }

  // Apply fallback data if the fetched tool is null or incomplete
  const safeTool = withFallbackTool(tool ?? {}); // Use safeTool for rendering


  // --- Generate JSON-LD Schema Markup ---
  // (Schema generation logic remains the same, uses safeTool)
  const generateSchema = () => {
    if (!safeTool) return null;

    const schema: Schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": safeTool.name,
      "description": safeTool.description,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${slug}`,
      "applicationCategory": safeTool.category || "AI Tool",
      "softwareRequirements": "Web Browser",
      "operatingSystem": "All",
      "featureList": safeTool.features || [],
      "image": safeTool.logoUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/images/tools/${slug}.png`,
      "author": {
        "@type": "Organization",
        "name": "AI Tools Directory"
      }
    };

    // Add aggregateRating if available
    if (safeTool.reviews && safeTool.reviews.length > 0) {
      const totalRating = safeTool.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      const averageRating = totalRating / safeTool.reviews.length;

      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toFixed(1),
        "reviewCount": safeTool.reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    // Add offers based on pricing
    if (safeTool.pricingPlans && safeTool.pricingPlans.length > 0) {
      schema.offers = safeTool.pricingPlans.map((plan: any) => ({
        "@type": "Offer",
        "name": plan.name,
        "priceCurrency": "USD",
        "price": parseFloat(plan.price.replace(/[^0-9.]/g, '')) || plan.price,
        "description": plan.description,
        "url": plan.ctaUrl || safeTool.link || `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${slug}`,
        "availability": "http://schema.org/InStock"
      }));
    } else if (safeTool.pricing) {
      const isFree = safeTool.pricing.toLowerCase() === 'free' || safeTool.pricing.toLowerCase() === 'freemium';
      schema.offers = [{
        "@type": "Offer",
        "name": safeTool.pricing,
        "priceCurrency": "USD",
        "price": isFree ? "0" : "0", // Default to "0" if not free - revisit this logic if prices are non-zero but not in plans
        "availability": "http://schema.org/InStock",
        "url": safeTool.link || `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${slug}`
      }];
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


  // --- Start Rendering the Authenticated View ---
  return (
      <div className="min-h-screen bg-white">
        {schemaMarkup && (
            <Script
                id="tool-schema"
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
        <h2 className="text-xl font-bold text-[#111827] mb-6">Pricing</h2> {/* Added Pricing Title */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safeTool.pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              // Add the onClick handler here
              onClick={() => handlePlanClick(plan.name)} // <--- Add this line
              className={`relative border rounded-lg p-6 flex flex-col transition-transform duration-200 cursor-pointer h-full
                ${selectedPlan === plan.name ? "border-4 border-[#a855f7] scale-105 shadow-xl" : "border-[#e5e7eb] hover:shadow-lg hover:scale-102"}
                ${plan.isFeatured ? "shadow-lg border-[#a855f7]" : ""}
              `}
            >
              {/* ... rest of the card content (POPULAR tag, name, price, description, features, button) ... */}
               {plan.isFeatured && (
                 <div className="absolute top-0 right-0 bg-[#a855f7] text-white text-xs font-semibold py-1 px-3 rounded-tl-lg rounded-br-lg z-10">
                   POPULAR
                 </div>
               )}
               <h3 className="text-xl font-bold text-[#111827] mb-2">{plan.name}</h3>
               <p className={`text-3xl font-bold mb-4 ${selectedPlan === plan.name || plan.isFeatured ? "text-[#a855f7]" : "text-[#111827]"}`}> {/* Also make price color conditional on selected */}
                   {plan.price}
                   <span className="text-base text-[#4b5563] ml-1 font-normal">/mo</span>
               </p>
               <p className="text-sm text-[#6b7280] mb-4 flex-grow">{plan.description}</p>
               <ul className="list-disc list-inside text-[#4b5563] mb-6 space-y-2">
                   {plan.features.map((feature, index) => (
                       <li key={index}>{feature}</li>
                   ))}
               </ul>
               <Button
                   className={`w-full mt-auto ${
                       plan.isFeatured // Use isFeatured for default button style
                           ? "bg-[#a855f7] hover:bg-[#9333ea] text-white"
                           : "bg-white text-[#a855f7] border border-[#a855f7] hover:bg-[#f5f0ff]"
                   } px-4 py-2 rounded-md font-semibold`}
                   asChild
               >
                   <a href={plan.ctaUrl || safeTool.link} target="_blank" rel="noopener noreferrer" className={`block text-center ${plan.isFeatured ? "text-white" : "text-[#a855f7]"}`}> {/* Ensure text color */}
                       {plan.ctaText || "Choose Plan"} {/* Use ctaText or default */}
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
                                {/* This save button should also trigger login modal if not authenticated */}
                                <button className="p-1 border border-[#e5e7eb] rounded" onClick={handleSaveToggle}>
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
                                  View Tool <ExternalLink className="w-3 h-3 ml-1" /> {/* Changed text */}
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
                  {/* Save Button - Now calls handleSaveToggle which checks isAuthenticated */}
                  <button
                      className={`p-2 border border-[#e5e7eb] rounded-lg ${
                          safeTool?.savedByUser ? "text-purple-600" : "text-gray-600"
                      }`}
                      onClick={handleSaveToggle} // This handler now includes the auth check
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