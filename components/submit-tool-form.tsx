"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Footer from "@/components/ui/footer" // Not visible in the image, but kept for completeness
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Removing Card for direct styling
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SignInModal } from "@/components/home/sign-in-modal" // Keeping these as they are functional
import { SignUpModal } from "@/components/home/sign-up-modal" // Keeping these as they are functional

// Custom component for section title, to match the image's styling
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl font-semibold text-gray-800 mb-6">{children}</h2>
)

// Custom component for form group, to apply consistent spacing and structure
const FormGroup: React.FC<{ label: string; htmlFor?: string; children: React.ReactNode }> = ({
                                                                                               label,
                                                                                               htmlFor,
                                                                                               children,
                                                                                             }) => (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-gray-700">
        {label}
      </Label>
      {children}
    </div>
)

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
    // Updated features to include title and description
    features: [{ title: "", description: "" }],
    // Simplified pricing for now to match image's 'pricing tiers' structure later
    pricingTiers: [{ name: "", price: "", description: "", popular: false }],
    premiumTool: false, // Matches the "Premium tool" checkbox in the image
    useCases: [""], // To represent the "Use Cases" section
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

  const handleFeatureChange = (index: number, field: "title" | "description", value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, { title: "", description: "" }] }))
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const handleUseCaseChange = (index: number, value: string) => {
    const updatedUseCases = [...formData.useCases]
    updatedUseCases[index] = value
    setFormData((prev) => ({ ...prev, useCases: updatedUseCases }))
  }

  const addUseCase = () => {
    setFormData((prev) => ({ ...prev, useCases: [...prev.useCases, ""] }))
  }

  const removeUseCase = (index: number) => {
    const updatedUseCases = formData.useCases.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, useCases: updatedUseCases }))
  }

  const handlePricingTierChange = (index: number, field: keyof (typeof formData.pricingTiers)[0], value: string | boolean) => {
    const updatedTiers = [...formData.pricingTiers];
    // Ensure 'price' is handled as string for input but could be converted to number later if needed
    (updatedTiers[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, pricingTiers: updatedTiers }));
  };

  const addPricingTier = () => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, { name: "", price: "", description: "", popular: false }],
    }));
  };

  const removePricingTier = (index: number) => {
    const updatedTiers = formData.pricingTiers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, pricingTiers: updatedTiers }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setIsSignInModalOpen(true)
      return
    }

    // Submit the form data to the API
    try {
      console.log("Submitting tool:", formData)
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
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">



        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Tool</h1>
            <p className="text-gray-600 mb-8">
              Share your AI tool with our community and reach thousands of potential users. Please provide as much information as possible to help users understand your tool.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <SectionTitle>Basic Information</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Tool Name *" htmlFor="name">
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., AI Image Creator"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        required
                    />
                  </FormGroup>

                  <FormGroup label="Website URL *" htmlFor="website">
                    <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        required
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Description *" htmlFor="description" className="mt-6">
                  <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what the tool does and its main benefits. Max 250 characters."
                      className="min-h-[100px] w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      required
                  />
                </FormGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormGroup label="Category *" htmlFor="category">
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50">
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
                  </FormGroup>

                  {/* This is a placeholder for the "Website URL" in the image's layout, but it's already above.
                    If the image intends a different field here, it needs clarification.
                    For now, adding a placeholder for the "Premium Tool" checkbox */}
                  <div className="flex items-end pb-2">
                    <Checkbox
                        id="premiumTool"
                        checked={formData.premiumTool}
                        onCheckedChange={(checked) => handleCheckboxChange("premiumTool", checked as boolean)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="premiumTool" className="ml-2 text-gray-700">
                      Premium tool
                    </Label>
                  </div>
                </div>
              </div>

              {/* Use Cases Section */}
              <div>
                <SectionTitle>Use Cases</SectionTitle>
                <div className="space-y-4">
                  {formData.useCases.map((useCase, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                            value={useCase}
                            onChange={(e) => handleUseCaseChange(index, e.target.value)}
                            placeholder={`e.g., Generate marketing copy`}
                            className="flex-grow border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        />
                        {formData.useCases.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeUseCase(index)}
                                className="shrink-0 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                            >
                              Remove
                            </Button>
                        )}
                      </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addUseCase} className="mt-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50">
                    + Add New Use Case
                  </Button>
                </div>
              </div>

              {/* Key Features Section */}
              <div>
                <SectionTitle>Key Features</SectionTitle>
                <div className="space-y-6">
                  {formData.features.map((feature, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 space-y-4 relative">
                        <FormGroup label="Feature Title" htmlFor={`feature-title-${index}`}>
                          <Input
                              id={`feature-title-${index}`}
                              value={feature.title}
                              onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                              placeholder="e.g., High-resolution image output"
                              className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                              required
                          />
                        </FormGroup>
                        <FormGroup label="Feature Description" htmlFor={`feature-description-${index}`}>
                          <Textarea
                              id={`feature-description-${index}`}
                              value={feature.description}
                              onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                              placeholder="Describe what this feature does. Max 100 characters."
                              className="min-h-[60px] w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                              required
                          />
                        </FormGroup>
                        {formData.features.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeFeature(index)}
                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                size="sm"
                            >
                              Remove
                            </Button>
                        )}
                      </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature} className="mt-4 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50">
                    + Add Feature
                  </Button>
                </div>
              </div>

              {/* Screenshots Section - Placeholder */}
              <div>
                <SectionTitle>Screenshots</SectionTitle>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 hover:border-gray-400 cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a2 2 0 00-2 2v28a2 2 0 002 2h24a2 2 0 002-2V14M16 20l4 4 6-6M36 28l-6 6-4-4-4 4-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1">Drag and drop your images here, or <span className="font-medium text-purple-600">browse</span></p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  {/* File input would go here */}
                  <input type="file" className="sr-only" multiple accept="image/*" />
                </div>
              </div>

              {/* Pricing Tiers (Optional) Section */}
              <div>
                <SectionTitle>Pricing Tiers (Optional)</SectionTitle>
                <div className="space-y-6">
                  {formData.pricingTiers.map((tier, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup label="Tier Name" htmlFor={`tier-name-${index}`}>
                            <Input
                                id={`tier-name-${index}`}
                                value={tier.name}
                                onChange={(e) => handlePricingTierChange(index, "name", e.target.value)}
                                placeholder="e.g., Basic, Pro, Enterprise"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            />
                          </FormGroup>
                          <FormGroup label="Price" htmlFor={`tier-price-${index}`}>
                            <Input
                                id={`tier-price-${index}`}
                                value={tier.price}
                                onChange={(e) => handlePricingTierChange(index, "price", e.target.value)}
                                placeholder="e.g., $9/month, Free"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            />
                          </FormGroup>
                        </div>
                        <FormGroup label="Tier Description" htmlFor={`tier-description-${index}`}>
                          <Textarea
                              id={`tier-description-${index}`}
                              value={tier.description}
                              onChange={(e) => handlePricingTierChange(index, "description", e.target.value)}
                              placeholder="Briefly describe what this tier offers."
                              className="min-h-[60px] w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                          />
                        </FormGroup>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                              id={`tier-popular-${index}`}
                              checked={tier.popular}
                              onCheckedChange={(checked) => handlePricingTierChange(index, "popular", checked as boolean)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <Label htmlFor={`tier-popular-${index}`} className="text-gray-700">
                            Popular tier
                          </Label>
                        </div>
                        {formData.pricingTiers.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removePricingTier(index)}
                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                size="sm"
                            >
                              Remove
                            </Button>
                        )}
                      </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPricingTier} className="mt-4 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50">
                    + Add Pricing Tier
                  </Button>
                </div>
              </div>


              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold">
                  Submit Tool
                </Button>
                <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-semibold">
                  Browse Form
                </Button>
              </div>
            </form>
          </div>
        </main>


      </div>
  )
}