export interface Category {
  id: string; // e.g., "ai-tools"
  name: string; // e.g., "AI Tools"
}
interface UserReviews {
  [key: string]: {
    rating: number;
    comment: string;
    user_name: string;
    user_profile_image_url: string;
    created_at: string;
  };
}
export interface Tool {
  id: string
  logo_url:string
  unique_id: string
  name: string
  slug: string
  link: string
  generated_description:string
  carriers: string[]
  categories: Category[]
  description: string
  feature_list: string[]
  keywords: string[]
  pricing: "free" | "freemium" | "subscription" | "one-time" | "usage-based" | "Premium"
  hasFreeVersion: boolean
  image_url?: string[]
  contactName: string
  contactEmail: string
  createdAt: string
  updated_at: string
  status: "pending" | "approved" | "rejected"
  isFeatured?: boolean
  saved_by_user?: boolean
  industry?: string
  user_reviews?: UserReviews | null;
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



export interface CarrierDetail {
  detail_page_link: string
  job_title: string
  slug: string | null
  ai_impact_score: string
  description: string
  ai_impact_summary: string
  detailed_analysis: string
  job_category: string
  tasks: Array<{
    name: string
    ai_impact_score: string
    tools: Array<{
      name: string
      logo_url: string
    }>
  }>
  _id: string
  created_at: string
  updated_at: string
}
