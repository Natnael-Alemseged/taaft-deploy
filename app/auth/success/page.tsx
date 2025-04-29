// src/app/auth/success/page.tsx
"use client"; // This is a Client Component

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth-service'; // Assuming this path is correct and the function exists
import { useAuth } from '@/contexts/auth-context'; // Assuming you have an AuthContext to update state

export default function AuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setUser, setIsAuthenticated } = useAuth(); // Get setUser and setIsAuthenticated from AuthContext

    useEffect(() => {
        const handleAuthSuccess = async () => {
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            // Assuming token_type is always 'Bearer' for now, adjust if your backend sends it
            const tokenType = 'Bearer'; // You might need to get this from the URL if backend sends it

            if (accessToken) {
                console.log("AuthSuccessPage: Received access token.");
                try {
                    // 1. Store the tokens
                    localStorage.setItem('access_token', accessToken);
                    if (refreshToken) {
                        localStorage.setItem('refresh_token', refreshToken);
                    }
                    // Optionally store token type if needed elsewhere
                    localStorage.setItem('token_type', tokenType);

                    // 2. Fetch user data using the new token
                    console.log("AuthSuccessPage: Fetching user data...");
                    const user = await getCurrentUser(); // getCurrentUser should use the stored token

                    if (user) {
                        console.log("AuthSuccessPage: User data fetched successfully.");
                        // 3. Store user data (getCurrentUser might already do this, but ensure)
                        localStorage.setItem('user', JSON.stringify(user));

                        // 4. Update AuthContext state
                        setUser(user);
                        setIsAuthenticated(true);

                        // 5. Redirect the user
                        console.log("AuthSuccessPage: Login successful, redirecting...");
                        // Redirect to the homepage or a dashboard
                        router.replace('/'); // Use replace to avoid going back to this success page

                    } else {
                        console.error("AuthSuccessPage: Failed to fetch user data after receiving token.");
                        // Handle case where token is valid but user data fetch fails
                        // Clear tokens and redirect to login with an error message
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        setIsAuthenticated(false);
                        setUser(null);
                        router.replace('/sign-in?error=user_fetch_failed'); // Redirect to sign-in with error
                    }

                } catch (error) {
                    console.error("AuthSuccessPage: Error handling auth success:", error);
                    // Handle any errors during storage or user fetching
                    // Clear tokens and redirect to login with an error message
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                    router.replace('/sign-in?error=auth_failed'); // Redirect to sign-in with generic error
                }
            } else {
                console.error("AuthSuccessPage: No access token found in URL.");
                // If no access token is present, something went wrong in the SSO flow
                router.replace('/sign-in?error=no_token'); // Redirect to sign-in with error
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
