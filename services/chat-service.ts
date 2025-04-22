import apiClient from "@/lib/api-client"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ChatCompletionRequest {
  messages: Message[]
}

export interface ChatCompletionResponse {
  message: Message
}

// Get chat completion (for AI assistant)
export const getChatCompletion = async (messages: Message[]) => {
  const response = await apiClient.post<ChatCompletionResponse>("/chat/completion", { messages })
  return response.data
}

// Get chat suggestions
export const getChatSuggestions = async () => {
  const response = await apiClient.get<{ suggestions: string[] }>("/chat/suggestions")
  return response.data
}
