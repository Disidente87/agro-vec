import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FarcasterProvider } from "@/components/farcaster-provider";
import { WagmiConfigProvider } from "@/providers/wagmi-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthHeader } from "@/components/auth-header";
import { ConditionalNavigation } from "@/components/conditional-navigation";

// Fonts configured but not currently used in body className
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// Mini App configuration for Farcaster
const miniapp = {
  version: "1",
  imageUrl: "https://agro-qfqlwjshx-disidentes-projects.vercel.app/og-image",
  button: {
    title: "Open Agro-bootcamp",
    action: {
      type: "launch_frame",
      name: "Agro-bootcamp",
      url: "https://agro-qfqlwjshx-disidentes-projects.vercel.app",
      splashImageUrl: "https://agro-qfqlwjshx-disidentes-projects.vercel.app/icon",
      splashBackgroundColor: "#f0fdf4"
    }
  }
}

export const metadata: Metadata = {
  title: "Agro-bootcamp",
  description: "Trazabilidad agrícola sobre blockchain Base L2. Hackathon Base.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  openGraph: {
    title: "Agro-bootcamp",
    description: "Trazabilidad agrícola sobre blockchain Base L2. Hackathon Base.",
    images: [
      {
        url: "https://agro-qfqlwjshx-disidentes-projects.vercel.app/og-image",
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
    images: ["https://agro-qfqlwjshx-disidentes-projects.vercel.app/og-image"],
  },
  other: {
    "fc:miniapp": JSON.stringify(miniapp),
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
        <WagmiConfigProvider>
          <AuthProvider>
            <FarcasterProvider>
              <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green-200">
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-lg font-bold text-green-800">🌱 Agro-bootcamp</h1>
                  </div>
                  <AuthHeader />
                </div>
              </div>
              <ConditionalNavigation />
              <div className="pt-16">
                {children}
              </div>
            </FarcasterProvider>
          </AuthProvider>
        </WagmiConfigProvider>
      </body>
    </html>
  );
}
