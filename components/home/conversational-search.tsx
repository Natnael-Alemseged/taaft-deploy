"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Search, Send, X, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
}

interface ConversationalSearchProps {
  onSearch: (query: string) => void
}

export function ConversationalSearch({ onSearch }: ConversationalSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    "How is AI affecting my business?",
    "Want only tools with a free plan?",
    "Looking for video-focused tools?",
  ]

  useEffect(() => {
    if (isExpanded && messages.length === 0) {
      // Add initial assistant message when first expanded
      setMessages([
        {
          id: "welcome",
          text: "Hi! I'm your AI assistant. I can help you find the perfect AI tools for your needs. Try asking me something like 'How is AI affecting my business?' or 'What are the best video tools?'",
          sender: "assistant",
        },
      ])
    }
  }, [isExpanded])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleExpand = () => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setMessages([])
    setInputValue("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user" as const,
    }

    setMessages((prev) => [...prev, userMessage])

    // Process the search
    onSearch(inputValue)

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        text: `Here are the best AI tools for "${inputValue}". I've found several options that might help you.`,
        sender: "assistant" as const,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)

    setInputValue("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message with the suggestion
    const userMessage = {
      id: `user-${Date.now()}`,
      text: suggestion,
      sender: "user" as const,
    }

    setMessages((prev) => [...prev, userMessage])

    // Process the search
    onSearch(suggestion)

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        text: `Here are the best AI tools for "${suggestion}". I've found several options that might help you.`,
        sender: "assistant" as const,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center bg-white rounded-full shadow-md overflow-hidden"
          >
            <div className="flex-grow">
              <div className="flex items-center pl-4">
                <Search className="w-5 h-5 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="What AI tool are you looking for? e.g., 'Image generator for marketing'"
                  className="w-full py-3 px-3 text-sm focus:outline-none"
                  onClick={handleExpand}
                  readOnly
                />
              </div>
            </div>
            <div className="px-2">
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full px-5">Search</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 60 }}
            animate={{ opacity: 1, height: 400 }}
            exit={{ opacity: 0, height: 60 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Bot className="w-5 h-5 text-[#a855f7] mr-2" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <button onClick={handleCollapse} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-[#a855f7] text-white rounded-tr-none"
                        : "bg-[#f5f0ff] text-[#111827] rounded-tl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-[#f5f0ff] text-[#6b7280] hover:bg-[#ede9fe] px-3 py-2 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-grow py-2 px-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent"
              />
              <Button
                type="submit"
                className="bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
