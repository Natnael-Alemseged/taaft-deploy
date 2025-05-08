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
import { keywordSearch, type Message } from "@/services/chat-service"
import { buffer } from "stream/consumers"

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
  const [error, setError] = useState<string | null>(null)
  const [toolRecommendations, setToolRecommendations] = useState<any[]>([])
  const [streamingMessage, setStreamingMessage] = useState(''); // Message currently being streamed
  const [isLoading, setIsLoading] = useState(false); // To show a loading indicator
  const [conversationalRecommendations, setConversationalRecommendations] = useState<string[]>([]); // New state for conversational recommendations




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



useEffect(() => {
  // Scroll to the bottom whenever the streaming message updates
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [streamingMessage]); // Add streamingMessage as a dependency

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

  // Focus the input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
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

  // Effect to close chat when scrolling outside
  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => {
      // Check if chat ref exists and is open
      if (chatRef.current && isOpen) {
        // Get the chat element's position and dimensions
        const chatRect = chatRef.current.getBoundingClientRect()

        // Check if the user has scrolled beyond the chat interface
        const scrolledOutside =
          window.scrollY > 10 || // Even slight scroll should close it
          window.scrollY + window.innerHeight < chatRect.top ||
          window.scrollY > chatRect.bottom

        if (scrolledOutside) {
          onClose()
        }
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isOpen, onClose])

  

  // Handle sending a message
 // Assuming these are defined in your component's state:
 // const [messages, setMessages] = useState<Message[]>([]);
 // const [streamingMessage, setStreamingMessage] = useState('');
 // const [isLoading, setIsLoading] = useState(false);
 // const [input, setInput] = useState("");
 // const [activeChatId, setActiveChatId] = useState<string | null>(null);
 // const [error, setError] = useState<string | null>(null);
 // const [toolRecommendations, setToolRecommendations] = useState<any[]>([]);
 // const createChatSession = useCreateChatSession(); // Assuming this hook provides mutateAsync
 // const refetchSessions = useChatSessions().refetch; // Assuming this hook provides refetch
 // const router = useRouter(); // Assuming you are using Next.js router for navigation
 // const chatEndRef = useRef<HTMLDivElement>(null); // Assuming you have this ref for scrolling

 async function handleSendMessage(content?: string) {
  // Prevent sending if input is empty or already loading
  if (!input.trim() && !content) return; // Ensure there's content to send
  if (isLoading) return;

  const messageContent = content || input.trim();
  if (!messageContent) return; // Double check after trimming

  // Add the user's message to the main list immediately
  // Ensure user message also matches the Message interface
  const userMessage: Message = { role: "user", content: messageContent, id: 'user-' + Date.now() }; // Added id for consistency
  setMessages((prev) => [...prev, userMessage]);

  // Clear input field if it's not a recommendation being sent
  if (!content) setInput("");

  // Clear any previous errors and recommendations
  setError(null);
  setToolRecommendations([]);
  setConversationalRecommendations([]); // Clear previous conversational recommendations

  // --- Set loading state and clear previous streaming message ---
  setIsLoading(true);
  setStreamingMessage('');

  try {
    let chatId = activeChatId;

    // Create a new chat session if one isn't active
    if (!chatId) {
      console.log("No active chat ID, creating new session");
      try {
        const sessionTitle = messageContent.substring(0, 50) || "New Chat";
        const newSession = await createChatSession.mutateAsync(sessionTitle);
        console.log("New session created:", newSession._id);
        setActiveChatId(newSession._id);
        chatId = newSession._id;
        await refetchSessions(); // Refresh the sessions list
      } catch (sessionError) {
        console.error("Failed to create chat session:", sessionError);
        setError("Failed to create a new chat session. Please try again.");
        setIsLoading(false); // Stop loading on session creation error
        return; // Stop execution
      }
    }

    console.log(`Sending message to chat ID: ${chatId}`);

    // --- Fetch the streaming response ---
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/sessions/${chatId}/messages/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: chatId,
        message: messageContent,
        model: "gpt4", // Consider making this dynamic
        systemPrompt: "You are a helpful assistant.", // Consider making this dynamic
      })
    });

    // Check if the HTTP request itself was successful
    if (!response.ok) {
      const errorBody = await response.text(); // Attempt to read error body
      console.error(`HTTP error! status: ${response.status}`, errorBody);
      setError(`Error from server: ${response.status} ${response.statusText}`);
      setIsLoading(false); // Stop loading on fetch error
      return; // Stop execution
    }

    // Ensure response body is available and readable
    if (!response.body) {
        console.error("Response body is not a readable stream.");
        setError("Server did not return a readable stream.");
        setIsLoading(false);
        return;
    }

    // Get the readable stream and decoder
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // --- Variables for stream processing ---
    let receivedMessageContent = ''; // Accumulate the full message content
    let buffer = ''; // Buffer to handle incomplete lines
    let messageFinalized = false; // Flag to track if the message has been added to the main list
    let accumulatedFormattedData: any = null; // To accumulate formatted data if it comes before 'end'
    let accumulatedConversationalRecommendations: string[] = []; // To accumulate conversational recommendations

    console.log("Receiving stream data...");

    // --- Loop to continuously read chunks from the stream ---
    while (true) {
      const { done, value } = await reader.read();

      // 'done' is true when the stream is finished
      if (done) {
        console.log("Stream finished.");
        // If the message wasn't finalized by an 'end' event, finalize it now
        if (!messageFinalized && receivedMessageContent) {
             console.warn("Stream done without explicit 'end' event. Finalizing message.");
             // --- Corrected assignment for fallback ---
             setMessages(prevMessages => [...prevMessages, { id: 'bot-' + Date.now(), content: receivedMessageContent, role: "assistant" }]);
             messageFinalized = true; // Mark as finalized
        }
        if (accumulatedConversationalRecommendations.length > 0) {
          setConversationalRecommendations(accumulatedConversationalRecommendations);
      }
        setStreamingMessage(''); // Ensure streaming state is cleared
        setIsLoading(false); // Ensure loading is false
        break; // Exit the chunk reading loop
      }

      // 'value' is a Uint8Array chunk of data
      // Decode the chunk and append to the buffer
      const chunkString = decoder.decode(value, { stream: true });
      buffer += chunkString;

      // --- Process complete lines from the buffer ---
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const completeLine = buffer.substring(0, newlineIndex); // Get the complete line
        buffer = buffer.substring(newlineIndex + 1); // Remove the processed line from the buffer



        const line = completeLine.trim(); // Trim whitespace

        if (line === '') {
          // Ignore empty lines
          continue;
        }

        // Process the complete and trimmed line
        if (line.startsWith('data: ')) {
          try {
            const jsonString = line.substring(6); // Remove "data: " prefix
            const eventData = JSON.parse(jsonString);

            console.log('Parsed event:', eventData);

            if (eventData.event === 'chunk') {
              if (eventData.content) {
            
                // Accumulator for options content
                if (eventData.content.startsWith('options')) {
                  accumulatedConversationalRecommendations = []; // Reset accumulator
                  buffer = ''; // Clear buffer to start fresh
                }
            
                // Accumulate content until the ']' marker is found
                if (accumulatedConversationalRecommendations !== null) {
                  buffer += eventData.content;
            
                  // Check if the ']' marker has been reached
                  if (buffer.includes("']")) {
                    // Extract content within the brackets
                    const optionsString = buffer.substring(buffer.indexOf("[") + 1, buffer.indexOf("]"));
                    const recommendations = optionsString
                      .split("', '")
                      .map((item) => item.trim().replace(/'/g, ""))
                      .filter((item) => item !== "");
            
                    // Update the state with the parsed recommendations
                    setConversationalRecommendations(recommendations);
            
                    // Reset buffer and accumulator
                    buffer = '';
                    accumulatedConversationalRecommendations = [];
                  }
                }
            
                // Continue accumulating streaming message content
                receivedMessageContent += eventData.content;
                setStreamingMessage(receivedMessageContent);
              }
                        

            }  else if (eventData.event === 'formatted_data') {
              console.log('Formatted data event received:', eventData);
           
              // Check if the data has a 'hits' array (tool recommendations)
              if (eventData.data && eventData.data.hits && Array.isArray(eventData.data.hits)) {
              setToolRecommendations(eventData.data.hits);
                               accumulatedFormattedData = eventData.data; // Store for the final message
              console.log("Tool recommendations received and stored.");
              }
            }
            
            else if (eventData.event === 'end') {
              console.log('End event received:', eventData);
              // --- Finalize the message when the 'end' event is received ---
              // Add the complete accumulated message to the main messages list
              // Use eventData.message_id if available, otherwise generate one
              // --- Corrected assignment for 'end' event ---
              setMessages(prevMessages => [...prevMessages, { id: eventData.message_id || 'bot-' + Date.now(), content: receivedMessageContent, role: "assistant" }]);
              setStreamingMessage(''); // Clear the temporary streaming state
              setIsLoading(false); // Stop loading
              messageFinalized = true; // Mark as finalized

              // If the 'end' event guarantees no more data, you can exit the function
              // immediately here.
              // return; // Uncomment if 'end' means stop processing stream immediately

            }
     

          } catch (e) {
            console.error('Failed to parse JSON line:', line, e);
            // Decide how to handle a parsing error - maybe show an error message
            // setError("Error processing streamed data.");
            // setIsLoading(false);
            // reader.cancel(); // Abort the stream
            // return; // Exit the async function
          }
        } else {
          console.warn('Ignoring unexpected line format:', line);
          // Handle non-'data:' lines if necessary (e.g., comments starting with ':')
        }
      } // End of while loop for processing lines in buffer



    } // End of while loop for reading chunks from reader

    // This part is only reached if the loop finishes via 'done' and no 'return' was hit in 'end'.
    // The fallback logic inside the 'done' check handles the final state updates.


  } catch (error) {
    // This catch block handles errors during fetch or stream reading
    console.error("Error in chat completion:", error);
    setError("Sorry, I couldn't process your request. Please try again later.");
    setStreamingMessage(''); // Clear any partial streaming message on error
    setIsLoading(false); // Stop loading on error
  }
}

  // Handle selecting a chat session
  const handleSelectSession = (sessionId: string) => {
    setActiveChatId(sessionId)
    setShowSessions(false)
    setToolRecommendations([])
    setConversationalRecommendations([]); // Clear conversational recommendations
  }

  // Handle creating a new chat
  const handleNewChat = async () => {
    try {
      const newSession = await createChatSession.mutateAsync("New Chat")
      setActiveChatId(newSession._id)
      // setMessages([
      //     {
      //         role: "assistant",
      //         content: "Hi! I'm your AI assistant. How can I help you today?",
      //     },
      // ])
      setShowSessions(false)
      setToolRecommendations([])
      setConversationalRecommendations([]); // Clear conversational recommendations for new chat
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-[120px] bg-transparent"
    >
      <div
        ref={chatRef}
        className="rounded-xl bg-white shadow-md border border-purple-100 transition-all duration-300 ease-in-out w-full max-w-2xl"
        style={{
          position: "relative",
          transform: "none",
        }}
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

               {/* --- MOVE THESE BLOCKS INSIDE THIS DIV --- */}
               {messages.map((message, index) => (
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
    </div>
  </div>
))}

{/* Streaming Message */}
{isLoading && streamingMessage && (
  <div className="mb-4 flex justify-start">
    <div className="rounded-lg p-3 max-w-[80%] bg-gray-100 text-gray-800">
      {streamingMessage}
      <span className="cursor">|</span> {/* Optional: add a typing cursor */}
    </div>
  </div>
)}

            {/* --- END OF MOVED BLOCKS --- */}

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
