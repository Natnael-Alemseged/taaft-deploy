"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Code,
  ImageIcon,
  MessageSquare,
  FileText,
  Video,
  Music,
  BarChart2,
  TrendingUp,
  BotIcon as Robot,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInModal } from "@/components/home/sign-in-modal"
import { SignUpModal } from "@/components/home/sign-up-modal"
import { ConversationalSearch } from "@/components/home/conversational-search"
import Footer from "@/components/ui/footer"
import FeaturedTools from "@/components/home/featured-tools";
import SponsoredTools from "@/components/home/sponsored-tools";
import BrowseCategories from "@/components/home/browse-categories";
import AIAutomation from "@/components/home/ai-automation";
import Hero from "@/components/home/hero";

export default function Home() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const openSignInModal = () => {
    setIsSignUpModalOpen(false)
    setIsSignInModalOpen(true)
  }

  const openSignUpModal = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(true)
  }

  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real application, you would use this query to fetch and display search results
    console.log("Searching for:", query)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={closeAllModals} onSwitchToSignUp={openSignUpModal} />

      {/* Sign Up Modal */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeAllModals} onSwitchToSignIn={openSignInModal} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white md:px-20">
        <Link href="/" className="flex items-center text-lg font-semibold text-[#a855f7]">
          AI Tool Gateway
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/browse" className="text-sm text-[#374151]">
            Browse Tools
          </Link>
          <Link href="/categories" className="text-sm text-[#374151]">
            Categories
          </Link>
          <Link href="/about" className="text-sm text-[#374151]">
            About
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openSignInModal}
            className="text-sm text-[#374151] bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
          <Button
            className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm px-4 py-2 rounded-md"
            onClick={openSignInModal}
          >
            Get Started
          </Button>
        </div>
      </header>


      {/* Hero Section */}
      <Hero/>
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
      <FeaturedTools  />
      {/* Sponsored Section */}
      <SponsoredTools />

      {/* Browse by Category */}
      <BrowseCategories/>

      {/* CTA Section */}
      <AIAutomation />

      {/* Footer */}
      <Footer/>

      {/* Footer */}
      {/*<footer className="py-12 bg-white border-t border-[#e5e7eb]">*/}
      {/*  <div className="max-w-6xl mx-auto px-4">*/}
      {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">*/}
      {/*      <div>*/}
      {/*        <h3 className="text-[#111827] font-semibold mb-4">AI Tool Gateway</h3>*/}
      {/*        <p className="text-sm text-[#4b5563] mb-4">*/}
      {/*          The ultimate directory for finding the best AI tools for your specific needs.*/}
      {/*        </p>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <h3 className="text-[#111827] font-semibold mb-4">Quick Links</h3>*/}
      {/*        <ul className="space-y-2">*/}
      {/*          <li>*/}
      {/*            <Link href="/about" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              About Us*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/contact" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Contact*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/blog" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Blog*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*        </ul>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <h3 className="text-[#111827] font-semibold mb-4">Categories</h3>*/}
      {/*        <ul className="space-y-2">*/}
      {/*          <li>*/}
      {/*            <Link href="/writing" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Writing*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/image" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Image Generation*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/development" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Development*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/chatbots" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Chatbots*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*        </ul>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <h3 className="text-[#111827] font-semibold mb-4">Resources</h3>*/}
      {/*        <ul className="space-y-2">*/}
      {/*          <li>*/}
      {/*            <Link href="/glossary" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              AI Tech Glossary*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/linkedin" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              LinkedIn*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/discord" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Discord*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link href="/newsletter" className="text-sm text-[#4b5563] hover:text-[#111827]">*/}
      {/*              Newsletter*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*        </ul>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className="mt-12 pt-8 border-t border-[#e5e7eb] text-center text-sm text-[#6b7280]">*/}
      {/*      © 2023 AI Tool Gateway. All rights reserved.*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </div>

  )
}
