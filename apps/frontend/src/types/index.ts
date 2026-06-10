export interface QuizAnswer {
  questionId: number
  selectedOption: string
  phase: number
}

export interface QuizSubmission {
  fase_0: number
  fase_1: string[]
  fase_2: Record<string, number>
  fase_3: string[]
  fase_4: string[]
  fase_5: number[]
  filtros: {
    q33_prohibido: string
    q34_llave: string
  }
}

export interface PillarResult {
  id: string
  name: string
  score: number
  uso_total: number
  sombra_total: number
  costo_energia: number
}

export interface RavenDiagnosis {
  recurso_dominante: string
  recurso_secundario: string
  alerta_burnout: boolean
  impacto_desgaste: number
  recurso_bloqueado: string | null
  indice_elasticidad_pct: number
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  subscription?: {
    plan: 'backstage' | 'escenario' | 'productor'
    status: 'active' | 'cancelled' | 'past_due'
    currentPeriodEnd: string
  }
  quizCompleted: boolean
  diagnosis?: RavenDiagnosis
}

export interface Sprint {
  id: number
  week: number
  title: string
  description: string
  pillar: string
  completed: boolean
  metrics: {
    label: string
    target: number
    current: number
  }[]
}

export interface AIPlan {
  id: string
  userId: string
  dominant: string
  secondary: string
  blocked: string | null
  sprints: Sprint[]
  createdAt: string
  updatedAt: string
}

export interface EmailCapture {
  email: string
  quizResult: RavenDiagnosis
  offerCode: string
  expiresAt: string
}
