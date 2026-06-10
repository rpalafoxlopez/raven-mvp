import axios from 'axios'
import type { DiagnosticoRaven } from '@raven/shared-types'

export const useAIAgent = () => {
  const generateSetlist = async (diagnostico: DiagnosticoRaven) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/setlist`, { diagnostico })
      return response.data
    } catch (err: any) {
      console.error('Error:', err)
      return null
    }
  }

  const chat = async (mensajes: { role: string; content: string }[], setlistId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, { mensajes, setlistId })
      return response.data
    } catch (err: any) {
      console.error('Error:', err)
      return null
    }
  }

  return { generateSetlist, chat }
}
