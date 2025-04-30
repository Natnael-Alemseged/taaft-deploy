// components/home/chat_interface_ui.tsx
import React from 'react';
import clsx from "clsx";
import { X, Bot, MessageSquare, Plus, AlertTriangle, Search, Send, Loader2, ExternalLink } from "lucide-react"; // Import ExternalLink icon
import { Button } from "@/components/ui/button"; // Assuming Button component
import { Input } from "@/components/ui/input"; // Assuming Input component

// Assuming Message and ChatSession interfaces are defined elsewhere and imported
// Define them here for clarity if not globally available or imported
interface Message {
    id?: string;
    role: "user" | "assistant";
    message: string; // Text content
    timestamp?: Date;
    hasSearchResults?: boolean; // Indicates if the message is related to search results from LLM
    formattedData?: any; // Raw search data or other formatted info
    isSearchResults?: boolean; // Custom flag for system messages about direct search results or errors
    // Add 'content' here with an optional or union type if your backend *sometimes* uses 'content'
    content?: string; // Optional fallback for backend responses (should be mapped to message)
}

interface ChatSession {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    // Add other session properties if needed
}

interface ChatInterfaceUIProps {
    // Props representing state
    isOpen: boolean; // Passed from parent, though UI might not directly use it for rendering conditional show/hide if parent handles it
    isRelativeToParent?: boolean;
    chatPosition: { top: number; left: number } | null; // For modal positioning - applied by parent now
    error: string | null;
    showSessions: boolean;
    isLoadingSessions: boolean;
    chatSessions: ChatSession[] | undefined;
    activeChatId: string | null;
    isLoadingMessages: boolean; // Loading state specifically for fetching session messages
    messages: Message[];
    isLoading: boolean; // Combined loading state (chat completion OR direct search OR message loading)
    toolRecommendations: string[]; // Array of strings
    input: string; // Current input value
    isDirectSearchLoading: boolean; // Loading state specifically for direct search


    // Props representing refs
    chatRef: React.RefObject<HTMLDivElement>; // Ref for the main container (applied by parent)
    messagesAreaRef: React.RefObject<HTMLDivElement>; // Ref for the scrollable messages area
    chatEndRef: React.RefObject<HTMLDivElement>; // Marker for the end of messages
    inputRef: React.RefObject<HTMLInputElement>; // Ref for the input element

    // Props representing handlers/actions
    onClose: () => void;
    setError: (error: string | null) => void; // To dismiss the error banner
    setShowSessions: (show: boolean) => void; // To toggle the sessions sidebar
    handleNewChat: () => void; // Handler for creating a new chat session
    handleSelectSession: (sessionId: string) => void; // Handler for selecting a chat session
    handleToolRecommendationClick: (tool: string) => void; // Handler for clicking a tool recommendation
    handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void; // Handler for input focus
    handleDirectSearch: () => void; // Handler for direct tool search
    handleSendMessage: () => void; // Handler for sending a message (triggers LLM chat)
    // Handler for when the "View search results" button is clicked on an assistant message
    onViewSearchResultsClick: (formattedData: any, messageContent: string) => void;

    // Need setInput to update the input state from this component
    setInput: (input: string) => void;
}

