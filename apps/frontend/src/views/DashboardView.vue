<template>
  <div class="min-h-screen" style="background:#080808; color:#F8F6F1;">

    <!-- Header -->
    <header style="border-bottom:1px solid #2a2a2a; background:rgba(8,8,8,0.9);" class="sticky top-0 z-50 backdrop-blur-md">
      <div class="flex items-center justify-between px-5 py-4 mx-auto max-w-7xl md:px-16">
        <div class="flex items-center gap-4">
          <router-link to="/">
            <img src="/logo_rus.webp" alt="RockYourself" class="object-contain w-auto h-9">
          </router-link>
          <span style="color:#2a2a2a;">|</span>
          <span class="font-mono text-xs tracking-widest uppercase" style="color:#888880;">Backstage</span>
        </div>
        <div class="flex items-center gap-6">
          <span class="font-mono text-xs" style="color:#888880;">{{ authStore.user?.name }}</span>
          <button @click="authStore.logout"
            class="font-mono text-xs tracking-wider uppercase transition-colors"
            style="color:#888880;" onmouseenter="this.style.color='#D4AF37'" onmouseleave="this.style.color='#888880'">
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
          <div style="background:#111111; border:1px solid #2a2a2a; padding:2rem;">
            <div class="mb-6 text-center">
              <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-3xl" style="background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.2);">
                {{ archetypeEmoji }}
              </div>
              <h2 class="text-xl font-display" style="color:#F8F6F1;">{{ authStore.user?.name }}</h2>
              <p class="mt-1 font-mono text-sm font-semibold" style="color:#D4AF37;">{{ archetypeName }}</p>
              <p class="mt-1 font-mono text-xs capitalize" style="color:#888880;">Plan: {{ authStore.user?.plan || 'free' }}</p>
            </div>

            <!-- Pilares -->
            <div v-if="authStore.user?.pillars">
              <h4 class="mb-4 font-mono text-xs tracking-widest uppercase" style="color:#888880;">Tus Pilares</h4>
              <div class="space-y-3">
                <div v-for="(score, pillar) in authStore.user?.pillars" :key="pillar">
                  <div class="flex justify-between mb-1">
                    <span class="font-mono text-xs capitalize" style="color:#888880;">{{ pillar }}</span>
                    <span class="font-mono text-xs" style="color:#D4AF37;">{{ score }}%</span>
                  </div>
                  <div style="height:2px; background:#2a2a2a;">
                    <div :style="`width:${score}%; height:100%; background:#D4AF37; transition:width 0.8s ease;`"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-8 space-y-3">
              <router-link to="/quiz"
                class="block w-full py-3 text-center font-mono text-xs tracking-wider uppercase transition-all"
                style="background:#D4AF37; color:#080808;">
                Rehacer Quiz
              </router-link>
              <router-link to="/coaching"
                class="block w-full py-3 text-center font-mono text-xs tracking-wider uppercase transition-all"
                style="border:1px solid rgba(212,175,55,0.3); color:#F5E6A3;">
                Coach IA
              </router-link>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Contenido principal -->
        <div class="space-y-8 lg:col-span-2">

          <!-- Stats -->
          <div class="grid gap-px sm:grid-cols-3" style="background:#2a2a2a;">
            <div class="p-6 text-center" style="background:#111111;">
              <div class="text-4xl font-display" style="color:#D4AF37;">{{ actionItems.length }}</div>
              <div class="mt-1 font-mono text-xs tracking-wider uppercase" style="color:#888880;">Acciones Totales</div>
            </div>
            <div class="p-6 text-center" style="background:#111111;">
              <div class="text-4xl font-display" style="color:#D4AF37;">{{ completedActions }}</div>
              <div class="mt-1 font-mono text-xs tracking-wider uppercase" style="color:#888880;">Completadas</div>
            </div>
            <div class="p-6 text-center" style="background:#111111;">
              <div class="text-4xl font-display" style="color:#D4AF37;">{{ completionRate }}%</div>
              <div class="mt-1 font-mono text-xs tracking-wider uppercase" style="color:#888880;">Progreso</div>
            </div>
          </div>

          <!-- Plan de Acción -->
          <div style="background:#111111; border:1px solid #2a2a2a;">
            <div class="flex items-center justify-between px-8 py-6" style="border-bottom:1px solid #2a2a2a;">
              <h3 class="text-xl font-display" style="color:#F8F6F1;">Plan de Acción</h3>
              <button @click="showAddAction = true"
                class="font-mono text-xs tracking-wider uppercase transition-colors"
                style="color:#D4AF37;">+ Nueva acción</button>
            </div>

            <div v-if="actionItems.length === 0" class="px-8 py-12 text-center">
              <p class="font-body" style="color:#888880;">No tienes acciones pendientes.</p>
              <p class="mt-1 font-mono text-xs" style="color:#888880;">Ve al Coach IA para generar tu plan.</p>
            </div>

            <div v-else class="p-4 space-y-2">
              <div v-for="action in actionItems" :key="action._id"
                class="flex items-center gap-4 p-4 transition-colors group"
                style="background:#0e0e0e; border:1px solid #2a2a2a;">
                <button @click="toggleAction(action._id, !action.completed)"
                  class="flex items-center justify-center flex-shrink-0 w-5 h-5 transition-all"
                  :style="action.completed ? 'background:#D4AF37; border:1px solid #D4AF37;' : 'border:1px solid #2a2a2a;'">
                  <span v-if="action.completed" style="color:#080808; font-size:10px; font-weight:bold;">✓</span>
                </button>
                <div class="flex-1">
                  <p class="font-body text-sm" :style="action.completed ? 'text-decoration:line-through; color:#888880;' : 'color:#F8F6F1;'">
                    {{ action.title }}
                  </p>
                  <p class="mt-0.5 font-mono text-xs" style="color:#888880;">{{ action.description }}</p>
                </div>
                <span v-if="action.dueDate" class="font-mono text-xs flex-shrink-0" style="color:#888880;">
                  {{ formatDate(action.dueDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Nueva Acción -->
    <div v-if="showAddAction" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.85);">
      <div style="background:#111111; border:1px solid #2a2a2a; padding:2rem; width:100%; max-width:440px;">
        <h3 class="mb-6 text-xl font-display" style="color:#F8F6F1;">Nueva Acción</h3>
        <input v-model="newAction.title" placeholder="Título de la acción" class="w-full px-4 py-3 mb-3 font-body text-sm outline-none"
          style="background:#1a1a1a; border:1px solid #2a2a2a; color:#F8F6F1;" />
        <textarea v-model="newAction.description" placeholder="Descripción (opcional)" rows="3" class="w-full px-4 py-3 mb-3 font-body text-sm outline-none resize-none"
          style="background:#1a1a1a; border:1px solid #2a2a2a; color:#F8F6F1;"></textarea>
        <input v-model="newAction.dueDate" type="date" class="w-full px-4 py-3 mb-6 font-mono text-sm outline-none"
          style="background:#1a1a1a; border:1px solid #2a2a2a; color:#888880; color-scheme:dark;" />
        <div class="flex gap-3">
          <button @click="addAction" class="flex-1 py-3 font-mono text-xs tracking-wider uppercase"
            style="background:#D4AF37; color:#080808;">Guardar</button>
          <button @click="showAddAction = false" class="flex-1 py-3 font-mono text-xs tracking-wider uppercase"
            style="border:1px solid #2a2a2a; color:#888880;">Cancelar</button>
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
