"use client"
import { useState } from "react"
import type React from "react"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
}

export function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  // const [isLoading, setIsLoading] = useState(false); // Use isLoading from context? Or local? Local is better for modal specific state
  const { login, loginWithGoogle, isLoading: isAuthLoading } = useAuth(); // Get isLoading from context too if needed, but local is fine for form submission state
  const router = useRouter()

  const [isLocalLoading, setIsLocalLoading] = useState(false); // Use local loading state for the form submission

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLocalLoading(true); // Use local loading

    try {
      // Call the login function from AuthContext
      await login({ username: email, password })
      // If login succeeds (tokens stored, user fetched), close modal and refresh
      onClose()
      window.location.reload()
      // router.refresh() might be needed depending on Next.js version and cache,
      // but setting user state in AuthProvider should ideally re-render parts
      // that consume useAuth. Test if router.refresh is truly necessary.
      // router.refresh()
    } catch (err: any) {
      // Handle errors thrown by the login function
      console.error("Sign in failed:", err);
      setError(err.message || err.response?.data?.detail || "Failed to sign in. Please check your credentials.")
    } finally {
      setIsLocalLoading(false); // Always set local loading to false
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsLocalLoading(true); // Use local loading

    try {
      // This initiates the redirect. The rest happens on the callback page.
      await loginWithGoogle()
      // onClose() - Don't close here, page redirects
    } catch (err: any) {
      console.error("Google login initiation failed:", err);
      setError(err.message || err.response?.data?.detail || "Failed to initiate Google sign in. Please try again.")
      setIsLocalLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block for setting loading false if redirect happens
  }

  // Use localLoading for the form submission state
  const isSubmitting = isLocalLoading;

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md relative p-8 animate-in fade-in zoom-in duration-300">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isAuthLoading} // Disable if local form or global auth is loading
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 mb-6 hover:bg-gray-50 transition-colors"
          >
            <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... email input ... */}
            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                Email
              </label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  required
              />
            </div>

            {/* ... password input ... */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="block text-lg font-medium">
                  Password
                </label>
                <a href="#" className="text-[#a855f7] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  required
              />
            </div>


            <Button
                type="submit"
                className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-lg text-lg"
                disabled={isSubmitting || isAuthLoading} // Disable button while submitting or global auth loading
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-gray-700">
                Don't have an account?{" "}
                <button type="button" onClick={onSwitchToSignUp} className="text-[#a855f7] hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
  )
}