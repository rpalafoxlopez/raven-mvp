// stores/quizStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ─────────────────────────────────────────────────────────────
// ARQUETIPOS REALES (P1-P8) — Sistema RockYourself
// ─────────────────────────────────────────────────────────────

export const ARQUETIPOS = {
  architect: {
    id: 'architect',
    backendKey: 'discipline',
    codigo: 'P1',
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
  chameleon: {
    id: 'chameleon',
    backendKey: 'intuition',
    codigo: 'P2',
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
  shaman: {
    id: 'shaman',
    backendKey: 'charisma',
    codigo: 'P3',
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
  wanderer: {
    id: 'wanderer',
    backendKey: 'vision',
    codigo: 'P4',
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
  outlaw: {
    id: 'outlaw',
    backendKey: 'rebellion',
    codigo: 'P5',
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
  iconoclast: {
    id: 'iconoclast',
    backendKey: 'creativity',
    codigo: 'P6',
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
  worker: {
    id: 'worker',
    backendKey: 'resilience',
    codigo: 'P7',
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
  dionysian: {
    id: 'dionysian',
    backendKey: 'presence',
    codigo: 'P8',
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

// Helper: mapeo inverso backendKey → arquetipoId
const BACKEND_TO_ARQUETIPO = {}
Object.values(ARQUETIPOS).forEach(a => {
  if (a.backendKey) BACKEND_TO_ARQUETIPO[a.backendKey] = a.id
})

// ─────────────────────────────────────────────────────────────
// PREGUNTAS (32 total: 4 por arquetipo, 2 funcional + 2 sombra)
// ─────────────────────────────────────────────────────────────

// P1: Arquitecto
const P1 = [
  { id: 1,  arquetipoId: 'architect', backendPillar: 'discipline', tipo: 'funcional', peso: 2, texto: 'Cuando todo se descontrola, mi instinto es sentarme y reorganizar el caos en pasos concretos.' },
  { id: 2,  arquetipoId: 'architect', backendPillar: 'discipline', tipo: 'funcional', peso: 1, texto: 'Me siento en paz cuando tengo un plan claro y métricas que medir.' },
  { id: 3,  arquetipoId: 'architect', backendPillar: 'discipline', tipo: 'sombra',    peso: 3, texto: 'Cuando estoy agotado, hago más listas y planifico más duro, como si organizar fuera a curar el cansancio.' },
  { id: 4,  arquetipoId: 'architect', backendPillar: 'discipline', tipo: 'sombra',    peso: 2, texto: 'Me paralizo si no tengo certeza del resultado antes de empezar.' },
]

// P2: Camaleón
const P2 = [
  { id: 5,  arquetipoId: 'chameleon', backendPillar: 'intuition', tipo: 'funcional', peso: 2, texto: 'Sé cuándo un proyecto, relación o trabajo ya no tiene vida y me despido sin mirar atrás.' },
  { id: 6,  arquetipoId: 'chameleon', backendPillar: 'intuition', tipo: 'funcional', peso: 1, texto: 'Me reinvencio fácilmente. No me aferro a versiones viejas de mí mismo.' },
  { id: 7,  arquetipoId: 'chameleon', backendPillar: 'intuition', tipo: 'sombra',    peso: 3, texto: 'He abandonado proyectos prometedores solo porque me aburrí o sentí fricción.' },
  { id: 8,  arquetipoId: 'chameleon', backendPillar: 'intuition', tipo: 'sombra',    peso: 2, texto: 'A veces confundo "evolucionar" con "huir". Cambio de ciudad/trabajo/pareja para no enfrentar lo difícil.' },
]

// P3: Chamán
const P3 = [
  { id: 9,  arquetipoId: 'shaman', backendPillar: 'charisma', tipo: 'funcional', peso: 2, texto: 'Soy la persona a la que todos acuden en crisis. Sé contener el caos ajeno.' },
  { id: 10, arquetipoId: 'shaman', backendPillar: 'charisma', tipo: 'funcional', peso: 1, texto: 'Prefiero avanzar en equipo, aunque sea más lento, antes que solo y rápido.' },
  { id: 11, arquetipoId: 'shaman', backendPillar: 'charisma', tipo: 'sombra',    peso: 3, texto: 'Me siento culpable si avanzo mientras alguien de mi círculo está atrás o sufriendo.' },
  { id: 12, arquetipoId: 'shaman', backendPillar: 'charisma', tipo: 'sombra',    peso: 2, texto: 'Necesito que otros validen mis decisiones. Sin respaldo externo, dudo de mi propio juicio.' },
]

// P4: Errante
const P4 = [
  { id: 13, arquetipoId: 'wanderer', backendPillar: 'vision', tipo: 'funcional', peso: 2, texto: 'Cuando el mundo exige reacción inmediata, sé detenerme y no responder. Observo primero.' },
  { id: 14, arquetipoId: 'wanderer', backendPillar: 'vision', tipo: 'funcional', peso: 1, texto: 'Necesito períodos de soledad para pensar. Sin ellos, me siento sobrecargado.' },
  { id: 15, arquetipoId: 'wanderer', backendPillar: 'vision', tipo: 'sombra',    peso: 3, texto: 'He pasado meses "analizando" mi situación sin dar un solo paso concreto.' },
  { id: 16, arquetipoId: 'wanderer', backendPillar: 'vision', tipo: 'sombra',    peso: 2, texto: 'Uso la introspección como refugio. Prefiero teorizar sobre mi vida a vivirla.' },
]

// P5: Forajido
const P5 = [
  { id: 17, arquetipoId: 'outlaw', backendPillar: 'rebellion', tipo: 'funcional', peso: 2, texto: 'No evito el dolor. Cuando algo se rompe, me quedo ahí hasta entender qué pasó y qué significa.' },
  { id: 18, arquetipoId: 'outlaw', backendPillar: 'rebellion', tipo: 'funcional', peso: 1, texto: 'He transformado experiencias dolorosas en arte, música o alguna forma de expresión.' },
  { id: 19, arquetipoId: 'outlaw', backendPillar: 'rebellion', tipo: 'sombra',    peso: 3, texto: 'Hay días en los que mi sufrimiento se siente más real que cualquier otra parte de mí.' },
  { id: 20, arquetipoId: 'outlaw', backendPillar: 'rebellion', tipo: 'sombra',    peso: 2, texto: 'Me cuesta dejar atrás el pasado. No porque no quiera, sino porque se siente traición.' },
]

// P6: Iconoclasta
const P6 = [
  { id: 21, arquetipoId: 'iconoclast', backendPillar: 'creativity', tipo: 'funcional', peso: 2, texto: 'Sé usar el humor para desarmar situaciones que a otros les aplastarían.' },
  { id: 22, arquetipoId: 'iconoclast', backendPillar: 'creativity', tipo: 'funcional', peso: 1, texto: 'No me tomo en serio los roles que la sociedad impone. Me río de la autoridad.' },
  { id: 23, arquetipoId: 'iconoclast', backendPillar: 'creativity', tipo: 'sombra',    peso: 3, texto: 'Cuando algo duele de verdad, hago un chiste. Es mi forma de no sentirlo.' },
  { id: 24, arquetipoId: 'iconoclast', backendPillar: 'creativity', tipo: 'sombra',    peso: 2, texto: 'La gente me dice que nunca me ve "vulnerable" o "real". Siempre estoy "performeando".' },
]

// P7: Resistencia
const P7 = [
  { id: 25, arquetipoId: 'worker', backendPillar: 'resilience', tipo: 'funcional', peso: 2, texto: 'He aguantado temporadas duras que otros habrían abandonado. No me quiebro fácil.' },
  { id: 26, arquetipoId: 'worker', backendPillar: 'resilience', tipo: 'funcional', peso: 1, texto: 'Creo en el esfuerzo constante más que en el talento natural.' },
  { id: 27, arquetipoId: 'worker', backendPillar: 'resilience', tipo: 'sombra',    peso: 3, texto: 'Sigo cargando con responsabilidades que ya no son mías porque "aguantar" es mi identidad.' },
  { id: 28, arquetipoId: 'worker', backendPillar: 'resilience', tipo: 'sombra',    peso: 2, texto: 'Glorifico el sacrificio. Decir "estoy exhausto" me hace sentir más válido que decir "necesito ayuda".' },
]

// P8: Dionisíaco
const P8 = [
  { id: 29, arquetipoId: 'dionysian', backendPillar: 'presence', tipo: 'funcional', peso: 2, texto: 'Cuando estoy atascado mentalmente, muevo el cuerpo: bailo, corro, manejo. La física rompe la parálisis.' },
  { id: 30, arquetipoId: 'dionysian', backendPillar: 'presence', tipo: 'funcional', peso: 1, texto: 'Tomo decisiones importantes con las tripas, no con hojas de cálculo. Y usualmente funcionan.' },
  { id: 31, arquetipoId: 'dionysian', backendPillar: 'presence', tipo: 'sombra',    peso: 3, texto: 'He quemado recursos, relaciones o salud por no poder tolerar la quietud o el aburrimiento.' },
  { id: 32, arquetipoId: 'dionysian', backendPillar: 'presence', tipo: 'sombra',    peso: 2, texto: 'Mi impulso de "hacer algo" me ha metido en problemas mayores que los que intentaba resolver.' },
]

export const TODAS_LAS_PREGUNTAS = [...P1, ...P2, ...P3, ...P4, ...P5, ...P6, ...P7, ...P8]

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────

export const useQuizStore = defineStore('quiz', () => {
  // ── State ──
  const questions = ref(TODAS_LAS_PREGUNTAS)
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
    answers.value.filter(a => a !== null && a !== undefined).length === questions.value.length
  )

  const currentAnswer = computed(() => {
    const q = questions.value[currentQuestion.value]
    if (!q) return null
    const found = answers.value.find(a => a.preguntaId === q.id)
    return found?.valor ?? null
  })

  const preguntaActual = computed(() => questions.value[currentQuestion.value] || null)

  // ── Cálculo de resultados (dual: funcional vs sombra) ──
  const resultadosCalculados = computed(() => {
    const arquetipoIds = Object.keys(ARQUETIPOS)
    
    const resultados = arquetipoIds.map(id => {
      const arquetipo = ARQUETIPOS[id]
      const preguntasArquetipo = TODAS_LAS_PREGUNTAS.filter(p => p.arquetipoId === id)
      const respuestasArquetipo = answers.value.filter(r => 
        preguntasArquetipo.some(p => p.id === r.preguntaId)
      )

      // Separar funcional vs sombra
      const funcional = respuestasArquetipo.filter(r => {
        const p = preguntasArquetipo.find(pp => pp.id === r.preguntaId)
        return p.tipo === 'funcional'
      })
      const sombra = respuestasArquetipo.filter(r => {
        const p = preguntasArquetipo.find(pp => pp.id === r.preguntaId)
        return p.tipo === 'sombra'
      })

      // Calcular puntajes (0-10 por pregunta, max 20 por tipo)
      const puntajeFuncional = funcional.reduce((acc, r) => acc + r.valor, 0)
      const maxFuncional = funcional.length * 5
      const porcentajeFuncional = maxFuncional > 0 ? (puntajeFuncional / maxFuncional) * 100 : 0

      const puntajeSombra = sombra.reduce((acc, r) => acc + r.valor, 0)
      const maxSombra = sombra.length * 5
      const porcentajeSombra = maxSombra > 0 ? (puntajeSombra / maxSombra) * 100 : 0

      const puntajeTotal = puntajeFuncional + puntajeSombra

      // Determinar estado
      let estado
      const diff = porcentajeFuncional - porcentajeSombra
      
      if (puntajeTotal < 8) {
        estado = 'dormido'
      } else if (porcentajeSombra > 60 && porcentajeFuncional < 40) {
        estado = 'en-sombra'
      } else if (porcentajeFuncional > 60 && porcentajeSombra < 40) {
        estado = 'saludable'
      } else if (Math.abs(diff) < 15) {
        estado = 'equilibrado'
      } else {
        estado = 'dominante'
      }

      return {
        arquetipoId: id,
        puntajeFuncional,
        puntajeSombra,
        puntajeTotal,
        porcentajeFuncional: Math.round(porcentajeFuncional),
        porcentajeSombra: Math.round(porcentajeSombra),
        estado
      }
    }).sort((a, b) => b.puntajeTotal - a.puntajeTotal)

    const dominante = resultados[0]
    const secundario = resultados[1]
    const enSombra = resultados.find(r => r.estado === 'en-sombra') || null
    const dormidos = resultados.filter(r => r.estado === 'dormido')

    // Generar código de perfil (top 3)
    const top3 = resultados.slice(0, 3)
    const codigo = top3.map(r => ARQUETIPOS[r.arquetipoId].codigo).join('-')
    const nombre = top3.map(r => ARQUETIPOS[r.arquetipoId].nombre).join(' + ')

    // Alertas
    const alertas = {
      burnout: resultados.some(r => 
        (r.arquetipoId === 'architect' || r.arquetipoId === 'worker' || r.arquetipoId === 'shaman') && 
        r.estado === 'en-sombra'
      ),
      fuga: resultados.some(r => 
        r.arquetipoId === 'chameleon' && r.estado === 'en-sombra'
      ),
      paralisis: resultados.some(r => 
        r.arquetipoId === 'wanderer' && r.estado === 'en-sombra'
      ),
      codependencia: resultados.some(r => 
        r.arquetipoId === 'shaman' && r.estado === 'en-sombra'
      )
    }

    return {
      resultados,
      dominante,
      secundario,
      enSombra,
      dormidos,
      perfil: {
        codigo,
        nombre,
        descripcion: generarDescripcionPerfil(dominante, secundario, enSombra),
        alertas
      }
    }
  })

  // ── Storage ──
  const STORAGE_KEY = 'raven_quiz_v2'
  const DIAGNOSTICO_KEY = 'raven_diagnostico_v2'

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

  // ── API (compatibilidad con backend viejo) ──
  async function fetchQuestions() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    loadFromStorage()
    loading.value = false
    return questions.value
  }

  async function submitQuiz() {
    if (!isComplete.value) {
      error.value = 'Responde todas las preguntas primero.'
      return null
    }

    submitting.value = true
    error.value = null

    try {
      const localResult = resultadosCalculados.value

      const payload = {
        answers: answers.value.map(a => {
          const q = TODAS_LAS_PREGUNTAS.find(p => p.id === a.preguntaId)
          return {
            questionId: a.preguntaId,
            pillar: q.backendPillar,
            score: a.valor,
            arquetipoId: q.arquetipoId,
            tipo: q.tipo
          }
        }),
        perfil: localResult.perfil
      }

      const headers = { 'Content-Type': 'application/json' }
      const token = localStorage.getItem('raven_token')
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_URL}/api/quiz/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Backend error')

      const serverData = await response.json()
      
      const resultado = {
        ...localResult,
        resultId: serverData.resultId,
        serverScores: serverData.scores
      }

      saveDiagnostico(resultado)
      localStorage.removeItem(STORAGE_KEY)
      return resultado

    } catch (err) {
      console.error('submitQuiz error:', err)
      const localResult = resultadosCalculados.value
      saveDiagnostico(localResult)
      return localResult
    } finally {
      submitting.value = false
    }
  }

  // ── Actions ──
  function answerQuestion(valor) {
    const q = questions.value[currentQuestion.value]
    if (!q) return

    const idx = answers.value.findIndex(a => a.preguntaId === q.id)
    const respuesta = { preguntaId: q.id, valor }

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

  // ── Helpers ──
  function generarDescripcionPerfil(dom, sec, sombra) {
    const d = ARQUETIPOS[dom.arquetipoId]
    const s = ARQUETIPOS[sec.arquetipoId]
    
    let desc = `Tu mecanismo principal es **${d.nombre}** (${d.codigo}): ${d.mecanismo.toLowerCase().slice(0, 60)}... `
    desc += `Tu segundo motor es **${s.nombre}** (${s.codigo}). `
    
    if (sombra) {
      const sh = ARQUETIPOS[sombra.arquetipoId]
      desc += `⚠️ Atención: tu **${sh.nombre}** está en sombra (${sh.sombraLabel}). `
    }
    
    return desc
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
    progress,
    isComplete,
    currentAnswer,
    preguntaActual,
    resultadosCalculados,
    fetchQuestions,
    answerQuestion,
    goBack,
    jumpToQuestion,
    submitQuiz,
    reset,
    clearError,
    saveDiagnostico,
    loadFromStorage
  }
})