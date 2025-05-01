"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "./chat-interface"
import { useAuth } from "@/contexts/auth-context"
import { showLoginModal } from "@/lib/auth-events"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useClickOutside } from "@/hooks/use-click-outside"

// Types for API integration
interface Tool {
  id: number | string
  name: string
  description: string
  category: string
  icon?: string
}

interface SearchResponse {
  tools: Tool[]
  total: number
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tools, setTools] = useState<Tool[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchCommandRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()

  // Close search when clicking outside
  useClickOutside(searchCommandRef as React.RefObject<HTMLElement>, () => {
    if (isSearchOpen && !isChatOpen) {
      setIsSearchOpen(false)
    }
  })

  const exampleTags = [
    "Image generation tools",
    "AI writing assistants",
    "Video creation tools",
    "E-commerce AI tools",
    "AI voice assistants",
  ]

  // Sample AI tools data - replace with actual data from your API
  const sampleTools = [
    {
      id: 1,
      name: "Midjourney",
      description: "AI image generation tool for creative visuals",
      category: "Image Generation",
      icon: "🎨"
    },
    {
      id: 2,
      name: "ChatGPT",
      description: "Conversational AI assistant by OpenAI",
      category: "Chatbots",
      icon: "💬"
    },
    {
      id: 3,
      name: "Jasper",
      description: "AI writing assistant for marketing content",
      category: "Writing",
      icon: "✍️"
    },
    {
      id: 4,
      name: "Runway",
      description: "AI-powered video editing and generation",
      category: "Video Creation",
      icon: "🎥"
    }
  ]

  // Function to fetch tools from API
  const fetchTools = async (query: string) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/tools/search?q=${encodeURIComponent(query)}`)
      // const data: SearchResponse = await response.json()
      // setTools(data.tools)
      
      // Using sample data for now
      setTools(sampleTools)
    } catch (error) {
      console.error('Error fetching tools:', error)
      setTools([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchTools(searchQuery)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchFocus = () => {
    if (!isAuthenticated) {
      showLoginModal()
      return
    }
    setIsSearchOpen(true)
  }

  const handleChatOpen = () => {
    setIsSearchOpen(false)
    setIsChatOpen(true)
  }

  const handleClose = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
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
            {!isChatOpen && !isSearchOpen ? (
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
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-2">
                  <MessageSquare 
                    className="h-5 w-5 text-gray-400 cursor-pointer hover:text-purple-500 transition-colors"
                    onClick={handleChatOpen}
                  />
                  <Button
                    className="h-10 rounded-full bg-purple-600 px-6 text-sm hover:bg-purple-700"
                    onClick={handleSearchFocus}
                  >
                    Search
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Intermediate Search UI */}
            {isSearchOpen && !isChatOpen && (
              <div ref={searchCommandRef} className="w-full">
                <Command className="rounded-lg border shadow-md">
                  <div className="flex items-center border-b px-3 w-ull">
                 
                    <CommandInput 
                      placeholder="Search AI tools..." 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="flex-1"
                    />
               <Button
  size="icon"
  variant="ghost"
  className="rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
  onClick={handleChatOpen}
>
  <MessageSquare className="h-5 w-5" />
</Button>

                    <X
                      className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                      onClick={handleClose}
                    />
                  </div>
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                      ) : (
                        "No results found."
                      )}
                    </CommandEmpty>
                    <CommandGroup heading="AI Tools">
                      {tools.map((tool) => (
                        <CommandItem 
                          key={tool.id}
                          className="flex items-center justify-between p-2 cursor-pointer hover:bg-purple-50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{tool.icon}</span>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{tool.name}</span>
                              <span className="text-sm text-gray-500">{tool.description}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{tool.category}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  {/* Full-width action buttons */}
                  <div className="border-t p-2 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 hover:bg-purple-50"
                      onClick={handleClose}
                    >
                      <X className="h-4 w-4" />
                      Close
                    </Button>
                    <Button
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleChatOpen}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Ask AI Assistant
                    </Button>
                  </div>
                </Command>
              </div>
            )}

            {/* Chat Interface - only show if authenticated */}
            {isAuthenticated && (
              <ChatInterface
                isOpen={isChatOpen}
                onClose={() => {
                  setIsChatOpen(false)
                  setIsSearchOpen(false)
                }}
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
                onClick={() => {
                  setSearchQuery(example)
                  handleSearchFocus()
                }}
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
                onClick={() => {
                  setSearchQuery(example)
                  handleSearchFocus()
                }}
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
