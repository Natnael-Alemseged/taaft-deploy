export interface Category {
  id: string; // e.g., "ai-tools"
  name: string; // e.g., "AI Tools"
}

export interface Tool {
  id: string
  unique_id: string
  name: string
  slug: string
  link: string
  categories: Category[]
  description: string
  features: string[]
  keywords: string[]
  pricing: "free" | "freemium" | "subscription" | "one-time" | "usage-based" | "Premium"
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
  category: Category[]
  description: string
  features: string[]
  pricing: "free" | "freemium" | "subscription" | "one-time" | "usage-based"
  hasFreeVersion: boolean
  contactName: string
  contactEmail: string
}
