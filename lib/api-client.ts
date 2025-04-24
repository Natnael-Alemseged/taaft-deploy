import axios from "axios"

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com", // Fallback URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Only show login popup if there was a previous user session
      if (typeof window !== "undefined") {
        // Check if there was a user session before
        const hadPreviousSession =
          localStorage.getItem("access_token") !== null || localStorage.getItem("user") !== null

        // Clear auth data
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")

        // Only show login popup if there was a previous session
        if (hadPreviousSession) {
          import("@/lib/auth-events").then(({ showLoginModal }) => {
            showLoginModal()
          })
        }
      }
    }

    // Log the error for debugging but don't block the promise chain
    console.error("API Error:", error.message, error.response?.data)

    return Promise.reject(error)
  },
)

export default apiClient
