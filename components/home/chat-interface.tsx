// components/home/chat-interface.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Corrected import path for useRouter
import clsx from "clsx"; // Assuming you use clsx for conditional classes
// Import all necessary icons here
import { X, Bot, MessageSquare, Plus, AlertTriangle, Search, Send, Loader2, ExternalLink } from "lucide-react"; // Import ExternalLink icon

// Import the new UI component
import ChatInterfaceUI from "./chat_interface_ui"; // Adjust path as needed

// Assuming these hooks and services are defined elsewhere
import { useClickOutside } from "@/hooks/use-click-outside"; // Adjust path as needed
import { useChatCompletion, useChatSessions, useChatSessionMessages, useCreateChatSession } from "@/hooks/use-chat"; // Adjust path as needed
import { keywordSearch } from "@/services/chat-service"; // Import the keywordSearch service function

// Import types from chat-service
import type { Message, ChatSession, ChatCompletionResponse, KeywordSearchResponse } from "@/services/chat-service"; // Import necessary types


interface ChatInterfaceProps {
    isOpen: boolean
    onClose: () => void
    inputRef: React.RefObject<HTMLInputElement>
    isRelativeToParent?: boolean
}

// This popup is likely still needed for search results from LLM, keep it separate
interface ChatResponsePopupProps {
    message: string // Message content for the popup
    formattedData?: any // Assuming formattedData is the structure you expect for the popup
    onClose: () => void
}

