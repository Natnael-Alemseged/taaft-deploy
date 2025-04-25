import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Tool } from "@/types/tool"

export const withFallbackTool = (tool: Tool): Tool => {
  return {
    id: tool.id || "default-id",
    name: tool.name || "Default Tool",
    slug: tool.slug || "default-tool",
    link: tool.link || "https://example.com",
    category: tool.category || "AI Tool",
    description: tool.description || "A default AI tool.",
    features: tool.features || [],
    pricing: tool.pricing || "free",
    hasFreeVersion: tool.hasFreeVersion || false,
    logoUrl: tool.logoUrl || "/placeholder.svg",
    screenshotUrls: tool.screenshotUrls || [],
    contactName: tool.contactName || "Default Contact",
    contactEmail: tool.contactEmail || "default@example.com",
    createdAt: tool.createdAt || new Date().toISOString(),
    updatedAt: tool.updatedAt || new Date().toISOString(),
    status: tool.status || "approved",
    isFeatured: tool.isFeatured || false,
    savedByUser: tool.savedByUser || false,
    keywords: tool.keywords || [],
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
