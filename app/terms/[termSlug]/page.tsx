// app/terms/[termSlug]/page.tsx
"use client"

import Header from "@/components/header"
import Footer from "@/components/ui/footer" // Assuming you have a Footer component
import { ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

// Helper function to convert a term title into a URL-friendly slug
// Ensure this function is defined ONLY ONCE
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

// --- Mock Data ---
// Ensure each key (term slug) is unique in this object literal.
const termsData: { [key: string]: any } = {
  "artificial-intelligence": {
    title: "Artificial Intelligence",
    abbreviation: "AI",
    pronunciation: "[ˌɑːr.t̬əˈfɪʃ.əl ɪnˈtel.ə.dʒəns]",
    definition: [
      "Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions), and self-correction.",
      "AI can be categorized as either weak or strong. Weak AI (also known as narrow AI or Artificial Narrow Intelligence) is an AI system designed and trained for a particular task. Strong AI (also known as Artificial General Intelligence) is an AI system with general cognitive abilities, capable of performing any intellectual task that a human can. Most current AI is weak AI.",
      "Key aspects of AI include perception, reasoning, problem-solving, natural language processing, learning, and decision making.",
    ],
    examples: [
      "Image recognition in autonomous vehicles",
      "Natural language processing in virtual assistants (like Siri or Alexa)",
      "Recommendation engines (like on Netflix or Amazon)",
      "Stock trading prediction software",
      "Spam filtering in email",
      "Chatbots for customer service",
    ],
    relatedTerms: [
      "Machine Learning",
      "NLP",
      "Neural Networks",
      "Deep Learning",
      "Algorithms",
      "Data Science",
      "Computer Vision",
    ],
    relatedTools: [
      {
        name: "ChatGPT",
        description:
          "A large language model developed by OpenAI, capable of generating human-like text based on prompts.",
        link: "https://chat.openai.com/",
      },
      {
        name: "Midjourney",
        description: "An AI-powered image generation tool that creates images from text descriptions.",
        link: "https://www.midjourney.com/",
      },
      {
        name: "Jasper",
        description: "An AI writing assistant for creating content like blog posts, emails, and marketing copy.",
        link: "https://www.jasper.ai/",
      },
    ],
    relatedBlogPosts: [
      {
        title: "The Evolution of AI: From Theory to Practice",
        link: "/blog/evolution-of-ai",
        date: "2024-01-10",
      },
      {
        title: "AI in Healthcare: Revolutionizing Patient Care",
        link: "/blog/ai-in-healthcare",
        date: "2024-02-20",
      },
      {
        title: "Top 5 AI Tools for Small Businesses",
        link: "/blog/top-5-ai-tools-small-business",
        date: "2024-03-01",
      },
    ],
    sources: [
      {
        name: "MIT Technology Review - What is AI?",
        link: "https://www.technologyreview.com/explainer/what-is-ai/",
      },
      {
        name: "IBM - Artificial Intelligence",
        link: "https://www.ibm.com/topics/artificial-intelligence",
      },
      {
        name: "Google AI",
        link: "https://ai.google/",
      },
    ],
  },
  // Ensure these keys are unique
  "machine-learning": {
    title: "Machine Learning",
    abbreviation: "ML",
    // pronunciation: "...",
    definition: [
      "Machine Learning is a type of artificial intelligence that allows computer programs to learn from data without being explicitly programmed. It focuses on the development of computer programs that can access data and use it learn for themselves.",
      "The primary aim of machine learning is to build models that can make predictions or decisions based on new data. It's a subset of AI.",
    ],
    examples: [
      "Email spam detection",
      "Product recommendations on e-commerce sites",
      "Fraud detection",
      "Image and speech recognition",
    ],
    relatedTerms: [
      "AI",
      "Neural Networks",
      "Deep Learning",
      "Algorithms",
      "Data Science",
      "Supervised Learning",
      "Unsupervised Learning",
    ],
    relatedTools: [
      {
        name: "TensorFlow",
        description: "An open-source machine learning library developed by Google.",
        link: "https://www.tensorflow.org/",
      },
      {
        name: "PyTorch",
        description: "An open-source machine learning framework developed by Facebook's AI Research lab.",
        link: "https://pytorch.org/",
      },
    ],
    relatedBlogPosts: [
      {
        title: "Getting Started with Machine Learning",
        link: "/blog/getting-started-ml",
        date: "2023-11-01",
      },
    ],
    sources: [
      {
        name: "Coursera - Machine Learning Course",
        link: "https://www.coursera.org/learn/machine-learning",
      },
    ],
  },
  // Ensure this key is unique
  "natural-language-processing": {
    title: "Natural Language Processing",
    abbreviation: "NLP",
    // pronunciation: "...",
    definition: [
      "Natural Language Processing (NLP) is a subfield of artificial intelligence, computer science, and computational linguistics concerned with the interactions between computers and human (natural) languages, in particular how to program computers to process and analyze large amounts of natural language data.",
      "Challenges in NLP include understanding nuances of human language like sarcasm, context, and intent.",
    ],
    examples: [
      "Sentiment analysis",
      "Language translation (like Google Translate)",
      "Chatbots",
      "Text summarization",
      "Speech recognition",
    ],
    relatedTerms: ["AI", "Machine Learning", "Computational Linguistics", "Sentiment Analysis", "Tokenization"], // Removed duplicate "Sentiment Analysis"
    relatedTools: [
      {
        name: " spaCy",
        description: "An open-source software library for advanced natural language processing in Python.",
        link: "https://spacy.io/",
      },
    ],
    relatedBlogPosts: [],
    sources: [],
  },
  // Add data for other terms you have content for in the glossary
  "big-data": {
    title: "Big Data",
    abbreviation: null,
    definition: [
      "Big data refers to extremely large datasets that may be analyzed computationally to reveal patterns, trends, and associations.",
    ],
    examples: [],
    relatedTerms: ["Data Science"],
    relatedTools: [],
    relatedBlogPosts: [],
    sources: [],
  },
  chatbot: {
    title: "Chatbot",
    abbreviation: null,
    definition: [
      "A computer program designed to simulate conversation with human users, especially over the Internet.",
    ],
    examples: [],
    relatedTerms: ["NLP", "AI"],
    relatedTools: [],
    relatedBlogPosts: [],
    sources: [],
  },
  "cloud-computing": {
    title: "Cloud Computing",
    abbreviation: null,
    definition: [
      "The practice of using a network of remote servers hosted on the Internet to store, manage, and process data.",
    ],
    examples: [],
    relatedTerms: [],
    relatedTools: [],
    relatedBlogPosts: [],
    sources: [],
  },
  "data-science": {
    title: "Data Science",
    abbreviation: null,
    definition: [
      "An interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge from structured and unstructured data.",
    ],
    examples: [],
    relatedTerms: ["Big Data", "Machine Learning"],
    relatedTools: [],
    relatedBlogPosts: [],
    sources: [],
  },
  // Placeholder for terms M through Z that have content in your glossary
  // Ensure they exist here with their slug as the key if you want them to be linkable
  // Otherwise, the related terms links will be inactive as designed.
}

// The rest of the component code remains the same
export default function TermPage() {
  const params = useParams()
  const termSlug = params.termSlug as string

  const termData = termsData[termSlug]

  if (!termData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">Term Not Found</h1>
          <p className="text-sm md:text-base text-[#6b7280] max-w-md mx-auto">
            The AI term you are looking for does not exist in our glossary.
          </p>
          <Link href="/glossary" passHref>
            <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2">
              Back to Glossary
            </Button>
          </Link>
        </div>
        {/* <Footer /> */}
      </>
    )
  }

  const {
    title,
    abbreviation,
    pronunciation,
    definition,
    examples,
    relatedTerms,
    relatedTools,
    relatedBlogPosts,
    sources,
  } = termData

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

          {/* Term Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">
            {title} {abbreviation && <span className="text-gray-500 ml-2">({abbreviation})</span>}
          </h1>
          {pronunciation && <p className="text-sm text-gray-500 mb-6">{pronunciation}</p>}

          {/* Definition Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Definition</h2>
            <div className="text-gray-700 space-y-4">
              {definition.map((paragraph: string, index: number) => (
                <p key={index} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Examples Section */}
          {examples && examples.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Examples</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {examples.map((example: string, index: number) => (
                  <li key={index} className="text-base">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Terms Section */}
          {relatedTerms && relatedTerms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((term: string, index: number) => {
                  const termSlugLink = `/terms/${slugify(term)}`
                  const relatedTermHasData = !!termsData[slugify(term)]

                  return (
                    <Link
                      key={index}
                      href={relatedTermHasData ? termSlugLink : "#"}
                      passHref={relatedTermHasData}
                      className={`rounded-full px-3 py-1 text-sm ${
                        relatedTermHasData
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {term}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Related AI Tools Section */}
          {relatedTools && relatedTools.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">
                Related AI Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTools.map((tool: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold text-[#111827] mb-2">{tool.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{tool.description}</p>
                    <Link
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#a855f7] flex items-center hover:underline"
                    >
                      Learn More <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Blog Posts Section */}
          {relatedBlogPosts && relatedBlogPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">
                Related Blog Posts
              </h2>
              <ul className="space-y-2">
                {relatedBlogPosts.map((post: any, index: number) => (
                  <li key={index}>
                    <Link href={post.link} className="text-base text-[#a855f7] hover:underline">
                      {post.title}
                    </Link>
                    {post.date && <span className="text-sm text-gray-500 ml-2">({post.date})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources Section */}
          {sources && sources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#111827] mb-3 border-b pb-2 border-gray-200">Sources</h2>
              <ul className="space-y-2">
                {sources.map((source: any, index: number) => (
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
