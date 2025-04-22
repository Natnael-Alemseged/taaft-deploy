import apiClient from "@/lib/api-client"
import type { Category } from "@/types/category"

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/categories")
  return response.data
}

export const getCategory = async (idOrSlug: string): Promise<Category> => {
  const response = await apiClient.get(`/categories/${idOrSlug}`)
  return response.data
}

export const getCategoryTools = async (categoryId: string) => {
  const response = await apiClient.get(`/categories/${categoryId}/tools`)
  return response.data
}
