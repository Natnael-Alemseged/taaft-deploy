"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SignUpModal } from "@/components/home/sign-up-modal"
import Link from "next/link"
import { SignInModal } from "@/components/home/sign-in-modal"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, User } from "lucide-react"

export default function Header() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

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

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  // Effect to add and remove scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Add listener for login modal event
    const handleShowLoginModal = () => {
      setIsSignInModalOpen(true)
    }

    window.addEventListener("show-login-modal", handleShowLoginModal)

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("show-login-modal", handleShowLoginModal)
    }
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isUserMenuOpen && !target.closest(".user-menu")) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <>
      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={closeAllModals} onSwitchToSignUp={openSignUpModal} />
      {/* Sign Up Modal */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeAllModals} onSwitchToSignIn={openSignInModal} />
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-colors duration-300 ${
          isScrolled ? "bg-white bg-opacity-80 backdrop-blur-sm" : "bg-white"
        } md:px-20`}
      >
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
          {isAuthenticated && user ? (
            <div className="relative user-menu">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-sm text-[#374151]"
              >
                <div className="w-8 h-8 rounded-full bg-[#a855f7] text-white flex items-center justify-center">
                  {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                </div>
                <span className="hidden md:inline">{user.email}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={openSignInModal}
                className="text-sm text-[#374151] bg-transparent border-none cursor-pointer"
              >
                Sign in
              </button>
              <Button
                className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm px-4 py-2 rounded-md"
                onClick={openSignUpModal}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>
      {/* Add padding to the body or main content to prevent it from being hidden by the fixed header */}
      <div className="pt-[56px]"></div>
    </>
  )
}
