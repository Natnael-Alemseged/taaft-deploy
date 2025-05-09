"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2 } from "lucide-react"
import apiClient from "@/lib/api-client"

interface ChatResultCardProps {
  tool: any
  index: number
  viewMode?: "grid" | "list"
}

export default function ChatResultCard({ tool, index, viewMode = "grid" }: ChatResultCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const name = tool.name || tool.title || `Tool ${index + 1}`
  const description = tool.description || tool.summary || "No description available."
  const category = tool.category || tool.type || "AI Tool"
  const pricing = tool.pricing || tool.price || "Unknown"
  const features = tool.features || tool.tags || tool.keywords || []
  const website = tool.website || tool.url || tool.link || "#"

  // Fetch Tool Detail URL
  const handleNavigateToTool = async () => {
    setIsLoading(true)

    try {
      // const response = await apiClient.get<{ id: string }>(`/tools/unique/${tool.unique_id}`)

      // if (response?.id) {
        // const toolUrl = `/tools/${encodeURIComponent(response.id)}`
        console.log("Tool ID:", tool.unique_id);

        router.push(`tools/${tool.unique_id}`);
      // } else {
      //   console.warn("Tool ID not found")
      // }
    } catch (error) {
      console.error("Error fetching tool URL:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getBadgeClass = (label: string) => {
    const lowerLabel = label.toLowerCase()
    switch (lowerLabel) {
      case "premium":
      case "subscription":
      case "paid":
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

  const truncateDescription = (desc: string, limit = 150) =>
    desc.length > limit ? `${desc.substring(0, limit)}...` : desc

  return (
    <Card className={`overflow-hidden border border-gray-200 flex flex-col ${viewMode === "list" ? "flex-row" : ""}`}>
      <CardContent className={`p-4 flex-grow ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-800">{name}</h3>

          <div className="mb-2 flex flex-wrap gap-1">
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
              {category}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(pricing)}`}>
              {pricing}
            </span>
          </div>

          <p className="mb-3 text-sm text-gray-600">{truncateDescription(description)}</p>

          <div className="mb-4 flex flex-wrap gap-1">
            {Array.isArray(features) &&
              features.slice(0, 3).map((tag: string, idx: number) => (
                <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-0 border-t border-gray-100 flex items-center justify-between pt-4">
          <div className="flex items-center space-x-1">
            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" aria-label="Save tool">
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label={`Share ${name}`}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex space-x-2">
            <Button
              className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5"
              onClick={handleNavigateToTool}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View Details"}
            </Button>

            {website && website !== "#" && (
              <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5">
                <a href={website} target="_blank" rel="noopener noreferrer">
                  Try Tool
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
