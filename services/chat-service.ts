// services/chat-service.ts
import apiClient from "@/lib/api-client"
import { getUserIdFromLocalStorage } from "@/lib/session" // Assuming this utility exists

// Define the structure for a chat message
export interface Message {
    role: "user" | "assistant"
    content: string
    id?: string
    timestamp?: Date
    // These might be used for LLM responses that trigger a search popup
    hasSearchResults?: boolean; // Flag to indicate this message contains search results for the popup
    formattedData?: any; // Data structure for the search results popup
    // Note: Direct search results are now handled by navigating to the search page,
    // so we don't store searchResults directly in the Message type for that case.
}

// Define the structure for a chat session
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

// Define the structure for the chat completion response (from LLM)
export interface ChatCompletionResponse {
    // Note: The message field in the API response seems to be a string,
    // but we map it to our frontend Message interface in sendChatMessage.
    message: string // Raw string content from the API
    chat_id: string
    message_id: string
    timestamp: string
    model: string
    metadata?: any
    tool_recommendations?: string[] // Assuming recommendations are strings
    // Include data if the API returns it directly in the completion response
    data?: {
        formatted_data?: any; // This seems to be used for the popup, might need adjustment
        // Add other potential data fields here
    };
}

// Define the expected structure of a single tool result from keyword search
export interface ToolSearchResult {
    id: string;
    price: string; // Added based on Swagger
    name: string;
    description: string;
    link: string; // Added based on Swagger
    unique_id: string; // Added based on Swagger
    rating: string; // Added based on Swagger
    saved_numbers: number; // Added based on Swagger
    category: string; // Added based on Swagger
    features: string[]; // Added based on Swagger
    is_featured: boolean; // Added based on Swagger
    saved_by_user: boolean; // Added based on Swagger
    keywords: string[]; // Added based on Swagger
    created_at: string; // Added based on Swagger
    updated_at: string; // Added based on Swagger
    // Add other relevant tool properties returned by the API
    // e.g., category, pricing, website, slug, etc.
    // category?: string; // Already added above
    // pricing?: string; // Already added above
    website?: string; // Assuming 'link' is the website link, but added website based on previous context
    slug?: string; // Added based on previous context
    // Add savedByUser if your API includes this or you merge it later
    // savedByUser?: boolean; // Already added above
}

// Define the expected structure of the keyword search API response
export interface KeywordSearchResponse {
    // Corrected: Use 'tools' array name as per Swagger
    tools: ToolSearchResult[]; // Array of tool results
    total: number; // Total number of results
    skip: number; // Added based on Swagger
    limit: number; // Added based on Swagger
    // Add other pagination/metadata fields if present in API response
}


// Get user's chat sessions with pagination parameters
export const getChatSessions = async (skip = 0, limit = 20): Promise<ChatSession[]> => {
    try {
        const userId = getUserIdFromLocalStorage()
        if (!userId) {
            console.error("User ID not found in localStorage")
            // Handle unauthenticated state appropriately, maybe redirect to login
            // For now, return empty array
            return []
        }

        console.log(`Fetching chat sessions for user ${userId}, skip=${skip}, limit=${limit}`)
        // Assuming your API endpoint is /api/chat/sessions and requires user_id as a query param
        const response = await apiClient.get<ChatSession[]>("/api/chat/sessions", {
            params: { user_id: userId, skip, limit },
        })

        console.log(`Retrieved ${response.data.length} chat sessions`)
        return response.data || []
    } catch (error) {
        console.error("Error fetching chat sessions:", error)
        // Depending on error type (e.g., 401 Unauthorized), you might need to handle token refresh or logout
        throw error; // Re-throw the error for the calling component to handle
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
            console.error("User ID not found in localStorage")
            // Handle unauthenticated state appropriately
            throw new Error("User not authenticated");
        }
        console.log(`Creating new chat session with title: "${title}" for user ${userId}`)
        // Assuming your API endpoint is /api/chat/sessions and expects title and user_id
        const response = await apiClient.post<ChatSession>("/api/chat/sessions", {
            title: title || "New Chat", // Use default title if empty
            user_id: userId,
            // Include other default session parameters if required by your API
            // model: "gpt4", // Example default model
            // system_prompt: "You are a helpful assistant.", // Example default prompt
        })

        console.log("New chat session created:", response.data._id)
        return response.data
    } catch (error) {
        console.error("Error creating chat session:", error)
        // Depending on error type (e.g., 401 Unauthorized), you might need to handle token refresh or logout
        throw error; // Re-throw the error for the calling component to handle
    }
}

// Send a message to an existing chat session (LLM completion)
// This function handles the LLM interaction
// Send a message to an existing chat session (LLM completion)
// This function handles the LLM interaction



