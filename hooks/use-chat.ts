import { useMutation, useQuery } from "@tanstack/react-query"
import { getChatCompletion, getChatSuggestions, type Message } from "@/services/chat-service"

// Hook for sending messages to chat API
export function useChatCompletion() {
  return useMutation({
    mutationFn: (messages: Message[]) => getChatCompletion(messages),
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
