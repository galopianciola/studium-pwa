"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, /* RotateCcw, */ Home, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, ApiError } from "@/lib/api"

interface ExtractedText {
  document_id: string
  text: string
  word_count: number
}

interface StudyActivity {
  id: number
  type: string
  question?: string
  answer?: string
  statement?: string
  options?: string[]
  correct_answer?: number | boolean
  explanation?: string
  character: string
  userAnswer?: number | boolean
  isCorrect?: boolean
  completed?: boolean
}

export default function StudyPage() {
  const [currentActivity, setCurrentActivity] = useState(0)
  // const [isFlipped, setIsFlipped] = useState(false) // Disabled with flashcards
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [studyActivities, setStudyActivities] = useState<StudyActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<ExtractedText | null>(null)
  const [studyStartTime] = useState(Date.now())
  const router = useRouter()

  const characters = [
    "brain-character.png",
    "broccoli-character.png", 
    "avocado-character.png",
    "onion-character.png"
  ]

  useEffect(() => {
    const storedText = sessionStorage.getItem("extractedText")
    const storedDocInfo = sessionStorage.getItem("documentInfo")
    
    if (!storedText) {
      router.push("/upload")
      return
    }

    const textData: ExtractedText = JSON.parse(storedText)
    setExtractedText(textData)
    
    // Store document info for results screen
    if (storedDocInfo) {
      const docInfo = JSON.parse(storedDocInfo)
      sessionStorage.setItem("currentDocumentInfo", JSON.stringify({
        filename: docInfo.filename,
        document_id: textData.document_id
      }))
    }
    
    generateActivities(textData.text)
  }, [router])

  const generateActivities = async (text: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate mixed activities in a single API call to avoid rate limiting
      console.log('Generating mixed activities...')
      const mixedResponse = await api.generateMixedActivities({
        text,
        language: "es"
      })

      // Convert backend responses to frontend format
      const activities: StudyActivity[] = []
      let id = 1

      // Process all activities from mixed response
      mixedResponse.activities.forEach((activity: any) => {
        // Temporarily disabled flashcards - uncomment to re-enable
        // if (activity.type === "flashcard") {
        //   activities.push({
        //     id: id++,
        //     type: "flashcard",
        //     question: activity.question,
        //     answer: activity.answer,
        //     character: characters[(id - 2) % characters.length]
        //   })
        // } else 
        if (activity.type === "multiple_choice") {
          activities.push({
            id: id++,
            type: "multiple-choice",
            question: activity.question,
            options: activity.options,
            correct_answer: activity.correct_answer,
            explanation: activity.explanation,
            character: characters[(id - 2) % characters.length]
          })
        } else if (activity.type === "true_false") {
          activities.push({
            id: id++,
            type: "true-false",
            question: activity.statement,
            correct_answer: activity.correct_answer,
            explanation: activity.explanation,
            character: characters[(id - 2) % characters.length]
          })
        }
      })

      // Shuffle activities for variety
      const shuffledActivities = activities.sort(() => Math.random() - 0.5)
      setStudyActivities(shuffledActivities)

    } catch (err) {
      console.error('Error generating activities:', err)
      if (err instanceof ApiError) {
        setError(`Error al generar actividades: ${err.message}`)
      } else {
        setError('Error al generar actividades de estudio. Por favor intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const activity = studyActivities[currentActivity]
  const progress = studyActivities.length > 0 ? ((currentActivity + 1) / studyActivities.length) * 100 : 0

  const handleNext = () => {
    if (currentActivity < studyActivities.length - 1) {
      setCurrentActivity(currentActivity + 1)
      resetActivity()
    } else {
      // This is the last activity, calculate and save results
      calculateAndSaveResults()
    }
  }

  const handlePrevious = () => {
    if (currentActivity > 0) {
      setCurrentActivity(currentActivity - 1)
      resetActivity()
    }
  }

  const resetActivity = () => {
    // setIsFlipped(false) // Disabled with flashcards
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  // Temporarily disabled flashcards - uncomment to re-enable
  // const handleFlashcardComplete = () => {
  //   // Mark flashcard as completed
  //   const updatedActivities = [...studyActivities]
  //   updatedActivities[currentActivity] = {
  //     ...updatedActivities[currentActivity],
  //     completed: true
  //   }
  //   setStudyActivities(updatedActivities)
  // }

  const calculateAndSaveResults = () => {
    const studyEndTime = Date.now()
    const studyTime = Math.floor((studyEndTime - studyStartTime) / 1000)
    
    // Calculate overall stats
    let totalQuestions = 0
    let correctAnswers = 0
    
    // Activity breakdown
    const activityBreakdown = {
      flashcards: { total: 0, completed: 0 },
      multipleChoice: { total: 0, correct: 0 },
      trueFalse: { total: 0, correct: 0 }
    }
    
    studyActivities.forEach(activity => {
      // Temporarily disabled flashcards - uncomment to re-enable
      // if (activity.type === 'flashcard') {
      //   activityBreakdown.flashcards.total++
      //   if (activity.completed) {
      //     activityBreakdown.flashcards.completed++
      //   }
      // } else 
      if (activity.type === 'multiple-choice') {
        activityBreakdown.multipleChoice.total++
        totalQuestions++
        if (activity.isCorrect) {
          correctAnswers++
          activityBreakdown.multipleChoice.correct++
        }
      } else if (activity.type === 'true-false') {
        activityBreakdown.trueFalse.total++
        totalQuestions++
        if (activity.isCorrect) {
          correctAnswers++
          activityBreakdown.trueFalse.correct++
        }
      }
    })
    
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    
    // Get document info from sessionStorage
    const storedDocInfo = sessionStorage.getItem("currentDocumentInfo")
    let documentInfo = {
      filename: 'Documento de Estudio',
      document_id: extractedText?.document_id || ''
    }
    
    if (storedDocInfo) {
      const docInfo = JSON.parse(storedDocInfo)
      documentInfo = {
        filename: docInfo.filename || 'Documento de Estudio',
        document_id: docInfo.document_id || extractedText?.document_id || ''
      }
    }
    
    const results = {
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      percentage,
      activityBreakdown,
      documentInfo,
      studyTime
    }
    
    // Save results to sessionStorage
    sessionStorage.setItem('studyResults', JSON.stringify(results))
    
    // Navigate to results screen
    router.push('/results')
  }

  // Temporarily disabled with flashcards - uncomment to re-enable
  // const handleFlip = () => {
  //   setIsFlipped(!isFlipped)
  // }

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index)
      setShowResult(true)
      
      // Update the activity with user answer
      const updatedActivities = [...studyActivities]
      updatedActivities[currentActivity] = {
        ...updatedActivities[currentActivity],
        userAnswer: index,
        isCorrect: index === activity.correct_answer,
        completed: true
      }
      setStudyActivities(updatedActivities)
    }
  }

  const handleTrueFalse = (answer: boolean) => {
    if (!showExplanation) {
      setShowExplanation(true)
      
      // Update the activity with user answer
      const updatedActivities = [...studyActivities]
      updatedActivities[currentActivity] = {
        ...updatedActivities[currentActivity],
        userAnswer: answer,
        isCorrect: answer === activity.correct_answer,
        completed: true
      }
      setStudyActivities(updatedActivities)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 studium-bg">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <Loader2 className="w-full h-full text-green-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Generando Actividades</h1>
          <p className="text-gray-600">Creando preguntas personalizadas de tu documento...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 studium-bg">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <AlertCircle className="w-full h-full text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/upload")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver a Subir
          </button>
        </div>
      </div>
    )
  }

  if (studyActivities.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 studium-bg">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">No se pudieron generar actividades</h1>
          <p className="text-gray-600">Por favor intenta con otro documento.</p>
          <button
            onClick={() => router.push("/upload")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Subir Otro Documento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col studium-bg">
      {/* Header */}
      <header className="safe-area-top px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Sesión de Estudio</h1>
            <p className="text-sm text-gray-600">
              Actividad {currentActivity + 1} de {studyActivities.length}
            </p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="touch-target">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-md min-w-0">
          {/* Activity Card */}
          {/* Temporarily disabled flashcards - uncomment to re-enable */}
          {/* {activity?.type === "flashcard" && (
            <div className="relative h-80 perspective-1000">
              <div className={`card-flip ${isFlipped ? "flipped" : ""} w-full h-full relative`}>
                <div className="card-front bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center border border-green-200">
                  <div className="w-16 h-16 mx-auto mb-4">
                    <Image
                      src={`/characters/${activity.character}`}
                      alt="Character"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pregunta</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{activity.question}</p>
                  <Button
                    onClick={() => {
                      handleFlip()
                      handleFlashcardComplete()
                    }}
                    className="touch-target studium-green hover:studium-green-light text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Ver Respuesta
                  </Button>
                </div>
                <div className="card-back bg-green-50/90 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center border border-green-200">
                  <div className="w-16 h-16 mx-auto mb-4">
                    <Image
                      src={`/characters/${activity.character}`}
                      alt="Character"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Respuesta</h3>
                  <p className="text-green-800 text-base leading-relaxed mb-6">{activity.answer}</p>
                  <Button
                    onClick={handleFlip}
                    variant="outline"
                    className="touch-target border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Ver Pregunta
                  </Button>
                </div>
              </div>
            </div>
          )} */}

          {/* Multiple Choice */}
          {activity?.type === "multiple-choice" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-3">
                  <Image
                    src={`/characters/${activity.character}`}
                    alt="Character"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Opción Múltiple</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 break-all hyphens-auto" style={{wordWrap: 'break-word', overflowWrap: 'anywhere', wordBreak: 'break-word'}}>{activity.question}</p>

              <div className="space-y-3">
                {activity.options?.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className={`w-full touch-target text-left justify-start p-4 h-auto transition-all duration-200 overflow-hidden whitespace-normal ${
                      showResult
                        ? index === activity.correct_answer
                          ? "bg-green-100 border-green-500 text-green-800"
                          : selectedAnswer === index
                            ? "bg-red-100 border-red-500 text-red-800"
                            : "bg-gray-50 border-gray-300 text-gray-600"
                        : selectedAnswer === index
                          ? "bg-green-100 border-green-500 text-green-800"
                          : "hover:bg-gray-50"
                    }`}
                    disabled={showResult}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    <span className="break-all hyphens-auto" style={{wordWrap: 'break-word', overflowWrap: 'anywhere', wordBreak: 'break-word'}}>{option}</span>
                  </Button>
                ))}
              </div>

              {showResult && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    selectedAnswer === activity.correct_answer ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-medium">{selectedAnswer === activity.correct_answer ? "✓ ¡Correcto!" : "✗ Incorrecto"}</p>
                  {selectedAnswer !== activity.correct_answer && (
                    <p className="text-sm mt-1">La respuesta correcta es: {activity.options?.[activity.correct_answer as number]}</p>
                  )}
                  {activity.explanation && (
                    <p className="text-sm mt-2 opacity-90">{activity.explanation}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* True/False */}
          {activity?.type === "true-false" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-3">
                  <Image
                    src={`/characters/${activity.character}`}
                    alt="Character"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Verdadero o Falso</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 break-all hyphens-auto" style={{wordWrap: 'break-word', overflowWrap: 'anywhere', wordBreak: 'break-word'}}>{activity.question}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button
                  onClick={() => handleTrueFalse(true)}
                  className={`touch-target py-4 ${
                    showExplanation
                      ? activity.correct_answer === true
                        ? "studium-green hover:studium-green-light text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      : "studium-green hover:studium-green-light text-white"
                  }`}
                  disabled={showExplanation}
                >
                  Verdadero
                </Button>
                <Button
                  onClick={() => handleTrueFalse(false)}
                  className={`touch-target py-4 ${
                    showExplanation
                      ? activity.correct_answer === false
                        ? "studium-green hover:studium-green-light text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      : "studium-green hover:studium-green-light text-white"
                  }`}
                  disabled={showExplanation}
                >
                  Falso
                </Button>
              </div>

              {showExplanation && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900 mb-2">
                    Respuesta: {activity.correct_answer ? "Verdadero" : "Falso"}
                  </p>
                  {activity.explanation && (
                    <p className="text-green-800 text-sm">{activity.explanation}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="safe-area-bottom p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentActivity === 0}
            variant="outline"
            className="touch-target bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentActivity === studyActivities.length - 1 ? (
            <Button 
              onClick={calculateAndSaveResults}
              className="touch-target studium-green hover:studium-green-light text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Ver Resultados
            </Button>
          ) : (
            <Button onClick={handleNext} className="touch-target studium-green hover:studium-green-light text-white">
              Siguiente Actividad
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">Actividades generadas desde: {extractedText?.document_id}</p>
        </div>
      </footer>
    </div>
  )
}