// export const sendChatMessage = async (
//     sessionId: string,
//     message: string,
//     model = "gpt4",
//     systemPrompt = "You are a helpful assistant.",
//     metadata?: Record<string, any>,
// ): Promise<{ message: Message; toolRecommendations?: string[]; data?: any }> => {
//     try {
//         console.log(`Sending message to session ${sessionId} with model ${model}`)

//         // Create the request payload
//         const payload = {
//             message,
//             model,
//             system_prompt: systemPrompt,
//             ...(metadata && { metadata }),
//         }

//         // Make the API request
//         const response = await apiClient.post<ChatCompletionResponse>(`/api/chat/sessions/${sessionId}/messages/stream`, payload)

//         console.log(`Response received for session ${sessionId}`)

//         const rawResponseMessage = response.data.message

//         console.log("response api is:" + rawResponseMessage)

//         // Extract options if present
//         let options: string[] = []
//         const optionsPattern = "options ="
//         const optionsIndex = rawResponseMessage.indexOf(optionsPattern)

//         if (optionsIndex !== -1) {
//             // Extract the part after "options ="
//             const optionsStringRaw = rawResponseMessage.substring(optionsIndex + optionsPattern.length)

// // Trim whitespace from both ends first
// let cleanedOptionsString = optionsStringRaw.trim()

// // Now remove the leading '[' and trailing ']' if they exist
// cleanedOptionsString = cleanedOptionsString.replace(/^\[|\]$/g, "").trim()

// // Split by comma, trim, and remove quotes from each option
// options = cleanedOptionsString
//     .split(",")
//     .map((option) => option.trim().replace(/'/g, "").replace(/"/g, ""))
//     .filter((option) => option.length > 0) // Filter out any empty strings
// }

// // Clean the message content (remove "options = ..." part)
// const cleanedMessage =
//     optionsIndex !== -1 ? rawResponseMessage.substring(0, optionsIndex).trim() : rawResponseMessage.trim()

// return {
//     message: {
//         role: "assistant",
//         content: cleanedMessage,
//         id: response.data.message_id,
//         timestamp: new Date(response.data.timestamp),
//     },
//     toolRecommendations: options.length > 0 ? options : undefined,
//     data: response.data, // Include the entire response data
// }
// } catch (error: any) {
//     console.error(`Error sending message to session ${sessionId}:`, error)

//     if (error.response) {
//         console.error("Error response data:", error.response.data)
//         console.error("Error response status:", error.response.status)
//     } else if (error.request) {
//         console.error("No response received:", error.request)
//     } else {
//         console.error("Error message:", error.message)
//     }

//     throw error
// }
// }

import { Message } from "./types"; // Assuming Message type is defined elsewhere

// Define the Message type if not already
interface Message {
  role: "user" | "assistant";
  content: string;
  id?: string; // Optional ID
  timestamp?: Date; // Optional timestamp
  hasSearchResults?: boolean; // Add this property based on UI usage
  formattedData?: any; // Add this property based on UI usage
}


