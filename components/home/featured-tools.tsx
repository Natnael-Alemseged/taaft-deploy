import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Share2, Bookmark } from "lucide-react"

export default function FeaturedTools() {
  const featuredTools = [
    {
      id: "ai-image-creator",
      name: "AI Image Creator",
      category: "Image Generation",
      pricing: "Premium",
      description: "Generate stunning images from text descriptions using advanced AI models.",
      tags: ["Marketing", "Design", "Content"],
    },
    {
      id: "ai-writing-assistant",
      name: "AI Writing Assistant",
      category: "Text Generation",
      pricing: "Premium",
      description: "Create high-quality content with AI-powered writing assistance.",
      tags: ["Marketing", "Content", "Blogging"],
    },
    {
      id: "code-assist-ai",
      name: "CodeAssist AI",
      category: "Development",
      pricing: "Free",
      featured: true,
      description: "AI-powered code completion and generator tool that helps developers write better code.",
      tags: ["Coding", "Web Dev", "Debugging"],
    },
    {
      id: "video-creator-ai",
      name: "Video Creator AI",
      category: "Video Generation",
      pricing: "Premium",
      featured: true,
      description: "Create professional videos from text prompts with AI-powered video generation.",
      tags: ["Marketing", "Social Media", "Content"],
    },
  ]

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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured AI Tools</h2>
          <Link href="/browse" className="flex items-center text-sm text-purple-600 hover:underline">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
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
                      {tool.pricing && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}>
                          {tool.pricing}
                        </span>
                      )}
                    </div>
                    {tool.featured && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("Featured")}`}>
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="mb-1 text-lg font-semibold text-gray-900">{tool.name}</h3>
                  <p className="mb-4 text-sm text-gray-600">{tool.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
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
      </div>
    </section>
  )
}
