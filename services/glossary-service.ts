// services/glossary-service.ts
import apiClient from "@/lib/api-client"

// Define the structure of a single glossary term based on the API response
export type GlossaryTerm = {
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

// Define the structure of the grouped glossary response
export type GroupedGlossaryResponse = {
  [key: string]: GlossaryTerm[] // Keys are letters (A, B, C...), values are arrays of terms
}

/**
 * Fetches glossary terms grouped by their first letter.
 * @returns A promise that resolves to an object with letters as keys and arrays of terms as values.
 */
export const getGlossaryGrouped = async (): Promise<GroupedGlossaryResponse> => {
  try {
    const response = await apiClient.get<GroupedGlossaryResponse>("/api/glossary/grouped")
    console.log(' glossary response is:', JSON.stringify( response.data,null, 2));
    return response.data
  } catch (error) {
    console.error("Failed to fetch grouped glossary data:", error)
    return getMockGroupedGlossary() // Return mock data on error
  }
}

/**
 * Fetches a single glossary term by ID.
 * @param termId The ID of the term to fetch
 * @returns A promise that resolves to a glossary term
 */
export const getGlossaryTerm = async (termId: string): Promise<GlossaryTerm> => {
  try {
    const response = await apiClient.get<GlossaryTerm>(`/api/glossary/terms/${termId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch glossary term with ID ${termId}:`, error)
    // Return mock data for the requested term
    return getMockTerm(termId)
  }
}

/**
 * Fetches a single glossary term by slug.
 * @param slug The slug of the term to fetch
 * @returns A promise that resolves to a glossary term
 */
export const getGlossaryTermBySlug = async (slug: string): Promise<GlossaryTerm> => {
  try {
    // First try to find the term by slug in the API
    const response = await apiClient.get<GlossaryTerm>(`/api/glossary/terms/slug/${slug}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch glossary term with slug ${slug}:`, error)
    // Return mock data for the requested term slug
    return getMockTermBySlug(slug)
  }
}

// Mock data for when API calls fail completely
function getMockGroupedGlossary(): GroupedGlossaryResponse {
  return {
    A: [
      {
        id: "ai-term",
        name: "Artificial Intelligence (AI)",
        definition:
          "Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals and humans.",
        related_terms: ["Machine Learning", "Deep Learning", "Neural Networks"],
        tool_references: [],
        categories: ["Core Concepts"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        first_letter: "A",
      },
    ],
    M: [
      {
        id: "ml-term",
        name: "Machine Learning (ML)",
        definition:
          "Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
        related_terms: ["Artificial Intelligence", "Deep Learning", "Supervised Learning"],
        tool_references: [],
        categories: ["Core Concepts"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        first_letter: "M",
      },
    ],
  }
}

function getMockTerm(termId: string): GlossaryTerm {
  // Create a basic mock term
  return {
    id: termId,
    name: "Artificial Intelligence (AI)",
    definition:
      "Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals and humans. AI systems can be categorized as either narrow AI (designed for specific tasks) or general AI (capable of performing any intellectual task a human can do).",
    related_terms: ["Machine Learning", "Deep Learning", "Neural Networks", "NLP", "Computer Vision"],
    tool_references: [],
    categories: ["Core Concepts"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    first_letter: "A",
  }
}

function getMockTermBySlug(slug: string): GlossaryTerm {
  // Map common slugs to term names
  const slugToName: Record<string, string> = {
    "artificial-intelligence": "Artificial Intelligence (AI)",
    "machine-learning": "Machine Learning (ML)",
    "deep-learning": "Deep Learning",
    "neural-networks": "Neural Networks",
    "natural-language-processing": "Natural Language Processing (NLP)",
    "computer-vision": "Computer Vision",
  }

  // Create a basic mock term based on the slug
  return {
    id: `mock-${slug}`,
    name:
      slugToName[slug] ||
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    definition: `This is a mock definition for ${slugToName[slug] || slug}. In a production environment, this would be fetched from the API.`,
    related_terms: ["Artificial Intelligence", "Machine Learning"],
    tool_references: [],
    categories: ["Core Concepts"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    first_letter: slug.charAt(0).toUpperCase(),
  }
}


export const getBlogPostsByTerm = async (termSlug: string): Promise<any[]> => {
  try {
    const response = await apiClient.get<any[]>(`/api/blog/by-term/${termSlug}`)
    console.log(' blog posts by term response is:', JSON.stringify( response.data,null, 2));
    return response.data
  } catch (error) {
    console.error(`Failed to fetch blog posts by term ${termSlug}:`, error)
    return []
  }
}
