import apiClient from "@/lib/api-client" // Assuming this is for other endpoints like register/google
import axios from "axios"

// Types
interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: any // Consider defining a more specific User type here as well
}

// Helper function to create form data
const createFormData = (data: Record<string, string>) => {
  const formData = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return formData
}

// Login with username and password
// Alternative approach without createFormData helper
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const formData = new URLSearchParams()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)
    // Use the environment variable for API URL
    // ... rest of the function body (axios.post call etc.) remains the same
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })

    // ... rest of token storage and user fetching
    const { access_token, token_type, refresh_token } = response.data

    localStorage.setItem("access_token", access_token)
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token)
    }

    const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        Accept: "application/json",
      },
    })

    const user = userResponse.data
    localStorage.setItem("user", JSON.stringify(user))

    return { access_token, refresh_token, token_type, user }
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid Email or password ")
    }
    throw error
  }
}

// Register new user (assuming it doesn't return tokens directly, relies on subsequent login)
export const register = async (data: RegisterData) => {
  const response = await apiClient.post("/auth/register", data)
  return response.data
}

// Get current user using stored token
export const getCurrentUser = async () => {
  const token = localStorage.getItem("access_token") // Changed key to access_token

  if (!token) {
    return null
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        // Assuming token_type is 'Bearer'. You could store token_type too if needed.
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    return response.data // Return user data
  } catch (error) {
    console.error("Failed to get current user:", error)
    // If fetching user fails (e.g., token expired), clear stored tokens and user data
    localStorage.removeItem("access_token") // Changed key to access_token
    localStorage.removeItem("refresh_token") // Also clear refresh token on access token failure
    localStorage.removeItem("user")
    return null // Indicate no user is authenticated
  }
}

// Logout: Clear tokens and user data from storage
export const logout = () => {
  localStorage.removeItem("access_token") // Changed key to access_token
  localStorage.removeItem("refresh_token") // Clear refresh token
  localStorage.removeItem("user")
  // Optionally call an API endpoint to invalidate tokens server-side
  // logoutServiceApiCall();
}

// Google OAuth - Initiation (assuming this redirects)
export const initiateGoogleLogin = async () => {
  const response = await apiClient.get("/auth/google/login")
  return response.data // Should contain the redirect URL
}

// Google OAuth - Callback handling (after redirect)
// This function would be called on your Google OAuth callback page
export const handleGoogleCallback = async (code: string) => {
  // Exchange authorization code for tokens
  const response = await apiClient.get(`/auth/google/callback?code=${code}`)

  const { access_token, token_type, refresh_token, user } = response.data // Assuming API returns tokens AND user here

  // Store tokens
  localStorage.setItem("access_token", access_token) // Changed key to access_token
  if (refresh_token) {
    localStorage.setItem("refresh_token", refresh_token) // Store refresh token if available
  }

  // Store user data (if returned by callback endpoint, otherwise call getCurrentUser)
  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
  } else {
    // If callback doesn't return user, call getCurrentUser after storing tokens
    // const currentUser = await getCurrentUser();
    // if(currentUser) localStorage.setItem("user", JSON.stringify(currentUser));
  }

  // Return relevant data
  return { access_token, token_type, refresh_token, user } // Return tokens and user
}
