"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Home, Trophy, Target, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface StudyResult {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  percentage: number
  activityBreakdown: {
    flashcards: { total: number; completed: number }
    multipleChoice: { total: number; correct: number }
    trueFalse: { total: number; correct: number }
  }
  documentInfo: {
    filename: string
    document_id: string
  }
  studyTime: number // in seconds
}

export default function ResultsPage() {
  const [results, setResults] = useState<StudyResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedResults = sessionStorage.getItem("studyResults")
    if (!storedResults) {
      router.push("/upload")
      return
    }

    const resultData: StudyResult = JSON.parse(storedResults)
    setResults(resultData)
    setIsLoading(false)
  }, [router])

  if (isLoading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center studium-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Calculando resultados...</p>
        </div>
      </div>
    )
  }

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "¡Excelente trabajo!", emoji: "🏆", color: "text-yellow-600" }
    if (percentage >= 80) return { message: "¡Muy bien!", emoji: "🎉", color: "text-green-600" }
    if (percentage >= 70) return { message: "¡Buen trabajo!", emoji: "👍", color: "text-blue-600" }
    if (percentage >= 60) return { message: "Bien hecho", emoji: "😊", color: "text-green-600" }
    return { message: "Sigue practicando", emoji: "💪", color: "text-orange-600" }
  }

  const performance = getPerformanceMessage(results.percentage)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col studium-bg">
      {/* Header */}
      <header className="safe-area-top px-4 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/study">
            <Button variant="ghost" size="sm" className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Resultados</h1>
            <p className="text-sm text-gray-600">Sesión Completada</p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="touch-target">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Performance Header */}
        <div className="text-center py-6">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${performance.color} mb-2`}>
            {performance.message} {performance.emoji}
          </h2>
          <p className="text-gray-600">Has completado tu sesión de estudio</p>
        </div>

        {/* Score Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-200">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {results.percentage}%
            </div>
            <p className="text-gray-600">Puntuación General</p>
          </div>

          <div className="mb-4">
            <Progress value={results.percentage} className="h-3 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold text-green-600">{results.correctAnswers}</div>
                <div className="text-xs text-gray-600">Correctas</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-semibold text-red-600">{results.incorrectAnswers}</div>
                <div className="text-xs text-gray-600">Incorrectas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Desglose por Actividad
          </h3>

          <div className="space-y-4">
            {/* Temporarily disabled flashcards - uncomment to re-enable */}
            {/* <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Image
                  src="/characters/brain-character.png"
                  alt="Flashcards"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium text-gray-900">Tarjetas de Memoria</div>
                  <div className="text-sm text-gray-600">
                    {results.activityBreakdown.flashcards.completed} de {results.activityBreakdown.flashcards.total} completadas
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-green-600">
                {Math.round((results.activityBreakdown.flashcards.completed / results.activityBreakdown.flashcards.total) * 100)}%
              </div>
            </div> */}

            {/* Multiple Choice */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Image
                  src="/characters/broccoli-character.png"
                  alt="Multiple Choice"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium text-gray-900">Opción Múltiple</div>
                  <div className="text-sm text-gray-600">
                    {results.activityBreakdown.multipleChoice.correct} de {results.activityBreakdown.multipleChoice.total} correctas
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {Math.round((results.activityBreakdown.multipleChoice.correct / results.activityBreakdown.multipleChoice.total) * 100)}%
              </div>
            </div>

            {/* True/False */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Image
                  src="/characters/onion-character.png"
                  alt="True/False"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium text-gray-900">Verdadero/Falso</div>
                  <div className="text-sm text-gray-600">
                    {results.activityBreakdown.trueFalse.correct} de {results.activityBreakdown.trueFalse.total} correctas
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-orange-600">
                {Math.round((results.activityBreakdown.trueFalse.correct / results.activityBreakdown.trueFalse.total) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Study Session Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Sesión</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Documento:</span>
              <span className="font-medium text-gray-900">{results.documentInfo.filename || 'Documento de Estudio'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de preguntas:</span>
              <span className="font-medium text-gray-900">{results.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo de estudio:</span>
              <span className="font-medium text-gray-900">{formatTime(results.studyTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="safe-area-bottom p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/upload")}
            className="w-full touch-target studium-green hover:studium-green-light text-white py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Estudiar Otro Documento
          </Button>
          
          <Link href="/">
            <Button
              variant="outline"
              className="w-full touch-target bg-transparent py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
