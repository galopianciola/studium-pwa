"use client"

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ProgressChartProps {
  data: any[]
  type: "line" | "bar" | "area"
  title: string
  description?: string
  dataKeys: {
    x: string
    y: string | string[]
  }
  colors?: string[]
  showTrend?: boolean
  className?: string
}

export function ProgressChart({
  data,
  type,
  title,
  description,
  dataKeys,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
  showTrend = true,
  className,
}: ProgressChartProps) {
  const chartConfig = {
    [Array.isArray(dataKeys.y) ? dataKeys.y[0] : dataKeys.y]: {
      label: Array.isArray(dataKeys.y) ? dataKeys.y[0] : dataKeys.y,
      color: colors[0],
    },
    ...(Array.isArray(dataKeys.y) && dataKeys.y.length > 1
      ? {
          [dataKeys.y[1]]: {
            label: dataKeys.y[1],
            color: colors[1],
          },
        }
      : {}),
    ...(Array.isArray(dataKeys.y) && dataKeys.y.length > 2
      ? {
          [dataKeys.y[2]]: {
            label: dataKeys.y[2],
            color: colors[2],
          },
        }
      : {}),
  }

  const calculateTrend = () => {
    if (!showTrend || data.length < 2) return null

    const yKey = Array.isArray(dataKeys.y) ? dataKeys.y[0] : dataKeys.y
    const firstValue = data[0][yKey]
    const lastValue = data[data.length - 1][yKey]
    const change = ((lastValue - firstValue) / firstValue) * 100

    return {
      value: Math.abs(change),
      direction: change >= 0 ? "up" : "down",
      isPositive: change >= 0,
    }
  }

  const trend = calculateTrend()

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys.x} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Array.isArray(dataKeys.y) ? (
              dataKeys.y.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index]}
                  strokeWidth={2}
                  dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={dataKeys.y}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            )}
          </LineChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys.x} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Array.isArray(dataKeys.y) ? (
              dataKeys.y.map((key, index) => <Bar key={key} dataKey={key} fill={colors[index]} />)
            ) : (
              <Bar dataKey={dataKeys.y} fill={colors[0]} />
            )}
          </BarChart>
        )

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys.x} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Array.isArray(dataKeys.y) ? (
              dataKeys.y.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index]}
                  fill={colors[index]}
                  fillOpacity={0.6}
                />
              ))
            ) : (
              <Area type="monotone" dataKey={dataKeys.y} stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
            )}
          </AreaChart>
        )

      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {trend && (
            <Badge variant={trend.isPositive ? "default" : "destructive"} className="flex items-center space-x-1">
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{trend.value.toFixed(1)}%</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Specialized chart components
export function StudentPerformanceChart({
  studentData,
  className,
}: {
  studentData: any[]
  className?: string
}) {
  return (
    <ProgressChart
      data={studentData}
      type="line"
      title="Rendimiento del Estudiante"
      description="Evolución del puntaje promedio en el tiempo"
      dataKeys={{ x: "date", y: "score" }}
      colors={["#34C759"]}
      className={className}
    />
  )
}

export function ClassEngagementChart({
  engagementData,
  className,
}: {
  engagementData: any[]
  className?: string
}) {
  return (
    <ProgressChart
      data={engagementData}
      type="area"
      title="Participación de la Clase"
      description="Estudiantes activos y tiempo promedio de sesión"
      dataKeys={{ x: "date", y: ["activeStudents", "avgSessionTime"] }}
      colors={["#007AFF", "#FF9500"]}
      className={className}
    />
  )
}

export function TopicMasteryChart({
  topicData,
  className,
}: {
  topicData: any[]
  className?: string
}) {
  return (
    <ProgressChart
      data={topicData}
      type="bar"
      title="Dominio por Tema"
      description="Puntaje promedio por tema de estudio"
      dataKeys={{ x: "topic", y: "averageScore" }}
      colors={["#FF6B9D"]}
      showTrend={false}
      className={className}
    />
  )
}
