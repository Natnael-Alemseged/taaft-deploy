"use client"

import { useCategories } from "@/hooks/use-categories";
import Link from "next/link"

export default function Footer() {
   // Fetch categories using your hook
  // This hook will manage fetching state (isLoading, isError) and data (data)
  const { data: categoriesData, isLoading, isError } = useCategories();

  // We want to display a limited number of categories, like 4
  const categoriesToDisplay = categoriesData ? categoriesData.slice(0, 4) : [];
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4">
      <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-black">AI Tool Gateway</h3>
            <p className="text-sm text-gray-600">
              The ultimate directory for finding the best AI tools for your specific needs.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-black">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-purple-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
              </li>
              <li>
                {/*<Link href="/submit-tool" className="text-sm text-gray-600 hover:text-purple-600">*/}
                {/*  Submit Tool*/}
                {/*</Link>*/}
              </li>
              <li>
                <Link href="/article" className="text-sm text-gray-600 hover:text-purple-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

         {/* Column 3: Categories (Dynamic) */}
         <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-black">Categories</h3>
            <ul className="space-y-2">
              {isLoading && (
                // Display loading state
                <li>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
                </li>
              )}
              {isError && (
                // Display error state
                <li>
                  <span className="text-sm text-red-600 dark:text-red-400">Error loading categories.</span>
                </li>
              )}
              {!isLoading && !isError && categoriesToDisplay.length > 0 && (
                // Map over fetched categories if available and not loading/error
                categoriesToDisplay.map((category) => (
                  // Use a unique key for each list item
                  <li key={category.id || category.slug}>
                    <Link
                      // href={`/categories/${category.slug || category.id}`} // Link to category page (adjust path/slug as needed)
                      href={`categories`}
                      className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
               {!isLoading && !isError && categoriesToDisplay.length === 0 && (
                 // Handle case where no categories are returned
                 <li>
                  <span className="text-sm text-gray-600 dark:text-gray-400">No categories found.</span>
                </li>
              )}
            </ul>
          </div>


          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-black">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/glossary" className="text-sm text-gray-600 hover:text-purple-600">
                  AI Tools Glossary
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Discord
                </Link>
              </li>
           
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">© 2025 AI Tool Gateway. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
