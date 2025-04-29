"use client"
import { useState, useEffect } from "react" // Import useEffect
import type React from "react"

import { X, ArrowLeft } from "lucide-react" // Import ArrowLeft icon
import { Button } from "@/components/ui/button" // Assuming Button component is available
import Image from "next/image" // Assuming Image component is available
import { useAuth } from "@/contexts/auth-context" // Assuming this path is correct
import { useRouter } from "next/navigation" // Correct import for App Router
// Assuming your auth service has the necessary functions
import { requestPasswordReset, initiateGoogleLogin, initiateGitHubLogin } from "@/services/auth-service";


interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
}

export function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLocalLoading, setIsLocalLoading] = useState(false) // Local loading state for the form submission
  const [showForgotPassword, setShowForgotPassword] = useState(false) // State to toggle forgot password view
  const [resetEmail, setResetEmail] = useState(""); // State for forgot password email input
  const [resetMessage, setResetMessage] = useState(""); // State for success/error message after reset request

  // Get isLoading from context if needed for global auth state, but local is fine for form submission state
  const { login, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  // Effect to reset forgot password view when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowForgotPassword(false); // Reset to sign-in view
      setError(""); // Clear any errors
      setResetMessage(""); // Clear any reset messages
      setResetEmail(""); // Clear email input
    }
  }, [isOpen]); // Dependency on isOpen prop


  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLocalLoading(true) // Use local loading

    try {
      // Call the login function from AuthContext
      await login({ username: email, password })
      // If login succeeds (tokens stored, user fetched), close modal and refresh
      onClose()
      // Consider if window.location.reload() is truly necessary or if router.refresh() or state updates are sufficient
      window.location.reload()
    } catch (err: any) {
      // Handle errors thrown by the login function
      console.error("Sign in failed:", err)
      const errorMessage = err.message || err.response?.data?.detail || "Failed to sign in. Please check your credentials."
      setError(errorMessage)
    } finally {
      setIsLocalLoading(false) // Always set local loading to false
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsLocalLoading(true) // Use local loading for UI feedback

    try {
      // Call the service function to initiate Google SSO redirect
      await initiateGoogleLogin();
      // The page will redirect, so no need to set loading false here if successful
    } catch (err: any) {
      console.error("Google login initiation failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to initiate Google sign in. Please try again.";
      setError(errorMessage);
      setIsLocalLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block for setting loading false if redirect happens
  }

  const handleGitHubLogin = async () => {
    setError("");
    setIsLocalLoading(true); // Use local loading for UI feedback

    try {
      // Call the service function to initiate GitHub SSO redirect
      await initiateGitHubLogin();
      // The page will redirect, so no need to set loading false here if successful
    } catch (err: any) {
      console.error("GitHub login initiation failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to initiate GitHub sign in. Please try again.";
      setError(errorMessage);
      setIsLocalLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block for setting loading false if redirect happens
  }


  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setIsLocalLoading(true);

    try {
      // Call the password reset request service function
      await requestPasswordReset(resetEmail);
      setResetMessage("If an account with that email exists, a password reset link has been sent.");
      setResetEmail(""); // Clear email input on success
      // Optionally switch back to sign-in view after a delay or keep this message visible
      // setTimeout(() => setShowForgotPassword(false), 5000); // Auto-close after 5 seconds
    } catch (err: any) {
      console.error("Password reset request failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to request password reset. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLocalLoading(false);
    }
  };


  // Use localLoading for the form submission state
  const isSubmitting = isLocalLoading

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {/* Adjusted max-w-md and padding for potential smaller screens */}
        <div className="bg-white rounded-2xl w-full max-w-sm md:max-w-md relative p-6 md:p-8 animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]"> {/* Added max-h and overflow-y-auto */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          {showForgotPassword ? (
              // Forgot Password View
              <div>
                <button type="button" onClick={() => setShowForgotPassword(false)} className="flex items-center text-gray-500 hover:text-gray-700 mb-4 text-sm"> {/* Added type="button" and text-sm */}
                  <ArrowLeft size={20} className="mr-1"/> Back to Sign In
                </button>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Forgot Password?</h2> {/* Adjusted text size */}
                  <p className="text-gray-500 text-sm md:text-base">Enter your email to receive a reset link</p> {/* Adjusted text size */}
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                {resetMessage && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{resetMessage}</div>}


                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="resetEmail" className="block text-lg font-medium mb-2">
                      Email Address
                    </label>
                    <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                        required
                    />
                  </div>
                  <Button
                      type="submit"
                      className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-lg text-lg"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending link..." : "Send Reset Link"}
                  </Button>
                </form>
              </div>
          ) : (
              // Sign In View
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h2> {/* Adjusted text size */}
                  <p className="text-gray-500 text-sm md:text-base">Sign in to your account to continue</p> {/* Adjusted text size */}
                </div>

                {/* SSO Buttons Container */}
                <div className="flex flex-col gap-3 mb-6"> {/* Use flex column for buttons */}
                  {/* Google Sign In Button */}
                  <button
                      type="button" // Explicitly set type to button
                      onClick={handleGoogleLogin}
                      disabled={isSubmitting || isAuthLoading} // Disable if local form or global auth is loading
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
                    <span>Continue with Google</span>
                  </button>

                  {/* GitHub Sign In Button */}
                  <button
                      type="button"
                      onClick={handleGitHubLogin}
                      disabled={isSubmitting || isAuthLoading}
                      className="w-full flex items-center justify-center gap-1 border border-gray-300 rounded-md p-2 text-sm mb-4 hover:bg-gray-50 transition-colors"
                  >
                    <Image src="/github-logo.svg" alt="GitHub" width={16} height={16} />
                    <span>Continue with GitHub</span>
                  </button>
                </div>


                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ... email input ... */}
                  <div>
                    <label htmlFor="email" className="block text-md font-medium mb-2">
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
                      <label htmlFor="password" className="block text-md font-medium">
                        Password
                      </label>
                      {/* Forgot password link */}
                      <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[#a855f7] hover:underline text-sm"> {/* Adjusted text size */}
                        Forgot password?
                      </button>
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
                    <p className="text-gray-700 text-sm md:text-base"> {/* Adjusted text size */}
                      Don't have an account?{" "}
                      <button type="button" onClick={onSwitchToSignUp} className="text-[#a855f7] hover:underline">
                        Sign up
                      </button>
                    </p>
                  </div>
                </form>
              </div>
          )}
        </div>
      </div>
  )
}
