"use client"

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"
import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <ConvexAuthNextjsProvider>{children}</ConvexAuthNextjsProvider>
}
