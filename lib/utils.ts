import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Tool } from "@/types/tool"

// Define types for nested objects if they aren't already part of the Tool type
// Assuming Tool type might need these added or they exist but weren't in the original snippet
interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  isFeatured?: boolean;
}

interface Review {
  id: string;
  user: { name: string };
  rating: number; // 1-5
  content: string;
  createdAt: string; // ISO string
}

interface RelatedTool {
  id: string;
  name: string;
  category: string;
  description: string;
  // Add other fields if needed by the rendering component, e.g., link, logoUrl
  link?: string;
  logoUrl?: string;
}


export const withFallbackTool = (tool: Tool): {
  id: string;
  name: string;
  slug: string;
  link: string;
  category: string;
  description: string;
  features: string[];
  keywords: string[];
  pricing: string;
  hasFreeVersion: boolean;
  logoUrl: string;
  screenshotUrls: string[];
  contactName: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  savedByUser: boolean;
  pricingPlans: any;
  reviews: any;
  relatedTools: RelatedTool[]
} => {
  return {
    id: tool.id || "default-image-tool-id", // More specific default ID
    name: tool.name || "AI Image Creator", // Default name from screenshot
    slug: tool.slug || "ai-image-creator", // Default slug
    link: tool.link || "#",
    category: tool.category || "Image Generation", // More specific category
    description: tool.description || "A powerful AI tool for generating images from text descriptions and various styles.", // More specific description
    features: tool.feature_list || [ // Default features based on screenshot
      "Text to Image Generation",
      "Multiple Styles",
      "High-Resolution Output",
      "Customization Options",
      "Commercial License"
    ],
    keywords: tool.keywords || ["image generation", "AI art", "text to image", "image editor"], // More specific keywords
    pricing:  tool.pricing == "0" || "free" ? "free" : "Premium" || "free",
    hasFreeVersion: tool.hasFreeVersion ?? true, // Default to true based on screenshot
    logoUrl: tool.logoUrl || "/robot.png", // Consider a more specific placeholder
    screenshotUrls: tool.image_url || [ // Add a placeholder screenshot URL
      "https://images.tech.co/wp-content/uploads/2024/01/15074809/AdobeStock_640654498-1-708x400.jpeg"
    ],
    contactName: tool.contactName || "Support Team", // Generic contact name
    contactEmail: tool.contactEmail || "support@example.com", // Generic contact email
    createdAt: tool.createdAt || new Date().toISOString(),
    updatedAt: tool.updated_at || new Date().toISOString(),
    status: tool.status || "approved",
    isFeatured: tool.isFeatured ?? false,
    savedByUser: tool.savedByUser ?? false,

    // Add fallback data for pricing plans, reviews, and related tools
    pricingPlans: (tool as any).pricingPlans || [
      {
        name: "Free",
        price: "$0",
        description: "Limited access to features.",
        features: ["Basic generation", "Standard resolution"],
        ctaText: "Get Started",
        ctaUrl: "#",
        isFeatured: false,
      },
      {
        name: "Pro",
        price: "$29",
        description: "Unlock more features and higher limits.",
        features: ["High-resolution", "More styles", "Faster generation"],
        ctaText: "Choose Pro",
        ctaUrl: "#",
        isFeatured: true, // Based on screenshot's 'POPULAR' tag
      },
      {
        name: "Enterprise",
        price: "$99",
        description: "Custom solutions for large teams.",
        features: ["Unlimited generation", "Dedicated support", "API access"],
        ctaText: "Contact Us",
        ctaUrl: "#",
        isFeatured: false,
      },
    ] as PricingPlan[], // Cast to the defined type

    reviews: (tool as any).reviews || [
      {
        id: "review-1",
        user: { name: "Sarah Johnson" },
        rating: 5,
        content: "This tool is amazing! The image quality is fantastic and it's so easy to use.",
        createdAt: new Date(2024, 3, 15).toISOString(), // April 15, 2024
      },
      {
        id: "review-2",
        user: { name: "David Lee" },
        rating: 4,
        content: "Great features, especially the style options. Sometimes the generation is a bit slow.",
        createdAt: new Date(2024, 3, 10).toISOString(), // April 10, 2024
      },
      {
        id: "review-3",
        user: { name: "Emily Chen" },
        rating: 5,
        content: "Perfect for my marketing needs. The commercial license is a huge plus.",
        createdAt: new Date(2024, 3, 18).toISOString(), // April 18, 2024
      },
    ] as Review[], // Cast to the defined type

    relatedTools: (tool as any).relatedTools || [
      {
        id: "related-tool-1",
        name: "AI Image Generator Pro",
        category: "Image Generation",
        description: "Another powerful tool for creating images.",
        link: "#",
        logoUrl: "/placeholder-related-tool-1.svg"
      },
      {
        id: "related-tool-2",
        name: "Creative AI Painter",
        category: "Image Generation",
        description: "Focuses on artistic and creative image styles.",
        link: "#",
        logoUrl: "/placeholder-related-tool-2.svg"
      },
      {
        id: "related-tool-3",
        name: "AI Photo Enhancer",
        category: "Photo Editing",
        description: "Enhance and modify existing photos using AI.",
        link: "#",
        logoUrl: "/placeholder-related-tool-3.svg"
      },
    ] as RelatedTool[], // Cast to the defined type

  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts

// Helper function to convert a string into a URL-friendly slug
export function slugify(text: string): string {
  if (!text) return "" // Handle empty or null text
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars except -
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

