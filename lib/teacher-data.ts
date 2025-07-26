// Comprehensive mock data for the Teacher Dashboard

export interface Student {
  id: string
  name: string
  email: string
  avatar: string
  status: "active" | "inactive" | "at-risk"
  lastActive: string
  coursesEnrolled: number
  overallProgress: number
  averageScore: number
  streakDays: number
  totalStudyTime: number
  performanceData: {
    date: string
    score: number
    timeSpent: number
    topicsStudied: number
  }[]
  topicMastery: {
    topic: string
    mastery: number
    questionsAnswered: number
    correctAnswers: number
  }[]
  recentActivity: {
    type: "quiz" | "flashcard" | "study"
    topic: string
    score?: number
    timestamp: string
  }[]
  weakAreas: string[]
  strongAreas: string[]
}

export interface Course {
  id: string
  name: string
  description: string
  studentsEnrolled: number
  completionRate: number
  averageScore: number
  modules: Module[]
  createdAt: string
  lastUpdated: string
  status: "active" | "draft" | "archived"
  inviteCode: string
}

export interface Module {
  id: string
  name: string
  description: string
  order: number
  completionRate: number
  averageScore: number
  topics: Topic[]
  documentsCount: number
  questionsGenerated: number
}

export interface Topic {
  id: string
  name: string
  difficulty: "easy" | "medium" | "hard"
  masteryRate: number
  questionsCount: number
  averageScore: number
  strugglingStudents: number
}

export interface Alert {
  id: string
  type: "warning" | "danger" | "info"
  title: string
  description: string
  studentId?: string
  courseId?: string
  timestamp: string
  isRead: boolean
  priority: "high" | "medium" | "low"
}

export interface AIInsight {
  id: string
  type: "recommendation" | "observation" | "prediction"
  title: string
  description: string
  confidence: number
  actionable: boolean
  relatedStudents?: string[]
  relatedTopics?: string[]
  timestamp: string
}

