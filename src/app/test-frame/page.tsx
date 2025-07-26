"use client"

import { useEffect, useState } from "react"

// Extend Window interface for Farcaster
declare global {
  interface Window {
    ready?: () => void
  }
}

export default function TestFramePage() {
  const [readyCalled, setReadyCalled] = useState(false)
  const [farcasterDetected, setFarcasterDetected] = useState(false)

  useEffect(() => {
    // Check if we're in a Farcaster frame
    const isInFrame = window.location.href.includes("farcaster") || 
                     window.location.href.includes("warpcast") ||
                     document.referrer.includes("farcaster") ||
                     document.referrer.includes("warpcast")
    
    setFarcasterDetected(isInFrame)

    // Override the ready function to track when it's called
    if (typeof window !== "undefined") {
      const originalReady = window.ready
      window.ready = function() {
        setReadyCalled(true)
        console.log("Farcaster ready function called from test page")
        if (originalReady) originalReady()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          🌱 Farcaster Frame Test
        </h1>
        
        <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${farcasterDetected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium">
              Farcaster Frame Detected: {farcasterDetected ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${readyCalled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium">
              Ready Function Called: {readyCalled ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-600">
              URL: {typeof window !== "undefined" ? window.location.href : "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Referrer: {typeof document !== "undefined" ? document.referrer : "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              User Agent: {typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Frame Metadata:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                "fc:frame": "vNext",
                "fc:frame:image": "https://agro-bootcamp.vercel.app/og-image",
                "fc:frame:button:1": "Ir al Dashboard",
                "fc:frame:post_url": "https://agro-bootcamp.vercel.app/api/frame"
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 