const ChatInterfaceUI: React.FC<ChatInterfaceUIProps> = ({
                                                             isOpen, // Received, but main conditional rendering is in parent
                                                             isRelativeToParent,
                                                             chatPosition, // Received, but applied by parent
                                                             error,
                                                             setError,
                                                             showSessions,
                                                             setShowSessions,
                                                             isLoadingSessions,
                                                             chatSessions,
                                                             activeChatId,
                                                             isLoadingMessages,
                                                             messages,
                                                             isLoading,
                                                             toolRecommendations,
                                                             input,
                                                             setInput,
                                                             isDirectSearchLoading,
                                                             chatRef, // Received, but applied by parent's wrapper div
                                                             messagesAreaRef,
                                                             chatEndRef,
                                                             inputRef,
                                                             onClose, // Received, but handled by parent's close button directly
                                                             handleNewChat,
                                                             handleSelectSession,
                                                             handleToolRecommendationClick,
                                                             handleInputFocus,
                                                             handleDirectSearch,
                                                             handleSendMessage,
                                                             onViewSearchResultsClick,
                                                         }) => {

    return (
        // This is the core UI structure that will be wrapped by the parent ChatInterface
        // The parent handles the fixed/absolute positioning and backdrop when it's a modal.
        // The UI component itself focuses on the internal layout and elements.
        <div
            // The ref and main conditional classes/styles for positioning are now applied by the parent wrapper.
            // Keep classes related to the internal appearance (rounded corners, background, shadow, width/height handling)
            className={clsx(
                "rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out w-full",
                {
                    "max-w-2xl": !isRelativeToParent, // Max width for modal
                    "relative": isRelativeToParent, // Position relative to parent
                    "h-full": isRelativeToParent, // Use h-full when embedded
                    "overflow-hidden": isRelativeToParent, // Hide overflow if content exceeds height
                }
            )}
        >
            {/* Removed fixed height from this inner div */}
            <div
                className="flex h-full flex-col rounded-xl border border-gray-200"> {/* Use h-full to fill parent height */}
                {/* Error Banner */}
                {error && ( // Only show error banner if there is an error
                    <div
                        className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between flex-shrink-0"> {/* Added flex-shrink-0 */}
                        <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2"/>
                            <span className="text-xs text-amber-700">{error}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation() // Prevent click from propagating up
                                setError(null) // Call setError prop
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700"
                        >
                            Dismiss
                        </button>
                    </div>
                )}


                {/* Chat header */}
                <div
                    className="flex items-center justify-between border-b border-gray-100 px-4 py-3 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <div className="flex items-center">
                        <Bot className="h-6 w-6 text-purple-600"/>
                        <span className="ml-2 text-base font-semibold text-gray-800">AI Assistant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Show Sessions button only in modal view */}
                        {!isRelativeToParent && (
                            <button
                                onClick={() => setShowSessions(!showSessions)} // Call setShowSessions prop
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <MessageSquare className="h-5 w-5"/>
                            </button>
                        )}
                        {/* Close button - handled by the parent ChatInterface now */}
                        {/* The parent's wrapper div has the actual onClose handler */}
                        {/* This button might be redundant or can be kept for visual consistency, but its onClick in parent is key */}
                        {/* <button
                             // onClick={onClose} // Calls the onClose prop
                             className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                         >
                             <X size={20}/>
                             <span className="sr-only">Close chat</span>
                         </button> */}
                    </div>
                </div>

                {/* Chat sessions sidebar (ONLY in modal view) */}
                {showSessions && !isRelativeToParent && (
                    <div
                        className="absolute top-14 right-0 z-10 w-64 bg-white border border-gray-200 rounded-bl-lg shadow-lg max-h-[calc(100%-4rem)] overflow-y-auto">
                        <div className="p-3 border-b border-gray-100">
                            <h3 className="font-medium text-gray-700">Chat History</h3>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={handleNewChat} // Call handleNewChat prop
                                className="flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded-md"
                            >
                                <Plus className="h-4 w-4 mr-2 text-purple-600"/>
                                New Chat
                            </button>

                            {isLoadingSessions ? (
                                <div className="p-3 text-center text-sm text-gray-500">Loading...</div>
                            ) : !chatSessions || chatSessions.length === 0 ? (
                                <div className="p-3 text-center text-sm text-gray-500">No chat history</div>
                            ) : (
                                chatSessions.map((session) => (
                                    <button
                                        key={session._id}
                                        onClick={() => handleSelectSession(session._id)} // Call handleSelectSession prop
                                        className={`flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded-md ${
                                            activeChatId === session._id ? "bg-purple-50 text-purple-700" : ""
                                        }`}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2 text-gray-500"/> {/* Icon */}
                                        {/* Display session title, truncate if too long */}
                                        <span className="truncate">{session.title || `Chat ${session._id.substring(0, 4)}...`}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}


                {/* Messages area */}
                <div
                    ref={messagesAreaRef} // Attach ref here for scrolling
                    className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800"
                >
                    <div className="flex flex-col space-y-4">
                        {/* Loading spinner specifically for initial message loading */}
                        {isLoadingMessages ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                // Use message.message for the text content
                                <div
                                    key={index}
                                    className={clsx(
                                        "flex items-start",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            "rounded-lg p-3 max-w-[80%]",
                                            msg.role === "user"
                                                ? "bg-purple-600 text-white ml-auto" // ml-auto aligns user message to the right
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
                                            // Apply specific style for system messages like "No tools found"
                                            msg.isSearchResults ? "italic text-sm text-gray-600 dark:text-gray-400 bg-transparent" : ""
                                        )}
                                    >
                                        {/* Render message content */}
                                        <p className="whitespace-pre-wrap">{msg.message}</p> {/* Added whitespace-pre-wrap */}

                                        {/* Add search results button if this message has search results (from LLM, showing popup) */}
                                        {/* This button is for LLM responses that trigger the popup, distinct from embedded search results */}
                                        {msg.role === "assistant" && msg.hasSearchResults && msg.formattedData && (
                                            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <button
                                                    // Call the handler prop when clicked
                                                    onClick={() => onViewSearchResultsClick(msg.formattedData, msg.message)}
                                                    className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                                                >
                                                    <Search className="h-4 w-4 mr-1"/>
                                                    View search results (from AI)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {/* Loading spinner for chat completion or direct search */}
                        {isLoading && !isLoadingMessages && ( // Only show loader if overall loading, but not specifically messages loading (avoids double loader)
                            <div className="flex items-center justify-start mr-auto max-w-[80%]"> {/* Align loader to the left like assistant messages */}
                                <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                    <div
                                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                        style={{animationDelay: "0.2s"}}
                                    ></div>
                                    <div
                                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                        style={{animationDelay: "0.4s"}}
                                    ></div>
                                </div>
                            </div>
                        )}
                        {/* Marker div for scrolling to the bottom */}
                        <div ref={chatEndRef} />
                    </div>
                </div>


                {/* Tool Recommendations */}
                {toolRecommendations && toolRecommendations.length > 0 && (
                    <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
                        <div className="flex space-x-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0 self-center">Tools:</span>
                            {/* Map through toolRecommendations (which is string[]) */}
                            {toolRecommendations.map((tool, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    // Call the handler with the tool name
                                    onClick={() => handleToolRecommendationClick(tool)} // Call handleToolRecommendationClick prop
                                    className="flex-shrink-0 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                >
                                    {tool}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}


                {/* Input area */}
                <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                            {/* Removed redundant Search icon */}
                            <Input
                                ref={inputRef} // Attach the inputRef passed from the parent
                                type="text"
                                placeholder="Ask me anything..."
                                className="w-full rounded-md border border-gray-300 pl-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-purple-400" // Adjusted padding as Search icon removed
                                value={input}
                                onChange={(e) => setInput(e.target.value)} // Use setInput prop
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (!isLoading && input.trim()) { // Prevent sending empty or while loading
                                            handleSendMessage(); // Call handleSendMessage prop
                                        }
                                    }
                                }}
                                onFocus={handleInputFocus} // Add this handler to prevent default scroll and scroll messages area
                                disabled={isLoading} // Disable input while loading
                            />
                        </div>

                        {/* Send Message Button (for LLM chat) */}
                        <Button
                            // Call handleSendMessage without arguments to use input state
                            onClick={() => handleSendMessage()} // Call handleSendMessage prop
                            size="sm" // Adjusted size to match height
                            disabled={isLoading || !input.trim()} // Disable if loading or input is empty
                            className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white h-9" // Added h-9 to match input height
                        >
                            {isLoading && !isDirectSearchLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />} {/* Show loader if LLM is loading */}
                            Send
                            <span className="sr-only">Send message</span>
                        </Button>

                        {/* Direct Search Button */}
                        {/* Only show direct search button in modal view */}
                        {!isRelativeToParent && (
                            <Button
                                onClick={handleDirectSearch} // Call the handleDirectSearch prop
                                size="sm" // Adjusted size
                                className="rounded-md bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none flex items-center h-9" // Added h-9 and flex items-center
                                disabled={isLoading || !input.trim()} // Disable if loading or input is empty
                                title="Search directly"
                            >
                                {isDirectSearchLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Search className="h-4 w-4 mr-1"/>} {/* Show loader if direct search is loading */}
                                Search
                                <span className="sr-only">Search directly</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* Chat Response Popup is rendered by the parent ChatInterface */}
        </div>
    );
};

export default ChatInterfaceUI;