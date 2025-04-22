// Glossary.tsx (Add or modify parts of this file)
"use client"

import type React from "react"

import Link from "next/link"
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Header from "@/components/header"

// Define which letters actually have content
const lettersWithContent = ["A", "B", "C", "D", "M", "N"] // Keep this list accurate

// Helper function to convert a term title into a URL-friendly slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

export default function Glossary() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(lettersWithContent[0] || null)

  const allLetters = [
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
  ]

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      let currentLetter: string | null = null
      const viewportCenter = window.innerHeight / 2

      const sections = lettersWithContent
        .map((letter) => document.getElementById(letter))
        .filter((section): section is HTMLElement => section !== null)

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          currentLetter = section.id
          break
        }
      }

      if (currentLetter === null && sections.length > 0) {
        for (const section of sections) {
          const rect = section.getBoundingClientRect()
          if (rect.top > viewportCenter) {
            currentLetter = section.id
            break
          }
        }
      }

      if (currentLetter === null && sections.length > 0) {
        const lastSection = sections[sections.length - 1]
        const rect = lastSection.getBoundingClientRect()
        if (rect.bottom > 0) {
          currentLetter = lastSection.id
        }
      }

      if (currentLetter !== selectedLetter) {
        setSelectedLetter(currentLetter)
        // window.history.replaceState(null, '', `#${currentLetter}`);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      handleScroll()
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [selectedLetter, lettersWithContent])

  // --- Click Handler ---
  const handleLetterClick = (letter: string) => {
    if (lettersWithContent.includes(letter)) {
      if (typeof window !== "undefined") {
        const sectionElement = document.getElementById(letter)
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: "smooth", block: "center" })
          window.history.pushState(null, "", `#${letter}`)
        }
      }
    }
  }

  // --- Initial Hash Handling ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "").toUpperCase()
      if (hash && lettersWithContent.includes(hash)) {
        const sectionElement = document.getElementById(hash)
        if (sectionElement) {
          setTimeout(() => {
            sectionElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 100)
        }
      } else if (selectedLetter === null && lettersWithContent.length > 0) {
        setSelectedLetter(lettersWithContent[0])
      }
    }
  }, [])

  // Function to render a content section (always renders if letter has content)
  const renderSection = (letter: string, content: React.ReactNode) => {
    if (lettersWithContent.includes(letter)) {
      return (
        <div id={letter} className="mb-10">
          <h2 className="text-2xl font-bold text-[#a855f7] mb-4">{letter}</h2>
          {content}
        </div>
      )
    }
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">AI Tools Glossary</h1>
            <p className="text-sm md:text-base text-[#6b7280] max-w-2xl mx-auto">
              Explore our comprehensive glossary of AI and machine learning terms to better understand the tools in our
              directory.
            </p>
            <Link href="/sign-in-demo" passHref>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2">
                Sign in Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Alphabetical Navigation */}
          <div className="md:hidden mb-8">
            <AlphabeticalNavigationMobile
              lettersWithContent={lettersWithContent}
              selectedLetter={selectedLetter}
              onLetterSelect={handleLetterClick}
              allLetters={allLetters}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Desktop Sidebar - Alphabetical Navigation */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-8">
                <h2 className="font-semibold text-[#111827] mb-4">Contents</h2>
                <div className="space-y-1">
                  {allLetters.map((letter) => {
                    const hasContent = lettersWithContent.includes(letter)
                    const isSelected = selectedLetter === letter

                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        disabled={!hasContent}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          hasContent
                            ? isSelected
                              ? "bg-[#a855f7] text-white font-semibold"
                              : "text-[#6b7280] hover:bg-gray-100 font-semibold"
                            : "text-gray-400 cursor-not-allowed font-normal"
                        }`}
                      >
                        {letter}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Render each section */}
              {renderSection(
                "A",
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {/* AI Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("AI")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">AI</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        Artificial Intelligence is intelligence demonstrated by machines, as opposed to natural
                        intelligence displayed by animals and humans.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                  {/* API Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("API")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">API</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        Application Programming Interface is a set of definitions and protocols for building and
                        integrating application software.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                </div>,
              )}

              {renderSection(
                "B",
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {/* Big Data Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("Big Data")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">Big Data</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        Big data refers to extremely large datasets that may be analyzed computationally to reveal
                        patterns, trends, and associations.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                </div>,
              )}

              {renderSection(
                "C",
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {/* Chatbot Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("Chatbot")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">Chatbot</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        A computer program designed to simulate conversation with human users, especially over the
                        Internet.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                  {/* Cloud Computing Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("Cloud Computing")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">Cloud Computing</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        The practice of using a network of remote servers hosted on the Internet to store, manage, and
                        process data.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                </div>,
              )}

              {renderSection(
                "D",
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {/* Data Science Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("Data Science")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">Data Science</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        An interdisciplinary field that uses scientific methods, processes, algorithms and systems to
                        extract knowledge from structured and unstructured data.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                </div>,
              )}

              {/* Sections E through L will not render as they are not in lettersWithContent */}

              {renderSection(
                "M",
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {/* Machine Learning Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("Machine Learning")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">Machine Learning</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        The study of computer algorithms that improve automatically through experience and by the use of
                        data.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                </div>,
              )}

              {renderSection(
                "N",
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  {/* NLP Term Card - MODIFIED LINK */}
                  <div className="border border-[#e5e7eb] rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <Link href={`/terms/${slugify("NLP")}`} className="block">
                      {" "}
                      {/* Link to term page */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#111827]">NLP</h3>
                        <ChevronRight className="w-5 h-5 text-[#a855f7]" />
                      </div>
                      <p className="text-sm text-[#4b5563] mb-2">
                        Natural Language Processing is a subfield of linguistics, computer science, and artificial
                        intelligence concerned with the interactions between computers and human language.
                      </p>
                      <span className="text-sm text-[#a855f7] inline-flex items-center">
                        {" "}
                        {/* Keep Read more link style */}
                        Read more →
                      </span>
                    </Link>
                  </div>
                </div>,
              )}

              {/* Sections O through Z will not render */}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

// ---------------------------------------------------
// Mobile Alphabetical Navigation Component (No changes needed here)
// ---------------------------------------------------

interface AlphabeticalNavigationMobileProps {
  lettersWithContent: string[]
  selectedLetter: string | null
  onLetterSelect: (letter: string) => void
  allLetters: string[]
}

function AlphabeticalNavigationMobile({
  lettersWithContent,
  selectedLetter,
  onLetterSelect,
  allLetters,
}: AlphabeticalNavigationMobileProps) {
  const [isOpen, setIsOpen] = useState(false)

  const alphabetRows = []
  for (let i = 0; i < allLetters.length; i += 8) {
    alphabetRows.push(allLetters.slice(i, i + 8))
  }

  return (
    <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 bg-gray-50">
        <span className="font-medium text-[#111827]">Contents</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-3">
          {alphabetRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-2 last:mb-0">
              {row.map((letter) => {
                const hasContent = lettersWithContent.includes(letter)
                const isSelected = selectedLetter === letter

                return (
                  <button
                    key={letter}
                    onClick={() => onLetterSelect(letter)}
                    disabled={!hasContent}
                    className={`flex-1 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${
                      hasContent
                        ? isSelected
                          ? "bg-[#a855f7] text-white font-semibold"
                          : "bg-gray-100 text-[#6b7280] font-semibold hover:bg-gray-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed font-normal"
                    }`}
                  >
                    {letter}
                  </button>
                )
              })}
              {row.length < 8 &&
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
