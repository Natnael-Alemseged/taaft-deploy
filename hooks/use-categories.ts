import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"

// Type for category
export interface Category {
  id: string
  name: string
  slug: string
  toolCount: number
}

// Fetch all categories
const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<{ categories: Category[] }>("/categories")
  return response.data.categories
}

// Hook for fetching categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })
}
