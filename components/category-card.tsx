"use client"
import Link from "next/link"
import { ArrowRight, Banknote } from "lucide-react"
import type { Category } from "@/types/category"
import Image from "next/image"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const linkHref = {
    pathname: "/browse",
    query: { category: category.slug },
  }

  return (
    <Link href={linkHref} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow h-full relative">
        <div className="flex flex-col items-center text-center space-y-2">
          {/* Circular icon background */}
          <div className="w-16 h-16 bg-[#f5f0ff] dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={`${category.name} Category Icon`}
                width={64}
                height={64}
                objectFit="cover"
              />
            ) : (
              <Banknote className="text-purple-600 w-6 h-6" />
            )}
          </div>

          {/* Category name */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{category.name}</h3>

          {/* Tool count */}
          <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} tools</p>
        </div>

        {/* Arrow icon bottom right */}
        <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-purple-600" />
      </div>
    </Link>
  )
}
