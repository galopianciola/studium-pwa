"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { api, ApiError, ProcessingStatus } from "@/lib/api"

interface DocumentInfo {
  document_id: string
  filename: string
  file_size: number
  file_type: string
  status: ProcessingStatus
}

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [processingMessage, setProcessingMessage] = useState("Iniciando procesamiento...")
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const processingSteps = [
    { text: "Subiendo documento al servidor...", minProgress: 0 },
    { text: "Analizando estructura del documento...", minProgress: 20 },
    { text: "Extrayendo texto y conceptos clave...", minProgress: 40 },
    { text: "Preparando contenido para IA...", minProgress: 70 },
    { text: "¡Listo para generar actividades!", minProgress: 100 },
  ]

  useEffect(() => {
    const storedDocInfo = sessionStorage.getItem("documentInfo")
    if (!storedDocInfo) {
      router.push("/upload")
      return
    }

    const docInfo: DocumentInfo = JSON.parse(storedDocInfo)
    setDocumentInfo(docInfo)

    processDocument(docInfo.document_id)
  }, [router])

  const processDocument = async (documentId: string) => {
    try {
      // Start processing
      await api.processDocument(documentId)
      
      // Poll for status updates
      const interval = setInterval(async () => {
        try {
          const status = await api.getProcessingStatus(documentId)
          
          setProgress(status.progress)
          setProcessingMessage(status.message || "Procesando...")
          
          // Update current step based on progress
          const stepIndex = processingSteps.findIndex(step => status.progress < step.minProgress)
          setCurrentStep(stepIndex === -1 ? processingSteps.length - 1 : Math.max(0, stepIndex - 1))
          
          if (status.status === ProcessingStatus.COMPLETED) {
            clearInterval(interval)
            setProgress(100)
            setCurrentStep(processingSteps.length - 1)
            
            // Store extracted text for study page
            try {
              const textData = await api.getDocumentText(documentId)
              sessionStorage.setItem("extractedText", JSON.stringify({
                document_id: textData.document_id,
                text: textData.extracted_text,
                word_count: textData.word_count
              }))
            } catch (textError) {
              console.error("Error getting extracted text:", textError)
            }
            
            // Navigate to study page after a short delay
            setTimeout(() => {
              router.push("/study")
            }, 2000)
            
          } else if (status.status === ProcessingStatus.FAILED) {
            clearInterval(interval)
            setError(status.message || "Error en el procesamiento del documento")
          }
        } catch (pollError) {
          console.error("Error polling status:", pollError)
          clearInterval(interval)
          setError("Error al verificar el estado del procesamiento")
        }
      }, 1000) // Poll every second

      return () => clearInterval(interval)
    } catch (err) {
      console.error("Error starting processing:", err)
      if (err instanceof ApiError) {
        setError(`Error al procesar documento: ${err.message}`)
      } else {
        setError("Error al iniciar el procesamiento del documento")
      }
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 studium-bg">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <AlertCircle className="w-full h-full text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Error en el Procesamiento</h1>
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 studium-bg">
      <div className="w-full max-w-md space-y-8">
        {/* Processing Animation with Characters */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Rotating characters around center */}
            <div className="absolute inset-0 animate-spin">
              {/* Brain Character */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12">
                <Image
                  src="/characters/brain-character.png"
                  alt="Brain Character"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Broccoli Character */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12">
                <Image
                  src="/characters/broccoli-character.png"
                  alt="Broccoli Character"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Avocado Character */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12">
                <Image
                  src="/characters/avocado-character.png"
                  alt="Avocado Character"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Onion Character */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12">
                <Image
                  src="/characters/onion-character.png"
                  alt="Onion Character"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Center processing indicator */}
            <div className="absolute inset-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-green-200">
              <Brain className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Procesando tu Documento</h1>
          <p className="text-gray-600">{documentInfo?.filename}</p>
          <p className="text-gray-600">Creando actividades de estudio personalizadas...</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <Progress value={progress} className="h-3 bg-gray-200" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{Math.round(progress)}% completado</span>
            <span>{progress < 100 ? 'Procesando...' : '¡Completado!'}</span>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              {progress >= 100 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="font-medium text-gray-900">
              {processingMessage}
            </span>
          </div>

          {/* Step List */}
          <div className="space-y-2">
            {processingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                  index < currentStep ? "text-green-600" : index === currentStep ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    index < currentStep
                      ? "bg-green-600"
                      : index === currentStep
                        ? "bg-green-600 animate-pulse"
                        : "bg-gray-300"
                  }`}
                ></div>
                <span>{step.text}</span>
                {index < currentStep && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview with Characters */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-green-100">
            <div className="w-8 h-8 mx-auto mb-2">
              <Image
                src="/characters/brain-character.png"
                alt="Brain Character"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-600">Tarjetas</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100">
            <div className="w-8 h-8 mx-auto mb-2">
              <Image
                src="/characters/broccoli-character.png"
                alt="Broccoli Character"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-600">Cuestionarios</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-orange-100">
            <div className="w-8 h-8 mx-auto mb-2">
              <Image
                src="/characters/onion-character.png"
                alt="Onion Character"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-600">Actividades</p>
          </div>
        </div>
      </div>
    </div>
  )
}
