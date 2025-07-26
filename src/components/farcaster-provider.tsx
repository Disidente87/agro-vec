"use client"

import { useEffect } from "react"

interface FarcasterProviderProps {
  children: React.ReactNode
}

// Extend Window interface for Farcaster
declare global {
  interface Window {
    farcaster?: {
      ready: () => void
    }
    ready?: () => void
  }
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  useEffect(() => {
    // Call ready when the interface is ready to be displayed
    // This is required for Farcaster to show the preview
    const callReady = () => {
      try {
        // Method 1: Check if farcaster object exists on window
        if (typeof window !== "undefined" && window.farcaster) {
          window.farcaster.ready()
          console.log("Farcaster ready called via window.farcaster")
          return
        }

        // Method 2: Check if ready function exists directly on window
        if (typeof window !== "undefined" && window.ready) {
          window.ready()
          console.log("Farcaster ready called via window.ready")
          return
        }

        // Method 3: Dispatch a custom event that Farcaster might listen for
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("farcaster-ready"))
          console.log("Farcaster ready event dispatched")
        }
      } catch (error) {
        console.error("Error calling Farcaster ready:", error)
      }
    }

    // Call ready immediately
    callReady()

    // Also call ready after a short delay to ensure everything is loaded
    const timeoutId = setTimeout(callReady, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  return <>{children}</>
} 