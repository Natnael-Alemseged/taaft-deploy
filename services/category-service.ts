import apiClient from "@/lib/api-client"
import type { Category } from "@/types/category"

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("api/categories")
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return mock categories if API call fails
    return getMockCategories()
  }
}

export const getCategory = async (idOrSlug: string): Promise<Category> => {
  try {
    const response = await apiClient.get(`/categories/${idOrSlug}`)
    return response.data
  } catch (error) {
    console.error("Error fetching category:", error)
    // Return mock category if API call fails
    const mockCategories = getMockCategories()
    const category = mockCategories.find((cat) => cat.slug === idOrSlug || cat.id === idOrSlug)
    if (category) {
      return category
    }
    throw new Error(`Category not found: ${idOrSlug}`)
  }
}

export const getCategoryTools = async (categoryId: string) => {
  try {
    const response = await apiClient.get(`/categories/${categoryId}/tools`)
    return response.data
  } catch (error) {
    console.error("Error fetching category tools:", error)
    // Return empty data if API call fails
    return { tools: [], total: 0 }
  }
}

// Mock categories function
function getMockCategories(): Category[] {
  return [
    {
      id: "image-generation",
      name: "Image Generation",
      slug: "image-generation",
      count: 12,
      imageUrl: "",
    },
    {
      id: "development",
      name: "Development",
      slug: "development",
      count: 15,
      imageUrl: "",
    },
    {
      id: "writing",
      name: "Writing",
      slug: "writing",
      count: 10,
      imageUrl: "",
    },
    {
      id: "audio",
      name: "Audio",
      slug: "audio",
      count: 8,
      imageUrl: "",
    },
    {
      id: "data-analytics",
      name: "Data & Analytics",
      slug: "data-analytics",
      count: 14,
      imageUrl: "",
    },
    {
      id: "video",
      name: "Video",
      slug: "video",
      count: 9,
      imageUrl: "",
    },
    {
      id: "language",
      name: "Language",
      slug: "language",
      count: 7,
      imageUrl: "",
    },
    {
      id: "business",
      name: "Business",
      slug: "business",
      count: 11,
      imageUrl: "",
    },
    {
      id: "design",
      name: "Design",
      slug: "design",
      count: 13,
      imageUrl: "",
    },
  ]
}
