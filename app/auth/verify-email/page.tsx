// app/verify-email/page.tsx
"use client"
import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { verifyEmail } from "@/services/auth-service"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading")

  useEffect(() => {
    const verify = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const token = searchParams.get("token")
  
      if (!token) {
        setStatus("failed")
        return
      }
  
      try {
        const res = await verifyEmail(token)
        if (!res.ok) throw new Error()
        setStatus("success")
      } catch {
        setStatus("failed")
      }
    }
  
    verify()
  }, [])
  

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-600">Verifying...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
        {status === "success" ? (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Email Verified</h2>
            <p className="mt-2 text-sm text-gray-600">Your email address has been successfully verified.</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Verification Failed</h2>
            <p className="mt-2 text-sm text-gray-600">There was a problem verifying your email. Please try again.</p>
            <button
              onClick={() => location.reload()}
              className="mt-6 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
