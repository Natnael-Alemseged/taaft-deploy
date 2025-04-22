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
