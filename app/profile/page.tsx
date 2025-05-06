"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Settings, BookmarkIcon } from "lucide-react"
import { changeUserData } from "@/services/auth-service" // Make sure this exists

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    } else if (user?.full_name) {
      setFullName(user.full_name)
    }
  }, [isAuthenticated, isLoading, router, user])

  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage("")
    setErrorMessage("")
    try {
      await changeUserData({ full_name: fullName })
      setSuccessMessage("Profile updated successfully.")
    } catch (error) {
      setErrorMessage("Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a855f7]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div>
          {/* <h1 className="text-3xl font-bold text-[#111827] mb-8">My Profile</h1> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
            {/* Sidebar */}
            {/* <div className="md:col-span-1"> 
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-[#111827]">
                    <User className="mr-2 h-5 w-5 text-[#a855f7]" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-[#6b7280]">
                    <BookmarkIcon className="mr-2 h-5 w-5 text-[#6b7280]" />
                    <span>Saved Tools</span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-[#6b7280]">
                    <Settings className="mr-2 h-5 w-5 text-[#6b7280]" />
                    <span>Settings</span>
                  </div>
                </CardContent>
              </Card>
            </div> */}

            {/* Main Content */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#6b7280]">Full Name</label>
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-[#6b7280]" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border border-[#e5e7eb] rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#6b7280]">Email Address</label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-[#6b7280]" />
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full p-2 border border-[#e5e7eb] rounded-md"
                        readOnly
                      />
                    </div>
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
            </div>
          {/* </div> */}
        </div>
      </main>
    </div>
  )
}
