import Link from "next/link"
import { Search, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BrowseTools() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header is already in layout, this page focuses on content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#a855f7] mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#111827] mb-1">Browse AI Tools</h1>
        <p className="text-[#6b7280] mb-8">Discover and compare the best AI tools for your needs</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for tools..."
              className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent"
            />
          </div>
          <div className="w-full md:w-48">
            <button className="w-full flex items-center justify-between px-4 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none">
              <span>All Categories</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <p className="text-[#6b7280] mb-6">Showing 12 tools</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* AI Image Creator Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">AI Image Creator</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] rounded-full">Image Generation</span>
              <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                <span className="mr-0.5">$</span>Premium
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Generate stunning images from text descriptions using advanced AI models.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Marketing</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Design</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Content</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* CodeAssist AI Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-[#111827]">CodeAssist AI</h3>
              <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">Featured</span>
            </div>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] rounded-full">Development</span>
              <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                <span className="mr-0.5">✓</span>Free
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              AI-powered code completion and generator tool that helps developers write better code.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Coding</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Web Dev</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Debugging</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* WriterBot Pro Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">WriterBot Pro</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f0f9ff] text-[#0ea5e9] rounded-full">Writing</span>
              <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                <span className="mr-0.5">$</span>Premium
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Advanced AI writing assistant that helps create high-quality content for blogs, social media.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Blogging</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Marketing</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Social Media</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* VoiceGenius Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">VoiceGenius</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#fff1f2] text-[#e11d48] rounded-full">Audio</span>
              <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                <span className="mr-0.5">✓</span>Free
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Turn text into natural-sounding voice with multiple accents, tones, and emotions.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Video</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Podcast</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Accessibility</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Data Insight Pro Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-[#111827]">Data Insight Pro</h3>
              <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">Featured</span>
            </div>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f0f9ff] text-[#0ea5e9] rounded-full">Data & Analytics</span>
              <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                <span className="mr-0.5">$</span>Premium
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              AI-powered data analysis tool that turns complex data sets into actionable insights.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Business Intelligence</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Data Analysis</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Reporting</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* AI Video Editor Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">AI Video Editor</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] rounded-full">Video</span>
              <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                <span className="mr-0.5">$</span>Premium
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Automated video editing platform that cuts editing time by 90% using AI to create professional videos.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Content Creation</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Marketing</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Social Media</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Neural Translator Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Neural Translator</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f0f9ff] text-[#0ea5e9] rounded-full">Language</span>
              <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                <span className="mr-0.5">✓</span>Free
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Advanced AI translation tool that preserves context and nuance across 100+ languages.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Translation</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Localization</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Communication</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Predictive Analytics Card */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-[#111827]">Predictive Analytics</h3>
              <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">Featured</span>
            </div>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f0f9ff] text-[#0ea5e9] rounded-full">Business</span>
              <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                <span className="mr-0.5">$</span>Premium
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Enterprise-grade tool that forecasts business trends and customer behavior.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Forecasting</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Planning</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Strategy</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Additional cards to make 12 total */}
          {/* AI Image Creator duplicate with slight modifications */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">AI Image Creator</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] rounded-full">Image Generation</span>
              <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                <span className="mr-0.5">$</span>Premium
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Generate stunning images from text descriptions using advanced AI models.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Marketing</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Design</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Content</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* CodeAssist AI duplicate with slight modifications */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-[#111827]">CodeAssist AI</h3>
              <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">Featured</span>
            </div>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] rounded-full">Development</span>
              <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                <span className="mr-0.5">✓</span>Free
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              AI-powered code completion and generator tool that helps developers write better code.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Coding</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Web Dev</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Debugging</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* VoiceGenius duplicate with slight modifications */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">VoiceGenius</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#fff1f2] text-[#e11d48] rounded-full">Audio</span>
              <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                <span className="mr-0.5">✓</span>Free
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Turn text into natural-sounding voice with multiple accents, tones, and emotions.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Video</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Podcast</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Accessibility</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Neural Translator duplicate with slight modifications */}
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Neural Translator</h3>

            <div className="flex gap-2 mb-2">
              <span className="text-xs px-3 py-1 bg-[#f0f9ff] text-[#0ea5e9] rounded-full">Language</span>
              <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                <span className="mr-0.5">✓</span>Free
              </span>
            </div>

            <p className="text-sm text-[#4b5563] mb-4">
              Advanced AI translation tool that preserves context and nuance across 100+ languages.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Translation</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Localization</span>
              <span className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">Communication</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-1.5 border border-[#e5e7eb] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
