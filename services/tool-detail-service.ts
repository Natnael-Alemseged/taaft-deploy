import apiClient from "@/lib/api-client"
import type { Tool } from "@/types/tool"

// Get tool by unique ID
export const getToolByUniqueId = async (uniqueId: string): Promise<Tool> => {
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
    const response = await apiClient.get<Tool>(`/tools/unique/${uniqueId}`, { headers })

    // Return the response data
    return response.data
  } catch (error) {
    console.error(`Error fetching tool with unique ID ${uniqueId}:`, error)
    throw error
  }
}
