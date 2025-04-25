import apiClient from "@/lib/api-client"
import type { Category } from "@/types/category"

// Remove mock data and update getCategories to only use the API
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/api/categories")
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return empty array instead of mock data
    return []
  }
}

export const getCategory = async (idOrSlug: string): Promise<Category> => {
  try {
    const response = await apiClient.get(`/categories/${idOrSlug}`)
    return response.data
  } catch (error) {
    console.error("Error fetching category:", error)
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

// Remove the getMockCategories function
