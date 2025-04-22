import Link from "next/link"
import { Code, ImageIcon, MessageSquare, FileText, Video, Music, Database, BarChart4 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BrowseCategories() {
  const categories = [
    {
      id: 1,
      name: "Code & Development",
      icon: <Code className="h-6 w-6 text-purple-500" />,
      count: 124,
    },
    {
      id: 2,
      name: "Image Generation",
      icon: <ImageIcon className="h-6 w-6 text-purple-500" />,
      count: 87,
    },
    {
      id: 3,
      name: "Chatbots & Assistants",
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      count: 93,
    },
    {
      id: 4,
      name: "Text & Writing",
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      count: 136,
    },
    {
      id: 5,
      name: "Video Creation",
      icon: <Video className="h-6 w-6 text-purple-500" />,
      count: 62,
    },
    {
      id: 6,
      name: "Audio & Music",
      icon: <Music className="h-6 w-6 text-purple-500" />,
      count: 48,
    },
    {
      id: 7,
      name: "Data & Analytics",
      icon: <Database className="h-6 w-6 text-purple-500" />,
      count: 73,
    },
    {
      id: 8,
      name: "Business & Marketing",
      icon: <BarChart4 className="h-6 w-6 text-purple-500" />,
      count: 91,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">Browse by Category</h2>
        <p className="mb-10 text-center text-gray-600">
          Find the perfect AI tool for your needs from our carefully organized categories
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories`}>
              <Card className="h-full border border-gray-200 transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    {category.icon}
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900">{category.name}</h3>
                  <div className="relative mt-2 w-full text-sm text-gray-500">
                    <span className="block text-center">{category.count} tools</span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-600">
                      <ChevronIcon />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110" asChild>
            <Link href="/categories">
              View All Categories <ChevronIcon />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function ChevronIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
