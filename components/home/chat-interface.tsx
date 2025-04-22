"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Search, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useChatCompletion, useChatSuggestions } from "@/hooks/use-chat"
import type { Message } from "@/services/chat-service"

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  inputRef: React.RefObject<HTMLInputElement> // Ref to the chat input
  isRelativeToParent?: boolean
}

export default function ChatInterface({ isOpen, onClose, inputRef, isRelativeToParent = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null) // Ref for the main chat box div
  const router = useRouter()

  // Use the chat API
  const chatCompletion = useChatCompletion()
  const { data: suggestionsData } = useChatSuggestions()
  const suggestions = suggestionsData || [
    "How is AI affecting my business?",
    "Want only tools with a free plan?",
    "Looking for video-focused tools?",
    "Show me e-commerce AI tools",
  ]

  // Use the click outside hook
  useClickOutside(chatRef as React.RefObject<HTMLElement>, onClose)

  // Effect to add initial assistant message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            'Hi! I\'m your AI assistant. I can help you find the perfect AI tools for your needs. Try asking me something like "How is AI affecting my business?" or click one of the example prompts below.',
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      // Use a small timeout to ensure the element is rendered and positioned
      const timer = setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        inputRef.current?.focus() // Focus the input after scrolling
      }, 50) // Adjust delay if needed

      return () => clearTimeout(timer) // Cleanup the timer
    }
  }, [isOpen, inputRef]) // Depends on isOpen and inputRef

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const allMessages = [...messages, userMessage]
      const response = await chatCompletion.mutateAsync(allMessages)

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

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = { role: "user", content: suggestion }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const allMessages = [...messages, userMessage]
      const response = await chatCompletion.mutateAsync(allMessages)

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

  if (!isOpen) return null // Don't render if not open

  return (
    <div
      ref={chatRef} // Attach the ref to the main chat box div
      className={clsx(
        "rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out",
        !isRelativeToParent && "absolute left-0 right-0 top-0 z-50 mx-auto mt-20 max-w-lg md:max-w-2xl",
        isRelativeToParent && "absolute top-0 w-full z-50", // This positions it relative to the parent in Hero
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex h-[400px] flex-col rounded-xl border border-gray-200">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-purple-600" />
            <span className="ml-2 text-base font-semibold text-gray-800">AI Assistant</span>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
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

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 text-sm">
          {messages.map((message, index) => (
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
          ))}
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
        {messages.length <= 2 && (
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
  )
}
