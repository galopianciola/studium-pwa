"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeft } from "lucide-react"

export default function StudyPlanPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<number | null>(1)
  const [currentMonth, setCurrentMonth] = useState("Agosto 2025")
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("Ej: Historia")
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const daysOfWeek = ["LUN", "MAR", "MIER", "JUE", "VIER", "SAB", "DOM"]
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  const handleDateSelect = (day: number) => {
    setSelectedDate(day)
  }

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFile("documento.pdf")
  }

  const handleSubjectSelect = () => {
    // This would open a subject selection modal/dropdown
    setSelectedSubject("Historia")
  }

  const handleStart = () => {
    router.push("/upload")
  }

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

          {/* Upload Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Subí tus Resúmenes</h3>
            <Button
              onClick={handleFileUpload}
              className="w-full bg-green-200 hover:bg-green-300 text-gray-800 font-medium py-4 rounded-2xl transition-all duration-200 text-base flex items-center justify-center space-x-3"
            >
              <Image src="/icons/upload-icon.png" alt="Upload" width={20} height={20} className="w-5 h-5" />
              <span>Cargar archivo</span>
            </Button>
          </div>

          {/* Subject Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Materia a Preparar</h3>
            <Button
              onClick={handleSubjectSelect}
              className="w-full bg-orange-200 hover:bg-orange-300 text-gray-800 font-medium py-4 rounded-2xl transition-all duration-200 text-base flex items-center justify-center space-x-3"
            >
              <Image src="/icons/book-icon.png" alt="Subject" width={20} height={20} className="w-5 h-5" />
              <span>{selectedSubject}</span>
            </Button>
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
                <Image src="/icons/calendar-icon.png" alt="Calendar" width={20} height={20} className="w-5 h-5" />
                <span>Elegí una fecha</span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </Button>

            {/* Calendar Widget */}
            <div className="bg-yellow-100 rounded-2xl p-4 space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => {}} className="p-1 hover:bg-yellow-200 rounded-lg">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium text-gray-800">{currentMonth}</span>
                <Button variant="ghost" size="sm" onClick={() => {}} className="p-1 hover:bg-yellow-200 rounded-lg">
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
                {daysInMonth.map((day) => (
                  <Button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      w-10 h-10 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        selectedDate === day
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-transparent text-gray-800 hover:bg-yellow-200"
                      }
                    `}
                    variant="ghost"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-8">
            <Button
              onClick={handleStart}
              className="w-full bg-[#257e52] hover:bg-[#1f6b44] text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg"
              size="lg"
            >
              Comenzar
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
