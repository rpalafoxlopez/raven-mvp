<template>
  <div class="min-h-screen bg-neutral-950">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-rock-950/50 to-neutral-950"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div class="text-center">
          <h1 class="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            <span class="text-white">Descubre tu</span>
            <br />
            <span class="text-gradient">Arquetipo Rockstar</span>
          </h1>

          <p class="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            32 preguntas. 8 pilares. 1 versión de ti que no sabías que existía.
            Basado en la psicología de las leyendas del rock.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              v-if="!authStore.isAuthenticated"
              @click="authStore.loginWithGoogle()"
              class="btn-primary text-lg px-8 py-4"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">Conectando...</span>
              <span v-else>🎸 Empezar con Google</span>
            </button>

            <button 
              v-if="!authStore.isAuthenticated"
              @click="authStore.loginWithGithub()"
              class="btn-secondary text-lg px-8 py-4"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">Conectando...</span>
              <span v-else>⚡ Empezar con GitHub</span>
            </button>

            <router-link 
              v-else
              to="/quiz"
              class="btn-primary text-lg px-8 py-4"
            >
              🎸 Comenzar Quiz
            </router-link>
          </div>

          <!-- Archetype Preview -->
          <div class="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div v-for="arch in archetypes" :key="arch.name" 
                 class="card hover:border-rock-500/50 transition-all duration-300 group cursor-pointer">
              <div class="text-3xl mb-2 group-hover:scale-110 transition-transform">{{ arch.emoji }}</div>
              <div class="font-bold text-sm text-white">{{ arch.name }}</div>
              <div class="text-xs text-neutral-500 mt-1">{{ arch.pillar }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="card">
          <div class="text-3xl mb-4">🎯</div>
          <h3 class="text-xl font-bold mb-2">Quiz de 32 Preguntas</h3>
          <p class="text-neutral-400">Evaluación profunda basada en 8 pilares del pensamiento crítico y creativo.</p>
        </div>
        <div class="card">
          <div class="text-3xl mb-4">🤖</div>
          <h3 class="text-xl font-bold mb-2">Coach IA Personalizado</h3>
          <p class="text-neutral-400">Raven, tu coach de elite, te guía con metáforas musicales y consejos accionables.</p>
        </div>
        <div class="card">
          <div class="text-3xl mb-4">📊</div>
          <h3 class="text-xl font-bold mb-2">Dashboard de Progreso</h3>
          <p class="text-neutral-400">Visualiza tu evolución, metas y plan de acción personalizado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const archetypes = [
  { name: 'Frontman', emoji: '🎤', pillar: 'Presencia' },
  { name: 'Guitar Hero', emoji: '🎸', pillar: 'Creatividad' },
  { name: 'Survivor', emoji: '🔥', pillar: 'Resiliencia' },
  { name: 'Conector', emoji: '🤝', pillar: 'Carisma' },
  { name: 'Productor', emoji: '🎛️', pillar: 'Disciplina' },
  { name: 'Visionario', emoji: '👁️', pillar: 'Intuición' },
  { name: 'Rebelde', emoji: '⚡', pillar: 'Rebeldía' },
  { name: 'Dreamer', emoji: '🌟', pillar: 'Visión' }
]
</script>