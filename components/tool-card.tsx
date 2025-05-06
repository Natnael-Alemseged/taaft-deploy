// components/tool-card.tsx
"use client"

import Link from "next/link"
import { ExternalLink, Bookmark } from "lucide-react" // Import Lucide icons
import { Button } from "@/components/ui/button" // Assuming you use this Button component
import { Card, CardContent } from "@/components/ui/card" // Assuming you use these Card components
import type { Tool } from "@/types/tool" // Import the updated Tool type
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { ShareButtonWithPopover } from "@/components/ShareButtonWithPopover"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { robotSvg } from "@/lib/reusable_assets"
import { SignInModal } from "@/components/home/sign-in-modal"
import { useState } from "react"

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
  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [previousRoute, setPreviousRoute] = useState<string | undefined>()

  const openSignInModal = () => {
    setIsSignUpModalOpen(false)
    setIsSignInModalOpen(true)
  }

  const openSignUpModal = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(true)
  }

  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(false)
    setPreviousRoute(undefined)
  }

  // Link to the individual tool detail page
  const toolLinkHref = `/tools/${tool.id}` // Assuming /tools/[id] route

  // Handle click on the tool link
  const handleToolClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      setPreviousRoute(pathname)
      openSignInModal()
    }
  }

  const handleSaveToggle = (toolId: string, savedByUser: boolean) => {
    if (!isAuthenticated) {
      setPreviousRoute(pathname)
      openSignInModal()
      return
    }

    if (savedByUser) {
      tool.savedByUser = false
      unsaveTool.mutate(toolId)
    } else {
      tool.savedByUser = true
      saveTool.mutate(toolId)
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
    <>
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeAllModals} 
        onSwitchToSignUp={openSignUpModal}
        previousRoute={previousRoute}
      />
      <Card
        key={tool.id}
        className="max-w-sm overflow-hidden rounded-2xl border border-gray-200 shadow-lg w-full mx-auto"
      >
        <CardContent className="p-0">
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                  {(() => { const categoryText = tool.categories.map((category) => category.name).join(", ");
                    return categoryText.length > 20 ? `${categoryText.slice(0, 20)}...` : categoryText;
                  })()}
                </span>
              </div>
              {tool.isFeatured && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}>
                  Featured
                </span>
              )}
            </div>
            <span className="flex items-center">
              {tool.image?? robotSvg}
              <h3 className="mb-1 text-lg font-semibold text-gray-900 pl-2"> 
                {tool.name.length > 20 ? `${tool.name.slice(0, 20)}...` : tool.name}
                </h3>
            </span>
            <p className="mb-4 text-sm text-gray-600">
              {tool.description && tool.description.length > 120 // Adjust 120 to your desired length
                ? `${tool.description.substring(0, 120)}...`
                : tool.description}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {(tool.keywords || []).slice(0, 3).map((feature, index) => {
                // Array of Tailwind CSS background color classes
                const colorClasses = [
                  "bg-blue-100 text-blue-800",
                  "bg-purple-100 text-purple-800",
                  "bg-green-100 text-green-800",
                  "bg-yellow-100 text-yellow-800",
                  "bg-red-100 text-red-800",
                  "bg-indigo-100 text-indigo-800",
                  "bg-pink-100 text-pink-800",
                  "bg-teal-100 text-teal-800",
                ]

                // Select color based on index (cycles through colors)
                const colorClass = colorClasses[index % colorClasses.length]

                return (
                  <span key={index} className={`rounded-md px-2 py-1 text-xs ${colorClass}`}>
                    {feature}
                  </span>
                )
              })}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                
                  <button
                    className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                    onClick={() => handleSaveToggle(tool.unique_id, !!tool.savedByUser)}
                  >
                    <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                  </button>
                
                <ShareButtonWithPopover itemLink={`/tools/${tool.id}`} />
              </div>
              <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => {
                  if (!isAuthenticated) {
                    // Use the shared showLoginModal function
                    openSignInModal()
                  } else {
                    // Navigate to tool detail page if authenticated
                    window.location.href = `/tools/${tool.id}`
                  }
                }}
              >
                Try Tool
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
