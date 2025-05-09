"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Assuming you are using Next.js App Router
import { Card, CardContent } from "@/components/ui/card"; // Assuming you have these shadcn/ui components

// Define the type for an article based on the provided API response structure
interface Article {
    id: string; // Using _id as the unique identifier
    title: string;
    body: string; // The full HTML body
    url?: string; // Optional URL field
    images?: string[]; // Optional array of image URLs
    related_glossary_terms?: string[]; // Optional array of related terms
    // Add other fields if they exist in the API response
}

// Helper function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html: string, limit: number = 150): string => {
    if (!html) return "No description available.";
    // Create a temporary div element to parse HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Get the text content, which strips tags
    const text = doc.body.textContent || "";
    // Truncate the text
    if (text.length <= limit) return text;
    return `${text.substring(0, limit)}...`;
};

const ArticleListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Hook for navigation

    // API endpoint
    const API_URL = process.env.NEXT_PUBLIC_API_URL+ "/api/blog/articles?skip=0&limit=20&sort_by=_id&sort_desc=true";

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Article[] = await response.json(); // Assuming the API returns an array of Article
                setArticles(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch articles");
                console.error("Failed to fetch articles:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []); // Empty dependency array means this effect runs only once on mount

    // Function to handle card click and navigate
    const handleCardClick = (articleId: string) => {
        console.log(`article id is : ${articleId}`);
        // Navigate to the blog detail page using the article's ID
        router.push(`/blog/${articleId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Articles</h1>

            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-600 dark:text-red-400 py-8">
                    <p>{error}</p>
                    <p>Please try again later.</p>
                </div>
            )}

            {!isLoading && !error && articles.length === 0 && (
                 <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                     <p>No articles found.</p>
                 </div>
            )}

            {!isLoading && !error && articles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        // Use a div as a clickable container around the Card
                        <div
                            key={article.id} // Use the unique ID as the key
                            className="cursor-pointer"
                            onClick={() => handleCardClick(article.id)}
                            // Add keyboard accessibility
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleCardClick(article.id);
                                }
                            }}
                            role="link" // Indicate it behaves like a link
                            tabIndex={0} // Make it focusable
                            aria-label={`Read article: ${article.title}`} // Accessible label
                        >
                            <Card className="h-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
                                <CardContent className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        {/* Article Title */}
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                            {article.title}
                                        </h2>
                                        {/* Article Snippet (stripped HTML) */}
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {stripHtmlAndTruncate(article.body, 150)} {/* Truncate the body */}
                                        </p>
                                    </div>
                                    {/* Optional: Add date, author, etc. here if available in the API */}
                                    {/* <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                                        Published on: {new Date(article.publishedDate).toLocaleDateString()}
                                    </div> */}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleListPage;
