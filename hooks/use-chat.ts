import { useMutation, useQuery } from "@tanstack/react-query"
import { getChatSessions, getChatSessionMessages, createChatSession, sendChatMessage } from "@/services/chat-service"
import type { ChatSession, Message } from "@/services/chat-service" // Import Message type
import { useQueryClient } from "@tanstack/react-query"; // Assuming useQueryClient is imported


// Hook for sending messages to chat API
// export function useChatCompletion() {
//   return useMutation({
//     mutationFn: ({
//                    sessionId,
//                    message,
//                    model = "gpt4",
//                    systemPrompt = "You are a helpful assistant.",
//                    metadata,
//                    isDirectSearch = false, // Added isDirectSearch parameter here
//                  }: {
//       sessionId: string
//       message: string
//       model?: string
//       systemPrompt?: string
//       metadata?: Record<string, any>
//       isDirectSearch?: boolean // Added isDirectSearch to the input type
//     }) => sendChatMessage(sessionId, message, model, systemPrompt, metadata), // <-- Pass isDirectSearch here
//     onError: (error) => {
//       console.error("Failed to send message:", error)
//     },
//   })
// }

export function useChatCompletion() {
  return useMutation({
    mutationFn: ({
      sessionId,
      message,
      model = "gpt4",
      systemPrompt = "You are a helpful assistant.",
      metadata,
      isDirectSearch = false, // still here if needed
      onToken, // 👈 NEW: support streaming updates
    }: {
      sessionId: string
      message: string
      model?: string
      systemPrompt?: string
      metadata?: Record<string, any>
      isDirectSearch?: boolean
      onToken?: (token: string) => void // 👈 NEW: token streaming callback
    }) =>
      sendChatMessage(
        sessionId,
        message,
        model,
        systemPrompt,
        metadata,
        onToken // 👈 pass the streaming handler to the API call
      ),
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
  return useQuery<Message[], Error>({ // Specify the return type as Message[]
    queryKey: ["chat", "session", sessionId, "messages"],
    queryFn: () => getChatSessionMessages(sessionId),
    enabled: enabled && !!sessionId, // Ensure sessionId is truthy and enabled is true
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

// Hook for creating a new chat session
export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createChatSession(title),
    onSuccess: () => {
      // Invalidate chat sessions query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["chat", "sessions"] });
    },
    onError: (error) => {
      console.error("Failed to create chat session:", error);
    }
  });
}
