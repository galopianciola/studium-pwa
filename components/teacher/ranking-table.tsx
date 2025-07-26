import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Student } from "@/lib/teacher-data"

interface RankingTableProps {
  students: Student[]
  showTrends?: boolean
  maxRows?: number
  className?: string
}

export function RankingTable({ students, showTrends = true, maxRows = 10, className }: RankingTableProps) {
  // Sort students by average score
  const sortedStudents = [...students].sort((a, b) => b.averageScore - a.averageScore).slice(0, maxRows)

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-gray-500">#{position}</span>
    }
  }

  const getStatusColor = (status: Student["status"]) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("rounded-lg border bg-white", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Pos.</TableHead>
            <TableHead>Estudiante</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Progreso</TableHead>
            <TableHead className="text-center">Promedio</TableHead>
            <TableHead className="text-center">Racha</TableHead>
            {showTrends && <TableHead className="text-center">Tendencia</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStudents.map((student, index) => {
            const position = index + 1
            const recentScores = student.performanceData.slice(-3).map((d) => d.score)
            const trend = recentScores.length >= 2 ? recentScores[recentScores.length - 1] - recentScores[0] : 0

            return (
              <TableRow key={student.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center">{getRankIcon(position)}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-3">
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
                      <div className="text-xs text-gray-500">{student.coursesEnrolled} cursos</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="secondary" className={cn("text-xs", getStatusColor(student.status))}>
                    {student.status === "active" ? "Activo" : student.status === "inactive" ? "Inactivo" : "En riesgo"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={student.overallProgress}
                      className="w-16 h-2"
                      style={
                        {
                          "--progress-background": getProgressColor(student.overallProgress),
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-xs font-medium">{student.overallProgress}%</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <span className={cn("font-semibold", getScoreColor(student.averageScore))}>
                    {student.averageScore}%
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-sm font-medium">{student.streakDays}</span>
                    <span className="text-xs text-gray-500">días</span>
                  </div>
                </TableCell>

                {showTrends && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {trend > 0 ? (
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">+{trend.toFixed(1)}</span>
                        </div>
                      ) : trend < 0 ? (
                        <div className="flex items-center text-red-600">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          <span className="text-xs">{trend.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
