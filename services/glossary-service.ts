// services/glossary-service.ts
import apiClient from "@/lib/api-client"

// Define the structure of a single glossary term based on your API response
export type GlossaryTerm = {
  id: string
  name: string
  definition: string
  related_terms: string[]
  tool_references: string[] // Assuming this is an array of strings (tool IDs or names)
  categories: string[]
  created_at: string
  updated_at: string
  first_letter: string
}

// Extended type with additional UI fields
export type ExtendedGlossaryTerm = GlossaryTerm & {
  title: string
  abbreviation?: string
  pronunciation?: string
  definition_paragraphs: string[]
  examples: string[]
  relatedTerms: string[]
  relatedTools: {
    name: string
    description: string
    link: string
    category?: string
    isFree?: boolean
  }[]
  relatedBlogPosts: {
    title: string
    link: string
    date: string
    description?: string
  }[]
  sources: {
    name: string
    link: string
  }[]
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
    return response.data
  } catch (error) {
    console.error("Failed to fetch grouped glossary data:", error)
    return getMockGroupedGlossary() // Return mock data on error
  }
}

/**
 * Fetches a single glossary term by ID and enhances it with additional UI data.
 * @param termId The ID of the term to fetch
 * @returns A promise that resolves to an enhanced glossary term
 */
export const getGlossaryTerm = async (termId: string): Promise<ExtendedGlossaryTerm> => {
  try {
    // Get user_id from localStorage
    const userDataStr = localStorage.getItem("user");
    if (!userDataStr) {
      console.error("User data not found in localStorage for getGlossaryTerm");
      throw new Error("User not authenticated or user data missing");
    }
    const userData = JSON.parse(userDataStr);
    const userId = userData.id;

    // Prepare the request body (Structure confirmed by Postman)
    const requestBody = {
      term: termId, // Use the termId passed to the function
      user_id: userId, // Include the fetched user_id
      model: "default" // Include the model, assuming it's always 'default' for this call
    };

    // Make the POST request using the CORRECTED URL path
    const response = await apiClient.post<GlossaryTerm>(
        `/api/terms/glossary-term`, // <-- CORRECTED PATH HERE!
        requestBody // Pass the data payload
    );

    const apiData = response.data;

    // Enhance the API data with additional UI fields
    return enhanceTermWithUIData(apiData);

  } catch (error) {
    console.error(`Failed to fetch glossary term with ID ${termId}:`, error);
    // Return mock data or re-throw the error depending on desired error handling
    return getMockTerm(termId);
  }
};
/**
 * Fetches a single glossary term by slug and enhances it with additional UI data.
 * @param slug The slug of the term to fetch
 * @returns A promise that resolves to an enhanced glossary term
 */
export const getGlossaryTermBySlug = async (slug: string): Promise<ExtendedGlossaryTerm> => {
  try {
    // First try to find the term by slug in the API
    // Note: If your API doesn't support slug lookup, you might need to fetch all terms
    // and find the one with the matching slug
    const response = await apiClient.get<GlossaryTerm>(`/api/glossary/terms/slug/${slug}`)
    const apiData = response.data

    // Enhance the API data with additional UI fields
    return enhanceTermWithUIData(apiData)
  } catch (error) {
    console.error(`Failed to fetch glossary term with slug ${slug}:`, error)
    // Return mock data for the requested term slug
    return getMockTermBySlug(slug)
  }
}

/**
 * Enhances a basic glossary term from the API with additional UI data.
 * @param term The basic term data from the API
 * @returns An enhanced term with all UI fields
 */
function enhanceTermWithUIData(term: GlossaryTerm): ExtendedGlossaryTerm {
  // Split the definition into paragraphs if it's a single string
  const definition_paragraphs = term.definition.includes("\n")
    ? term.definition.split("\n").filter((p) => p.trim().length > 0)
    : [term.definition]

  // Extract abbreviation if present in the name (e.g., "Artificial Intelligence (AI)")
  let abbreviation: string | undefined
  const nameMatch = term.name.match(/^(.*?)\s*$$(.*?)$$$/)
  const title = nameMatch ? nameMatch[1] : term.name
  if (nameMatch) {
    abbreviation = nameMatch[2]
  }

  // Generate mock examples based on the term
  const examples = generateMockExamples(term.name, term.categories)

  // Generate mock related tools
  const relatedTools = generateMockRelatedTools(term.name, term.categories)

  // Generate mock blog posts
  const relatedBlogPosts = generateMockBlogPosts(term.name)

  // Generate mock sources
  const sources = generateMockSources(term.name)

  return {
    ...term,
    title,
    abbreviation,
    definition_paragraphs,
    examples,
    relatedTerms: term.related_terms || [],
    relatedTools,
    relatedBlogPosts,
    sources,
  }
}

// Mock data generation functions
function generateMockExamples(termName: string, categories: string[]): string[] {
  const commonExamples = [
    "Image recognition in autonomous vehicles",
    "Natural language processing in chatbots",
    "Game-playing AI like AlphaGo",
    "Recommendation engines on streaming platforms",
    "Fraud detection in financial transactions",
    "Medical diagnosis assistance",
  ]

  // Return 3-5 examples
  return commonExamples.slice(0, Math.floor(Math.random() * 3) + 3)
}

