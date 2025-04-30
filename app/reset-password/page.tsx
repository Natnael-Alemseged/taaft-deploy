// app/reset-password/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Use from next/navigation
import { Button } from "@/components/ui/button"; // Assuming Button component path
import { Input } from "@/components/ui/input"; // Assuming Input component path
import clsx from "clsx"; // For conditional classes
import { useResetPassword } from "@/hooks/use-auth"; // Assuming hook path
import { Loader2 } from "lucide-react"; // For loading spinner icon

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Use for potential redirect
    const [token, setToken] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Use the reset password mutation hook
    const resetMutation = useResetPassword();

    // Effect to extract token from URL on mount
    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            // If no token in URL, show an error or redirect
            setError("Invalid or missing password reset token.");
        }
    }, [searchParams]); // Re-run effect if search params change

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setSuccessMessage(null); // Clear previous success messages

        // Client-side validation
        if (!token) {
            setError("Password reset token is missing.");
            return;
        }
        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Call the mutation
        try {
            // Pass the token and new password to the mutation function
            await resetMutation.mutateAsync({
                token: token,
                new_password: newPassword,
            });
            // On success (handled by onSuccess in the hook), set success message
            setSuccessMessage("Your password has been reset successfully. You can now log in.");
            // Optionally redirect to login page after a delay
            setTimeout(() => {
                // Assuming your login page is at /login
                router.push("/login");
            }, 3000); // Redirect after 3 seconds
        } catch (err: any) {
            // onError in the hook logs the error, now set a user-friendly message
            // Attempt to get a specific error message from the API response structure if available
            const apiErrorMessage = err?.response?.data?.message || err?.message || "Failed to reset password. Please try again.";
            setError(apiErrorMessage);
        }
    };

    // Show a loading state or error if token is being processed or missing initially
    if (!token && !error) {
        // Optional: Show a loading spinner or a message while effect runs
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-700">Loading...</span>
            </div>
        );
    }


    return (
        // Center the content vertically and horizontally
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-900">Reset Password</h2>

                {/* Display Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Display Success Message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}

                {/* Render form only if token is present and no success message is shown */}
                {token && !successMessage && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <Input
                                id="new-password"
                                name="new-password"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <Input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={resetMutation.isPending || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                            >
                                {resetMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Reset Password
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}