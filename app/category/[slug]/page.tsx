import React from 'react';
import { Metadata } from 'next';
import { getTools } from "@/services/tool-service";
import BrowseToolsClientContent from "@/components/BrowseToolsClientContent";
import type { Tool } from "@/types/tool";
import { useTools } from '@/hooks/use-tools';

// Define metadata for better SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = params.slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
        title: `${categoryName} AI Tools | TAAFT`,
    description: `Discover and explore the best ${categoryName} AI tools. Find curated ${categoryName} tools for your projects.`,
  };
}

// Define the type for the tools data
interface ToolsData {
  tools: Tool[];
  total: number;
}

// --- Schema Generation (Server-side function) ---
function generateToolsSchema(toolsData: ToolsData | null, categoryName: string) {
    if (!toolsData) return null;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taaft.org';

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${categoryName} AI Tools | TAAFT`,
        "description": `Discover and explore the best ${categoryName} AI tools. Find curated ${categoryName} tools for your projects.`,
        "url": `${siteUrl}/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
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
              "applicationCategory": categoryName,
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
export default async function CategoryPage({ params }: { params: { slug: string } }) {
    // Convert slug to category name
    const categoryName = params.slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Fetch initial data directly on the server
    let initialToolsData: ToolsData | null = null;
    let isError = false;

    // try {
    //     // Use the category-specific endpoint with default sorting
    //     console.log('calling gettools from category page');
    //     initialToolsData = await useTools({ 
    //         category: params.slug,
    //         sort_by: 'name',
    //         sort_order: 'asc'
    //     });
    // } catch (error) {
    //     console.error("Server failed to fetch category tools data:", error);
    //     isError = true;
    // }

    // Generate schema using the data fetched on the server
    // const schemaMarkup = generateToolsSchema(initialToolsData, categoryName);

    return (
        <>
            {/* Inject Schema.org JSON-LD in the server-rendered HTML
            {schemaMarkup && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemaMarkup }}
                />
            )} */}

            {/* Render the Client Component */}
            <BrowseToolsClientContent
                isFromCategoryPage={true}
                initialToolsData={initialToolsData}
                isErrorInitial={isError}
                categoryName={categoryName}
                categorySlug={params.slug}
                isCategoryPage={true}
            />
        </>
    );
} 