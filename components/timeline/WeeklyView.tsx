"use client"

import React, { useState } from 'react'
import { Calendar, Clock, BookOpen, Target, BarChart3, List } from 'lucide-react'
import { type TimelineData } from '@/lib/api'
import { StudyChart } from './StudyChart'

interface WeeklyViewProps {
  timeline: TimelineData
  className?: string
  onDateClick?: (date: string) => void
}

const formatWeekDate = (weekDays: any[]) => {
  if (weekDays.length === 0) return ''
  
  const firstDay = new Date(weekDays[0].date)
  const lastDay = new Date(weekDays[weekDays.length - 1].date)
  
  return `${firstDay.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`
}

const getWeekProgress = (totalWeeks: number, currentWeek: number) => {
  const progress = (currentWeek / totalWeeks) * 100
  return Math.min(progress, 100)
}

const getIntensityColor = (hours: number) => {
  if (hours >= 20) return 'bg-red-500'
  if (hours >= 15) return 'bg-orange-500'
  if (hours >= 10) return 'bg-yellow-500'
  if (hours >= 5) return 'bg-green-500'
  return 'bg-blue-500'
}

const getIntensityLabel = (hours: number) => {
  if (hours >= 20) return 'Muy Alta'
  if (hours >= 15) return 'Alta'
  if (hours >= 10) return 'Media'
  if (hours >= 5) return 'Baja'
  return 'Muy Baja'
}

export function WeeklyView({ timeline, className = '', onDateClick }: WeeklyViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list')
  const { weekly_breakdown } = timeline

  if (!weekly_breakdown || weekly_breakdown.length === 0) {
    return (
      <div className={`p-6 text-center text-gray-500 ${className}`}>
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay datos semanales disponibles</p>
      </div>
    )
  }

  const totalHours = weekly_breakdown.reduce((sum, week) => sum + week.total_hours, 0)
  const totalTopics = weekly_breakdown.reduce((sum, week) => sum + week.topics_count, 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Vista Semanal</span>
          </h3>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              {weekly_breakdown.length} semana{weekly_breakdown.length !== 1 ? 's' : ''}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`p-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Total de Estudio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalTopics}</div>
            <div className="text-sm text-gray-600">Temas Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{(totalHours / weekly_breakdown.length).toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Promedio Semanal</div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'chart' ? (
        <StudyChart timeline={timeline} />
      ) : (
        /* Weekly Breakdown */
        <div className="space-y-4">
        {weekly_breakdown.map((week, index) => {
          const progress = getWeekProgress(weekly_breakdown.length, index + 1)
          const intensityColor = getIntensityColor(week.total_hours)
          const intensityLabel = getIntensityLabel(week.total_hours)
          
          return (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Week Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Semana {week.week}
                  </h4>
                  {week.days.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {formatWeekDate(week.days)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${intensityColor}`}>
                      {intensityLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Week Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">
                      {week.total_hours}h
                    </div>
                    <div className="text-xs text-blue-600">Estudio</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      {week.topics_count}
                    </div>
                    <div className="text-xs text-green-600">Temas</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <Target className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-purple-800">
                      {week.days.length}
                    </div>
                    <div className="text-xs text-purple-600">Días</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {(week.total_hours / week.days.length).toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-600">Por día</div>
                  </div>
                </div>
              </div>

              {/* Daily Breakdown */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Distribución diaria:</h5>
                <div className="grid grid-cols-7 gap-1">
                  {week.days.map((day: any, dayIndex: number) => {
                    const dayDate = new Date(day.date)
                    const dayName = dayDate.toLocaleDateString('es-ES', { weekday: 'short' })
                    const isToday = dayDate.toDateString() === new Date().toDateString()
                    
                    return (
                      <button 
                        key={dayIndex}
                        onClick={() => onDateClick?.(day.date)}
                        className={`p-2 rounded-lg text-center transition-colors cursor-pointer ${
                          isToday 
                            ? 'bg-blue-100 border-2 border-blue-400' 
                            : 'bg-gray-50 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-xs font-medium text-gray-700 capitalize">
                          {dayName}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {day.hours}h
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.topics_count} temas
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso del plan</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}
      
      {/* Summary Footer */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          <strong>Resumen:</strong> {weekly_breakdown.length} semanas de estudio con un promedio de{' '}
          <span className="font-semibold text-blue-600">
            {(totalHours / weekly_breakdown.length).toFixed(1)} horas
          </span>{' '}
          por semana
        </p>
      </div>
    </div>
  )
}