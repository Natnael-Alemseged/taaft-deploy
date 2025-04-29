"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "./chat-interface"
import { useAuth } from "@/contexts/auth-context"
import { showLoginModal } from "@/lib/auth-events"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()

  const exampleTags = [
    "Image generation tools",
    "AI writing assistants",
    "Video creation tools",
    "E-commerce AI tools",
    "AI voice assistants",
  ]

  // Update the handleSearchFocus function to accept an optional message parameter
  const handleSearchFocus = (exampleMessage?: string | React.FocusEvent | React.MouseEvent) => {
    if (!isAuthenticated) {
      showLoginModal()
      return
    }

    setIsChatOpen(true)

    // Only process example message if it's a string
    if (typeof exampleMessage === 'string') {
      console.log(`example message is ${exampleMessage}`)

      sessionStorage.removeItem("pendingChatMessage")
      sessionStorage.setItem("shouldCreateNewSession", "true")
      sessionStorage.setItem("pendingChatMessage", exampleMessage)
    }
  }

  // Close chat if user logs out while it's open
  useEffect(() => {
    if (!isAuthenticated && isChatOpen) {
      setIsChatOpen(false)
    }
  }, [isAuthenticated, isChatOpen])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-purple-100 py-24 text-center">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Top badge */}
          <div className="mb-3 flex items-center justify-center">
            <div className="rounded-full bg-purple-100 px-4 py-1 text-xs font-medium text-purple-600">
              ✨ Find the perfect AI tool for any task
            </div>
          </div>

          {/* Headings */}
          <h1 className="text-4xl font-bold text-purple-500 md:text-5xl">AI Tools Discovery</h1>
          <h2 className="mb-6 text-5xl font-extrabold text-gray-900 md:text-6xl flex justify-center items-center">
            Platform
            <div className="relative inline-block w-10 h-10 ml-2 md:w-12 md:h-12 md:ml-3">
              <div
                className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500 opacity-75"
                style={{ transform: "translate(15%, 15%)" }}
              ></div>
              <div
                className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-400"
                style={{ transform: "translate(-15%, -15%)" }}
              ></div>
            </div>
          </h2>

          {/* Subheading */}
          <p className="mb-10 text-lg text-gray-600">
            Your one-stop directory to find, compare, and use the best AI tools for any task.
          </p>

          {/* Search bar / Chat Interface container */}
          <div ref={searchContainerRef} className="relative mx-auto mb-8 max-w-2xl">
            {!isChatOpen ? (
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="What AI tool are you looking for? E.g., 'Image generator for marketing'"
                  className="h-14 rounded-full border-gray-200 pl-12 pr-32 shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Button
                  className="absolute right-2 top-2 h-10 rounded-full bg-purple-600 px-6 text-sm hover:bg-purple-700"
                  onClick={handleSearchFocus}
                >
                  Search
                </Button>
              </div>
            ) : null}

            {/* Chat Interface - only show if authenticated */}
            {isAuthenticated && (
              <ChatInterface
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                inputRef={chatInputRef as React.RefObject<HTMLInputElement>}
                isRelativeToParent={false}
              />
            )}
          </div>

          {/* Example buttons */}
            <div className="mb-2 text-sm text-gray-500">💡 Try these examples:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {exampleTags.slice(0, 3).map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  className="rounded-full border-gray-200 bg-white bg-gradient-to-br from-white via-purple-50 to-purple-100 text-xs text-gray-600 shadow-lg hover:bg-gray-50"
                  onClick={() => handleSearchFocus(example)}
                >
                  <span className="pr-2 text-purple-300">" </span>
                  {example}
                  <span className="pl-2 text-purple-300">" </span>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {exampleTags.slice(3).map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  className="rounded-full border-gray-200 bg-white bg-gradient-to-br from-white via-purple-50 to-purple-100 text-xs text-gray-600 shadow-lg hover:bg-gray-50"
                  onClick={() => handleSearchFocus(example)}
                >
                  <span className="pr-2 text-purple-300">" </span>
                  {example}
                  <span className="pl-2 text-purple-300">" </span>
                </Button>
              ))}
            </div>
          </div>
      </div>
    </section>
  )
}
