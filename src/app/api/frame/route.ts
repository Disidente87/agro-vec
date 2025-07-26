import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Farcaster frame interaction
    const { untrustedData, trustedData } = body
    
    // Log the interaction for debugging
    console.log("Farcaster frame interaction:", { untrustedData, trustedData })
    
    // For now, redirect to the dashboard
    return NextResponse.json({
      frames: {
        version: "vNext",
        image: "https://agro-bootcamp.vercel.app/og-image",
        buttons: [
          {
            label: "Ir al Dashboard",
            action: "post_redirect",
            target: "https://agro-bootcamp.vercel.app/dashboard"
          },
          {
            label: "Gestión de Parcelas",
            action: "post_redirect", 
            target: "https://agro-bootcamp.vercel.app/parcels"
          }
        ],
        postUrl: "https://agro-bootcamp.vercel.app/api/frame"
      }
    })
  } catch (error) {
    console.error("Frame API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return frame metadata for GET requests
  return NextResponse.json({
    frames: {
      version: "vNext",
      image: "https://agro-bootcamp.vercel.app/og-image",
      buttons: [
        {
          label: "Ir al Dashboard",
          action: "post_redirect",
          target: "https://agro-bootcamp.vercel.app/dashboard"
        }
      ],
      postUrl: "https://agro-bootcamp.vercel.app/api/frame"
    }
  })
} 