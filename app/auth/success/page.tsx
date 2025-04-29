// src/app/auth/success/page.tsx
"use client"; // This is a Client Component

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth-service'; // Assuming this path is correct and the function exists
import { useAuth } from '@/contexts/auth-context'; // Assuming you have an AuthContext to update state

export default function AuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Destructure setUser and setIsAuthenticated from useAuth, but note that
    // updating context state directly here might be less ideal than letting
    // AuthProvider's initAuth handle it after redirect.
    // However, based on your current structure, we'll keep this for now.
    const { setUser, setIsAuthenticated } = useAuth();

    useEffect(() => {
        const handleAuthSuccess = async () => {
            console.log("AuthSuccessPage: useEffect triggered.");
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            // Assuming token_type is always 'Bearer' for now, adjust if your backend sends it
            const tokenType = 'Bearer'; // You might need to get this from the URL if backend sends it

            console.log("AuthSuccessPage: Access Token found?", !!accessToken);
            console.log("AuthSuccessPage: Refresh Token found?", !!refreshToken);


            if (accessToken) {
                console.log("AuthSuccessPage: Received access token. Attempting to store tokens...");
                try {
                    // 1. Store the tokens
                    localStorage.setItem('access_token', accessToken);
                    if (refreshToken) {
                        localStorage.setItem('refresh_token', refreshToken);
                    }
                    // Optionally store token type if needed elsewhere
                    localStorage.setItem('token_type', tokenType);
                    console.log("AuthSuccessPage: Tokens stored in localStorage.");


                    // 2. Fetch user data using the new token
                    console.log("AuthSuccessPage: Attempting to fetch user data using getCurrentUser...");
                    const user = await getCurrentUser(); // getCurrentUser should use the stored token
                    console.log("AuthSuccessPage: getCurrentUser call finished.");


                    if (user) {
                        console.log("AuthSuccessPage: User data fetched successfully. User ID:", user.id);
                        // 3. Store user data (getCurrentUser might already do this, but ensure)
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log("AuthSuccessPage: User data stored in localStorage.");


                        // 4. Update AuthContext state
                        // This might be redundant if AuthProvider's initAuth runs after redirect,
                        // but keeping it here ensures state is updated immediately on this page.
                        setUser(user);
                        setIsAuthenticated(true);
                        console.log("AuthSuccessPage: AuthContext state updated.");


                        // 5. Redirect the user
                        console.log("AuthSuccessPage: Login successful, redirecting to /");
                        // Use replace to avoid going back to this success page
                        router.replace('/');

                    } else {
                        console.error("AuthSuccessPage: Failed to fetch user data after receiving token. User object is null or undefined.");
                        // Handle case where token is valid but user data fetch fails
                        // Clear tokens and redirect to login with an error message
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        setIsAuthenticated(false);
                        setUser(null);
                        console.log("AuthSuccessPage: Cleared tokens and redirecting to /sign-in?error=user_fetch_failed");
                        router.replace('/sign-in?error=user_fetch_failed');
                    }

                } catch (error: any) {
                    console.error("AuthSuccessPage: Caught an error during auth success handling:", error);
                    // Handle any errors during storage or user fetching
                    // Clear tokens and redirect to login with an error message
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                    // Attempt to extract a specific error message if available
                    const errorMessage = error.message || error.response?.data?.detail || 'auth_failed';
                    console.log(`AuthSuccessPage: Cleared tokens and redirecting to /sign-in?error=${errorMessage}`);
                    router.replace(`/sign-in?error=${errorMessage}`);
                }
            } else {
                console.error("AuthSuccessPage: No access token found in URL. Redirecting to sign-in.");
                // If no access token is present, something went wrong in the SSO flow
                router.replace('/sign-in?error=no_token');
            }
        };

        // Execute the token handling logic when the component mounts
        handleAuthSuccess();

    }, [searchParams, router, setUser, setIsAuthenticated]); // Dependencies

    // You can render a loading message or spinner while the logic runs
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-700">Processing login...</p>
        </div>
    );
}
