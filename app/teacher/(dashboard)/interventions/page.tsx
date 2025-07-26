import { TeacherHeader } from "@/components/teacher/header"
import { AlertCard } from "@/components/teacher/alert-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Users, AlertTriangle, Plus, Search, Filter } from "lucide-react"
import { mockAlerts, mockStudents } from "@/lib/teacher-data"

export default function InterventionsPage() {
  const atRiskStudents = mockStudents.filter((s) => s.status === "at-risk")
  const unreadAlerts = mockAlerts.filter((a) => !a.isRead).length

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader
        breadcrumbs={[{ label: "Intervenciones" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva intervención
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{unreadAlerts}</div>
                  <div className="text-sm text-gray-500">Alertas sin leer</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{atRiskStudents.length}</div>
                  <div className="text-sm text-gray-500">Estudiantes en riesgo</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-gray-500">Mensajes enviados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="at-risk">En Riesgo</TabsTrigger>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Alertas Activas</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  Marcar todas como leídas
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onMarkAsRead={(id) => console.log("Mark as read:", id)}
                  onTakeAction={(id) => console.log("Take action:", id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="at-risk" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Estudiantes en Riesgo</h3>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensaje grupal
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {atRiskStudents.map((student) => (
                <Card key={student.id} className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
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
                        <CardDescription>Último acceso: hace 2 días</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Promedio actual:</span>
                      <span className="font-medium text-red-600">{student.averageScore}%</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Problemas identificados:</div>
                      <div className="flex flex-wrap gap-1">
                        {student.weakAreas.slice(0, 2).map((area, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Ver detalles
                      </Button>
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contactar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Message Composer */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nuevo Mensaje</CardTitle>
                    <CardDescription>Envía un mensaje a estudiantes específicos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Destinatarios</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estudiantes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estudiantes</SelectItem>
                          <SelectItem value="at-risk">Estudiantes en riesgo</SelectItem>
                          <SelectItem value="active">Estudiantes activos</SelectItem>
                          <SelectItem value="custom">Selección personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Asunto</label>
                      <Input placeholder="Asunto del mensaje" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mensaje</label>
                      <Textarea placeholder="Escribe tu mensaje aquí..." rows={6} />
                    </div>

                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar mensaje
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Message History */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Historial de Mensajes</CardTitle>
                        <CardDescription>Mensajes enviados recientemente</CardDescription>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="Buscar mensajes..." className="pl-10 w-64" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: 1,
                          subject: "Recordatorio: Actividades pendientes",
                          recipients: "Estudiantes en riesgo (3)",
                          timestamp: "Hace 2 horas",
                          status: "Enviado",
                        },
                        {
                          id: 2,
                          subject: "Felicitaciones por tu progreso",
                          recipients: "Ana García",
                          timestamp: "Hace 1 día",
                          status: "Leído",
                        },
                        {
                          id: 3,
                          subject: "Recursos adicionales para Derecho Penal",
                          recipients: "Todos los estudiantes (32)",
                          timestamp: "Hace 3 días",
                          status: "Enviado",
                        },
                      ].map((message) => (
                        <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="font-medium">{message.subject}</div>
                              <div className="text-sm text-gray-500">Para: {message.recipients}</div>
                              <div className="text-xs text-gray-400">{message.timestamp}</div>
                            </div>
                            <Badge variant={message.status === "Leído" ? "default" : "secondary"} className="text-xs">
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recomendaciones de IA</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      Sesión de repaso recomendada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      8 estudiantes muestran dificultades con "Tipicidad". Una sesión de repaso podría mejorar el
                      rendimiento general en un 15%.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm">Programar sesión</Button>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Reconocimiento sugerido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      Ana García ha mostrado una mejora consistente del 23% en las últimas 2 semanas. Considera enviar
                      un mensaje de reconocimiento.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm">Enviar felicitación</Button>
                      <Button variant="outline" size="sm">
                        Ver progreso
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                      Contenido adicional sugerido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      Los estudiantes avanzados podrían beneficiarse de material complementario sobre "Elementos del
                      delito".
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm">Subir contenido</Button>
                      <Button variant="outline" size="sm">
                        Ver estudiantes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                      Horario óptimo identificado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      Los estudiantes muestran mayor participación entre 10:00-12:00 y 16:00-18:00. Considera programar
                      actividades en estos horarios.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm">Ver análisis</Button>
                      <Button variant="outline" size="sm">
                        Programar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
