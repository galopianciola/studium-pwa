"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, ImageIcon, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, ApiError } from "@/lib/api"

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setSelectedFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleProcess = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      const response = await api.uploadDocument(selectedFile)
      
      // Store document info in sessionStorage for processing page
      sessionStorage.setItem(
        "documentInfo",
        JSON.stringify({
          document_id: response.document_id,
          filename: response.filename,
          file_size: response.file_size,
          file_type: response.file_type,
          status: response.status
        })
      )
      
      router.push("/processing")
    } catch (err) {
      console.error('Upload error:', err)
      if (err instanceof ApiError) {
        setError(`Error al subir archivo: ${err.message}`)
      } else {
        setError('Error al subir archivo. Por favor intenta de nuevo.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="min-h-screen flex flex-col studium-bg">
      {/* Header */}
      <header className="safe-area-top px-4 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 ml-4">Subir Documento</h1>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* Broccoli Character Helper */}
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-3 character-bounce">
            <Image
              src="/characters/broccoli-character.png"
              alt="Broccoli Character Helper"
              width={80}
              height={80}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-sm text-gray-600">¡Sube tu documento y empecemos a estudiar!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm rounded-xl p-4 border border-red-200">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-4">
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 bg-white/60 backdrop-blur-sm
              ${
                isDragOver
                  ? "border-green-500 bg-green-50/80"
                  : selectedFile
                    ? "border-green-500 bg-green-50/80"
                    : "border-gray-300"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
              disabled={isUploading}
            />

            {!selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto">
                  <Image
                    src="/characters/avocado-character.png"
                    alt="Upload Helper"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Arrastra tu documento aquí</h3>
                  <p className="text-gray-600 mb-4">o toca para buscar archivos</p>
                  <Button className="touch-target studium-green hover:studium-green-light text-white">
                    Elegir Archivo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  {selectedFile.type === "application/pdf" ? (
                    <FileText className="w-8 h-8 text-green-600" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Archivo Seleccionado</h3>
                  <p className="text-gray-600 text-sm">{selectedFile.name}</p>
                  <p className="text-gray-500 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="outline" size="sm" onClick={removeFile} className="touch-target bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Quitar
                </Button>
              </div>
            )}
          </div>

          {/* File Support Info */}
          <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Archivos Soportados</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Documentos PDF
              </div>
              <div className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Imágenes (JPG, PNG, WEBP)
              </div>
            </div>
          </div>
        </div>

        {/* Process Button */}
        <div className="safe-area-bottom">
          <Button
            onClick={handleProcess}
            disabled={!selectedFile || isUploading}
            size="lg"
            className="w-full touch-target studium-green hover:studium-green-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              'Procesar Documento'
            )}
          </Button>

          {selectedFile && !isUploading && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Listo para generar actividades de estudio de tu documento
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
