// components/SuccessfulSignUpModal.tsx
import { CheckCircle } from "lucide-react"

export default function SuccessfulSignUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Sign up successful</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please check your email to verify your account before signing in.
        </p>
        <button
          onClick={onClose}
          className="mt-6 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}
