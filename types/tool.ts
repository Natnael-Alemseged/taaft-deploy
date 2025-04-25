export interface Tool {
  id: string
  name: string
  slug: string
  link: string
  category: string
  description: string
  features: string[]
  keywords: string[]
  pricing: "free" | "freemium" | "subscription" | "one-time" | "usage-based"
  hasFreeVersion: boolean
  logoUrl?: string
  screenshotUrls?: string[]
  contactName: string
  contactEmail: string
  createdAt: string
  updatedAt: string
  status: "pending" | "approved" | "rejected"
  isFeatured?: boolean
  savedByUser?: boolean
}

export interface ToolSubmission {
  name: string
  website: string
  category: string
  description: string
  features: string[]
  pricing: "free" | "freemium" | "subscription" | "one-time" | "usage-based"
  hasFreeVersion: boolean
  contactName: string
  contactEmail: string

}
