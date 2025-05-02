// components/tool-card.tsx
"use client"
import Link from "next/link"
import { ExternalLink, Bookmark, Share2 } from "lucide-react" // Import Lucide icons
import { Button } from "@/components/ui/button" // Assuming you use this Button component
import { Card, CardContent } from "@/components/ui/card" // Assuming you use these Card components
import type { Tool } from "@/types/tool" // Import the updated Tool type
import { showLoginModal } from "@/lib/auth-events"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"

interface ToolCardProps {
  tool: Tool
  // You might add props for handling save/share clicks if needed
  // onSaveToggle?: (toolId: string, savedByUser: boolean) => void;
  // onShare?: (tool: Tool) => void;
  // isSaving?: boolean; // Add if you want to show a saving state
}

// Helper function to get badge class based on pricing or other labels
// Reusing logic from FeaturedTools.tsx
const getBadgeClass = (label: string) => {
  if (!label) return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"

  switch (
    label.toLowerCase() // Use toLowerCase for consistent matching
  ) {
    case "premium":
    case "subscription":
    case "one-time":
    case "usage-based":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500" // Added dark mode
    case "free":
    case "freemium":
      return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500" // Added dark mode
    case "featured": // If you want a featured badge on the card
      return "bg-purple-600 text-white dark:bg-purple-700" // Added dark mode
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" // Added dark mode
  }
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Link to the individual tool detail page
  const toolLinkHref = `/tools/${tool.id}` // Assuming /tools/[id] route

  // Handle click on the tool link
  const handleToolClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showLoginModal(pathname)
    }
  }

  // Determine pricing badge text
  const pricingText = tool.pricing ? tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1) : "Unknown"

  // Use features as tags if tags are not available
  const displayTags =
    tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0
      ? tool.tags
      : tool.features && Array.isArray(tool.features)
        ? tool.features
        : []

  return (
    // Card component acts as the container
    <Card className="border border-[#e5e7eb] dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-lg w-full h-full flex flex-col">
      {" "}
      {/* Added dark mode, flex-col */}
      <CardContent className="p-4 flex flex-col flex-grow">
        {" "}
        {/* Added flex-col flex-grow */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-2">
            {/* Category Badge */}
            {/* You might want a specific color logic for categories */}
            <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] dark:bg-purple-900/20 dark:text-purple-400 rounded-full">
              {" "}
              {/* Added dark mode */}
              {tool.category}
            </span>
            {/* Pricing Badge */}
            {tool.pricing && (
              <span className={`text-xs px-3 py-1 rounded-full flex items-center ${getBadgeClass(tool.pricing)}`}>
                {/* Optional: Add a checkmark or dollar sign icon based on pricing */}
                {tool.pricing === "free" ? (
                  <span className="mr-0.5">✓</span>
                ) : (
                  tool.pricing !== "unknown" && <span className="mr-0.5">$</span>
                )}
                {pricingText}
              </span>
            )}
          </div>
          {/* Featured Badge (Optional - uncomment if your API provides isFeatured here) */}
          {tool.isFeatured && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClass("featured")}`}>Featured</span>
          )}
        </div>
        {/* Tool Name */}
        <h3 className="text-lg font-semibold text-[#111827] dark:text-white mb-2">{tool.name}</h3>{" "}
        {/* Added dark mode */}
        {/* Tool Description */}
        {/*<p className="text-sm text-[#4b5563] dark:text-gray-400 mb-4 flex-grow">*/}
          {" "}
          {/* Added dark mode, flex-grow */}
          {/*{tool.description}    /!* Modified line *!/*/}
          <p className="mb-4 text-sm text-gray-600 text-sm text-[#4b5563] dark:text-gray-400 mb-4 flex-grow">
            {tool.description && tool.description.length > 120 // Adjust 120 to your desired length
              ? `${tool.description.substring(0, 120)}...`
              : tool.description}
          {/*</p>*/}
        </p>
        {/* Tags */}
        {/* Use optional chaining and check if tags is an array */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displayTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 bg-[#f3f4f6] dark:bg-gray-800 text-[#6b7280] dark:text-gray-400 rounded"
              >
                {" "}
                {/* Added dark mode */}
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto">
          {" "}
          {/* Use mt-auto to push to bottom */}
          <div className="flex space-x-2">
            {/* Save/Bookmark Button (reusing Lucide icon) */}
            {/* Implement onClick and savedByUser state if needed */}
            <button className="p-1.5 border border-[#e5e7eb] dark:border-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              {" "}
              {/* Added dark mode */}
              {/* Adjust fill based on savedByUser state if implemented */}
              <Bookmark className="w-4 h-4" fill={tool.savedByUser ? "currentColor" : "none"} />
            </button>
            {/* Share Button (reusing Lucide icon) */}
            {/* Implement onClick if needed */}
            <button className="p-1.5 border border-[#e5e7eb] dark:border-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              {" "}
              {/* Added dark mode */}
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          {/* Try Tool Button - Link to tool detail page */}
          <Button
            className="bg-[#a855f7] hover:bg-[#9333ea] dark:bg-purple-700 dark:hover:bg-purple-800 text-white text-xs h-8 rounded-md flex items-center"
            asChild
          >
            <Link href={toolLinkHref} onClick={handleToolClick}>
              Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
