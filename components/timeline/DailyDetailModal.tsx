"use client"

import React from 'react'
import { X, Clock, BookOpen, Target, Calendar } from 'lucide-react'
import { type TimelineData } from '@/lib/api'

interface DailyDetailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string
  timeline: TimelineData
}

export function DailyDetailModal({ isOpen, onClose, selectedDate, timeline }: DailyDetailModalProps) {
  if (!isOpen || !selectedDate) return null

  // Find the daily plan for the selected date
  let dailyPlan: any = null
  let weekData: any = null
  let dayIndex = -1

  // Search through weekly breakdown to find the day
  for (const week of timeline.weekly_breakdown) {
    const dayIdx = week.days.findIndex((day: any) => day.date === selectedDate)
    if (dayIdx !== -1) {
      dailyPlan = week.days[dayIdx]
      weekData = week
      dayIndex = dayIdx
      break
    }
  }

  // Find milestones for this date
  const milestones = timeline.milestones.filter(m => m.date === selectedDate)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Detalle del Día
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(selectedDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Daily Study Plan */}
          {dailyPlan ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Plan de Estudio</h4>
              </div>

              {/* Study stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">
                        {dailyPlan.hours}h
                      </div>
                      <div className="text-xs text-blue-600">Tiempo de estudio</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-800">
                        {dailyPlan.topics_count}
                      </div>
                      <div className="text-xs text-green-600">Temas a estudiar</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly context */}
              {weekData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Contexto de la Semana {weekData.week}
                  </h5>
                  <div className="text-xs text-gray-600">
                    Total semanal: {weekData.total_hours}h • {weekData.topics_count} temas • Día {dayIndex + 1} de {weekData.days.length}
                  </div>
                  
                  {/* Week progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso semanal</span>
                      <span>{Math.round(((dayIndex + 1) / weekData.days.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((dayIndex + 1) / weekData.days.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No hay plan de estudio específico para este día</p>
            </div>
          )}

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Hitos Importantes</h4>
              </div>

              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border-2 ${
                      milestone.completed 
                        ? 'bg-green-50 border-green-200' 
                        : milestone.type === 'exam' 
                          ? 'bg-red-50 border-red-200'
                          : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className={`font-semibold ${
                          milestone.completed 
                            ? 'text-green-800' 
                            : milestone.type === 'exam' 
                              ? 'text-red-800'
                              : 'text-purple-800'
                        }`}>
                          {milestone.title}
                        </h5>
                        <p className={`text-sm mt-1 ${
                          milestone.completed 
                            ? 'text-green-600' 
                            : milestone.type === 'exam' 
                              ? 'text-red-600'
                              : 'text-purple-600'
                        }`}>
                          {milestone.description}
                        </p>
                      </div>
                      
                      {milestone.completed && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Completado
                        </span>
                      )}
                    </div>

                    {/* Study Focus */}
                    {milestone.study_focus && (
                      <div className="mt-3 p-2 bg-white bg-opacity-70 rounded-lg">
                        <div className="text-xs font-medium text-gray-700 mb-1">📚 Enfoque:</div>
                        <p className="text-xs text-gray-600">{milestone.study_focus}</p>
                      </div>
                    )}

                    {/* Study Activities */}
                    {milestone.study_activities && milestone.study_activities.length > 0 && (
                      <div className="mt-3 p-2 bg-white bg-opacity-70 rounded-lg">
                        <div className="text-xs font-medium text-gray-700 mb-1">✅ Actividades:</div>
                        <ul className="space-y-1">
                          {milestone.study_activities.slice(0, 3).map((activity, actIndex) => (
                            <li key={actIndex} className="text-xs text-gray-600 flex items-start">
                              <span className="text-gray-500 mr-1">•</span>
                              {activity}
                            </li>
                          ))}
                          {milestone.study_activities.length > 3 && (
                            <li className="text-xs text-gray-500 italic">
                              +{milestone.study_activities.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {milestone.topics.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-gray-500 mb-2">📖 Temas relacionados:</div>
                        <div className="flex flex-wrap gap-1">
                          {milestone.topics.map((topic, topicIndex) => (
                            <span 
                              key={topicIndex}
                              className="px-2 py-1 bg-white bg-opacity-70 text-gray-700 rounded-md text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {milestone.completion_target > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-600">
                          Meta de progreso: {milestone.completion_target}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips for the day */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h5 className="font-medium text-blue-800 mb-2">💡 Consejo del día</h5>
            <p className="text-sm text-blue-700">
              {dailyPlan && dailyPlan.hours >= 3 
                ? "Es un día intenso de estudio. Toma descansos de 15 minutos cada hora y mantente hidratado."
                : milestones.length > 0 
                  ? "Tienes hitos importantes hoy. Concéntrate en completar las tareas programadas."
                  : "Mantén un ritmo constante y revisa lo aprendido antes de continuar con nuevos temas."
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}