import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useQuizStore = defineStore('quiz', () => {
  const questions = ref([])
  const currentQuestion = ref(0)
  const answers = ref([])
  const diagnostico = ref(null)
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref(null)

  const progress = computed(() => {
    if (!questions.value.length) return 0
    return Math.round((currentQuestion.value / questions.value.length) * 100)
  })

  const isComplete = computed(() => {
    return questions.value.length > 0 && answers.value.length === questions.value.length
  })

  const currentAnswer = computed(() => {
    return answers.value[currentQuestion.value]?.answer ?? null
  })

  const STORAGE_KEY = 'raven_quiz_progress'
  const DIAGNOSTICO_KEY = 'raven_diagnostico'

  function saveToStorage() {
    const payload = {
      currentQuestion: currentQuestion.value,
      answers: answers.value,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return false

      const parsed = JSON.parse(stored)
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        clearStorage()
        return false
      }

      currentQuestion.value = parsed.currentQuestion || 0
      answers.value = parsed.answers || []
      return true
    } catch (e) {
      clearStorage()
      return false
    }
  }

  function clearStorage() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(DIAGNOSTICO_KEY)
  }

  function saveDiagnostico(data) {
    diagnostico.value = data
    localStorage.setItem(DIAGNOSTICO_KEY, JSON.stringify(data))
  }

  async function fetchQuestions() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/api/quiz/questions`)
      if (!response.ok) throw new Error('Error cargando preguntas')

      const data = await response.json()
      questions.value = data

      const hadProgress = loadFromStorage()
      if (hadProgress && answers.value.length > 0) {
        const valid = answers.value.every(a => 
          questions.value.some(q => q.id === a.questionId)
        )
        if (!valid) reset()
      }

      return data
    } catch (err) {
      error.value = err.message || 'No pudimos cargar el cuestionario. Intenta de nuevo.'
      console.error('fetchQuestions error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  function answerQuestion(answerIndex) {
    if (!questions.value[currentQuestion.value]) return

    const question = questions.value[currentQuestion.value]
    const answerData = {
      questionId: question.id,
      answer: answerIndex,
      pillar: question.pillar,
      score: question.scores?.[answerIndex] ?? 0
    }

    if (answers.value[currentQuestion.value] !== undefined) {
      answers.value[currentQuestion.value] = answerData
    } else {
      while (answers.value.length < currentQuestion.value) {
        answers.value.push(null)
      }
      answers.value.push(answerData)
    }

    saveToStorage()

    if (currentQuestion.value < questions.value.length - 1) {
      currentQuestion.value++
    }
  }

  function goBack() {
    if (currentQuestion.value > 0) {
      currentQuestion.value--
      saveToStorage()
    }
  }

  async function submitQuiz() {
    if (!isComplete.value) {
      error.value = 'Responde todas las preguntas primero.'
      return null
    }

    submitting.value = true
    error.value = null

    try {
      const payload = answers.value.map(a => ({
        questionId: a.questionId,
        pillar: a.pillar,
        score: a.score
      }))

      const headers = { 'Content-Type': 'application/json' }
      const token = localStorage.getItem('raven_token')  // ← UNA SOLA VEZ
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}/api/quiz/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers: payload })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || 'Error procesando respuestas')
      }

      const data = await response.json()
      diagnostico.value = data
      saveDiagnostico(data)
      localStorage.removeItem(STORAGE_KEY)

      return data
    } catch (err) {
      error.value = err.message || 'Error enviando el quiz. Intenta de nuevo.'
      console.error('submitQuiz error:', err)

      const localDiagnostico = calcularDiagnosticoLocal()
      diagnostico.value = localDiagnostico
      saveDiagnostico(localDiagnostico)
      return localDiagnostico
    } finally {
      submitting.value = false
    }
  }

  function calcularDiagnosticoLocal() {
    const pillarScores = {}
    const pillarShadows = {}

    answers.value.forEach(a => {
      if (!a) return
      if (!pillarScores[a.pillar]) {
        pillarScores[a.pillar] = 0
        pillarShadows[a.pillar] = 0
      }
      pillarScores[a.pillar] += a.score || 1
      if ((a.score || 0) <= 1) {
        pillarShadows[a.pillar] += 1
      }
    })

    const metricas = Object.keys(pillarScores).map(id => ({
      id,
      uso_total: pillarScores[id],
      sombra_total: pillarShadows[id] || 0,
      costo: Math.min(4, Math.ceil(pillarScores[id] / 8))
    })).sort((a, b) => b.uso_total - a.uso_total)

    const dominante = metricas[0]
    const bloqueado = metricas.find(m => m.sombra_total > m.uso_total)?.id || null
    const totalUso = metricas.reduce((sum, m) => sum + m.uso_total, 0)
    const elasticidad = bloqueado 
      ? Math.max(0, 100 - (dominante.uso_total / totalUso * 100))
      : 75

    return {
      metricas,
      recurso_bloqueado: bloqueado,
      alerta_burnout: dominante.costo >= 3,
      impacto_desgaste: dominante.costo * 25,
      multiplicador_tiempo: 1.5,
      indice_elasticidad_pct: elasticidad,
      _local: true
    }
  }

  function reset() {
    currentQuestion.value = 0
    answers.value = []
    diagnostico.value = null
    error.value = null
    clearStorage()
  }

  function clearError() {
    error.value = null
  }

  return {
    questions,
    currentQuestion,
    answers,
    diagnostico,
    loading,
    submitting,
    error,
    progress,
    isComplete,
    currentAnswer,
    fetchQuestions,
    answerQuestion,
    goBack,
    submitQuiz,
    reset,
    saveToStorage,
    loadFromStorage,
    saveDiagnostico,
    clearStorage,
    clearError
  }
})