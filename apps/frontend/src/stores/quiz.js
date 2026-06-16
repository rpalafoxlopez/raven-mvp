import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ─────────────────────────────────────────────────────────────
// ARQUETIPOS REALES (P1-P8) — Sistema RockYourself
// ─────────────────────────────────────────────────────────────

export const ARQUETIPOS = {
  P1: {
    id: 'P1',
    nombre: 'El Arquitecto Sónico',
    icono: '🏗️',
    mecanismo: 'Planificación, ordenamiento micro y macro, diseño de sistemas, optimización de datos y predictibilidad.',
    usoFuncional: 'Capacidad para desglosar el caos en pasos lógicos, trazar hojas de ruta y construir infraestructura duradera.',
    sombra: 'Parálisis por exceso de métricas. Intentas resolver el agotamiento haciendo más listas, incapaz de tolerar la incertidumbre o improvisar.',
    sombraLabel: 'Rigidez / Burnout',
    color: '#2ecc71',
    colorSombra: '#e74c3c',
    rockstarPrincipal: 'Bruce Springsteen',
    rockstarSecundario: 'James Hetfield'
  },
  P2: {
    id: 'P2',
    nombre: 'El Alienígena Camaleón',
    icono: '👽',
    mecanismo: 'Flexibilidad radical, cambio de código, adaptabilidad, reinvención y corte de lazos.',
    usoFuncional: 'Agilidad para abandonar barcos que se hunden, despojarse de identidades obsoletas y sobrevivir en entornos completamente nuevos.',
    sombra: 'Evasión crónica. Huyes y destruyes proyectos al primer síntoma de aburrimiento o fricción, confundiendo el escape con la evolución.',
    sombraLabel: 'Fuga / Evasión',
    color: '#9b59b6',
    colorSombra: '#c0392b',
    rockstarPrincipal: 'David Bowie',
    rockstarSecundario: 'Lady Gaga'
  },
  P3: {
    id: 'P3',
    nombre: 'El Chamán de la Tribu',
    icono: '🔥',
    mecanismo: 'Cohesión, reciprocidad, soporte colectivo, empatía operativa y lealtad de red.',
    usoFuncional: 'Capacidad para unificar a las personas, resolver conflictos internos, pedir ayuda y operar en bloque como una tribu.',
    sombra: 'Pérdida de autonomía. Te cargas los problemas de todos, te niegas a avanzar si alguien se queda atrás, o te paralizas sin validación externa.',
    sombraLabel: 'Codependencia / Burnout',
    color: '#e67e22',
    colorSombra: '#c0392b',
    rockstarPrincipal: 'Bono',
    rockstarSecundario: 'Freddie Mercury'
  },
  P4: {
    id: 'P4',
    nombre: 'El Nobel Errante',
    icono: '🌑',
    mecanismo: 'Pausa, introspección, abstracción conceptual, aislamiento estratégico y distancia analítica.',
    usoFuncional: 'Detener el ruido del entorno para observar el panorama completo, recuperar la nitidez mental y no reaccionar impulsivamente.',
    sombra: 'Desconexión absoluta. Te refugias en tu mente, teorizando sin actuar, usando el "análisis" como excusa para no enfrentarte a la realidad material.',
    sombraLabel: 'Parálisis / Aislamiento',
    color: '#34495e',
    colorSombra: '#2c3e50',
    rockstarPrincipal: 'Bob Dylan',
    rockstarSecundario: 'Thom Yorke'
  },
  P5: {
    id: 'P5',
    nombre: 'El Forajido del Duelo',
    icono: '⚱️',
    mecanismo: 'Procesamiento del dolor, catarsis, aceptación de la pérdida y habitar la crisis sin filtros.',
    usoFuncional: 'Valentía para mirar la herida de frente, asimilar lo que se rompió y transmutar el sufrimiento en significado, arte o madurez.',
    sombra: 'Adicción a la tragedia. Te enamoras de tus propias cicatrices, densificas tus problemas y usas tu sufrimiento como identidad para no avanzar.',
    sombraLabel: 'Melancolía / Burnout',
    color: '#8e44ad',
    colorSombra: '#2c3e50',
    rockstarPrincipal: 'Kurt Cobain',
    rockstarSecundario: 'Ian Curtis'
  },
  P6: {
    id: 'P6',
    nombre: 'El Iconoclasta Satírico',
    icono: '🎭',
    mecanismo: 'Desmitificación, ironía defensiva, relativización del drama y cinismo táctico.',
    usoFuncional: 'Capacidad para reírse del desastre, quitarle autoridad a sistemas opresivos y usar el sarcasmo para no ser aplastado por la solemnidad del problema.',
    sombra: 'Superficialidad defensiva. Nada se toma en serio. Usas el chiste para anestesiar el dolor real y evitar cualquier confrontación profunda.',
    sombraLabel: 'Evasión / Cinismo',
    color: '#f1c40f',
    colorSombra: '#7f8c8d',
    rockstarPrincipal: 'Frank Zappa',
    rockstarSecundario: 'Liam Gallagher'
  },
  P7: {
    id: 'P7',
    nombre: 'La Resistencia Obrera',
    icono: '⚒️',
    mecanismo: 'Persistencia a largo plazo, contención del daño, soporte de la carga, disciplina dura y estoicismo.',
    usoFuncional: 'Fortaleza moral para morder el polvo, aguantar el castigo cuando las cosas se ponen difíciles y no quebrarse ante el esfuerzo.',
    sombra: 'El síndrome del mártir. Aguantas peso innecesario, glorificas el exceso de trabajo y te niegas a buscar vías más inteligentes por puro orgullo obrero.',
    sombraLabel: 'Terquedad / Burnout',
    color: '#C0C0C0',
    colorSombra: '#7f8c8d',
    rockstarPrincipal: 'Johnny Cash',
    rockstarSecundario: 'Bruce Dickinson'
  },
  P8: {
    id: 'P8',
    nombre: 'El Canalla Dionisíaco',
    icono: '🍷',
    mecanismo: 'Impulso corporal, juego, instinto animal, velocidad, riesgo calculado y acción visceral.',
    usoFuncional: 'Tomar decisiones rápidas con las tripas, romper la inercia mental mediante la aceleración física y disfrutar de la intensidad del momento.',
    sombra: 'Impulsividad destructiva. Riesgos ciegos, hedonismo que sabotea los planes a largo plazo y quema de recursos por pura incapacidad de tolerar el aburrimiento.',
    sombraLabel: 'Caos / Exceso',
    color: '#e74c3c',
    colorSombra: '#c0392b',
    rockstarPrincipal: 'Jimi Hendrix',
    rockstarSecundario: 'Keith Richards'
  }
}

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────

