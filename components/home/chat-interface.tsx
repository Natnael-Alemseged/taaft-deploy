"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
// Import icons
import { Send, Search, Bot, Plus, MessageSquare, AlertTriangle, X, ExternalLink } from "lucide-react"
// Assuming component paths
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"
// Assuming hooks
import { useClickOutside } from "@/hooks/use-click-outside"
import { useChatCompletion, useChatSessions, useChatSessionMessages, useCreateChatSession } from "@/hooks/use-chat"
// Import types and services
import type { Message, ToolSearchResult } from "@/services/chat-service" // Import Message and ToolSearchResult types
import { keywordSearch } from "@/services/chat-service"; // Import the keywordSearch service function

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  inputRef: React.RefObject<HTMLInputElement>
  isRelativeToParent?: boolean
}

// This popup is likely still needed for search results from LLM, keep it separate
interface ChatResponsePopupProps {
  message: string
  formattedData?: any // Assuming formattedData is the structure you expect for the popup
  onClose: () => void
}

function ChatResponsePopup({ message, formattedData, onClose }: ChatResponsePopupProps) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Response</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} /> {/* Use X icon for close */}
            </button>
          </div>

          <p className="text-sm text-gray-800 mb-4">{message}</p>

          {/* Only show Go to Tools button if formattedData is available */}
          {formattedData && (
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleGoToTools} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Go to Tools
                </Button>
              </div>
          )}
          {/* If no formattedData, maybe just a close button? */}
          {!formattedData && (
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
          )}
        </div>
      </div>
  )
}

