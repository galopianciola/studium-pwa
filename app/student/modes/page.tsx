"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, HelpCircle, Shuffle } from "lucide-react"

export default function StudentModesPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const router = useRouter()

  const studyModes = [
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Memoriza conceptos clave",
      character: "/characters/brain-character.png",
      characterAlt: "Brain with book",
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      borderColor: "hover:border-pink-300",
      icon: BookOpen,
      route: "/upload",
    },
    {
      id: "trivia",
      title: "Trivia",
      description: "Pon a prueba tus conocimientos",
      character: "/characters/onion-character.png",
      characterAlt: "Brain with question mark",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      borderColor: "hover:border-blue-300",
      icon: HelpCircle,
      route: "/upload",
    },
    {
      id: "mixed",
      title: "Estudio Mixto",
      description: "Combina diferentes actividades",
      character: "/characters/avocado-character.png",
      characterAlt: "Brain with multiple icons",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      borderColor: "hover:border-green-300",
      icon: Shuffle,
      route: "/upload",
    },
  ]

  const handleModeSelect = (mode: (typeof studyModes)[0]) => {
    setSelectedMode(mode.id)
    // Add a small delay for visual feedback
    setTimeout(() => {
      router.push(mode.route)
    }, 200)
  }

  return (
    <div className="min-h-screen flex flex-col studium-bg">
      {/* Header */}
      <header className="safe-area-top px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <Image
                src="/characters/brain-character.png"
                alt="Studium Brain"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800">studium</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="text-center max-w-md mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Elige tu modo de estudio</h2>
            <p className="text-base text-gray-600">Selecciona cómo quieres aprender hoy</p>
          </div>

          {/* Study Mode Cards */}
          <div className="space-y-4">
            {studyModes.map((mode) => {
              const Icon = mode.icon
              const isSelected = selectedMode === mode.id

              return (
                <Card
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${mode.borderColor} ${
                    isSelected ? "ring-2 ring-opacity-50 scale-105" : ""
                  }`}
                  onClick={() => handleModeSelect(mode)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className={`w-20 h-20 ${mode.color.replace("bg-", "bg-").replace("-500", "-100")} rounded-full flex items-center justify-center relative`}
                      >
                        <Image
                          src={mode.character || "/placeholder.svg"}
                          alt={mode.characterAlt}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-contain"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 ${mode.color} rounded-full flex items-center justify-center`}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-center">{mode.title}</CardTitle>
                    <CardDescription className="text-center">{mode.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={`w-full ${mode.color} ${mode.hoverColor} text-white font-semibold py-3 rounded-xl transition-all duration-200 ${
                        isSelected ? "animate-pulse" : ""
                      }`}
                      size="lg"
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      Seleccionar
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <p className="text-sm text-gray-500 mt-6">Puedes cambiar de modo en cualquier momento</p>
        </div>
      </main>
    </div>
  )
}
