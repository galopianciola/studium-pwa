"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, Upload, BookOpen, Calendar, Loader2, AlertCircle } from "lucide-react"
import { api, ProcessingStatus, type UploadResponse, type ProcessingResponse, type StudyPlanRequest } from "@/lib/api"

interface UploadedDocument {
  id: string
  name: string
  status: ProcessingStatus
  progress: number
}

export default function StudyPlanPage() {
  const router = useRouter()
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [subjectName, setSubjectName] = useState("")
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null)
  
  // Upload and processing state
  const [isUploading, setIsUploading] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calendar helpers
  const daysOfWeek = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"]
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    
    try {
      // Upload document
      const uploadResponse: UploadResponse = await api.uploadDocument(file)
      
      setUploadedDocument({
        id: uploadResponse.document_id,
        name: uploadResponse.filename,
        status: uploadResponse.status,
        progress: 0
      })
      
      // Start processing
      await api.processDocument(uploadResponse.document_id)
      
      // Poll for processing status
      const pollProcessing = async () => {
        try {
          const statusResponse = await api.getProcessingStatus(uploadResponse.document_id)
          setProcessingStatus(statusResponse)
          
          setUploadedDocument(prev => prev ? {
            ...prev,
            status: statusResponse.status,
            progress: statusResponse.progress
          } : null)
          
          if (statusResponse.status === ProcessingStatus.PROCESSING) {
            setTimeout(pollProcessing, 2000) // Poll every 2 seconds
          }
        } catch (error) {
          console.error('Error polling processing status:', error)
          setError('Error al procesar el documento')
        }
      }
      
      setTimeout(pollProcessing, 1000)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Error al subir el archivo')
    } finally {
      setIsUploading(false)
    }
  }

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  // Generate study plan
  const handleGenerateStudyPlan = async () => {
    if (!uploadedDocument || !selectedDate || !subjectName.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    if (processingStatus?.status !== ProcessingStatus.COMPLETED) {
      setError('Espera a que termine de procesarse el documento')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const request: StudyPlanRequest = {
        file_id: uploadedDocument.id,
        subject_name: subjectName.trim(),
        exam_date: formatDate(selectedDate),
        language: 'es'
      }

      const studyPlan = await api.generateStudyPlan(request)
      
      // Navigate to results page with the plan ID to show the plan first
      router.push(`/student/learn/plan/results?planId=${studyPlan.plan_id}`)
      
    } catch (error: any) {
      console.error('Study plan generation error:', error)
      setError(error.message || 'Error al generar el plan de estudio')
    } finally {
      setIsGenerating(false)
    }
  }

  const canGeneratePlan = uploadedDocument && 
                          processingStatus?.status === ProcessingStatus.COMPLETED && 
                          selectedDate && 
                          subjectName.trim()

  return (
    <div className="min-h-screen studium-bg">
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
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              Arma tu plan
              <br />
              de estudio
            </h2>
            <p className="text-base text-gray-600">Personaliza tu experiencia de estudio</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Subí tus Resúmenes</h3>
            
            {!uploadedDocument ? (
              <label className="block">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div
                  className="w-full bg-green-200 hover:bg-green-300 text-gray-800 font-medium py-4 rounded-2xl transition-all duration-200 text-base flex items-center justify-center space-x-3 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ opacity: isUploading ? 0.5 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>{isUploading ? 'Subiendo...' : 'Cargar archivo'}</span>
                </div>
              </label>
            ) : (
              <div className="bg-green-100 border border-green-300 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{uploadedDocument.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {uploadedDocument.status === ProcessingStatus.PROCESSING && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      <span className="text-sm text-gray-600 capitalize">
                        {uploadedDocument.status === ProcessingStatus.PROCESSING ? 'Procesando...' : 
                         uploadedDocument.status === ProcessingStatus.COMPLETED ? 'Listo' :
                         uploadedDocument.status === ProcessingStatus.FAILED ? 'Error' : 'Pendiente'}
                      </span>
                      {uploadedDocument.status === ProcessingStatus.PROCESSING && (
                        <span className="text-sm text-gray-600">
                          {Math.round(uploadedDocument.progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedDocument(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cambiar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Subject Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Materia a Preparar</h3>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Ej: Historia, Matemáticas, Biología..."
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="pl-12 py-4 rounded-2xl bg-orange-100 border-orange-200 text-gray-800 placeholder-gray-600 text-base"
              />
            </div>
          </div>

          {/* Date Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Fecha del examen</h3>

            {/* Date Selector */}
            <Button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-medium py-4 rounded-2xl transition-all duration-200 text-base flex items-center justify-between px-6"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>
                  {selectedDate ? selectedDate.toLocaleDateString('es-ES') : 'Elegí una fecha'}
                </span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </Button>

            {/* Calendar Widget */}
            {showCalendar && (
              <div className="bg-yellow-100 rounded-2xl p-4 space-y-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')} className="p-1 hover:bg-yellow-200 rounded-lg">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-gray-800">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')} className="p-1 hover:bg-yellow-200 rounded-lg">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => (
                    <div key={index} className="w-10 h-10">
                      {date && (
                        <Button
                          onClick={() => {
                            if (!isDateDisabled(date)) {
                              setSelectedDate(date)
                              setShowCalendar(false)
                            }
                          }}
                          disabled={isDateDisabled(date)}
                          className={`
                            w-full h-full rounded-full text-sm font-medium transition-all duration-200
                            ${
                              selectedDate && selectedDate.getTime() === date.getTime()
                                ? "bg-gray-800 text-white hover:bg-gray-700"
                                : isDateDisabled(date)
                                ? "bg-transparent text-gray-400 cursor-not-allowed"
                                : "bg-transparent text-gray-800 hover:bg-yellow-200"
                            }
                          `}
                          variant="ghost"
                        >
                          {date.getDate()}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="pt-8">
            <Button
              onClick={handleGenerateStudyPlan}
              disabled={!canGeneratePlan || isGenerating}
              className="w-full bg-[#257e52] hover:bg-[#1f6b44] text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Generando Plan...
                </>
              ) : (
                'Generar Plan de Estudio'
              )}
            </Button>
            
            {!canGeneratePlan && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Completa todos los campos para generar tu plan
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}