// app/featured-all/page.tsx
// NO "use client" HERE - This is a Server Component

import React from 'react';
import { Metadata } from 'next';
import { getTools } from "@/services/tool-service";
import BrowseToolsClientContent from "@/components/BrowseToolsClientContent";
import type { Tool } from "@/types/tool";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: 'Featured AI Tools | TAAFT',
  description: 'Discover and explore our featured AI tools. Find the best curated AI tools for your projects.',
};

// Define the type for the tools data
interface ToolsData {
  tools: Tool[];
  total: number;
}

// --- Schema Generation (Server-side function) ---
function generateToolsSchema(toolsData: ToolsData | null) {
    if (!toolsData) return null;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taaft.org';

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Featured AI Tools | TAAFT",
        "description": "Discover and explore our featured AI tools. Find the best curated AI tools for your projects.",
        "url": "https://taaft.org/featured-all",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": toolsData.tools.map((tool, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "SoftwareApplication",
              "name": tool.name,
              "description": tool.description,
              "url": `${siteUrl}/tools/${tool.id}`,
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "price": "0",
                "name": "Free Plan",
                "url": `${siteUrl}/tools/${tool.id}`
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.7",
                "reviewCount": "75"
              },
              "applicationCategory": tool.categories[0]?.name || "AI Application",
              "operatingSystem": "Web",
              "applicationSuite": {
                "@type": "WebSite",
                "url": tool.link || `${siteUrl}/tools/${tool.id}`,
                "name": `${tool.name} Homepage`
              },
              "keywords": tool.keywords?.join(", ") || ""
            }
          }))
        }
    };

    return JSON.stringify(schema);
}

// --- Page Component (Async Server Component) ---
export default async function FeaturedAllPage() {
    // Fetch initial data directly on the server
    let initialToolsData: ToolsData | null = null;
    let isError = false;

    try {
        // Use the same endpoint but with featured=true parameter
        initialToolsData = await getTools({ featured: true });
    } catch (error) {
        console.error("Server failed to fetch featured tools data:", error);
        isError = true;
    }

    // Generate schema using the data fetched on the server
    const schemaMarkup = generateToolsSchema(initialToolsData);

    return (
        <>
            {/* Inject Schema.org JSON-LD in the server-rendered HTML */}
            {schemaMarkup && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemaMarkup }}
                />
            )}

            {/* Render the Client Component */}
            <BrowseToolsClientContent
                initialToolsData={initialToolsData}
                isErrorInitial={isError}
                isFeaturedPage={true}
            />
        </>
    );
} 