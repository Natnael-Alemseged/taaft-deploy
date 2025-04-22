"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getCategories } from "@/services/category-service"
import type { Category } from "@/types/category"

export default function BrowseCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true); // Set loading true at the start
      setError(null); // Clear any previous error

      try {
        const data = await getCategories();
        // console.log("Data received:", data); // <-- Optional: uncomment to inspect the data

        // Check if the received data is actually an array
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          // If it's not an array, it's an unexpected response
          console.error("API returned unexpected data format:", data);
          setError("Received invalid category data from the server.");
          setCategories(fallbackCategories); // Fallback even if no network error
        }

      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories(fallbackCategories); // Use fallback data on network/request error
      } finally {
        setIsLoading(false); // Always set loading to false when done
      }
    };

    fetchCategories();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Fallback categories in case the API fails
  const fallbackCategories: Category[] = [
    { id: "1", name: "Text Generation", slug: "text-generation", toolCount: 24 },
    { id: "2", name: "Image Generation", slug: "image-generation", toolCount: 18 },
    { id: "3", name: "Video Creation", slug: "video-creation", toolCount: 12 },
    { id: "4", name: "Audio & Voice", slug: "audio-voice", toolCount: 15 },
    { id: "5", name: "Chatbots", slug: "chatbots", toolCount: 20 },
    { id: "6", name: "Data Analysis", slug: "data-analysis", toolCount: 14 },
    { id: "7", name: "Development", slug: "development", toolCount: 22 },
    { id: "8", name: "Productivity", slug: "productivity", toolCount: 17 },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          <Link href="/categories" className="flex items-center text-sm text-purple-600 hover:underline">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.toolCount} tools</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