export default function ChatInterface({ isOpen, onClose, inputRef, isRelativeToParent = false }: ChatInterfaceProps) {
  const [showResponsePopup, setShowResponsePopup] = useState(false)
  const [popupContent, setPopupContent] = useState<{
    message: string
    formattedData?: any
  }>({ message: "" })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showSessions, setShowSessions] = useState(false)
  // chatPosition state is only needed for the fixed modal view
  const [chatPosition, setChatPosition] = useState<{ top: number; left: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toolRecommendations, setToolRecommendations] = useState<any[]>([])
  const [isDirectSearchLoading, setIsDirectSearchLoading] = useState(false); // Loading state for direct search

  const chatEndRef = useRef<HTMLDivElement>(null) // Marker for the end of messages
  const messagesAreaRef = useRef<HTMLDivElement>(null); // Ref for the scrollable messages area
  // Use a single ref for the main chat container
  const chatRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Use the chat API hook (for LLM completion)
  const chatCompletion = useChatCompletion()
  const { data: chatSessions, isLoading: isLoadingSessions, refetch: refetchSessions } = useChatSessions()
  const { data: sessionMessages, isLoading: isLoadingMessages } = useChatSessionMessages(
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
              setMessages([
                {
                  role: "assistant",
                  content: "Hi! I'm your AI assistant. How can I help you today?",
                },
              ])
            }
          })
          .catch((err) => {
            console.error("ChatInterface: Error checking for existing sessions:", err)
            setError("Failed to load chat history.") // Set an error message
            setMessages([
              {
                role: "assistant",
                content: "Hi! I'm your AI assistant. How can I help you today?",
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
      setMessages(sessionMessages)
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
          setChatPosition({ top, left })

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
  }, [isOpen, isLoadingMessages, messages.length, activeChatId, createChatSession, refetchSessions]); // Added dependencies


  // Handle sending a message to the LLM chat completion endpoint
  // The isDirectSearch flag is now less relevant here, as direct search has its own handler
  async function handleSendMessage(content?: string) {
    const messageContent = content || input.trim()
    if (!messageContent) return

    const userMessage: Message = { role: "user", content: messageContent }
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

      // Call the chat completion API
      const response = await chatCompletion.mutateAsync({
        sessionId: chatId,
        message: messageContent,
        model: "gpt4", // Use default or selected model
        systemPrompt: "You are a helpful assistant.", // Use default or configured prompt
        metadata: {  }, // Include any relevant metadata
        // isDirectSearch is not passed to the chat completion hook anymore
      })

      console.log("ChatInterface: Chat completion response received:", response)

      // Process LLM response: extract recommendations, handle search results if LLM provides them
      let options: string[] = []
      const rawResponseMessage = response.message.content
      const optionsPattern = "options ="
      const optionsIndex = rawResponseMessage.indexOf(optionsPattern)

      if (optionsIndex !== -1) {
        // Extract and parse options string
        const optionsStringRaw = rawResponseMessage.substring(optionsIndex + optionsPattern.length);
        let cleanedOptionsString = optionsStringRaw.trim();
        if (cleanedOptionsString.startsWith("[") && cleanedOptionsString.endsWith("]")) {
          cleanedOptionsString = cleanedOptionsString.substring(1, cleanedOptionsString.length - 1).trim()
        } else if (cleanedOptionsString.startsWith("[")) {
          cleanedOptionsString = cleanedOptionsString.substring(1).trim()
        } else if (cleanedOptionsString.endsWith("]")) {
          cleanedOptionsString = cleanedOptionsString.substring(0, cleanedOptionsString.length - 1).trim()
        }
        options = cleanedOptionsString
            .split(",")
            .map((option) => option.trim().replace(/'/g, "").replace(/"/g, "").replace(/\]$/, ""))
            .filter((option) => option.length > 0)

        if (options.length > 0) {
          setToolRecommendations(options)
        }

        // Clean the message content
        response.message.content = rawResponseMessage.substring(0, optionsIndex).trim();
      }

      // Check if the LLM response includes formatted_data for the popup
      if (response.data?.formatted_data && Array.isArray(response.data.formatted_data.hits)) {
        // Store data and show popup for LLM-triggered search results
        try {
          sessionStorage.setItem("chatResponseTools", JSON.stringify(response.data.formatted_data));
          setPopupContent({ message: response.message.content, formattedData: response.data.formatted_data });
          setShowResponsePopup(true);
          console.log("ChatInterface: LLM provided search data, showing popup.");
        } catch (error) {
          console.error("ChatInterface: Error storing LLM search data in sessionStorage:", error);
          // Still add the message, but maybe indicate an issue with viewing results
          setMessages((prev) => [...prev, response.message]);
          setError("Could not display search results from AI response.");
        }
      } else {
        // Add the regular assistant message
        setMessages((prev) => [...prev, response.message]);
      }

      // Use LLM's tool recommendations if available
      if (response.tool_recommendations && response.tool_recommendations.length > 0) {
        console.log("ChatInterface: Tool recommendations received from LLM response:", response.tool_recommendations)
        setToolRecommendations(response.tool_recommendations)
      } else if (options.length > 0) { // Fallback to extracted options if LLM didn't provide structured recommendations
        console.log("ChatInterface: Tool recommendations extracted from LLM message:", options)
        setToolRecommendations(options)
      }

    } catch (error) {
      console.error("ChatInterface: Error in chat completion:", error)
      setError("Sorry, I couldn't process your request. Please try again later.")
      // Optionally remove the user message if the API call fails
      // setMessages((prev) => prev.slice(0, -1)); // Remove the last message (the user's message)
    }
  }

  // --- New function to handle Direct Search ---
  const handleDirectSearch = async () => {
    const searchTerm = input.trim();
    if (!searchTerm) return;

    setIsDirectSearchLoading(true); // Set loading state for direct search
    setError(null); // Clear previous errors
    setToolRecommendations([]); // Clear recommendations

    // Add the user's search query as a message
    const userMessage: Message = { role: "user", content: searchTerm };
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

      if (searchResults && searchResults.hits && searchResults.hits.length > 0) {
        // If results are found, store them and navigate to the search page
        try {
          // Store the search results data in sessionStorage before navigating
          // You might need to format this data to match what your search page expects
          const formattedDataForSearchPage = { hits: searchResults.hits, total: searchResults.total }; // Example formatting
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
            content: "Successfully found tools, but failed to display them. Please try searching on the main search page.",
            isSearchResults: true, // Use this flag to indicate a system message about search results
          };
          setMessages((prev) => [...prev, errorMessage]);
          setError("Failed to store search results.");
        }
      } else {
        // If no results are found, display a message in the chat
        const noResultsMessage: Message = {
          role: "assistant",
          content: `No tools found for "${searchTerm}". Please try a different query or use the AI assistant.`,
          isSearchResults: true, // Use this flag to indicate a system message about search results
        };
        setMessages((prev) => [...prev, noResultsMessage]);
        console.log("ChatInterface: Direct search returned no results.");
      }

    } catch (error) {
      console.error("ChatInterface: Error during direct keyword search:", error);
      setError("Sorry, I couldn't perform the direct search. Please try again.");
      // Optionally remove the user message if the API call fails
      // setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsDirectSearchLoading(false); // Clear loading state
    }
  };


  // Handle selecting a chat session
  const handleSelectSession = (sessionId: string) => {
    setActiveChatId(sessionId)
    setShowSessions(false)
    setToolRecommendations([])
  }

  // Handle creating a new chat
  const handleNewChat = async () => {
    console.log("ChatInterface: Handling new chat request.");
    try {
      const newSession = await createChatSession.mutateAsync("New Chat")
      console.log("ChatInterface: New chat session created:", newSession._id);
      setActiveChatId(newSession._id)
      // Clear messages and set initial assistant message for the new chat
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm your AI assistant. How can I help you today?",
        },
      ])
      setShowSessions(false) // Close sessions sidebar
      setToolRecommendations([]) // Clear recommendations
      await refetchSessions() // Refetch sessions to update the list
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
    // Prevent the default browser behavior of scrolling the focused element into view
    e.preventDefault();
    // Optional: Stop propagation if needed, though preventDefault is usually sufficient
    // e.stopPropagation();

    // Explicitly scroll the messages area to the bottom
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }


  // If not open and not relative to parent, don't render (original modal behavior)
  // If relative to parent, always render but parent controls visibility
  if (!isOpen && !isRelativeToParent) return null

  // Determine if either chat completion or direct search is loading
  const isLoading = chatCompletion.isPending || isDirectSearchLoading || isLoadingMessages;


  return (
      // Main container div - conditionally styled
      <div
          ref={chatRef} // Attach ref here
          className={clsx(
              "rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out w-full",
              {
                // Styles for the fixed modal view
                // Removed bg-opacity-20 for opaque overlay
                "fixed inset-0 z-50 flex items-center justify-center bg-black p-4": !isRelativeToParent,
                "max-w-2xl": !isRelativeToParent, // Max width for modal
                // Styles for the embedded view within a parent container
                "relative": isRelativeToParent, // Position relative to parent
                // Adjusted height for embedded view - h-full takes parent height
                "h-full": isRelativeToParent, // Use h-full when embedded
                "overflow-hidden": isRelativeToParent, // Hide overflow if content exceeds height
              }
          )}
          // Prevent click outside from closing when embedded
          onClick={(e) => {
            if (!isRelativeToParent) {
              // Only stop propagation if it's the modal view
              e.stopPropagation();
            }
          }}
          // Apply position style only if chatPosition is set (for modal)
          style={!isRelativeToParent && chatPosition ? {
            position: 'fixed', // Ensure it's fixed for modal
            top: `${chatPosition.top}px`,
            left: `${chatPosition.left}px`,
            transform: "none", // Override potential parent transforms
          } : {}} // Empty style object if not modal or no position set
      >
        {/* Removed fixed height from this inner div */}
        <div className="flex h-full flex-col rounded-xl border border-gray-200"> {/* Use h-full to fill parent height */}
          {/* Error Banner */}
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between flex-shrink-0"> {/* Added flex-shrink-0 */}
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-xs text-amber-700">{error}</span>
            </div>
            <button
                onClick={(e) => {
                  e.stopPropagation()
                  setError(null)
                }}
                className="text-xs text-purple-600 hover:text-purple-700"
            >
              Dismiss
            </button>
          </div>


          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 flex-shrink-0"> {/* Added flex-shrink-0 */}
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-base font-semibold text-gray-800">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Show Sessions button only in modal view */}
              {!isRelativeToParent && (
                  <button
                      onClick={() => setShowSessions(!showSessions)}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
              )}
              {/* Close button - always visible */}
              <button
                  onClick={onClose} // Calls the onClose prop from the parent
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X size={20} /> {/* Use X icon */}
                <span className="sr-only">Close chat</span>
              </button>
            </div>
          </div>

          {/* Chat sessions sidebar (ONLY in modal view) */}
          {showSessions && !isRelativeToParent && (
              <div className="absolute top-14 right-0 z-10 w-64 bg-white border border-gray-200 rounded-bl-lg shadow-lg max-h-[calc(100%-4rem)] overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-700">Chat History</h3>
                </div>
                <div className="p-2">
                  <button
                      onClick={handleNewChat} // Use the handler function directly
                      className="flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-2 text-purple-600" />
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
                              onClick={() => handleSelectSession(session._id)}
                              className={`flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded-md ${
                                  activeChatId === session._id ? "bg-purple-50 text-purple-700" : ""
                              }`}
                          >
                            <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="truncate">{session.title}</span>
                          </button>
                      ))
                  )}
                </div>
              </div>
          )}

          {/* Chat messages area - flex-1 to take remaining height */}
          {/* Added messagesAreaRef */}
          <div ref={messagesAreaRef} className="flex-1 overflow-y-auto p-4 text-sm">
            {/* Loading spinner for messages area */}
            {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className="mb-4 flex justify-start">
                      {/* Only show AI Assistant label for the first message in the modal view */}
                      {message.role === "assistant" && index === 0 && !isRelativeToParent && (
                          <div className="mb-1 text-xs text-gray-600 font-medium absolute -top-5 left-0">AI Assistant</div>
                      )}
                      <div
                          className={clsx(
                              "rounded-lg p-3 max-w-[80%]",
                              message.role === "user" ? "bg-purple-600 text-white ml-auto" : "bg-gray-100 text-gray-800",
                              // Adjust positioning for the first assistant message based on view mode
                              message.role === "assistant" && index === 0 && !isRelativeToParent && "relative mt-5",
                              message.role === "assistant" && index === 0 && isRelativeToParent && "mt-0", // No extra margin top when embedded
                          )}
                      >
                        {/* Render message content */}
                        {message.content}

                        {/* Add search results button if this message has search results (from LLM, showing popup) */}
                        {/* This button is for LLM responses that trigger the popup, distinct from embedded search results */}
                        {message.role === "assistant" && (message as any).hasSearchResults && ( // Cast to any to access hasSearchResults if not in Message type
                            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <button
                                  onClick={() => {
                                    // Store the formatted data in sessionStorage before navigating
                                    if ((message as any).formattedData) { // Cast to any
                                      try {
                                        sessionStorage.setItem("chatResponseTools", JSON.stringify((message as any).formattedData)) // Cast to any
                                        console.log("ChatInterface: LLM search data successfully stored in sessionStorage")
                                      } catch (error) {
                                        console.error("ChatInterface: Error storing LLM search data in sessionStorage:", error)
                                      }
                                    }
                                    router.push("/search?source=chat-llm-popup") // Navigate to search page with specific source
                                  }}
                                  className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                              >
                                <Search className="h-4 w-4 mr-1" />
                                View search results (from AI)
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                ))
            )}
            {/* Loading spinner for chat completion or direct search */}
            {isLoading && (
                <div className="mr-auto max-w-[80%]">
                  <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3 text-gray-800">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
            )}
            <div ref={chatEndRef} /> {/* Scroll end marker */}
          </div>

          {/* Tool Recommendations */}
          {toolRecommendations.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3 flex-shrink-0"> {/* Added flex-shrink-0 */}
                <p className="mb-2 text-xs text-gray-500">Recommendations:</p>
                <div className="flex flex-wrap gap-2">
                  {toolRecommendations.map((tool, index) => (
                      <button
                          key={index}
                          onClick={() => handleToolRecommendationClick(tool)} // Use the handler function
                          className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 transition-colors"
                      >
                        {tool}
                      </button>
                  ))}
                </div>
              </div>
          )}
          {/* Input area */}
          <div className="border-t border-gray-100 p-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    ref={inputRef} // Attach the inputRef passed from the parent
                    type="text"
                    placeholder="Ask me anything..."
                    className="w-full rounded-full border-gray-300 pl-10 pr-4 text-sm focus:border-purple-500 focus:ring-purple-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        // Decide whether to do chat completion or direct search on Enter
                        // For now, let's make Enter trigger regular chat completion
                        handleSendMessage();
                      }
                    }}
                    onFocus={handleInputFocus} // Add this handler to prevent default scroll and scroll messages area
                    disabled={isLoading} // Disable input while loading
                />
              </div>

              {/* Send Button (for LLM chat) */}
              <Button
                  onClick={() => handleSendMessage()} // Call handleSendMessage for LLM chat
                  className="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={isLoading || !input.trim()} // Disable if loading or input is empty
              >
                Send <Send className="ml-1 h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>

              {/* Direct Search Button */}
              {/* Only show direct search button in modal view */}
              {!isRelativeToParent && (
                  <Button
                      onClick={handleDirectSearch} // Call the handleDirectSearch function
                      className="rounded-full bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={isLoading || !input.trim()} // Disable if loading or input is empty
                      title="Search directly"
                  >
                    <Search className="h-4 w-4" />search directly
                    <span className="sr-only">Search directly</span>
                  </Button>
              )}
            </div>
          </div>
        </div>
        {/* Chat Response Popup - Keep this as it's a separate modal for LLM results */}
        {showResponsePopup && (
            <ChatResponsePopup
                message={popupContent.message}
                formattedData={popupContent.formattedData}
                onClose={() => setShowResponsePopup(false)}
            />
        )}
      </div>
  )
}
