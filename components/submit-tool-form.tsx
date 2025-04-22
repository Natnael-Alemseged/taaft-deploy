"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SignInModal } from "@/components/home/sign-in-modal"
import { SignUpModal } from "@/components/home/sign-up-modal"

export default function SubmitToolForm() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    category: "",
    description: "",
    features: [""],
    pricing: "free",
    hasFreeVersion: false,
    contactName: "",
    contactEmail: "",
  })

  const categories = [
    "Image Generation",
    "Text Generation",
    "Development",
    "Voice Synthesis",
    "Data Visualization",
    "Video Creation",
    "Chatbots",
    "Business & Marketing",
  ]

  const pricingOptions = [
    { value: "free", label: "Free" },
    { value: "freemium", label: "Freemium" },
    { value: "subscription", label: "Subscription" },
    { value: "one-time", label: "One-time Purchase" },
    { value: "usage-based", label: "Usage-based" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setIsSignInModalOpen(true)
      return
    }

    // Submit the form data to the API
    try {
      // Implement the API call to submit the tool
      console.log("Submitting tool:", formData)
      // After successful submission, redirect to a success page
      router.push("/submit-success")
    } catch (error) {
      console.error("Error submitting tool:", error)
    }
  }

  const openSignInModal = () => {
    setIsSignUpModalOpen(false)
    setIsSignInModalOpen(true)
  }

  const openSignUpModal = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(true)
  }

  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={closeAllModals} onSwitchToSignUp={openSignUpModal} />
      {/* Sign Up Modal */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeAllModals} onSwitchToSignIn={openSignInModal} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Submit an AI Tool</h1>
        <p className="text-[#6b7280] mb-8">
          Share an AI tool with our community. All submissions are reviewed before being published.
        </p>

        {!isAuthenticated && !isLoading && (
          <div className="bg-[#f5f0ff] border border-[#e0d0ff] rounded-lg p-4 mb-8">
            <p className="text-[#6b7280] mb-4">
              You need to be signed in to submit a tool. Please sign in or create an account to continue.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white" onClick={openSignInModal}>
                Sign In
              </Button>
              <Button
                variant="outline"
                className="border-[#a855f7] text-[#a855f7] hover:bg-[#f5f0ff]"
                onClick={openSignUpModal}
              >
                Create Account
              </Button>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tool Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tool Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., AI Image Creator"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL *</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what the tool does and its main benefits..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Key Features *</Label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      required
                    />
                    {formData.features.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => removeFeature(index)} className="shrink-0">
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="mt-2">
                  Add Feature
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing Model *</Label>
                <Select value={formData.pricing} onValueChange={(value) => handleSelectChange("pricing", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasFreeVersion"
                  checked={formData.hasFreeVersion}
                  onCheckedChange={(checked) => handleCheckboxChange("hasFreeVersion", checked as boolean)}
                />
                <Label htmlFor="hasFreeVersion">This tool has a free version or free tier</Label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Your Name *</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Your Email *</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="bg-[#a855f7] hover:bg-[#9333ea] text-white">
                Submit Tool
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
