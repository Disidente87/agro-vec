"use client"

import { usePathname } from "next/navigation"
import { MiniAppNavigation } from "./miniapp-navigation"

export function ConditionalNavigation() {
  const pathname = usePathname()

  // Don't show navigation on home page
  if (pathname === "/") {
    return null
  }

  return <MiniAppNavigation className="top-16" />
} 