// app/glossary/page.tsx
// NO "use client" HERE - This is a Server Component

import React from 'react';
import Script from 'next/script';
// Import the server-callable service function
import { getGlossaryGrouped } from "@/services/glossary-service";
// Import the slugify utility
import { slugify } from "@/lib/utils"; // Adjust import path as necessary
// Import the client component
import GlossaryClientContent from "@/components/GlossaryClientContent";
// Import types needed for schema generation
import type { GlossaryTerm } from "@/services/glossary-service";

// Define the type for the grouped data (should match service return type)
interface GroupedGlossaryData {
  [key: string]: GlossaryTerm[];
}


// --- Schema Generation (Server-side function) ---
function generateGlossarySchema(groupedData: GroupedGlossaryData | null) {
    if (!groupedData) return null;

    const terms = Object.values(groupedData).flat();

    // Ensure NEXT_PUBLIC_SITE_URL is defined in your .env.local file
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-default-site.com'; // Provide a fallback

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": terms.map((term, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "DefinedTerm",
                "name": term.name,
                "description": term.definition, // Ensure term.definition holds the definition text
                "url": `${siteUrl}/terms/${slugify(term.id)}`, // Use siteUrl
                "inDefinedTermSet": {
                    "@type": "DefinedTermSet",
                    "name": "AI Tools Glossary"
                }
            }
        }))
    };

    return JSON.stringify(schema);
}


// --- Page Component (Async Server Component) ---
export default async function GlossaryPage() {
    // Fetch data directly on the server
    let groupedGlossaryData: GroupedGlossaryData | null = null;
    let isError = false; // Track server-side fetch error

    try {
        groupedGlossaryData = await getGlossaryGrouped();
    } catch (error) {
        console.error("Server failed to fetch glossary data:", error);
        isError = true;
        // Depending on your error handling strategy, you might render an error page here
        // or pass null/error status to the client component.
    }


    // Generate schema using the data fetched on the server
    const schemaMarkup = generateGlossarySchema(groupedGlossaryData);

    // You can pass initial loading/error status if the client component needs to react to it
    // const isLoadingInitial = !groupedGlossaryData && !isError; // Simplified initial loading


    return (
        <>
            {/* Inject Schema.org JSON-LD in the server-rendered HTML */}
            {/* This uses the built-in Next.js Script component for server rendering capability */}
            {schemaMarkup && (
                <Script
                    id="glossary-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemaMarkup }}
                />
            )}

            {/* Render the Client Component */}
            {/* Pass the fetched data (or null if error) to the client component */}
            {/* The client component will handle rendering the UI based on this data */}
            <GlossaryClientContent
                 groupedGlossaryData={groupedGlossaryData}
                 // isLoadingInitial={isLoadingInitial} // Pass initial status if used
                 // isErrorInitial={isError}
             />

             {/* Note: Header and Footer are likely in your root layout (app/layout.tsx) */}
             {/* Modals like SignInModal can also be placed higher up in the tree (e.g., layout)
                 if they are used across multiple pages and you want to avoid re-rendering them
                 on every page, but placing them here is also fine if they are specific to
                 or primarily used on this page. */}

        </>
    );
}