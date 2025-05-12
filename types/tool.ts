export interface Category {
  id: string; // e.g., "ai-tools"
  name: string; // e.g., "AI Tools"
}

export interface Tool {
  id: string
  logo_url:string
  unique_id: string
  name: string
  slug: string
  link: string
  categories: Category[]
  description: string
  feature_list: string[]
  keywords: string[]
  pricing: "free" | "freemium" | "subscription" | "one-time" | "usage-based" | "Premium"
  hasFreeVersion: boolean
  logoUrl?: string
  screenshotUrls?: string[]
  contactName: string
  contactEmail: string
  createdAt: string
  updated_at: string
  status: "pending" | "approved" | "rejected"
  isFeatured?: boolean
  saved_by_user?: boolean
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
