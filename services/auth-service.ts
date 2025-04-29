import apiClient from "@/lib/api-client" // Assuming this is for other endpoints like register/google
import axios from "axios"

// Types
interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  subscribeToNewsLetter?: boolean // Made optional as per previous discussion
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: any // Consider defining a more specific User type here as well
}

// Helper function to create form data (likely not needed for JSON APIs)
// const createFormData = (data: Record<string, string>) => {
//   const formData = new URLSearchParams()
//   Object.entries(data).forEach(([key, value]) => {
//     formData.append(key, value)
//   })
//   return formData
// }

// Login with username and password
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Assuming your backend expects application/x-www-form-urlencoded for /auth/token
    const formData = new URLSearchParams()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })

    const { access_token, token_type, refresh_token } = response.data

    // Store tokens
    localStorage.setItem("access_token", access_token)
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token)
    }

    // Fetch user details using the new access token
    const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        Accept: "application/json",
      },
    })

    const user = userResponse.data
    localStorage.setItem("user", JSON.stringify(user)) // Store user data

    return { access_token, refresh_token, token_type, user }
  } catch (error: any) {
    console.error("Login failed:", error);
    if (error.response?.status === 401) {
      throw new Error("Invalid Email or password ")
    }
    throw error // Re-throw other errors
  }
}

// Register new user (assuming it sends JSON and doesn't return tokens directly)
export const register = async (data: RegisterData) => {
  try {
    // Assuming your backend expects JSON for /auth/register
    const response = await apiClient.post("/auth/register", data);
    return response.data; // Return whatever the backend sends back
  } catch (error: any) {
    console.error("Registration failed:", error);
    throw error; // Re-throw the error for the UI to handle
  }
}

// Request password reset email
export const requestPasswordReset = async (email: string) => {
  try {
    // Assuming your backend has an endpoint for password reset requests
    // and expects the email in the request body (JSON)
    const response = await apiClient.post("/auth/request-password-reset", { email });
    return response.data; // Return confirmation message or data
  } catch (error: any) {
    console.error("Password reset request failed:", error);
    throw error; // Re-throw the error for the UI to handle
  }
}


// Get current user using stored token
export const getCurrentUser = async () => {
  const token = localStorage.getItem("access_token")

  if (!token) {
    return null
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        // Assuming token_type is 'Bearer'.
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const user = response.data;
    localStorage.setItem("user", JSON.stringify(user)); // Update user data in local storage

    return user // Return user data
  } catch (error) {
    console.error("Failed to get current user:", error)
    // If fetching user fails (e.g., token expired), clear stored tokens and user data
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    return null // Indicate no user is authenticated
  }
}

// Logout: Clear tokens and user data from storage
export const logout = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
  // Optionally call an API endpoint to invalidate tokens server-side
  // try { apiClient.post("/auth/logout"); } catch (e) { console.error("Logout API call failed:", e); }
}

// Google OAuth - Initiation (assuming this redirects)
export const initiateGoogleLogin = async () => {
  try {
    // Assuming this endpoint returns a redirect URL or directly redirects
    // If it returns a redirect URL:
    // const response = await apiClient.get<{ redirect_url: string }>("/sso/login/google");
    // window.location.href = response.data.redirect_url;

    // If the backend endpoint directly handles the redirect:
    console.log("Initiating Google SSO login...");
    // Use window.location.href to navigate directly to the backend SSO endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/sso/login/google`;

    // This function typically doesn't return a Promise that resolves after login,
    // as the page navigation interrupts the current execution flow.
    // The callback handling happens on a different page/route.
    // We can return a resolved promise or void since the navigation is synchronous from the browser's perspective
    return Promise.resolve();

  } catch (error: any) {
    console.error("Google SSO login initiation failed:", error);
    throw error; // Re-throw for the UI to handle (e.g., show error message)
  }
}

// GitHub OAuth - Initiation (assuming this redirects)
export const initiateGitHubLogin = async () => {
  try {
    console.log("Initiating GitHub SSO login...");
    // Use window.location.href to navigate directly to the backend SSO endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/sso/login/github`;

    // Return a resolved promise or void since the navigation is synchronous
    return Promise.resolve();

  } catch (error: any) {
    console.error("GitHub SSO login initiation failed:", error);
    throw error; // Re-throw for the UI to handle
  }
}


// Google OAuth - Callback handling (after redirect)
// This function would be called on your Google OAuth callback page (e.g., /auth/google/callback)
// It should receive the code as a URL parameter
export const handleGoogleCallback = async (code: string) => {
  try {
    // Exchange authorization code for tokens and potentially user info
    // Assuming your backend callback endpoint handles the code exchange and returns tokens/user
    const response = await apiClient.get<{ access_token: string; refresh_token?: string; token_type: string; user?: any }>(`/auth/google/callback?code=${code}`);

    const { access_token, token_type, refresh_token, user } = response.data;

    // Store tokens
    localStorage.setItem("access_token", access_token);
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }

    // Store user data if returned by callback, otherwise getCurrentUser will fetch it later
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // You might want to redirect the user back to the page they were on
    // or a dashboard after successful login.
    // router.push('/dashboard'); or window.location.href = '/dashboard';

    return { access_token, token_type, refresh_token, user }; // Return tokens and user data
  } catch (error: any) {
    console.error("Google login callback failed:", error);
    // Handle errors, e.g., redirect to login page with an error message
    // window.location.href = '/signin?error=google_failed';
    throw error; // Re-throw for the callback page component to handle
  }
};

// GitHub OAuth - Callback handling (assuming this is similar to Google)
// This function would be called on your GitHub OAuth callback page (e.g., /auth/github/callback)
// It should receive the code as a URL parameter
export const handleGitHubCallback = async (code: string) => {
  try {
    // Exchange authorization code for tokens and potentially user info
    // Assuming your backend callback endpoint handles the code exchange and returns tokens/user
    const response = await apiClient.get<{ access_token: string; refresh_token?: string; token_type: string; user?: any }>(`/auth/github/callback?code=${code}`);

    const { access_token, token_type, refresh_token, user } = response.data;

    // Store tokens
    localStorage.setItem("access_token", access_token);
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }

    // Store user data if returned by callback
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Redirect after successful login
    // window.location.href = '/dashboard'; // Or wherever you want to send them

    return { access_token, token_type, refresh_token, user }; // Return tokens and user data
  } catch (error: any) {
    console.error("GitHub login callback failed:", error);
    // Handle errors
    // window.location.href = '/signin?error=github_failed';
    throw error; // Re-throw
  }
}
