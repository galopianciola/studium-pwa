"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, BookOpen, Target, TrendingUp, Download, Share2, AlertTriangle, CheckCircle } from "lucide-react"
import { api, type StudyPlanResponse, type DailyStudyPlan, type StudyTopic } from "@/lib/api"

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
          {studyPlan.study_statistics && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Estadísticas del Plan</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {studyPlan.study_statistics.total_topics}
                  </div>
                  <div className="text-sm text-green-700">Temas Totales</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {studyPlan.study_statistics.estimated_hours}h
                  </div>
                  <div className="text-sm text-blue-700">Horas Estimadas</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">
                    {studyPlan.study_statistics.difficulty_distribution.medium}
                  </div>
                  <div className="text-sm text-orange-700">Temas Medios</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">
                    {studyPlan.study_statistics.difficulty_distribution.hard}
                  </div>
                  <div className="text-sm text-red-700">Temas Difíciles</div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Progress */}
          {studyPlan.timeline_data && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Progreso del Cronograma</h3>
              
              <div className="space-y-3">
                {studyPlan.timeline_data.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{milestone.title}</span>
                        <span className="text-sm text-gray-600">{formatDate(milestone.date)}</span>
                      </div>
                      <Progress value={milestone.completion_percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(topic.difficulty)}`}>
                        {getDifficultyIcon(topic.difficulty)}
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

          {/* Daily Study Plans */}
          {studyPlan.daily_plan && studyPlan.daily_plan.length > 0 && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Plan Diario</h3>
              
              <div className="space-y-4">
                {studyPlan.daily_plan.map((dailyPlan: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">
                        Día {dailyPlan.day} - {formatDate(dailyPlan.date)}
                      </h4>
                      <span className="text-sm text-gray-600">
                        {dailyPlan.estimated_hours}h de estudio
                      </span>
                    </div>
                    
                    {dailyPlan.actions && dailyPlan.actions.length > 0 && (
                      <div className="space-y-2">
                        {dailyPlan.actions.map((action: string, actIndex: number) => (
                          <div key={actIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-gray-800">{action}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {dailyPlan.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Notas:</span>
                        <p className="text-sm text-blue-800 mt-1">{dailyPlan.notes}</p>
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
          <div className="flex flex-col gap-3">
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
              className="w-full bg-[#257e52] hover:bg-[#1f6b44] text-white py-4 text-lg font-semibold"
              size="lg"
            >
              🚀 Comenzar a Estudiar Ahora
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.push('/student/learn/plan')}
                variant="outline"
                className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50"
              >
                Crear Nuevo Plan
              </Button>
              <Button 
                onClick={() => router.push('/student/dashboard')}
                variant="outline"
                className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50"
              >
                Ir al Dashboard
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