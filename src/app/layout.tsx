import type { Metadata } from "next"
import { TRPCProvider } from "@/trpc/provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple application to organize your tasks.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
