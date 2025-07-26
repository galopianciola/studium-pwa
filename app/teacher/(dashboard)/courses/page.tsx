import { TeacherHeader } from "@/components/teacher/header"
import { MetricWidget } from "@/components/teacher/metric-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, BookOpen, Users, TrendingUp, Settings, Upload, Copy } from "lucide-react"
import { mockCourses, mockStudents } from "@/lib/teacher-data"

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader
        breadcrumbs={[{ label: "Cursos" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear curso
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Course Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricWidget
            title="Cursos Activos"
            value={mockCourses.length}
            subtitle="En este semestre"
            icon={<BookOpen className="h-4 w-4" />}
            status="success"
          />

          <MetricWidget
            title="Total Estudiantes"
            value={mockCourses.reduce((acc, course) => acc + course.studentsEnrolled, 0)}
            subtitle="En todos los cursos"
            icon={<Users className="h-4 w-4" />}
            trend={{
              value: 15.2,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Promedio Completación"
            value={`${Math.round(mockCourses.reduce((acc, course) => acc + course.completionRate, 0) / mockCourses.length)}%`}
            subtitle="Todos los cursos"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: 8.7,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />
        </div>

        {/* Course Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription className="mt-1">{course.description}</CardDescription>
                  </div>
                  <Badge variant={course.status === "active" ? "default" : "secondary"} className="text-xs">
                    {course.status === "active" ? "Activo" : course.status === "draft" ? "Borrador" : "Archivado"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{course.studentsEnrolled}</div>
                    <div className="text-xs text-gray-500">Estudiantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{course.averageScore}%</div>
                    <div className="text-xs text-gray-500">Promedio</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completación del curso</span>
                    <span className="font-medium">{course.completionRate}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>

                {/* Modules */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Módulos ({course.modules.length})</div>
                  <div className="space-y-1">
                    {course.modules.slice(0, 2).map((module) => (
                      <div key={module.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{module.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {module.completionRate}%
                        </Badge>
                      </div>
                    ))}
                    {course.modules.length > 2 && (
                      <div className="text-xs text-gray-500">+{course.modules.length - 2} módulos más</div>
                    )}
                  </div>
                </div>

                {/* Invite Code */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Código de invitación</div>
                      <div className="font-mono text-sm font-medium">{course.inviteCode}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Recent Students */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Estudiantes recientes</div>
                  <div className="flex -space-x-2">
                    {mockStudents.slice(0, 4).map((student) => (
                      <Avatar key={student.id} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {course.studentsEnrolled > 4 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{course.studentsEnrolled - 4}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Upload className="h-3 w-3 mr-1" />
                    Contenido
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Course Card */}
          <Card className="border-dashed border-2 hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Crear nuevo curso</h3>
              <p className="text-gray-500 text-sm mb-4">Configura un nuevo curso y comienza a agregar contenido</p>
              <Button>Empezar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
