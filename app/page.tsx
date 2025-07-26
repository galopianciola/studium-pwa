"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      router.push("/welcome")
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center studium-bg">
      {/* Main Logo and Character */}
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 mx-auto character-bounce">
            <Image
              src="/characters/brain-character.png"
              alt="Studium Brain Character"
              width={128}
              height={128}
              className="w-full h-full object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">studium</h1>
          <p className="text-gray-600 text-lg">Tu compañero de estudio inteligente</p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  )
}
