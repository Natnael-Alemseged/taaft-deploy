"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { changeUserData } from "@/services/auth-service"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<"profile" | "saved">("profile")

  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [savedTools, setSavedTools] = useState<any[]>([])

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    } else if (user) {
      setUsername(user.username || "")
      setBio(user.bio || "")
    }
  }, [isAuthenticated, isLoading, router, user])

  useEffect(() => {
    if (tab === "saved") {
      fetchSavedTools()
    }
  }, [tab])

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

  const fetchSavedTools = async () => {
    try {
      const res = await fetch("/api/saved-tools")
      const data = await res.json()
      setSavedTools(data)
    } catch (error) {
      console.error("Failed to fetch saved tools.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a855f7]"></div>
      </div>
    )
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
            <div className="flex space-x-4 border-b border-gray-200 pb-2">
              <button
                className={`pb-2 px-1 ${tab === "profile" ? "text-[#a855f7] border-b-2 border-[#a855f7]" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setTab("profile")}
              >
                Profile Settings
              </button>
              <button
                className={`pb-2 px-1 ${tab === "saved" ? "text-[#a855f7] border-b-2 border-[#a855f7]" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setTab("saved")}
              >
                Saved Tools
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
              <Card>
                <CardHeader>
                  <CardTitle>Saved Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedTools.length === 0 ? (
                    <p className="text-sm text-gray-500">No saved tools found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {savedTools.map((tool, index) => (
                        <li key={index} className="p-3 border rounded-md bg-white">
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-sm text-gray-500">{tool.description}</p>
                        </li>
                      ))}
                    </ul>
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