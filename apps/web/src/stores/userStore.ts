import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Setlist, DiagnosticoRaven } from '@raven/shared-types'

const API = () => import.meta.env.VITE_API_URL

export const useUserStore = defineStore('user', () => {
  const setlist = ref<Setlist | null>(null)
  const conversacion = ref<any[]>([])
  const stats = ref<any>(null)
  const loading = ref(false)

  const generateSetlist = async (diagnostico: DiagnosticoRaven) => {
    loading.value = true
    try {
      const response = await axios.post(`${API()}/api/ai/setlist`, { diagnostico })
      if (response.data.success) setlist.value = response.data.data
      return response.data
    } catch (err: any) {
      console.error('Error generando setlist:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (mensaje: string, setlistId: string) => {
    try {
      const response = await axios.post(`${API()}/api/ai/chat`, {
        mensajes: [{ role: 'user', content: mensaje }],
        setlistId
      })
      if (response.data.success) conversacion.value = response.data.data.mensajes
      return response.data
    } catch (err: any) {
      console.error('Error en chat:', err)
      return null
    }
  }

  const loadConversation = async (setlistId: string) => {
    try {
      const response = await axios.get(`${API()}/api/ai/conversation/${setlistId}`)
      if (response.data.success) conversacion.value = response.data.data.mensajes || []
    } catch (err) {
      console.error('Error cargando conversación:', err)
    }
  }

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API()}/api/user/stats`)
      if (response.data.success) stats.value = response.data.data
    } catch (err) {
      console.error('Error cargando stats:', err)
    }
  }

  // Marcar/desmarcar sprint como completado
  const toggleSprint = async (semana: number) => {
    if (!setlist.value?._id) return
    const sprint = setlist.value.sprints.find(s => s.semana === semana)
    if (!sprint) return

    // Optimistic update
    sprint.completado = !sprint.completado

    try {
      await axios.patch(
        `${API()}/api/ai/sprint/${setlist.value._id}/${semana}`,
        { completado: sprint.completado }
      )
    } catch (err) {
      // Rollback si falla
      sprint.completado = !sprint.completado
      console.error('Error actualizando sprint:', err)
    }
  }

  return {
    setlist, conversacion, stats, loading,
    generateSetlist, sendMessage, loadConversation, loadStats, toggleSprint
  }
})
