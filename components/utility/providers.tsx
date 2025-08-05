"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ConvexClientProvider } from "@/components/utility/convex-provider"
import { AuthProvider } from "@/components/utility/auth-provider"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { FC } from "react"

export const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <ConvexClientProvider>
      <AuthProvider>
        <NextThemesProvider {...props}>
          <TooltipProvider>{children}</TooltipProvider>
        </NextThemesProvider>
      </AuthProvider>
    </ConvexClientProvider>
  )
}
