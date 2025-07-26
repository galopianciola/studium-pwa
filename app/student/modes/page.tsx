"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, HelpCircle, Shuffle, CheckCircle, Calendar, Clock } from "lucide-react"
import { type StudyPlanResponse } from "@/lib/api"

export default function StudentModesPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [studyPlan, setStudyPlan] = useState<StudyPlanResponse | null>(null)
  const [documentText, setDocumentText] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load the study plan from localStorage
    const savedPlan = localStorage.getItem('latestStudyPlan')
    if (savedPlan) {
      try {
        setStudyPlan(JSON.parse(savedPlan))
      } catch (error) {
        console.error('Error parsing saved study plan:', error)
      }
    }

    // Load the document text from localStorage
    const savedDocumentText = localStorage.getItem('studyDocumentText')
    if (savedDocumentText) {
      setDocumentText(savedDocumentText)
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    })
  }

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date()
    const exam = new Date(examDate)
    const diffTime = exam.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getRouteForMode = (modeId: string) => {
    // If we have document text from study plan, go directly to study page
    if (documentText) {
      return "/study"
    }
    // Otherwise, go to upload page
    return "/upload"
  }

  const studyModes = [
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Memoriza conceptos clave de tu plan",
      character: "/characters/brain-character.png",
      characterAlt: "Brain with book",
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      borderColor: "hover:border-pink-300",
      icon: BookOpen,
      route: getRouteForMode("flashcards"),
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
      route: getRouteForMode("trivia"),
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
      route: getRouteForMode("mixed"),
    },
  ]

  const handleModeSelect = (mode: (typeof studyModes)[0]) => {
    setSelectedMode(mode.id)
    
    // Add study plan data to localStorage for the activity page
    if (studyPlan) {
      localStorage.setItem('selectedStudyMode', mode.id)
      localStorage.setItem('studyContext', JSON.stringify({
        planId: studyPlan.plan_id,
        subjectName: studyPlan.subject_name,
        examDate: studyPlan.exam_date,
        mode: mode.id,
        hasDocumentText: !!documentText
      }))
      
      // If we have document text, prepare sessionStorage for the study page
      if (documentText) {
        localStorage.setItem('studyDocumentText', documentText)
        
        // Prepare sessionStorage data that /study page expects
        const extractedTextData = {
          document_id: studyPlan.plan_id, // Use plan ID as document ID
          text: documentText,
          word_count: documentText.split(' ').length
        }
        
        const documentInfo = {
          filename: `Plan de Estudio - ${studyPlan.subject_name}`,
          document_id: studyPlan.plan_id
        }
        
        // Set sessionStorage data expected by /study page
        sessionStorage.setItem('extractedText', JSON.stringify(extractedTextData))
        sessionStorage.setItem('documentInfo', JSON.stringify(documentInfo))
      }
    }
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      router.push(mode.route)
    }, 200)
  }

  const handleViewPlan = () => {
    if (studyPlan) {
      router.push(`/student/learn/plan/results?planId=${studyPlan.plan_id}`)
    }
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
        <div className="text-center max-w-md mx-auto space-y-6">
          
          {/* Study Plan Success Message */}
          {studyPlan && (
            <div className="bg-green-100 border border-green-300 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">¡Plan de estudio creado!</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{studyPlan.subject_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(studyPlan.exam_date)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{getDaysUntilExam(studyPlan.exam_date)} días para el examen</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewPlan}
                className="mt-3 text-green-700 border-green-300 hover:bg-green-50"
              >
                Ver Plan Completo
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {studyPlan ? 'Elige tu modo de estudio' : 'Selecciona tu actividad'}
            </h2>
            <p className="text-base text-gray-600">
              {studyPlan 
                ? 'Comienza a estudiar con tu plan personalizado' 
                : 'Selecciona cómo quieres aprender hoy'
              }
            </p>
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

          <p className="text-sm text-gray-500 mt-6">
            {studyPlan 
              ? `Las actividades se basarán en tu plan de estudio personalizado${documentText ? ' y el documento original' : ''}`
              : 'Puedes cambiar de modo en cualquier momento'
            }
          </p>
        </div>
      </main>
    </div>
  )
}