import { TeacherHeader } from "@/components/teacher/header"
import { MetricWidget } from "@/components/teacher/metric-widget"
import { AlertCard } from "@/components/teacher/alert-card"
import { RankingTable } from "@/components/teacher/ranking-table"
import { ClassEngagementChart, TopicMasteryChart } from "@/components/teacher/progress-chart"
import { InsightPanel } from "@/components/teacher/insight-panel"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, TrendingUp, AlertTriangle } from "lucide-react"
import {
  mockStudents,
  mockAlerts,
  mockAIInsights,
  mockEngagementData,
  mockPerformanceByTopic,
} from "@/lib/teacher-data"

export default function TeacherDashboardPage() {
  const totalStudents = mockStudents.length
  const activeStudents = mockStudents.filter((s) => s.status === "active").length
  const atRiskStudents = mockStudents.filter((s) => s.status === "at-risk").length
  const averageScore = Math.round(mockStudents.reduce((acc, s) => acc + s.averageScore, 0) / totalStudents)
  const overallProgress = Math.round(mockStudents.reduce((acc, s) => acc + s.overallProgress, 0) / totalStudents)

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader
        breadcrumbs={[{ label: "Panel Principal" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva actividad
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricWidget
            title="Total Estudiantes"
            value={totalStudents}
            subtitle="En todos los cursos"
            icon={<Users className="h-4 w-4" />}
            trend={{
              value: 8.2,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Estudiantes Activos"
            value={activeStudents}
            subtitle={`${Math.round((activeStudents / totalStudents) * 100)}% del total`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: 12.5,
              label: "vs semana anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Promedio General"
            value={`${averageScore}%`}
            subtitle="Todas las actividades"
            icon={<BookOpen className="h-4 w-4" />}
            trend={{
              value: 3.1,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Estudiantes en Riesgo"
            value={atRiskStudents}
            subtitle="Requieren atención"
            icon={<AlertTriangle className="h-4 w-4" />}
            alert={atRiskStudents > 0}
            status={atRiskStudents > 0 ? "danger" : "success"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Engagement Chart */}
            <ClassEngagementChart engagementData={mockEngagementData} className="w-full" />

            {/* Topic Performance */}
            <TopicMasteryChart topicData={mockPerformanceByTopic} className="w-full" />

            {/* Student Rankings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ranking de Estudiantes</h3>
              <RankingTable students={mockStudents} maxRows={8} showTrends={true} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alertas Recientes</h3>
              <div className="space-y-3">
                {mockAlerts.slice(0, 3).map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onMarkAsRead={(id) => console.log("Mark as read:", id)}
                    onTakeAction={(id) => console.log("Take action:", id)}
                  />
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <InsightPanel insights={mockAIInsights} onTakeAction={(id) => console.log("Take action on insight:", id)} />
          </div>
        </div>
      </div>
    </div>
  )
}
