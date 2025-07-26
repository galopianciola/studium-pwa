"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen } from "lucide-react"

export default function WelcomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (role: string) => {
    if (role === "student") {
      setSelectedRole(role)
      router.push("/student/learn")
    } else if (role === "teacher") {
      // Shake animation for disabled teacher role
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col studium-bg">
      {/* Header */}
      <header className="safe-area-top px-4 py-6">
        <div className="flex items-center justify-center">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="text-center max-w-md mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">¿Cómo quieres usar Studium?</h2>
            <p className="text-base text-gray-600">Selecciona tu rol para comenzar tu experiencia de aprendizaje</p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4">
            {/* Student Card */}
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-pink-300"
              onClick={() => handleRoleSelect("student")}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/characters/brain-character.png"
                      alt="Student Brain"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">Estudiante</CardTitle>
                <CardDescription className="text-center">Aprende con actividades personalizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Comenzar a estudiar
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Card (Disabled) */}
            <Card
              className={`cursor-pointer transition-all duration-200 opacity-60 border-2 border-gray-200 ${
                isShaking ? "animate-pulse" : ""
              }`}
              onClick={() => handleRoleSelect("teacher")}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4 relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="relative">
                      <Image
                        src="/characters/brain-character.png"
                        alt="Teacher Brain"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain grayscale"
                      />
                      <div className="absolute -top-1 -right-1">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs">
                    Próximamente
                  </Badge>
                </div>
                <CardTitle className="text-xl text-center text-gray-500">Docente</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Próximamente - Panel de profesor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  disabled
                  className="w-full bg-gray-400 text-gray-600 font-semibold py-3 rounded-xl cursor-not-allowed"
                  size="lg"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="safe-area-bottom px-4 py-4 text-center">
        <p className="text-xs text-gray-500">v1.0.0 • Términos y condiciones • Privacidad</p>
      </footer>
    </div>
  )
}
