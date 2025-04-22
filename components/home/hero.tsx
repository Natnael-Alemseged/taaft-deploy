"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "./chat-interface"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null) // Keep this ref

  // Ref for the container holding the search/chat (still needed for min-height)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const exampleTags = [
    "Image generation tools",
    "AI writing assistants",
    "Video creation tools",
    "E-commerce AI tools",
    "AI voice assistants",
  ]

  // --- MODIFIED EFFECT ---
  // Only sets focus on the initial input if the chat is NOT open.
  // The scroll and focus for the chat are moved to ChatInterface.
  useEffect(() => {
    // This effect now just ensures the main input gets focus if chat isn't open
    // (though the onFocus on the Input element also handles this).
    // The scroll and focus for the chat box are handled inside ChatInterface.
  }, []) // This effect probably doesn't need dependencies or can be removed if onFocus is sufficient.

  const handleSearchFocus = () => {
    setIsChatOpen(true)
    // The scrolling will be triggered by the 'isOpen' state change in ChatInterface's effect
  }

  const chatOpenMinHeight = "min-h-[432px]" // Keep this for spacing

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
          <div
            ref={searchContainerRef} // Keep ref and conditional min-height
            className={`relative mx-auto mb-8 max-w-2xl ${isChatOpen ? chatOpenMinHeight : ""}`}
          >
            {!isChatOpen ? (
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="What AI tool are you looking for? E.g., 'Image generator for marketing'"
                  className="h-14 rounded-full border-gray-200 pl-12 pr-32 shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus} // This still triggers setIsChatOpen(true)
                />
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Button
                  className="absolute right-2 top-2 h-10 rounded-full bg-purple-600 px-6 text-sm hover:bg-purple-700"
                  onClick={handleSearchFocus}
                >
                  Search
                </Button>
              </div>
            ) : (
              <ChatInterface
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                inputRef={chatInputRef as React.RefObject<HTMLInputElement>} // Pass the chatInputRef down
                isRelativeToParent
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
