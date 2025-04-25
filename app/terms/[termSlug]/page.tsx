"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { ChevronRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getGlossaryTerm } from "@/services/glossary-service"

// Helper function to convert a term title into a URL-friendly slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

// Type definition based on the API response
interface GlossaryTerm {
  id: string
  name: string
  definition: string
  related_terms: string[]
  tool_references: any[]
  categories: string[]
  created_at: string
  updated_at: string
  first_letter: string
}

export default function TermPage() {
  const params = useParams()
  const router = useRouter()
  const termSlug = params.termSlug as string

  const [termData, setTermData] = useState<GlossaryTerm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        setIsLoading(true)
        const data = await getGlossaryTerm(termSlug)
        setTermData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching term:", err)
        setError("Failed to load the term. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTerm()
  }, [termSlug])

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading term information...</p>
        </div>
        <Footer />
      </>
    )
  }

  // Error state
  if (error || !termData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">Term Not Found</h1>
          <p className="text-sm md:text-base text-[#6b7280] max-w-md mx-auto">
            {error || "The AI term you are looking for does not exist in our glossary."}
          </p>
          <Link href="/glossary" passHref>
            <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2">
              Back to Glossary
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  // Format the date for display
  const formattedDate = new Date(termData.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  // Estimate read time (1 minute per 200 words)
  const wordCount = termData.definition.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  // Extract name and abbreviation from the term name if it's in the format "Term Name (Abbr)"
  let termTitle = termData.name
  let abbreviation: string | null = null
  const nameMatch = termData.name.match(/^(.*?)\s*$$(.*?)$$$/)
  if (nameMatch) {
    termTitle = nameMatch[1]
    abbreviation = nameMatch[2]
  }

  // Split the definition into paragraphs if it contains line breaks
  const definitionParagraphs = termData.definition.includes("\n")
    ? termData.definition.split("\n").filter((p) => p.trim())
    : [termData.definition]

  // For blog posts, use static placeholders since they're not from the API
  const relatedBlogPosts = [
    {
      title: `Understanding ${termData.name}: A Beginner's Guide`,
      link: `/blog/understanding-${slugify(termData.name)}`,
      date: new Date().toISOString().split("T")[0],
      description: `Explore the fundamentals of ${termData.name.toLowerCase()} and its impact on various industries.`,
    },
    {
      title: `The Future of ${termData.name}: Trends and Predictions`,
      link: `/blog/future-of-${slugify(termData.name)}`,
      date: new Date().toISOString().split("T")[0],
      description: `What's next for ${termData.name.toLowerCase()}? Discover the emerging trends shaping the future.`,
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to Glossary Link */}
          <div className="mb-6">
            <Link href="/glossary" className="text-sm text-[#a855f7] hover:underline flex items-center">
              <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Glossary
            </Link>
          </div>

          {/* Term Title and Metadata */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">
              {termTitle} {abbreviation && <span className="text-gray-500 ml-2">({abbreviation})</span>}
            </h1>

            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Updated {formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
          </div>

          {/* Definition Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Definition</h2>
            <div className="text-gray-700 space-y-4">
              {definitionParagraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Related Terms Section */}
          {termData.related_terms && termData.related_terms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {termData.related_terms.map((term, index) => {
                  const termSlugLink = `/terms/${slugify(term)}`

                  return (
                    <Link
                      key={index}
                      href={termSlugLink}
                      className="rounded-full px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                    >
                      {term}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Categories Section */}
          {termData.categories && termData.categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {termData.categories.map((category, index) => (
                  <span key={index} className="rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-700">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Blog Posts Section - Using static placeholders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">
              Related Blog Posts
            </h2>
            <div className="space-y-4">
              {relatedBlogPosts.map((post, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                >
                  <Link href={post.link} className="block">
                    <h3 className="text-lg font-semibold text-[#a855f7] hover:underline mb-1">{post.title}</h3>
                    {post.description && <p className="text-sm text-gray-600 mb-2">{post.description}</p>}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
