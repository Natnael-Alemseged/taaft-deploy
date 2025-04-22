import Link from "next/link"
import { Users, Target, Lightbulb, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white md:px-20">
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
          <Link href="/signin" className="text-sm text-[#374151]">
            Sign in
          </Link>
          <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm px-4 py-2 rounded-md">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">About AI Tool Gateway</h1>
          <p className="text-lg text-[#6b7280] max-w-3xl mx-auto">
            Your trusted resource for discovering, comparing, and implementing the best AI tools for your specific
            needs.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Our Story</h2>
              <p className="text-[#6b7280] mb-4">
                AI Tool Gateway was founded in 2023 by a team of AI enthusiasts and industry experts who recognized a
                growing challenge: with thousands of AI tools being released every month, how could users find the right
                solutions for their specific needs?
              </p>
              <p className="text-[#6b7280] mb-4">
                We created this platform to bridge the gap between innovative AI technologies and the people who need
                them. Our comprehensive directory helps businesses, creators, developers, and everyday users navigate
                the rapidly evolving AI landscape.
              </p>
              <p className="text-[#6b7280]">
                Today, AI Tool Gateway is the leading resource for AI tool discovery, trusted by thousands of users
                worldwide to make informed decisions about AI implementation.
              </p>
            </div>
            <div className="bg-[#f5f0ff] rounded-lg p-8 flex items-center justify-center">
              <div className="w-full h-64 bg-[#f5f0ff] rounded-lg flex items-center justify-center">
                <img src="/ai-collaboration.png" alt="AI Tool Gateway Team" className="rounded-lg max-h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Our Mission</h2>
            <p className="text-[#6b7280] max-w-3xl mx-auto">
              We're on a mission to make artificial intelligence accessible, understandable, and useful for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="w-12 h-12 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Simplify Discovery</h3>
              <p className="text-[#6b7280]">
                We curate and categorize the best AI tools so you can quickly find solutions that match your specific
                needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="w-12 h-12 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Educate & Inform</h3>
              <p className="text-[#6b7280]">
                We provide clear, jargon-free information about AI technologies to help you make informed decisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="w-12 h-12 bg-[#f5f0ff] rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Connect Communities</h3>
              <p className="text-[#6b7280]">
                We bring together AI developers, businesses, and users to foster innovation and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#111827] mb-8 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-[#f5f0ff] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#a855f7] font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Browse Categories</h3>
              <p className="text-[#6b7280] mb-4">
                Explore our comprehensive categories of AI tools organized by functionality and use case.
              </p>

              {/* Desktop connector line */}
              <div className="hidden lg:block absolute top-6 left-12 w-full h-0.5 bg-[#e5e7eb]"></div>
            </div>

            <div className="relative">
              <div className="bg-[#f5f0ff] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#a855f7] font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Compare Tools</h3>
              <p className="text-[#6b7280] mb-4">
                Read detailed descriptions, reviews, and pricing information to compare different options.
              </p>

              {/* Desktop connector line */}
              <div className="hidden lg:block absolute top-6 left-12 w-full h-0.5 bg-[#e5e7eb]"></div>
            </div>

            <div className="relative">
              <div className="bg-[#f5f0ff] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#a855f7] font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Try Tools</h3>
              <p className="text-[#6b7280] mb-4">
                Access tools directly through our platform with special trial offers and discounts.
              </p>

              {/* Desktop connector line */}
              <div className="hidden lg:block absolute top-6 left-12 w-full h-0.5 bg-[#e5e7eb]"></div>
            </div>

            <div>
              <div className="bg-[#f5f0ff] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#a855f7] font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Implement Solutions</h3>
              <p className="text-[#6b7280] mb-4">
                Get support and resources to successfully implement AI tools in your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#111827] mb-8 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="flex items-start">
                <div className="mr-4">
                  <CheckCircle className="w-6 h-6 text-[#a855f7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">Transparency</h3>
                  <p className="text-[#6b7280]">
                    We provide honest, unbiased information about all tools, including limitations and potential
                    drawbacks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="flex items-start">
                <div className="mr-4">
                  <CheckCircle className="w-6 h-6 text-[#a855f7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">Accessibility</h3>
                  <p className="text-[#6b7280]">
                    We believe AI should be accessible to everyone, regardless of technical background or expertise.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="flex items-start">
                <div className="mr-4">
                  <CheckCircle className="w-6 h-6 text-[#a855f7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">Quality</h3>
                  <p className="text-[#6b7280]">
                    We thoroughly vet all tools before adding them to our directory to ensure they meet our standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <div className="flex items-start">
                <div className="mr-4">
                  <CheckCircle className="w-6 h-6 text-[#a855f7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">Innovation</h3>
                  <p className="text-[#6b7280]">
                    We continuously update our platform to showcase the latest advancements in AI technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#111827] mb-8 text-center">Meet Our Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "professional woman with glasses in business attire",
              },
              {
                name: "Michael Chen",
                role: "CTO",
                image: "asian man in casual business attire smiling",
              },
              {
                name: "Aisha Patel",
                role: "Head of Content",
                image: "indian woman professional with long dark hair",
              },
              {
                name: "David Rodriguez",
                role: "AI Research Lead",
                image: "latino man with beard in tech casual attire",
              },
            ].map((member, index) => (
              <div key={index} className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                <div className="h-48 bg-[#f5f0ff]">
                  <img
                    src={`/abstract-geometric-shapes.png?height=192&width=300&query=${member.image}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#111827]">{member.name}</h3>
                  <p className="text-sm text-[#6b7280]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-[#f5f0ff]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">Get in Touch</h2>
          <p className="text-[#6b7280] mb-8">
            Have questions about AI Tool Gateway? Want to submit a tool or collaborate with us? We'd love to hear from
            you!
          </p>
          <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2 rounded-md flex items-center mx-auto">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#111827] mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: "How do you select tools for the directory?",
                answer:
                  "We have a rigorous vetting process that evaluates tools based on functionality, reliability, user experience, and value. Our team of AI experts tests each tool before adding it to our directory.",
              },
              {
                question: "Is AI Tool Gateway free to use?",
                answer:
                  "Yes, browsing and accessing basic information about AI tools is completely free. We offer premium features for users who want more detailed insights and personalized recommendations.",
              },
              {
                question: "How can I submit my AI tool to the directory?",
                answer:
                  "You can submit your tool through our 'Submit Tool' page. Our team will review your submission and contact you with next steps.",
              },
              {
                question: "Do you offer consulting services for AI implementation?",
                answer:
                  "Yes, we have a network of AI consultants who can help businesses implement the right AI solutions for their specific needs. Contact us for more information.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{faq.question}</h3>
                <p className="text-[#6b7280]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">Ready to Discover the Perfect AI Tools?</h2>
          <p className="text-[#6b7280] mb-8">
            Start exploring our comprehensive directory of AI tools and find the solutions that will transform your
            workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2 rounded-md">Browse Tools</Button>
            </Link>
            <Link href="/categories">
              <Button className="bg-white border border-[#e5e7eb] text-[#111827] hover:bg-gray-50 px-6 py-2 rounded-md">
                View Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
