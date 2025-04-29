"use client"
import { useState } from "react"
import type React from "react"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context" // Assuming this path is correct
import { useRouter } from "next/navigation"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [subscribeToNewsLetter, setSubscribeToNewsLetter] = useState(false) // New state for checkbox
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth() // Assuming useAuth hook provides the register function
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Include subscribeToNewsLetter in the data sent to the register function
      await register({
        name,
        email,
        password,
        subscribeToNewsLetter, // Add the checkbox state here
      })
      onClose()
      router.refresh() // Refresh the page to update auth state
    } catch (err: any) {
      // Improved error handling to check for nested detail message
      const errorMessage = err.response?.data?.detail || err.message || "Failed to sign up. Please try again."
      setError(errorMessage)
      console.error("Sign up error:", err); // Log the full error for debugging
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md relative p-8 animate-in fade-in zoom-in duration-300">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
            <p className="text-gray-500">Join our community of AI enthusiasts</p>
          </div>

          {/* Google Sign Up Button */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 mb-6 hover:bg-gray-50 transition-colors">
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
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">
                Name
              </label>
              <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  required
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-lg font-medium mb-2">
                Password
              </label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  required
                  minLength={8}
              />
            </div>

            {/* Subscribe to Newsletter Checkbox */}
            <div className="flex items-center mt-4">
              <input
                  type="checkbox"
                  id="subscribeToNewsLetter"
                  checked={subscribeToNewsLetter}
                  onChange={(e) => setSubscribeToNewsLetter(e.target.checked)}
                  className="h-4 w-4 text-[#a855f7] border-gray-300 rounded focus:ring-[#a855f7]"
              />
              <label htmlFor="subscribeToNewsLetter" className="ml-2 block text-sm text-gray-900">
                Subscribe to our newsletter
              </label>
            </div>


            <Button
                type="submit"
                className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-lg text-lg"
                disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-gray-700">
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToSignIn} className="text-[#a855f7] hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
  )
}
