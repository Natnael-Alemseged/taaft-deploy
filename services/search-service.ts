import apiClient from "@/lib/api-client"
import type { Tool } from "@/types/tool"

export interface SearchParams {
  query?: string
  category?: string
  pricing?: string
  page?: number
  limit?: number
}

// Search for tools
export const searchTools = async (params: SearchParams) => {
  const response = await apiClient.get<{ tools: Tool[]; total: number }>("/search", { params })
  return response.data
}
