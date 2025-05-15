"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {ChevronRight, Loader} from "lucide-react"
import { useFeaturedTools } from "@/hooks/use-tools"
import ToolCard from "../cards/tool-card"

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

  // If there's an error or no tools available, don't render the section at all
  const hasTools = Array.isArray(data?.tools) && data?.tools.length > 0
  if (isError || !hasTools) {
    return null
  }




  return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured AI Tools</h2>
            <Link href="/featured-all" className="flex items-center text-sm text-purple-600 dark:text-purple-400 hover:underline">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <Card
                        key={index}
                        className="max-w-sm overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg w-full mx-auto"
                    >
                      <div className="relative">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                      </div>
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            </div>
                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          </div>

                          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>

                          <div className="mb-4 flex flex-wrap gap-2">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            </div>
                            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {data?.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
          )}
        </div>
      </section>
  )
}