import { TeacherHeader } from "@/components/teacher/header"
import { MetricWidget } from "@/components/teacher/metric-widget"
import {
  ProgressChart,
  ClassEngagementChart,
  TopicMasteryChart,
  StudentPerformanceChart,
} from "@/components/teacher/progress-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, Users, Clock, Target } from "lucide-react"
import { mockEngagementData, mockPerformanceByTopic, mockStudents } from "@/lib/teacher-data"

export default function AnalyticsPage() {
  const totalActivities = 1247
  const averageSessionTime = 45
  const completionRate = 78
  const improvementRate = 12.5

  // Generate heatmap data
  const generateHeatmapData = () => {
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return days.map((day) => ({
      day,
      hours: hours.map((hour) => ({
        hour,
        activity: Math.floor(Math.random() * 100),
      })),
    }))
  }

  const heatmapData = generateHeatmapData()

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader
        breadcrumbs={[{ label: "Analíticas" }]}
        actions={
          <div className="flex space-x-2">
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="1y">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Key Analytics Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricWidget
            title="Actividades Completadas"
            value={totalActivities.toLocaleString()}
            subtitle="En los últimos 30 días"
            icon={<Target className="h-4 w-4" />}
            trend={{
              value: 18.2,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Tiempo Promedio"
            value={`${averageSessionTime}min`}
            subtitle="Por sesión de estudio"
            icon={<Clock className="h-4 w-4" />}
            trend={{
              value: 8.5,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Tasa de Completación"
            value={`${completionRate}%`}
            subtitle="Actividades terminadas"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: 5.2,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Mejora Promedio"
            value={`+${improvementRate}%`}
            subtitle="En puntajes generales"
            icon={<Users className="h-4 w-4" />}
            trend={{
              value: 12.5,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="engagement">Participación</TabsTrigger>
            <TabsTrigger value="topics">Temas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ClassEngagementChart engagementData={mockEngagementData} className="w-full" />

              <TopicMasteryChart topicData={mockPerformanceByTopic} className="w-full" />
            </div>

            {/* Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Calor de Actividad</CardTitle>
                <CardDescription>Patrones de estudio por día y hora</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {heatmapData.map((dayData) => (
                    <div key={dayData.day} className="flex items-center space-x-2">
                      <div className="w-8 text-xs text-gray-500">{dayData.day}</div>
                      <div className="flex space-x-1">
                        {dayData.hours.map((hourData) => (
                          <div
                            key={hourData.hour}
                            className={`w-3 h-3 rounded-sm ${
                              hourData.activity > 80
                                ? "bg-green-500"
                                : hourData.activity > 60
                                  ? "bg-green-400"
                                  : hourData.activity > 40
                                    ? "bg-green-300"
                                    : hourData.activity > 20
                                      ? "bg-green-200"
                                      : "bg-gray-100"
                            }`}
                            title={`${dayData.day} ${hourData.hour}:00 - ${hourData.activity}% actividad`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span>Menos</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm" />
                    <div className="w-3 h-3 bg-green-200 rounded-sm" />
                    <div className="w-3 h-3 bg-green-300 rounded-sm" />
                    <div className="w-3 h-3 bg-green-400 rounded-sm" />
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                  </div>
                  <span>Más</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6">
              <StudentPerformanceChart studentData={mockStudents[0].performanceData} className="w-full" />

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Puntajes</CardTitle>
                  <CardDescription>Distribución de calificaciones en el último mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: "90-100%", count: 8, color: "bg-green-500" },
                      { range: "80-89%", count: 12, color: "bg-blue-500" },
                      { range: "70-79%", count: 7, color: "bg-yellow-500" },
                      { range: "60-69%", count: 3, color: "bg-orange-500" },
                      { range: "0-59%", count: 2, color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.range} className="flex items-center space-x-4">
                        <div className="w-16 text-sm">{item.range}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                          <div
                            className={`${item.color} h-4 rounded-full`}
                            style={{ width: `${(item.count / 32) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-sm text-gray-600">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Participación Diaria</CardTitle>
                  <CardDescription>Estudiantes activos por día</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressChart
                    data={mockEngagementData}
                    type="line"
                    title=""
                    dataKeys={{ x: "date", y: "activeStudents" }}
                    colors={["#007AFF"]}
                    showTrend={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de Sesión</CardTitle>
                  <CardDescription>Duración promedio por sesión</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressChart
                    data={mockEngagementData}
                    type="bar"
                    title=""
                    dataKeys={{ x: "date", y: "avgSessionTime" }}
                    colors={["#34C759"]}
                    showTrend={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <TopicMasteryChart topicData={mockPerformanceByTopic} className="w-full" />

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Temas Más Difíciles</CardTitle>
                  <CardDescription>Basado en puntajes promedio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPerformanceByTopic
                      .sort((a, b) => a.averageScore - b.averageScore)
                      .slice(0, 5)
                      .map((topic, index) => (
                        <div key={topic.topic} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm">{topic.topic}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                topic.difficulty === "hard"
                                  ? "destructive"
                                  : topic.difficulty === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {topic.difficulty === "hard"
                                ? "Difícil"
                                : topic.difficulty === "medium"
                                  ? "Medio"
                                  : "Fácil"}
                            </Badge>
                            <span className="text-sm font-medium">{topic.averageScore}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temas Mejor Dominados</CardTitle>
                  <CardDescription>Basado en puntajes promedio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPerformanceByTopic
                      .sort((a, b) => b.averageScore - a.averageScore)
                      .slice(0, 5)
                      .map((topic, index) => (
                        <div key={topic.topic} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm">{topic.topic}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                topic.difficulty === "hard"
                                  ? "destructive"
                                  : topic.difficulty === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {topic.difficulty === "hard"
                                ? "Difícil"
                                : topic.difficulty === "medium"
                                  ? "Medio"
                                  : "Fácil"}
                            </Badge>
                            <span className="text-sm font-medium">{topic.averageScore}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
