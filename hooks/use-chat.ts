import { useMutation, useQuery } from "@tanstack/react-query"
import { getChatSessions, getChatSessionMessages, createChatSession, sendChatMessage } from "@/services/chat-service"
import type { ChatSession } from "@/services/chat-service"

// Hook for sending messages to chat API
export function useChatCompletion() {
  return useMutation({
    mutationFn: ({
      sessionId,
      message,
      model = "gpt4",
      systemPrompt = "You are a helpful assistant.",
      metadata,
    }: {
      sessionId: string
      message: string
      model?: string
      systemPrompt?: string
      metadata?: Record<string, any>
    }) => sendChatMessage(sessionId, message, model, systemPrompt, metadata),
    onError: (error) => {
      console.error("Failed to send message:", error)
    },
  })
}

// Hook for fetching user's chat sessions with pagination
export function useChatSessions(skip = 0, limit = 20) {
  return useQuery<ChatSession[], Error>({
    queryKey: ["chat", "sessions", skip, limit],
    queryFn: () => getChatSessions(skip, limit),
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

// Hook for fetching messages for a specific chat session
export function useChatSessionMessages(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: ["chat", "session", sessionId, "messages"],
    queryFn: () => getChatSessionMessages(sessionId),
    enabled: enabled && !!sessionId,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

// Hook for creating a new chat session
export function useCreateChatSession() {
  return useMutation({
    mutationFn: (title: string) => createChatSession(title),
  })
}
