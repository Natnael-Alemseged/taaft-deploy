// // BlogPostDetail.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link'; // Assuming Next.js Link
// import Image from 'next/image'; // Assuming Next.js Image component
// import { Share2, Link as LinkIcon } from 'lucide-react'; // Icons for Share and Copy Link
// import { Button } from "@/components/ui/button"; // Assuming Button component

// // Define interfaces for the blog post data structure
// interface Author {
//   name: string;
//   bio: string;
//   avatarUrl?: string; // Optional avatar image URL
// }

// interface ArticleSection {
//   heading?: string; // Optional heading for a section
//   content: string; // Main content of the section
//   highLight?: string; // Optional highlighted sentence or text
//   subsections?: { heading: string; content: string }[]; // Optional nested subsections (restored content)
// }

// interface RelatedArticle {
//   id: string; // Unique ID for the related article
//   title: string;
//   slug: string; // URL-friendly slug
//   // Add other relevant fields like author, date, etc. if needed for display
// }

// interface BlogPost {
//   id: string; // Unique ID for the blog post
//   title: string;
//   slug: string; // URL-friendly slug for the article page
//   publishDate: string; // Date of publication
//   author: Author;
//   excerpt: string; // Short summary/introduction
//   content: ArticleSection[]; // Array of content sections
//   relatedArticles?: RelatedArticle[]; // Optional array of related articles
//   // Add other fields like cover image URL if applicable
// }

// // Placeholder data matching the BlogPost interface
// const placeholderBlogPost: BlogPost = {
//   id: 'understanding-ai-beginners-guide',
//   title: 'Understanding AI: A Beginner\'s Guide',
//   slug: 'understanding-ai-beginners-guide',
//   publishDate: '2025-04-10',
//   author: {
//     name: 'Sarah Johnson',
//     bio: 'AI researcher and tech enthusiast with 10 years of experience in machine learning and artificial Intelligence.',
//     avatarUrl: '/robot.png', // Placeholder avatar image
//   },
//   excerpt: 'Artificial Intelligence has become an integral part of our daily lives, from virtual assistants to recommendation systems. This guide aims to demystify AI and help you understand its fundamental concepts.',
//   content: [
//     {
//       heading: 'What is Artificial Intelligence?',
//       content: 'AI refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation.',
//       highLight: 'AI systems can be either narrow (designed for specific tasks) or general (capable of performing any intellectual task).' // Kept highlight based on previous turn
//     },
//     {
//       heading: 'Key Components of AI Systems',
//       content: 'Modern AI systems rely on several key components: data collection, machine learning algorithms, processing power, and feedback mechanisms. Each component plays a crucial role in creating intelligent behavior.',
//       highLight: '',
//       subsections: [
//         { heading: 'Data Collection and Processing', content: 'Details about data collection...' }, // Restored content
//         { heading: 'Algorithm Development', content: 'Details about algorithm development...' }, // Restored content
//         { heading: 'Training and Testing', content: 'Details about training and testing...' }, // Restored content
//         { heading: 'Deployment and Monitoring', content: 'Details about deployment and monitoring...' } // Restored content
//       ],
//     },
//     {
//       heading: 'Conclusion',
//       content: 'As AI continues to evolve, understanding its basic principles becomes increasingly important for everyone, from developers to end users.',
//       highLight: ''
//     },
//   ],
//   relatedArticles: [
//     { id: 'future-of-ai', title: 'The Future of AI: Trends and Predictions', slug: 'future-of-ai' },
//     { id: 'ethics-in-ai', title: 'Ethics in Artificial Intelligence', slug: 'ethics-in-artificial-intelligence' },
//     // Add more related articles as needed
//   ],
// };


// // The main component that will render the blog post detail
// // It accepts an optional 'blogPost' prop. If not provided, it uses placeholder data.
// export default function BlogPostDetail({ blogPost }: { blogPost?: BlogPost }) {

//   // Use the provided blogPost data if available, otherwise use placeholder data
//   const articleData = blogPost || placeholderBlogPost;

//   // Function to format the publish date
//   const formatDate = (dateString: string) => {
//     try {
//       const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//       return new Date(dateString).toLocaleDateString(undefined, options);
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString; // Return original string if formatting fails
//     }
//   };

