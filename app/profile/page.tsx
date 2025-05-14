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
import { useQuery } from "@tanstack/react-query";
import ToolCard from "@/components/cards/tool-card";
import UserProfileCard from "@/components/cards/user_profile_card"; // Import useQuery


export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [profile_image , setprofile_image ] = useState<File | null>(null);
  const [tab, setTab] = useState<"profile" | "saved">("profile")

  const [full_name, setfull_name] = useState("")
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
      setfull_name(user.full_name || "")
      setBio(user.bio || "")
    }
  }, [isAuthenticated, isLoading, router, user])


  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("bio", bio);
    if (profile_image ) {
      formData.append("profile_image", profile_image );
    }

    try {
      await changeUserData(formData);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // Example: Convert to a base64 string
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       console.log("Image Base64:", base64String);
  //       // Update user profile_image  or send to server
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageUpload = (file: File) => {
    setprofile_image (file);
  };


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
            <UserProfileCard user={user} bio={bio} onImageUpload={handleImageUpload} />


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
                        <h3 className="font-medium">Full Name</h3>
                        <input
                            type="text"
                            value={full_name}
                            onChange={(e) => setfull_name(e.target.value)}
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
                      {/* Conditional rendering based on data and error */}

                      {!isToolLoading && !isToolError && (savedTools?.length === 0 ? (
                          <p className="text-sm text-gray-500">No saved tools found.</p>
                      ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {savedTools?.map((tool: any) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                          </div>
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
