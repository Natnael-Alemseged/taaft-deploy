// BrowseCategories.tsx
"use client";

import { useState, useEffect } from "react"; // Keep useState for potential other local state if needed
import Link from "next/link";
import { ChevronRight } from "lucide-react";
// Removed direct getCategories import
import type { Category } from "@/types/category";

// Import the useCategories hook
import { useCategories } from "@/hooks/use-categories";
// Import the reusable CategoryCard component
import CategoryCard from "@/components/category-card";
// You might need a loading spinner component
// import LoadingSpinner from "@/components/loading-spinner";
// You might need an error message component
// import ErrorMessage from "@/components/error-message";


// Removed fallbackCategories as the hook handles initial loading/error

export default function BrowseCategories() {
  // Use the hook to fetch categories
  const { data: categoriesData, isLoading, isError } = useCategories();

  // Limit the number of categories displayed
  const categoriesToDisplay = categoriesData ? categoriesData.slice(0, 8) : [];


  // No need for local 'categories', 'isLoading', 'error' states managed manually


  // Render nothing if there's an error (optional, you could show an error message instead)
  if (isError) {
    // You could return an error message component here
    console.error("Error loading categories:", isError); // Log the error
    return null; // Or return a simple error message div
  }


  return (
      // Keep the section wrapper
      <section className="py-12 bg-gray-50 dark:bg-gray-900"> {/* Added dark mode */}
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2> {/* Added dark mode */}
            {/* Link to the full Categories page */}
            <Link href="/categories" className="flex items-center text-sm text-purple-600 dark:text-purple-400 hover:underline"> {/* Added dark mode */}
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Show loading state */}
          {isLoading ? (
              // Display skeleton loaders while loading
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(categoriesToDisplay.length || 8)].map((_, index) => ( // Render skeletons equal to the display limit or default
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse"> {/* Added dark mode */}
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div> {/* Adjusted skeleton for image */}
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div> {/* Adjusted skeleton for name */}
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div> {/* Adjusted skeleton for count */}
                    </div>
                ))}
              </div>
          ) : (
              // Render the categories grid if data is loaded and no error
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Map over the sliced categories data and render CategoryCard */}
                {categoriesToDisplay.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
                {/* Optional: Handle the case where no categories are found after loading */}
                {categoriesToDisplay.length === 0 && !isLoading && !isError && (
                    <div className="md:col-span-4 text-center text-gray-600 dark:text-gray-400">No categories found.</div>
                )}
              </div>
          )}
        </div>
      </section>
  );
}