"use client"

import Footer from "@/components/ui/footer"
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
      {/*<section className="py-16 bg-[#f9fafb]">*/}
      {/*  <div className="max-w-4xl mx-auto text-center px-4">*/}
      {/*    <div className="flex items-center justify-center mb-8">*/}
      {/*      <div className="flex items-center text-sm text-[#6b7280] bg-white px-3 py-1.5 rounded-full shadow-sm">*/}
      {/*        <span className="mr-2">✨</span>*/}
      {/*        Find the perfect AI tool for any task*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <h1 className="text-4xl md:text-5xl font-semibold mb-2">*/}
      {/*      <span className="text-[#c084fc]">AI Tools Discovery</span>*/}
      {/*      <br />*/}
      {/*      <span className="text-[#111827] relative">*/}
      {/*        Platform*/}
      {/*        <span className="absolute -right-8 top-0 text-[#c084fc]">🔍</span>*/}
      {/*      </span>*/}
      {/*    </h1>*/}

      {/*    <p className="text-[#6b7280] mt-6 mb-10 max-w-xl mx-auto">*/}
      {/*      Your one-stop directory to find, compare, and use the best AI tools for any task*/}
      {/*    </p>*/}

      {/*    /!* Conversational Search *!/*/}
      {/*    <ConversationalSearch onSearch={handleSearch} />*/}

      {/*  </div>*/}
      {/*</section>*/}

      {/* Featured AI Tools */}
      <FeaturedTools />
      {/* Sponsored Section */}
      <SponsoredTools />

      {/* Browse by Category */}
      <BrowseCategories />

      {/* CTA Section */}
      <AIAutomation />

      {/* Footer */}
      <Footer />
    </div>
  )
}
