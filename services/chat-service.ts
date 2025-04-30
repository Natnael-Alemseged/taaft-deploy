// services/chat-service.ts
import apiClient from "@/lib/api-client"
import { getUserIdFromLocalStorage } from "@/lib/session" // Assuming this utility exists

// Define the structure for a chat message
export interface Message {
    role: "user" | "assistant"
    message: string
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
        // Assuming your API endpoint is /api/chat/sessions/{sessionId}/messages
        const response = await apiClient.get<any[]>(`/api/chat/sessions/${sessionId}/messages`)

        // Transform the API response to our Message format
        // Ensure you map the correct fields from your backend message structure
        const messages: Message[] = response.data.map((msg) => ({
            role: msg.role === "assistant" ? "assistant" : "user", // Map backend role to frontend role
            message: msg.content, // Map backend content to frontend content
            id: msg._id, // Include message ID if available
            timestamp: new Date(msg.timestamp), // Convert timestamp string to Date object
            // Map hasSearchResults and formattedData from message metadata or similar field
            hasSearchResults: msg.metadata?.hasSearchResults || false,
            formattedData: msg.metadata?.formattedData || undefined,
        }))

        console.log(`Retrieved ${messages.length} messages for session ${sessionId}`)
        return messages || []
    } catch (error) {
        console.error(`Error fetching messages for session ${sessionId}:`, error)
        // Depending on error type (e.g., 401 Unauthorized), you might need to handle token refresh or logout
        throw error; // Re-throw the error for the calling component to handle
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
            model: "gpt4", // Example default model
            system_prompt: "You are a helpful assistant.", // Example default prompt
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
export const sendChatMessage = async (
    sessionId: string,
    message: string,
    model = "gpt4",
    systemPrompt = "You are a helpful assistant.",
    metadata: Record<string, any> = {} // Ensure metadata has a default value
): Promise<{ message: Message; toolRecommendations?: string[]; data: ChatCompletionResponse }> => { // Explicitly type data
    try {
        console.log(`Sending message to session ${sessionId} with model ${model}`);

        // Create the request payload - Updated comment based on API schema
        const payload = {
            message: message, // Use 'message' as per the provided API schema
            model: model,
            system_prompt: systemPrompt,
            metadata: metadata, // Include metadata object
        }

        console.log("Payload I send to the backend is:\n", JSON.stringify(payload, null, 2))


        // Define the expected API response structure
        interface ChatCompletionResponse {
            message: string; // The main message content
            chat_id: string;
            message_id: string;
            timestamp: string; // Assuming ISO string format
            model: string;
            metadata: Record<string, any>;
            formatted_data: any; // Can be null, object, or array - need flexibility here
            // If the API could *sometimes* send tool_recommendations at the top level, add it here:
            // tool_recommendations?: string[];
        }

        // Make the API request to the chat completion endpoint
        const response = await apiClient.post<ChatCompletionResponse>(`/api/chat/sessions/${sessionId}/messages`, payload);

        console.log(`Response received for session ${sessionId}`);

        const rawResponseMessage = response.data.message; // Raw string content from API

        console.log("Response data only:\n", JSON.stringify(response.data, null, 2));


        // Extract tool recommendations from formatted_data if available
        let toolRecommendations: string[] | undefined;

        if (response.data.formatted_data && typeof response.data.formatted_data === 'object') {
            // Check if formatted_data is an object and has a key like 'recommended_tools' or 'tool_recommendations'
            const potentialRecommendations = response.data.formatted_data.recommended_tools || response.data.formatted_data.tool_recommendations;
            if (Array.isArray(potentialRecommendations) && potentialRecommendations.every(item => typeof item === 'string')) {
                toolRecommendations = potentialRecommendations;
            }
        } else if (Array.isArray(response.data.formatted_data) && response.data.formatted_data.every(item => typeof item === 'string')) {
            // Also check if formatted_data is directly an array of strings
            toolRecommendations = response.data.formatted_data;
        }
        // Removed the old string parsing logic for "options =" as structured data is preferred


        // Clean the message content (remove "options = ..." part if present, although not expected with structured data)
        const optionsPattern = "options =";
        const optionsIndex = rawResponseMessage.indexOf(optionsPattern);

        const cleanedMessageContent = optionsIndex !== -1
            ? rawResponseMessage.substring(0, optionsIndex).trim()
            : rawResponseMessage.trim();


        // Map the API response message structure to the frontend Message structure
        // Assuming Message interface is defined elsewhere like:
        // interface Message {
        //   id: string;
        //   role: "user" | "assistant";
        //   message: string;
        //   timestamp: Date;
        //   hasSearchResults?: boolean; // If formatted_data represents search results
        //   formattedData?: any; // The raw formatted_data
        // }
        const frontendMessage: Message = {
            role: "assistant", // Assuming the response message is always from assistant
            message: cleanedMessageContent, // Use the cleaned content
            id: response.data.message_id,
            timestamp: new Date(response.data.timestamp),
            // Map hasSearchResults and formattedData directly from response.data
            hasSearchResults: response.data.formatted_data ? true : false, // Assuming formatted_data indicates search results
            formattedData: response.data.formatted_data,
        };


        return {
            message: frontendMessage,
            toolRecommendations: toolRecommendations, // Use the extracted recommendations
            data: response.data, // Include the entire raw response data
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

        throw error // Re-throw the error for the calling component to handle
    }
}


// --- Keyword Search Service Function ---
// This function makes the direct keyword search API call
export const keywordSearch = async (keywords: string[], skip: number = 0, limit: number = 100): Promise<KeywordSearchResponse> => {
    console.log(`Calling keywordSearch API with keywords: ${keywords.join(', ')}, skip: ${skip}, limit: ${limit}`);
    try {
        // Make the POST request to the keyword-search endpoint
        // Assuming your API endpoint is /api/tools/keyword-search
        const response = await apiClient.post<KeywordSearchResponse>('/api/tools/keyword-search',
            keywords, // Send the array of keywords in the request body
            {
                params: { // Pass skip and limit as query parameters
                    skip: skip,
                    limit: limit
                }
                // apiClient should handle headers like Authorization and Content-Type (application/json)
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
