"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

// Extend Window interface for fallback methods
declare global {
  interface Window {
    ready?: () => void
  }
}

export default function TestMiniAppPage() {
  const [readyCalled, setReadyCalled] = useState(false)
  const [miniappDetected, setMiniappDetected] = useState(false)
  const [manifestStatus, setManifestStatus] = useState("checking")
  const [sdkStatus, setSdkStatus] = useState("checking")

  useEffect(() => {
    // Check if we're in a Farcaster Mini App
    const isInMiniApp = window.location.href.includes("farcaster") || 
                       window.location.href.includes("warpcast") ||
                       document.referrer.includes("farcaster") ||
                       document.referrer.includes("warpcast")
    
    setMiniappDetected(isInMiniApp)

    // Check manifest status
    fetch("/.well-known/farcaster.json")
      .then(response => {
        if (response.ok) {
          setManifestStatus("found")
        } else {
          setManifestStatus("not-found")
        }
      })
      .catch(() => {
        setManifestStatus("error")
      })

    // Test SDK functionality
    const testSDK = async () => {
      try {
        await sdk.actions.ready()
        setSdkStatus("ready-called")
        setReadyCalled(true)
        console.log("Farcaster SDK ready() called successfully from test page")
      } catch (error) {
        setSdkStatus("error")
        console.error("Error calling Farcaster SDK ready():", error)
      }
    }

    testSDK()

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
          🌱 Farcaster Mini App Test
        </h1>
        
        <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${miniappDetected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium">
              Farcaster Mini App Detected: {miniappDetected ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${readyCalled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium">
              Ready Function Called: {readyCalled ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              manifestStatus === 'found' ? 'bg-green-500' : 
              manifestStatus === 'not-found' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
            <span className="font-medium">
              Manifest Status: {manifestStatus === 'found' ? 'Found' : 
                               manifestStatus === 'not-found' ? 'Not Found' : 
                               'Checking...'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              sdkStatus === 'ready-called' ? 'bg-green-500' : 
              sdkStatus === 'error' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
            <span className="font-medium">
              SDK Status: {sdkStatus === 'ready-called' ? 'Ready Called' : 
                          sdkStatus === 'error' ? 'Error' : 
                          'Checking...'}
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
            <h3 className="font-semibold mb-2">Mini App Metadata:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                "fc:miniapp": {
                  "version": "1",
                  "imageUrl": "https://agro-qfqlwjshx-disidentes-projects.vercel.app/og-image",
                  "button": {
                    "title": "Open Agro-bootcamp",
                    "action": {
                      "type": "launch_frame",
                      "name": "Agro-bootcamp",
                      "url": "https://agro-qfqlwjshx-disidentes-projects.vercel.app",
                      "splashImageUrl": "https://agro-qfqlwjshx-disidentes-projects.vercel.app/icon",
                      "splashBackgroundColor": "#f0fdf4"
                    }
                  }
                }
              }, null, 2)}
            </pre>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Manifest URL:</h3>
            <p className="text-sm text-blue-600">
              <a href="/.well-known/farcaster.json" target="_blank" rel="noopener noreferrer">
                /.well-known/farcaster.json
              </a>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">SDK Test:</h3>
            <button 
              onClick={async () => {
                try {
                  await sdk.actions.ready()
                  setReadyCalled(true)
                  setSdkStatus("ready-called")
                  console.log("Manual SDK ready() call successful")
                } catch (error) {
                  console.error("Manual SDK ready() call failed:", error)
                  setSdkStatus("error")
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test SDK.actions.ready()
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 