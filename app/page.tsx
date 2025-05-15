"use client"
import FeaturedTools from "@/components/home/featured-tools"
import SponsoredTools from "@/components/home/sponsored-tools"
import BrowseCategories from "@/components/home/browse-categories"
import AIAutomation from "@/components/home/ai-automation"
import Hero from "@/components/home/hero"
import Header from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />

      {/* Hero Section */}
      <Hero />

      <FeaturedTools />
      {/* Sponsored Section */}
      <SponsoredTools />

      {/* Browse by Category */}
      <BrowseCategories />

      {/* CTA Section */}
      <AIAutomation />

      {/* Footer */}
    </div>
  )
}