export const useQuizStore = defineStore('quiz', () => {
  // ── State ──
  const questions = ref([])
  const currentQuestion = ref(0)
  const answers = ref([])
  const diagnostico = ref(null)
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref(null)

  // ── Getters ──
  const progress = computed(() => {
    if (!questions.value.length) return 0
    return Math.round((currentQuestion.value / questions.value.length) * 100)
  })

  const isComplete = computed(() =>
    questions.value.length > 0 &&
    answers.value.filter(a => a !== null && a !== undefined).length === questions.value.length
  )

  const currentQuestionData = computed(() =>
    questions.value[currentQuestion.value] || null
  )

  const currentAnswer = computed(() => {
    const q = currentQuestionData.value
    if (!q) return null
    const found = answers.value.find(a => a.questionId === q.id)
    return found ?? null
  })

  const faseActual = computed(() => {
    const q = currentQuestionData.value
    return q?.fase || null
  })

  const faseLabel = computed(() => {
    const labels = {
      cronologia: 'FASE 0 — Cronología',
      activacion: 'FASE I — Activación Automática',
      costo: 'FASE II — Costo Energético',
      flexibilidad: 'FASE III — Flexibilidad',
      sombra: 'FASE IV — Sombra y Bloqueo',
      espejo: 'FASE V — Reactivos Espejo',
      validacion: 'Validación Final'
    }
    return labels[faseActual.value] || ''
  })

  // ── Storage ──
  const STORAGE_KEY = 'raven_quiz_v3'
  const DIAGNOSTICO_KEY = 'raven_diagnostico_v3'

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
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        clearStorage()
        return false
      }
      currentQuestion.value = parsed.currentQuestion || 0
      answers.value = parsed.answers || []
      return true
    } catch {
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

  // ── API ──
   async function fetchQuestions() {
    loading.value = true
    error.value = null
    console.log('🚀 fetchQuestions iniciando... URL:', `${API_URL}/api/quiz/questions`) // DEBUG
    
    try {
      const response = await fetch(`${API_URL}/api/quiz/questions`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
      
      console.log('📡 Response status:', response.status) // DEBUG
      console.log('📡 Response headers:', [...response.headers.entries()]) // DEBUG
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const text = await response.text() // Leer como texto primero
      console.log('📄 Raw response (primeros 200 chars):', text.substring(0, 200)) // DEBUG
      
      let data
      try {
        data = JSON.parse(text)
      } catch (parseErr) {
        console.error('❌ JSON parse error:', parseErr)
        console.error('❌ Raw text:', text.substring(0, 500))
        throw new Error('La respuesta del servidor no es JSON válido')
      }
      
      console.log('✅ Preguntas cargadas:', data.length) // DEBUG
      questions.value = data
      loadFromStorage()
      return data
      
    } catch (err) {
      console.error('❌ fetchQuestions error:', err.name, err.message) // DEBUG
      error.value = err.message || 'No pudimos cargar el cuestionario.'
      return null
    } finally {
      loading.value = false
    }
  }

  // ── Actions ──
  function answerQuestion(valor) {
    const q = questions.value[currentQuestion.value]
    if (!q) return

    const idx = answers.value.findIndex(a => a.questionId === q.id)
    const respuesta = { questionId: q.id, valor }

    if (idx >= 0) {
      answers.value[idx] = respuesta
    } else {
      answers.value.push(respuesta)
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

  function jumpToQuestion(index) {
    if (index >= 0 && index < questions.value.length) {
      currentQuestion.value = index
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
        .map(a => ({ questionId: a.questionId, valor: a.valor }))

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
      saveDiagnostico(data)
      localStorage.removeItem(STORAGE_KEY)
      return data

    } catch (err) {
      console.error('submitQuiz error:', err)
      error.value = err.message || 'Error de conexión. Intenta de nuevo.'
      return null
    } finally {
      submitting.value = false
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

  // ── Helpers de render ──
  function getArquetipoInfo(arquetipoId) {
    return ARQUETIPOS[arquetipoId] || null
  }

  function getEstadoLabel(estado) {
    const labels = {
      'saludable': '✅ Saludable',
      'en-sombra': '⚠️ En Sombra',
      'equilibrado': '⚖️ Equilibrado',
      'dominante': '🔥 Dominante',
      'dormido': '💤 Dormido'
    }
    return labels[estado] || estado
  }

  function getEstadoColor(estado) {
    const colors = {
      'saludable': '#2ecc71',
      'en-sombra': '#e74c3c',
      'equilibrado': '#f39c12',
      'dominante': '#D4AF37',
      'dormido': '#95a5a6'
    }
    return colors[estado] || '#bdc3c7'
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
    // Getters
    progress,
    isComplete,
    currentQuestionData,
    currentAnswer,
    faseActual,
    faseLabel,
    // Actions
    fetchQuestions,
    answerQuestion,
    goBack,
    jumpToQuestion,
    submitQuiz,
    reset,
    clearError,
    saveDiagnostico,
    loadFromStorage,
    // Helpers
    getArquetipoInfo,
    getEstadoLabel,
    getEstadoColor
  }
})
