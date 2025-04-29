// BlogPostDetail.tsx
"use client";

import React from 'react';
import Link from 'next/link'; // Assuming Next.js Link
import Image from 'next/image'; // Assuming Next.js Image component
import { Share2, Link as LinkIcon } from 'lucide-react'; // Icons for Share and Copy Link
import { Button } from "@/components/ui/button"; // Assuming Button component

// Define interfaces for the blog post data structure
interface Author {
  name: string;
  bio: string;
  avatarUrl?: string; // Optional avatar image URL
}

interface ArticleSection {
  heading?: string; // Optional heading for a section
  content: string; // Main content of the section
  subsections?: { heading: string; content: string }[]; // Optional nested subsections
}

interface RelatedArticle {
  id: string; // Unique ID for the related article
  title: string;
  slug: string; // URL-friendly slug
  // Add other relevant fields like author, date, etc. if needed for display
}

interface BlogPost {
  id: string; // Unique ID for the blog post
  title: string;
  slug: string; // URL-friendly slug for the article page
  publishDate: string; // Date of publication
  author: Author;
  excerpt: string; // Short summary/introduction
  content: ArticleSection[]; // Array of content sections
  relatedArticles?: RelatedArticle[]; // Optional array of related articles
  // Add other fields like cover image URL if applicable
}

// Placeholder data matching the BlogPost interface
const placeholderBlogPost: BlogPost = {
  id: 'understanding-ai-beginners-guide',
  title: 'Understanding AI: A Beginner\'s Guide',
  slug: 'understanding-ai-beginners-guide',
  publishDate: '2025-04-10',
  author: {
    name: 'Sarah Johnson',
    bio: 'AI researcher and tech enthusiast with 10 years of experience in machine learning and artificial Intelligence.',
    avatarUrl: '/placeholder-avatar.png', // Placeholder avatar image
  },
  excerpt: 'Artificial Intelligence has become an integral part of our daily lives, from virtual assistants to recommendation systems. This guide aims to demystify AI and help you understand its fundamental concepts.',
  content: [
    {
      heading: 'What is Artificial Intelligence?',
      content: 'AI refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation.\n\nAI systems can be either narrow (designed for specific tasks) or general (capable of performing any intellectual task).',
    },
    {
      heading: 'Key Components of AI Systems',
      content: 'Modern AI systems rely on several key components: data collection, machine learning algorithms, processing power, and feedback mechanisms. Each component plays a crucial role in creating intelligent behavior.',
      subsections: [
        { heading: 'Data Collection and Processing', content: 'Details about data collection...' },
        { heading: 'Algorithm Development', content: 'Details about algorithm development...' },
        { heading: 'Training and Testing', content: 'Details about training and testing...' },
        { heading: 'Deployment and Monitoring', content: 'Details about deployment and monitoring...' },
      ],
    },
    {
      heading: 'Conclusion',
      content: 'As AI continues to evolve, understanding its basic principles becomes increasingly important for everyone, from developers to end users.',
    },
  ],
  relatedArticles: [
    { id: 'future-of-ai', title: 'The Future of AI: Trends and Predictions', slug: 'future-of-ai' },
    { id: 'ethics-in-ai', title: 'Ethics in Artificial Intelligence', slug: 'ethics-in-artificial-intelligence' },
    // Add more related articles as needed
  ],
};


// The main component that will render the blog post detail
// It accepts an optional 'blogPost' prop. If not provided, it uses placeholder data.
export default function BlogPostDetail({ blogPost }: { blogPost?: BlogPost }) {

  // Use the provided blogPost data if available, otherwise use placeholder data
  const articleData = blogPost || placeholderBlogPost;

  // Function to format the publish date
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };

  // Function to handle sharing (placeholder)
  const handleShare = () => {
    // Implement actual sharing logic here (e.g., Web Share API)
    console.log("Share button clicked");
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: articleData.title,
        text: articleData.excerpt,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(`Share this article: ${window.location.href}`);
    }
  };

  // Function to handle copying link (placeholder)
  const handleCopyLink = () => {
    // Implement actual copy logic here
    console.log("Copy Link button clicked");
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.location.href) {
      navigator.clipboard.writeText(window.location.href)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Failed to copy link:', err));
    } else {
      // Fallback
      alert(`Copy this link: ${window.location.href}`);
    }
  };


  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Assuming Header component is used in the layout */}
        {/* <Header /> */}

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:underline">Blog</Link> {/* Assuming a blog listing page */}
            <span className="mx-2">/</span>
            <span>{articleData.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            {/* Blog Date */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              BLOG - {formatDate(articleData.publishDate)}
            </p>
            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              {articleData.title}
            </h1>

            {/* Author and Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4">
              {/* Author Info */}
              <div className="flex items-center mb-4 sm:mb-0">
                {articleData.author.avatarUrl && (
                    <Image
                        src={articleData.author.avatarUrl}
                        alt={articleData.author.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                    />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{articleData.author.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Author</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
                </Button>
              </div>
            </div>
          </header>

          {/* Article Content and Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="md:col-span-2">
              {/* Excerpt */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {articleData.excerpt}
              </p>

              {/* Content Sections */}
              <div className="space-y-8">
                {articleData.content.map((section, index) => (
                    <div key={index}>
                      {section.heading && (
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {section.heading}
                          </h2>
                      )}
                      {/* Use whitespace-pre-line to respect newline characters in content */}
                      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>

                      {/* Subsections */}
                      {section.subsections && section.subsections.length > 0 && (
                          <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-6">
                            {section.subsections.map((subsection, subIndex) => (
                                <div key={subIndex}>
                                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                    {subsection.heading}
                                  </h3>
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {subsection.content}
                                  </p>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="md:col-span-1">
              <div className="sticky top-8 space-y-8"> {/* Added sticky positioning */}
                {/* About the Author */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Author</h3>
                  <div className="flex items-center mb-4">
                    {articleData.author.avatarUrl && (
                        <Image
                            src={articleData.author.avatarUrl}
                            alt={articleData.author.name}
                            width={50}
                            height={50}
                            className="rounded-full mr-4"
                        />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{articleData.author.name}</p>
                      {/* Assuming a role or title could go here */}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {articleData.author.bio}
                  </p>
                </div>

                {/* Related Articles */}
                {articleData.relatedArticles && articleData.relatedArticles.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Articles</h3>
                      <ul className="space-y-3">
                        {articleData.relatedArticles.map(related => (
                            <li key={related.id}>
                              <Link href={`/blog/${related.slug}`} className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
                                {related.title}
                              </Link>
                            </li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Assuming Footer component is used in the layout */}
        {/* <Footer /> */}
      </div>
  );
}
