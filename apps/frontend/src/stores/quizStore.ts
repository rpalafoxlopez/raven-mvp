import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { DiagnosticoRaven, PilarId, EvaluacionRaw } from '@raven/shared-types'

interface RespuestaQuiz {
  preguntaId: number
  seleccion: string
}

export const useQuizStore = defineStore('quiz', () => {
  const respuestas = ref<RespuestaQuiz[]>([])
  const diagnostico = ref<DiagnosticoRaven | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const faseActual = ref(0)

  const fase0 = computed(() => {
    const r = respuestas.value.find(r => r.preguntaId === 0)
    if (!r) return 1.0
    const valores: Record<string, number> = { 'A': 1.0, 'B': 1.2, 'C': 1.5, 'D': 2.0, 'E': 3.0 }
    return valores[r.seleccion] || 1.0
  })

  const fase1 = computed((): PilarId[] => {
    return respuestas.value
      .filter(r => r.preguntaId >= 1 && r.preguntaId <= 8)
      .map(r => r.seleccion as PilarId)
  })

  const fase2 = computed(() => {
    const costos: Record<string, number> = {}
    respuestas.value
      .filter(r => r.preguntaId >= 9 && r.preguntaId <= 16)
      .forEach(r => {
        const pilar = ['P1','P2','P3','P4','P5','P6','P7','P8'][r.preguntaId - 9]
        costos[pilar] = parseInt(r.seleccion)
      })
    return costos
  })

  const fase3 = computed((): PilarId[] => {
    return respuestas.value
      .filter(r => r.preguntaId >= 17 && r.preguntaId <= 24)
      .map(r => r.seleccion as PilarId)
  })

  const fase4 = computed((): PilarId[] => {
    return respuestas.value
      .filter(r => r.preguntaId >= 25 && r.preguntaId <= 28)
      .map(r => r.seleccion as PilarId)
  })

  const fase5 = computed(() => {
    return respuestas.value
      .filter(r => r.preguntaId >= 29 && r.preguntaId <= 32)
      .map(r => parseInt(r.seleccion))
  })

  const filtros = computed(() => {
    const q33 = respuestas.value.find(r => r.preguntaId === 33)
    const q34 = respuestas.value.find(r => r.preguntaId === 34)
    return {
      q33_prohibido: (q33?.seleccion || 'P1') as PilarId,
      q34_llave: (q34?.seleccion || 'P2') as PilarId
    }
  })

  const setRespuesta = (preguntaId: number, seleccion: string) => {
    const existing = respuestas.value.findIndex(r => r.preguntaId === preguntaId)
    if (existing >= 0) {
      respuestas.value[existing].seleccion = seleccion
    } else {
      respuestas.value.push({ preguntaId, seleccion })
    }
  }

  const getRespuesta = (preguntaId: number) => {
    return respuestas.value.find(r => r.preguntaId === preguntaId)?.seleccion
  }

  const submitQuiz = async () => {
    loading.value = true
    error.value = null

    const rawData: EvaluacionRaw = {
      timestamp: new Date(),
      fase_0: fase0.value,
      fase_1: fase1.value,
      fase_2: fase2.value as any,
      fase_3: fase3.value,
      fase_4: fase4.value,
      fase_5: fase5.value,
      filtros: filtros.value
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/quiz/submit`, rawData)
      if (response.data.success) {
        diagnostico.value = response.data.data.diagnostico
        localStorage.setItem('quiz-result', JSON.stringify({
          diagnostico: diagnostico.value,
          perfil: response.data.data.perfil,
          raw: rawData
        }))
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const loadFromStorage = () => {
    const stored = localStorage.getItem('quiz-result')
    if (stored) {
      const parsed = JSON.parse(stored)
      diagnostico.value = parsed.diagnostico
    }
  }

  const reset = () => {
    respuestas.value = []
    diagnostico.value = null
    faseActual.value = 0
    localStorage.removeItem('quiz-result')
  }

  return {
    respuestas, diagnostico, loading, error, faseActual,
    setRespuesta, getRespuesta, submitQuiz, loadFromStorage, reset
  }
})