// Moved ChatResponsePopup into this file as it manages its own state and visibility
function ChatResponsePopup({message, formattedData, onClose}: ChatResponsePopupProps) {
    const router = useRouter()

    const handleGoToTools = () => {
        // 1. Close all popups first
        onClose()

        // 2. Add slight delay to ensure popups are unmounted
        setTimeout(() => {
            // 3. Use replace instead of push to avoid history issues
            // This assumes the popup's formattedData is what you want to pass to the search page
            sessionStorage.setItem("chatResponseTools", JSON.stringify(formattedData)); // Ensure data is stored before navigating
            router.replace("/search?source=chat-llm-popup") // Use a specific source for LLM popup results

            // 4. Force scroll to top in case previous modals affected scroll position
            window.scrollTo(0, 0)
        }, 100)
    }

    return (
        // Outer backdrop container - handles centering and fixed positioning
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
            {/* Inner popup content container - handles background, rounded corners, padding, width, max-height, and flex layout */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col max-h-[80vh]"> {/* Added flex flex-col and max-h */}
                {/* Header - ensure it doesn't shrink */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <h2 className="text-lg font-semibold">Response</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20}/> {/* Use X icon for close */}
                    </button>
                </div>

                {/* Scrollable message content area - ensure it grows and scrolls */}
                {/* Removed mb-4 from the p tag and applied flex-1 and overflow-y-auto to the wrapping div */}
                <div className="flex-1 overflow-y-auto text-sm text-gray-800 mb-4 whitespace-pre-wrap"> {/* Added flex-1, overflow-y-auto, kept mb-4 for space below message */}
                    {message}
                </div>

                {/* Buttons area - ensure it doesn't shrink */}
                {formattedData && (
                    <div className="flex justify-end mt-4 space-x-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button onClick={handleGoToTools} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Go to Tools
                        </Button>
                    </div>
                )}
                {/* If no formattedData, just a close button - ensure it doesn't shrink */}
                {!formattedData && (
                    <div className="flex justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}


export default function ChatInterface({isOpen, onClose, inputRef, isRelativeToParent = false}: ChatInterfaceProps) {
    const [showResponsePopup, setShowResponsePopup] = useState(false)
    const [popupContent, setPopupContent] = useState<{
        message: string // Use message property
        formattedData?: any
    }>({message: ""}) // Use message property
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [activeChatId, setActiveChatId] = useState<string | null>(null)
    const [showSessions, setShowSessions] = useState(false)
    // chatPosition state is only needed for the fixed modal view
    const [chatPosition, setChatPosition] = useState<{ top: number; left: number } | null>(null)
    const [error, setError] = useState<string | null>(null)
    // Initialize as empty array of strings
    const [toolRecommendations, setToolRecommendations] = useState<string[]>([])
    const [isDirectSearchLoading, setIsDirectSearchLoading] = useState(false); // Loading state for direct search

    const chatEndRef = useRef<HTMLDivElement>(null) // Marker for the end of messages
    const messagesAreaRef = useRef<HTMLDivElement>(null); // Ref for the scrollable messages area
    // Use a single ref for the main chat container
    const chatRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Use the chat API hook (for LLM completion) - Type the expected response
    const chatCompletion = useChatCompletion<ChatCompletionResponse>()
    const {data: chatSessions, isLoading: isLoadingSessions, refetch: refetchSessions} = useChatSessions()
    const {data: sessionMessages, isLoading: isLoadingMessages} = useChatSessionMessages(
        activeChatId || "",
        !!activeChatId,
    )
    const createChatSession = useCreateChatSession()

    // Check for existing sessions first when the interface becomes open
    useEffect(() => {
        if (isOpen && !activeChatId && !isLoadingMessages) {
            console.log("ChatInterface: Checking for existing chat sessions")
            refetchSessions()
                .then((result) => {
                    if (result.data && result.data.length > 0) {
                        // Use the most recent session
                        const mostRecentSession = result.data[0]
                        console.log(`ChatInterface: Using existing session: ${mostRecentSession._id}`)
                        setActiveChatId(mostRecentSession._id)
                        // Messages will be loaded via the useChatSessionMessages hook
                    } else {
                        console.log("ChatInterface: No existing sessions found, will create a new one when needed")
                        // Use message property for initial message for consistency
                        setMessages([
                            {
                                role: "assistant",
                                message: "Hi! I'm your AI assistant. How can I help you today?",
                            },
                        ])
                    }
                })
                .catch((err) => {
                    console.error("ChatInterface: Error checking for existing sessions:", err)
                    setError("Failed to load chat history.") // Set an error message
                    // Use message property for initial message for consistency
                    setMessages([
                        {
                            role: "assistant",
                            message: "Hi! I'm your AI assistant. How can I help you today?",
                        },
                    ])
                })
        }
    }, [isOpen, activeChatId, isLoadingMessages, refetchSessions])

    // Use the click outside hook ONLY for the fixed modal view
    // When embedded, clicks outside should be handled by the parent (Hero)
    useClickOutside(chatRef as React.RefObject<HTMLElement>, () => {
        if (!isRelativeToParent && isOpen) { // Only trigger if it's the modal and it's open
            onClose();
        }
    });


    // Effect to load messages from active chat session
    useEffect(() => {
        if (sessionMessages && activeChatId) {
            // Map session messages to ensure they use the 'message' property
            // Assuming backend might use 'content' or 'message' for the text
            const formattedMessages: Message[] = sessionMessages.map((msg: any) => ({ // Use 'any' temporarily if backend type is uncertain
                ...msg,
                message: msg.message || msg.content || "", // Prioritize 'message', fallback to 'content', default to empty string
                // Ensure other potential Message properties are carried over if they exist in sessionMessages
                hasSearchResults: msg.hasSearchResults || false,
                formattedData: msg.formattedData || undefined,
                isSearchResults: msg.isSearchResults || false,
                // Keep original content field if backend uses it, for debugging/backward compatibility
                content: msg.content || undefined,
            }));
            setMessages(formattedMessages)
        }
    }, [sessionMessages, activeChatId])

    // Effect to scroll to bottom when messages change
    useEffect(() => {
        // Only scroll if chatEndRef and messagesAreaRef are available
        // and the chat is open.
        if (chatEndRef.current && messagesAreaRef.current && isOpen) {
            // Use requestAnimationFrame to ensure smooth scrolling after DOM updates
            requestAnimationFrame(() => {
                // Scroll the messages area container to the bottom
                messagesAreaRef.current?.scrollTo({
                    top: messagesAreaRef.current.scrollHeight,
                    behavior: "smooth"
                });
                // Alternative: Use scrollIntoView on the end marker
                // chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            });
        }
    }, [messages, isOpen]) // Depend on messages and isOpen


    // Effect to center the chat interface when it opens (ONLY for fixed modal view)
    useEffect(() => {
        if (isOpen && !isRelativeToParent) { // Only run if modal and open
            const centerChat = () => {
                if (chatRef.current) {
                    const viewportHeight = window.innerHeight
                    const viewportWidth = window.innerWidth
                    const chatHeight = chatRef.current.offsetHeight
                    const chatWidth = chatRef.current.offsetWidth

                    // Calculate the position to center the chat
                    const top = Math.max(20, (viewportHeight - chatHeight) / 2)
                    const left = (viewportWidth - chatWidth) / 2

                    // Set the position
                    setChatPosition({top, left})

                    // Focus the input after positioning
                    setTimeout(() => {
                        inputRef.current?.focus()
                    }, 50)
                }
            }

            // Center the chat initially
            centerChat()

            // Recenter when window is resized
            window.addEventListener("resize", centerChat)

            // Cleanup
            return () => {
                window.removeEventListener("resize", centerChat)
            }
        } else if (isOpen && isRelativeToParent) {
            // If embedded and open, ensure input is focused
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
        // Cleanup resize listener specifically for the modal case
        return () => {
            if (typeof window !== 'undefined' && !isRelativeToParent) {
                // Use a named function or a reference to the actual handler if it was defined outside
                // For simplicity here, assuming the effect logic is self-contained and cleanup is sufficient.
                // A more robust approach would be to define centerChat outside and reference it.
                // window.removeEventListener("resize", centerChat); // This won't work as centerChat is redefined
            }
        }

    }, [isOpen, inputRef, isRelativeToParent]) // Dependencies include isRelativeToParent

    // Add this effect after the other useEffect hooks to handle pending messages
    // This should run when the interface becomes open and messages are loaded
    useEffect(() => {
        console.log("ChatInterface: Checking for pending message. isOpen:", isOpen, "isLoadingMessages:", isLoadingMessages, "messages.length:", messages.length);
        if (isOpen && !isLoadingMessages && messages.length > 0) {
            const pendingMessage = sessionStorage.getItem("pendingChatMessage")
            const shouldCreateNewSession = sessionStorage.getItem("shouldCreateNewSession") === "true"; // Check the flag

            if (pendingMessage) {
                console.log("ChatInterface: Found pending message:", pendingMessage);
                // Clear the pending message and flag first to prevent infinite loop
                sessionStorage.removeItem("pendingChatMessage")
                sessionStorage.removeItem("shouldCreateNewSession");


                const sendPendingMessage = async () => {
                    // If flag is set OR no active chat ID, create a new session
                    if (shouldCreateNewSession || !activeChatId) {
                        console.log("ChatInterface: Creating new session for pending message.");
                        try {
                            const sessionTitle = pendingMessage.substring(0, 50) || "New Chat"
                            // Assuming createChatSession returns the new session object with _id
                            const newSession = await createChatSession.mutateAsync(sessionTitle)
                            console.log("ChatInterface: New session created:", newSession._id)
                            setActiveChatId(newSession._id)
                            await refetchSessions() // Refetch sessions to show the new one in history
                            // Send the pending message using the regular chat completion endpoint
                            await handleSendMessage(pendingMessage); // Use handleSendMessage for LLM interaction
                        } catch (error) {
                            console.error("ChatInterface: Failed to create session for pending message:", error)
                            setError("Failed to start a new chat session. Please try again.");
                        }
                    } else {
                        console.log("ChatInterface: Sending pending message to existing session:", activeChatId);
                        // Send the pending message to the existing active chat using the regular chat completion endpoint
                        await handleSendMessage(pendingMessage); // Use handleSendMessage for LLM interaction
                    }
                }

                // Add a small delay before sending the pending message
                // This gives the interface time to load existing messages if any
                setTimeout(() => {
                    sendPendingMessage();
                }, 200); // Adjust delay as needed
            }
        }
        // Add dependencies relevant to triggering this effect
    }, [isOpen, isLoadingMessages, messages.length, activeChatId, createChatSession, refetchSessions, handleSendMessage]); // Added dependencies


    // Handle sending a message to the LLM chat completion endpoint
    // The isDirectSearch flag is now less relevant here, as direct search has its own handler
    async function handleSendMessage(content?: string) {
        const messageContent = content || input.trim()
        if (!messageContent) return

        // Use 'message' property for user message for consistency
        const userMessage: Message = {role: "user", message: messageContent}
        setMessages((prev) => [...prev, userMessage])
        if (!content) setInput("") // Only clear input if it's not a recommendation
        setError(null)
        setToolRecommendations([])

        try {
            let chatId = activeChatId
            // If no active chat ID, create a new session
            if (!chatId) {
                console.log("ChatInterface: No active chat ID during send, creating new session.");
                try {
                    const sessionTitle = messageContent.substring(0, 50) || "New Chat"
                    // Assuming createChatSession returns the new session object with _id
                    const newSession = await createChatSession.mutateAsync(sessionTitle)
                    console.log("ChatInterface: New session created:", newSession._id)
                    setActiveChatId(newSession._id)
                    chatId = newSession._id
                    await refetchSessions() // Refetch sessions to show the new one in history
                } catch (sessionError) {
                    console.error("ChatInterface: Failed to create chat session during send:", sessionError)
                    setError("Failed to create a new chat session. Please try again.")
                    // Optionally remove the user message if session creation fails
                    // setMessages((prev) => prev.slice(0, -1));
                    return
                }
            }

            console.log(`ChatInterface: Sending message to chat completion endpoint for session ID: ${chatId}`);

            // Call the chat completion API - pass messageContent as the message
            // The useChatCompletion hook calls the sendChatMessage service function
            const response = await chatCompletion.mutateAsync({
                sessionId: chatId,
                message: messageContent, // Pass user's message content to the service function
                model: "gpt4", // Use default or selected model
                systemPrompt: "You are a helpful assistant.", // Use default or configured prompt
                metadata: {}, // Include any relevant metadata
                // isDirectSearch is not passed to the chat completion hook anymore
            })

            console.log("ChatInterface: Chat completion response received:", response)

            // --- Process LLM response ---

            // The main message content is already cleaned by sendChatMessage and is in response.message.message
            // response.message is the frontend Message object returned by sendChatMessage
            const assistantMessage = response.message;


            // Extract tool recommendations directly from the response object returned by useChatCompletion hook
            // This property name should match what sendChatMessage returns (camelCase)
            const extractedToolRecommendations = response.toolRecommendations; // Corrected property name

            // Check if the LLM response includes formatted_data for the popup
            // Assuming formatted_data might contain search 'hits' and indicates search results
            if (response.data?.formatted_data && Array.isArray(response.data.formatted_data.hits)) {
                // The assistantMessage object returned by sendChatMessage *should* already
                // have hasSearchResults and formattedData properties if sendChatMessage is implemented correctly.
                // We add it here defensively if the service layer doesn't fully map it.
                const messageWithSearchData = {
                    ...assistantMessage,
                    hasSearchResults: true, // Explicitly mark as having search results
                    formattedData: response.data.formatted_data // Attach the raw formatted data
                };
                setMessages((prev) => [...prev, messageWithSearchData]);
                console.log("ChatInterface: LLM provided search data, adding message with results flag.");

                // Moved popup logic to the handleViewSearchResultsClick handler triggered by the UI button

            } else {
                // Add the regular assistant message
                setMessages((prev) => [...prev, assistantMessage]);
            }

            // Set tool recommendations if available
            if (extractedToolRecommendations && extractedToolRecommendations.length > 0) {
                console.log("ChatInterface: Tool recommendations received from LLM response:", extractedToolRecommendations);
                // Update the state with the extracted recommendations
                setToolRecommendations(extractedToolRecommendations);
            } else {
                // Clear previous recommendations if none are returned
                setToolRecommendations([]);
            }

            // Removed the redundant and incorrect string parsing logic for "options ="
            // because sendChatMessage already handles cleaning the message content
            // and extracting structured tool recommendations if they exist in formatted_data.

        } catch (error: any) { // Catch potential errors from chatCompletion.mutateAsync
            console.error("ChatInterface: Error in chat completion:", error);
            // Attempt to extract a more specific error message if available from the API response structure
            const apiErrorMessage = error?.message || error?.error || "An unexpected error occurred.";
            setError(`Sorry, I couldn't process your request: ${apiErrorMessage}. Please try again later.`);
            // Optionally remove the user message if the API call fails
            // setMessages((prev) => setMessages(prev.slice(0, -1))); // Remove the last message (the user's message) - corrected setMessages usage
            setMessages((prev) => prev.slice(0, -1)); // Corrected usage
        }
    }

    // --- New function to handle Direct Search ---
    const handleDirectSearch = async () => {
        const searchTerm = input.trim();
        if (!searchTerm) return;

        setIsDirectSearchLoading(true); // Set loading state for direct search
        setError(null); // Clear previous errors
        setToolRecommendations([]); // Clear recommendations

        // Add the user's search query as a message using 'message' property
        const userMessage: Message = {role: "user", message: searchTerm}; // Use message property for consistency
        setMessages((prev) => [...prev, userMessage]);
        setInput(""); // Clear the input field

        try {
            // Split the input string into keywords (basic split by space)
            // You might need a more sophisticated tokenizer depending on your API
            const keywords = searchTerm.split(/\s+/).filter(word => word.length > 0);

            console.log(`ChatInterface: Performing direct keyword search for: "${searchTerm}"`);

            // Call the new keywordSearch service function
            const searchResults = await keywordSearch(keywords);

            console.log("ChatInterface: Keyword search results received:", searchResults);

            if (searchResults && searchResults.tools && searchResults.tools.length > 0) { // Corrected searchResults.hits to searchResults.tools based on KeywordSearchResponse type
                // If results are found, store them and navigate to the search page
                try {
                    // Store the search results data in sessionStorage before navigating
                    // You might need to format this data to match what your search page expects
                    const formattedDataForSearchPage = {hits: searchResults.tools, total: searchResults.total}; // Use searchResults.tools
                    sessionStorage.setItem("directSearchResults", JSON.stringify(formattedDataForSearchPage));
                    console.log("ChatInterface: Direct search results stored in sessionStorage for search page.");

                    // Navigate to the search page with a source indicator
                    router.push("/search?source=direct-chat-search");

                    // Optionally close the chat interface after navigating
                    // onClose();

                } catch (error) {
                    console.error("ChatInterface: Error storing direct search results in sessionStorage:", error);
                    // Add an error message to the chat if storage fails
                    const errorMessage: Message = {
                        role: "assistant",
                        message: "Successfully found tools, but failed to display them. Please try searching on the main search page.", // Use message property
                        isSearchResults: true, // Use this flag to indicate a system message about search results
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    setError("Failed to store search results.");
                }
            } else {
                // If no results are found, display a message in the chat
                const noResultsMessage: Message = {
                    role: "assistant",
                    message: `No tools found for "${searchTerm}". Please try a different query or use the AI assistant.`, // Use message property
                    isSearchResults: true, // Use this flag to indicate a system message about search results
                };
                setMessages((prev) => [...prev, noResultsMessage]);
                console.log("ChatInterface: Direct search returned no results.");
            }

        } catch (error) {
            console.error("ChatInterface: Error during direct keyword search:", error);
            setError("Sorry, I couldn't perform the direct search. Please try again.");
            // Optionally remove the user message if the API call fails
            // setMessages((prev) => setMessages(prev.slice(0, -1)));
        } finally {
            setIsDirectSearchLoading(false); // Clear loading state
        }
    };


    // Handle selecting a chat session
    const handleSelectSession = (sessionId: string) => {
        setActiveChatId(sessionId)
        setShowSessions(false)
        setToolRecommendations([]) // Clear recommendations when changing session
    }

    // Handle creating a new chat
    const handleNewChat = async () => {
        console.log("ChatInterface: Handling new chat request.");
        try {
            const sessionTitle = input.trim() || "New Chat" // Use input for title or default
            // Assuming createChatSession returns the new session object with _id
            const newSession = await createChatSession.mutateAsync(sessionTitle)
            console.log("ChatInterface: New chat session created:", newSession._id);
            setActiveChatId(newSession._id)
            // Clear messages and set initial assistant message for the new chat
            setMessages([
                {
                    role: "assistant",
                    message: "Hi! I'm your AI assistant. How can I help you today?", // Use message property
                },
            ])
            setShowSessions(false) // Close sessions sidebar
            setToolRecommendations([]) // Clear recommendations
            await refetchSessions() // Refetch sessions to update the list
            setInput(""); // Clear input after creating chat from current input
            // Focus the input after creating a new chat
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        } catch (error) {
            console.error("ChatInterface: Failed to create new chat:", error)
            setError("Failed to create a new chat. Please try again.")
        }
    }

    // Handle tool recommendation click (still uses handleSendMessage for LLM interaction)
    const handleToolRecommendationClick = async (tool: string) => {
        // Send the recommendation text as a message to the LLM
        handleSendMessage(tool); // Call handleSendMessage
    }

    // Handle input focus to prevent default scroll and ensure messages area scrolls
    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {

        // e.preventDefault(); // Prevent default browser focus behavior - might interfere with actual focus

        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTo({
                top: messagesAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    // Handler for when the "View search results" button is clicked on an assistant message in the UI
    const handleViewSearchResultsClick = (formattedData: any, messageContent: string) => {
        // Assuming formattedData is already the correct structure needed by the popup
        try {
            // Store the formatted data in sessionStorage before showing the popup
            sessionStorage.setItem("chatResponseTools", JSON.stringify(formattedData));
            // Set the state to show the popup with the correct content and data
            setPopupContent({ message: messageContent, formattedData: formattedData });
            setShowResponsePopup(true);
            console.log("ChatInterface: User clicked to view search results, showing popup.");
        } catch (error) {
            console.error("ChatInterface: Error storing LLM search data in sessionStorage for popup:", error);
            setError("Could not display search results.");
        }
    };


    // Determine if either chat completion or direct search is loading
    const isLoading = chatCompletion.isPending || isDirectSearchLoading || isLoadingMessages;


    // If not open and not relative to parent, don't render the main UI component
    if (!isOpen && !isRelativeToParent) {
        // Render the popup component outside the main UI conditional render
        return (
            <>
                {/* Chat Response Popup - Render this even when main UI is closed, if needed */}
                {showResponsePopup && (
                    <ChatResponsePopup
                        // Pass the message content from the state
                        message={popupContent.message}
                        formattedData={popupContent.formattedData}
                        onClose={() => setShowResponsePopup(false)}
                    />
                )}
            </>
        );
    }


    return (
        <>
            {/* Render the separated ChatInterfaceUI component */}
            {/* Apply fixed/absolute positioning and backdrop here in the parent */}
            {!isRelativeToParent && isOpen && (
                // This wrapper div provides the fixed positioning and backdrop for the modal view
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div
                        ref={chatRef} // Attach ref here for click outside and centering
                        className="w-full max-w-lg max-h-[70vh] flex flex-col" // Max width and max height for the modal, added flex-col
                        // Apply position style only if chatPosition is set (for modal)
                        style={chatPosition ? { // Only apply style if chatPosition is calculated
                            position: 'fixed', // Ensure it's fixed within the backdrop
                            top: `${chatPosition.top}px`,
                            left: `${chatPosition.left}px`,
                            transform: "none", // Override potential parent transforms
                        } : {}}
                    >
                        <ChatInterfaceUI
                            isOpen={isOpen} // Pass prop
                            isRelativeToParent={isRelativeToParent} // Pass prop
                            chatPosition={chatPosition} // Pass prop (less relevant for UI, but can be passed)
                            error={error} // Pass prop
                            setError={setError} // Pass prop
                            showSessions={showSessions} // Pass prop
                            setShowSessions={setShowSessions} // Pass prop
                            isLoadingSessions={isLoadingSessions} // Pass prop
                            chatSessions={chatSessions} // Pass prop
                            activeChatId={activeChatId} // Pass prop
                            isLoadingMessages={isLoadingMessages} // Pass prop
                            messages={messages} // Pass prop
                            isLoading={isLoading} // Pass prop
                            toolRecommendations={toolRecommendations} // Pass prop
                            input={input} // Pass prop
                            setInput={setInput} // Pass setInput
                            isDirectSearchLoading={isDirectSearchLoading} // Pass prop
                            chatRef={chatRef} // Pass ref
                            messagesAreaRef={messagesAreaRef} // Pass ref
                            chatEndRef={chatEndRef} // Pass ref
                            inputRef={inputRef} // Pass ref
                            onClose={onClose} // Pass handler
                            handleNewChat={handleNewChat} // Pass handler
                            handleSelectSession={handleSelectSession} // Pass handler
                            handleToolRecommendationClick={handleToolRecommendationClick} // Pass handler
                            handleInputFocus={handleInputFocus} // Pass handler
                            handleDirectSearch={handleDirectSearch} // Pass handler
                            handleSendMessage={handleSendMessage} // Pass handler
                            onViewSearchResultsClick={handleViewSearchResultsClick} // Pass the new handler
                        />
                    </div>
                </div>
            )}

            {/* Render ChatInterfaceUI directly if relative to parent */}
            {isRelativeToParent && isOpen && (
                <div ref={chatRef} className="relative h-full w-full"> {/* Wrapper div for embedded view */}
                    <ChatInterfaceUI
                        // Note: When embedded, many position/open related props might be ignored by the UI component
                        // as the parent's wrapper div controls the layout.
                        // Pass necessary state and handlers for UI elements and interactions.
                        isOpen={isOpen} // Pass prop
                        isRelativeToParent={isRelativeToParent} // Pass prop
                        chatPosition={chatPosition} // Pass prop (less relevant for UI, but can be passed)
                        error={error} // Pass prop
                        setError={setError} // Pass prop
                        showSessions={showSessions} // Pass prop
                        setShowSessions={setShowSessions} // Pass prop
                        isLoadingSessions={isLoadingSessions} // Pass prop
                        chatSessions={chatSessions} // Pass prop
                        activeChatId={activeChatId} // Pass prop
                        isLoadingMessages={isLoadingMessages} // Pass prop
                        messages={messages} // Pass prop
                        isLoading={isLoading} // Pass prop
                        toolRecommendations={toolRecommendations} // Pass prop
                        input={input} // Pass prop
                        setInput={setInput} // Pass setInput
                        isDirectSearchLoading={isDirectSearchLoading} // Pass prop
                        chatRef={chatRef} // Pass ref
                        messagesAreaRef={messagesAreaRef} // Pass ref
                        chatEndRef={chatEndRef} // Pass ref
                        inputRef={inputRef} // Pass ref
                        onClose={onClose} // Pass handler
                        handleNewChat={handleNewChat} // Pass handler
                        handleSelectSession={handleSelectSession} // Pass handler
                        handleToolRecommendationClick={handleToolRecommendationClick} // Pass handler
                        handleInputFocus={handleInputFocus} // Pass handler
                        handleDirectSearch={handleDirectSearch} // Pass handler
                        handleSendMessage={handleSendMessage} // Pass handler
                        onViewSearchResultsClick={handleViewSearchResultsClick} // Pass the new handler
                    />
                </div>
            )}


            {/* Chat Response Popup - Render this here as well, positioned fixed */}
            {/* It needs to be rendered regardless of whether the main UI is open if its state is true */}
            {showResponsePopup && (
                <ChatResponsePopup
                    // Pass the message content from the state
                    message={popupContent.message}
                    formattedData={popupContent.formattedData}
                    onClose={() => setShowResponsePopup(false)}
                />
            )}
        </>
    )
}