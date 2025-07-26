import { TeacherHeader } from "@/components/teacher/header"
import { MetricWidget } from "@/components/teacher/metric-widget"
import { RankingTable } from "@/components/teacher/ranking-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Users, TrendingUp, AlertTriangle, MessageSquare, MoreHorizontal } from "lucide-react"
import { mockStudents } from "@/lib/teacher-data"

export default function StudentsPage() {
  const totalStudents = mockStudents.length
  const activeStudents = mockStudents.filter((s) => s.status === "active").length
  const atRiskStudents = mockStudents.filter((s) => s.status === "at-risk").length
  const averageScore = Math.round(mockStudents.reduce((acc, s) => acc + s.averageScore, 0) / totalStudents)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    return `Hace ${Math.floor(diffInHours / 24)} días`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader
        breadcrumbs={[{ label: "Estudiantes" }]}
        actions={
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensaje grupal
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Student Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricWidget
            title="Total Estudiantes"
            value={totalStudents}
            subtitle="En todos los cursos"
            icon={<Users className="h-4 w-4" />}
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
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: 3.1,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="En Riesgo"
            value={atRiskStudents}
            subtitle="Requieren atención"
            icon={<AlertTriangle className="h-4 w-4" />}
            alert={atRiskStudents > 0}
            status={atRiskStudents > 0 ? "danger" : "success"}
          />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar estudiantes..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="at-risk">En riesgo</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              <SelectItem value="penal">Derecho Penal I</SelectItem>
              <SelectItem value="civil">Derecho Civil II</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="cards">Tarjetas</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <RankingTable students={mockStudents} showTrends={true} maxRows={20} />
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{student.name}</CardTitle>
                          <CardDescription className="text-sm">{student.email}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={getStatusColor(student.status)}>
                        {student.status === "active"
                          ? "Activo"
                          : student.status === "inactive"
                            ? "Inactivo"
                            : "En riesgo"}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatLastActive(student.lastActive)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{student.averageScore}%</div>
                        <div className="text-xs text-gray-500">Promedio</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{student.streakDays}</div>
                        <div className="text-xs text-gray-500">Días racha</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso general</span>
                        <span className="font-medium">{student.overallProgress}%</span>
                      </div>
                      <Progress value={student.overallProgress} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Fortalezas</div>
                      <div className="flex flex-wrap gap-1">
                        {student.strongAreas.slice(0, 2).map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {student.weakAreas.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-red-600">Áreas de mejora</div>
                        <div className="flex flex-wrap gap-1">
                          {student.weakAreas.slice(0, 2).map((area, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Ver detalles
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Mensaje
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-4">
            <RankingTable students={mockStudents} showTrends={true} maxRows={50} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
