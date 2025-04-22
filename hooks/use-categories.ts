import { useQuery } from "@tanstack/react-query"
import { getCategories, getCategory, getCategoryTools } from "@/services/category-service"

// Hook for fetching all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories()
      return response.categories
    },
  })
}

// Hook for fetching a specific category
export function useCategory(idOrSlug: string) {
  return useQuery({
    queryKey: ["category", idOrSlug],
    queryFn: () => getCategory(idOrSlug),
    enabled: !!idOrSlug, // Only run if idOrSlug is provided
  })
}

// Hook for fetching tools in a specific category
export function useCategoryTools(idOrSlug: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["category", idOrSlug, "tools", params],
    queryFn: () => getCategoryTools(idOrSlug, params),
    enabled: !!idOrSlug, // Only run if idOrSlug is provided
  })
}
