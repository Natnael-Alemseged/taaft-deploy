import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTools,
  getToolById,
  getFeaturedTools,
  getPopularTools,
  saveTool,
  unsaveTool,
  getSavedTools,
  submitTool,
  updateTool,
  deleteTool,
  uploadToolLogo,
  uploadToolScreenshots,
} from "@/services/tool-service"
import type { Tool, ToolSubmission } from "@/types/tool"

// Hook for fetching tools with optional filtering
export function useTools(params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ["tools", params?.category, params?.search, params?.page, params?.limit],
    queryFn: () => getTools(params),
    // keepPreviousData: true, // Optional: Keeps UI responsive during transition
  })
}

// Hook for fetching a single tool by ID
export function useTool(id: string) {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: () => getToolById(id),
    enabled: !!id, // Only run if id is provided
  })
}

// Hook for fetching featured tools
export function useFeaturedTools(limit?: number) {
  return useQuery({
    queryKey: ["tools", "featured", limit],
    queryFn: () => getFeaturedTools(limit),
  })
}

// Hook for fetching popular tools
export function usePopularTools(limit?: number) {
  return useQuery({
    queryKey: ["tools", "popular", limit],
    queryFn: () => getPopularTools(limit),
  })
}

// Hook for fetching saved tools
export function useSavedTools() {
  return useQuery({
    queryKey: ["tools", "saved"],
    queryFn: () => getSavedTools(),
  })
}

// Hook for saving a tool
export function useSaveTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (toolId: string) => saveTool(toolId),
    onSuccess: (_, toolId) => {
      // Update the tool in the cache
      queryClient.setQueryData(["tool", toolId], (oldData: Tool | undefined) => {
        if (!oldData) return undefined
        return { ...oldData, savedByUser: true }
      })

      // Invalidate saved tools query
      queryClient.invalidateQueries({ queryKey: ["tools", "saved"] })
    },
  })
}

// Hook for unsaving a tool
export function useUnsaveTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (toolId: string) => unsaveTool(toolId),
    onSuccess: (_, toolId) => {
      // Update the tool in the cache
      queryClient.setQueryData(["tool", toolId], (oldData: Tool | undefined) => {
        if (!oldData) return undefined
        return { ...oldData, savedByUser: false }
      })

      // Invalidate saved tools query
      queryClient.invalidateQueries({ queryKey: ["tools", "saved"] })
    },
  })
}

// Hook for submitting a new tool
export function useSubmitTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (toolData: ToolSubmission) => submitTool(toolData),
    onSuccess: () => {
      // Invalidate tools list query to refetch
      queryClient.invalidateQueries({ queryKey: ["tools"] })
    },
  })
}

// Hook for updating a tool
export function useUpdateTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Tool> & { id: string }) => updateTool(data),
    onSuccess: (updatedTool) => {
      // Update the tool in the cache
      queryClient.setQueryData(["tool", updatedTool.id], updatedTool)
      // Invalidate tools list query
      queryClient.invalidateQueries({ queryKey: ["tools"] })
    },
  })
}

// Hook for deleting a tool
export function useDeleteTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTool(id),
    onSuccess: (_, id) => {
      // Remove the tool from the cache
      queryClient.removeQueries({ queryKey: ["tool", id] })
      // Invalidate tools list query
      queryClient.invalidateQueries({ queryKey: ["tools"] })
    },
  })
}

// Hook for uploading a tool logo
export function useUploadToolLogo(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadToolLogo(id, file),
    onSuccess: (data) => {
      // Update the tool in the cache with the new logo URL
      queryClient.setQueryData(["tool", id], (oldData: Tool | undefined) => {
        if (!oldData) return undefined
        return { ...oldData, logoUrl: data.logoUrl }
      })
    },
  })
}

// Hook for uploading tool screenshots
export function useUploadToolScreenshots(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: File[]) => uploadToolScreenshots(id, files),
    onSuccess: (data) => {
      // Update the tool in the cache with the new screenshot URLs
      queryClient.setQueryData(["tool", id], (oldData: Tool | undefined) => {
        if (!oldData) return undefined
        return { ...oldData, screenshotUrls: data.screenshotUrls }
      })
    },
  })
}
