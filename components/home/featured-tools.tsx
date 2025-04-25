"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Share2, Bookmark } from "lucide-react"
import { useFeaturedTools, useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { useAuth } from "@/contexts/auth-context"
import { showLoginModal } from "@/lib/auth-events"

type Tool = {
  id: string
  name: string
  category: string
  pricing: string
  description: string
  features: string[] | null | undefined
  isFeatured: boolean
  savedByUser: boolean
}

export default function FeaturedTools() {
  const { data, isLoading, isError } = useFeaturedTools(4)
  const { isAuthenticated } = useAuth()
  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  const handleSaveToggle = (toolId: string, savedByUser: boolean) => {
    if (!isAuthenticated) {
      console.log("User not authenticated. Cannot save tool.")
      return
    }

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
        return pricing?.charAt(0).toUpperCase() + pricing?.slice(1) || "Unknown"
    }
  }

  // If there's an error or no tools available, don't render the section at all
  const hasTools = Array.isArray(data?.tools) && data?.tools.length > 0
  if (isError || !hasTools) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured AI Tools</h2>
          <Link href="/browse" className="flex items-center text-sm text-purple-600 hover:underline">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
          </div>
        )}

        {!isLoading && data?.tools && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.tools.map((tool) => (
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
                    {/* Modified line */}
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
                          onClick={() => handleSaveToggle(tool.id, !!tool.savedByUser)}
                        >
                          <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                        </button>
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        className="bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => {
                          if (!isAuthenticated) {
                            // Use the shared showLoginModal function
                            showLoginModal()
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
