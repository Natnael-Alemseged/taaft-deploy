import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AIAutomation() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div
          className="overflow-hidden rounded-xl p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, #F3E8FF 0%, #E0E7FF 100%)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
                Need AI Automation for Your Business?
              </h2>
              <p className="mb-6 text-gray-600">
                Let us help you streamline your workflow with custom AI solutions. Click below to book a consultation or
                paid strategy call with our experts.
              </p>
              <div>
                <Button className="bg-purple-600 hover:bg-purple-700">Get AI Help Now</Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative h-64 w-64 md:h-80 md:w-80">
                <Image
                  src="/robot.png?height=500&width=320"
                  alt="AI Robot Assistant"
                  width={320}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
