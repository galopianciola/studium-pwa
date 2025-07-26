"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, AlertCircle, Clock, User, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Alert } from "@/lib/teacher-data"

interface AlertCardProps {
  alert: Alert
  onMarkAsRead?: (alertId: string) => void
  onTakeAction?: (alertId: string) => void
  className?: string
}

export function AlertCard({ alert, onMarkAsRead, onTakeAction, className }: AlertCardProps) {
  const alertConfig = {
    danger: {
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
      badgeColor: "bg-red-100 text-red-800",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-500",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      badgeColor: "bg-blue-100 text-blue-800",
    },
  }

  const config = alertConfig[alert.type]
  const Icon = config.icon

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-gray-400",
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
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        config.bgColor,
        config.borderColor,
        !alert.isRead && "ring-2 ring-opacity-50",
        !alert.isRead && alert.type === "danger" && "ring-red-300",
        !alert.isRead && alert.type === "warning" && "ring-yellow-300",
        !alert.isRead && alert.type === "info" && "ring-blue-300",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full", config.bgColor)}>
              <Icon className={cn("h-4 w-4", config.iconColor)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-sm">{alert.title}</h3>
                <div className={cn("w-2 h-2 rounded-full", priorityColors[alert.priority])} />
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
              </div>
            </div>
          </div>

          {!alert.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4">{alert.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {alert.studentId && (
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                Estudiante
              </Badge>
            )}
            {alert.courseId && (
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Curso
              </Badge>
            )}
          </div>

          <div className="flex space-x-2">
            {!alert.isRead && onMarkAsRead && (
              <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(alert.id)} className="text-xs">
                Marcar leído
              </Button>
            )}
            {onTakeAction && (
              <Button size="sm" onClick={() => onTakeAction(alert.id)} className="text-xs">
                Ver detalles
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
