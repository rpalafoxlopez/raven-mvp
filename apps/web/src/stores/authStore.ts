import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

interface RavenUser {
  id: string
  email: string
  nombre?: string
  avatar?: string
  plan: 'free' | 'premium' | 'pro'
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<RavenUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isPremium = computed(() => user.value?.plan === 'premium' || user.value?.plan === 'pro')
  const isPro = computed(() => user.value?.plan === 'pro')

  const init = () => {
    const stored = localStorage.getItem('raven-user')
    if (stored) {
      user.value = JSON.parse(stored)
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.value?.token}`
    }
  }

  const loginWithGoogle = async () => {
    loading.value = true
    try {
      const { data, error: supaError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (supaError) throw supaError
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const loginWithGitHub = async () => {
    loading.value = true
    try {
      const { data, error: supaError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (supaError) throw supaError
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const handleAuthCallback = async () => {
    loading.value = true
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) throw new Error('No session')

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/callback`, {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: session.user
      })

      if (response.data.success) {
        user.value = response.data.data.user
        user.value.token = response.data.data.token
        localStorage.setItem('raven-user', JSON.stringify(user.value))
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.value.token}`
      }
      return response.data.data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    localStorage.removeItem('raven-user')
    delete axios.defaults.headers.common['Authorization']
  }

  const updatePlan = (plan: 'free' | 'premium' | 'pro') => {
    if (user.value) {
      user.value.plan = plan
      localStorage.setItem('raven-user', JSON.stringify(user.value))
    }
  }

  return {
    user, loading, error,
    isAuthenticated, isPremium, isPro,
    init, loginWithGoogle, loginWithGitHub,
    handleAuthCallback, logout, updatePlan
  }
})
