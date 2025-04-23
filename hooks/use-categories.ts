import { useQuery } from "@tanstack/react-query"
import { getCategories, getCategory, getCategoryTools } from "@/services/category-service"
import type { Category } from "@/types/category" // Import Category type

// Hook for fetching all categories
export function useCategories() {
  return useQuery<Category[], Error>({ // Added types for better clarity
    queryKey: ["categories"],
    queryFn: () => getCategories(), // Corrected: Assuming getCategories returns Promise<Category[]> directly
  })
}

// Hook for fetching a specific category
export function useCategory(idOrSlug: string) {
  return useQuery<Category, Error>({ // Added types
    queryKey: ["category", idOrSlug],
    queryFn: () => getCategory(idOrSlug),
    enabled: !!idOrSlug, // Only run if idOrSlug is provided
  })
}

// Hook for fetching tools in a specific category
export function useCategoryTools(idOrSlug: string, params?: { page?: number; limit?: number }) {
  // Assuming getCategoryTools returns { tools: Tool[], total: number }
  return useQuery<{ tools: any[], total: number }, Error>({ // Added types (adjust Tool[] if needed)
    queryKey: ["category", idOrSlug, "tools", params],
    queryFn: () => getCategoryTools(idOrSlug, params),
    enabled: !!idOrSlug, // Only run if idOrSlug is provided
  })
}