// API client for Studium backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Enums first
export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum ActivityType {
  FLASHCARD = 'flashcard',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SUMMARY = 'summary',
  MIXED = 'mixed'
}

// Types based on backend schemas
export interface UploadResponse {
  document_id: string
  filename: string
  file_size: number
  file_type: string
  status: ProcessingStatus
}

export interface ProcessingResponse {
  document_id: string
  status: ProcessingStatus
  progress: number
  message?: string
  extracted_text?: string
  word_count?: number
}

export interface DocumentTextResponse {
  document_id: string
  extracted_text: string
  word_count: number
}

export interface GenerateContentRequest {
  text: string
  activity_type: ActivityType
  count?: number
  language?: string
}

export interface GenerateMixedRequest {
  text: string
  language?: string
}

export interface ActivityResponse {
  activity_type: ActivityType
  count: number
  activities: any[]
  processing_time: number
  provider?: string
  language: string
}

export interface Flashcard {
  question: string
  answer: string
  difficulty?: string
}

export interface MultipleChoiceQuestion {
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export interface TrueFalseQuestion {
  statement: string
  correct_answer: boolean
  explanation?: string
}

export interface Summary {
  title: string
  content: string
  key_points: string[]
}

// Study Plan Types
export interface StudyPlanRequest {
  file_id: string
  subject_name: string
  exam_date: string
  language?: string
}

export interface StudyTopic {
  name: string
  importance: number
  difficulty: string
  description: string
  estimated_hours?: number
  subtopics?: string[]
}

export interface DailyStudyPlan {
  day: number
  date: string
  topics: string[]
  actions: string[]
  estimated_hours: number
}

export interface TimelineData {
  total_days: number
  days_remaining: number
  study_intensity: string
  weekly_breakdown: any[]
}

export interface StudyStatistics {
  total_topics: number
  estimated_total_hours: number
  daily_average_hours: number
  hardest_topics_count: number
}

export interface StudyPlanResponse {
  plan_id: string
  subject_name: string
  exam_date: string
  created_at: string
  status: string
  main_topics: StudyTopic[]
  hardest_topics: StudyTopic[]
  daily_plan: DailyStudyPlan[]
  timeline: TimelineData
  statistics: StudyStatistics
  general_recommendations: string[]
  study_techniques: string[]
  document_text: string
  language: string
  provider?: string
  processing_time: number
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.detail || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// API functions
export const api = {
  // Document upload
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header, let browser set it with boundary
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.detail || `Upload failed: HTTP ${response.status}`)
    }

    return await response.json()
  },

  // Start document processing
  async processDocument(documentId: string): Promise<ProcessingResponse> {
    return apiRequest<ProcessingResponse>(`/process/${documentId}`, {
      method: 'POST',
    })
  },

  // Get processing status
  async getProcessingStatus(documentId: string): Promise<ProcessingResponse> {
    return apiRequest<ProcessingResponse>(`/process/${documentId}/status`)
  },

  // Get extracted document text
  async getDocumentText(documentId: string): Promise<DocumentTextResponse> {
    return apiRequest<DocumentTextResponse>(`/documents/${documentId}/text`)
  },

  // Generate flashcards
  async generateFlashcards(request: GenerateContentRequest): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>('/generate/flashcards', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Generate multiple choice questions
  async generateMultipleChoice(request: GenerateContentRequest): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>('/generate/multiple-choice', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Generate true/false questions
  async generateTrueFalse(request: GenerateContentRequest): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>('/generate/true-false', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Generate summary
  async generateSummary(request: GenerateContentRequest): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>('/generate/summary', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Generate content with fallback (unified endpoint)
  async generateContent(request: GenerateContentRequest): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Generate mixed activities (flashcards, multiple choice, true/false) in single call
  async generateMixedActivities(request: GenerateMixedRequest): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>('/generate/mixed', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Delete document
  async deleteDocument(documentId: string): Promise<{ message: string; file_cleanup: boolean }> {
    return apiRequest<{ message: string; file_cleanup: boolean }>(`/documents/${documentId}`, {
      method: 'DELETE',
    })
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string; timestamp: string }> {
    return apiRequest<{ status: string; service: string; version: string; timestamp: string }>('/health')
  },

  // Study Plan APIs
  // Generate study plan
  async generateStudyPlan(request: StudyPlanRequest): Promise<StudyPlanResponse> {
    return apiRequest<StudyPlanResponse>('/student/learn/plan/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Get study plan by ID
  async getStudyPlan(planId: string): Promise<StudyPlanResponse> {
    return apiRequest<StudyPlanResponse>(`/student/learn/plan/${planId}`)
  },

  // List all study plans
  async listStudyPlans(): Promise<{ study_plans: any[]; total_count: number }> {
    return apiRequest<{ study_plans: any[]; total_count: number }>('/student/learn/plans')
  },

  // Delete study plan
  async deleteStudyPlan(planId: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/student/learn/plan/${planId}`, {
      method: 'DELETE',
    })
  },
}

export { ApiError }
