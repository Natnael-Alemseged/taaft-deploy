// hooks/use-glossary.ts
import { useQuery } from "@tanstack/react-query"
import { getGlossaryGrouped, type GroupedGlossaryResponse } from "@/services/glossary-service" // Import the service function and types

/**
 * React Query hook to fetch grouped glossary terms.
 * @returns Query result containing data, loading state, and error state.
 */
export function useGlossaryGrouped() {
  return useQuery<GroupedGlossaryResponse, Error>({
    // Added types for better clarity
    queryKey: ["glossary", "grouped"], // Unique query key for this data
    queryFn: () => getGlossaryGrouped(), // The function that fetches the data
  })
}

// You can add other glossary-related hooks here
