"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2 } from "lucide-react"
import Link from "next/link"

interface ChatResultCardProps {
  result: any
  index: number
  viewMode?: "grid" | "list"
}

export default function ChatResultCard({ result, index, viewMode = "grid" }: ChatResultCardProps) {
  // Extract data from the result with fallbacks
  const name = result.name || result.title || `Tool ${index + 1}`
  const description = result.description || result.summary || "No description available."
  const category = result.category || result.type || "AI Tool"
  const pricing = result.pricing || result.price || "Unknown"
  const features = result.features || result.tags || result.keywords || []
  const website = result.website || result.url || result.link || "#"

  // Function to get badge class based on pricing
  const getBadgeClass = (label: string) => {
    const lowerLabel = label.toLowerCase()
    switch (lowerLabel) {
      case "premium":
      case "subscription":
      case "one-time":
      case "usage-based":
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

  // Format pricing label
  const formatPricingLabel = (pricing: string): string => {
    return pricing.charAt(0).toUpperCase() + pricing.slice(1).replace("-", " ")
  }

  // Truncate description
  const truncateDescription = (description: string, limit = 150) => {
    if (description.length <= limit) return description
    return `${description.substring(0, limit)}...`
  }

  // Function to get the tool detail URL
  const getToolDetailUrl = () => {
    // Use the name for the URL to trigger the unique name endpoint
    return `/tools/${encodeURIComponent(name)}`
  }

  return (
    <Card className={`overflow-hidden border border-gray-200 flex flex-col ${viewMode === "list" ? "flex-row" : ""}`}>
      <CardContent className={`p-4 flex-grow ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-800">
            <Link href={getToolDetailUrl()} className="hover:text-purple-600 transition-colors">
              {name}
            </Link>
          </h3>
          <div className="mb-2 flex flex-wrap gap-1">
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
              {category}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(pricing)}`}>
              {formatPricingLabel(pricing)}
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
            <Button className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5" asChild>
              <Link href={getToolDetailUrl()}>View Details</Link>
            </Button>
            {website && website !== "#" && (
              <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5" asChild>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  Try Tool
                  <svg
                    className="ml-1 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
