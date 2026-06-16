import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Mapa de pilares — mismo que el backend devuelve desde mapearPerfilRockstar
const PILARES_INFO = {
  presence:   { nombre: 'El Frontman',        
                rockstarPrincipal: 'Freddie Mercury',    
                color: '#ff6b35', 
                descripcion: 'Presencia magnética, comando de la atención sin esfuerzo.' },
  creativity: { nombre: 'El Guitar Hero',      rockstarPrincipal: 'Jimi Hendrix',       color: '#9b59b6', descripcion: 'Creatividad explosiva, originalidad como superpoder.' },
  resilience: { nombre: 'El Survivor',         rockstarPrincipal: 'Johnny Cash',        color: '#C0C0C0', descripcion: 'Resiliencia indestructible, vuelve más fuerte del fracaso.' },
  charisma:   { nombre: 'El Conector',         rockstarPrincipal: 'Bono',               color: '#D4AF37', descripcion: 'Carisma natural, energiza a todos a su alrededor.' },
  discipline: { nombre: 'El Productor',        rockstarPrincipal: 'Bruce Springsteen',  color: '#2ecc71', descripcion: 'Disciplina de hierro, convierte la práctica en arte.' },
  intuition:  { nombre: 'El Visionario',       rockstarPrincipal: 'David Bowie',        color: '#00d4ff', descripcion: 'Intuición sobrenatural, capta señales que otros ignoran.' },
  rebellion:  { nombre: 'El Rebelde',          rockstarPrincipal: 'Kurt Cobain',        color: '#e74c3c', descripcion: 'Rebeldía con causa, rompe reglas para crear nuevas.' },
  vision:     { nombre: 'El Dreamer',          rockstarPrincipal: 'John Lennon',        color: '#f39c12', descripcion: 'Visión cinematográfica, imagina futuros que otros no ven.' }
}

export const useQuizStore = defineStore('quiz', () => {
  const questions   = ref([])
  const currentQuestion = ref(0)
  const answers     = ref([])
  const diagnostico = ref(null)
  const loading     = ref(false)
  const submitting  = ref(false)
  const error       = ref(null)

  const progress = computed(() => {
    if (!questions.value.length) return 0
    return Math.round((currentQuestion.value / questions.value.length) * 100)
  })

  const isComplete = computed(() =>
    questions.value.length > 0 &&
    answers.value.filter(a => a !== null && a !== undefined).length === questions.value.length
  )

  const currentAnswer = computed(() =>
    answers.value[currentQuestion.value]?.answer ?? null
  )

  const STORAGE_KEY    = 'raven_quiz_progress'
  const DIAGNOSTICO_KEY = 'raven_diagnostico'

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentQuestion: currentQuestion.value,
      answers: answers.value,
      timestamp: Date.now()
    }))
  }

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return false
      const parsed = JSON.parse(stored)
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) { clearStorage(); return false }
      currentQuestion.value = parsed.currentQuestion || 0
      answers.value = parsed.answers || []
      return true
    } catch { clearStorage(); return false }
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
      loadFromStorage()
      return data
    } catch (err) {
      error.value = err.message || 'No pudimos cargar el cuestionario.'
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
      score: answerIndex  // 0-3, el backend normaliza a 0-100
    }

    // Reemplazar si ya existe, insertar en posición correcta si no
    const newAnswers = [...answers.value]
    newAnswers[currentQuestion.value] = answerData
    answers.value = newAnswers

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
      const payload = answers.value
        .filter(a => a !== null && a !== undefined)
        .map(a => ({ questionId: a.questionId, pillar: a.pillar, score: a.score }))

      const headers = { 'Content-Type': 'application/json' }
      const token = localStorage.getItem('raven_token')
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_URL}/api/quiz/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers: payload })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || errData.message || 'Error procesando respuestas')
      }

      const data = await response.json()

      // El backend devuelve { resultId, archetype, scores, answers }
      // Lo convertimos al formato de perfil que espera ResultsView
      const perfil = mapearScoresToPerfil(data.scores, data.archetype)
      const resultado = { ...data, perfil }

      saveDiagnostico(resultado)
      localStorage.removeItem(STORAGE_KEY)
      return resultado

    } catch (err) {
      console.error('submitQuiz error:', err)
      // Fallback local — calcular con las respuestas en memoria
      const localResult = calcularDiagnosticoLocal()
      saveDiagnostico(localResult)
      return localResult
    } finally {
      submitting.value = false
    }
  }

  // Convierte scores { presence: 75, creativity: 50, ... } al formato de perfil
  function mapearScoresToPerfil(scores, archetype) {
    const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const [dominanteId, dominanteScore] = ranking[0]
    const [secundarioId] = ranking[1] || [dominanteId]
    const [terciarioId] = ranking[2] || [secundarioId]

    const bloqueadoEntry = ranking.find(([id, score]) => score < 30)
    const bloqueadoId = bloqueadoEntry?.[0] || null

    const dom = PILARES_INFO[dominanteId] || PILARES_INFO['presence']
    const sec = PILARES_INFO[secundarioId] || PILARES_INFO['creativity']
    const ter = PILARES_INFO[terciarioId]  || null
    const blq = bloqueadoId ? PILARES_INFO[bloqueadoId] : null

    return {
      perfil: {
        dominante: {
          pilar: dominanteId,
          nombre: dom.nombre,
          rockstarPrincipal: dom.rockstarPrincipal,
          rockstar: dom.rockstarPrincipal,
          color: dom.color,
          descripcion: dom.descripcion,
          uso: dominanteScore,
          costo: Math.ceil(dominanteScore / 25)
        },
        secundario: {
          pilar: secundarioId,
          nombre: sec.nombre,
          rockstarPrincipal: sec.rockstarPrincipal,
          color: sec.color
        },
        terciario: ter ? { pilar: terciarioId, nombre: ter.nombre, rockstarPrincipal: ter.rockstarPrincipal } : null,
        bloqueado: blq ? { pilar: bloqueadoId, nombre: blq.nombre, rockstarPrincipal: blq.rockstarPrincipal } : null,
        alertas: {
          burnout: dominanteScore > 85,
          elasticidad: Math.max(0, 100 - (dominanteScore - (ranking[1]?.[1] || 0)))
        }
      },
      scores,
      archetype
    }
  }

  function calcularDiagnosticoLocal() {
    const pillarScores = {}
    answers.value.forEach(a => {
      if (!a) return
      pillarScores[a.pillar] = (pillarScores[a.pillar] || 0) + (a.score || 0)
    })

    // Normalizar a 0-100 (máx por pilar = 4 preguntas * 3 = 12)
    const scores = {}
    Object.keys(pillarScores).forEach(p => {
      scores[p] = Math.round((pillarScores[p] / 12) * 100)
    })

    const archetype = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'presence'
    return mapearScoresToPerfil(scores, archetype)
  }

  function reset() {
    currentQuestion.value = 0
    answers.value = []
    diagnostico.value = null
    error.value = null
    clearStorage()
  }

  function clearError() { error.value = null }

  return {
    questions, currentQuestion, answers, diagnostico,
    loading, submitting, error, progress, isComplete, currentAnswer,
    fetchQuestions, answerQuestion, goBack, submitQuiz, reset,
    saveToStorage, loadFromStorage, saveDiagnostico, clearStorage, clearError
  }
})