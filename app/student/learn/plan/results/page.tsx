"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, BookOpen, Target, TrendingUp, Download, Share2, AlertTriangle, CheckCircle } from "lucide-react"
import { api, type StudyPlanResponse, type DailyStudyPlan, type StudyTopic } from "@/lib/api"
import { StudyTimeline } from "@/components/timeline/StudyTimeline"

function StudyPlanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')
  
  const [studyPlan, setStudyPlan] = useState<StudyPlanResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!planId) {
      setError('Plan ID no encontrado')
      setLoading(false)
      return
    }

    const fetchStudyPlan = async () => {
      try {
        const plan = await api.getStudyPlan(planId)
        setStudyPlan(plan)
      } catch (error: any) {
        console.error('Error fetching study plan:', error)
        setError(error.message || 'Error al cargar el plan de estudio')
      } finally {
        setLoading(false)
      }
    }

    fetchStudyPlan()
  }, [planId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
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

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'hard': return <AlertTriangle className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen studium-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <Image
              src="/characters/brain-character.png"
              alt="Studium Brain"
              width={64}
              height={64}
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
          <p className="text-lg text-gray-600">Cargando tu plan de estudio...</p>
        </div>
      </div>
    )
  }

  if (error || !studyPlan) {
    return (
      <div className="min-h-screen studium-bg flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Error al cargar el plan</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700 text-white">
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const daysUntilExam = getDaysUntilExam(studyPlan.exam_date)

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
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Tu Plan de Estudio
            </h2>
            <div className="bg-blue-100 rounded-2xl p-4">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{studyPlan.subject_name}</h3>
              <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Examen: {formatDate(studyPlan.exam_date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{daysUntilExam} días restantes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Study Statistics */}
          {studyPlan.statistics && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Estadísticas del Plan</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {studyPlan.statistics.total_topics}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Temas Totales</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {studyPlan.statistics.estimated_total_hours.toFixed(1)}h
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Horas Estimadas</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {studyPlan.statistics.daily_average_hours.toFixed(1)}h
                  </div>
                  <div className="text-sm text-purple-700 font-medium">Promedio Diario</div>
                </div>
              </div>
              
              {/* Progress visualization */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución de Temas</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Fácil</span>
                  <span>Medio</span>
                  <span>Difícil</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Timeline */}
          {studyPlan.timeline && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Cronograma de Estudio</span>
              </h3>
              
              <StudyTimeline 
                timeline={studyPlan.timeline} 
                planId={studyPlan.plan_id}
                onMilestoneUpdate={(milestone) => {
                  // Update the local study plan state when milestone is updated
                  setStudyPlan(prev => {
                    if (!prev) return prev
                    const updatedTimeline = { ...prev.timeline }
                    const milestoneIndex = updatedTimeline.milestones.findIndex(m => m.date === milestone.date)
                    if (milestoneIndex >= 0) {
                      updatedTimeline.milestones[milestoneIndex] = milestone
                    }
                    return { ...prev, timeline: updatedTimeline }
                  })
                }}
              />
            </div>
          )}

          {/* Hardest Topics */}
          {studyPlan.hardest_topics && studyPlan.hardest_topics.length > 0 && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Temas más Desafiantes</span>
              </h3>
              
              <div className="grid gap-3">
                {studyPlan.hardest_topics.map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(topic.difficulty as 'easy' | 'medium' | 'hard')}`}>
                        {getDifficultyIcon(topic.difficulty as 'easy' | 'medium' | 'hard')}
                        <span className="ml-1 capitalize">{topic.difficulty}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                    
                    {topic.subtopics && topic.subtopics.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtemas:</span>
                        <div className="flex flex-wrap gap-1">
                          {topic.subtopics.map((subtopic, subIndex) => (
                            <span key={subIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                              {subtopic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {topic.estimated_hours && (
                      <div className="mt-3 flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{topic.estimated_hours} horas estimadas</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Study Recommendations */}
          {studyPlan.general_recommendations && studyPlan.general_recommendations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Recomendaciones</h3>
              
              <div className="space-y-3">
                {studyPlan.general_recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      !
                    </div>
                    <p className="text-yellow-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Main CTA */}
            <div className="relative">
              <Button 
                onClick={() => {
                  // Store the study plan data for the modes page
                  localStorage.setItem('latestStudyPlan', JSON.stringify(studyPlan))
                  // Store the document text separately for activity generation
                  if (studyPlan.document_text) {
                    localStorage.setItem('studyDocumentText', studyPlan.document_text)
                  }
                  router.push('/student/modes')
                }}
                className="w-full bg-gradient-to-r from-[#257e52] to-[#34d399] hover:from-[#1f6b44] hover:to-[#10b981] text-white py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                size="lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🚀</span>
                  <span>Comenzar a Estudiar Ahora</span>
                  <span className="text-2xl">📚</span>
                </div>
              </Button>
              
              {/* Urgency indicator */}
              {studyPlan.timeline?.exam_countdown.urgency_level === 'high' && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  ¡URGENTE!
                </div>
              )}
            </div>
            
            {/* Quick stats */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Tu plan incluye:</div>
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">{studyPlan.statistics?.total_topics} temas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">{studyPlan.statistics?.estimated_total_hours.toFixed(0)}h de estudio</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold">{studyPlan.timeline?.milestones.length} hitos</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.push('/student/learn/plan')}
                variant="outline"
                className="flex-1 py-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors"
              >
                📝 Crear Nuevo Plan
              </Button>
              <Button 
                onClick={() => router.push('/student/dashboard')}
                variant="outline"
                className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                🏠 Ir al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function StudyPlanResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen studium-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <Image
              src="/characters/brain-character.png"
              alt="Studium Brain"
              width={64}
              height={64}
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <StudyPlanContent />
    </Suspense>
  )
}