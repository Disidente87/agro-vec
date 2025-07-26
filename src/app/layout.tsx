import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FarcasterProvider } from "@/components/farcaster-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agro-bootcamp",
  description: "Trazabilidad agrícola sobre blockchain Base L2. Hackathon Base.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  openGraph: {
    title: "Agro-bootcamp",
    description: "Trazabilidad agrícola sobre blockchain Base L2. Hackathon Base.",
    images: [
      {
        url: "https://agro-bootcamp.vercel.app/og-image",
        width: 1200,
        height: 630,
        alt: "Agro-bootcamp - Trazabilidad agrícola sobre blockchain Base L2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agro-bootcamp",
    description: "Trazabilidad agrícola sobre blockchain Base L2. Hackathon Base.",
    images: ["https://agro-bootcamp.vercel.app/og-image"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://agro-bootcamp.vercel.app/og-image",
    "fc:frame:button:1": "Ir al Dashboard",
    "fc:frame:post_url": "https://agro-bootcamp.vercel.app/api/frame",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Farcaster integration script
              (function() {
                if (typeof window !== 'undefined') {
                  // Create a global ready function for Farcaster
                  window.ready = function() {
                    console.log('Farcaster ready function called');
                  };
                  
                  // Call ready when DOM is loaded
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', window.ready);
                  } else {
                    window.ready();
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-green-50 text-green-900 font-sans min-h-screen">
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}
