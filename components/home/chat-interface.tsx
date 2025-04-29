"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Search, Bot, Plus, MessageSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useChatCompletion, useChatSessions, useChatSessionMessages, useCreateChatSession } from "@/hooks/use-chat"
import type { Message } from "@/services/chat-service"

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  inputRef: React.RefObject<HTMLInputElement>
  isRelativeToParent?: boolean
}

interface ChatResponsePopupProps {
  message: string
  formattedData?: any
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
      router.replace("/search?source=chat")

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-800 mb-4">{message}</p>

        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleGoToTools} className="bg-purple-600 hover:bg-purple-700 text-white">
            Go to Tools
          </Button>
        </div>
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
  const [chatPosition, setChatPosition] = useState<{ top: number; left: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toolRecommendations, setToolRecommendations] = useState<any[]>([])

  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Use the chat API
  const chatCompletion = useChatCompletion()
  const { data: chatSessions, isLoading: isLoadingSessions, refetch: refetchSessions } = useChatSessions()
  const { data: sessionMessages, isLoading: isLoadingMessages } = useChatSessionMessages(
    activeChatId || "",
    !!activeChatId,
  )
  const createChatSession = useCreateChatSession()

  // Check for existing sessions first
  useEffect(() => {
    if (isOpen && !activeChatId && !isLoadingMessages) {
      console.log("Checking for existing chat sessions")
      refetchSessions()
        .then((result) => {
          if (result.data && result.data.length > 0) {
            // Use the most recent session
            const mostRecentSession = result.data[0]
            console.log(`Using existing session: ${mostRecentSession._id}`)
            setActiveChatId(mostRecentSession._id)
            // Messages will be loaded via the useChatSessionMessages hook
          } else {
            console.log("No existing sessions found, will create a new one when needed")
            setMessages([
              {
                role: "assistant",
                content: "Hi! I'm your AI assistant. How can I help you today?",
              },
            ])
          }
        })
        .catch((err) => {
          console.error("Error checking for existing sessions:", err)
          setMessages([
            {
              role: "assistant",
              content: "Hi! I'm your AI assistant. How can I help you today?",
            },
          ])
        })
    }
  }, [isOpen, activeChatId, isLoadingMessages, refetchSessions])

  // Use the click outside hook
  useClickOutside(chatRef as React.RefObject<HTMLElement>, onClose)

  // Effect to load messages from active chat session
  useEffect(() => {
    if (sessionMessages && activeChatId) {
      setMessages(sessionMessages)
    }
  }, [sessionMessages, activeChatId])

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Effect to center the chat interface when it opens
  useEffect(() => {
    if (isOpen) {
      // Center the chat interface in the viewport
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
    }
  }, [isOpen, inputRef])

