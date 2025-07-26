"use client"

import React from 'react'
import { type TimelineData } from '@/lib/api'

interface StudyChartProps {
  timeline: TimelineData
  className?: string
}

export function StudyChart({ timeline, className = '' }: StudyChartProps) {
  const { weekly_breakdown } = timeline

  if (!weekly_breakdown || weekly_breakdown.length === 0) {
    return null
  }

  const maxHours = Math.max(...weekly_breakdown.map(week => week.total_hours))
  const maxTopics = Math.max(...weekly_breakdown.map(week => week.topics_count))

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hours Chart */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Horas de Estudio por Semana</h4>
        <div className="space-y-3">
          {weekly_breakdown.map((week, index) => {
            const percentage = maxHours > 0 ? (week.total_hours / maxHours) * 100 : 0
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600 font-medium">
                  Sem {week.week}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {week.total_hours}h
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-xs text-gray-500 text-right">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Topics Chart */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Temas por Semana</h4>
        <div className="space-y-3">
          {weekly_breakdown.map((week, index) => {
            const percentage = maxTopics > 0 ? (week.topics_count / maxTopics) * 100 : 0
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600 font-medium">
                  Sem {week.week}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {week.topics_count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-xs text-gray-500 text-right">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Combined Efficiency Chart */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Eficiencia de Estudio (Temas por Hora)</h4>
        <div className="space-y-3">
          {weekly_breakdown.map((week, index) => {
            const efficiency = week.total_hours > 0 ? week.topics_count / week.total_hours : 0
            const maxEfficiency = Math.max(...weekly_breakdown.map(w => w.total_hours > 0 ? w.topics_count / w.total_hours : 0))
            const percentage = maxEfficiency > 0 ? (efficiency / maxEfficiency) * 100 : 0
            
            let efficiencyColor = 'from-red-400 to-red-600'
            if (efficiency >= 1.5) efficiencyColor = 'from-green-400 to-green-600'
            else if (efficiency >= 1) efficiencyColor = 'from-yellow-400 to-yellow-600'
            else if (efficiency >= 0.5) efficiencyColor = 'from-orange-400 to-orange-600'
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600 font-medium">
                  Sem {week.week}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`bg-gradient-to-r ${efficiencyColor} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {efficiency.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-xs text-gray-500 text-right">
                  t/h
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Eficiencia:</strong> Mayor a 1.5 temas/hora (excelente), 1.0-1.5 (buena), 0.5-1.0 (regular), menor a 0.5 (necesita mejora)
          </p>
        </div>
      </div>

      {/* Study Intensity Timeline */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Línea de Tiempo de Intensidad</h4>
        <div className="flex items-end space-x-1 h-24">
          {weekly_breakdown.map((week, index) => {
            const intensity = week.total_hours
            const height = maxHours > 0 ? (intensity / maxHours) * 100 : 0
            
            let barColor = 'bg-blue-400'
            if (intensity >= 20) barColor = 'bg-red-500'
            else if (intensity >= 15) barColor = 'bg-orange-500'
            else if (intensity >= 10) barColor = 'bg-yellow-500'
            else if (intensity >= 5) barColor = 'bg-green-500'
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`${barColor} rounded-t-sm transition-all duration-500 w-full min-h-[8px] flex items-end justify-center pb-1`}
                  style={{ height: `${Math.max(height, 8)}%` }}
                >
                  <span className="text-xs text-white font-bold">
                    {week.total_hours}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  S{week.week}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-gray-600">Baja (&lt;5h)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Media (5-10h)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Alta (10-15h)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-600">Muy Alta (15-20h)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Extrema (20h+)</span>
          </div>
        </div>
      </div>
    </div>
  )
}