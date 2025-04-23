import apiClient from "@/lib/api-client"
import type { Tool, ToolSubmission } from "@/types/tool"

// Get all tools with optional filtering, searching, and pagination
export const getTools = async (params?: {
  category?: string // Maps to 'category' or similar API param (lowercase)
  search?: string // Maps to 'q' API param
  page?: number // Used to calculate 'skip' API param
  limit?: number // Maps to 'limit' API param
}) => {
  // Construct the API query parameters based on the received params
  const apiParams: Record<string, any> = {};

  // Map 'search' parameter to 'q' for the API
  if (params?.search) {
    apiParams.q = params.search;
  }

  // Determine the limit to use
  const limit = params?.limit ?? 12; // Use 12 as default limit if none provided
  apiParams.limit = limit; // Map 'limit' parameter directly

  // Calculate 'skip' from 'page' and the determined limit
  // Default page to 1 if not provided
  const page = params?.page ?? 1;
  apiParams.skip = (page - 1) * limit; // Calculate skip

  // Map 'category' parameter if provided and not "All Categories" (lowercase)
  // Ensure the category value sent matches what your API expects (e.g., slug or name lowercase)
  if (params?.category && params.category !== 'all categories') {
    apiParams.category = params.category; // Assuming API accepts 'category' param
  }

  // Make the API call using the constructed parameters
  // Use "/tools/search" if that's your endpoint, or "/tools" if it accepts these params
  const response = await apiClient.get<{ tools: Tool[]; total: number }>("/tools", {
    params: apiParams // Pass the constructed apiParams object
  });
  console.log("list of tools are in browse:",response.data);

  // This function expects the API to return { tools: Tool[], total: number }
  return response.data;
}

// Get a single tool by ID
export const getToolById = async (id: string) => {
  const response = await apiClient.get<Tool>(`/tools/${id}`);
  return response.data;
};

// Get featured tools
// Example of how it *would* look to send the token client-side
export const getFeaturedTools = async (limit?: number) => {
  // This works client-side but needs alternative for server-side rendering
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Accept": "application/json"
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Add Authorization header if token exists
  }

  // Note: This endpoint structure might differ from /tools or /tools/search
  const response = await apiClient.get<{ tools: Tool[] }>("/tools", { // Assuming /tools endpoint for featured
    params: { limit: limit },
    headers: headers // Include the headers object here
  });
  // console.log(response.data); // Keep or remove console.log as needed
  return response.data;
};

// Get most popular tools
export const getPopularTools = async (limit?: number) => {
  const response = await apiClient.get<{ tools: Tool[] }>("/tools/", { // Assuming /tools endpoint for popular
    params: { limit },
  });

  return response.data;
};


// Submit a new tool
export const submitTool = async (toolData: ToolSubmission) => {
  // Assuming submission requires authentication, add token handling here
  const response = await apiClient.post<Tool>("/tools", toolData);
  return response.data;
};

// Update an existing tool
export const updateTool = async ({ id, ...toolData }: Partial<Tool> & { id: string }) => {
  // Assuming update requires authentication, add token handling here
  const response = await apiClient.put<Tool>(`/tools/${id}`, toolData);
  return response.data;
};

// Delete a tool
export const deleteTool = async (id: string) => {
  // Assuming deletion requires authentication, add token handling here
  const response = await apiClient.delete(`/tools/${id}`);
  return response.data;
};

// Save a tool (add to favorites)
export const saveTool = async (toolId: string) => {
  // Assuming saving requires authentication, add token handling here
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  const response = await apiClient.post<{ message: string }>(`/tools/${toolId}/save`, {}, { headers });
  return response.data;
};

// Unsave a tool (remove from favorites)
export const unsaveTool = async (toolId: string) => {
  // Assuming unsaving requires authentication, add token handling here
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  const response = await apiClient.delete<{ message: string }>(`/tools/${toolId}/save`, { headers });
  return response.data;
};

// Get user's saved tools
export const getSavedTools = async () => {
  // Assuming getting saved tools requires authentication, add token handling here
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  const response = await apiClient.get<{ tools: Tool[] }>("/tools/saved", { headers });
  return response.data;
};

// Upload tool logo
export const uploadToolLogo = async (id: string, file: File) => {
  // Assuming upload requires authentication, add token handling here
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}`, "Content-Type": "multipart/form-data" } : {"Content-Type": "multipart/form-data"};

  const formData = new FormData();
  formData.append("logo", file);

  const response = await apiClient.post<{ logoUrl: string }>(`/tools/${id}/logo`, formData, { headers });

  return response.data;
};

// Upload tool screenshots
export const uploadToolScreenshots = async (id: string, files: File[]) => {
  // Assuming upload requires authentication, add token handling here
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}`, "Content-Type": "multipart/form-data" } : {"Content-Type": "multipart/form-data"};


  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`screenshot-${index}`, file); // Adjust key name if API expects something else
  });

  const response = await apiClient.post<{ screenshotUrls: string[] }>(`/tools/${id}/screenshots`, formData, { headers });

  return response.data;
};