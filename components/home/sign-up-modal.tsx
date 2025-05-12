"use client"
import { useState, useEffect } from "react" // Import useEffect
import type React from "react"

import { X } from "lucide-react" // Import X icon
import { Button } from "@/components/ui/button" // Assuming Button component is available
import Image from "next/image" // Assuming Image component is available
import { useAuth } from "@/contexts/auth-context" // Assuming this path is correct
import { useRouter } from "next/navigation" // Correct import for App Router
import SuccessfulSignUpModal from "@/components/successful-signup-modal";

// Import the Google SSO initiation function from your auth service
import { initiateGitHubLogin, initiateGoogleLogin } from "@/services/auth-service";


interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const [full_name, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false) // New state for checkbox
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Local loading state for the form submission
  const { register } = useAuth() // Assuming useAuth hook provides the register function
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Effect to clear form and errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setEmail("");
      setPassword("");
      setSubscribeToNewsletter(false);
      setError(""); // Clear error on close
    }
  }, [isOpen]); // Dependency on isOpen prop


  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Clear previous errors
    // setIsLoading(true) // Set loading *after* client validation

    // --- Client-Side Validation Checks ---

    if(full_name.length > 20) {
      setError("Full name must be less than 20 characters.");
      // setIsLoading(false); // Already false at this point
      return;
    }

    // 1. Full Name Validation (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!nameRegex.test(full_name)) {
      setError("Full name can only contain letters and spaces.");
      // setIsLoading(false); // Already false at this point
      return;
    }

    // 2. Password Match Check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      // setIsLoading(false); // Already false at this point
      return;
    }

    // 3. Password Complexity Check
    // Criteria: at least 8 characters (handled by minLength in input and regex),
    // at least one uppercase letter, one lowercase letter, one number, one special character
    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordComplexityRegex.test(password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      // setIsLoading(false); // Already false at this point
      return;
    }

    // --- End Client-Side Validation ---

    // If all client validation passes, set loading and proceed with API call
    setIsLoading(true);

    try {
      // Include subscribeToNewsLetter in the data sent to the register function
      await register({
        full_name,
        email,
        password,
        subscribeToNewsletter, // Add the checkbox state here
      })
      setShowSuccessModal(true);

      // onClose()
      // router.refresh() // Refresh the page to update auth state
    } catch (err: any) {
      // Improved error handling to check for nested detail message
      // If the API sends back validation errors, they will appear here
      const errorMessage = err.response?.data?.detail || err.message || "Failed to sign up. Please try again."
      setError(errorMessage)
      console.error("Sign up error:", err); // Log the full error for debugging
    } finally {
      setIsLoading(false) // Always set local loading to false
    }
  }

  // Handle Google SSO initiation for Sign Up
  const handleGoogleSignup = async () => {
    setError(""); // Clear previous errors
    setIsLoading(true); // Indicate loading state

    try {
      // Call the service function to initiate Google SSO redirect
      // The page will redirect, so the rest of the process happens on the callback page
      await initiateGoogleLogin();
      router.push("/");
      router.refresh();
      // No need to set isLoading(false) here if the redirect is successful
    } catch (err: any) {
      console.error("Google signup initiation failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to initiate Google sign up. Please try again.";
      setError(errorMessage);
      setIsLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block needed here as successful initiation leads to redirect
  };

  const handleGithubSignup = async () => {
    setError(""); // Clear previous errors
    setIsLoading(true); // Indicate loading state

    try {
      // Call the service function to initiate Github SSO redirect
      // The page will redirect, so the rest of the process happens on the callback page
      await initiateGitHubLogin();
      // No need to set isLoading(false) here if the redirect is successful
    } catch (err: any) {
      console.error("Github signup initiation failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to initiate Github sign up. Please try again.";
      setError(errorMessage);
      setIsLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block needed here as successful initiation leads to redirect
  };

  if (showSuccessModal) {
    return <SuccessfulSignUpModal onClose={() => {
      setShowSuccessModal(false);
      onClose();  // Close the signup modal afterward
    }} />;
  }
  

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        {/* Adjusted max-w-md and padding for potential smaller screens */}
        {/* Added overflow-y-auto and max-h-[95vh] to ensure scrollability if content exceeds viewport height */}
        {/* The absolute positioned close button should remain visible at the top right within this container */}
        <div className="bg-white rounded-2xl w-full max-w-sm md:max-w-md relative p-6 md:p-8 animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          <div className="text-center mb-3">
            <h2 className="text-2xl md:text-2xl font-bold mb-2">Create an Account</h2> {/* Adjusted text size */}
            <p className="text-gray-500 text-xs md:text-base">Join our community of AI enthusiasts</p> {/* Adjusted text size */}
          </div>

          {/* Google Sign Up Button */}
          {/* Added onClick handler and disabled state */}
          <button
              type="button" // Explicitly set type to button
              onClick={handleGoogleSignup} // Call the new handler
              disabled={isLoading} // Disable while loading (form submission or SSO initiation)
              className="w-full flex items-center justify-center gap-1 border border-gray-300 rounded-md p-2 text-sm mb-4 hover:bg-gray-50 transition-colors"
          >
            <Image src="/google-logo.svg" alt="Google" width={16} height={16} />
            <span>Continue with Google</span>
          </button>
          <button
              type="button" // Explicitly set type to button
              onClick={handleGithubSignup} // Call the new handler
              disabled={isLoading} // Disable while loading (form submission or SSO initiation)
              className="w-full flex items-center justify-center gap-1 border border-gray-300 rounded-md p-2 text-sm mb-4 hover:bg-gray-50 transition-colors"
          >
            <Image src="/github-logo.svg" alt="Github" width={16} height={16} />
            <span>Continue with Github</span>
          </button>


          <div className="flex items-center gap-1">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {/* Error message display */}
          {error && (
            <div className="mt-4 p-2 bg-red-50 text-red-600 rounded-lg text-sm text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mt-4"> {/* Added mt-4 to space from potential error */}
            <div>
              <label htmlFor="full_name" className="block text-md font-medium ">
                Name
              </label>
              <input
                  type="text"
                  id="full_name"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-md font-medium ">
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
              <label htmlFor="password" className="block text-md font-medium ">
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
                    minLength={8} // Keep minLength for basic browser validation/hint
                />
              </div>

              <div>
              <label htmlFor="confirmPassword" className="block text-md font-medium ">
                Confirm Password
              </label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                    required
                    minLength={8} // Keep minLength for basic browser validation/hint
                />
              </div>

            {/* Subscribe to Newsletter Checkbox */}
            <div className="flex items-center mt-4">
              <input
                  type="checkbox"
                  id="subscribeToNewsletter"
                  checked={subscribeToNewsletter}
                  onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                  className="h-4 w-4 text-[#a855f7] border-gray-300 rounded focus:ring-[#a855f7]"
              />
              <label htmlFor="subscribeToNewsletter" className="ml-2 block text-sm text-gray-900 cursor-pointer"> {/* Added cursor-pointer */}
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
              <p className="text-gray-700 text-sm md:text-base"> {/* Adjusted text size */}
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