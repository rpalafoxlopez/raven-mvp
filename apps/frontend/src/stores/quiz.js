import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useQuizStore = defineStore('quiz', () => {
  // ===== STATE =====
  const questions = ref([])
  const currentQuestion = ref(0)
  const answers = ref([])        // { questionId, answer, pillar, score }
  const diagnostico = ref(null)  // resultado del backend
  const loading = ref(false)     // carga inicial de preguntas
  const submitting = ref(false)  // envío del quiz
  const error = ref(null)

  // ===== COMPUTED =====
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

  // ===== PERSISTENCE =====
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
      // Solo restaurar si es de las últimas 24h
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

  function loadDiagnostico() {
    try {
      const stored = localStorage.getItem(DIAGNOSTICO_KEY)
      if (stored) {
        diagnostico.value = JSON.parse(stored)
        return true
      }
      return false
    } catch (e) {
      localStorage.removeItem(DIAGNOSTICO_KEY)
      return false
    }
  }

  // ===== ACTIONS =====

  async function fetchQuestions() {
    loading.value = true
    error.value = null

    try {
      // Público: no requiere auth
      const response = await fetch(`${API_URL}/api/quiz/questions`)
      if (!response.ok) throw new Error('Error cargando preguntas')

      const data = await response.json()
      questions.value = data

      // Si había progreso guardado, preguntar si restaurar (o restaurar auto)
      const hadProgress = loadFromStorage()
      if (hadProgress && answers.value.length > 0) {
        // Validar que las preguntas coincidan
        const valid = answers.value.every(a => 
          questions.value.some(q => q.id === a.questionId)
        )
        if (!valid) {
          reset()
        }
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
      score: question.scores?.[answerIndex] ?? 0  // score para ese pilar
    }

    // Si ya había respuesta en esta posición (usuario fue atrás y re-respondió)
    if (answers.value[currentQuestion.value]) {
      answers.value[currentQuestion.value] = answerData
    } else {
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
      // No hacemos pop — dejamos la respuesta para que se muestre pre-seleccionada
      // El usuario puede cambiarla con answerQuestion()
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
      // Enviar al backend (puede ser público o requerir auth después)
      const response = await fetch(`${API_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answers.value })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || 'Error procesando respuestas')
      }

      const data = await response.json()
      diagnostico.value = data
      saveDiagnostico(data)

      // Limpiar progreso del quiz (ya terminó)
      localStorage.removeItem(STORAGE_KEY)

      return data
    } catch (err) {
      error.value = err.message || 'Error enviando el quiz. Intenta de nuevo.'
      console.error('submitQuiz error:', err)

      // Fallback: calcular diagnóstico local si el backend falla
      const localDiagnostico = calcularDiagnosticoLocal()
      diagnostico.value = localDiagnostico
      saveDiagnostico(localDiagnostico)
      return localDiagnostico
    } finally {
      submitting.value = false
    }
  }

  // ===== LOCAL FALLBACK (si el backend no responde) =====
  function calcularDiagnosticoLocal() {
    const pillarScores = {}
    const pillarShadows = {}

    answers.value.forEach(a => {
      if (!pillarScores[a.pillar]) {
        pillarScores[a.pillar] = 0
        pillarShadows[a.pillar] = 0
      }
      pillarScores[a.pillar] += a.score || 1

      // Sombra: respuestas de evitación (score bajo = sombra alta)
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
      multiplicador_tiempo: 1.5, // default
      indice_elasticidad_pct: elasticidad,
      _local: true // flag para saber que es fallback
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
    // State
    questions,
    currentQuestion,
    answers,
    diagnostico,
    loading,
    submitting,
    error,
    // Computed
    progress,
    isComplete,
    currentAnswer,
    // Actions
    fetchQuestions,
    answerQuestion,
    goBack,
    submitQuiz,
    reset,
    saveToStorage,
    loadFromStorage,
    saveDiagnostico,
    loadDiagnostico,
    clearStorage,
    clearError
  }
})