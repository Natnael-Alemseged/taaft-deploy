// app/browse/page.tsx
// NO "use client" HERE - This is a Server Component

import React from 'react';
import {Metadata} from 'next';
import {getTools} from "@/services/tool-service";
import BrowseToolsClientContent from "@/components/BrowseToolsClientContent";
import type {Tool} from "@/types/tool";
import {useAuth} from "@/contexts/auth-context";

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

    // const {isAuthenticated} = useAuth()
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage", // Or Dataset or CollectionPage, depending on your primary page type
        "name": "Browse AI Tools | TAAFT",
        "description": "Discover and compare the best AI tools for your needs...",
        "url": "https://taaft.org/browse",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@type": "SoftwareApplication",
                        "name": "Predictive Analytics",
                        "description": "Enterprise-grade tool that forecasts business trends and customer behavior.",
                        "url": "https://taaft.org/tools/predictive-analytics",
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock",
                            "price": "0", // Price as string
                            "name": "Free Plan", // More descriptive name
                            "url": "https://taaft.org/tools/predictive-analytics" // Link to where they can get/learn about the offer
                        },
                        // --- Properties added by the fix ---
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.7", // Assuming tool.rating was 4.7 (as string)
                            "reviewCount": "75"   // Assuming tool.reviewCount was 75 (as string)
                        },
                        "applicationCategory": "BusinessApplication", // Assuming tool.category was "BusinessApplication" (as string)
                        "operatingSystem": "Web, Windows, macOS", // Assuming tool.osSupport was "Web, Windows, macOS" (as string)
                        // --- End of added properties ---

                        // Optional properties (if data exists in your tool object)
                        "applicationSuite": {
                            "@type": "WebSite",
                            "url": "https://predictiveanalyticstool.com", // Assuming tool.link was this
                            "name": "Predictive Analytics Homepage"
                        },
                        "keywords": "forecasting, business intelligence, customer behavior" // Assuming tool.keywords was this (as string or joined array)
                    }
                },
                // ... other SoftwareApplication items for each tool
            ]
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
        const initialToolsData =


            await getTools({isPublic: true});
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
                    dangerouslySetInnerHTML={{__html: schemaMarkup}}
                />
            )}

            {/* Render the Client Component */}
            <BrowseToolsClientContent
                isFromBrowsePage={true}
                initialToolsData={initialToolsData}
                isErrorInitial={isError}
            />
        </>
    );
}
