"use client"

import { httpBatchLink } from "@trpc/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"
import type { AppRouter } from "@/server/routers"

export const trpc = createTRPCReact<AppRouter>()

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return ""
  }

  return process.env.APP_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
