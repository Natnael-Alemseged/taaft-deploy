import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/ui/footer"

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0fdf4] mb-6">
            <CheckCircle className="w-8 h-8 text-[#22c55e]" />
          </div>

          <h1 className="text-3xl font-bold text-[#111827] mb-4">Tool Submitted Successfully!</h1>

          <p className="text-[#6b7280] max-w-lg mx-auto mb-8">
            Thank you for submitting your AI tool. Our team will review your submission and publish it to our directory
            soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white">Browse Tools</Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="border-[#e5e7eb]">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
