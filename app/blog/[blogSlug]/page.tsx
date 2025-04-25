"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { ChevronRight, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Helper function to convert a title into a URL-friendly slug (same as before)
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

// Type definition for a Blog Post (using placeholder data structure)
interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  content: string // This will likely be rich text in a real scenario
  tags: string[]
}

// Placeholder blog post data (replace with your actual static blog content)
const placeholderBlogPost: BlogPost = {
  id: "123",
  title: "Understanding AI: A Beginner's Guide",
  author: "Sarah Johnson",
  date: "2025-04-26",
  content: `
    Artificial intelligence has become an integral part of our daily lives, from virtual assistants to recommendation systems. This guide aims to demystify AI and help you understand its fundamental concepts.

    ## What is Artificial Intelligence?

    AI refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation.

    AI systems can be either narrow (designed for specific tasks) or general (capable of performing any intellectual task).

    ## Key Components of AI Systems

    Modern AI systems rely on several key components: data collection, machine learning algorithms, processing power, and feedback mechanisms. Each component plays a crucial role in creating intelligent behavior.

    - **Data Collection and Processing:** Gathering and preparing data for AI models.
    - **Algorithm Development:** Creating the instructions that enable AI to learn and make decisions.
    - **Training and Testing:** Feeding data to the algorithms to learn and evaluating their performance.
    - **Deployment and Monitoring:** Implementing the trained AI system and continuously checking its effectiveness.

    ## Conclusion

    As AI continues to evolve, understanding its basic principles becomes increasingly important for everyone, from developers to end-users.
  `,
  tags: ["AI Fundamentals", "Beginner's Guide", "Introduction"],
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const blogSlug = params.blogSlug as string // Assuming your route is /blog/[blogSlug]

  // For static data, we can directly use the placeholder.
  // In a real scenario, you'd fetch data based on the slug.
  const [blogPost, setBlogPost] = useState<BlogPost | null>(placeholderBlogPost)
  const [isLoading, setIsLoading] = useState(false) // Not really loading static data
  const [error, setError] = useState<string | null>(null)

  // In a real implementation, you would likely have a useEffect here to fetch
  // the blog post data based on the `blogSlug` when the API is ready.
  // For now, we are using the placeholder.
  // useEffect(() => {
  //   const fetchBlogPost = async () => {
  //     setIsLoading(true);
  //     try {
  //       // const data = await getBlogPost(blogSlug); // Replace with your actual API call
  //       setBlogPost(placeholderBlogPost); // Using placeholder for now
  //       setError(null);
  //     } catch (err) {
  //       console.error("Error fetching blog post:", err);
  //       setError("Failed to load the blog post. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   fetchBlogPost();
  // }, [blogSlug]);

  // Loading state (mostly for future API integration)
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
        <Footer />
      </>
    )
  }

  // Error state (mostly for future API integration)
  if (error || !blogPost) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">Blog Post Not Found</h1>
          <p className="text-sm md:text-base text-[#6b7280] max-w-md mx-auto">
            {error || "The blog post you are looking for does not exist."}
          </p>
          <Link href="/blog" passHref>
            <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2">Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  // Format the date for display
  const formattedDate = new Date(blogPost.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Estimate read time (1 minute per 200 words)
  const wordCount = blogPost.content.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  // Split the content into sections based on markdown headings for better rendering
  const contentSections = blogPost.content.split(/##\s+/).filter((section) => section.trim() !== "")
  const firstParagraph = blogPost.content.split("\n\n")[0] // Basic extraction of the first paragraph

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Back to Blog Link */}
          <div className="mb-6">
            <Link href="/blog" className="text-sm text-[#a855f7] hover:underline flex items-center">
              <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Blog
            </Link>
          </div>

          {/* Blog Post Title and Metadata */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">{blogPost.title}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {blogPost.tags.map((tag, index) => (
                  <span key={index} className="rounded-full px-3 py-1 text-xs bg-purple-100 text-purple-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blog Post Content */}
          <div className="prose prose-sm md:prose-base lg:prose-lg xl:prose-xl max-w-none text-gray-700">
            {/* Render the first paragraph separately */}
            {firstParagraph && <p className="leading-relaxed">{firstParagraph}</p>}
            {/* Render subsequent sections based on markdown headings */}
            {contentSections.map((section, index) => {
              const [heading, ...rest] = section.split("\n")
              const content = rest.filter((line) => line.trim() !== "").join("\n\n")
              return (
                <div key={index} className="mt-6">
                  <h2 className="text-2xl font-semibold text-[#111827] mb-2">{heading.trim()}</h2>
                  <p className="leading-relaxed">{content}</p>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </>
  )
}
