"use client"

import React, { useState } from 'react'
import { Calendar, Clock, Target, Trophy, AlertTriangle, CheckCircle2, Flag, Check } from 'lucide-react'
import { type TimelineData } from '@/lib/api'
import { WeeklyView } from './WeeklyView'
import { DailyDetailModal } from './DailyDetailModal'
import { api } from '@/lib/api'

interface StudyTimelineProps {
  timeline: TimelineData
  planId?: string
  className?: string
  onMilestoneUpdate?: (milestone: any) => void
}

const getMilestoneIcon = (type: string) => {
  switch (type) {
    case 'exam':
      return <Trophy className="w-5 h-5" />
    case 'review':
      return <Target className="w-5 h-5" />
    case 'checkpoint':
      return <CheckCircle2 className="w-5 h-5" />
    default:
      return <Flag className="w-5 h-5" />
  }
}

const getMilestoneColor = (type: string) => {
  switch (type) {
    case 'exam':
      return 'bg-red-500 text-white border-red-500'
    case 'review':
      return 'bg-blue-500 text-white border-blue-500'
    case 'checkpoint':
      return 'bg-green-500 text-white border-green-500'
    default:
      return 'bg-gray-500 text-white border-gray-500'
  }
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const getDaysFromToday = (dateString: string) => {
  const today = new Date()
  const targetDate = new Date(dateString)
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function StudyTimeline({ timeline, planId, className = '', onMilestoneUpdate }: StudyTimelineProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'weekly'>('timeline')
  const [loadingMilestones, setLoadingMilestones] = useState<Set<string>>(new Set())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  const sortedMilestones = [...timeline.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const handleMilestoneToggle = async (milestone: any) => {
    if (!planId) return
    
    setLoadingMilestones(prev => new Set([...prev, milestone.date]))
    
    try {
      if (milestone.completed) {
        await api.uncompleteMilestone(planId, milestone.date)
        milestone.completed = false
        delete milestone.completed_at
      } else {
        const response = await api.completeMilestone(planId, milestone.date)
        milestone.completed = true
        milestone.completed_at = response.completed_at
      }
      
      onMilestoneUpdate?.(milestone)
    } catch (error) {
      console.error('Error toggling milestone:', error)
    } finally {
      setLoadingMilestones(prev => {
        const newSet = new Set(prev)
        newSet.delete(milestone.date)
        return newSet
      })
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Cronograma</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'weekly'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Vista Semanal</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'weekly' ? (
        <WeeklyView 
          timeline={timeline} 
          onDateClick={(date) => setSelectedDate(date)}
        />
      ) : (
        <div className="space-y-6">
      {/* Exam Countdown Header */}
      <div className={`p-4 rounded-xl border-2 ${getUrgencyColor(timeline.exam_countdown.urgency_level)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/50 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Cronograma de Estudio</h3>
              <p className="text-sm opacity-90">{timeline.exam_countdown.countdown_message}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{timeline.exam_countdown.days_left}</div>
            <div className="text-sm opacity-75">días restantes</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-red-500"></div>
        
        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => {
            const daysFromToday = getDaysFromToday(milestone.date)
            const isPassed = daysFromToday < 0
            const isToday = daysFromToday === 0
            
            const isLoading = loadingMilestones.has(milestone.date)
            const isCompleted = milestone.completed || false
            
            return (
              <div key={index} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 flex items-center justify-center z-10 ${
                  isCompleted ? 'bg-green-500 text-white border-green-500' : getMilestoneColor(milestone.type)
                } ${isPassed && !isCompleted ? 'opacity-60' : ''}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : getMilestoneIcon(milestone.type)}
                </div>
                
                {/* Content */}
                <div className={`flex-1 bg-white rounded-xl p-4 shadow-sm border-2 ${
                  isCompleted ? 'border-green-300 bg-green-50' :
                  isPassed ? 'opacity-60 border-gray-200' : 
                  isToday ? 'border-yellow-400 bg-yellow-50' : 
                  'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Completado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      {isCompleted && milestone.completed_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Completado el {new Date(milestone.completed_at).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end space-y-2">
                      <div>
                        <button
                          onClick={() => setSelectedDate(milestone.date)}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {formatDate(milestone.date)}
                        </button>
                        <div className="text-xs text-gray-500">
                          {isPassed ? `Hace ${Math.abs(daysFromToday)} días` : 
                           isToday ? 'Hoy' : 
                           `En ${daysFromToday} días`}
                        </div>
                      </div>
                      
                      {/* Completion toggle button */}
                      {planId && milestone.type !== 'exam' && (
                        <button
                          onClick={() => handleMilestoneToggle(milestone)}
                          disabled={isLoading}
                          className={`p-2 rounded-lg transition-colors text-xs font-medium ${
                            isCompleted
                              ? 'bg-green-100 hover:bg-green-200 text-green-800'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                              <span>...</span>
                            </div>
                          ) : isCompleted ? (
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Marcar pendiente</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Marcar como completado</span>
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Study Focus */}
                  {milestone.study_focus && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs font-semibold text-blue-800 mb-1">📚 Enfoque de Estudio</div>
                      <p className="text-sm text-blue-700">{milestone.study_focus}</p>
                    </div>
                  )}

                  {/* Study Activities */}
                  {milestone.study_activities && milestone.study_activities.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xs font-semibold text-green-800 mb-2">✅ Actividades Recomendadas</div>
                      <ul className="space-y-1">
                        {milestone.study_activities.map((activity, actIndex) => (
                          <li key={actIndex} className="text-sm text-green-700 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Objectives */}
                  {milestone.learning_objectives && milestone.learning_objectives.length > 0 && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-xs font-semibold text-purple-800 mb-2">🎯 Objetivos de Aprendizaje</div>
                      <ul className="space-y-1">
                        {milestone.learning_objectives.map((objective, objIndex) => (
                          <li key={objIndex} className="text-sm text-purple-700 flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Topics */}
                  {milestone.topics.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-gray-500 mb-2">📖 Temas a Revisar:</div>
                      <div className="flex flex-wrap gap-1">
                        {milestone.topics.map((topic, topicIndex) => (
                          <span 
                            key={topicIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs border"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Progress target */}
                  {milestone.completion_target > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        Meta: {milestone.completion_target}% de progreso
                      </span>
                    </div>
                  )}
                  
                  {/* Special styling for today */}
                  {isToday && (
                    <div className="mt-3 flex items-center space-x-2 text-yellow-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">¡Es hoy! Revisa tu plan de estudio</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Study Intensity Indicator */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Intensidad de Estudio</h4>
              <p className="text-sm text-gray-600">Nivel de dedicación recomendado</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeline.study_intensity === 'alta' ? 'bg-red-100 text-red-800' :
              timeline.study_intensity === 'media' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              Intensidad {timeline.study_intensity}
            </span>
          </div>
        </div>
        </div>
      </div>
      )}

      {/* Daily Detail Modal */}
      <DailyDetailModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        selectedDate={selectedDate || ''}
        timeline={timeline}
      />
    </div>
  )
}