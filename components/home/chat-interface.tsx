"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Search, Bot } from "lucide-react" // Import Search and Bot icons
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx" // Import clsx
// Assuming useClickOutside is correctly implemented and imported
import { useClickOutside } from "@/hooks/use-click-outside"


interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  inputRef: React.RefObject<HTMLInputElement>
  // New prop to indicate if it's rendered relative to a parent container
  isRelativeToParent?: boolean;
}

export default function ChatInterface({ isOpen, onClose, inputRef, isRelativeToParent = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Use the click outside hook
  // Apply the hook only if the component is open
  useClickOutside(chatRef, onClose);


  const suggestions = [
    "How is AI affecting my business?",
    "Want only tools with a free plan?",
    "Looking for video-focused tools?",
    "Show me e-commerce AI tools",
  ]

  useEffect(() => {
    // Add initial assistant message when chat opens
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

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Check for category or search queries
    const lowerInput = input.toLowerCase()

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message

      if (lowerInput.includes("how is ai affecting my business")) {
        aiResponse = {
          role: "assistant" as const,
          content: "AI is transforming businesses through automation, data analysis, and customer service. I can recommend tools like ChatGPT for customer support, Jasper for content creation, and Tableau for data visualization. Would you like more specific recommendations for your industry?",
        };
      } else if (lowerInput.includes("free plan")) {
        aiResponse = {
          role: "assistant" as const,
          content: "I found several AI tools with free plans: Canva (design), ChatGPT (text generation), Lumen5 (video creation), and Otter.ai (transcription). What specific task are you looking to accomplish?",
        };
      } else if (lowerInput.includes("video-focused tools") || lowerInput.includes("video tools")) {
        aiResponse = {
          role: "assistant" as const,
          content: "For video-focused AI tools, I recommend checking out Runway ML, Synthesia, Descript, and Lumen5. These tools can help with video editing, generation, and enhancement. Do you need tools for a specific video task?",
        };
      } else if (lowerInput.includes("e-commerce") || lowerInput.includes("ecommerce")) {
        aiResponse = {
          role: "assistant" as const,
          content: "I've found some great AI tools for e-commerce. Let me show you the results.",
        };
        // Navigate to search page with category
        setTimeout(() => {
          onClose();
          router.push("/search?category=e-commerce");
        }, 1000);
        setIsLoading(false);
        return; // Stop further processing if navigating
      }
      // Default response if no specific intent matched
      else {
        aiResponse = {
          role: "assistant" as const,
          content: `I found some AI tools that might help with "${input}". Would you like to see tools for specific categories or with particular features?`,
        };
      }


      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)

      // Handle navigation for specific suggestions if needed here as well,
      // or rely on the suggestion handler which already does this.
      // For now, keeping the navigation logic primarily in suggestion handler
      // and only adding it here for e-commerce as it was in the original code.


    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message from suggestion
    const userMessage = { role: "user" as const, content: suggestion }
    setMessages((prev) => [...prev, userMessage])
    setInput("") // Clear input field
    setIsLoading(true)


    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;
      let navigateTo: string | null = null;

      if (suggestion.includes("e-commerce") || suggestion.includes("ecommerce")) {
        aiResponse = {
          role: "assistant" as const,
          content: "I've found some great AI tools for e-commerce. Let me show you the results.",
        };
        navigateTo = "/search?category=e-commerce";
      } else if (suggestion.includes("video")) {
        aiResponse = {
          role: "assistant" as const,
          content: "I've found some excellent video creation AI tools. Let me show you the results.",
        };
        navigateTo = "/search?category=video";
      } else if (suggestion.includes("business")) {
        aiResponse = {
          role: "assistant" as const,
          content:
            "AI is transforming businesses through automation, data analysis, and customer service. I can recommend tools like ChatGPT for customer support, Jasper for content creation, and Tableau for data visualization. Would you like more specific recommendations for your industry?",
        };
      } else if (suggestion.includes("free plan")) {
        aiResponse = {
          role: "assistant" as const,
          content:
            "I found several AI tools with free plans: Canva (design), ChatGPT (text generation), Lumen5 (video creation), and Otter.ai (transcription). What specific task are you looking to accomplish?",
        };
      } else { // Default response for suggestions not specifically handled above
        aiResponse = {
          role: "assistant" as const,
          content: `Okay, looking into "${suggestion}". Would you like to refine this search?`,
        };
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)

      if (navigateTo) {
        setTimeout(() => {
          onClose();
          if (navigateTo != null) {
            router.push(navigateTo);
          }
        }, 1000);
      }

    }, 1000)
  }


  if (!isOpen) return null

  return (
    <div
      ref={chatRef}
      className={clsx(
        "rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out",
        // Styles when used as a modal (current use case outside Hero)
        !isRelativeToParent && "absolute left-0 right-0 top-0 z-50 mx-auto mt-20 max-w-lg md:max-w-2xl",
        // Styles when used relative to a parent (new Hero use case)
        isRelativeToParent && "absolute top-0 w-full z-50" // Adjusted positioning for Hero
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex h-[400px] flex-col rounded-xl border border-gray-200">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"> {/* Slightly more vertical padding */}
          <div className="flex items-center">
            {/* Using a simple icon for AI assistant */}
            <Bot className="h-6 w-6 text-purple-600" /> {/* Bot icon */}
            <span className="ml-2 text-base font-semibold text-gray-800">AI Assistant</span> {/* Adjusted text style */}
          </div>
          {/* Close button */}
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
        <div className="flex-1 overflow-y-auto p-4 text-sm"> {/* Added text-sm for message font size */}
          {messages.map((message, index) => (
            // Adjusted container to use flex for alignment and remove max-width
            <div
              key={index}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Show AI Assistant label only for the first assistant message */}
              {message.role === "assistant" && index === 0 && (
                // Ensure this label aligns correctly with the message bubble
                <div className="mb-1 text-xs text-gray-600 font-medium absolute -top-5 left-0">AI Assistant</div> // Position absolutely relative to message bubble container
              )}
              {/* Message bubble - now limited by max-width */}
              <div
                className={clsx(
                  "rounded-lg p-3 max-w-[80%]", // Apply max-width here
                  message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800",
                  message.role === "assistant" && index === 0 && "relative mt-5" // Add margin-top and relative for the first assistant message to make space for the label
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
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
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && ( // Assuming suggestions disappear after a few messages
          <div className="border-t border-gray-100 px-4 py-3"> {/* Slightly more vertical padding */}
            <p className="mb-2 text-xs text-gray-500">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 transition-colors" // Updated styling
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center space-x-2"> {/* Added space-x-2 */}
            {/* Input with icon */}
            <div className="relative flex-1"> {/* Relative container for input and icon */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> {/* Search icon */}
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything..."
                className="w-full rounded-full border-gray-300 pl-10 pr-4 text-sm focus:border-purple-500 focus:ring-purple-500" // Rounded, added left padding for icon, adjusted border/focus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
            </div>
            {/* Send button */}
            <Button
              onClick={handleSendMessage}
              className="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none" // Adjusted padding, added text-white and disabled styles
              disabled={isLoading || !input.trim()} // Disable if loading or input is empty
            >
              Send <Send className="ml-1 h-4 w-4" /> {/* Added "Send" text and icon */}
              <span className="sr-only">Send message</span> {/* Improved accessibility label */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}