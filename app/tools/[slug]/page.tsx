"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Bookmark, Share2, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTool } from "@/hooks/use-tools"
import { useSaveTool, useUnsaveTool } from "@/hooks/use-tools"
import { useAuth } from "@/contexts/auth-context"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { useRouter } from "next/navigation"

export default function ToolDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()
  const { data: tool, isLoading, isError } = useTool(slug)
  const { isAuthenticated } = useAuth()
  const saveTool = useSaveTool()
  const unsaveTool = useUnsaveTool()

  useEffect(() => {
    if (isError) {
      // Redirect to 404 or handle error state
      router.push("/404")
    }
  }, [isError, router])

  const handleSaveToggle = () => {
    if (!isAuthenticated || !tool) {
      // Handle unauthenticated state
      return
    }

    if (tool.savedByUser) {
      unsaveTool.mutate(tool.id)
    } else {
      saveTool.mutate(tool.id)
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

  // Helper function to format pricing option label
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!tool) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
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
          <span className="text-[#6b7280]">{tool.name}</span>
        </div>

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">{tool.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-[#f5f0ff] text-[#a855f7] px-3 py-1 rounded-full">{tool.category}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${getBadgeClass(tool.pricing)}`}>
                {formatPricingLabel(tool.pricing)}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2 rounded-full flex items-center">
              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                Try This Tool <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Description and Features */}
          <div className="md:col-span-2">
            <p className="text-[#4b5563] mb-8">{tool.description}</p>

            {/* Key Features */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tool.features.map((feature, index) => (
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

            {/* Screenshot */}
            {tool.screenshotUrls && tool.screenshotUrls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-[#111827] mb-6">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.screenshotUrls.map((screenshot, index) => (
                    <div key={index} className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                      <img
                        src={screenshot || "/placeholder.svg"}
                        alt={`${tool.name} screenshot ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tools */}
            {tool.relatedTools && tool.relatedTools.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-6">Similar Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tool.relatedTools.map((similarTool) => (
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
              {tool.logoUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={tool.logoUrl || "/placeholder.svg"}
                    alt={`${tool.name} logo`}
                    className="h-16 w-16 object-contain"
                  />
                </div>
              )}

              <h3 className="font-semibold text-[#111827] mb-4">Use Cases</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.features.slice(0, 5).map((feature, index) => (
                  <span key={index} className="text-sm bg-[#f3f4f6] text-[#6b7280] px-3 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="border-t border-[#e5e7eb] pt-4 mb-6">
                <h3 className="font-semibold text-[#111827] mb-2">Website</h3>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#a855f7] hover:underline"
                >
                  {tool.website}
                </a>
              </div>

              <div className="border-t border-[#e5e7eb] pt-4">
                <h3 className="font-semibold text-[#111827] mb-2">Last Updated</h3>
                <p className="text-sm text-[#6b7280]">{new Date(tool.updatedAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  className={`p-2 border border-[#e5e7eb] rounded-lg ${tool.savedByUser ? "text-purple-600" : "text-gray-600"}`}
                  onClick={handleSaveToggle}
                >
                  <Bookmark className="w-5 h-5" fill={tool.savedByUser ? "currentColor" : "none"} />
                </button>
                <button className="p-2 border border-[#e5e7eb] rounded-lg">
                  <Share2 className="w-5 h-5 text-[#6b7280]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
