import axios from "axios"

// Log the API URL being used
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://taaft-backend.onrender.com"
console.log(`API Client initialized with base URL: ${apiUrl}`)

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 100000, // 100 second timeout
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // Log that we're adding the auth token (without showing the actual token)
      console.log(`Adding auth token to request: ${config.url}`)
    } else {
      console.log(`No auth token available for request: ${config.url}`)
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
    // Log successful responses for debugging
    console.log(`API Response success: ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      console.log("Received 401 Unauthorized response")

      // Only show login popup if there was a previous user session
      if (typeof window !== "undefined") {
        // Check if there was a user session before
        const hadPreviousSession =
          localStorage.getItem("access_token") !== null || localStorage.getItem("user") !== null

        if (hadPreviousSession) {
          console.log("Previous session detected, clearing auth data")
        }

        // Clear auth data
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")

        // Only show login popup if there was a previous session
        if (hadPreviousSession) {
          console.log("Showing login modal")
          import("@/lib/auth-events").then(({ showLoginModal }) => {
            showLoginModal()
          })
        }
      }
    } else if (error.response) {
      console.log(error.response);
      // Log detailed error information for other status codes
      console.error(`API Error ${error.response.status} for ${error.config?.url}:`, error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`API No Response for ${error.config?.url}:`, error.request)
    } else {
      // Something happened in setting up the request
      console.error(`API Setup Error for ${error.config?.url}:`, error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
