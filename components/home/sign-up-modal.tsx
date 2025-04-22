"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative p-8 animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
          <p className="text-gray-500">Sign up to get started with AI Tool Gateway</p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 mb-6 hover:bg-gray-50 transition-colors">
          <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-lg font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
            />
          </div>

          <Button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-lg text-lg">
            Create Account
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-700">
              Already have an account?{" "}
              <button onClick={onSwitchToSignIn} className="text-[#a855f7] hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