// Mock data
export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@email.com",
    avatar: "/avatars/ana.jpg",
    status: "active",
    lastActive: "2024-01-26T10:30:00Z",
    coursesEnrolled: 3,
    overallProgress: 85,
    averageScore: 92,
    streakDays: 12,
    totalStudyTime: 2400,
    performanceData: [
      { date: "2024-01-20", score: 88, timeSpent: 45, topicsStudied: 3 },
      { date: "2024-01-21", score: 92, timeSpent: 60, topicsStudied: 4 },
      { date: "2024-01-22", score: 95, timeSpent: 50, topicsStudied: 2 },
      { date: "2024-01-23", score: 89, timeSpent: 40, topicsStudied: 3 },
      { date: "2024-01-24", score: 94, timeSpent: 55, topicsStudied: 4 },
      { date: "2024-01-25", score: 91, timeSpent: 48, topicsStudied: 3 },
      { date: "2024-01-26", score: 96, timeSpent: 52, topicsStudied: 5 },
    ],
    topicMastery: [
      { topic: "Derecho Constitucional", mastery: 95, questionsAnswered: 45, correctAnswers: 43 },
      { topic: "Derecho Civil", mastery: 88, questionsAnswered: 32, correctAnswers: 28 },
      { topic: "Derecho Penal", mastery: 92, questionsAnswered: 38, correctAnswers: 35 },
    ],
    recentActivity: [
      { type: "quiz", topic: "Derecho Constitucional", score: 96, timestamp: "2024-01-26T10:30:00Z" },
      { type: "flashcard", topic: "Derecho Civil", timestamp: "2024-01-26T09:15:00Z" },
      { type: "study", topic: "Derecho Penal", timestamp: "2024-01-25T16:45:00Z" },
    ],
    weakAreas: ["Procedimientos Civiles", "Derecho Mercantil"],
    strongAreas: ["Derecho Constitucional", "Derecho Penal"],
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    avatar: "/avatars/carlos.jpg",
    status: "at-risk",
    lastActive: "2024-01-24T14:20:00Z",
    coursesEnrolled: 2,
    overallProgress: 45,
    averageScore: 68,
    streakDays: 0,
    totalStudyTime: 1200,
    performanceData: [
      { date: "2024-01-20", score: 72, timeSpent: 30, topicsStudied: 2 },
      { date: "2024-01-21", score: 65, timeSpent: 25, topicsStudied: 1 },
      { date: "2024-01-22", score: 70, timeSpent: 35, topicsStudied: 2 },
      { date: "2024-01-23", score: 63, timeSpent: 20, topicsStudied: 1 },
      { date: "2024-01-24", score: 68, timeSpent: 40, topicsStudied: 3 },
    ],
    topicMastery: [
      { topic: "Derecho Constitucional", mastery: 72, questionsAnswered: 25, correctAnswers: 18 },
      { topic: "Derecho Civil", mastery: 65, questionsAnswered: 20, correctAnswers: 13 },
      { topic: "Derecho Penal", mastery: 68, questionsAnswered: 22, correctAnswers: 15 },
    ],
    recentActivity: [
      { type: "quiz", topic: "Derecho Civil", score: 68, timestamp: "2024-01-24T14:20:00Z" },
      { type: "study", topic: "Derecho Constitucional", timestamp: "2024-01-24T13:10:00Z" },
    ],
    weakAreas: ["Derecho Civil", "Procedimientos Penales", "Derecho Mercantil"],
    strongAreas: ["Derecho Constitucional"],
  },
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@email.com",
    avatar: "/avatars/maria.jpg",
    status: "active",
    lastActive: "2024-01-26T11:45:00Z",
    coursesEnrolled: 4,
    overallProgress: 78,
    averageScore: 86,
    streakDays: 8,
    totalStudyTime: 3200,
    performanceData: [
      { date: "2024-01-20", score: 84, timeSpent: 55, topicsStudied: 4 },
      { date: "2024-01-21", score: 87, timeSpent: 48, topicsStudied: 3 },
      { date: "2024-01-22", score: 85, timeSpent: 52, topicsStudied: 4 },
      { date: "2024-01-23", score: 88, timeSpent: 45, topicsStudied: 3 },
      { date: "2024-01-24", score: 86, timeSpent: 50, topicsStudied: 4 },
      { date: "2024-01-25", score: 89, timeSpent: 47, topicsStudied: 3 },
      { date: "2024-01-26", score: 87, timeSpent: 53, topicsStudied: 5 },
    ],
    topicMastery: [
      { topic: "Derecho Constitucional", mastery: 89, questionsAnswered: 42, correctAnswers: 37 },
      { topic: "Derecho Civil", mastery: 84, questionsAnswered: 38, correctAnswers: 32 },
      { topic: "Derecho Penal", mastery: 86, questionsAnswered: 35, correctAnswers: 30 },
    ],
    recentActivity: [
      { type: "flashcard", topic: "Derecho Penal", timestamp: "2024-01-26T11:45:00Z" },
      { type: "quiz", topic: "Derecho Civil", score: 87, timestamp: "2024-01-26T10:20:00Z" },
    ],
    weakAreas: ["Derecho Mercantil"],
    strongAreas: ["Derecho Constitucional", "Derecho Civil", "Derecho Penal"],
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Derecho Penal I",
    description: "Fundamentos del derecho penal y teoría del delito",
    studentsEnrolled: 32,
    completionRate: 78,
    averageScore: 84,
    status: "active",
    inviteCode: "PENAL2024",
    createdAt: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-26T12:00:00Z",
    modules: [
      {
        id: "1",
        name: "Introducción al Derecho Penal",
        description: "Conceptos básicos y principios fundamentales",
        order: 1,
        completionRate: 95,
        averageScore: 88,
        documentsCount: 5,
        questionsGenerated: 120,
        topics: [
          {
            id: "1",
            name: "Principios del Derecho Penal",
            difficulty: "medium",
            masteryRate: 85,
            questionsCount: 45,
            averageScore: 87,
            strugglingStudents: 3,
          },
          {
            id: "2",
            name: "Fuentes del Derecho Penal",
            difficulty: "easy",
            masteryRate: 92,
            questionsCount: 35,
            averageScore: 91,
            strugglingStudents: 1,
          },
        ],
      },
      {
        id: "2",
        name: "Teoría del Delito",
        description: "Elementos del delito y estructura típica",
        order: 2,
        completionRate: 72,
        averageScore: 81,
        documentsCount: 8,
        questionsGenerated: 180,
        topics: [
          {
            id: "3",
            name: "Tipicidad",
            difficulty: "hard",
            masteryRate: 68,
            questionsCount: 60,
            averageScore: 76,
            strugglingStudents: 8,
          },
          {
            id: "4",
            name: "Antijuridicidad",
            difficulty: "hard",
            masteryRate: 71,
            questionsCount: 55,
            averageScore: 79,
            strugglingStudents: 6,
          },
        ],
      },
    ],
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "danger",
    title: "Estudiante en riesgo",
    description: "Carlos Mendoza no ha estudiado en 2 días y su rendimiento ha bajado 15%",
    studentId: "2",
    courseId: "1",
    timestamp: "2024-01-26T08:00:00Z",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "Bajo rendimiento en tema",
    description: '8 estudiantes tienen dificultades con "Tipicidad" (68% de dominio)',
    courseId: "1",
    timestamp: "2024-01-26T07:30:00Z",
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "info",
    title: "Nuevo récord de participación",
    description: "Ana García completó 5 temas en una sesión de estudio",
    studentId: "1",
    timestamp: "2024-01-26T06:45:00Z",
    isRead: true,
    priority: "low",
  },
]