//   // Function to handle sharing (placeholder)
//   const handleShare = () => {
//     // Implement actual sharing logic here (e.g., Web Share API)
//     console.log("Share button clicked");
//     if (typeof navigator !== 'undefined' && navigator.share) {
//       navigator.share({
//         title: articleData.title,
//         text: articleData.excerpt,
//         url: window.location.href,
//       }).catch((error) => console.error('Error sharing:', error));
//     } else {
//       // Fallback for browsers that don't support Web Share API
//       alert(`Share this article: ${window.location.href}`);
//     }
//   };

//   // Function to handle copying link (placeholder)
//   const handleCopyLink = () => {
//     // Implement actual copy logic here
//     console.log("Copy Link button clicked");
//     if (typeof navigator !== 'undefined' && navigator.clipboard && window.location.href) {
//       navigator.clipboard.writeText(window.location.href)
//           .then(() => alert('Link copied to clipboard!'))
//           .catch(err => console.error('Failed to copy link:', err));
//     } else {
//       // Fallback
//       alert(`Copy this link: ${window.location.href}`);
//     }
//   };

  

//   // Helper function to find and wrap a specific term with a Link component
//   const linkifyTerm = (text: string, term: string, href: string) => {
//     const parts = text.split(term);
//     if (parts.length <= 1) {
//       return text; // Term not found
//     }
  
//     return (
//       <>
//         {parts[0]}
//         <Link
//           href={href}
//           title={`Learn more about "${term}"`} // Tooltip text
//           className="text-purple-600 dark:text-purple-400 underline hover:no-underline"
//         >
//           {term}
//         </Link>
//         {/* Recursively process the rest of the string to handle multiple occurrences */}
//         {parts.slice(1).map((part, index) => (
//           <React.Fragment key={index}>
//             {linkifyTerm(part, term, href)}
//           </React.Fragment>
//         ))}
//       </>
//     );
//   };
  


//   return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//         {/* Assuming Header component is used in the layout */}
//         {/* <Header /> */}

//         <main className="container mx-auto px-4 py-12 max-w-5xl">
//           {/* Breadcrumbs */}
//           {/* <nav className="text-sm text-gray-600 dark:text-gray-400 mb-8">
//             <Link href="/" className="hover:underline">Home</Link>
//             <span className="mx-2">/</span> */}
//             {/* Restored breadcrumb link to Blog */}
//             {/* <Link href="/blog" className="hover:underline">Blog</Link>
//             <span className="mx-2">/</span>
//             <span>{articleData.title}</span>
//           </nav> */}
          

//           {/* Article Header */}
//           <header className="mb-12">
//             {/* Blog Date */}
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//               BLOG - {formatDate(articleData.publishDate)}
//             </p>
//             {/* Article Title */}
//             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
//               {articleData.title}
//             </h1>

//             {/* Author and Share */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4">
//               {/* Author Info */}
//               <div className="flex items-center mb-4 sm:mb-0">
//                 {articleData.author.avatarUrl && (
//                     <Image
//                         src={articleData.author.avatarUrl}
//                         alt={articleData.author.name}
//                         width={40}
//                         height={40}
//                         className="rounded-full mr-3"
//                     />
//                 )}
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{articleData.author.name}</p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400">Author</p>
//                 </div>
//               </div>

//               {/* Share Buttons */}
//               <div className="flex items-center space-x-4">
//                 <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
//                   <Share2 className="w-4 h-4 mr-2" /> Share
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
//                   <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
//                 </Button>
//               </div>
//             </div>
//           </header>

//           {/* Article Content and Sidebar */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//             {/* Main Content Column */}
//             <div className="md:col-span-2">
//               {/* Excerpt - Linkify "Artificial Intelligence" */}
//               <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
//                 {linkifyTerm(articleData.excerpt, "Artificial Intelligence", "/terms/68087017dd1bb674cd3dd31b")}
//               </p>

//               {/* Content Sections */}
//               <div className="space-y-8">
//                 {articleData.content.map((section, index) => (
//                     <div key={index}>
//                       {section.heading && (
//                           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                             {section.heading}
//                           </h2>
//                       )}
//                       {/* Use whitespace-pre-line to respect newline characters in content */}
//                       {/* Linkify "Artificial Intelligence" in content */}
//                       <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
//                         {linkifyTerm(section.content, "Artificial Intelligence", "/glossary/artificial-intelligence")}
//                       </p>

