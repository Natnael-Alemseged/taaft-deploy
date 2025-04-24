class WebSocketService {
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private eventListeners: Record<string, Array<(data: any) => void>> = {}
  private messageQueue: Array<string> = []
  private connectionState: "disconnected" | "connecting" | "connected" | "reconnecting" | "failed" = "disconnected"
  private fallbackMode = false
  private connectionTimeout: NodeJS.Timeout | null = null

  // Get the WebSocket URL based on the current environment
  private getWebSocketUrl(): string {
    // Use the backend URL from the environment variable or the one provided by the user
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://taaft-backend.onrender.com"

    // Convert HTTP/HTTPS to WS/WSS
    const wsProtocol = apiUrl.startsWith("https") ? "wss" : "ws"
    const urlWithoutProtocol = apiUrl.replace(/^https?:\/\//, "")

    return `${wsProtocol}://${urlWithoutProtocol}/ws`
  }

  // Initialize WebSocket connection
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already in fallback mode, don't try to connect
      if (this.fallbackMode) {
        reject(new Error("WebSocket connection disabled, using fallback mode"))
        return
      }

      if (
        this.socket &&
        (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
      ) {
        resolve()
        return
      }

      this.connectionState = "connecting"
      this.triggerEvent("connecting", {})

      try {
        const wsUrl = this.getWebSocketUrl()
        console.log(`Connecting to WebSocket at ${wsUrl}`)
        this.socket = new WebSocket(wsUrl)

        // Set a connection timeout
        this.connectionTimeout = setTimeout(() => {
          console.log("WebSocket connection timeout")
          if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            this.socket.close()
            this.socket = null
            this.connectionState = "failed"
            this.fallbackMode = true
            this.triggerEvent("failed", { reason: "Connection timeout" })
            reject(new Error("WebSocket connection timeout"))
          }
        }, 10000) // 10 second timeout

        this.socket.onopen = () => {
          console.log("WebSocket connection established")
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout)
            this.connectionTimeout = null
          }

          this.connectionState = "connected"
          this.reconnectAttempts = 0
          this.triggerEvent("connected", {})

          // Send any queued messages
          this.processMessageQueue()

          resolve()
        }

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        this.socket.onclose = (event) => {
          console.log("WebSocket connection closed:", event.code, event.reason)

          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout)
            this.connectionTimeout = null
          }

          this.connectionState = "disconnected"
          this.triggerEvent("disconnected", { code: event.code, reason: event.reason })

          // Attempt to reconnect if not closed intentionally
          if (event.code !== 1000) {
            this.attemptReconnect()
          }
        }

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error)

          // After an error, switch to fallback mode if we've tried reconnecting too many times
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log("Maximum reconnect attempts reached, switching to fallback mode")
            this.fallbackMode = true
            this.connectionState = "failed"
            this.triggerEvent("failed", { error })
          }

          reject(error)
        }
      } catch (error) {
        console.error("Error creating WebSocket connection:", error)
        this.connectionState = "failed"
        this.fallbackMode = true
        this.triggerEvent("failed", { error })
        reject(error)
      }
    })
  }

  // Check if we're in fallback mode
  public isFallbackMode(): boolean {
    return this.fallbackMode
  }

  // Reset fallback mode and try to reconnect
  public resetFallbackMode(): void {
    this.fallbackMode = false
    this.reconnectAttempts = 0
    this.connect().catch(console.error)
  }

  // Close the WebSocket connection
  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "Client disconnected")
      this.socket = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
      this.connectionTimeout = null
    }

    this.connectionState = "disconnected"
  }

  // Attempt to reconnect with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Maximum reconnect attempts reached, switching to fallback mode")
      this.fallbackMode = true
      this.connectionState = "failed"
      this.triggerEvent("failed", { reason: "Maximum reconnect attempts reached" })
      return
    }

    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts))
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)

    this.connectionState = "reconnecting"
    this.triggerEvent("reconnecting", { attempt: this.reconnectAttempts + 1 })

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++
      this.connect().catch(() => {
        // If reconnect fails, try again
        this.attemptReconnect()
      })
    }, delay)
  }

  // Handle incoming messages
  private handleMessage(data: any): void {
    // Trigger event based on message type
    if (data.type) {
      this.triggerEvent(data.type, data)
    }

    // Also trigger a generic 'message' event
    this.triggerEvent("message", data)
  }

  // Process queued messages
  private processMessageQueue(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()
        if (message) {
          this.socket.send(message)
        }
      }
    }
  }

  // Send a message through the WebSocket
  public send(data: any): void {
    const message = JSON.stringify(data)

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message)
    } else {
      // Queue the message if not connected
      this.messageQueue.push(message)

      // Try to connect if disconnected
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.connect().catch(console.error)
      }
    }
  }

  // Send user connected message after establishing connection
  public authenticateUser(userId: string, authToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.fallbackMode) {
        resolve() // In fallback mode, just resolve immediately
        return
      }

      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.connect()
          .then(() => this.authenticateUser(userId, authToken))
          .then(resolve)
          .catch(reject)
        return
      }

      const authData = {
        type: "user_connected",
        user_id: userId,
        auth_token: authToken,
      }

      // Set up a one-time listener for auth response
      const authResponseHandler = (data: any) => {
        if (data.type === "auth_response") {
          this.off("auth_response", authResponseHandler)

          if (data.success) {
            resolve()
          } else {
            reject(new Error(data.message || "Authentication failed"))
          }
        }
      }

      this.on("auth_response", authResponseHandler)

      // Send auth data
      this.send(authData)

      // Set a timeout for auth response
      setTimeout(() => {
        this.off("auth_response", authResponseHandler)
        resolve() // Resolve anyway after timeout, as some servers might not send auth response
      }, 3000)
    })
  }

  // Send chat message
  public sendChatMessage(
    chatId: string,
    userId: string,
    message: string,
    model: string,
    authToken: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.fallbackMode) {
        reject(new Error("WebSocket in fallback mode, use REST API instead"))
        return
      }

      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.connect()
          .then(() => this.sendChatMessage(chatId, userId, message, model, authToken))
          .then(resolve)
          .catch(reject)
        return
      }

      const messageData = {
        type: "chat_message",
        chat_id: chatId,
        user_id: userId,
        message: message,
        model: model,
        auth_token: authToken,
      }

      this.send(messageData)
      resolve()
    })
  }

  // Add event listener
  public on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  // Remove event listener
  public off(event: string, callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter((cb) => cb !== callback)
    }
  }

  // Trigger event
  private triggerEvent(event: string, data: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} event handler:`, error)
        }
      })
    }
  }

  // Get current connection state
  public getConnectionState(): string {
    return this.connectionState
  }
}

// Create a singleton instance
const websocketService = new WebSocketService()

export default websocketService

//
// // WebSocket service for chat functionality
// import { showLoginModal } from "@/lib/auth-events"
//
// // WebSocket connection states
// type ConnectionState = "connecting" | "connected" | "disconnected" | "reconnecting" | "failed"
//
// class WebSocketService {
//   private socket: WebSocket | null = null
//   private connectionState: ConnectionState = "disconnected"
//   private reconnectAttempts = 0
//   private maxReconnectAttempts = 5
//   private reconnectTimeout: NodeJS.Timeout | null = null
//   private eventListeners: Record<string, Array<(data: any) => void>> = {}
//   private messageQueue: Array<string> = []
//   private useFallback = false
//   private connectionLock = false
//   private backoffTime = 1000 // Start with 1 second
//
//   // Get the WebSocket URL based on the current environment
//   private getWebSocketUrl(): string {
//     // Use the API URL from environment variables but replace http/https with ws/wss
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin
//     const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
//
//     // Extract the host from the API URL
//     let host = apiUrl.replace(/^https?:\/\//, '')
//
//     // Remove any path from the host
//     if (host.includes('/')) {
//       host = host.split('/')[0]
//     }
//
//     return `${wsProtocol}://${host}/ws`
//   }
//
//   // Initialize WebSocket connection
//   public connect(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       // Prevent multiple simultaneous connection attempts
//       if (this.connectionLock) {
//         console.log("Connection attempt already in progress")
//         resolve()
//         return
//       }
//
//       // If we've determined WebSockets aren't supported, resolve immediately
//       if (this.useFallback) {
//         console.log("Using fallback mode instead of WebSockets")
//         resolve()
//         return
//       }
//
//       // If already connected or connecting, resolve immediately
//       if (
//           this.socket &&
//           (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
//       ) {
//         resolve()
//         return
//       }
//
//       // Set connection lock
//       this.connectionLock = true
//
//       // Clear any existing reconnect timeout
//       if (this.reconnectTimeout) {
//         clearTimeout(this.reconnectTimeout)
//         this.reconnectTimeout = null
//       }
//
//       this.connectionState = "connecting"
//       this.triggerEvent("connecting", {})
//
//       try {
//         const wsUrl = this.getWebSocketUrl()
//         console.log(`Attempting to connect to WebSocket at: ${wsUrl}`)
//
//         this.socket = new WebSocket(wsUrl)
//
//         // Set a connection timeout
//         const connectionTimeout = setTimeout(() => {
//           if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
//             console.log("WebSocket connection timeout")
//             this.socket.close()
//             this.connectionState = "failed"
//             this.connectionLock = false
//
//             // Only use fallback after all attempts
//             if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//               this.useFallback = true
//               this.triggerEvent("failed", { reason: "timeout" })
//             } else {
//               this.attemptReconnect()
//             }
//             resolve() // Resolve anyway to continue with fallback
//           }
//         }, 5000) // 5 second timeout
//
//         this.socket.onopen = () => {
//           console.log("WebSocket connection established")
//           clearTimeout(connectionTimeout)
//           this.connectionState = "connected"
//           this.reconnectAttempts = 0
//           this.backoffTime = 1000 // Reset backoff time
//           this.connectionLock = false
//           this.triggerEvent("connected", {})
//
//           // Send any queued messages
//           this.processMessageQueue()
//
//           resolve()
//         }
//
//         this.socket.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data)
//             this.handleMessage(data)
//           } catch (error) {
//             console.error("Error parsing WebSocket message:", error)
//           }
//         }
//
//
//         this.socket.onerror = (event) => {
//           console.error("WebSocket error:", event)
//           this.triggerEvent("error", { event })
//
//           // Don't set connectionLock to false here, let onclose handle it
//         }
//
//         this.socket.onclose = (event) => {
//           console.log("WebSocket connection closed:", event.code, event.reason)
//           clearTimeout(connectionTimeout)
//           this.connectionState = "disconnected"
//           this.connectionLock = false
//           this.triggerEvent("disconnected", { code: event.code, reason: event.reason })
//
//           // Handle 429 rate limit errors
//           if (event.code === 1008 && event.reason && event.reason.includes('429')) {
//             console.log("Rate limited (429), using exponential backoff")
//             this.backoffTime = Math.min(30000, this.backoffTime * 2)
//           }
//
//           // Attempt to reconnect if not closed intentionally
//           if (event.code !== 1000) {
//             this.attemptReconnect()
//           }
//         }
//       } catch (error) {
//         console.error("Error setting up WebSocket:", error)
//         this.connectionState = "failed"
//         this.connectionLock = false
//         this.triggerEvent("failed", { error })
//         reject(error)
//       }
//     })
//   }
//
//   // Send a message through the WebSocket
//   public send(data: any): boolean {
//     const message = JSON.stringify(data)
//
//     // If connected, send immediately
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       this.socket.send(message)
//       return true
//     }
//
//     // Otherwise queue the message if we're reconnecting or connecting
//     if (["connecting", "reconnecting"].includes(this.connectionState)) {
//       this.messageQueue.push(message)
//       return true
//     }
//
//     // If we're using fallback or failed, don't queue
//     if (this.useFallback || this.connectionState === "failed") {
//       return false
//     }
//
//     // Otherwise, attempt to reconnect and queue the message
//     this.messageQueue.push(message)
//     this.connect()
//     return true
//   }
//
//   // Process queued messages
//   private processMessageQueue(): void {
//     if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
//       return
//     }
//
//     while (this.messageQueue.length > 0) {
//       const message = this.messageQueue.shift()
//       if (message) {
//         this.socket.send(message)
//       }
//     }
//   }
//
//   // Add event listener
//   public on(event: string, callback: (data: any) => void): void {
//     if (!this.eventListeners[event]) {
//       this.eventListeners[event] = []
//     }
//     this.eventListeners[event].push(callback)
//   }
//
//   // Remove event listener
//   public off(event: string, callback: (data: any) => void): void {
//     if (!this.eventListeners[event]) return
//
//     this.eventListeners[event] = this.eventListeners[event].filter(
//         (cb) => cb !== callback
//     )
//   }
//
//   // Trigger event for listeners
//   private triggerEvent(event: string, data: any): void {
//     if (!this.eventListeners[event]) return
//
//     for (const callback of this.eventListeners[event]) {
//       callback(data)
//     }
//   }
//
//   // Attempt to reconnect with exponential backoff
//   private attemptReconnect(): void {
//     if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//       console.log("Maximum reconnect attempts reached, switching to fallback mode")
//       this.connectionState = "failed"
//       this.useFallback = true
//       this.triggerEvent("failed", { reason: "max_attempts" })
//       return
//     }
//
//     this.reconnectAttempts++
//     this.connectionState = "reconnecting"
//
//     // Use backoff time to avoid rate limits
//     const delay = this.backoffTime
//
//     console.log(`Reconnecting in ${delay/1000} seconds... (attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`)
//     this.triggerEvent("reconnecting", { attempt: this.reconnectAttempts, maxAttempts: this.maxReconnectAttempts, delay })
//
//     this.reconnectTimeout = setTimeout(() => {
//       this.connect().catch(err => {
//         console.error("Reconnection failed:", err)
//       })
//     }, delay)
//   }
//
//
//   // Handle incoming message
//   private handleMessage(data: any): void {
//     // Handle different message types
//     if (data.type === "authenticate") {
//       if (data.status === "required") {
//         showLoginModal()
//       }
//     }
//
//     // Trigger message event
//     this.triggerEvent("message", data)
//
//     // Also trigger specific event for the message type
//     if (data.type) {
//       this.triggerEvent(data.type, data)
//     }
//   }
//
//   // Disconnect WebSocket
//   public disconnect(): void {
//     if (this.socket) {
//       // Use code 1000 for normal closure
//       this.socket.close(1000, "User disconnected")
//     }
//
//     this.connectionState = "disconnected"
//
//     if (this.reconnectTimeout) {
//       clearTimeout(this.reconnectTimeout)
//       this.reconnectTimeout = null
//     }
//   }
//
//   // Check if we have a live connection
//   public isConnected(): boolean {
//     return this.connectionState === "connected"
//   }
//
//   // Check if we're using fallback mode
//   public isFallbackMode(): boolean {
//     return this.useFallback
//   }
//
//   // Get current connection state
//   public getConnectionState(): ConnectionState {
//     return this.connectionState
//   }
// }
//
// // Create a singleton instance
// const webSocketService = new WebSocketService()
// export default webSocketService
//
