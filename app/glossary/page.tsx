"use client"

import Link from "next/link"
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Glossary() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">AI Tools Glossary</h1>
          <p className="text-sm md:text-base text-[#6b7280] max-w-2xl mx-auto">
            Explore our comprehensive glossary of AI and machine learning terms to better understand the tools in our
            directory.
          </p>
          <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2">Sign in Demo</Button>
        </div>

        {/* Mobile Alphabetical Navigation */}
        <div className="md:hidden mb-8">
          <AlphabeticalNavigationMobile />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Sidebar - Alphabetical Navigation */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-8">
              <h2 className="font-semibold text-[#111827] mb-4">Contents</h2>
              <div className="space-y-1">
                {[
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                  "M",
                  "N",
                  "O",
                  "P",
                  "Q",
                  "R",
                  "S",
                  "T",
                  "U",
                  "V",
                  "W",
                  "X",
                  "Y",
                  "Z",
                ].map((letter) => (
                  <Link
                    key={letter}
                    href={`#${letter}`}
                    className={`block px-3 py-2 rounded-md ${
                      letter === "A" ||
                      letter === "B" ||
                      letter === "C" ||
                      letter === "D" ||
                      letter === "M" ||
                      letter === "N"
                        ? "bg-[#a855f7] text-white"
                        : "text-[#6b7280] hover:bg-gray-100"
                    }`}
                  >
                    {letter}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Section A */}
            <div id="A" className="mb-10">
              <h2 className="text-2xl font-bold text-[#a855f7] mb-4">A</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">AI</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    Artificial Intelligence is intelligence demonstrated by machines, as opposed to natural intelligence
                    displayed by animals and humans.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>

                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">API</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    Application Programming Interface is a set of definitions and protocols for building and integrating
                    application software.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Section B */}
            <div id="B" className="mb-10">
              <h2 className="text-2xl font-bold text-[#a855f7] mb-4">B</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">Big Data</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    Big data refers to extremely large datasets that may be analyzed computationally to reveal patterns,
                    trends, and associations.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Section C */}
            <div id="C" className="mb-10">
              <h2 className="text-2xl font-bold text-[#a855f7] mb-4">C</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">Chatbot</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    A computer program designed to simulate conversation with human users, especially over the Internet.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>

                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">Cloud Computing</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    The practice of using a network of remote servers hosted on the Internet to store, manage, and
                    process data.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Section D */}
            <div id="D" className="mb-10">
              <h2 className="text-2xl font-bold text-[#a855f7] mb-4">D</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">Data Science</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    An interdisciplinary field that uses scientific methods, processes, algorithms and systems to
                    extract knowledge from structured and unstructured data.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Section M */}
            <div id="M" className="mb-10">
              <h2 className="text-2xl font-bold text-[#a855f7] mb-4">M</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">Machine Learning</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    The study of computer algorithms that improve automatically through experience and by the use of
                    data.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Section N */}
            <div id="N" className="mb-10">
              <h2 className="text-2xl font-bold text-[#a855f7] mb-4">N</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">NLP</h3>
                    <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <p className="text-sm text-[#4b5563] mb-2">
                    Natural Language Processing is a subfield of linguistics, computer science, and artificial
                    intelligence concerned with the interactions between computers and human language.
                  </p>
                  <Link href="#" className="text-sm text-[#a855f7]">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Mobile Alphabetical Navigation Component
function AlphabeticalNavigationMobile() {
  const [isOpen, setIsOpen] = useState(false)

  const alphabet = [
    ["A", "B", "C", "D", "E", "F", "G", "H"],
    ["I", "J", "K", "L", "M", "N", "O", "P"],
    ["Q", "R", "S", "T", "U", "V", "W", "X"],
    ["Y", "Z"],
  ]

  const activeLetters = ["A", "B", "C", "D", "M", "N"]

  return (
    <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 bg-gray-50">
        <span className="font-medium text-[#111827]">Contents</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-3">
          {alphabet.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-2 last:mb-0">
              {row.map((letter) => (
                <Link
                  key={letter}
                  href={`#${letter}`}
                  className={`flex-1 h-8 flex items-center justify-center rounded-md text-sm ${
                    activeLetters.includes(letter) ? "bg-[#a855f7] text-white" : "bg-gray-100 text-[#6b7280]"
                  }`}
                >
                  {letter}
                </Link>
              ))}
              {/* Fill empty spaces in the last row to maintain grid alignment */}
              {rowIndex === alphabet.length - 1 &&
                row.length < 8 &&
                Array(8 - row.length)
                  .fill(0)
                  .map((_, i) => <div key={i} className="flex-1"></div>)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
