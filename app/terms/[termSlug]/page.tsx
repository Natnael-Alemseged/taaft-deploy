"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { ChevronRight, ExternalLink, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getGlossaryTermBySlug, type ExtendedGlossaryTerm, getGlossaryTerm } from "@/services/glossary-service"

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

export default function TermPage() {
  const params = useParams()
  const router = useRouter()
  const termSlug = params.name as string

  const [termData, setTermData] = useState<ExtendedGlossaryTerm | null>(null)
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
              {termData.title}{" "}
              {termData.abbreviation && <span className="text-gray-500 ml-2">({termData.abbreviation})</span>}
            </h1>
            {termData.pronunciation && <p className="text-sm text-gray-500 mb-2">{termData.pronunciation}</p>}

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
              {termData.definition_paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Examples Section */}
          {termData.examples && termData.examples.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Examples</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {termData.examples.map((example, index) => (
                  <li key={index} className="text-base">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Terms Section */}
          {termData.relatedTerms && termData.relatedTerms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {termData.relatedTerms.map((term, index) => {
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

          {/* Related AI Tools Section */}
          {termData.relatedTools && termData.relatedTools.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">
                Related AI Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {termData.relatedTools.map((tool, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-[#111827]">{tool.name}</h3>
                      {tool.isFree !== undefined && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${tool.isFree ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {tool.isFree ? "Free" : "Premium"}
                        </span>
                      )}
                    </div>
                    {tool.category && (
                      <div className="mb-2">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                          {tool.category}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-700 mb-3">{tool.description}</p>
                    <Link
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#a855f7] flex items-center hover:underline"
                    >
                      Try Tool <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Blog Posts Section */}
          {termData.relatedBlogPosts && termData.relatedBlogPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">
                Related Blog Posts
              </h2>
              <div className="space-y-4">
                {termData.relatedBlogPosts.map((post, index) => (
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
          )}

          {/* Sources Section */}
          {termData.sources && termData.sources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Sources</h2>
              <ul className="space-y-2">
                {termData.sources.map((source, index) => (
                  <li key={index}>
                    <Link
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#a855f7] hover:underline flex items-center"
                    >
                      {source.name} <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
