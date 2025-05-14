"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { changeUserData } from "@/services/auth-service"
import { Bookmark, BookmarkCheck, Cog, Settings } from "lucide-react"
import { useSavedTools } from "@/hooks/use-tools"; // Assuming getSavedTools is imported or defined in hooks/use-tools
import {getSavedTools} from "@/services/tool-service";
import { useQuery } from "@tanstack/react-query"; // Import useQuery


export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<"profile" | "saved">("profile")

  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  // Removed local savedTools state

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  // const { data: savedTools, isLoading: isToolLoading, isError: isToolError } = useSavedTools();

  // Use react-query for fetching saved tools
  const { data: savedTools, isLoading: isToolLoading, isError: isToolError, refetch: refetchSavedTools } = useSavedTools();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    } else if (user) {
      setUsername(user.username || "")
      setBio(user.bio || "")
    }
  }, [isAuthenticated, isLoading, router, user])

  // Removed the useEffect that called fetchSavedTools based on tab change.
  // react-query handles fetching/re-fetching based on query key/stale time/manual refetch.
  // The useSavedTools hook is always "active" in this component, but react-query
  // can be configured to only fetch when the component is visible or certain conditions are met.
  // For simplicity here, we let react-query manage the lifecycle.
  // If you wanted to only fetch *when* the saved tab is clicked, you could potentially
  // use a conditional useQuery call or trigger refetchSavedTools on tab change,
  // but the current setup with the hook always present is common.

  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage("")
    setErrorMessage("")
    try {
      await changeUserData({ username, bio })
      setSuccessMessage("Profile updated successfully.")
    } catch (error) {
      setErrorMessage("Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  // Removed the manual fetchSavedTools function

  // Loading state for saved tools tab
  if (isToolLoading && tab === "saved") {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a855f7]"></div>
        </div>
    );
  }

  // Loading state for initial profile load
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a855f7]"></div>
        </div>
    );
  }


  return (
      <div className="min-h-screen bg-[#f9fafb]">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 bg-[#f3e8ff] text-[#7c3aed] rounded-full flex items-center justify-center text-xl font-medium mb-4">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <h2 className="text-lg font-semibold">{user?.username || "username"}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="mt-2 text-sm text-gray-500 text-center">{bio || "Technology enthusiast and explorer"}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 space-y-6">
              {/* Tabs at the top */}
              <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 inline-flex"> {/* Container matching the image */}
                {/* Settings Button */}
                <button
                    className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                        tab === "profile" // Or tab === "settings"
                            ? "bg-white text-gray-800 shadow-sm" // Active state styles
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200" // Inactive state styles
                    }`}
                    onClick={() => setTab("profile")} // Or setTab("settings")
                >
                  <Settings className="mr-2 h-4 w-4" /> {/* Settings Icon */}
                  Settings {/* Text matching the image */}
                </button>

                {/* Saved Tools Button */}
                <button
                    className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                        tab === "saved"
                            ? "bg-white text-gray-800 shadow-sm" // Active state styles
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200" // Inactive state styles
                    }`}
                    onClick={() => setTab("saved")}
                >
                  <BookmarkCheck className="mr-2 h-4 w-4" /> {/* Saved Tools Icon */}
                  Saved Tools {/* Text matching the image */}
                </button>
              </div>

              {tab === "profile" ? (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">Profile Settings</CardTitle>
                      <p className="text-sm text-gray-500">Update your profile information and preferences.</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Username</h3>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Email</h3>
                        <input
                            type="email"
                            value={user?.email || ""}
                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-100"
                            readOnly
                        />
                        <p className="text-xs text-gray-500">Contact support to change your email.</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Bio</h3>
                        <input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md"
                            placeholder="Technology enthusiast and explorer"
                        />
                      </div>

                      {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
                      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

                      <Button
                          onClick={handleSave}
                          className="bg-[#a855f7] hover:bg-[#9333ea] text-white"
                          disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>
              ) : (
                  // Saved Tools Tab Content
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Conditional rendering based on react-query data and error */}
                      {/* Loading state is handled before the return statement */}
                      {/* Error state is handled before the return statement */}

                      {/* Display saved tools if data is available and no error */}
                      {!isToolLoading && !isToolError && (savedTools?.length === 0 ? (
                          <p className="text-sm text-gray-500">No saved tools found.</p>
                      ) : (
                          <ul className="space-y-2">
                            {savedTools?.map((tool: any, index: number) => ( // Add type annotation for tool
                                <li key={index} className="p-3 border rounded-md bg-white">
                                  <h3 className="font-medium">{tool.name}</h3>
                                  <p className="text-sm text-gray-500">{tool.description}</p>
                                </li>
                            ))}
                          </ul>
                      ))}
                    </CardContent>
                  </Card>
              )}
            </div>
          </div>
        </main>
      </div>
  )
}

// Assuming getSavedTools is defined elsewhere, e.g., in "@/hooks/use-tools" or "@/services/tool-service"
// Make sure this function exists and fetches the data correctly.
// Example placeholder:
// async function getSavedTools() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/saved-tools`, {
//      headers: {
//         // Include auth token if needed
//         'Authorization': `Bearer ${yourAuthToken}`
//      }
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch saved tools');
//   }
//   return res.json();
// }


// The react-query hook
// export function useSavedTools() {
//   return useQuery({
//     queryKey: ["tools", "saved"],
//     queryFn: () => getSavedTools(), // Call the function that fetches the data
//     enabled: true, // You might adjust this if you only want to fetch when the tab is active
//     staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
//     cacheTime: 10 * 60 * 1000, // Data is kept in cache for 10 minutes
//   });
// }

// Note: You need to ensure `getSavedTools` function is correctly defined and imported.
// This function should handle the actual API call.
// Also ensure your application is wrapped with a QueryClientProvider for react-query to work.