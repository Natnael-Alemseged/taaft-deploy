"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, MessageSquare, X, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "./chat-interface"
import { useAuth } from "@/contexts/auth-context"
import { showLoginModal } from "@/lib/auth-events"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useClickOutside } from "@/hooks/use-click-outside"
import { FiSearch, FiMessageSquare, FiArrowRight, FiExternalLink } from 'react-icons/fi'; // Example icons, you might need to install react-icons
import { keywordSearch } from "@/services/chat-service"
import { useRouter } from "next/navigation"
import { robotSvg } from "@/lib/reusable_assets"
import { SignInModal } from "./sign-in-modal"
import {getTools} from "@/services/tool-service";

// Types for API integration
interface Tool {
  id: number | string
  name: string
  description: string
  categories: Category[] | null;
  icon?: string
  image?: string
}

interface Category {
  id: string;
  name: string;
}

interface SearchResponse {
  tools: Tool[]
  total: number
}


export default function Hero() {
  const router = useRouter();
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
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const onCloseCallbackRef = useRef<(() => void) | null>(null)
  const currentModalIdRef = useRef<string | null>(null)
  const openSignUpModal = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(true)
    setIsMobileMenuOpen(false)
  }


  const [previousRoute, setPreviousRoute] = useState<string | undefined>()
  function goToToolDetails(id: string | number): void {
    console.log("Calling goToToolDetails for ID:", id);
    console.log("Router object:", router); // <-- Add this line
    router.push(`/tools/${id}`);
  }

  // Close search when clicking outside
  useClickOutside(searchCommandRef as React.RefObject<HTMLElement>, () => {
    if (isSearchOpen && !isChatOpen) {
      setIsSearchOpen(false)
    }
  })


  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(false)
    setPreviousRoute(undefined)
    if (onCloseCallbackRef.current) {
      onCloseCallbackRef.current()
      onCloseCallbackRef.current = null
    }
    currentModalIdRef.current = null
  }

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
  // const fetchTools = async (query: string) => { // Added authToken parameter
  //   setIsLoading(true);
  //   try {
  //     // Optional: Add a check to ensure the token exists before making the request
  //     const data = await keywordSearch([query,],0,5);
  //
  //     setTools(data.tools);
  //   } catch (error) {
  //     console.error('Error fetching tools:', error);
  //     setTools([]); // Clear tools on error
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  const fetchTools = async (query: string) => {
    setIsLoading(true);
    setTools([]); // Clear previous results immediately

    try {
      console.log(`Attempting keyword search for: "${query}"`);
      // Attempt keyword search first
      const keywordData = await keywordSearch([query], 0, 5); // Assuming this takes an array of keywords

      if (keywordData && keywordData.tools && keywordData.tools.length > 0) {
        console.log(`Keyword search successful, found ${keywordData.tools.length} tools.`);
        setTools(keywordData.tools);
      } else {
        console.log(`Keyword search found no tools. Falling back to general search for: "${query}"`);
        // Fallback to general search if keyword search returned no tools or was empty
        try {
          const generalData = await getTools({ search: query }); // Use the getTools function with the search parameter
          console.log(`General search successful, found ${generalData.tools.length} tools.`);
          setTools(generalData.tools);
        } catch (generalError) {
          console.error('General search fallback failed:', generalError);
          setTools([]); // Clear tools on fallback error
          // Optionally show a toast error here if both methods failed
        }
      }
    } catch (keywordError) {
      console.error('Keyword search failed unexpectedly:', keywordError);
      console.log(`Keyword search failed. Falling back to general search for: "${query}"`);
      // Fallback to general search if keyword search threw an error
      try {
        const generalData = await getTools({ search: query });
        console.log(`General search successful, found ${generalData.tools.length} tools.`);
        setTools(generalData.tools);
      } catch (generalError) {
        console.error('General search fallback after keyword failure also failed:', generalError);
        setTools([]); // Clear tools if both fail
        // Optionally show a toast error here if both methods failed
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Debounced search effect
  useEffect(() => {


    
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchTools(searchQuery)
      } else {
        setTools([]) // Clear tools when search query is empty
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    let timer: NodeJS.Timeout;
  
    if (isSearchOpen && !isChatOpen) {
      setShowChatTooltip(true); // Show immediately
  
      timer = setTimeout(() => {
        setShowChatTooltip(false); // Hide after 3 seconds
      }, 2000);
    } else {
      setShowChatTooltip(false); // Hide if conditions don't match
    }
  
    return () => clearTimeout(timer); // Clean up
  }, [isSearchOpen, isChatOpen]);
  
  

  const handleSearchFocus = () => {
    if (!isAuthenticated) {
      openSignInModal()
      return // Stop if not authenticated
    }
    setIsSearchOpen(true)
    // If there's a search query, fetch tools immediately
    if (searchQuery) {
      fetchTools(searchQuery)
    }
  }

  const openSignInModal = () => {
    setIsSignUpModalOpen(false)
    setIsSignInModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleChatOpen = () => {
    // Add this authentication check
    if (!isAuthenticated) {
      openSignInModal(); // Show the login modal
      return;           // Stop execution if not authenticated
    }

    // Only proceed with opening chat if authenticated
    setIsSearchOpen(false);
    setIsChatOpen(true);
    // You might want to add other chat initialization logic here
  }

  const handleClose = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setTools([]) // Clear tools when closing
  }

  const handleSearch = () => {
    if (searchQuery) {
      fetchTools(searchQuery)
    }
  }

  // Close chat if user logs out while it's open
  useEffect(() => {
    if (!isAuthenticated && isChatOpen) {
      setIsChatOpen(false)
    }
  }, [isAuthenticated, isChatOpen])

  

  return (<>

    <SignInModal 
    isOpen={isSignInModalOpen} 
    onClose={closeAllModals} 
    onSwitchToSignUp={openSignUpModal}
    previousRoute={previousRoute}
  />
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
                  placeholder="What AI tool are you looking for? E.g., 'Image generator for mark..'"
                  className="h-14 rounded-full border-gray-200 pl-12 pr-32 shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  
                <div className="relative group rounded-full bg-purple-100 p-2.5 h-10 w-10 flex items-center justify-center cursor-pointer"
                  onClick={handleChatOpen}
                  aria-label="Try chat mode"
>
                      <MessageSquare
                        className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors"
                          // onClick is moved to the parent div
    />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Try chat mode for interactive conversation
                  </div>
                    </div>
                 
                  <Button
                    className="h-10 rounded-full bg-purple-600 px-6 text-sm hover:bg-purple-700"
                    onClick={handleSearchFocus}
                  >
                  
                    Search <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Intermediate Search UI */}
            {isSearchOpen && !isChatOpen && (
              <div ref={searchCommandRef} className="w-full max-w-2xl mx-auto">
                <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
                  {/* Search header with two buttons */}
                  <div className="flex items-center border-b px-4 py-3 gap-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search AI tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-sm placeholder-gray-400"
                    />
                    <div className="flex gap-2">
                      {/* Chat button (gray, smaller) */}
                      <div className="relative">
  <button
    onClick={handleChatOpen}
    onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    className="px-2.5 py-1 text-xs bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center gap-1.5"
  >
    <MessageSquare className="h-3.5 w-3.5" />
  </button>

  {showChatTooltip && (
    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10">
      {/* Arrow */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black"></div>
      {/* Tooltip */}
      <div className="px-2 py-1 text-xs text-white bg-black rounded shadow">
      Try chat mode for interactive conversation
      </div>
    </div>
  )}
</div>



                      {/* Search button (purple) */}
                      <button
                        onClick={handleSearch}
                        className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      </div>


                    ) :  searchQuery.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-500">
                      Start Typing to search
                      </div>
                      ) : 
                    
                    
                    tools.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-500">
                        No results found.
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-2 bg-gray-50">
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Tools
                          </h3>
                        </div>
                        {tools.map((tool) => (
                          <div
                            key={tool.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                          <div className="flex items-center justify-between"> {/* Main row flex */}
  {/* Left content area: Icon + Name/Desc Block */}
  {/* Change items-center to items-start to align the icon and the text block to the top */}
  <div className="flex items-start space-x-3">
    {/* Icon */}
    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-50 text-purple-600">
      {tool.image ?? robotSvg}
    </div>

    {/* Container for Name/Desc stacked vertically */}
    {/* Add items-start to align children (h4 and div) to the left */}
    <div className="flex flex-col items-start">
      {/* Name */}
      <h4 className="text-sm font-medium">{tool.name}</h4>
      {/* Description */}
      <div className="text-xs text-gray-500">
        {tool.description?.slice(0, 50)}
        {tool.description?.length > 70 && '...'}
      </div>
    </div>
  </div>

  {/* Right content area: Category + Link */}
  {/* This block stays the same as your last snippet */}
  <div className="flex items-center space-x-2">
  {tool.categories?.[0]!=null&& 
    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">

      {tool.categories?.[0]?.name
        ? tool.categories[0].name.length > 15
          ? tool.categories[0].name.slice(0, 15) + '...'
          : tool.categories[0].name
        : null}
    </span>}
    <ExternalLink
      // Corrected color and size from previous step
      className="text-gray-400 hover:text-gray-600 w-4 h-4 cursor-pointer"
      onClick={(e) => { // Add stopPropagation if the parent div is clickable
        e.stopPropagation(); // Prevent click from bubbling up
        goToToolDetails(tool.id);
      }}
    />
  </div>
</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Footer buttons */}
                  <div className="border-t p-3 bg-gray-50 flex justify-end">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Interface - only show if authenticated */}
            {isAuthenticated && (
                    <div className="relative mx-auto mb-8 max-w-2xl">
              <ChatInterface
                isOpen={isChatOpen}
                onClose={() => {
                  setIsChatOpen(false)
                  setIsSearchOpen(false)
                }}
                inputRef={chatInputRef as React.RefObject<HTMLInputElement>}
                isRelativeToParent={false}
              />
                  </div>
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
    </>
  )
}
