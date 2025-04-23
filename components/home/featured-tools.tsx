"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Share2, Bookmark } from "lucide-react"
// Assuming these hooks handle fetching and mutations client-side
import { useFeaturedTools, useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
// Assuming this context provides authentication status client-side
import { useAuth } from "@/contexts/auth-context"
// Removed useState and useEffect for isClient state as they are not needed here

// Define a type for the expected tool structure, ensuring 'features' is an array
type Tool = {
  id: string;
  name: string;
  category: string;
  pricing: string;
  description: string;
  features: string[] | null | undefined; // Allow null/undefined from API temporarily
  isFeatured: boolean;
  savedByUser: boolean;
  // Add any other properties your Tool type might have
}


export default function FeaturedTools() {
  // These hooks are called client-side in a "use client" component
  const { data, isLoading, isError } = useFeaturedTools(4); // Fetch up to 4 featured tools
  const { isAuthenticated } = useAuth();
  const saveTool = useSaveTool();
  const unsaveTool = useUnsaveTool();

  // We no longer need the isClient state or its useEffect

  const handleSaveToggle = (toolId: string, savedByUser: boolean) => {
    // Only allow saving/unsaving if the user is authenticated
    if (!isAuthenticated) {
      // Optionally provide feedback to the user that they need to log in
      console.log("User not authenticated. Cannot save tool.");
      return;
    }

    if (savedByUser) {
      // Optimistically update UI if desired, then call mutation
      unsaveTool.mutate(toolId);
    } else {
      // Optimistically update UI if desired, then call mutation
      saveTool.mutate(toolId);
    }
  };

  const getBadgeClass = (label: string) => {
    switch (label) {
      case "premium":
      case "subscription":
      case "one-time":
      case "usage-based":
        return "bg-yellow-100 text-yellow-600";
      case "free":
      case "freemium":
        return "bg-green-100 text-green-600";
      case "featured":
        return "bg-purple-600 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Helper function to format pricing option label
  const formatPricingLabel = (pricing: string): string => {
    switch (pricing) {
      case "free":
        return "Free";
      case "freemium":
        return "Freemium";
      case "subscription":
        return "Subscription";
      case "one-time":
        return "One-time";
      case "usage-based":
        return "Usage-based";
      default:
        // Use optional chaining defensively in case pricing is null/undefined
        return pricing?.charAt(0).toUpperCase() + pricing?.slice(1) || "Unknown";
    }
  };

  // Fallback data for initial render or when API fails
  // It's good practice for fallback data to match the expected structure
  const fallbackTools: Tool[] = [
    {
      id: "ai-image-creator",
      name: "AI Image Creator",
      category: "Image Generation",
      pricing: "premium",
      description: "Generate stunning images from text descriptions using advanced AI models.",
      features: ["Marketing", "Design", "Content"],
      isFeatured: true,
      savedByUser: false,
    },
    {
      id: "ai-writing-assistant",
      name: "AI Writing Assistant",
      category: "Text Generation",
      pricing: "premium",
      description: "Create high-quality content with AI-powered writing assistance.",
      features: ["Marketing", "Content", "Blogging"],
      isFeatured: true,
      savedByUser: false,
    },
    {
      id: "code-assist-ai",
      name: "CodeAssist AI",
      category: "Development",
      pricing: "free",
      description: "AI-powered code completion and generator tool that helps developers write better code.",
      features: ["Coding", "Web Dev", "Debugging"],
      isFeatured: true,
      savedByUser: false,
    },
    {
      id: "video-creator-ai",
      name: "Video Creator AI",
      category: "Video Generation",
      pricing: "premium",
      description: "Create professional videos from text prompts with AI-powered video generation.",
      features: ["Marketing", "Social Media", "Content"],
      isFeatured: true,
      savedByUser: false,
    },
  ];

  // Use API data (data?.tools) if available and is an array, otherwise use fallback
  // Added Array.isArray check for extra safety
  const toolsToRender = Array.isArray(data?.tools) ? data.tools : fallbackTools;

  return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured AI Tools</h2>
            <Link href="/browse" className="flex items-center text-sm text-purple-600 hover:underline">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Show loading only when data is being fetched */}
          {isLoading && (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
              </div>
          )}

          {/* Show error only when there's an error and not loading */}
          {!isLoading && isError && (
              <div className="mx-auto max-w-md rounded-lg bg-red-50 p-4 text-center">
                <p className="text-red-600">Failed to load featured tools.</p>
                {/* Retry button can trigger refetch if your hook supports it,
                or just reload the page as a simple fallback */}
                <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white hover:bg-red-700">
                  Retry
                </Button>
              </div>
          )}

          {/* Render tools only when not loading and no error */}
          {!isLoading && !isError && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Use toolsToRender which is guaranteed to be an array */}
                {toolsToRender.map((tool) => (
                    <Card
                        key={tool.id}
                        className="max-w-sm overflow-hidden rounded-2xl border border-gray-200 shadow-lg w-full mx-auto"
                    >
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                          {tool.category}
                        </span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}>
                          {formatPricingLabel(tool.pricing)}
                        </span>
                            </div>
                            {tool.isFeatured && (
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}>
                          Featured
                        </span>
                            )}
                          </div>

                          <h3 className="mb-1 text-lg font-semibold text-gray-900">{tool.name}</h3>
                          <p className="mb-4 text-sm text-gray-600">{tool.description}</p>

                          <div className="mb-4 flex flex-wrap gap-2">
                            {/* Corrected line: Use (tool.features || []) to handle null/undefined features */}
                            {(tool.features || []).slice(0, 3).map((feature, index) => (
                                <span key={index} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {feature}
                        </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                  className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                                  onClick={() => handleSaveToggle(tool.id, !!tool.savedByUser)}
                                  // Button is enabled by default, handleSaveToggle checks isAuthenticated
                                  // disabled={!isClient} // Removed this line
                              >
                                <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                              </button>
                              <button
                                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                  // Button is enabled by default
                                  // disabled={!isClient} // Removed this line
                              >
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                            <Button className="bg-purple-600 text-white hover:bg-purple-700" asChild>
                              <Link href={`/tools/${tool.id}`}>Try Tool</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
          )}
        </div>
      </section>
  );
}