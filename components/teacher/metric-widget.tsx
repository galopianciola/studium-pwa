import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
    direction: "up" | "down" | "neutral"
  }
  status?: "success" | "warning" | "danger" | "neutral"
  icon?: React.ReactNode
  alert?: boolean
  className?: string
}

export function MetricWidget({
  title,
  value,
  subtitle,
  trend,
  status = "neutral",
  icon,
  alert = false,
  className,
}: MetricWidgetProps) {
  const statusColors = {
    success: "text-green-600 bg-green-50 border-green-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    danger: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-gray-600 bg-white border-gray-200",
  }

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  }

  const TrendIcon = trend?.direction === "up" ? TrendingUp : trend?.direction === "down" ? TrendingDown : Minus

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md",
        statusColors[status],
        alert && "ring-2 ring-red-500 ring-opacity-50",
        className,
      )}
    >
      {alert && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white rounded-full p-1">
            <AlertTriangle className="h-3 w-3" />
          </div>
        </div>
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className={cn("flex items-center text-sm", trendColors[trend.direction])}>
              <TrendIcon className="h-4 w-4 mr-1" />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}

        {trend && <p className="text-xs text-gray-500 mt-1">{trend.label}</p>}
      </CardContent>
    </Card>
  )
}
