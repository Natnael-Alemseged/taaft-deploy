"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Placeholder for authentication logic
    // In a real application, you would check for a token in local storage
    // and validate it with your backend
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    // Placeholder for login logic
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
    // Placeholder for register logic
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
    // Placeholder for logout logic
    setUser(null)
    setIsAuthenticated(false)
  }

  const loginWithGoogle = async () => {
    // Placeholder for login with Google logic
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
        isLoading,
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
