// src/app/auth/success/page.tsx
"use client"; // This is a Client Component

import {useEffect} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
// We don't need getCurrentUser or useAuth directly in this simplified version
// import { getCurrentUser } from '@/services/auth-service';
// import { useAuth } from '@/contexts/auth-context';

export default function AuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const handleAuthSuccess = async () => {
            console.log("AuthSuccessPage: useEffect triggered to handle SSO redirect.");
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

                    // Note: We are intentionally NOT fetching user data or updating AuthContext here.
                    // The main AuthProvider's useEffect will handle fetching the user
                    // and updating the context state on the next page load.

                    // 2. Redirect the user to a different page
                    console.log("AuthSuccessPage: Tokens stored, redirecting to /");
                    // Use replace to avoid going back to this success page
                    router.replace('/');
                    console.log("refreshing page after navigating to /;");
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 1000);
                    window.location.reload();


                } catch (error: any) {
                    console.error("AuthSuccessPage: Caught an error during token storage:", error);
                    // Handle any errors during storage
                    // Clear storage and redirect to login with an error message
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user'); // Clear user data just in case
                    const errorMessage = error.message || 'storage_failed';
                    console.log(`AuthSuccessPage: Cleared tokens and redirecting to /sign-in?error=${errorMessage}`);
                    // If storage fails, we still need to redirect away from this page
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

    }, [searchParams, router]); // Dependencies: searchParams and router

    // You can render a loading message or spinner while the logic runs
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-700">Processing login...</p>
        </div>
    );
}
