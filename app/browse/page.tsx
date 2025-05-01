// app/browse/page.tsx
// NO "use client" HERE - This is a Server Component

import React from 'react';
import { Metadata } from 'next';
import { getTools } from "@/services/tool-service";
import BrowseToolsClientContent from "@/components/BrowseToolsClientContent";
import type { Tool } from "@/types/tool";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: 'Browse AI Tools | TAAFT',
  description: 'Discover and compare the best AI tools for your needs. Search, filter, and find the perfect AI tools for your projects.',
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
        "@type": "Dataset",
        "name": "Browse AI Tools | TAAFT",
        "description": metadata.description,
        "url": `${siteUrl}/browse`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": toolsData.tools.map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "SoftwareApplication",
                    "name": tool.name,
                    "description": tool.description,
                    "url": `${siteUrl}/tools/${tool.slug || tool.id}`,
                    ...(tool.link && {
                        "applicationSuite": {
                            "@type": "WebSite",
                            "url": tool.link,
                            "name": `${tool.name} Homepage`
                        }
                    }),
                    ...(tool.keywords && tool.keywords.length > 0 && {
                        "keywords": Array.isArray(tool.keywords) ? tool.keywords.join(',') : String(tool.keywords)
                    }),
                    ...(tool.pricing && {
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock",
                            "price": typeof tool.pricing === 'number' ? tool.pricing.toString() : '0',
                            "name": `${tool.pricing} Plan`,
                            "url": tool.link
                        }
                    })
                }
            }))
        }
    };

    return JSON.stringify(schema);
}

// --- Page Component (Async Server Component) ---
export default async function BrowsePage() {
    // Fetch initial data directly on the server
    let initialToolsData: ToolsData | null = null;
    let isError = false;

    try {
        initialToolsData = await getTools();
    } catch (error) {
        console.error("Server failed to fetch tools data:", error);
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
            />
        </>
    );
}
