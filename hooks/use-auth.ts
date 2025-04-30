// hooks/use-auth.ts
"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import {useMutation} from "@tanstack/react-query";
// Assuming the correct path to your resetPassword service function
import { resetPassword } from "@/services/auth-service";

// Define User interface at the top level
interface User {
  id: string
  name: string
  email: string
  // Add other user properties
}

// Define AuthContextType at the top level
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean // Loading state for initial check or login/register
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void> // Adjust return type if service returns something specific
  logout: () => void
  loginWithGoogle: () => Promise<void>
}

// --- Password Reset Types ---
// Moved to the top level
interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
}
// --- End Password Reset Types ---


// Create AuthContext at the top level
const AuthContext = createContext<AuthContextType | undefined>(undefined)


// --- useResetPassword Hook ---
// Moved to the top level, outside the AuthProvider component
export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({ // Type the mutation
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload), // Call the imported service function
    onSuccess: (data) => {
      console.log("Password reset successful:", data);
      // Handle success logic if needed here (often handled in the component)
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
      // Handle error logic if needed here (often handled in the component)
    },
  });
}
// --- End useResetPassword Hook ---


// AuthProvider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Loading state for the provider's internal logic

  // Add effect to check auth status on mount (based on your previous full code)
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Placeholder for actual auth check logic (e.g., check token, fetch user)
      // Based on your previous code snippets, this might involve localStorage and a getCurrentUser service call.
      const storedUser = localStorage.getItem("user"); // Example based on previous code
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          // Clear bad data
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false); // Always set loading false after check
    };

    checkAuthStatus();

  }, []); // Empty dependency array means this runs once on mount


  const login = async (credentials: { username: string; password: string }) => {
    // Placeholder for login logic - replace with actual API call and state updates
    setIsLoading(true)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ id: "1", name: "Test User", email: credentials.username })
        setIsAuthenticated(true)
        setIsLoading(false)
        resolve()
      }, 1000)
    })
  }

  const register = async (data: { name: string; email: string; password: string }) => {
    // Placeholder for register logic - replace with actual API call and state updates
    setIsLoading(true)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ id: "1", name: data.name, email: data.email })
        setIsAuthenticated(true)
        setIsLoading(false)
        resolve()
      }, 1000)
    })
  }

  const logout = () => {
    // Placeholder for logout logic - replace with actual API call and state updates
    setUser(null)
    setIsAuthenticated(false)
  }

  const loginWithGoogle = async () => {
    // Placeholder for login with Google logic - replace with actual API call and state updates
    setIsLoading(true)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ id: "1", name: "Test User", email: "test@example.com" })
        setIsAuthenticated(true)
        setIsLoading(false)
        resolve()
      }, 1000)
    })
  }

  return (
      <AuthContext.Provider
          value={{
    user,
        isAuthenticated,
        isLoading, // Provider's loading state
        login,
        register,
        logout,
        loginWithGoogle,
  }}
>
  {children}
  </AuthContext.Provider>
)
}

// useAuth hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}