function generateMockRelatedTools(termName: string, categories: string[]): ExtendedGlossaryTerm["relatedTools"] {
  const allTools = [
    {
      name: "ChatGPT",
      description:
        "Conversational AI assistant developed by OpenAI that can engage in natural language dialogue and generate human-like responses.",
      link: "https://chat.openai.com/",
      category: "Conversational AI",
      isFree: true,
    },
    {
      name: "Midjourney",
      description:
        "AI art generation tool that creates images from textual descriptions using advanced machine learning algorithms.",
      link: "https://www.midjourney.com/",
      category: "Image Generation",
      isFree: true,
    },
    {
      name: "Jasper",
      description:
        "AI writing assistant for creating marketing copy, blog posts, and other content with customizable tone and style.",
      link: "https://www.jasper.ai/",
      category: "Content Creation",
      isFree: false,
    },
    {
      name: "Stable Diffusion",
      description: "Open-source image generation model that creates detailed images from text descriptions.",
      link: "https://stability.ai/",
      category: "Image Generation",
      isFree: true,
    },
    {
      name: "GitHub Copilot",
      description: "AI pair programmer that suggests code completions based on context and comments.",
      link: "https://github.com/features/copilot",
      category: "Development",
      isFree: false,
    },
    {
      name: "Anthropic Claude",
      description: "Conversational AI assistant designed to be helpful, harmless, and honest.",
      link: "https://www.anthropic.com/claude",
      category: "Conversational AI",
      isFree: false,
    },
  ]

  // Return 2-3 related tools
  return allTools.slice(0, Math.floor(Math.random() * 2) + 2)
}

function generateMockBlogPosts(termName: string): ExtendedGlossaryTerm["relatedBlogPosts"] {
  const currentYear = new Date().getFullYear()
  const allPosts = [
    {
      title: `Understanding ${termName}: A Beginner's Guide`,
      link: `/blog/understanding-${termName.toLowerCase().replace(/\s+/g, "-")}`,
      date: `${currentYear}-04-10`,
      description: `Explore the fundamentals of ${termName.toLowerCase()} and its impact on various industries.`,
    },
    {
      title: `The Future of ${termName}: Trends and Predictions`,
      link: `/blog/future-of-${termName.toLowerCase().replace(/\s+/g, "-")}`,
      date: `${currentYear}-04-05`,
      description: `What's next for ${termName.toLowerCase()}? Discover the emerging trends shaping the future of ${termName}.`,
    },
    {
      title: `How ${termName} is Transforming Business Operations`,
      link: `/blog/${termName.toLowerCase().replace(/\s+/g, "-")}-business-transformation`,
      date: `${currentYear}-03-22`,
      description: `Learn how companies are leveraging ${termName.toLowerCase()} to streamline operations and drive growth.`,
    },
    {
      title: `Ethical Considerations in ${termName}`,
      link: `/blog/ethical-${termName.toLowerCase().replace(/\s+/g, "-")}`,
      date: `${currentYear}-03-15`,
      description: `Exploring the ethical challenges and considerations in the development and deployment of ${termName.toLowerCase()}.`,
    },
  ]

  // Return 2-3 blog posts
  return allPosts.slice(0, Math.floor(Math.random() * 2) + 2)
}

function generateMockSources(termName: string): ExtendedGlossaryTerm["sources"] {
  const allSources = [
    {
      name: "MIT Technology Review",
      link: "https://www.technologyreview.com/",
    },
    {
      name: "Stanford AI Lab",
      link: "https://ai.stanford.edu/",
    },
    {
      name: "IBM Research",
      link: "https://research.ibm.com/",
    },
    {
      name: "Google AI",
      link: "https://ai.google/",
    },
    {
      name: "Harvard Business Review",
      link: "https://hbr.org/",
    },
  ]

  // Return 2-3 sources
  return allSources.slice(0, Math.floor(Math.random() * 2) + 2)
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
    // Add more mock terms as needed
  }
}

function getMockTerm(termId: string): ExtendedGlossaryTerm {
  // Create a basic mock term
  const mockTerm: GlossaryTerm = {
    id: termId,
    name: "Artificial Intelligence (AI)",
    definition:
      "Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals and humans. AI systems can be categorized as either narrow AI (designed for specific tasks) or general AI (capable of performing any intellectual task a human can do). Most current AI systems are examples of narrow AI, excelling at specific tasks like image recognition, natural language processing, or playing games, but lacking the broader understanding and adaptability of human intelligence.",
    related_terms: ["Machine Learning", "Deep Learning", "Neural Networks", "NLP", "Computer Vision"],
    tool_references: [],
    categories: ["Core Concepts"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    first_letter: "A",
  }

  // Enhance it with UI data
  return enhanceTermWithUIData(mockTerm)
}

function getMockTermBySlug(slug: string): ExtendedGlossaryTerm {
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
  const mockTerm: GlossaryTerm = {
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

  // Enhance it with UI data
  return enhanceTermWithUIData(mockTerm)
}
