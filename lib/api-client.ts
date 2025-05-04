import { showLoginModal } from "@/lib/auth-events"
import axios from "axios"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://taaft-backend.onrender.com"
console.log(`API Client initialized with base URL: ${apiUrl}`)

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 100000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response success: ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Received 401 Unauthorized response")

      if (typeof window !== "undefined") {
        const hadPreviousSession =
          localStorage.getItem("access_token") !== null || localStorage.getItem("user") !== null

        if (hadPreviousSession) {
          console.log("Previous session detected, attempting token refresh")

          return refreshAccessToken().then((newAccessToken) => {
            if (newAccessToken) {
              error.config.headers.Authorization = `Bearer ${newAccessToken}`
              return apiClient(error.config)
            } else {
              console.log("Token refresh failed, clearing session and showing login modal")
              localStorage.removeItem("access_token")
              localStorage.removeItem("refresh_token")
              localStorage.removeItem("user")

              import("@/lib/auth-events").then(({ showLoginModal }) => {
                showLoginModal()
              })

              return Promise.reject(error)
            }
          })
        }
        else{showLoginModal()}
      }
    } else if (error.response) {
      console.log(error.response)
      console.error(`API Error ${error.response.status} for ${error.config?.url}:`, error.response.data)
    } else if (error.request) {
      console.error(`API No Response for ${error.config?.url}:`, error.request)
    } else {
      console.error(`API Setup Error for ${error.config?.url}:`, error.message)
    }

    return Promise.reject(error)
  },
)

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token")
  if (!refreshToken) return null

  try {
    const response = await axios.post(`${apiUrl}/auth/refresh`, {
      refresh_token: refreshToken,
    })

    const newAccessToken = response.data.access_token

    localStorage.setItem("access_token", newAccessToken)

    return newAccessToken
  } catch (err) {
    console.error("Token refresh failed:", err)
    return null
  }
}

export default apiClient
