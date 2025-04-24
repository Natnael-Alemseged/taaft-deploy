import apiClient from "@/lib/api-client"
import websocketService from "./websocket-service"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: Message[]
}

export interface ChatCompletionRequest {
  messages: Message[]
}

export interface ChatCompletionResponse {
  message: Message
}

// Get chat completion (for AI assistant) using WebSocket or REST API fallback
export const getChatCompletion = async (messages: Message[], chatId?: string): Promise<ChatCompletionResponse> => {
  // Check if we should use the fallback mode
  if (websocketService.isFallbackMode()) {
    return getChatCompletionFallback(messages, chatId)
  }

  return new Promise((resolve, reject) => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user")
    const accessToken = localStorage.getItem("access_token")

    if (!userDataStr || !accessToken) {
      reject(new Error("User not authenticated"))
      return
    }

    const userData = JSON.parse(userDataStr)
    const userId = userData.id

    // Generate a new chat ID if not provided
    const currentChatId = chatId || `chat_${Date.now()}`

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()

    if (!lastUserMessage) {
      reject(new Error("No user message found"))
      return
    }

    // Set up listener for chat response
    const messageHandler = (data: any) => {
      if (data.type === "chat_response" && data.chat_id === currentChatId) {
        // Complete message received
        websocketService.off("chat_response", messageHandler)
        websocketService.off("failed", failureHandler)

        resolve({
          message: {
            role: "assistant",
            content: data.content,
          },
        })
      } else if (data.type === "chat_response_chunk" && data.chat_id === currentChatId) {
        // Handle streaming chunks if needed
        // This would be used for real-time updates to the UI
      }
    }

    // Set up a listener for WebSocket failures
    const failureHandler = () => {
      websocketService.off("chat_response", messageHandler)
      websocketService.off("failed", failureHandler)

      // Fall back to REST API
      getChatCompletionFallback(messages, chatId).then(resolve).catch(reject)
    }

    websocketService.on("chat_response", messageHandler)
    websocketService.on("failed", failureHandler)

    // Ensure WebSocket is connected
    websocketService
      .connect()
      .then(() => {
        // If we've switched to fallback mode during connection, use the fallback
        if (websocketService.isFallbackMode()) {
          websocketService.off("chat_response", messageHandler)
          websocketService.off("failed", failureHandler)

          return getChatCompletionFallback(messages, chatId).then(resolve).catch(reject)
        }

        // Authenticate user if needed
        return websocketService.authenticateUser(userId, accessToken)
      })
      .then(() => {
        // If we've switched to fallback mode during authentication, use the fallback
        if (websocketService.isFallbackMode()) {
          websocketService.off("chat_response", messageHandler)
          websocketService.off("failed", failureHandler)

          return getChatCompletionFallback(messages, chatId).then(resolve).catch(reject)
        }

        // Send chat message
        return websocketService.sendChatMessage(
          currentChatId,
          userId,
          lastUserMessage.content,
          "gpt-3.5-turbo", // Default model, could be made configurable
          accessToken,
        )
      })
      .catch((error) => {
        console.error("Error in WebSocket chat completion:", error)
        websocketService.off("chat_response", messageHandler)
        websocketService.off("failed", failureHandler)

        // Fall back to REST API
        getChatCompletionFallback(messages, chatId).then(resolve).catch(reject)
      })
  })
}

// Fallback to REST API if WebSocket fails
export const getChatCompletionFallback = async (messages: Message[], chatId?: string) => {
  console.log("Using REST API fallback for chat completion")

  // Get user data from localStorage
  const userDataStr = localStorage.getItem("user")
  const accessToken = localStorage.getItem("access_token")

  if (!userDataStr || !accessToken) {
    throw new Error("User not authenticated")
  }

  const userData = JSON.parse(userDataStr)
  const userId = userData.id

  // Prepare the request body
  const requestBody: any = {
    messages: messages,
    user_id: userId,
  }

  // Add chat ID if provided
  if (chatId) {
    requestBody.chat_id = chatId
  }

  // Make the API request
  const response = await apiClient.post<ChatCompletionResponse>("/api/chat/completion", requestBody)
  return response.data
}

// Get chat suggestions
export const getChatSuggestions = async () => {
  try {
    const response = await apiClient.get<{ suggestions: string[] }>("/api/chat/suggestions")
    return response.data
  } catch (error) {
    console.error("Error fetching chat suggestions:", error)
    // Return default suggestions if API call fails
    return {
      suggestions: [
        "How is AI affecting my business?",
        "Want only tools with a free plan?",
        "Looking for video-focused tools?",
        "Show me e-commerce AI tools",
      ],
    }
  }
}

// Get user's chat sessions with pagination parameters
export const getChatSessions = async (skip = 0, limit = 20): Promise<ChatSession[]> => {
  try {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user")
    if (!userDataStr) {
      console.error("User data not found in localStorage")
      return []
    }

    const userData = JSON.parse(userDataStr)
    const userId = userData.id

    // Make the API request with the required parameters
    const response = await apiClient.get<{ sessions: ChatSession[] }>("/api/chat/sessions", {
      params: {
        user_id: userId,
        skip,
        limit,
      },
    })

    return response.data.sessions
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return []
  }
}

// Get messages for a specific chat session
export const getChatSessionMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user")
    if (!userDataStr) {
      console.error("User data not found in localStorage")
      return []
    }

    const userData = JSON.parse(userDataStr)
    const userId = userData.id

    const response = await apiClient.get<{ messages: Message[] }>(`/api/chat/sessions/${sessionId}/messages`, {
      params: {
        user_id: userId,
      },
    })
    return response.data.messages
  } catch (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error)
    return []
  }
}

// Create a new chat session
export const createChatSession = async (title: string): Promise<ChatSession> => {
  // Get user data from localStorage
  const userDataStr = localStorage.getItem("user")

  if (!userDataStr) {
    throw new Error("User data not found in localStorage")
  }

  const userData = JSON.parse(userDataStr)
  const userId = userData.id

  const response = await apiClient.post<ChatSession>("/api/chat/sessions", {
    title,
    user_id: userId,
  })

  return response.data
}
