import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTools,
  getToolById,
  getToolByUniqueId,
  getFeaturedTools,
  getPopularTools,
  saveTool,
  unsaveTool,
  getSavedTools,
  submitTool,
  updateTool,
  deleteTool,
  uploadToolLogo,
  uploadToolScreenshots, getDetailByCarrier, getToolsFromTask,
} from "@/services/tool-service"
import type { Tool, ToolSubmission } from "@/types/tool"

// Hook for fetching tools with optional filtering

export function useTools(
    params?: {
      isPublic?: boolean
      category?: string
      search?: string
      page?: number
      limit?: number
      featured?: boolean
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { enabled?: boolean } // Accept extra options
) {
  console.log(`isPublic value is: ${params?.isPublic}`);

  return useQuery({
    queryKey: ["tools", params?.category, params?.isPublic, params?.search, params?.page, params?.limit, params?.featured, params?.sort_by, params?.sort_order],
    queryFn: () => getTools(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true, // default to true
  });
}


export function useTool(identifier: string) {
  return useQuery<Tool, Error>({ // The first generic is the shape of the SUCCESS data
    queryKey: ["tool", identifier],
    queryFn: async () => {
      // Call your existing service function
      const response = await getToolByUniqueId(identifier);

      // Check the status from the response object
      if (response.status >= 200 && response.status < 300) {
        // If the status is successful (2xx), return the actual data part
        if (response.data) {
          return response.data; // This is the data that useQuery will provide as 'tool'
        } else {
          // Handle case where status is 2xx but data is null/undefined unexpectedly
          throw new Error("Successful response returned no data");
        }
      } else {
        // If the status indicates an error (e.g., 404, 500), throw an error
        // React Query will catch this and set isError to true
        // You can include more details in the error if needed
        throw new Error(`Failed to fetch tool: Status ${response.status}`);
        // Optionally include error data from response.data in the thrown error
        // throw new Error(`Failed to fetch tool: Status ${response.status}, Details: ${JSON.stringify(response.data)}`);
      }
    },
    enabled: !!identifier, // Only run the query if identifier is truthy
  });
}
// export function useTool(identifier: string) {
//   return useQuery<Tool, Error>({
//     queryKey: ["tool", identifier],
//     queryFn: () => getToolByUniqueId(identifier),
//     enabled: !!identifier,
//   });
// }


// Hook for fetching featured tools
export function useFeaturedTools(limit?: number) {
  return useQuery({
    queryKey: ["tools", "featured", limit],
    queryFn: () => getFeaturedTools(limit),
    staleTime: 0,
    refetchOnMount: true,
  })

}

// Hook for fetching popular tools
export function usePopularTools(limit?: number) {
  return useQuery({
    queryKey: ["tools", "popular", limit],
    queryFn: () => getPopularTools(limit),
  })
}

// Hook for fetching popular tools
export function useCarriers(carrier?: string) {
  return useQuery({
    queryKey: ["tools", "carriers", carrier],
    queryFn: () => getDetailByCarrier(carrier),
  })
}

export function useTaskTools(task?: string) {
  return useQuery({
    queryKey: ["tools", "Tasks", task],
    queryFn: () => getToolsFromTask(task),
  })
}

// Hook for fetching saved tools
export function useSavedTools() {
  return useQuery({
    queryKey: ["savedTools"],
    queryFn: getSavedTools,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
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
