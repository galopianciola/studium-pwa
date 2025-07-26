"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, Target, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AIInsight } from "@/lib/teacher-data"

interface InsightPanelProps {
  insights: AIInsight[]
  onTakeAction?: (insightId: string) => void
  className?: string
}

export function InsightPanel({ insights, onTakeAction, className }: InsightPanelProps) {
  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "recommendation":
        return Lightbulb
      case "observation":
        return TrendingUp
      case "prediction":
        return Target
      default:
        return AlertCircle
    }
  }

  const getInsightColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "recommendation":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-500",
          badge: "bg-blue-100 text-blue-800",
        }
      case "observation":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-500",
          badge: "bg-green-100 text-green-800",
        }
      case "prediction":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "text-purple-500",
          badge: "bg-purple-100 text-purple-800",
        }
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "text-gray-500",
          badge: "bg-gray-100 text-gray-800",
        }
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600 bg-green-100"
    if (confidence >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    return `Hace ${Math.floor(diffInHours / 24)} días`
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Insights de IA</h3>
        <Badge variant="outline" className="text-xs">
          {insights.length} insights
        </Badge>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type)
          const colors = getInsightColor(insight.type)

          return (
            <Card
              key={insight.id}
              className={cn("transition-all duration-200 hover:shadow-md", colors.bg, colors.border)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-full", colors.bg)}>
                      <Icon className={cn("h-4 w-4", colors.icon)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
                        <Badge variant="secondary" className={cn("text-xs", colors.badge)}>
                          {insight.type === "recommendation"
                            ? "Recomendación"
                            : insight.type === "observation"
                              ? "Observación"
                              : "Predicción"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatTimestamp(insight.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className={cn("text-xs", getConfidenceColor(insight.confidence))}>
                    {insight.confidence}% confianza
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 mb-4">{insight.description}</p>

                {(insight.relatedStudents || insight.relatedTopics) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {insight.relatedStudents && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Estudiantes:</span>
                        <Badge variant="outline" className="text-xs">
                          {insight.relatedStudents.length}
                        </Badge>
                      </div>
                    )}
                    {insight.relatedTopics && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Temas:</span>
                        {insight.relatedTopics.slice(0, 2).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {insight.relatedTopics.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{insight.relatedTopics.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {insight.actionable && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Acción recomendada</span>
                    </div>

                    {onTakeAction && (
                      <Button size="sm" onClick={() => onTakeAction(insight.id)} className="text-xs">
                        Tomar acción
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
