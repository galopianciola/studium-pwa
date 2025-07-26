import { TeacherHeader } from "@/components/teacher/header"
import { MetricWidget } from "@/components/teacher/metric-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Star, Zap, Target, Gift, Plus, Clock, Lightbulb, RotateCcw } from "lucide-react"
import { mockStudents } from "@/lib/teacher-data"

export default function GamificationPage() {
  const totalPoints = mockStudents.reduce((acc, s) => acc + s.averageScore * 10, 0)
  const activeStreaks = mockStudents.filter((s) => s.streakDays > 0).length
  const completedChallenges = 156
  const averageEngagement = 78

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      name: "Primer Paso",
      description: "Completa tu primera actividad",
      icon: Star,
      color: "bg-yellow-500",
      earned: 32,
      total: 32,
    },
    {
      id: 2,
      name: "Racha de Fuego",
      description: "Estudia 7 días consecutivos",
      icon: Zap,
      color: "bg-orange-500",
      earned: 12,
      total: 32,
    },
    {
      id: 3,
      name: "Maestro del Tema",
      description: "Obtén 90% o más en un tema",
      icon: Trophy,
      color: "bg-blue-500",
      earned: 18,
      total: 32,
    },
    {
      id: 4,
      name: "Perfeccionista",
      description: "Responde 50 preguntas correctamente",
      icon: Target,
      color: "bg-green-500",
      earned: 8,
      total: 32,
    },
  ]

  // Mock leaderboard with additional gamification data
  const gamifiedStudents = mockStudents.map((student) => ({
    ...student,
    points: student.averageScore * 10,
    level: Math.floor(student.averageScore / 20) + 1,
    badges: Math.floor(Math.random() * 5) + 1,
    achievements: Math.floor(Math.random() * 4) + 1,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader
        breadcrumbs={[{ label: "Gamificación" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear desafío
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Gamification Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricWidget
            title="Puntos Totales"
            value={totalPoints.toLocaleString()}
            subtitle="Acumulados por todos"
            icon={<Star className="h-4 w-4" />}
            trend={{
              value: 24.5,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Rachas Activas"
            value={activeStreaks}
            subtitle={`${Math.round((activeStreaks / mockStudents.length) * 100)}% de estudiantes`}
            icon={<Zap className="h-4 w-4" />}
            trend={{
              value: 18.2,
              label: "vs semana anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Desafíos Completados"
            value={completedChallenges}
            subtitle="En el último mes"
            icon={<Target className="h-4 w-4" />}
            trend={{
              value: 31.7,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />

          <MetricWidget
            title="Engagement Promedio"
            value={`${averageEngagement}%`}
            subtitle="Participación general"
            icon={<Trophy className="h-4 w-4" />}
            trend={{
              value: 12.3,
              label: "vs mes anterior",
              direction: "up",
            }}
            status="success"
          />
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leaderboard">Clasificación</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="challenges">Desafíos</TabsTrigger>
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Top 3 Podium */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Podium</CardTitle>
                    <CardDescription>Top 3 estudiantes del mes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {gamifiedStudents
                        .sort((a, b) => b.points - a.points)
                        .slice(0, 3)
                        .map((student, index) => {
                          const position = index + 1
                          const icons = [Trophy, Medal, Award]
                          const colors = ["text-yellow-500", "text-gray-400", "text-amber-600"]
                          const Icon = icons[index]

                          return (
                            <div key={student.id} className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full bg-gray-50 ${colors[index]}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.points.toLocaleString()} puntos</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold">#{position}</div>
                                <div className="text-xs text-gray-500">Nivel {student.level}</div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Full Leaderboard */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clasificación General</CardTitle>
                    <CardDescription>Ranking completo de estudiantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {gamifiedStudents
                        .sort((a, b) => b.points - a.points)
                        .map((student, index) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                {index + 1}
                              </div>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{student.name}</div>
                                <div className="text-xs text-gray-500">
                                  Nivel {student.level} • {student.badges} insignias
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">{student.points.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">puntos</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                const completionRate = (achievement.earned / achievement.total) * 100

                return (
                  <Card key={achievement.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${achievement.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{achievement.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{achievement.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span className="font-medium">
                            {achievement.earned}/{achievement.total}
                          </span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>

                      <div className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {completionRate.toFixed(0)}% completado
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estudiantes Destacados</CardTitle>
                <CardDescription>Estudiantes que han desbloqueado logros recientemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      student: mockStudents[0],
                      achievement: "Racha de Fuego",
                      timestamp: "Hace 2 horas",
                    },
                    {
                      student: mockStudents[2],
                      achievement: "Maestro del Tema",
                      timestamp: "Hace 5 horas",
                    },
                    {
                      student: mockStudents[1],
                      achievement: "Perfeccionista",
                      timestamp: "Hace 1 día",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.student.avatar || "/placeholder.svg"} alt={item.student.name} />
                          <AvatarFallback>
                            {item.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{item.student.name}</div>
                          <div className="text-xs text-gray-600">Desbloqueó "{item.achievement}"</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{item.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 1,
                  title: "Desafío Semanal",
                  description: "Completa 5 actividades esta semana",
                  progress: 78,
                  participants: 24,
                  reward: "50 puntos extra",
                  status: "active",
                  timeLeft: "3 días",
                },
                {
                  id: 2,
                  title: "Quiz Relámpago",
                  description: "Responde 20 preguntas en menos de 10 minutos",
                  progress: 45,
                  participants: 18,
                  reward: "Insignia especial",
                  status: "active",
                  timeLeft: "5 días",
                },
                {
                  id: 3,
                  title: "Maestro del Mes",
                  description: "Mantén un promedio de 90% durante todo el mes",
                  progress: 23,
                  participants: 8,
                  reward: "Certificado digital",
                  status: "active",
                  timeLeft: "12 días",
                },
              ].map((challenge) => (
                <Card key={challenge.id} className="border-blue-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{challenge.title}</CardTitle>
                        <CardDescription className="mt-1">{challenge.description}</CardDescription>
                      </div>
                      <Badge variant={challenge.status === "active" ? "default" : "secondary"} className="text-xs">
                        {challenge.status === "active" ? "Activo" : "Finalizado"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso general</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participantes:</span>
                      <span className="font-medium">{challenge.participants}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recompensa:</span>
                      <span className="font-medium text-green-600">{challenge.reward}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiempo restante:</span>
                      <span className="font-medium text-orange-600">{challenge.timeLeft}</span>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Ver participantes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tienda de Recompensas</CardTitle>
                  <CardDescription>Recompensas que los estudiantes pueden canjear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Extensión de plazo",
                        cost: 500,
                        description: "Extiende la fecha límite de una tarea por 24 horas",
                        icon: Clock,
                        available: true,
                      },
                      {
                        name: "Pista extra",
                        cost: 200,
                        description: "Obtén una pista adicional en tu próximo quiz",
                        icon: Lightbulb,
                        available: true,
                      },
                      {
                        name: "Segundo intento",
                        cost: 300,
                        description: "Repite una actividad para mejorar tu calificación",
                        icon: RotateCcw,
                        available: true,
                      },
                      {
                        name: "Certificado personalizado",
                        cost: 1000,
                        description: "Certificado digital personalizado de logro",
                        icon: Award,
                        available: false,
                      },
                    ].map((reward, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${reward.available ? "bg-white" : "bg-gray-50 opacity-60"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${reward.available ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                            >
                              <Gift className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{reward.name}</div>
                              <div className="text-xs text-gray-500">{reward.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">{reward.cost}</div>
                            <div className="text-xs text-gray-500">puntos</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Canjes Recientes</CardTitle>
                  <CardDescription>Recompensas canjeadas por estudiantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        student: "Ana García",
                        reward: "Pista extra",
                        cost: 200,
                        timestamp: "Hace 1 hora",
                      },
                      {
                        student: "María López",
                        reward: "Segundo intento",
                        cost: 300,
                        timestamp: "Hace 3 horas",
                      },
                      {
                        student: "Carlos Mendoza",
                        reward: "Extensión de plazo",
                        cost: 500,
                        timestamp: "Hace 1 día",
                      },
                    ].map((redemption, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <div className="font-medium text-sm">{redemption.student}</div>
                          <div className="text-xs text-gray-600">Canjeó "{redemption.reward}"</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">-{redemption.cost} pts</div>
                          <div className="text-xs text-gray-500">{redemption.timestamp}</div>
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
