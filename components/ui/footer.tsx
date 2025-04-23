import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">AI Tool Gateway</h3>
            <p className="text-sm text-gray-600">
              The ultimate directory for finding the best AI tools for your specific needs.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
              </li>
              <li>
                {/*<Link href="/submit-tool" className="text-sm text-gray-600 hover:text-purple-600">*/}
                {/*  Submit Tool*/}
                {/*</Link>*/}
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Writing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Image Generation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Development
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Chatbots
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/glossary" className="text-sm text-gray-600 hover:text-purple-600">
                  AI Tools Glossary
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">© 2025 AI Tool Gateway. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
