"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, Grid, List, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "@/components/ui/footer";

interface Tool {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  pricing?: string
  featured?: boolean
}

interface SearchResultsProps {
  query: string
  category: string
}

export default function SearchResults({ query, category }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPricing, setSelectedPricing] = useState<string[]>([])

  // Sample tools data
  const tools: Tool[] = [
    {
      id: "1",
      name: "AI Image Creator",
      category: "Image Generation",
      pricing: "Premium",
      description: "Generate stunning images from text descriptions using advanced AI models.",
      tags: ["Marketing", "Design", "Content"],
    },
    {
      id: "2",
      name: "AI Image Creator",
      category: "Image Generation",
      pricing: "Premium",
      description: "Generate stunning images from text descriptions using advanced AI models.",
      tags: ["Marketing", "Design", "Content"],
    },
    {
      id: "3",
      name: "AI Image Creator",
      category: "Image Generation",
      pricing: "Premium",
      description: "Generate stunning images from text descriptions using advanced AI models.",
      tags: ["Marketing", "Design", "Content"],
    },
    {
      id: "4",
      name: "CodeAssist AI",
      category: "Development",
      pricing: "Free",
      featured: true,
      description: "AI-powered code completion and generator tool that helps developers write better code.",
      tags: ["Coding", "Web Dev", "Debugging"],
    },
  ]

  const categories = [
    "Image Generation",
    "Chatbots",
    "Writing",
    "Video Creation",
    "Code Generation",
    "Voice",
    "Research",
  ]

  const pricing = ["Free", "Premium", "Paid", "Enterprise"]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const togglePricing = (price: string) => {
    setSelectedPricing((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]))
  }

  const title = query
    ? `Search results for "${query}"`
    : category
      ? `Recommended AI Tools for ${category}`
      : "Recommended AI Tools"

  const getBadgeClass = (label: string) => {
    switch (label) {
      case "Premium":
        return "bg-yellow-100 text-yellow-600"
      case "Free":
        return "bg-green-100 text-green-600"
      case "Featured":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header is already included in the layout */}

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Search</span>
          </div>
        </div>

        {/* AI Assistant message */}
        <div className="mb-8 rounded-lg border border-purple-100 bg-purple-50 p-4">
          <div className="flex items-start">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <span className="text-sm font-medium text-purple-600">AI</span>
            </div>
            <div>
              <div className="font-medium">AI Assistant</div>
              <p className="text-sm text-gray-700">
                Great! For {category || "e-commerce"} businesses, AI can bring significant advantages. Here are the top
                AI tools I'd recommend for your industry:
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar filters */}
          <div className="mb-6 w-full lg:mb-0 lg:w-64 lg:pr-8">
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 font-medium">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className="ml-2 text-sm">{cat}</span>
                  </label>
                ))}
              </div>

              <h3 className="mb-4 mt-6 font-medium">Pricing</h3>
              <div className="space-y-2">
                {pricing.map((price) => (
                  <label key={price} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedPricing.includes(price)}
                      onChange={() => togglePricing(price)}
                    />
                    <span className="ml-2 text-sm">{price}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded p-1 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400"}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded p-1 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400"}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* List View (Grid Layout) */}
            {viewMode === "list" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-4">
                      <h3 className="mb-1 text-lg font-semibold">{tool.name}</h3>
                      <div className="mb-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                          {tool.category}
                        </span>
                        {tool.pricing && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}
                          >
                            {tool.pricing}
                          </span>
                        )}
                        {tool.featured && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("Featured")}`}>
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-gray-600">{tool.description}</p>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {tool.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                        <Button className="rounded-full bg-purple-600 hover:bg-purple-700">
                          Try Tool
                          <svg
                            className="ml-1 h-4 w-4"
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
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Grid View (Vertical List) */}
            {viewMode === "grid" && (
              <div className="space-y-4">
                {tools.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="mb-1 text-lg font-semibold">{tool.name}</h3>
                          <div className="mb-2 flex flex-wrap gap-1">
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                              {tool.category}
                            </span>
                            {tool.pricing && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(
                                  tool.pricing,
                                )}`}
                              >
                                {tool.pricing}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-sm text-gray-600">{tool.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {tool.tags.map((tag) => (
                              <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center md:mt-0">
                          <div className="flex items-center space-x-2 mr-4">
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                          <Button className="rounded-full bg-purple-600 hover:bg-purple-700">
                            Try Tool
                            <svg
                              className="ml-1 h-4 w-4"
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
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Button variant="outline" className="rounded-full border-gray-200 px-6 py-2 text-gray-600">
                Load More Results
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
