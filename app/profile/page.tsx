"use client"

import {useEffect, useMemo, useState} from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { changeUserData } from "@/services/auth-service"
import {Bookmark, BookmarkCheck, Cog, Pencil, Settings} from "lucide-react"
import { useSavedTools } from "@/hooks/use-tools"; // Assuming getSavedTools is imported or defined in hooks/use-tools
import {getSavedTools} from "@/services/tool-service";
import { useQuery } from "@tanstack/react-query";
import ToolCard from "@/components/cards/tool-card";
import UserProfileCard from "@/components/cards/user_profile_card"; // Import useQuery


export default function ProfilePage() {
  const { user, isAuthenticated, isLoading,refreshUser } = useAuth()
  const router = useRouter()
  const [profile_image , setprofile_image ] = useState<File | null>(null);
  const [tab, setTab] = useState<"profile" | "saved">("profile")
  const [isEditing, setIsEditing] = useState(false);

  const [full_name, setfull_name] = useState("")
  const [bio, setBio] = useState("")
  const [tempBio, setTempBio] = useState(bio); // Temporary state for input
  // Removed local savedTools state

  const [displayUser, setDisplayUser] = useState(user);


  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  // const { data: savedTools, isLoading: isToolLoading, isError: isToolError } = useSavedTools();

  // Use react-query for fetching saved tools
  const { data: savedTools, isLoading: isToolLoading, isError: isToolError, refetch: refetchSavedTools, isFetching: isRefetching , } = useSavedTools();


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of tools to show per page

  // Calculate total number of tools and total pages
  const totalTools = savedTools?.length || 0;
  const totalPages = Math.ceil(totalTools / itemsPerPage);

  // Calculate the start and end index for the current page's data slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  // Get the tools for the current page using useMemo for performance
  const toolsForCurrentPage = useMemo(() => {
    if (!savedTools) return [];
    return savedTools.slice(startIndex, endIndex);
  }, [savedTools, startIndex, endIndex]); // Re-calculate only if savedTools, startIndex, or endIndex change

  // --- Pagination Handlers ---
  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); // Ensure page doesn't go below 1
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages)); // Ensure page doesn't exceed totalPages
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [savedTools]);

  useEffect(() => {
    if (user) {
      setTempBio(user.bio || "");
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    } else if (user) {
      setfull_name(user.full_name || "")
      setBio(user.bio || "")
    }
  }, [isAuthenticated, isLoading, router, user])


  useEffect(() => {
    if (user) {
      setDisplayUser(user);
      setfull_name(user.full_name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("bio", tempBio);
    if (profile_image) {
      formData.append("profile_image", profile_image);
    }

    try {
      const { data: updatedUser } = await changeUserData(formData);

      // Update user in auth context
      refreshUser(updatedUser);

      // Update the displayed user bio only after a successful response
      setDisplayUser(updatedUser);
      setSuccessMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };



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
            {/*if profile update is required_*/}
            {/*<UserProfileCard user={user} bio={bio} onImageUpload={handleImageUpload} />*/}
            <div className="w-full md:w-1/4 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16 bg-[#f3e8ff] text-[#7c3aed] rounded-full flex items-center justify-center text-xl font-medium mb-4 overflow-hidden">
                    {user?.profile_image  ? (
                        <img
                            src={user?.profile_image }
                            alt="User profile_image"
                            className="h-full w-full object-cover rounded-full"
                        />
                    ) : (
                        <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>
                    )}


                  </div>
                  <h2 className="text-lg font-semibold">{user?.full_name || "Full Name"}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="mt-2 text-sm text-gray-500 text-center">{bio || ""}</p>
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
                    {/* CardHeader with flexbox to align title/subtitle and the button */}
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Profile Settings</CardTitle>
                        <p className="text-sm text-gray-500">Update your profile information and preferences.</p>
                      </div>
                      {/* The Edit button - only visible when not editing */}
                      {!isEditing && (
                          <button
                              className={`flex items-center border border-gray-300 px-3 py-1.5 rounded-lg transition-colors shadow-lg 
            text-gray-600 hover:text-gray-800 hover:bg-gray-200`} // Applying style similar to your example's inactive state
                              onClick={() => setIsEditing(true)} // Enable editing mode
                          >
                            {/* Using Pencil icon for edit */}
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </button>
                      )}

                      {/* Optionally, you could add a Save/Cancel button pair here when isEditing is true */}
                      {/* For now, we'll rely on the Save button inside CardContent */}

                    </CardHeader>

                    {/* CardContent - conditionally apply classes for inactive state */}
                    <CardContent
                        className={`space-y-6 ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}
                        // opacity-60 makes it visually dimmed
                        // pointer-events-none prevents any mouse events (clicks, hover) on the content
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium">Full Name</h3>
                        <input
                            type="text"
                            value={full_name}
                            onChange={(e) => setFull_name(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50"
                            disabled={!isEditing} // Disable input when not editing
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Email</h3>
                        {/* Email is read-only, so it's always effectively disabled for editing */}
                        <input
                            type="email"
                            value={user?.email || ""}
                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-100"
                            readOnly
                            disabled // Always disabled as it's readOnly
                        />
                        <p className="text-xs text-gray-500">Contact support to change your email.</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Bio</h3>
                        <input
                            type="text"
                            value={tempBio}
                            onChange={(e) => setTempBio(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md"
                            placeholder="Technology enthusiast and explorer"
                            disabled={!isEditing} // Disable input when not editing
                        />
                      </div>

                      {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
                      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

                      {/* The Save button - only visible when in editing mode */}

                          <Button
                              onClick={handleSave}
                              className={`bg-[#a855f7] text-white rounded-lg px-4 py-2 transition-colors
                    ${isSaving
                                  ? 'opacity-50 cursor-not-allowed bg-gray-400'
                                  : 'hover:bg-[#9333ea]'}`}
                              disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>


                    </CardContent>
                  </Card>
              ) : (

                  // Saved Tools Tab Content
                  <Card>
                    <CardHeader className="relative">
                      <CardTitle>Saved Tools</CardTitle>
                      {/* Use isFetching for refetching indicator as it covers both initial fetch and subsequent refetches */}
                      {isRefetching && (
                          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isToolLoading ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 border-r-2 border-r-transparent"></div>
                            <p className="text-purple-500 text-sm">Loading your tools...</p>
                          </div>
                      ) : isToolError ? (
                          <p className="text-sm text-red-500">Failed to load saved tools.</p>
                      ) : (
                          <>
                            {totalTools === 0 ? ( // Use totalTools calculated from savedTools
                                <p className="text-sm text-gray-500">No saved tools found.</p>
                            ) : (
                                <> {/* Use a fragment to group grid and pagination */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Map over the tools for the current page */}
                                    {toolsForCurrentPage.map((tool: any) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                  </div>

                                  {/* --- Pagination Controls --- */}
                                  {/* Only show controls if there's more than one page */}
                                  {totalPages > 1 && (
                                      <div className="flex items-center justify-between mt-6"> {/* Added margin-top for spacing */}
                                        <Button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1 || isToolLoading || isRefetching} // Disable if on first page or loading
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Previous
                                        </Button>

                                        <span className="text-sm text-gray-700">
                                            Page {currentPage} of {totalPages} ({totalTools} tools) {/* Optional: Show total count */}
                                        </span>

                                        <Button
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages || isToolLoading || isRefetching} // Disable if on last page or loading
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Next
                                        </Button>
                                      </div>
                                  )}
                                </>
                            )}
                          </>
                      )}
                    </CardContent>
                  </Card>

              )}
            </div>
          </div>
        </main>
      </div>
  )
}
