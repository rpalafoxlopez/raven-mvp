import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('raven_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {}
  })

  // Update API headers when token changes
  api.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  async function initAuth() {
    const savedToken = localStorage.getItem('raven_token')
    if (savedToken) {
      token.value = savedToken
      try {
        const { data } = await api.get('/api/auth/me')
        user.value = data
      } catch {
        logout()
      }
    }
  }

  async function loginWithGoogle() {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
      return data
    } finally {
      loading.value = false
    }
  }

  async function loginWithGithub() {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
      return data
    } finally {
      loading.value = false
    }
  }

  async function handleAuthCallback(accessToken) {
    loading.value = true
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        access_token: accessToken
      })

      token.value = data.token
      user.value = data.user
      localStorage.setItem('raven_token', data.token)
      api.defaults.headers.Authorization = `Bearer ${data.token}`

      return data.user
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    token.value = null
    user.value = null
    localStorage.removeItem('raven_token')
    delete api.defaults.headers.Authorization
  }

  async function fetchUser() {
    try {
      const { data } = await api.get('/api/auth/me')
      user.value = data
      return data
    } catch (err) {
      console.error('Fetch user error:', err)
      return null
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    api,
    initAuth,
    loginWithGoogle,
    loginWithGithub,
    handleAuthCallback,
    logout,
    fetchUser
  }
})