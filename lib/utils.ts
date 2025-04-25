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
    description?: string; // Add this field
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
    description?: string;
  }[];
};

export function withFallbackTool(tool?: Partial<Tool>): {
  name: string;
  category: string;
  description: string;
  pricing: string;
  website: string;
  logoUrl: string;
  features: string[];
  pricingPlans: {
    name: string;
    price: string;
    isFeatured: boolean;
    features: string[];
    ctaText: string;
    ctaUrl: string;
    description?: string; // Ensure this is in the return type
  }[];
  screenshotUrls: string[];
  relatedTools: { id: string; description: string; name: string; category: string; pricing: string; website: string; logoUrl: string }[];
  savedByUser: boolean;
  id: any;
  updatedAt: string;
  reviews: {
    id: string;
    user: { name: string };
    rating: number;
    content: string;
    createdAt: string;
  }[];
} {
  return {
    name: tool?.name ?? "AI Image Creator",
    category: tool?.category ?? "Image Generation",
    description:
        tool?.description ??
        "Generate amazing images from text prompts in seconds with AI. Simply describe the image you have in mind and let AI work its magic. Explore different artistic styles and unleash your creativity.",
    pricing: tool?.pricing ?? "Free",
    website: tool?.website ?? "https://aiimagecreator.com", // Placeholder URL
    logoUrl: tool?.logoUrl ?? "/placeholder_ai_image_creator.svg", // Placeholder URL
    features: tool?.features ?? [
      "Text-to-image generation",
      "Multiple artistic styles",
      "High-quality image output",
      "User-friendly interface",
      "Commercial license (check website for details)",
    ],
    screenshotUrls: tool?.screenshotUrls ?? [
      "https://via.placeholder.com/800x450?text=AI+Image+Creator+Screenshot+1", // Placeholder
    ],
    relatedTools: tool?.relatedTools ?? [
      {
        id: "related-tool-1",
        name: "AI Image Editor",
        category: "Image Editing",
        description: 'Good tool for basic image editing needs.',
        pricing: "Paid",
        website: "https://aiimageeditor.com", // Placeholder URL
        logoUrl: "/placeholder_ai_image_editor.svg", // Placeholder URL
      },
      {
        id: "related-tool-2",
        name: "Another AI Image Tool",
        category: "Image Generation",
        description: 'Explore different AI models for unique image creation.',
        pricing: "Free",
        website: "https://anotheraiimage.com", // Placeholder URL
        logoUrl: "/placeholder_another_ai.svg", // Placeholder URL
      },
    ],
    pricingPlans: tool?.pricingPlans ?? [
      {
        name: "Free",
        price: "Free",
        isFeatured: false,
        features: [
          "20 image generations per month",
          "Basic styles only",
          "720p resolution",
          "Community support",
          "Non-commercial license",
        ],
        ctaText: "Choose Free",
        ctaUrl: "#",
        description: "Perfect for occasional use and testing",
      },
      {
        name: "Pro",
        price: "$29",
        isFeatured: true,
        features: [
          "500 image generations per month",
          "All premium styles",
          "Up to 2K resolution",
          "Priority email support",
          "Commercial license",
          "Batch processing",
        ],
        ctaText: "Choose Pro",
        ctaUrl: "#",
        description: "Ideal for professionals and small businesses",
      },
      {
        name: "Enterprise",
        price: "$99",
        isFeatured: false,
        features: [
          "Unlimited image generations",
          "All premium styles",
          "Up to 4K resolution",
          "Dedicated support",
          "Commercial license",
          "Custom style training",
          "API access",
        ],
        ctaText: "Choose Enterprise",
        ctaUrl: "#",
        description: "For agencies and large organizations",
      },
    ],
    savedByUser: tool?.savedByUser ?? false,
    id: tool?.id ?? "ai-image-creator-fallback",
    updatedAt: tool?.updatedAt ?? new Date().toISOString(), // Default to current date/time
    reviews: tool?.reviews ?? [
      {
        id: "review-1",
        user: { name: "Alice Johnson" },
        rating: 5,
        content: "This AI image creator is fantastic! It's so easy to use and the results are amazing. I highly recommend it for anyone looking to generate unique images quickly.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      {
        id: "review-2",
        user: { name: "Bob Williams" },
        rating: 4,
        content: "I've tried a few AI image tools, and this one stands out for its variety of styles. The free plan is great for testing, but the pro version offers much more flexibility.",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // Two days ago
      },
      {
        id: "review-3",
        user: { name: "Charlie Brown" },
        rating: 3,
        content: "It's a decent tool, but sometimes the generated images aren't exactly what I had in mind. It takes some experimentation to get the desired outcome.",
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), // A week ago
      },
    ],
  };
}