//                       {/* Render Highlighted text as blockquote */}
//                       {section.highLight && (
//                           <blockquote className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 px-4 py-3 my-4">
//                             {section.highLight}
//                           </blockquote>
//                       )}

//                       {/* Subsections - Restored rendering with content */}
//                       {section.subsections && section.subsections.length > 0 && (
//                           <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
//                             {section.subsections.map((subsection, subIndex) => (
//                                 <li key={subIndex}>
//                                   <span className="font-medium">{subsection.heading}</span>
//                                   {/* Render subsection content if it exists */}
//                                   {/*{subsection.content && `: ${subsection.content}`}*/}
//                                 </li>
//                             ))}
//                           </ul>
//                       )}
//                     </div>
//                 ))}
//               </div>
//             </div>

//             {/* Sidebar Column */}
//             <div className="md:col-span-1">
//               <div className="sticky top-8 space-y-8"> {/* Added sticky positioning */}
//                 {/* About the Author */}
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Author</h3>
//                   <div className="flex items-center mb-4">
//                     {articleData.author.avatarUrl && (
//                         <Image
//                             src={articleData.author.avatarUrl}
//                             alt={articleData.author.name}
//                             width={50}
//                             height={50}
//                             className="rounded-full mr-4"
//                         />
//                     )}
//                     <div>
//                       <p className="font-semibold text-gray-800 dark:text-gray-200">{articleData.author.name}</p>
//                       {/* Assuming a role or title could go here */}
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
//                     {articleData.author.bio}
//                   </p>
//                 </div>

//                 {/* Related Articles */}
//                 {articleData.relatedArticles && articleData.relatedArticles.length > 0 && (
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
//                       <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Articles</h3>
//                       <ul className="space-y-3">
//                         {articleData.relatedArticles.map(related => (
//                             <li key={related.id}>
//                               <Link href={`/blog/${related.slug}`} className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
//                                 {related.title}
//                               </Link>
//                             </li>
//                         ))}
//                       </ul>
//                     </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </main>

//       </div>
//   );
// }


"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook to get route parameters
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react'; // Assuming Lucide icons are available
import { Card, CardContent } from "@/components/ui/card"; // Assuming Card component is available
import { Button } from "@/components/ui/button"; // Assuming Button component is available
import { ShareButtonWithPopover } from '@/components/ShareButtonWithPopover';


// Define the type for a single article based on the provided API response structure
interface Article {
    _id: string; // Unique identifier
    title: string;
    body: string; // The full HTML body
    url?: string; // Optional URL field (e.g., original source)
    images?: string[]; // Optional array of image URLs
    related_glossary_terms?: string[]; // Optional array of related terms (strings)
    related_glossary_term_details?: any[]; // Optional array of related term details (structure unknown, using any for now)
    // Add other fields if they exist in the API response, e.g., author, date
    author?: string; // Assuming author might be a string
    publishedDate?: string; // Assuming a published date field
}

