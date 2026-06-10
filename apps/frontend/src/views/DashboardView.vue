<template>
  <div class="min-h-screen bg-neutral-950">
    <!-- Header -->
    <header class="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎸</span>
          <span class="font-bold text-xl">Raven</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-neutral-400">{{ authStore.user?.name }}</span>
          <button @click="authStore.logout" class="text-sm text-neutral-500 hover:text-white transition-colors">
            Salir
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="text-center">
              <div class="w-20 h-20 rounded-full bg-rock-500/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">{{ archetypeEmoji }}</span>
              </div>
              <h2 class="text-xl font-bold">{{ authStore.user?.name }}</h2>
              <p class="text-rock-400 font-semibold mt-1">{{ archetypeName }}</p>
              <p class="text-sm text-neutral-500 mt-2 capitalize">Plan: {{ authStore.user?.plan }}</p>
            </div>

            <div class="mt-6">
              <h4 class="text-sm font-semibold text-neutral-400 mb-3">Tus Pilares</h4>
              <div class="space-y-2">
                <div v-for="(score, pillar) in authStore.user?.pillars" :key="pillar" class="flex items-center gap-2">
                  <span class="text-xs text-neutral-500 w-20 capitalize">{{ pillar }}</span>
                  <div class="flex-1 bg-neutral-800 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full bg-rock-500 transition-all duration-500"
                      :style="{ width: `${score}%` }"
                    ></div>
                  </div>
                  <span class="text-xs text-neutral-400 w-8">{{ score }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-2">
              <router-link to="/quiz" class="btn-primary w-full text-center block">
                🔄 Rehacer Quiz
              </router-link>
              <router-link to="/coaching" class="btn-secondary w-full text-center block">
                💬 Coach IA
              </router-link>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Stats -->
          <div class="grid sm:grid-cols-3 gap-4">
            <div class="card text-center">
              <div class="text-3xl font-black text-rock-400">{{ actionItems.length }}</div>
              <div class="text-sm text-neutral-500 mt-1">Acciones Totales</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-black text-emerald-400">{{ completedActions }}</div>
              <div class="text-sm text-neutral-500 mt-1">Completadas</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-black text-amber-400">{{ completionRate }}%</div>
              <div class="text-sm text-neutral-500 mt-1">Progreso</div>
            </div>
          </div>

          <!-- Action Items -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">Plan de Acción</h3>
              <button @click="showAddAction = true" class="text-rock-400 hover:text-rock-300 text-sm">
                + Nueva acción
              </button>
            </div>

            <div v-if="actionItems.length === 0" class="text-center py-8 text-neutral-500">
              <p>No tienes acciones pendientes.</p>
              <p class="text-sm mt-1">Ve al Coach IA para generar tu plan.</p>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="action in actionItems" 
                :key="action._id"
                class="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg group"
              >
                <button 
                  @click="toggleAction(action._id, !action.completed)"
                  class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
                  :class="action.completed ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600 hover:border-rock-500'"
                >
                  <span v-if="action.completed">✓</span>
                </button>
                <div class="flex-1">
                  <p :class="action.completed ? 'line-through text-neutral-500' : 'text-white'" class="font-medium">
                    {{ action.title }}
                  </p>
                  <p class="text-sm text-neutral-500">{{ action.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Action Modal -->
    <div v-if="showAddAction" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div class="card max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Nueva Acción</h3>
        <input v-model="newAction.title" placeholder="Título" class="input mb-3" />
        <textarea v-model="newAction.description" placeholder="Descripción" class="input mb-3 h-24 resize-none"></textarea>
        <input v-model="newAction.dueDate" type="date" class="input mb-4" />
        <div class="flex gap-3">
          <button @click="addAction" class="btn-primary flex-1">Guardar</button>
          <button @click="showAddAction = false" class="btn-secondary flex-1">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCoachingStore } from '../stores/coaching'

const authStore = useAuthStore()
const coachingStore = useCoachingStore()

const showAddAction = ref(false)
const newAction = ref({ title: '', description: '', dueDate: '' })

const archetypeEmojis = {
  presence: '🎤', creativity: '🎸', resilience: '🔥', charisma: '🤝',
  discipline: '🎛️', intuition: '👁️', rebellion: '⚡', vision: '🌟'
}

const archetypeNames = {
  presence: 'El Frontman', creativity: 'El Guitar Hero', resilience: 'El Survivor',
  charisma: 'El Conector', discipline: 'El Productor', intuition: 'El Visionario',
  rebellion: 'El Rebelde', vision: 'El Dreamer'
}

const archetypeEmoji = computed(() => archetypeEmojis[authStore.user?.archetype] || '🎸')
const archetypeName = computed(() => archetypeNames[authStore.user?.archetype] || 'Rockstar')

const actionItems = computed(() => coachingStore.plan?.actionItems || [])
const completedActions = computed(() => actionItems.value.filter(a => a.completed).length)
const completionRate = computed(() => {
  if (!actionItems.value.length) return 0
  return Math.round((completedActions.value / actionItems.value.length) * 100)
})

onMounted(() => {
  coachingStore.fetchPlan()
})

async function toggleAction(actionId, completed) {
  await coachingStore.toggleAction(actionId, completed)
}

async function addAction() {
  if (!newAction.value.title) return
  await coachingStore.addAction(
    newAction.value.title,
    newAction.value.description,
    newAction.value.dueDate
  )
  newAction.value = { title: '', description: '', dueDate: '' }
  showAddAction.value = false
}
</script>