// Add this effect after the other useEffect hooks to handle pending messages
  useEffect(() => {
    if (isOpen && !isLoadingMessages && messages.length > 0) {
      const pendingMessage = sessionStorage.getItem("pendingChatMessage")
      if (pendingMessage) {
        // Clear the pending message first to prevent infinite loop
        sessionStorage.removeItem("pendingChatMessage")

        const sendPendingMessage = async () => {
          if (!activeChatId) {
            try {
              const sessionTitle = pendingMessage.substring(0, 50) || "New Chat"
              const newSession = await createChatSession.mutateAsync(sessionTitle)
              setActiveChatId(newSession._id)
              await refetchSessions()
              await handleSendMessage(pendingMessage)
            } catch (error) {
              console.error("Failed to create session for pending message:", error)
            }
          } else {
            await handleSendMessage(pendingMessage)
          }
        }

        sendPendingMessage()
      }
    }
  }, [isOpen, activeChatId, isLoadingMessages, messages.length])





  // Handle sending a message
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
      if (!chatId) {
        console.log("No active chat ID, creating new session")
        try {
          const sessionTitle = messageContent.substring(0, 50) || "New Chat"
          const newSession = await createChatSession.mutateAsync(sessionTitle)
          console.log("New session created:", newSession._id)
          setActiveChatId(newSession._id)
          chatId = newSession._id
          await refetchSessions()
        } catch (sessionError) {
          console.error("Failed to create chat session:", sessionError)
          setError("Failed to create a new chat session. Please try again.")
          return
        }
      }

      console.log(`Sending message to chat ID: ${chatId}`)

      const response = await chatCompletion.mutateAsync({
        sessionId: chatId,
        message: messageContent,
        model: "gpt4",
        systemPrompt: "You are a helpful assistant.",
      })

      console.log("Response received:", response)

      // Extract options if present in the message content
      let options: string[] = []
      const rawResponseMessage = response.message.content
      const optionsPattern = "options ="
      const optionsIndex = rawResponseMessage.indexOf(optionsPattern)

      if (optionsIndex !== -1) {
        // Extract the part after "options ="
        const optionsStringRaw = rawResponseMessage.substring(optionsIndex + optionsPattern.length)

        // Trim whitespace from both ends first
        let cleanedOptionsString = optionsStringRaw.trim()

        // Now remove the leading '[' and trailing ']' if they exist
        if (cleanedOptionsString.startsWith("[") && cleanedOptionsString.endsWith("]")) {
          cleanedOptionsString = cleanedOptionsString.substring(1, cleanedOptionsString.length - 1).trim()
        } else if (cleanedOptionsString.startsWith("[")) {
          cleanedOptionsString = cleanedOptionsString.substring(1).trim()
        } else if (cleanedOptionsString.endsWith("]")) {
          cleanedOptionsString = cleanedOptionsString.substring(0, cleanedOptionsString.length - 1).trim()
        }

        // Split by comma, trim, and remove quotes from each option
        options = cleanedOptionsString
          .split(",")
          .map((option) => option.trim().replace(/'/g, "").replace(/"/g, "").replace(/\]$/, ""))
          .filter((option) => option.length > 0) // Filter out any empty strings

        // Set the tool recommendations
        if (options.length > 0) {
          setToolRecommendations(options)
        }

        // Clean the message content (remove "options = ..." part)
        const cleanedMessage = rawResponseMessage.substring(0, optionsIndex).trim()
        response.message.content = cleanedMessage
      }

      // Check for formatted_data in the response
      if (response.data?.formatted_data && Array.isArray(response.data.formatted_data.hits)) {
        // Store the formatted data in sessionStorage for the search page to access
        try {
          sessionStorage.setItem("chatResponseTools", JSON.stringify(response.data.formatted_data))
          console.log("Data successfully stored in sessionStorage")
        } catch (error) {
          console.error("Error storing data in sessionStorage:", error)
        }

        // Add the message with a special flag for UI rendering
        setMessages((prev) => [
          ...prev,
          {
            ...response.message,
            hasSearchResults: true,
            formattedData: response.data.formatted_data,
          },
        ])
      } else {
        setMessages((prev) => [...prev, response.message])
      }

      // Use the tool recommendations from the response if available
      if (response.toolRecommendations && response.toolRecommendations.length > 0) {
        console.log("Tool recommendations received from response:", response.toolRecommendations)
        setToolRecommendations(response.toolRecommendations)
      } else if (options.length > 0) {
        console.log("Tool recommendations extracted from message:", options)
        setToolRecommendations(options)
      }
    } catch (error) {
      console.error("Error in chat completion:", error)
      setError("Sorry, I couldn't process your request. Please try again later.")
    }
  }

  // Handle selecting a chat session
  const handleSelectSession = (sessionId: string) => {
    setActiveChatId(sessionId)
    setShowSessions(false)
    setToolRecommendations([])
  }

  // Handle creating a new chat
  const handleNewChat = async () => {
    try {
      const newSession = await createChatSession.mutateAsync("New Chat")
      setActiveChatId(newSession._id)
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm your AI assistant. How can I help you today?",
        },
      ])
      setShowSessions(false)
      setToolRecommendations([])
      await refetchSessions()
    } catch (error) {
      console.error("Failed to create new chat:", error)
      setError("Failed to create a new chat. Please try again.")
    }
  }

  // Handle tool recommendation click
  const handleToolRecommendationClick = async (tool: string) => {
    // Send the recommendation text as a message
    // Wrap in a block to ensure the handler returns void for onClick
    handleSendMessage(tool)
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div
      ref={chatContainerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20"
      // onClick={onClose} // Removing this to prevent closing when clicking the overlay
    >
      <div
        ref={chatRef}
        className="rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out w-full max-w-2xl"
        style={
          chatPosition
            ? {
                position: "fixed",
                top: `${chatPosition.top}px`,
                left: `${chatPosition.left}px`,
                transform: "none",
              }
            : {}
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[500px] flex-col rounded-xl border border-gray-200">
          {/* Error Banner */}
          {error && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
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
          )}

          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-base font-semibold text-gray-800">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSessions(!showSessions)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={onClose} // This is fine as onClose is () => void
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Chat sessions sidebar */}
          {showSessions && (
            <div className="absolute top-14 right-0 z-10 w-64 bg-white border border-gray-200 rounded-bl-lg shadow-lg max-h-[calc(100%-4rem)] overflow-y-auto">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-medium text-gray-700">Chat History</h3>
              </div>
              <div className="p-2">
                <button
                  // Corrected: Use block body for async handler in onClick
                  onClick={() => {
                    handleNewChat()
                  }}
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
                      // This handler is not async, so () => ... is fine
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

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 text-sm">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="mb-4 flex justify-start">
                  {message.role === "assistant" && index === 0 && (
                    <div className="mb-1 text-xs text-gray-600 font-medium absolute -top-5 left-0">AI Assistant</div>
                  )}
                  <div
                    className={clsx(
                      "rounded-lg p-3 max-w-[80%]",
                      message.role === "user" ? "bg-purple-600 text-white ml-auto" : "bg-gray-100 text-gray-800",
                      message.role === "assistant" && index === 0 && "relative mt-5",
                    )}
                  >
                    {message.content}

                    {/* Add search results button if this message has search results */}
                    {message.role === "assistant" && message.hasSearchResults && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => {
                            // Store the formatted data in sessionStorage before navigating
                            if (message.formattedData) {
                              try {
                                sessionStorage.setItem("chatResponseTools", JSON.stringify(message.formattedData))
                                console.log("Data successfully stored in sessionStorage")
                              } catch (error) {
                                console.error("Error storing data in sessionStorage:", error)
                              }
                            }
                            router.push("/search?source=chat")
                          }}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                        >
                          <Search className="h-4 w-4 mr-1" />
                          View search results
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {chatCompletion.isPending && (
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
            <div ref={chatEndRef} />
          </div>

          {/* Tool Recommendations */}
          {toolRecommendations.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="mb-2 text-xs text-gray-500">Recommendations:</p>
              <div className="flex flex-wrap gap-2">
                {toolRecommendations.map((tool, index) => (
                  <button
                    key={index}
                    // Corrected: Use block body for async handler in onClick
                    onClick={() => {
                      handleToolRecommendationClick(tool)
                    }}
                    className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Input area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full rounded-full border-gray-300 pl-10 pr-4 text-sm focus:border-purple-500 focus:ring-purple-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  handleSendMessage()
                }}
                className="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                disabled={chatCompletion.isPending || !input.trim()}
              >
                Send <Send className="ml-1 h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
              <Button
                  onClick={() => {

                    //todo implement getting from tool
                    router.push("/search?q=" + encodeURIComponent(input.trim()))
                  }}
                  className="rounded-full bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={!input.trim()}
                  title="Search directly"
              >
                <Search className="h-4 w-4" />search directly
                <span className="sr-only">Search directly</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
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
