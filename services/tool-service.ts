import apiClient from "@/lib/api-client"
import type { Tool, ToolSubmission } from "@/types/tool"

// Get all tools with optional filtering, searching, and pagination
export const getTools = async (params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const headers: Record<string, string> = {
      Accept: "application/json",
    }
    let endpoint = "/public/tools"
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
      //  endpoint = "/tools/"
    }

    const apiParams: Record<string, any> = {}
    // let endpoint = "/tools"
    

    if (params?.search) {
      apiParams.q = `%${params.search}%`;
      endpoint = "/tools/search" // Use /tools/search if a search term is provided
    }

    const limit = params?.limit ?? 12
    apiParams.limit = limit

    const page = params?.page ?? 1
    apiParams.skip = (page - 1) * limit

    if (params?.category && params.category !== "all categories" && params.category !== "all-categories") {
      apiParams.category = params.category
    }

    const response = await apiClient.get<{ tools: Tool[]; total: number }>(endpoint, {
      params: apiParams,
      headers,
    })

    console.log(`Fetched from ${endpoint}:`,  JSON.stringify(response.data, null, 2))
    return response.data

  } catch (error) {
    console.error("Error fetching tools:", error)
    return getMockTools(params)
  }
}


// Mock data function
function getMockTools(params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): { tools: Tool[]; total: number } {
  const mockTools: Tool[] = [
    {
      id: "ai-image-creator",
      name: "AI Image Creator",
      slug: "ai-image-creator",
      category: "Image Generation",
      description: "Generate stunning images from text descriptions using advanced AI models.",
      features: ["Marketing", "Design", "Content"],
      pricing: "premium",
      hasFreeVersion: false,
      website: "https://example.com/ai-image-creator",
      contactName: "John Doe",
      contactEmail: "john@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: true,
      savedByUser: false,
      tags: ["Marketing", "Design", "Content"],
    },
    {
      id: "codeassist-ai",
      name: "CodeAssist AI",
      slug: "codeassist-ai",
      category: "Development",
      description: "AI-powered code completion and generator tool that helps developers write better code.",
      features: ["Coding", "Web Dev", "Debugging"],
      pricing: "free",
      hasFreeVersion: true,
      website: "https://example.com/codeassist-ai",
      contactName: "Jane Smith",
      contactEmail: "jane@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: true,
      savedByUser: false,
      tags: ["Coding", "Web Dev", "Debugging"],
    },
    {
      id: "writerbot-pro",
      name: "WriterBot Pro",
      slug: "writerbot-pro",
      category: "Writing",
      description:
        "Advanced AI writing assistant that helps create high-quality content for blogs, social media, and more.",
      features: ["Blogging", "Marketing", "Social Media"],
      pricing: "premium",
      hasFreeVersion: false,
      website: "https://example.com/writerbot-pro",
      contactName: "Alex Johnson",
      contactEmail: "alex@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: false,
      savedByUser: false,
      tags: ["Blogging", "Marketing", "Social Media"],
    },
    {
      id: "voicegenius",
      name: "VoiceGenius",
      slug: "voicegenius",
      category: "Audio",
      description: "Turn text into natural-sounding voice with multiple accents, tones, and emotions.",
      features: ["Video", "Podcast", "Accessibility"],
      pricing: "free",
      hasFreeVersion: true,
      website: "https://example.com/voicegenius",
      contactName: "Sarah Lee",
      contactEmail: "sarah@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: false,
      savedByUser: false,
      tags: ["Video", "Podcast", "Accessibility"],
    },
    {
      id: "data-insight-pro",
      name: "Data Insight Pro",
      slug: "data-insight-pro",
      category: "Data & Analytics",
      description: "AI-powered data analysis tool that turns complex data sets into actionable insights.",
      features: ["Business Intelligence", "Data Analysis", "Reporting"],
      pricing: "premium",
      hasFreeVersion: false,
      website: "https://example.com/data-insight-pro",
      contactName: "Michael Brown",
      contactEmail: "michael@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: true,
      savedByUser: false,
      tags: ["Business Intelligence", "Data Analysis", "Reporting"],
    },
    {
      id: "ai-video-editor",
      name: "AI Video Editor",
      slug: "ai-video-editor",
      category: "Video",
      description:
        "Automated video editing platform that cuts editing time by 90% using AI to create professional videos.",
      features: ["Content Creation", "Marketing", "Social Media"],
      pricing: "premium",
      hasFreeVersion: false,
      website: "https://example.com/ai-video-editor",
      contactName: "Emily Wilson",
      contactEmail: "emily@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: false,
      savedByUser: false,
      tags: ["Content Creation", "Marketing", "Social Media"],
    },
    {
      id: "neural-translator",
      name: "Neural Translator",
      slug: "neural-translator",
      category: "Language",
      description: "Advanced AI translation tool that preserves context and nuance across 100+ languages.",
      features: ["Translation", "Localization", "Communication"],
      pricing: "free",
      hasFreeVersion: true,
      website: "https://example.com/neural-translator",
      contactName: "David Kim",
      contactEmail: "david@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: false,
      savedByUser: false,
      tags: ["Translation", "Localization", "Communication"],
    },
    {
      id: "predictive-analytics",
      name: "Predictive Analytics",
      slug: "predictive-analytics",
      category: "Business",
      description: "Enterprise-grade tool that forecasts business trends and customer behavior.",
      features: ["Forecasting", "Planning", "Strategy"],
      pricing: "premium",
      hasFreeVersion: false,
      website: "https://example.com/predictive-analytics",
      contactName: "Lisa Chen",
      contactEmail: "lisa@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: true,
      savedByUser: false,
      tags: ["Forecasting", "Planning", "Strategy"],
    },
  ]

  // Filter by category if provided
  let filteredTools = mockTools
  if (params?.category && params.category !== "all-categories" && params.category !== "all categories") {
    filteredTools = mockTools.filter((tool) => tool.category.toLowerCase() === params.category?.toLowerCase())
  }

  // Filter by search term if provided
  if (params?.search) {
    const searchLower = params.search.toLowerCase()
    filteredTools = filteredTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Calculate pagination
  const page = params?.page || 1
  const limit = params?.limit || 12
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedTools = filteredTools.slice(startIndex, endIndex)

  return {
    tools: paginatedTools,
    total: filteredTools.length,
  }
}

// Get a single tool by ID
export const getToolById = async (id: string): Promise<Tool> => {
  try {
    // Get token from localStorage for authorization
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    // Set up headers with authorization if token exists
    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Make the API call with authorization headers
    const response = await apiClient.get<Tool>(`/tools/${id}`, { headers })

    // Return the response data
    return response.data
  } catch (error) {
    console.error(`Error fetching tool with ID ${id}:`, error)

    // Return mock data for the specific tool ID
    return getMockToolById(id)
  }
}

// Mock data function for a single tool
function getMockToolById(id: string): Tool {
  // Define mock tools with detailed information
  const mockTools: Record<string, Tool> = {
    "ai-image-creator": {
      id: "ai-image-creator",
      name: "AI Image Creator",
      slug: "ai-image-creator",
      category: "Image Generation",
      description:
        "Generate stunning images from text descriptions using advanced AI models. Perfect for marketing materials, social media content, and creative projects. Our state-of-the-art AI understands complex prompts and produces high-quality, unique images in seconds.",
      features: [
        "Text-to-image generation",
        "Style customization",
        "High-resolution output",
        "Commercial usage rights",
        "Batch processing",
        "Template library",
      ],
      pricing: "premium",
      hasFreeVersion: false,
      website: "https://example.com/ai-image-creator",
      contactName: "John Doe",
      contactEmail: "john@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: true,
      savedByUser: false,
      logoUrl: "/placeholder.svg?height=64&width=64",
      screenshotUrls: [
        "/placeholder.svg?height=400&width=600&text=AI+Image+Creator+Screenshot+1",
        "/placeholder.svg?height=400&width=600&text=AI+Image+Creator+Screenshot+2",
      ],
      relatedTools: [
        {
          id: "dreamscape-ai",
          name: "DreamScape AI",
          category: "Image Generation",
          description: "Create surreal and artistic images with AI that understands complex visual concepts.",
          features: ["Art", "Creative", "Digital Art"],
          pricing: "premium",
          website: "https://example.com/dreamscape-ai",
          hasFreeVersion: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "approved",
          savedByUser: false,
          slug: "dreamscape-ai",
          contactName: "Art Team",
          contactEmail: "art@example.com",
        },
        {
          id: "photofixer",
          name: "PhotoFixer",
          category: "Image Generation",
          description: "Enhance and restore old or damaged photos with AI-powered image processing.",
          features: ["Photo Editing", "Restoration", "Enhancement"],
          pricing: "free",
          website: "https://example.com/photofixer",
          hasFreeVersion: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "approved",
          savedByUser: false,
          slug: "photofixer",
          contactName: "Photo Team",
          contactEmail: "photo@example.com",
        },
      ],
    },
    "codeassist-ai": {
      id: "codeassist-ai",
      name: "CodeAssist AI",
      slug: "codeassist-ai",
      category: "Development",
      description:
        "AI-powered code completion and generator tool that helps developers write better code faster. Supports multiple programming languages and frameworks with intelligent suggestions based on context and best practices.",
      features: [
        "Code completion",
        "Error detection",
        "Refactoring suggestions",
        "Documentation generation",
        "Multi-language support",
        "IDE integration",
      ],
      pricing: "free",
      hasFreeVersion: true,
      website: "https://example.com/codeassist-ai",
      contactName: "Jane Smith",
      contactEmail: "jane@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "approved",
      isFeatured: true,
      savedByUser: false,
      logoUrl: "/placeholder.svg?height=64&width=64",
      screenshotUrls: [
        "/placeholder.svg?height=400&width=600&text=CodeAssist+AI+Screenshot+1",
        "/placeholder.svg?height=400&width=600&text=CodeAssist+AI+Screenshot+2",
      ],
      relatedTools: [
        {
          id: "devgpt",
          name: "DevGPT",
          category: "Development",
          description: "AI coding assistant that generates code snippets, explains code, and helps debug issues.",
          features: ["Programming", "Debugging", "Learning"],
          pricing: "premium",
          website: "https://example.com/devgpt",
          hasFreeVersion: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "approved",
          savedByUser: false,
          slug: "devgpt",
          contactName: "Dev Team",
          contactEmail: "dev@example.com",
        },
        {
          id: "bugfixer-ai",
          name: "BugFixer AI",
          category: "Development",
          description: "Automatically identifies and fixes bugs in your code with detailed explanations.",
          features: ["Debugging", "Code Quality", "Learning"],
          pricing: "free",
          website: "https://example.com/bugfixer-ai",
          hasFreeVersion: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "approved",
          savedByUser: false,
          slug: "bugfixer-ai",
          contactName: "Bug Team",
          contactEmail: "bug@example.com",
        },
      ],
    },
  }

  // Add more mock tools as needed

  // Return the specific tool if it exists in our mock data
  if (mockTools[id]) {
    return mockTools[id]
  }

  // If the specific tool ID is not found in our mock data, return a generic mock tool
  return {
    id: id,
    name: `AI Tool ${id}`,
    slug: id,
    category: "AI Tools",
    description: "This is a placeholder description for an AI tool that wasn't found in our database.",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    pricing: "free",
    hasFreeVersion: true,
    website: `https://example.com/${id}`,
    contactName: "Support Team",
    contactEmail: "support@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "approved",
    isFeatured: false,
    savedByUser: false,
    logoUrl: "/placeholder.svg?height=64&width=64",
    screenshotUrls: [
      `/placeholder.svg?height=400&width=600&text=${id}+Screenshot+1`,
      `/placeholder.svg?height=400&width=600&text=${id}+Screenshot+2`,
    ],
    relatedTools: [
      {
        id: "related-tool-1",
        name: "Related Tool 1",
        category: "AI Tools",
        description: "A related AI tool for demonstration purposes.",
        features: ["Feature A", "Feature B", "Feature C"],
        pricing: "premium",
        website: "https://example.com/related-tool-1",
        hasFreeVersion: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "approved",
        savedByUser: false,
        slug: "related-tool-1",
        contactName: "Related Team",
        contactEmail: "related@example.com",
      },
      {
        id: "related-tool-2",
        name: "Related Tool 2",
        category: "AI Tools",
        description: "Another related AI tool for demonstration purposes.",
        features: ["Feature X", "Feature Y", "Feature Z"],
        pricing: "free",
        website: "https://example.com/related-tool-2",
        hasFreeVersion: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "approved",
        savedByUser: false,
        slug: "related-tool-2",
        contactName: "Related Team",
        contactEmail: "related@example.com",
      },
    ],
  }
}

// Get featured tools - No static data fallback, only return what API provides
export const getFeaturedTools = async (limit?: number) => {
  try {
    // This works client-side but needs alternative for server-side rendering
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    let endpoint = "/public/tools/featured"

    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}` // Add Authorization header if token exists
      console.log("token", token);
      endpoint = "/tools/"
    }

    // Make API call to get featured tools
    const response = await apiClient.get<{ tools: Tool[] }>(endpoint, {
      params: { limit: limit, featured: true },
      headers: headers,
    })

    console.log("getFeaturedTools response", JSON.stringify(response.data, null, 2));

    // Return exactly what the API returns, no static fallback
    return response.data
  } catch (error) {
    console.error("Error fetching featured tools:", error)

    // Return empty array instead of mock data to ensure no static data is displayed
    return { tools: [] }
  }
}

// Get most popular tools
export const getPopularTools = async (limit?: number) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await apiClient.get<{ tools: Tool[] }>("/public/tools/sponsored/", {
      params: { limit, sort: "popular" },
      headers,
    })

    return response.data
  } catch (error) {
    console.error("Error fetching popular tools:", error)

    // Return mock popular tools (using the first few tools from our mock data)
    const mockTools = getMockTools({ limit }).tools
    return { tools: mockTools.slice(0, limit || 4) }
  }
}

// Submit a new tool
export const submitTool = async (toolData: ToolSubmission) => {
  // Assuming submission requires authentication, add token handling here
  const response = await apiClient.post<Tool>("/tools", toolData)
  return response.data
}

// Update an existing tool
export const updateTool = async ({ id, ...toolData }: Partial<Tool> & { id: string }) => {
  // Assuming update requires authentication, add token handling here
  const response = await apiClient.put<Tool>(`/tools/${id}`, toolData)
  return response.data
}

// Delete a tool
export const deleteTool = async (id: string) => {
  // Assuming deletion requires authentication, add token handling here
  const response = await apiClient.delete(`/tools/${id}`)
  return response.data
}

// Save a tool (add to favorites)
export const saveTool = async (toolId: string) => {
  // Assuming saving requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const body = {
    "tool_unique_id": toolId,
  }
  const response = await apiClient.post<{ message: string }>(`/favorites`, body, { headers })
  console.log("saveTool response", JSON.stringify(response.data, null, 2));
  return response.data
}

// Unsave a tool (remove from favorites)
export const unsaveTool = async (toolId: string) => {
  // Assuming unsaving requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await apiClient.delete<{ message: string }>(`/favorites/${toolId}`, { headers })
  console.log("unsaveTool response", JSON.stringify(response.data, null, 2));
  return response.data
}

// Get user's saved tools
export const getSavedTools = async () => {
  try {
    // Assuming getting saved tools requires authentication, add token handling here
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    if (!token) {
      throw new Error("Authentication required to get saved tools")
    }

    const headers: Record<string, string> = { Authorization: `Bearer ${token}` }
    const response = await apiClient.get<{ tools: Tool[] }>("/tools/saved", { headers })
    return response.data
  } catch (error) {
    console.error("Error fetching saved tools:", error)

    // Return empty array for saved tools if there's an error
    return { tools: [] }
  }
}

// Upload tool logo
export const uploadToolLogo = async (id: string, file: File) => {
  // Assuming upload requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    : { "Content-Type": "multipart/form-data" }

  const formData = new FormData()
  formData.append("logo", file)

  const response = await apiClient.post<{ logoUrl: string }>(`/tools/${id}/logo`, formData, { headers })

  return response.data
}

// Upload tool screenshots
export const uploadToolScreenshots = async (id: string, files: File[]) => {
  // Assuming upload requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    : { "Content-Type": "multipart/form-data" }

  const formData = new FormData()

  files.forEach((file, index) => {
    formData.append(`screenshot-${index}`, file) // Adjust key name if API expects something else
  })

  const response = await apiClient.post<{ screenshotUrls: string[] }>(`/tools/${id}/screenshots`, formData, { headers })

  return response.data
}
