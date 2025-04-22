import axios from "axios"

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
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
      // Clear auth data if we're in the browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // Redirect to home page if not already there
        if (window.location.pathname !== "/") {
          window.location.href = "/"
        }
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
