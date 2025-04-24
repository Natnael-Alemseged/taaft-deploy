import { useMutation, useQuery } from "@tanstack/react-query"
import {
  getChatCompletion,
  getChatSuggestions,
  getChatSessions,
  getChatSessionMessages,
  createChatSession,
  type Message,
} from "@/services/chat-service"

// Hook for sending messages to chat API via WebSocket
export function useChatCompletion() {
  return useMutation({
    mutationFn: ({ messages, chatId }: { messages: Message[]; chatId?: string }) => getChatCompletion(messages, chatId),
  })
}

// Hook for getting chat suggestions
export function useChatSuggestions() {
  return useQuery({
    queryKey: ["chat", "suggestions"],
    queryFn: async () => {
      const response = await getChatSuggestions()
      return response.suggestions
    },
  })
}

// Hook for fetching user's chat sessions with pagination
export function useChatSessions(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["chat", "sessions", skip, limit],
    queryFn: () => getChatSessions(skip, limit),
  })
}

// Hook for fetching messages for a specific chat session
export function useChatSessionMessages(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: ["chat", "session", sessionId, "messages"],
    queryFn: () => getChatSessionMessages(sessionId),
    enabled: enabled && !!sessionId,
  })
}

// Hook for creating a new chat session
export function useCreateChatSession() {
  return useMutation({
    mutationFn: (title: string) => createChatSession(title),
  })
}
