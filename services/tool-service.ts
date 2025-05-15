import apiClient from "@/lib/api-client"
import type { Tool, ToolSubmission } from "@/types/tool"


export const getTools = async (params?: {
  category?: string;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}): Promise<{ tools: Tool[]; total: number }> => {
  try {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let endpoint =
        // "/tools/";
        params?.isPublic ? "/public/tools" : "/tools";
    const apiParams: Record<string, any> = {
      limit: params?.limit ?? 12,
      skip: params?.search ? 0 : ((params?.page ?? 1) - 1) * (params?.limit ?? 12),
      sort_by: params?.sort_by ?? "created_at",
      sort_order: params?.sort_order ?? "desc",
      // isPublic: params?.isPublic ?? true, // Default to `true`
    };

    // Handle category-specific endpoint
    if (params?.category && params.category !== "all-categories") {
      endpoint = `/tools/category/${params.category}`;
    } else if (params?.featured) {
      endpoint = params.search
          ? "/public/tools/featured/search"
          : "/public/tools/featured";
      if (params.search) {
        apiParams.q = params.search;
      }
    } else if (params?.search && !params?.featured && !params?.category) {
      endpoint = "/tools/search";
      apiParams.q = params.search;
    }

    // Ensure the correct endpoint for private tools
    if (!params?.isPublic && endpoint === "/public/tools") {
      endpoint = "/tools/";
    }

    console.log(`Final endpoint: ${endpoint}`);
    console.log("apiParams:", JSON.stringify(apiParams, null, 2));

    const response = await apiClient.get<{ tools: Tool[]; total: number }>(
        endpoint,
        {
          params: apiParams,
          headers,
        }
    );

    console.log(`Fetched tools from ${endpoint}:`, JSON.stringify(response.data, null, 2));
    return response.data;

  } catch (error) {
    console.error("Error fetching tools:", error);
    return { tools: [], total: 0 };
  }
};

///fetch saved tools




// In your service file
export const getToolByUniqueId = async (unique_id: string): Promise<{ status: number; data?: Tool }> => {
  try {
    // Handle server-side case where localStorage isn't available
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("access_token");
    }

    const headers: Record<string, string> = { 
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    console.log("unique_id for the request is", unique_id);

    const response = await apiClient.get<Tool>(`/tools/unique/${unique_id}`, { 
      headers,
      // Important for SSR to include credentials if needed
      withCredentials: true
    });

    console.log("getToolByUniqueId response", JSON.stringify(response.data, null, 2));

    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(`Error fetching tool with unique ID ${unique_id}:`, error);
    // Return more detailed error information
    return { 
      status: error.response?.status || 500,
      ...(error.response?.data ? { data: error.response.data } : {})
    };
  }
}
  
  export const getToolById = async (id: string): Promise<{ status: number; data?: Tool }> => {
   try {
   const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
   const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" };
  
   const response = await apiClient.get<Tool>(`/tools/${id}`, { headers });
  
   return { status: response.status, data: response.data };
  
   } catch (error: any) {
    console.error(`Error fetching tool with ID ${id}:`, error);
    return { status: error.response?.status || 500 };
   }
  }

// Get featured tools - No static data fallback, only return what API provides
export const getFeaturedTools = async (limit?: number) => {
  try {
    // This works client-side but needs alternative for server-side rendering
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    let endpoint = "/public/tools/featured"

    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}` // Add Authorization header if token exists
      console.log("token", token);
      endpoint = "/tools/"
    }

    // Make API call to get featured tools
    const response = await apiClient.get<{ tools: Tool[] }>(endpoint, {
      params: { limit: limit, featured: true },
      headers: headers,
    })

    console.log("getFeaturedTools response", JSON.stringify(response.data, null, 2));

    // Return exactly what the API returns, no static fallback
    return response.data
  } catch (error) {
    console.error("Error fetching featured tools:", error)

    // Return empty array instead of mock data to ensure no static data is displayed
    return { tools: [] }
  }
}

// Get most popular tools
export const getPopularTools = async (limit?: number) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    let endpoint = "/public/tools/sponsored"
    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}` // Add Authorization header if token exists
      console.log("token", token);
      //todo change to private endpoint
      endpoint = "/public/tools/sponsored"
    }

    const response = await apiClient.get<{ tools: Tool[] }>(endpoint, {
      params: { limit, sort: "popular" },
      headers,
    })
console.log("getPopularTools response", JSON.stringify(response.data, null, 2));
    return response.data
  } catch (error) {
    console.error("Error fetching popular tools:", error)

    // Return mock popular tools (using the first few tools from our mock data)
    // const mockTools = getMockTools({ limit }).tools
    return { tools: [] }
  }
}

// Submit a new tool
export const submitTool = async (toolData: ToolSubmission) => {
  // Assuming submission requires authentication, add token handling here
  const response = await apiClient.post<Tool>("/tools", toolData)
  return response.data
}

// Update an existing tool
export const updateTool = async ({ id, ...toolData }: Partial<Tool> & { id: string }) => {
  // Assuming update requires authentication, add token handling here
  const response = await apiClient.put<Tool>(`/tools/${id}`, toolData)
  return response.data
}

// Delete a tool
export const deleteTool = async (id: string) => {
  // Assuming deletion requires authentication, add token handling here
  const response = await apiClient.delete(`/tools/${id}`)
  return response.data
}

// Save a tool (add to favorites)
export const saveTool = async (toolId: string) => {
  // Assuming saving requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const body = {
    "tool_unique_id": toolId,
  }
  const response = await apiClient.post<{ message: string }>(`/favorites`, body, { headers })
  console.log("saveTool response", JSON.stringify(response.data, null, 2));
  return response.data
}

// Unsave a tool (remove from favorites)
export const unsaveTool = async (toolId: string) => {
  // Assuming unsaving requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await apiClient.delete<{ message: string }>(`/favorites/${toolId}`, { headers })
  console.log("unsaveTool response", JSON.stringify(response.data, null, 2));
  return response.data
}

// Get user's saved tools
export const getSavedTools = async (): Promise<T> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      throw new Error("Authentication required to get saved tools");
    }

    const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
    const response = await apiClient.get<{ tools: Tool[] }>("/favorites/tools", { headers });
    console.log(`get saved tools response ${JSON.stringify(response.data, null, 2)}`);

    if (!response.data) {
      console.warn("Unexpected response structure. Returning empty tools array.");
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching saved tools:", error);
    return [];
  }
};


// Upload tool logo
export const uploadToolLogo = async (id: string, file: File) => {
  // Assuming upload requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    : { "Content-Type": "multipart/form-data" }

  const formData = new FormData()
  formData.append("logo", file)

  const response = await apiClient.post<{ logoUrl: string }>(`/tools/${id}/logo`, formData, { headers })

  return response.data
}

// Upload tool screenshots
export const uploadToolScreenshots = async (id: string, files: File[]) => {
  // Assuming upload requires authentication, add token handling here
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    : { "Content-Type": "multipart/form-data" }

  const formData = new FormData()

  files.forEach((file, index) => {
    formData.append(`screenshot-${index}`, file) // Adjust key name if API expects something else
  })

  const response = await apiClient.post<{ screenshotUrls: string[] }>(`/tools/${id}/screenshots`, formData, { headers })

  return response.data
}
