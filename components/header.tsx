"use client"

import { useState, useEffect, useRef } from "react" // Import useRef
import { Button } from "@/components/ui/button" // Assuming Button component is available
import { SignUpModal } from "@/components/home/sign-up-modal" // Assuming modal components are available
import Link from "next/link" // Assuming Next.js Link is used
import { SignInModal } from "@/components/home/sign-in-modal" // Assuming modal components are available
import { useAuth } from "@/contexts/auth-context" // Assuming useAuth hook is available
import { LogOut, User, Menu, X } from "lucide-react" // Import Menu and X icons
import { usePathname } from "next/navigation" // Import usePathname for active link detection

export default function Header() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State for mobile menu
  const [previousRoute, setPreviousRoute] = useState<string | undefined>()
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname() // Get current pathname
  const onCloseCallbackRef = useRef<(() => void) | null>(null)
  const currentModalIdRef = useRef<string | null>(null)

  const mobileMenuRef = useRef<HTMLDivElement>(null); // Ref for mobile menu for click outside

  const openSignInModal = () => {
    setIsSignUpModalOpen(false)
    setIsSignInModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  const openSignUpModal = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  const closeAllModals = () => {
    setIsSignInModalOpen(false)
    setIsSignUpModalOpen(false)
    setPreviousRoute(undefined)
    if (onCloseCallbackRef.current) {
      onCloseCallbackRef.current()
      onCloseCallbackRef.current = null
    }
    currentModalIdRef.current = null
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false); // Close mobile menu on logout
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

    // Effect to handle login modal events
    const handleShowLoginModal = (event: CustomEvent<{ 
      previousRoute?: string; 
      modalId: string;
      onClose?: () => void 
    }>) => {
      // If we already have a modal open with this ID, ignore
      if (currentModalIdRef.current === event.detail.modalId) {
        return
      }

      // If we have a different modal open, close it first
      if (currentModalIdRef.current) {
        closeAllModals()
      }

      // Set the new modal ID and open the modal
      currentModalIdRef.current = event.detail.modalId
      setPreviousRoute(event.detail.previousRoute)
      setIsSignInModalOpen(true)
      
      if (event.detail.onClose) {
        onCloseCallbackRef.current = event.detail.onClose
      }
    }

    window.addEventListener("show-login-modal", handleShowLoginModal as EventListener)

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("show-login-modal", handleShowLoginModal as EventListener)
    }
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutsideUserMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if the click is outside the user menu button and the menu itself
      if (isUserMenuOpen && !target.closest(".user-menu") && !target.closest(".user-menu-button")) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutsideUserMenu)
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserMenu)
    }
  }, [isUserMenuOpen])


  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutsideMobileMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside the mobile menu container and the hamburger button
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target) && !target.closest(".hamburger-button")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMobileMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
    };
  }, [isMobileMenuOpen]);


  return (
      <>
        {/* Sign In Modal */}
        <SignInModal 
          isOpen={isSignInModalOpen} 
          onClose={closeAllModals} 
          onSwitchToSignUp={openSignUpModal}
          previousRoute={previousRoute}
        />
        {/* Sign Up Modal */}
        <SignUpModal isOpen={isSignUpModalOpen} onClose={closeAllModals} onSwitchToSignIn={openSignInModal} />

        {/* Header */}
        <header
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-colors duration-300 ${
                isScrolled ? "bg-white bg-opacity-80 backdrop-blur-sm" : "bg-white"
            } md:px-20`}
        >
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center text-lg font-semibold text-[#a855f7]">
            AI By The Hour
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8"> {/* Hidden on mobile, flex on medium+ */}
            <Link 
              href="/browse" 
              className={`text-sm ${
                pathname === "/browse" 
                  ? "text-[#a855f7] font-medium" 
                  : "text-[#374151] hover:text-[#a855f7]"
              }`}
            >
              Browse Tools
            </Link>
            <Link 
              href="/categories" 
              className={`text-sm ${
                pathname === "/categories" 
                  ? "text-[#a855f7] font-medium" 
                  : "text-[#374151] hover:text-[#a855f7]"
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className={`text-sm ${
                pathname === "/about" 
                  ? "text-[#a855f7] font-medium" 
                  : "text-[#374151] hover:text-[#a855f7]"
              }`}
            >
              About
            </Link>
          </div>

          {/* Right side: Auth buttons / User menu / Hamburger */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Button (Visible on mobile) */}
            <div className="md:hidden flex items-center">
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 hamburger-button" // Added class for click outside
                  aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>


            {/* Desktop Sign In/Sign Up buttons or User Menu */}
            <div className="hidden md:flex items-center space-x-3"> {/* Hidden on mobile, flex on medium+ */}
              {isAuthenticated && user ? (
                  <div className="relative user-menu"> {/* Added class for click outside */}
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 text-sm text-[#374151] user-menu-button" // Added class for click outside
                    >
                      <div className="w-8 h-8 rounded-full bg-[#a855f7] text-white flex items-center justify-center">
                        {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                      </div>
                      <span className="hidden md:inline">{user.full_name}</span>
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"> {/* Increased z-index */}
                          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}> {/* Close menu on click */}
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
          </div>

          {/* Mobile Menu (Hidden on medium+, visible on mobile when open) */}
          {isMobileMenuOpen && (
              <div
                  ref={mobileMenuRef} // Attach ref
                  className="md:hidden fixed top-[56px] left-0 right-0 bg-white shadow-lg py-4 z-40 animate-in slide-in-from-top-10 duration-300" // Position below header, increased z-index
              >
                <div className="flex flex-col space-y-4 px-4">
                  {/* Navigation Links */}
                  <Link 
                    href="/browse" 
                    className={`text-base ${
                      pathname === "/browse" 
                        ? "text-[#a855f7] font-medium" 
                        : "text-[#374151] hover:text-[#a855f7]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Tools
                  </Link>
                  <Link 
                    href="/categories" 
                    className={`text-base ${
                      pathname === "/categories" 
                        ? "text-[#a855f7] font-medium" 
                        : "text-[#374151] hover:text-[#a855f7]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link 
                    href="/about" 
                    className={`text-base ${
                      pathname === "/about" 
                        ? "text-[#a855f7] font-medium" 
                        : "text-[#374151] hover:text-[#a855f7]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  {/* Authentication/User Options in Mobile Menu */}
                  <div className="border-t border-gray-200 pt-4 mt-4"> {/* Separator */}
                    {isAuthenticated && user ? (
                        // Authenticated Mobile Options
                        <div className="flex flex-col space-y-4">
                          <Link href="/profile" className="text-base text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}> {/* Close menu on click */}
                            <User className="inline-block w-5 h-5 mr-2" />
                            Profile
                          </Link>
                          <button
                              onClick={handleLogout}
                              className="block w-full text-left text-base text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
                          >
                            <LogOut className="inline-block w-5 h-5 mr-2" />
                            Sign out
                          </button>
                        </div>
                    ) : (
                        // Not Authenticated Mobile Options
                        <div className="flex flex-col space-y-4">
                          <button
                              onClick={openSignInModal}
                              className="block w-full text-left text-base text-[#374151] hover:bg-gray-100 px-4 py-2 rounded-md"
                          >
                            Sign in
                          </button>
                          <Button
                              className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white text-base px-4 py-2 rounded-md"
                              onClick={openSignUpModal}
                          >
                            Get Started
                          </Button>
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}
        </header>
        {/* Add padding to the body or main content to prevent it from being hidden by the fixed header */}
        {/* Adjusted padding value to match header height */}
        <div className="pt-[56px]"></div>
      </>
  )
}
