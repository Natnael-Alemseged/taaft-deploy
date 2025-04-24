"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Search, Bot, Plus, MessageSquare, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"
import { useClickOutside } from "@/hooks/use-click-outside"
import {
  useChatCompletion,
  useChatSuggestions,
  useChatSessions,
  useChatSessionMessages,
  useCreateChatSession,
} from "@/hooks/use-chat"
import type { Message } from "@/services/chat-service"
import websocketService from "@/services/websocket-service"

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  inputRef: React.RefObject<HTMLInputElement> // Ref to the chat input
  isRelativeToParent?: boolean
}

export default function ChatInterface({ isOpen, onClose, inputRef, isRelativeToParent = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showSessions, setShowSessions] = useState(false)
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected")
  const [chatPosition, setChatPosition] = useState<{ top: number; left: number } | null>(null)
  const [isFallbackMode, setIsFallbackMode] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null) // Ref for the main chat box div
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Use the chat API
  const chatCompletion = useChatCompletion()
  const { data: suggestionsData } = useChatSuggestions()
  const { data: chatSessions, isLoading: isLoadingSessions, refetch: refetchSessions } = useChatSessions()
  const { data: sessionMessages, isLoading: isLoadingMessages } = useChatSessionMessages(
    activeChatId || "",
    !!activeChatId,
  )
  const createChatSession = useCreateChatSession()

  const suggestions = suggestionsData || [
    "How is AI affecting my business?",
    "Want only tools with a free plan?",
    "Looking for video-focused tools?",
    "Show me e-commerce AI tools",
  ]

  // Use the click outside hook
  useClickOutside(chatRef as React.RefObject<HTMLElement>, onClose)

  // Effect to initialize WebSocket connection and listeners
  useEffect(() => {
    if (isOpen) {
      // Connect to WebSocket
      websocketService.connect().catch(console.error)

      // Set up WebSocket event listeners
      const handleConnectionChange = () => {
        setConnectionStatus(websocketService.getConnectionState())
        setIsFallbackMode(websocketService.isFallbackMode())
      }

      const handleChatResponseChunk = (data: any) => {
        if (data.type === "chat_response_chunk" && data.chat_id === activeChatId) {
          // Update the last assistant message with the new chunk
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1]
            if (lastMessage && lastMessage.role === "assistant") {
              // Update the last message
              const updatedMessages = [...prevMessages]
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + data.content_chunk,
              }
              return updatedMessages
            } else {
              // Add a new assistant message
              return [...prevMessages, { role: "assistant", content: data.content_chunk }]
            }
          })
        }
      }

      // Listen for connection events
      websocketService.on("connected", handleConnectionChange)
      websocketService.on("disconnected", handleConnectionChange)
      websocketService.on("reconnecting", handleConnectionChange)
      websocketService.on("failed", handleConnectionChange)

      // Listen for chat response chunks
      websocketService.on("chat_response_chunk", handleChatResponseChunk)

      // Check initial state
      setConnectionStatus(websocketService.getConnectionState())
      setIsFallbackMode(websocketService.isFallbackMode())

      // Authenticate user if access token exists
      const accessToken = localStorage.getItem("access_token")
      const userDataStr = localStorage.getItem("user")

      if (accessToken && userDataStr) {
        const userData = JSON.parse(userDataStr)
        websocketService.authenticateUser(userData.id, accessToken).catch(console.error)
      }

      // Cleanup function
      return () => {
        websocketService.off("connected", handleConnectionChange)
        websocketService.off("disconnected", handleConnectionChange)
        websocketService.off("reconnecting", handleConnectionChange)
        websocketService.off("failed", handleConnectionChange)
        websocketService.off("chat_response_chunk", handleChatResponseChunk)
      }
    }
  }, [isOpen, activeChatId])

  // Effect to load messages from active chat session
  useEffect(() => {
    if (sessionMessages && activeChatId) {
      setMessages(sessionMessages)
    }
  }, [sessionMessages, activeChatId])

  // Effect to add initial assistant message when chat opens with no active session
  useEffect(() => {
    if (isOpen && messages.length === 0 && !activeChatId && !isLoadingMessages) {
      setMessages([
        {
          role: "assistant",
          content:
            'Hi! I\'m your AI assistant. I can help you find the perfect AI tools for your needs. Try asking me something like "How is AI affecting my business?" or click one of the example prompts below.',
        },
      ])
    }
  }, [isOpen, messages.length, activeChatId, isLoadingMessages])

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

  // Handle retrying WebSocket connection
  const handleRetryConnection = () => {
    websocketService.resetFallbackMode()
    setConnectionStatus("connecting")
    setIsFallbackMode(false)
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      // Create a new chat session if none is active
      let chatId = activeChatId
      if (!chatId) {
        // Create a temporary chat ID
        chatId = `chat_${Date.now()}`
        setActiveChatId(chatId)

        // Create a new chat session in the background
        try {
          const newSession = await createChatSession.mutateAsync(input.substring(0, 50))
          setActiveChatId(newSession.id)
          chatId = newSession.id
          refetchSessions() // Refresh the sessions list
        } catch (error) {
          console.error("Failed to create chat session:", error)
          // Continue with temporary chat ID
        }
      }

      // Send the message via WebSocket or fallback
      const allMessages = [...messages, userMessage]
      const response = await chatCompletion.mutateAsync({ messages: allMessages, chatId })

      // Check if response contains navigation command
      const responseContent = response.message.content
      const navigationMatch = responseContent.match(/NAVIGATE_TO:([^\s]+)/)

      if (navigationMatch && navigationMatch[1]) {
        // Extract navigation path
        const navigationPath = navigationMatch[1]

        // Add the response message with the navigation instruction stripped out
        const cleanResponse = responseContent.replace(/NAVIGATE_TO:[^\s]+\s*/, "")
        setMessages((prev) => [...prev, { ...response.message, content: cleanResponse }])

        // Navigate after a short delay
        setTimeout(() => {
          onClose()
          router.push(navigationPath)
        }, 1000)
      } else {
        setMessages((prev) => [...prev, response.message])
      }
    } catch (error) {
      console.error("Error in chat completion:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again or ask a different question.",
        },
      ])
    }
  }

  // Handle clicking on a suggestion
  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = { role: "user", content: suggestion }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      // Create a new chat session if none is active
      let chatId = activeChatId
      if (!chatId) {
        // Create a temporary chat ID
        chatId = `chat_${Date.now()}`
        setActiveChatId(chatId)

        // Create a new chat session in the background
        try {
          const newSession = await createChatSession.mutateAsync(suggestion.substring(0, 50))
          setActiveChatId(newSession.id)
          chatId = newSession.id
          refetchSessions() // Refresh the sessions list
        } catch (error) {
          console.error("Failed to create chat session:", error)
          // Continue with temporary chat ID
        }
      }

      // Send the message via WebSocket or fallback
      const allMessages = [...messages, userMessage]
      const response = await chatCompletion.mutateAsync({ messages: allMessages, chatId })

      // Check if response contains navigation command
      const responseContent = response.message.content
      const navigationMatch = responseContent.match(/NAVIGATE_TO:([^\s]+)/)

      if (navigationMatch && navigationMatch[1]) {
        // Extract navigation path
        const navigationPath = navigationMatch[1]

        // Add the response message with the navigation instruction stripped out
        const cleanResponse = responseContent.replace(/NAVIGATE_TO:[^\s]+\s*/, "")
        setMessages((prev) => [...prev, { ...response.message, content: cleanResponse }])

        // Navigate after a short delay
        setTimeout(() => {
          onClose()
          router.push(navigationPath)
        }, 1000)
      } else {
        setMessages((prev) => [...prev, response.message])
      }
    } catch (error) {
      console.error("Error in chat completion:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again or ask a different question.",
        },
      ])
    }
  }

  // Handle selecting a chat session
  const handleSelectSession = (sessionId: string) => {
    setActiveChatId(sessionId)
    setShowSessions(false)
  }

  // Handle creating a new chat
  const handleNewChat = () => {
    setActiveChatId(null)
    setMessages([
      {
        role: "assistant",
        content:
          'Hi! I\'m your AI assistant. I can help you find the perfect AI tools for your needs. Try asking me something like "How is AI affecting my business?" or click one of the example prompts below.',
      },
    ])
    setShowSessions(false)
    setIsCreatingNewChat(true)
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div
      ref={chatContainerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20"
      onClick={onClose}
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
                transform: "none", // Override any transform
              }
            : {}
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[500px] flex-col rounded-xl border border-gray-200">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-base font-semibold text-gray-800">AI Assistant</span>
              {isFallbackMode ? (
                <div className="ml-2 flex items-center text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span className="mr-2">Using fallback mode</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRetryConnection()
                    }}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : (
                connectionStatus !== "connected" && (
                  <span className="ml-2 text-xs text-yellow-500">
                    {connectionStatus === "connecting"
                      ? "Connecting..."
                      : connectionStatus === "reconnecting"
                        ? "Reconnecting..."
                        : connectionStatus === "failed"
                          ? "Connection failed"
                          : "Offline"}
                  </span>
                )
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSessions(!showSessions)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
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
                  onClick={handleNewChat}
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
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded-md ${
                        activeChatId === session.id ? "bg-purple-50 text-purple-700" : ""
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
                <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && index === 0 && (
                    <div className="mb-1 text-xs text-gray-600 font-medium absolute -top-5 left-0">AI Assistant</div>
                  )}
                  <div
                    className={clsx(
                      "rounded-lg p-3 max-w-[80%]",
                      message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800",
                      message.role === "assistant" && index === 0 && "relative mt-5",
                    )}
                  >
                    {message.content}
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

          {/* Suggestions */}
          {messages.length <= 2 && !activeChatId && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="mb-2 text-xs text-gray-500">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
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
                      e.preventDefault() // Prevent form submission
                      handleSendMessage()
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                className="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                disabled={chatCompletion.isPending || !input.trim()}
              >
                Send <Send className="ml-1 h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
