import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Categories() {
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

        <h1 className="text-3xl font-bold text-[#111827] mb-1">All Categories</h1>
        <p className="text-[#6b7280] mb-8">
          Browse our comprehensive collection of AI tool categories to find exactly what you need.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Code & Development */}
          <Link href="/categories/code-development" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 18L22 12L16 6M8 6L2 12L8 18"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Code & Development</h3>
                <p className="text-sm text-[#6b7280] mt-1">124 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Image Generation */}
          <Link href="/categories/image-generation" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#9333ea" />
                    <path
                      d="M21 15L16 10L5 21"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Image Generation</h3>
                <p className="text-sm text-[#6b7280] mt-1">87 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Chatbots & Assistants */}
          <Link href="/categories/chatbots-assistants" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 15C21 16.6569 19.6569 18 18 18H7.5L3 21V7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V15Z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Chatbots & Assistants</h3>
                <p className="text-sm text-[#6b7280] mt-1">95 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Text & Writing */}
          <Link href="/categories/text-writing" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 7H17M7 12H17M7 17H13"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Text & Writing</h3>
                <p className="text-sm text-[#6b7280] mt-1">136 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Video Creation */}
          <Link href="/categories/video-creation" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="2"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 7L18 10L22 13V7Z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Video Creation</h3>
                <p className="text-sm text-[#6b7280] mt-1">62 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Audio & Music */}
          <Link href="/categories/audio-music" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 18V5L21 3V16M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C7.65685 15 9 16.3431 9 18ZM21 16C21 17.6569 19.6569 19 18 19C16.3431 19 15 17.6569 15 16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16Z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Audio & Music</h3>
                <p className="text-sm text-[#6b7280] mt-1">48 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Data & Analytics */}
          <Link href="/categories/data-analytics" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 19H3M21 5H3M12 3V21M5 7V17M19 7V17"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Data & Analytics</h3>
                <p className="text-sm text-[#6b7280] mt-1">73 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Business & Marketing */}
          <Link href="/categories/business-marketing" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 21H3M21 7L13 15L9 11L3 17M21 7H17M21 7V11"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Business & Marketing</h3>
                <p className="text-sm text-[#6b7280] mt-1">91 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* AI Research */}
          <Link href="/categories/ai-research" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H18M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5 22 16.5 17.5228 16.5 12C16.5 6.47715 14.5 2 12 2M12 22C9.5 22 7.5 17.5228 7.5 12C7.5 6.47715 9.5 2 12 2M2 12C2 6.47715 6.47715 2 12 2M2 12H6"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">AI Research</h3>
                <p className="text-sm text-[#6b7280] mt-1">42 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Natural Language */}
          <Link href="/categories/natural-language" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 9v4M12 17h.01"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Natural Language</h3>
                <p className="text-sm text-[#6b7280] mt-1">65 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* UI/UX Design */}
          <Link href="/categories/ui-ux-design" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">UI/UX Design</h3>
                <p className="text-sm text-[#6b7280] mt-1">38 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Predictive Analytics */}
          <Link href="/categories/predictive-analytics" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 12H18L15 21L9 3L6 12H2"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Predictive Analytics</h3>
                <p className="text-sm text-[#6b7280] mt-1">57 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Robotics */}
          <Link href="/categories/robotics" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11V3M12 3H8M12 3H16"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Robotics</h3>
                <p className="text-sm text-[#6b7280] mt-1">29 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Translation */}
          <Link href="/categories/translation" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.9 7.00001C13.2094 7.00001 13.5 6.70943 13.5 6.40001C13.5 6.09059 13.2094 5.80001 12.9 5.80001C12.5906 5.80001 12.3 6.09059 12.3 6.40001C12.3 6.70943 12.5906 7.00001 12.9 7.00001Z"
                      fill="#9333ea"
                      stroke="#9333ea"
                      strokeWidth="0.6"
                    />
                    <path
                      d="M5 8L10 3L15 8M12 21V12M12 12L17 7M12 12L7 7"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Translation</h3>
                <p className="text-sm text-[#6b7280] mt-1">52 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* User Research */}
          <Link href="/categories/user-research" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">User Research</h3>
                <p className="text-sm text-[#6b7280] mt-1">36 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>

          {/* Voice Tech */}
          <Link href="/categories/voice-tech" className="block">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 19V23M8 23H16"
                      stroke="#9333ea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-semibold text-[#111827]">Voice Tech</h3>
                <p className="text-sm text-[#6b7280] mt-1">44 tools</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#a855f7]" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
