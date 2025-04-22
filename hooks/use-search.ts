import { useQuery } from "@tanstack/react-query"
import { searchTools, type SearchParams } from "@/services/search-service"

// Hook for searching tools
export function useSearchTools(params: SearchParams) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => searchTools(params),
    enabled: !!params.query || !!params.category || !!params.pricing, // Only run if we have search parameters
  })
}