export const sendChatMessage = async (
    sessionId: string,
    message: string,
    model = "gpt4",
    systemPrompt = "You are a helpful assistant.",
    metadata?: Record<string, any>,
    onToken?: (token: string) => void // Stream each token
): Promise<{ message: Message; toolRecommendations?: string[]; data?: any }> => {
    try {
        console.log(`Sending message to session ${sessionId} with model ${model}`)

        // Correction: Content-Type for the request body is application/json
        console.log('message body to stream is:'+JSON.stringify({
            message,
            model,
            system_prompt: systemPrompt,
            ...(metadata && { metadata }),
        }));

        const response = await fetch(`/api/chat/sessions/${sessionId}/messages/stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Corrected: Body is JSON
                // If your server *requires* it, you might add Accept: "text/event-stream"
            },
            body: JSON.stringify({
                message,
                model,
                system_prompt: systemPrompt,
                ...(metadata && { metadata }),
            }),
        });

        if (!response.body) throw new Error("No response body for streaming");

        // Use pipeThrough(new TextDecoderStream()) which handles the decoding
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        let rawMessageContent = ""; // Accumulate the raw content for final processing

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // value is already a string chunk thanks to TextDecoderStream
            const chunk = value; // Corrected: Use the value directly
            rawMessageContent += chunk;

            if (onToken) onToken(chunk); // Pass the chunk to the UI handler
        }

        console.log("Streaming complete. Full raw response:", rawMessageContent);

        // Extract tool recommendations (same logic, applied to the full raw content)
        let options: string[] = [];
        const optionsPattern = "options =";
        const optionsIndex = rawMessageContent.indexOf(optionsPattern);

        if (optionsIndex !== -1) {
            let optionsStringRaw = rawMessageContent.substring(optionsIndex + optionsPattern.length).trim();
            optionsStringRaw = optionsStringRaw.replace(/^\[|\]$/g, "").trim();

            options = optionsStringRaw
                .split(",")
                .map((option) => option.trim().replace(/['"]/g, ""))
                .filter((option) => option.length > 0);
        }

        // Clean the message content by removing the options part if present
        const cleanedMessage =
            optionsIndex !== -1 ? rawMessageContent.substring(0, optionsIndex).trim() : rawMessageContent.trim();

        // Construct the final message object
        const finalMessage: Message = {
            role: "assistant",
            content: cleanedMessage,
            timestamp: new Date(),
            id: `${Date.now()}-${Math.random()}`, // Generate a unique ID for the final message
            // Note: If your API returns a final message structure with an ID, use that instead
        };


        // Assuming your API might return structured data *after* the stream or as a separate part of the final response
        // This part depends heavily on your backend implementation. The provided code checks response.data.formatted_data
        // If the API sends this data embedded *within* the stream (e.g., as JSON blocks),
        // you'd need to parse those blocks out of the `rawMessageContent` during or after the stream.
        // For now, we'll assume response.data is available *after* the fetch resolves, if the API does that.
        // If the API only streams text and appends options, `response.data` from the fetch call won't exist as it's handled by the stream reader.
        // If data *is* sent in the stream (e.g., SSE with different event types), the reading loop needs to parse events.
        // Let's stick to the current logic where the `response` object *might* contain data properties after the stream, though it's less common with raw streaming.
        // A typical pattern is the server sending a final JSON payload *after* the text stream, or embedding JSON in the stream itself.
        // Given the current code extracts options from the *text* stream, it's likely structured data like search results would also need to be parsed from the stream text
        // or fetched separately. The `response.data` check in the UI suggests the *mutation result* might have this data, which implies the server sends it alongside the stream or after.
        // Let's assume the server sends the data *after* the stream completes, and it's available somehow through the same fetch response object (less likely for raw streams)
        // OR, more likely, the `useMutation` wrapper might receive additional data in its `onSuccess` callback if the API returns a final JSON payload after the stream.
        // Re-reading the UI code, the check `response.data?.formatted_data` happens *after* the `await chatCompletion.mutateAsync`. This implies the `mutateAsync` promise resolves
        // with an object that *includes* the `message` (from the stream's full content) and potentially `data`. This means the server *might* be closing the stream and *then* sending a JSON response,
        // or the library/framework on the server side is handling this.
        // Let's keep the data processing in the UI for now, assuming `response.data` is available there.

         // Placeholder for data extraction if needed from rawMessageContent or elsewhere
         let extractedData: any = null;
         // Example: If your stream includes JSON lines like `{"type": "data", "payload": {...}}`
         // You would parse rawMessageContent for these lines.
         // For now, we rely on the `response.data` passed back from `mutateAsync`.


        return {
            message: finalMessage,
            toolRecommendations: options.length > 0 ? options : undefined,
            data: extractedData, // Pass any data extracted from the stream if applicable
        };
    } catch (error: any) {
        console.error(`Error sending message to session ${sessionId}:`, error);
        throw error;
    }
};
  



// --- Keyword Search Service Function ---
// This function makes the direct keyword search API call
export const keywordSearch = async (keywords: string[], skip: number = 0, limit: number = 100): Promise<KeywordSearchResponse> => {
    console.log(`Calling keywordSearch API with keywords: ${keywords.join(', ')}, skip: ${skip}, limit: ${limit}`);
    try {
        console.log("keywords are:" + keywords)
        console.log("skip are:" + skip)
        console.log("limit are:" + limit)
        console.log("apiClient is:" + apiClient)
        // Make the POST request to the keyword-search endpoint
        // Assuming your API endpoint is /api/tools/keyword-search
        const response = await apiClient.post<KeywordSearchResponse>(
            '/tools/keyword-search',
            keywords,
            {
                params: {
                    skip,
                    limit,
                },
            }
        );
        console.log("Keyword search response received:", response.data);
        return response.data; // Return the search results
    } catch (error: any) {
        console.error("Keyword search failed:", error);
        // Depending on error type (e.g., 401 Unauthorized), you might need to handle token refresh or logout
        throw error; // Re-throw the error for the calling component to handle
    }
};

// Helper to get user ID from local storage (assuming this is where it's stored)
// You might already have this in a session utility file
function getUserIdFromLocalStorage(): string | null {
    // Example: assuming user object is stored as a JSON string
    const userString = localStorage.getItem("user");
    if (userString) {
        try {
            const user = JSON.parse(userString);
            return user.id || null; // Assuming user object has an 'id' property
        } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
            return null;
        }
    }
    return null;
}
