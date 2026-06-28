<template>
  <div class="min-h-screen bg-loriga text-folsom">

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-iron bg-loriga/90 backdrop-blur-md">
      <div class="flex items-center justify-between px-5 py-4 mx-auto max-w-7xl md:px-16">
        <div class="flex items-center gap-4">
          <router-link to="/">
            <img src="/logo_rus.webp" alt="RockYourself" class="object-contain w-auto h-9">
          </router-link>
          <span class="text-iron">|</span>
          <span class="font-mono text-xs tracking-widest uppercase text-halford">Backstage</span>
        </div>
        <div class="flex items-center gap-6">
          <span class="font-mono text-xs text-halford">{{ authStore.user?.name }}</span>
          <button @click="authStore.logout"
            class="font-mono text-xs tracking-wider uppercase transition-colors text-halford hover:text-solstis">
            Salir
          </button>
        </div>
      </div>
    </header>

    <div class="px-5 py-10 mx-auto max-w-7xl md:px-16">
      <div class="grid gap-8 lg:grid-cols-3">

        <!-- Columna izquierda: Perfil -->
        <div class="space-y-6 lg:col-span-1">

          <!-- Card Arquetipo -->
          <div class="p-8 border border-iron bg-loriga-soft">
            <div class="mb-6 text-center">
              <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-3xl border bg-solstis/10 border-solstis/30">
                {{ archetypeEmoji }}
              </div>
              <h2 class="text-xl font-display text-folsom">{{ authStore.user?.name }}</h2>
              <p class="mt-1 font-mono text-sm font-semibold text-solstis">{{ archetypeName }}</p>
              <p class="mt-1 font-mono text-xs capitalize text-halford">Plan: {{ authStore.user?.plan || 'free' }}</p>
            </div>

            <!-- Pilares -->
            <div v-if="authStore.user?.pillars">
              <h4 class="mb-4 font-mono text-xs tracking-widest uppercase text-halford">Tus Pilares</h4>
              <div class="space-y-3">
                <div v-for="(score, pillar) in authStore.user?.pillars" :key="pillar">
                  <div class="flex justify-between mb-1">
                    <span class="font-mono text-xs capitalize text-halford">{{ pillar }}</span>
                    <span class="font-mono text-xs text-solstis">{{ score }}%</span>
                  </div>
                  <div class="h-0.5 bg-iron">
                    <div class="h-full transition-all duration-700 bg-solstis" :style="`width:${score}%`"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-8 space-y-3">
              <router-link to="/quiz"
                class="block w-full py-3 text-center font-mono text-xs tracking-wider uppercase transition-all btn-gold hover:brightness-110">
                Rehacer Quiz
              </router-link>
              <router-link to="/coaching"
                class="block w-full py-3 text-center font-mono text-xs tracking-wider uppercase transition-all border border-solstis/40 text-solstis-deep hover:bg-solstis/10">
                Coach IA
              </router-link>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Contenido principal -->
        <div class="space-y-8 lg:col-span-2">

          <!-- Stats -->
          <div class="grid gap-px sm:grid-cols-3 bg-iron">
            <div class="p-6 text-center bg-loriga-soft">
              <div class="text-4xl font-display text-solstis">{{ actionItems.length }}</div>
              <div class="mt-1 font-mono text-xs tracking-wider uppercase text-halford">Acciones Totales</div>
            </div>
            <div class="p-6 text-center bg-loriga-soft">
              <div class="text-4xl font-display text-solstis">{{ completedActions }}</div>
              <div class="mt-1 font-mono text-xs tracking-wider uppercase text-halford">Completadas</div>
            </div>
            <div class="p-6 text-center bg-loriga-soft">
              <div class="text-4xl font-display text-solstis">{{ completionRate }}%</div>
              <div class="mt-1 font-mono text-xs tracking-wider uppercase text-halford">Progreso</div>
            </div>
          </div>

          <!-- Plan de Acción -->
          <div class="border border-iron bg-loriga-soft">
            <div class="flex items-center justify-between px-8 py-6 border-b border-iron">
              <h3 class="text-xl font-display text-folsom">Plan de Acción</h3>
              <button @click="showAddAction = true"
                class="font-mono text-xs tracking-wider uppercase transition-colors text-solstis hover:text-solstis-deep">+ Nueva acción</button>
            </div>

            <div v-if="actionItems.length === 0" class="px-8 py-12 text-center">
              <p class="font-body text-halford">No tienes acciones pendientes.</p>
              <p class="mt-1 font-mono text-xs text-halford">Ve al Coach IA para generar tu plan.</p>
            </div>

            <div v-else class="p-4 space-y-2">
              <div v-for="action in actionItems" :key="action._id"
                class="flex items-center gap-4 p-4 transition-colors group bg-loriga border border-iron">
                <button @click="toggleAction(action._id, !action.completed)"
                  class="flex items-center justify-center flex-shrink-0 w-5 h-5 transition-all border"
                  :class="action.completed ? 'bg-solstis border-solstis' : 'border-iron'">
                  <span v-if="action.completed" class="text-[10px] font-bold text-loriga">✓</span>
                </button>
                <div class="flex-1">
                  <p class="font-body text-sm" :class="action.completed ? 'line-through text-halford' : 'text-folsom'">
                    {{ action.title }}
                  </p>
                  <p class="mt-0.5 font-mono text-xs text-halford">{{ action.description }}</p>
                </div>
                <span v-if="action.dueDate" class="font-mono text-xs flex-shrink-0 text-halford">
                  {{ formatDate(action.dueDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Nueva Acción -->
    <div v-if="showAddAction" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-folsom/70">
      <div class="w-full p-8 border border-iron bg-loriga" style="max-width:440px;">
        <h3 class="mb-6 text-xl font-display text-folsom">Nueva Acción</h3>
        <input v-model="newAction.title" placeholder="Título de la acción" class="w-full px-4 py-3 mb-3 font-body text-sm outline-none border border-iron bg-loriga-soft text-folsom placeholder:text-halford/60" />
        <textarea v-model="newAction.description" placeholder="Descripción (opcional)" rows="3" class="w-full px-4 py-3 mb-3 font-body text-sm outline-none resize-none border border-iron bg-loriga-soft text-folsom placeholder:text-halford/60"></textarea>
        <input v-model="newAction.dueDate" type="date" class="w-full px-4 py-3 mb-6 font-mono text-sm outline-none border border-iron bg-loriga-soft text-halford" />
        <div class="flex gap-3">
          <button @click="addAction" class="flex-1 py-3 font-mono text-xs tracking-wider uppercase btn-gold hover:brightness-110">Guardar</button>
          <button @click="showAddAction = false" class="flex-1 py-3 font-mono text-xs tracking-wider uppercase border border-iron text-halford hover:bg-loriga-soft">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCoachingStore } from '../stores/coaching'

const authStore    = useAuthStore()
const coachingStore = useCoachingStore()

const showAddAction = ref(false)
const newAction     = ref({ title: '', description: '', dueDate: '' })

const ARCHETYPE_MAP = {
  P1: { emoji: '🏗️', nombre: 'El Arquitecto Sónico' },
  P2: { emoji: '👽', nombre: 'El Alienígena Camaleón' },
  P3: { emoji: '🔥', nombre: 'El Chamán de la Tribu' },
  P4: { emoji: '🌑', nombre: 'El Nobel Errante' },
  P5: { emoji: '⚱️', nombre: 'El Forajido del Duelo' },
  P6: { emoji: '🎭', nombre: 'El Iconoclasta Satírico' },
  P7: { emoji: '⚒️', nombre: 'La Resistencia Obrera' },
  P8: { emoji: '🍷', nombre: 'El Canalla Dionisíaco' },
  // Legacy
  presence:   { emoji: '🎤', nombre: 'El Frontman' },
  creativity: { emoji: '🎸', nombre: 'El Guitar Hero' },
  resilience: { emoji: '🔥', nombre: 'El Survivor' },
  charisma:   { emoji: '🤝', nombre: 'El Conector' },
  discipline: { emoji: '🎛️', nombre: 'El Productor' },
  intuition:  { emoji: '👁️', nombre: 'El Visionario' },
  rebellion:  { emoji: '⚡', nombre: 'El Rebelde' },
  vision:     { emoji: '🌟', nombre: 'El Dreamer' }
}

const archetypeEmoji = computed(() => ARCHETYPE_MAP[authStore.user?.archetype]?.emoji || '🎸')
const archetypeName  = computed(() => ARCHETYPE_MAP[authStore.user?.archetype]?.nombre || 'Rockstar')
const actionItems    = computed(() => coachingStore.plan?.actionItems || [])
const completedActions = computed(() => actionItems.value.filter(a => a.completed).length)
const completionRate   = computed(() => {
  if (!actionItems.value.length) return 0
  return Math.round((completedActions.value / actionItems.value.length) * 100)
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }) : ''

onMounted(() => { coachingStore.fetchPlan() })

async function toggleAction(id, completed) { await coachingStore.toggleAction(id, completed) }

async function addAction() {
  if (!newAction.value.title) return
  await coachingStore.addAction(newAction.value.title, newAction.value.description, newAction.value.dueDate)
  newAction.value = { title: '', description: '', dueDate: '' }
  showAddAction.value = false
}
</script>
