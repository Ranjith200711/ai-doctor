import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "AI Doctor Chatbot",
  description: "An AI-powered doctor chatbot for medical advice and prescription analysis",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b h-14 flex items-center px-4 md:px-6">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xl font-bold">AI Doctor</span>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}