"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, Brain, MessageCircleQuestion, Home, Zap, ArrowLeft } from "lucide-react"

export default function StudentLearnPage() {
  const router = useRouter()

  const handleStudyPlan = () => {
    router.push("/student/learn/plan")
  }

  const handleQuickLearn = () => {
    router.push("/student/modes")
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
            <div className="w-12 h-12">
              <Image
                src="/characters/brain-character.png"
                alt="Studium Brain"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">studium</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="text-center max-w-md mx-auto space-y-8">
          {/* Title Section */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              De apuntes a<br />
              aprendizaje real
            </h2>
            <p className="text-base text-gray-600 leading-relaxed px-2">
              Subí tus materiales y dejá que la inteligencia artificial cree resúmenes, trivias y flashcards adaptadas a
              tu ritmo. Aprendé más rápido, jugando.
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center space-x-6 py-4">
            {/* Upload Feature */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-yellow-200 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-700" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">Subí tus</p>
                <p className="text-sm font-medium text-gray-800">apuntes</p>
              </div>
            </div>

            {/* AI Analysis Feature */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-gray-700" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">Análisis</p>
                <p className="text-sm font-medium text-gray-800">con IA</p>
              </div>
            </div>

            {/* Smart Questions Feature */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-pink-200 rounded-2xl flex items-center justify-center">
                <MessageCircleQuestion className="w-8 h-8 text-gray-700" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">Preguntas</p>
                <p className="text-sm font-medium text-gray-800">Inteligentes</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            {/* Study Plan Button */}
            <Button
              onClick={handleStudyPlan}
              className="w-full bg-[#257e52] hover:bg-[#1f6b44] text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg"
              size="lg"
            >
              <Home className="w-5 h-5 mr-3" />
              Arma Plan de Estudio
            </Button>

            {/* Quick Learn Button */}
            <Button
              onClick={handleQuickLearn}
              className="w-full bg-[#257e52] hover:bg-[#1f6b44] text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-3" />
              Aprende Rápido
            </Button>

            {/* File Type Note */}
            <p className="text-sm text-gray-500 pt-2">Solo archivos PDF y imágenes</p>
          </div>
        </div>
      </main>
    </div>
  )
}
