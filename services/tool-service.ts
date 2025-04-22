import apiClient from "@/lib/api-client"
import type { Tool, ToolSubmission } from "@/types/tool"

// Get all tools with optional filtering
export const getTools = async (params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const response = await apiClient.get<{ tools: Tool[]; total: number }>("/tools", { params })
  return response.data
}

// Get a single tool by ID
export const getToolById = async (id: string) => {
  const response = await apiClient.get<Tool>(`/tools/${id}`)
  return response.data
}

// Get featured tools
// Example of how it *would* look to send the token
export const getFeaturedTools = async (limit?: number) => {
  const token = localStorage.getItem("access_token"); // Get the token

  // Only proceed if a token exists and you want to send it for this endpoint
  // (Some APIs allow /tools without a token but return more data with one)
  if (!token) {
    // Decide how to handle:
    // - Return apiClient.get without token (if API allows unauthenticated access)
    // - Throw an error or return null if token is mandatory
    // - For now, let's add headers conditionally
  }

  const headers: Record<string, string> = {
    "Accept": "application/json"
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Add Authorization header if token exists
  }


  const response = await apiClient.get<{ tools: Tool[] }>("/tools", {
    params: { limit: limit },
    headers: headers // Include the headers object here
  });
  console.log(response.data);
  return response.data;
};

// Get most popular tools
export const getPopularTools = async (limit?: number) => {
  const response = await apiClient.get<{ tools: Tool[] }>("/tools/", {
    params: { limit },
  })


  return response.data
}

// Submit a new tool
export const submitTool = async (toolData: ToolSubmission) => {
  const response = await apiClient.post<Tool>("/tools", toolData)
  return response.data
}

// Update an existing tool
export const updateTool = async ({ id, ...toolData }: Partial<Tool> & { id: string }) => {
  const response = await apiClient.put<Tool>(`/tools/${id}`, toolData)
  return response.data
}

// Delete a tool
export const deleteTool = async (id: string) => {
  const response = await apiClient.delete(`/tools/${id}`)
  return response.data
}

// Save a tool (add to favorites)
export const saveTool = async (toolId: string) => {
  const response = await apiClient.post<{ message: string }>(`/tools/${toolId}/save`)
  return response.data
}

// Unsave a tool (remove from favorites)
export const unsaveTool = async (toolId: string) => {
  const response = await apiClient.delete<{ message: string }>(`/tools/${toolId}/save`)
  return response.data
}

// Get user's saved tools
export const getSavedTools = async () => {
  const response = await apiClient.get<{ tools: Tool[] }>("/tools/saved")
  return response.data
}

// Upload tool logo
export const uploadToolLogo = async (id: string, file: File) => {
  const formData = new FormData()
  formData.append("logo", file)

  const response = await apiClient.post<{ logoUrl: string }>(`/tools/${id}/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Upload tool screenshots
export const uploadToolScreenshots = async (id: string, files: File[]) => {
  const formData = new FormData()

  files.forEach((file, index) => {
    formData.append(`screenshot-${index}`, file)
  })

  const response = await apiClient.post<{ screenshotUrls: string[] }>(`/tools/${id}/screenshots`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}