export const mockAIInsights: AIInsight[] = [
  {
    id: "1",
    type: "recommendation",
    title: "Refuerzo recomendado en Tipicidad",
    description:
      "Los estudiantes muestran confusión entre elementos objetivos y subjetivos del tipo penal. Considera una clase de repaso.",
    confidence: 87,
    actionable: true,
    relatedStudents: ["2", "5", "8", "12"],
    relatedTopics: ["Tipicidad", "Elementos del delito"],
    timestamp: "2024-01-26T09:00:00Z",
  },
  {
    id: "2",
    type: "observation",
    title: "Patrón de estudio efectivo detectado",
    description:
      "Los estudiantes que estudian en sesiones de 45-60 minutos muestran 23% mejor retención que sesiones más largas.",
    confidence: 92,
    actionable: true,
    relatedStudents: ["1", "3", "7", "9"],
    timestamp: "2024-01-26T08:30:00Z",
  },
  {
    id: "3",
    type: "prediction",
    title: "Riesgo de abandono identificado",
    description:
      "Carlos Mendoza tiene 78% probabilidad de abandonar el curso si no mejora su engagement en los próximos 7 días.",
    confidence: 78,
    actionable: true,
    relatedStudents: ["2"],
    timestamp: "2024-01-26T08:00:00Z",
  },
]

export const mockEngagementData = [
  { date: "2024-01-20", activeStudents: 28, avgSessionTime: 42, completedActivities: 156 },
  { date: "2024-01-21", activeStudents: 30, avgSessionTime: 45, completedActivities: 168 },
  { date: "2024-01-22", activeStudents: 25, avgSessionTime: 38, completedActivities: 142 },
  { date: "2024-01-23", activeStudents: 32, avgSessionTime: 48, completedActivities: 178 },
  { date: "2024-01-24", activeStudents: 29, avgSessionTime: 44, completedActivities: 165 },
  { date: "2024-01-25", activeStudents: 31, avgSessionTime: 46, completedActivities: 172 },
  { date: "2024-01-26", activeStudents: 33, avgSessionTime: 49, completedActivities: 185 },
]

export const mockPerformanceByTopic = [
  { topic: "Principios del Derecho Penal", averageScore: 87, studentsCompleted: 30, difficulty: "medium" },
  { topic: "Fuentes del Derecho Penal", averageScore: 91, studentsCompleted: 32, difficulty: "easy" },
  { topic: "Tipicidad", averageScore: 76, studentsCompleted: 25, difficulty: "hard" },
  { topic: "Antijuridicidad", averageScore: 79, studentsCompleted: 23, difficulty: "hard" },
  { topic: "Culpabilidad", averageScore: 82, studentsCompleted: 20, difficulty: "medium" },
]

// Analytics data
export const analyticsData = {
  classPerformance: Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split("T")[0],
      accuracy: 65 + Math.sin(i * 0.2) * 10 + Math.random() * 8,
      participation: 70 + Math.cos(i * 0.15) * 15 + Math.random() * 10,
      completion: 60 + Math.sin(i * 0.1) * 20 + Math.random() * 12,
    }
  }),

  topicDifficulty: [
    { topic: "Search and Seizure", accuracy: 58, attempts: 234, avgTime: 15.2 },
    { topic: "Homicide", accuracy: 62, attempts: 189, avgTime: 18.7 },
    { topic: "Cybercrime", accuracy: 54, attempts: 87, avgTime: 22.1 },
    { topic: "Due Process", accuracy: 72, attempts: 298, avgTime: 8.5 },
    { topic: "Miranda Rights", accuracy: 81, attempts: 267, avgTime: 6.8 },
    { topic: "Sentencing Guidelines", accuracy: 69, attempts: 156, avgTime: 11.4 },
  ],

  engagementHeatmap: Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day],
      hour,
      value: Math.max(0, Math.floor(Math.random() * 20) - (hour < 8 || hour > 22 ? 15 : 0)),
    })),
  ).flat(),

  studentRankings: mockStudents
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10)
    .map((student, index) => ({
      rank: index + 1,
      name: student.name,
      avatar: student.avatar,
      accuracy: student.averageScore,
      completionRate: student.overallProgress,
      streak: student.streakDays,
      trend: student.recentActivity.length > 0 ? student.recentActivity[0].type : "none",
    })),
}

export const dashboardMetrics = {
  totalStudents: mockStudents.length,
  activeStudents: mockStudents.filter((s) => s.status === "active").length,
  atRiskStudents: mockStudents.filter((s) => s.status === "at-risk").length,
  averageAccuracy: Math.round(mockStudents.reduce((acc, s) => acc + s.averageScore, 0) / mockStudents.length),
  completionRate: Math.round(mockStudents.reduce((acc, s) => acc + s.overallProgress, 0) / mockStudents.length),
  totalActivities: mockStudents.reduce((acc, s) => acc + s.performanceData.length, 0),
  averageSessionTime: Math.round(
    mockStudents.reduce((acc, s) => acc + s.performanceData.reduce((sum, pd) => sum + pd.timeSpent, 0), 0) /
      mockStudents.length,
  ),
}
