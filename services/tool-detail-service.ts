// import apiClient from "@/lib/api-client"
// import type { Tool } from "@/types/tool"

// // Get tool by unique ID
// export const getToolByUniqueId = async (uniqueId: string): Promise<Tool> => {
//   try {
//     const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
//     const headers: Record<string, string> = {
//       Accept: "application/json",
//     }
//     if (token) headers["Authorization"] = `Bearer ${token}`

//     console.log(`[getToolByUniqueId] Fetching tool with unique ID: ${uniqueId}`)

//     const response = await apiClient.get<Tool>(`/tools/unique/${uniqueId}`, { headers })
//     console.log(`[getToolByUniqueId] Response status: ${response.status}`)

//     return response.data
//   } catch (error) {
//     console.error(`[getToolByUniqueId] Error fetching tool with unique ID ${uniqueId}:`, error)
//     throw error
//   }
// }

// export const getToolsByAlgoliaId = async (uniqueId: string): Promise<Tool> => {
//   try {
//     const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
//     const headers: Record<string, string> = {
//       Accept: "application/json",
//     }
//     if (token) headers["Authorization"] = `Bearer ${token}`

//     console.log(`[getToolsByAlgoliaId] Fetching tool with Algolia ID: ${uniqueId}`)

//     const response = await apiClient.get<Tool>(`/tools/unique/${uniqueId}`, { headers })
//     console.log(`[getToolsByAlgoliaId] Response status: ${response.status}`)

//     return response.data
//   } catch (error) {
//     console.error(`[getToolsByAlgoliaId] Error fetching tool with Algolia ID ${uniqueId}:`, error)
//     throw error
//   }
// }

// export const getToolByUniqueName = async (name: string): Promise<Tool> => {
//   try {
//     const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
//     const headers: Record<string, string> = {
//       Accept: "application/json",
//     }
//     if (token) headers["Authorization"] = `Bearer ${token}`

//     console.log(`[getToolByUniqueName] Fetching tool with name: ${name}`)

//     const response = await apiClient.get<Tool>(`/tools/unique/${encodeURIComponent(name)}`, { headers })
//     console.log(`[getToolByUniqueName] Response status: ${response.status}`)

//     return response.data
//   } catch (error) {
//     console.error(`[getToolByUniqueName] Error fetching tool with name ${name}:`, error)
//     throw error
//   }
// }