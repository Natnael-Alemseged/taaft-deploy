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
import { showLoginModal } from "@/lib/auth-events"
import { useQueryClient } from "@tanstack/react-query" // Assuming React Query is used

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
  const queryClient = useQueryClient()

  const handleToolClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showLoginModal(pathname, () => {
        router.push('/')
      })
    }
  }

  const handleSaveToggle = (toolId: string, savedByUser: boolean) => {
    if (!isAuthenticated) {
      showLoginModal(pathname, () => {
        router.push('/')
      })
      return
    }

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

  // Determine pricing badge text
  // const pricingText = tool.pricing ? tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1) : "Unknown"



  return (
    <>
      <Card
        key={tool.id}
        className="max-w-lg overflow-hidden rounded-2xl border border-gray-200 shadow-lg w-full mx-auto"
      >
        <CardContent className="p-0">
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
  

              </div>
              {tool.isFeatured && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}>
                  Featured
                </span>
              )}
            </div>
            <span className="flex items-center py-3">
              {tool.image?? robotSvg}
              <h3 className="mb-1 text-lg font-semibold text-gray-900 pl-2"> 
                {tool.name.length > 30 ? `${tool.name.slice(0, 20)}...` : tool.name}
                </h3>
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
  {tool.categories && tool.categories.length !== 0
    ? (() => {
        const categoryText = tool.categories[0].name;
        return categoryText.length > 15 ? `${categoryText.slice(0, 15)}...` : categoryText;
      })()
    : null}
</span>
            <p className="mb-4 text-sm text-gray-600 pt-3">
              {tool.description && tool.description.length > 50 // Adjust 120 to your desired length
                ? `${tool.description.substring(0, 50)}...`
                : tool.description}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {(tool.keywords || []).slice(0, 3).map((feature, index) => {
             

                return (
                  <span
    key={index}
    className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-600 cursor-help"
    title={feature} // <-- Added this line
>
                    { feature.length > 15 ? `${feature.slice(0, 10)}...` : feature
                    // feature
                    }
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
                className="  bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => {
                  if (!isAuthenticated) {
                    // Use the shared showLoginModal function
                    showLoginModal(pathname, () => {
                      router.push('/')
                    })
                  } else {
                    // Navigate to tool detail page if authenticated
                    window.location.href = `/tools/${tool.id}`
                  }
                }}
              >
                Try Tool <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
