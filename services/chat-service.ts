import apiClient from "@/lib/api-client"
import { getUserIdFromLocalStorage } from "@/lib/session"

export interface Message {
    role: "user" | "assistant"
    content: string
    id?: string
    timestamp?: Date
    // Add hasSearchResults and formattedData if they are part of the Message type
    hasSearchResults?: boolean;
    formattedData?: any;
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
    // Include formatted_data if the API returns it directly in the completion response
    data?: {
        formatted_data?: any;
        // Add other potential data fields here
    };
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
            // Assuming hasSearchResults and formattedData might come in the message metadata or similar
            // You might need to adjust this mapping based on your actual API response structure for messages
            hasSearchResults: msg.metadata?.hasSearchResults || false,
            formattedData: msg.metadata?.formattedData || undefined,
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

// Send message to chat API
export const sendChatMessage = async (
    sessionId: string,
    message: string,
    model = "gpt4",
    systemPrompt = "You are a helpful assistant.",
    metadata?: Record<string, any>,
    // Added isDirectSearch parameter
    isDirectSearch: boolean = false, // Ensure default is false
): Promise<{ message: Message; toolRecommendations?: string[]; data?: any }> => {
    try {
        console.log(`Sending message to session ${sessionId} with model ${model}, isDirectSearch: ${isDirectSearch}`)

        // Create the request payload
        const payload = {
            message,
            model,
            system_prompt: systemPrompt,
            isDirectSearch, // Include isDirectSearch directly in the payload
            metadata, // Include metadata object
        }

        console.log("Payload I send to the backend is:\n", JSON.stringify(payload, null, 2))


        // Make the API request
        const response = await apiClient.post<ChatCompletionResponse>(`/api/chat/sessions/${sessionId}/messages`, payload)

        console.log(`Response received for session ${sessionId}`)

        const rawResponseMessage = response.data.message

        console.log("Response data only:\n", JSON.stringify(response.data, null, 2))


        // Extract options if present
        let options: string[] = []
        const optionsPattern = "options ="
        const optionsIndex = rawResponseMessage.indexOf(optionsPattern)

        if (optionsIndex !== -1) {
            // Extract the part after "options ="
            const optionsStringRaw = rawResponseMessage.substring(optionsIndex + optionsPattern.length)

            // Trim whitespace from both ends first
            let cleanedOptionsString = optionsStringRaw.trim()

            // Now remove the leading '[' and trailing ']' if they exist
            cleanedOptionsString = cleanedOptionsString.replace(/^\[|\]$/g, "").trim()

            // Split by comma, trim, and remove quotes from each option
            options = cleanedOptionsString
                .split(",")
                .map((option) => option.trim().replace(/'/g, "").replace(/"/g, ""))
                .filter((option) => option.length > 0) // Filter out any empty strings
        }

        // Clean the message content (remove "options = ..." part)
        const cleanedMessage =
            optionsIndex !== -1 ? rawResponseMessage.substring(0, optionsIndex).trim() : rawResponseMessage.trim()

        // Map the API response message structure to the frontend Message structure
        const frontendMessage: Message = {
            role: "assistant", // Assuming the response message is always from assistant
            content: cleanedMessage,
            id: response.data.message_id,
            timestamp: new Date(response.data.timestamp),
            // Map hasSearchResults and formattedData from response.data if available
            hasSearchResults: response.data.data?.formatted_data ? true : false,
            formattedData: response.data.data?.formatted_data,
        };


        return {
            message: frontendMessage,
            toolRecommendations: options.length > 0 ? options : undefined,
            data: response.data, // Include the entire response data
        }
    } catch (error: any) {
        console.error(`Error sending message to session ${sessionId}:`, error)

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
