import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react"

type Trend = "up" | "down" | "neutral"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  trend?: Trend
  icon: React.ElementType
}

export function MetricCard({ title, value, change, trend = "neutral", icon: Icon }: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : ArrowRight
  const trendColor =
    trend === "up" ? "text-teacher-secondary" : trend === "down" ? "text-teacher-danger" : "text-muted-foreground"

  return (
    <Card className="bg-teacher-card border-teacher-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-teacher-foreground/80">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-teacher-foreground">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center">
            <span className={`flex items-center ${trendColor}`}>
              <TrendIcon className="h-3 w-3 mr-1" />
              {change}
            </span>
            <span className="ml-1">from last week</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
