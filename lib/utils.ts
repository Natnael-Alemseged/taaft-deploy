import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type Tool = {
  name?: string;
  category?: string;
  description?: string;
  pricing?: string;
  website?: string;
  logoUrl?: string;
  savedByUser?: boolean;
  updatedAt?: string;
  features?: string[];
  screenshotUrls?: string[];
  pricingPlans?: {
    name: string;
    price: string;
    isFeatured: boolean;
    features: string[];
    ctaText: string;
    ctaUrl: string;
  }[];
  reviews?: {
    id: string;
    user: { name: string };
    rating: number;
    content: string;
    createdAt: string;
  }[];
  relatedTools?: {
    id: string;
    name: string;
    category: string;
    pricing: string;
    website: string;
    logoUrl: string;
  }[];
};

export function withFallbackTool(tool: Tool | undefined): Tool {
  return {
    name: tool.name || "AI Tool Name",
    category: tool.category || "AI Utility",
    description: tool.description || "This is a powerful AI tool designed to streamline your workflow and boost productivity. Ideal for creators, developers, and businesses.",
    pricing: tool.pricing || "Freemium",
    website: tool.website || "#",
    logoUrl: tool.logoUrl || "/default-logo.png",
    savedByUser: tool.savedByUser ?? false,
    updatedAt: tool.updatedAt || "2025-01-01",

    features: tool.features?.length ? tool.features : [
      "AI-Powered Processing",
      "Multi-Platform Support",
      "Customizable Output",
      "Real-time Results",
      "Secure & Reliable",
      "Beginner-Friendly Interface",
    ],

    screenshotUrls: tool.screenshotUrls?.length ? tool.screenshotUrls : ["/placeholder-screenshot.png"],

    pricingPlans: tool.pricingPlans?.length ? tool.pricingPlans : [
      {
        name: "Free",
        price: "Free",
        isFeatured: false,
        features: ["Basic features", "Community support"],
        ctaText: "Get Started",
        ctaUrl: "#",
      },
      {
        name: "Pro",
        price: "$29/month",
        isFeatured: true,
        features: ["Advanced features", "Priority support", "Unlimited usage"],
        ctaText: "Start Free Trial",
        ctaUrl: "#",
      },
      {
        name: "Enterprise",
        price: "Custom",
        isFeatured: false,
        features: ["Dedicated support", "Team features", "Custom integrations"],
        ctaText: "Contact Sales",
        ctaUrl: "#",
      },
    ],

    reviews: tool.reviews?.length ? tool.reviews : [
      {
        id: "1",
        user: { name: "Jane Doe" },
        rating: 5,
        content: "Fantastic tool! Helped me save so much time.",
        createdAt: "2025-01-01",
      },
      {
        id: "2",
        user: { name: "John Smith" },
        rating: 4,
        content: "Works well for my use case. Would recommend.",
        createdAt: "2025-02-15",
      },
    ],

    relatedTools: tool.relatedTools?.length ? tool.relatedTools : [
      {
        id: "tool-1",
        name: "AI Image Enhancer",
        category: "Image Editing",
        pricing: "Free",
        website: "#",
        logoUrl: "/default-logo.png",
      },
      {
        id: "tool-2",
        name: "Text to Art Generator",
        category: "AI Art",
        pricing: "Freemium",
        website: "#",
        logoUrl: "/default-logo.png",
      },
    ],
  };
}
