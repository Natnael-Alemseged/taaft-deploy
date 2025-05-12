import type React from "react"
 import type { Metadata } from "next"
 import { Inter } from "next/font/google"
 import "./globals.css"
 import Header from "@/components/header"
 import Footer from "@/components/ui/footer"
 import { AuthProvider } from "@/contexts/auth-context"
 import { QueryProvider } from "@/components/query-provider"

 const inter = Inter({ subsets: ["latin"] })

 export const metadata: Metadata = {
   title: "AI Tool Gateway",
   description: "Discover the best AI tools for your needs",
   generator: "v0.dev",
 }

 export default function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode
 }>) {
   return (
     <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}> {/* <- Make sure this line immediately follows the <html> tag with no space/newline */}
         <QueryProvider>
           <AuthProvider>
             <Header />
         <main className="flex-grow">{children}</main> {/* Add flex-grow here */}
             <Footer />
           </AuthProvider>
         </QueryProvider>
       </body></html>
   )
 }