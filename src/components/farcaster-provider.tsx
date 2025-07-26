"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

interface FarcasterProviderProps {
  children: React.ReactNode
}

// Extend Window interface for fallback methods
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
    // Initialize Farcaster Mini App with official SDK
    const initFarcasterMiniApp = async () => {
      try {
        // Call ready() to hide the splash screen - this is the main requirement
        await sdk.actions.ready()
        
        console.log("Farcaster Mini App ready() called successfully")
      } catch (error) {
        console.error("Error calling Farcaster Mini App ready():", error)
        
        // Fallback methods if SDK fails
        try {
          // Method 1: Legacy farcaster object
          if (typeof window !== "undefined" && window.farcaster) {
            window.farcaster.ready()
            console.log("Farcaster ready called via window.farcaster (fallback)")
            return
          }

          // Method 2: Global ready function
          if (typeof window !== "undefined" && window.ready) {
            window.ready()
            console.log("Farcaster ready called via window.ready (fallback)")
            return
          }

          // Method 3: Dispatch custom event
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("farcaster-ready"))
            console.log("Farcaster ready event dispatched (fallback)")
          }
        } catch (fallbackError) {
          console.error("Fallback methods also failed:", fallbackError)
        }
      }
    }

    // Initialize immediately
    initFarcasterMiniApp()

    // Also try after a short delay to ensure everything is loaded
    const timeoutId = setTimeout(initFarcasterMiniApp, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  return <>{children}</>
} 