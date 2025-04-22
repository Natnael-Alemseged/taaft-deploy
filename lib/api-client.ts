// lib/apiClient.ts (Keep the modification from the previous step)

import axios from "axios"

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.aitoolgateway.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get session data from localStorage
    const sessionDataString = typeof window !== "undefined" ? localStorage.getItem("session") : null;

    if (sessionDataString) {
      try {
        const sessionData = JSON.parse(sessionDataString);
        // Assuming the session data structure is { user: ..., session: { token: '...' } }
        const token = sessionData?.session?.token; // Extract token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Failed to parse session data from localStorage", e);
        // Optionally clear invalid session data
        if (typeof window !== "undefined") {
          localStorage.removeItem("session");
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear auth data and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("session"); // Clear the correct key
          // Redirect to a general auth page
          window.location.href = "/auth/login"; // Assuming you have a dedicated /auth/login page
        }
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Permission denied");
        // Optionally show a message or redirect
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;