"use client"

import { useEffect } from "react"

interface FarcasterProviderProps {
  children: React.ReactNode
}

interface FarcasterMiniAppConfig {
  appName: string
  appDescription: string
  appIcon: string
  appUrl: string
}

// Extend Window interface for Farcaster Mini App
declare global {
  interface Window {
    farcaster?: {
      ready: () => void
    }
    ready?: () => void
    // Mini App specific
    FarcasterMiniApp?: {
      init: (config: FarcasterMiniAppConfig) => void
      ready: () => void
    }
  }
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  useEffect(() => {
    // Initialize Farcaster Mini App
    const initFarcasterMiniApp = () => {
      try {
        // Method 1: Check if FarcasterMiniApp SDK is available
        if (typeof window !== "undefined" && window.FarcasterMiniApp) {
          const config: FarcasterMiniAppConfig = {
            appName: "Agro-bootcamp",
            appDescription: "Trazabilidad agrícola sobre blockchain Base L2",
            appIcon: "https://agro-gy7aqkudn-disidentes-projects.vercel.app/icon",
            appUrl: "https://agro-gy7aqkudn-disidentes-projects.vercel.app"
          }
          window.FarcasterMiniApp.init(config)
          window.FarcasterMiniApp.ready()
          console.log("Farcaster Mini App initialized and ready")
          return
        }

        // Method 2: Legacy farcaster object (for backward compatibility)
        if (typeof window !== "undefined" && window.farcaster) {
          window.farcaster.ready()
          console.log("Farcaster ready called via window.farcaster")
          return
        }

        // Method 3: Global ready function
        if (typeof window !== "undefined" && window.ready) {
          window.ready()
          console.log("Farcaster ready called via window.ready")
          return
        }

        // Method 4: Dispatch custom event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("farcaster-ready"))
          console.log("Farcaster ready event dispatched")
        }
      } catch (error) {
        console.error("Error initializing Farcaster Mini App:", error)
      }
    }

    // Initialize immediately
    initFarcasterMiniApp()

    // Also initialize after a short delay to ensure everything is loaded
    const timeoutId = setTimeout(initFarcasterMiniApp, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  return <>{children}</>
} 