import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useCoachingStore = defineStore('coaching', () => {
  const plan = ref(null)
  const chatMessages = ref([])
  const loading = ref(false)
  const sending = ref(false)

  async function fetchPlan() {
    loading.value = true
    try {
      const authStore = useAuthStore()
      const { data } = await authStore.api.get('/api/coaching/plan')
      plan.value = data
      chatMessages.value = data.chatHistory || []
      return data
    } finally {
      loading.value = false
    }
  }

  async function updateGoals(goals) {
    const authStore = useAuthStore()
    const { data } = await authStore.api.put('/api/coaching/goals', { goals })
    plan.value = data
    return data
  }

  async function addAction(title, description, dueDate) {
    const authStore = useAuthStore()
    const { data } = await authStore.api.post('/api/coaching/actions', {
      title,
      description,
      dueDate
    })
    plan.value = data
    return data
  }

  async function toggleAction(actionId, completed) {
    const authStore = useAuthStore()
    const { data } = await authStore.api.patch(`/api/coaching/actions/${actionId}`, {
      completed
    })
    plan.value = data
    return data
  }

  async function sendMessage(message) {
    sending.value = true
    try {
      const authStore = useAuthStore()

      // Add user message locally
      chatMessages.value.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      })

      const { data } = await authStore.api.post('/api/coaching/chat', { message })

      // Add AI response
      chatMessages.value.push({
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      })

      return data.response
    } finally {
      sending.value = false
    }
  }

  return {
    plan,
    chatMessages,
    loading,
    sending,
    fetchPlan,
    updateGoals,
    addAction,
    toggleAction,
    sendMessage
  }
})