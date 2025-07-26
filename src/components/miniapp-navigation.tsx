"use client"

import { useRouter, usePathname } from "next/navigation"
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline"

interface MiniAppNavigationProps {
  showBack?: boolean
  showHome?: boolean
  backUrl?: string
  className?: string
}

export function MiniAppNavigation({ 
  showBack = true, 
  showHome = true, 
  backUrl,
  className = "" 
}: MiniAppNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  const handleHome = () => {
    router.push("/")
  }

  // Don't show navigation on home page
  if (pathname === "/") {
    return null
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center">
          {showHome && (
            <button
              onClick={handleHome}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Inicio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 