const BlogDetailPage: React.FC = () => {
    // Get the articleId from the URL parameters
    const params = useParams();
    const articleId = params.articleId as string; // Assuming the parameter name is articleId

    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API endpoint structure
    const API_BASE_URL = "https://taaft-backend.onrender.com/api/blog/articles";

    useEffect(() => {
        if (!articleId) {
            setError("Article ID is missing.");
            setIsLoading(false);
            return;
        }

        const fetchArticle = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${articleId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                         throw new Error("Article not found.");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Article = await response.json(); // Assuming the API returns a single Article object
                setArticle(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch article");
                console.error(`Failed to fetch article with ID ${articleId}:`, err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]); // Re-fetch if the articleId changes

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="mb-6">
                <Link href="/article" className="inline-flex items-center text-[#a855f7] dark:text-purple-400 hover:text-[#9333ea] dark:hover:text-purple-300">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Articles
                </Link>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-600 dark:text-red-400 py-8">
                    <p>{error}</p>
                    <p>Could not load the article.</p>
                </div>
            )}

            {!isLoading && !error && !article && (
                 <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                     <p>Article not found.</p>
                 </div>
            )}

            {/* Article Content and Sidebar Layout */}
            {!isLoading && !error && article && (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Article Content Area */}
                    <div className="lg:w-2/3">
                        {/* Article Header */}
                        <div className="mb-6">
                            {/* Optional: Date and Category/Source if available */}
                             <div className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                                 {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : ''}
                             </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {article.title}
                            </h1>
                            {/* Optional: Author */}
                             {article.author && (
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                                     {/* Placeholder for author image/avatar if available */}
                                     {/* <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div> */}
                                    <span>By {article.author}</span>
                                </div>
                             )}
                             {/* Share/Copy Link Buttons - Placed near header as in UI image */}
                             <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-6">
                                 {/* Assuming ShareButtonWithPopover handles the UI for sharing */}
                                 {/*<ShareButtonWithPopover itemLink={window.location.href} /> /!* Share the current page URL *!/*/}
                                  {/* You might need a separate "Copy Link" button if ShareButtonWithPopover doesn't include it */}
                                  {/* Example Copy Link Button (requires implementation) */}
                                  {/* <button className="flex items-center hover:text-gray-900 dark:hover:text-white">
                                      <Copy className="h-4 w-4 mr-1"/> Copy Link
                                  </button> */}
                             </div>
                             {/* Optional: Main Article Image */}
                             {article.images && article.images.length > 0 && (
                                  <img
                                      src={article.images[0]} // Use the first image URL
                                      alt={article.title}
                                      className="w-full h-auto object-cover rounded-lg mb-6"
                                  />
                             )}
                        </div>

                        {/* Article Body - Render HTML */}
                        {/* Use dangerouslySetInnerHTML to render HTML from the API. Be cautious with untrusted sources. */}
                        <div
                            className="prose dark:prose-invert max-w-none" // Use prose classes for basic typography styling
                            dangerouslySetInnerHTML={{ __html: article.body }}
                        />

                        {/* Optional: Original Source Link */}
                        {article.url && (
                            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                                Read the original article here:{" "}
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-[#a855f7] dark:text-purple-400 hover:underline">
                                    {article.url}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:w-1/3 flex flex-col gap-6">
                        {/* About the Author Card */}
                        {/* This section is based on the UI image, assuming author details might exist or be added */}
                        {   article.author&&       <Card className="rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">About the Author</h3>
                                {/* Placeholder for author image/avatar */}
                                {/* <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-3"></div> */}
                                <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                                    {/* Display author name if available, otherwise a default */}
                                    {article.author || "Author details not available."}
                                </p>
                                {/* Optional: Add more author bio/details here if available */}
                                {/* <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                     [Author Bio Snippet]
                                </p> */}
                            </CardContent>
                        </Card>}

                        {/* Related Articles Card */}
                        {/* This section is based on the UI image. The API has related_glossary_terms/details */}
                        {/* You would likely fetch actual related articles based on categories, tags, etc. */}
                        {/*{article.related_glossary_terms &&   <Card className="rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">*/}
                        {/*     <CardContent className="p-4">*/}
                        {/*        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Related Content</h3>*/}
                        {/*         /!* Display related glossary terms if available *!/*/}
                        {/*         {article.related_glossary_terms && article.related_glossary_terms.length > 0 ? (*/}
                        {/*             <div className="flex flex-col gap-2">*/}
                        {/*                 {article.related_glossary_terms.map((term, index) => (*/}
                        {/*                     // Link to a glossary page or filter articles by this term*/}
                        {/*                     <Link href={`/glossary?term=${encodeURIComponent(term)}`} key={index} className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#a855f7] dark:hover:text-purple-400 transition-colors">*/}
                        {/*                         {term}*/}
                        {/*                     </Link>*/}
                        {/*                 ))}*/}
                        {/*             </div>*/}
                        {/*         ) : (*/}
                        {/*             <p className="text-sm text-gray-600 dark:text-gray-400">No related content found.</p>*/}
                        {/*         )}*/}
                        {/*         /!* You would add logic here to fetch and display actual related *articles* *!/*/}
                        {/*         /!* Example Placeholder for Related Articles List *!/*/}
                        {/*         /!* <div className="flex flex-col gap-2 mt-4">*/}
                        {/*              <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#a855f7] dark:hover:text-purple-400 transition-colors">*/}
                        {/*                  Another Related Article Title*/}
                        {/*              </Link>*/}
                        {/*               <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#a855f7] dark:hover:text-purple-400 transition-colors">*/}
                        {/*                  Yet Another Article*/}
                        {/*              </Link>*/}
                        {/*         </div> *!/*/}
                        {/*     </CardContent>*/}
                        {/*</Card>}*/}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetailPage;
