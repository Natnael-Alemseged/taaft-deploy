"use client"

import {createContext, useContext, useState, useEffect, type ReactNode} from "react"
import {
    login as loginService,
    logout as logoutService,
    getCurrentUser, // Assume this service uses a stored token
    initiateGoogleLogin,
    register,
    refreshUser,  // Add this line
    // Assume loginService now returns { access_token, refresh_token, user? }
} from "@/services/auth-service"
import {useRouter} from "next/navigation";

interface User {
    id: string
    name: string
    email: string
    full_name: string

    [key: string]: any // Allow for other properties
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: { username: string; password: string }) => Promise<void> // Modified to handle token storage
    register: (data: {
        full_name: string;
        email: string;
        password: string;
        subscribeToNewsletter: boolean
    }) => Promise<void>
    logout: () => void // Modified to clear tokens
    loginWithGoogle: () => Promise<void>
    refreshUser: (updatedUser: User) => void  // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Effect to initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check for stored token first
                const storedAccessToken = localStorage.getItem("access_token")

                if (storedAccessToken) {
                    // If token exists, try to fetch current user using the token
                    // Assumes getCurrentUser service reads the token from storage
                    const currentUser = await getCurrentUser()

                    if (currentUser) {
                        // Token is valid and user data fetched
                        setUser(currentUser)
                        // Ensure user data is also in localStorage if needed elsewhere
                        localStorage.setItem("user", JSON.stringify(currentUser)) // Keep user data in LS if needed
                    } else {
                        // Token might be expired or invalid, clear storage
                        console.warn("Stored token invalid, clearing auth data.")
                        localStorage.removeItem("access_token")
                        localStorage.removeItem("refresh_token") // Clear refresh token too
                        localStorage.removeItem("user") // Clear user data
                        setUser(null) // Set user to null
                    }
                } else {
                    // No token found in storage, user is not authenticated
                    setUser(null)
                }
            } catch (error) {
                // Handle potential network errors or other issues during initialization
                console.error("Auth initialization failed:", error)
                // Clear storage and state on error to ensure clean state
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                localStorage.removeItem("user")
                setUser(null)
            } finally {
                setIsLoading(false) // Loading is complete
            }
        }

        initAuth()
    }, []) // Empty dependency array means this runs once on mount

    // Login function: Calls service, stores tokens, fetches/sets user
    const login = async (credentials: { username: string; password: string }) => {
        setIsLoading(true) // Set loading before the process begins
        try {
            console.log(`base url is ${process.env.NEXT_PUBLIC_API_URL}`)

            // Call the login service - assume it returns { access_token, refresh_token, user? }
            const response = await loginService(credentials)

            // --- Store the tokens ---
            if (response.access_token) {
                localStorage.setItem("access_token", response.access_token)
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 60);
                document.cookie = `access_token=${response.access_token}; path=/; secure; SameSite=Strict; expires=${expirationDate.toUTCString()}`;

            }
            if (response.refresh_token) {
                localStorage.setItem("refresh_token", response.refresh_token)
            }
            // -------------------------

            // --- Fetch and set user data ---
            // Even if loginService returned a user, calling getCurrentUser
            // after setting the token is a good practice to validate the token
            // and get the standard user payload from the /me endpoint.
            const currentUser = await getCurrentUser() // This should use the token we just stored

            if (currentUser) {
                setUser(currentUser)
                localStorage.setItem("user", JSON.stringify(currentUser)) // Store user data
                console.log("current user id is:", currentUser.id)
            } else {
                // This case indicates login was successful but fetching user failed,
                // which is a critical error. Clean up.
                console.error("Login successful but failed to fetch user data.")
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                localStorage.removeItem("user")
                setUser(null)
                throw new Error("Login failed: Could not fetch user data.") // Propagate error
            }
            // -----------------------------

            // If everything succeeded, no explicit return needed, Promise resolves
        } catch (error) {
            // Handle login service errors (e.g., invalid credentials)
            console.error("Login failed:", error)
            // Clear storage on login failure
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user")
            setUser(null) // Ensure user state is null on failure
            // Re-throw the error so the calling component (SignInModal) can handle it
            throw error
        } finally {
            // setIsLoading(false) is handled by the catch/try block finishing,
            // or you could place it explicitly here. Let's keep it inside catch/try
            // or ensure it's called *after* getCurrentUser succeeds/fails.
            // Placing it here ensures it's always false after the login attempt completes.
            setIsLoading(false)
        }
    }

    // Logout function: Clears storage and state
    const logout = async () => {


        try {


             logoutService() // Call API logout if applicable


        } catch (error) {
            console.error("Error during logout:", error)
        } finally {



            // Always clear tokens and user from storage
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user")


            window.location.href = "/";

            console.log('logged out');
            setUser(null) // Clear user state


            // window.location.reload(); // Ensure a full reload


        }
    }


    // loginWithGoogle function (likely handled via redirect, initAuth will pick up tokens)
    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            // This service likely initiates the OAuth flow and redirects.
            // The actual token and user data handling after redirect happens elsewhere
            // (e.g., in a callback page's useEffect that calls a service function
            // to exchange the auth code for tokens, stores them, and then redirects).
            // The initAuth useEffect will then run on the final page load and fetch user.
            const {url} = await initiateGoogleLogin()
            window.location.href = url
            // window.location.reload();
        } catch (error) {
            console.error("Google login initiation error:", error)
            setIsLoading(false) // Set loading to false if initiation fails
            throw error // Re-throw for component handling
        }
        // setIsLoading(false) is NOT in finally here because window.location.href will unload the page.
        // If initiation fails before redirect, the catch block handles setting isLoading to false.
    }

    const refreshUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register, // Make sure register's login call is updated if register flow changes
                logout,
                loginWithGoogle,
                refreshUser,  // Add this line
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
