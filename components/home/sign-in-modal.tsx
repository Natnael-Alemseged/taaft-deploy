// components/auth/sign-in-modal.tsx // Assuming this is the path

"use client";

import { useState, useEffect } from "react";
import type React from "react";

// Import icons including Mail for the success state
import { X, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Assuming Image component is available
// Adjust path if needed
import { useAuth } from "@/hooks/use-auth"; // Assuming useAuth is now exported from hooks/use-auth.ts
import { useRouter } from "next/navigation"; // Correct import for App Router
// Assuming your auth service has the necessary functions
import { requestPasswordReset, initiateGoogleLogin, initiateGitHubLogin } from "@/services/auth-service"; // Adjust path if needed


interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLocalLoading, setIsLocalLoading] = useState(false); // Local loading state for the form submission
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle forgot password view
  const [resetEmail, setResetEmail] = useState(""); // State for forgot password email input
  const [resetMessage, setResetMessage] = useState(""); // State for success/error message after reset request
  const [isResetRequestSuccessful, setIsResetRequestSuccessful] = useState(false); // New state for tracking reset request success


  // Get isLoading from context if needed for global auth state, but local is fine for form submission state
  // Assuming useAuth hook structure based on your provided code
  const { login, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Effect to reset views and states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowForgotPassword(false); // Reset to sign-in view
      setError(""); // Clear any errors
      setResetMessage(""); // Clear any reset messages
      setResetEmail(""); // Clear email input
      setIsResetRequestSuccessful(false); // Reset success state
    }
  }, [isOpen]); // Dependency on isOpen prop


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLocalLoading(true); // Use local loading

    try {
      // Call the login function from AuthContext (or your useAuth hook)
      await login({ username: email, password });
      // If login succeeds (handled within the login function, likely setting isAuthenticated state), close modal
      onClose();
      // Optional: Trigger a refresh if your layout needs it after login, but useRouter().refresh() might be better
      // window.location.reload(); // Consider if this is necessary or desired
    } catch (err: any) {
      // Handle errors thrown by the login function
      console.error("Sign in failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to sign in. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLocalLoading(false); // Always set local loading to false
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLocalLoading(true); // Use local loading for UI feedback

    try {
      // Call the service function to initiate Google SSO redirect
      await initiateGoogleLogin();
      // The page will redirect, so loading state management after this depends on your callback page
    } catch (err: any) {
      console.error("Google login initiation failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to initiate Google sign in. Please try again.";
      setError(errorMessage);
      setIsLocalLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block needed if successful redirect occurs
  };

  const handleGitHubLogin = async () => {
    setError("");
    setIsLocalLoading(true); // Use local loading for UI feedback

    try {
      // Call the service function to initiate GitHub SSO redirect
      await initiateGitHubLogin();
      // The page will redirect, so loading state management after this depends on your callback page
    } catch (err: any) {
      console.error("GitHub login initiation failed:", err);
      const errorMessage = err.message || err.response?.data?.detail || "Failed to initiate GitHub sign in. Please try again.";
      setError(errorMessage);
      setIsLocalLoading(false); // Set loading false if initiation fails before redirect
    }
    // No finally block needed if successful redirect occurs
  };


  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setResetMessage(""); // Clear previous messages
    setIsLocalLoading(true); // Start local loading
    setIsResetRequestSuccessful(false); // Hide success message while attempting reset

    try {
      // Call the password reset request service function
      // Assuming requestPasswordReset returns something on success, like { email: string } or just success status
      const response = await requestPasswordReset(resetEmail);
      console.log("Password reset request successful:", response);

      // Set the success message, potentially using the email from the response if available
      const confirmationEmail = (response as any)?.email || resetEmail; // Try to get email from response, fallback to input email
      setResetMessage(`We've sent a password reset link to ${confirmationEmail}. Please check your inbox and follow the instructions to reset your password.`);

      setResetEmail(""); // Clear email input on success
      setIsResetRequestSuccessful(true); // Show the success UI

    } catch (err: any) {
      console.error("Password reset request failed:", err);
      // Attempt to get a specific error message from the API response structure if available
      const apiErrorMessage = err.message || err.response?.data?.detail || "Failed to request password reset. Please try again.";
      setError(apiErrorMessage);
      setIsResetRequestSuccessful(false); // Ensure success state is false on error
      // Optionally set a generic message even on error for security reasons
      // setResetMessage("If an account with that email exists, a password reset link has been sent.");
    } finally {
      setIsLocalLoading(false); // Stop local loading
    }
  };


  // Use localLoading for the form submission state
  const isSubmitting = isLocalLoading; // isSubmitting = true if handleForgotPasswordSubmit or handleSubmit is running

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {/* Adjusted max-w-md and padding for potential smaller screens */}
        {/* Added max-h and overflow-y-auto to ensure modal is scrollable if content exceeds height */}
        <div className="bg-white rounded-2xl w-full max-w-sm md:max-w-md relative p-6 md:p-8 animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]">
          {/* Close button for the entire modal */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          {/* Conditional Rendering: Forgot Password View vs. Sign In View */}
          {showForgotPassword ? (
              // --- Forgot Password View ---
              <div>
                {/* Back button to Sign In (Always visible in Forgot Password view) */}
                <button type="button" onClick={() => setShowForgotPassword(false)} className="flex items-center text-gray-500 hover:text-gray-700 mb-4 text-sm">
                  <ArrowLeft size={20} className="mr-1"/> Back to Sign In
                </button>

                {/* Conditional Rendering: Reset Request Success UI vs. Forgot Password Form */}
                {isResetRequestSuccessful ? (
                    // --- Password Reset Success UI (as shown in image) ---
                    <div className="text-center mt-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Check Your Email</h2>

                      {/* Optional initial explanatory text */}
                      <p className="text-gray-500 text-sm md:text-base mb-6">
                        If an account exists with this email, you'll receive a password reset link.
                      </p>

                      {/* Envelope Icon */}
                      <div className="flex justify-center mb-6">
                        <div className="bg-purple-100 p-4 rounded-full flex items-center justify-center"> {/* Added flex for centering icon */}
                          <Mail size={40} className="text-purple-600" />
                        </div>
                      </div>

                      {/* Specific confirmation message (using resetMessage state) */}
                      {resetMessage && <div className="mb-6 text-gray-700 text-sm md:text-base whitespace-pre-wrap">{resetMessage}</div>} {/* Added whitespace-pre-wrap */}


                      {/* Close Button for the success state */}
                      <Button
                          type="button" // Explicitly set type to button
                          onClick={onClose} // Call the modal's onClose prop
                          className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-lg text-lg"
                      >
                        Close
                      </Button>

                    </div>
                    // --- End Password Reset Success UI ---

                ) : (
                    // --- Forgot Password Form ---
                    <div>
                      <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Forgot Password?</h2>
                        <p className="text-gray-500 text-sm md:text-base">Enter your email to receive a reset link</p>
                      </div>

                      {/* Display Error Message specific to the reset request */}
                      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                      {/* Forgot password email form */}
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
                            disabled={isSubmitting} // Disable while submitting
                        >
                          {isSubmitting ? "Sending link..." : "Send Reset Link"}
                        </Button>
                      </form>
                    </div>
                    // --- End Forgot Password Form ---
                )}
              </div>
              // --- End Forgot Password View ---

          ) : (
              // --- Sign In View ---
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-gray-500 text-sm md:text-base">Sign in to your account to continue</p>
                </div>

                {/* SSO Buttons Container */}
                <div className="flex flex-col gap-3 mb-6">
                  {/* Google Sign In Button */}
                  <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isSubmitting || isAuthLoading} // Disable if local form or global auth is loading
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    {/* Assuming you have /public/google-logo.svg */}
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
                    {/* Assuming you have /public/github-logo.svg */}
                    <Image src="/github-logo.svg" alt="GitHub" width={16} height={16} />
                    <span>Continue with GitHub</span>
                  </button>
                </div>


                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                {/* Display Error Message specific to the Sign In attempt */}
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email input */}
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

                  {/* Password input */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label htmlFor="password" className="block text-md font-medium">
                        Password
                      </label>
                      {/* Forgot password link */}
                      <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[#a855f7] hover:underline text-sm">
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
                    <p className="text-gray-700 text-sm md:text-base">
                      Don't have an account?{" "}
                      <button type="button" onClick={onSwitchToSignUp} className="text-[#a855f7] hover:underline">
                        Sign up
                      </button>
                    </p>
                  </div>
                </form>
              </div>
              // --- End Sign In View ---
          )}
        </div>
      </div>
  );
}