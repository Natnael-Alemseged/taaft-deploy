import apiClient from "@/lib/api-client"
import { getUserIdFromLocalStorage } from "@/lib/session"

export interface Message {
  role: "user" | "assistant"
  content: string
  id?: string
  timestamp?: Date
}

export interface ChatSession {
  _id: string
  title: string
  user_id: string
  model: string
  system_prompt: string
  created_at: string
  updated_at: string
  message_count: number
  is_active: boolean
  metadata: any
}

export interface ChatCompletionResponse {
  message: string
  chat_id: string
  message_id: string
  timestamp: string
  model: string
  metadata?: any
  tool_recommendations?: any[]
}

// Get user's chat sessions with pagination parameters
export const getChatSessions = async (skip = 0, limit = 20): Promise<ChatSession[]> => {
  try {
    const userId = getUserIdFromLocalStorage()
    if (!userId) {
      console.error("User ID not found in localStorage")
      return []
    }

    console.log(`Fetching chat sessions for user ${userId}, skip=${skip}, limit=${limit}`)
    const response = await apiClient.get<ChatSession[]>("/api/chat/sessions", {
      params: { user_id: userId, skip, limit },
    })

    console.log(`Retrieved ${response.data.length} chat sessions`)
    return response.data || []
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return []
  }
}

// Get messages for a specific chat session
export const getChatSessionMessages = async (sessionId: string): Promise<Message[]> => {
  try {
  console.log(`Fetching messages for session ${sessionId}`)
    const response = await apiClient.get<any[]>(`/api/chat/sessions/${sessionId}/messages`)


    // Transform the API response to our Message format
    const messages: Message[] = response.data.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
      id: msg._id,
      timestamp: new Date(msg.timestamp),
    }))

    console.log(`Retrieved ${messages.length} messages for session ${sessionId}`)
    return messages
  } catch (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error)
    return []
  }
}

// Create a new chat session
export const createChatSession = async (title: string): Promise<ChatSession> => {
  try {
    const userId = getUserIdFromLocalStorage()
    if (!userId) {
      throw new Error("User ID not found in localStorage")
    }

    console.log(`Creating new chat session with title "${title}" for user ${userId}`)
    const response = await apiClient.post<ChatSession>("/api/chat/sessions", {
      title: title || "New Chat",
      user_id: userId,
    })

    console.log(`Created new chat session with ID ${response.data._id}`)
    return response.data
  } catch (error) {
    console.error("Failed to create chat session:", error)
    throw error
  }
}

// Send a message to a specific chat session
export const sendChatMessage = async (
  sessionId: string,
  message: string,
  model = "gpt4",
  systemPrompt = "You are a helpful assistant.",
  metadata?: Record<string, any>,
): Promise<{ message: Message; toolRecommendations?: any[] }> => {
  try {
    console.log(`Sending message to session ${sessionId} with model ${model}`)

    // Create the request payload
    const payload = {
      message,
      model,
      system_prompt: systemPrompt,
      ...(metadata && { metadata }),
    }

    // Make the API request
    const response = await apiClient.post<ChatCompletionResponse>(`/api/chat/sessions/${sessionId}/messages`, payload)

    console.log(`Response received for session ${sessionId}`)

    return {
      message: {
        role: "assistant",
        content: response.data.message,
        id: response.data.message_id,
        timestamp: new Date(response.data.timestamp),
      },
      toolRecommendations: response.data.tool_recommendations,
    }
  } catch (error: any) {
    console.error(`Error sending message to session ${sessionId}:`, error)

    // Log more detailed error information
    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Error message:", error.message)
    }

    throw error
  }
}
