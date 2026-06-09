<template>
  <div class="min-h-screen bg-folsom text-loriga">
    <!-- Header -->
    <nav class="fixed top-0 z-50 w-full border-b bg-folsom/90 backdrop-blur-md border-outline-variant/20">
      <div class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        <router-link to="/" class="text-2xl italic tracking-tighter uppercase font-display text-solstis">
          ROCKYOURSELF
        </router-link>
        <div class="flex items-center gap-6">
          <span class="font-mono text-xs tracking-[0.12em] uppercase px-3 py-1 border border-solstis/40 text-solstis">
            {{ authStore.user?.plan }}
          </span>
          <button @click="authStore.logout()" class="text-xs transition-colors font-body text-halford hover:text-solstis">
            Salir
          </button>
        </div>
      </div>
    </nav>

    <div class="pt-24 pb-20 px-5 md:px-16 max-w-[1280px] mx-auto">

      <!-- Welcome -->
      <div class="mb-12">
        <p class="font-mono text-xs tracking-[0.2em] uppercase text-halford mb-2">BACKSTAGE RAVEN</p>
        <h1 class="mb-3 text-3xl font-display md:text-5xl text-loriga">
          {{ authStore.user?.nombre || 'Rockstar' }},
          <span class="italic text-solstis">el escenario está listo.</span>
        </h1>
        <p class="text-base font-body text-halford">
          {{ dominanteInfo ? `${dominanteInfo.nombre} · ${dominanteInfo.rockstars[0]}` : 'Cargando perfil...' }}
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-px mb-12 md:grid-cols-4 bg-outline-variant/10">
        <div class="p-6 bg-folsom">
          <div class="font-mono text-xs tracking-[0.12em] uppercase text-halford mb-2">SEMANA</div>
          <div class="text-4xl font-display text-solstis">{{ semanaActual }}</div>
          <div class="mt-1 font-mono text-xs text-halford/60">de 12</div>
        </div>
        <div class="p-6 bg-folsom">
          <div class="font-mono text-xs tracking-[0.12em] uppercase text-halford mb-2">SPRINTS</div>
          <div class="text-4xl font-display text-solstis">{{ sprintsCompletados }}</div>
          <div class="mt-1 font-mono text-xs text-halford/60">completados</div>
        </div>
        <div class="p-6 bg-folsom">
          <div class="font-mono text-xs tracking-[0.12em] uppercase text-halford mb-2">BURNOUT</div>
          <div class="text-4xl font-display" :class="diagnostico?.alerta_burnout ? 'text-error' : 'text-solstis'">
            {{ diagnostico?.alerta_burnout ? 'ON' : 'OFF' }}
          </div>
          <div class="mt-1 font-mono text-xs text-halford/60">
            {{ diagnostico?.alerta_burnout ? `Impacto ${diagnostico.impacto_desgaste.toFixed(1)}` : 'en rango' }}
          </div>
        </div>
        <div class="p-6 bg-folsom">
          <div class="font-mono text-xs tracking-[0.12em] uppercase text-halford mb-2">ELASTICIDAD</div>
          <div class="text-4xl font-display text-solstis">{{ diagnostico?.indice_elasticidad_pct.toFixed(0) }}%</div>
          <div class="mt-1 font-mono text-xs text-halford/60">adaptabilidad</div>
        </div>
      </div>

      <!-- Loading setlist -->
      <div v-if="userStore.loading" class="py-24 text-center">
        <div class="text-xl font-display text-solstis animate-pulse">Generando tu setlist...</div>
        <div class="mt-3 font-mono text-xs text-halford">El Agente Raven está componiendo 12 semanas</div>
      </div>

      <template v-else-if="userStore.setlist">

        <!-- Setlist Grid -->
        <div class="mb-16">
          <div class="flex items-baseline justify-between mb-6">
            <h2 class="text-2xl font-display text-loriga">Tu Setlist</h2>
            <span class="font-mono text-xs text-halford">{{ sprintsCompletados }}/{{ totalSprints }} completados</span>
          </div>

          <!-- Progress bar total -->
          <div class="relative h-px mb-8 bg-outline-variant/30">
            <div
              class="absolute top-0 left-0 h-px transition-all duration-700 bg-solstis"
              :style="`width: ${totalSprints ? (sprintsCompletados / totalSprints) * 100 : 0}%`"
            ></div>
          </div>

          <div class="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3 bg-outline-variant/10">
            <div
              v-for="sprint in userStore.setlist.sprints"
              :key="sprint.semana"
              class="p-6 transition-all duration-200 cursor-pointer bg-folsom group hover:bg-surface-container"
              :class="{ 'opacity-40': sprint.completado }"
              @click="handleToggleSprint(sprint.semana)"
            >
              <!-- Sprint header -->
              <div class="flex items-start justify-between mb-4">
                <span
                  class="font-mono text-xs tracking-[0.12em] uppercase px-2 py-0.5 border"
                  :class="tipoBadge(sprint.tipo)"
                >
                  {{ sprint.tipo }}
                </span>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-halford/60">S{{ sprint.semana }}</span>
                  <!-- Checkbox -->
                  <div
                    class="flex items-center justify-center w-5 h-5 transition-all border"
                    :class="sprint.completado
                      ? 'border-solstis bg-solstis/20'
                      : 'border-halford/30 group-hover:border-solstis/50'"
                  >
                    <span v-if="sprint.completado" class="text-xs text-solstis">✓</span>
                  </div>
                </div>
              </div>

              <!-- Sprint content -->
              <h3 class="mb-2 text-lg leading-tight font-display text-loriga">{{ sprint.titulo }}</h3>
              <p class="mb-4 text-sm leading-relaxed font-body text-halford line-clamp-3">{{ sprint.descripcion }}</p>

              <!-- Métricas -->
              <div class="space-y-1.5 border-t border-outline-variant/10 pt-4">
                <div
                  v-for="(metrica, i) in sprint.metricas"
                  :key="i"
                  class="flex items-start gap-2"
                >
                  <span class="font-mono text-xs text-solstis mt-0.5 flex-shrink-0">›</span>
                  <span class="font-mono text-xs leading-relaxed text-halford">{{ metrica }}</span>
                </div>
              </div>

              <!-- Completado overlay -->
              <div v-if="sprint.completado" class="pt-3 mt-4 border-t border-outline-variant/10">
                <span class="font-mono text-xs tracking-[0.15em] text-solstis uppercase">✓ Completado</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- AGENTE RAVEN — Chat                         -->
        <!-- ============================================ -->
        <div class="border border-outline-variant/20 bg-surface-container">

          <!-- Chat header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center w-8 h-8 border bg-solstis/10 border-solstis/40">
                <span class="font-mono text-xs font-bold text-solstis">R</span>
              </div>
              <div>
                <div class="text-lg font-display text-loriga">Agente Raven</div>
                <div class="font-mono text-xs text-halford">
                  {{ dominanteInfo ? `Calibrado para ${dominanteInfo.rockstars[0]}` : 'Coach de IA' }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-solstis animate-pulse"></div>
              <span class="font-mono text-xs text-halford">ONLINE</span>
            </div>
          </div>

          <!-- Messages -->
          <div
            ref="chatContainer"
            class="h-[480px] overflow-y-auto px-6 py-6 space-y-6 scroll-smooth"
          >
            <!-- Empty state -->
            <div v-if="!mensajesVisibles.length" class="flex items-center justify-center h-full">
              <div class="max-w-sm text-center">
                <div class="mb-2 text-lg font-display text-halford">Sin registros de conversación</div>
                <p class="text-sm leading-relaxed font-body text-halford/60">
                  El Agente Raven está listo. Pregúntale sobre tu sprint actual,
                  tu recurso bloqueado o cualquier cosa que necesites destrabar.
                </p>
              </div>
            </div>

            <!-- Messages -->
            <div
              v-for="(msg, i) in mensajesVisibles"
              :key="i"
              class="flex gap-4"
              :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <!-- Avatar Raven -->
              <div
                v-if="msg.role === 'assistant'"
                class="flex items-center justify-center flex-shrink-0 mt-1 border w-7 h-7 bg-solstis/10 border-solstis/30"
              >
                <span class="font-mono text-xs font-bold text-solstis">R</span>
              </div>

              <!-- Bubble -->
              <div
                class="max-w-[78%] px-5 py-4"
                :class="msg.role === 'user'
                  ? 'bg-solstis/10 border border-solstis/20'
                  : 'bg-folsom border border-outline-variant/20'"
              >
                <p class="text-sm leading-relaxed whitespace-pre-wrap font-body"
                  :class="msg.role === 'user' ? 'text-loriga' : 'text-halford'">
                  {{ msg.content }}
                </p>
                <span class="block mt-2 font-mono text-xs text-halford/40">
                  {{ formatTimestamp(msg.timestamp) }}
                </span>
              </div>

              <!-- Avatar user -->
              <div
                v-if="msg.role === 'user'"
                class="flex items-center justify-center flex-shrink-0 mt-1 border w-7 h-7 bg-outline-variant/20 border-outline-variant/30"
              >
                <span class="font-mono text-xs text-halford">{{ authStore.user?.nombre?.[0]?.toUpperCase() || 'U' }}</span>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="chatLoading" class="flex justify-start gap-4">
              <div class="flex items-center justify-center flex-shrink-0 border w-7 h-7 bg-solstis/10 border-solstis/30">
                <span class="font-mono text-xs font-bold text-solstis">R</span>
              </div>
              <div class="px-5 py-4 border bg-folsom border-outline-variant/20">
                <div class="flex gap-1.5 items-center h-5">
                  <span class="w-1.5 h-1.5 rounded-full bg-halford/60 animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-halford/60 animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-halford/60 animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sugerencias rápidas -->
          <div v-if="!mensajesVisibles.length" class="flex flex-wrap gap-2 px-6 pb-4">
            <button
              v-for="sugerencia in sugerencias"
              :key="sugerencia"
              @click="usarSugerencia(sugerencia)"
              class="px-3 py-2 font-mono text-xs transition-all border border-outline-variant/30 text-halford hover:border-solstis hover:text-solstis"
            >
              {{ sugerencia }}
            </button>
          </div>

          <!-- Input -->
          <div class="flex gap-0 border-t border-outline-variant/20">
            <input
              v-model="mensaje"
              @keyup.enter="enviarMensaje"
              :disabled="chatLoading"
              type="text"
              placeholder="Escribe al Agente Raven..."
              class="flex-1 px-6 py-4 text-sm bg-transparent border-r text-loriga placeholder-halford/40 focus:outline-none font-body border-outline-variant/20 disabled:opacity-50"
            />
            <button
              @click="enviarMensaje"
              :disabled="!mensaje.trim() || chatLoading"
              class="px-8 py-4 font-mono text-sm font-bold transition-colors bg-solstis text-folsom hover:bg-solstis/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>

          <!-- Footer info -->
          <div class="flex items-center justify-between px-6 py-3 border-t border-outline-variant/10">
            <span class="font-mono text-xs text-halford/40">
              {{ mensajesVisibles.length }} mensajes en esta sesión
            </span>
            <span class="font-mono text-xs text-halford/40">
              Groq · mixtral-8x7b
            </span>
          </div>
        </div>

      </template>

      <!-- Error state: no setlist -->
      <div v-else class="py-24 text-center border border-outline-variant/20">
        <div class="mb-3 text-xl font-display text-halford">No se encontró tu setlist</div>
        <p class="mb-6 text-sm font-body text-halford/60">
          Necesitas completar el quiz para que el Agente Raven genere tu plan.
        </p>
        <router-link
          to="/quiz"
          class="px-6 py-3 font-mono text-sm transition-colors border border-solstis text-solstis hover:bg-solstis/10"
        >
          Ir al Quiz →
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useQuizStore } from '@/stores/quizStore'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { PILARES_INFO } from '@raven/shared-types'
import type { PilarId } from '@raven/shared-types'

const quizStore = useQuizStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const mensaje = ref('')
const chatLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// ── Diagnóstico y perfil ──────────────────────────────────────────────────
const diagnostico = computed(() => quizStore.diagnostico)

const dominanteInfo = computed(() => {
  if (!diagnostico.value) return null
  return PILARES_INFO[diagnostico.value.recurso_dominante as PilarId]
})

// ── Setlist stats ─────────────────────────────────────────────────────────
const semanaActual = computed(() => {
  const completed = userStore.setlist?.sprints?.filter(s => s.completado).length || 0
  return Math.min(completed + 1, 12)
})

const sprintsCompletados = computed(() =>
  userStore.setlist?.sprints?.filter(s => s.completado).length || 0
)

const totalSprints = computed(() =>
  userStore.setlist?.sprints?.length || 0
)

// ── Mensajes visibles (excluir system) ───────────────────────────────────
const mensajesVisibles = computed(() =>
  userStore.conversacion.filter((m: any) => m.role !== 'system')
)

// ── Sugerencias contextuales ──────────────────────────────────────────────
const sugerencias = computed(() => {
  const d = diagnostico.value
  if (!d) return []
  const bloqueadoNombre = d.recurso_bloqueado
    ? PILARES_INFO[d.recurso_bloqueado as PilarId]?.nombre
    : null

  const base = [
    `¿Qué debo hacer esta semana?`,
    `Explícame mi sprint actual`,
    `Estoy estancado, ¿qué hago?`
  ]
  if (bloqueadoNombre) base.push(`¿Cómo trabajo mi ${bloqueadoNombre}?`)
  if (d.alerta_burnout) base.push(`Tengo alerta de burnout activa`)
  return base.slice(0, 4)
})

// ── Helpers visuales ──────────────────────────────────────────────────────
const tipoBadge = (tipo: string) => ({
  economico:   'border-solstis/50 text-solstis',
  espiritual:  'border-loriga/30 text-loriga/70',
  mental:      'border-halford/30 text-halford',
  celebracion: 'border-error/30 text-error/80'
}[tipo] || 'border-halford/30 text-halford')

const formatTimestamp = (ts: any) => {
  if (!ts) return ''
  try { return new Date(ts).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}

// ── Auto-scroll ───────────────────────────────────────────────────────────
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(() => userStore.conversacion.length, scrollToBottom)
watch(chatLoading, (val) => { if (!val) scrollToBottom() })

// ── Acciones ──────────────────────────────────────────────────────────────
const handleToggleSprint = async (semana: number) => {
  await userStore.toggleSprint(semana)
}

const usarSugerencia = (texto: string) => {
  mensaje.value = texto
  enviarMensaje()
}

const enviarMensaje = async () => {
  const texto = mensaje.value.trim()
  if (!texto || chatLoading.value) return

  const setlistId = userStore.setlist?._id
  if (!setlistId) return

  // Optimistic: agregar mensaje del usuario inmediatamente
  userStore.conversacion.push({
    role: 'user',
    content: texto,
    timestamp: new Date()
  })
  mensaje.value = ''
  chatLoading.value = true
  await scrollToBottom()

  try {
    await userStore.sendMessage(texto, setlistId)
  } finally {
    chatLoading.value = false
  }
}

// ── Mount ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  // Sincronizar plan si viene de Stripe
  if (route.query.payment === 'success') {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`)
      if (data.success) authStore.updatePlan(data.data.plan)
    } catch (e) { /* silencioso */ }
    router.replace({ path: '/dashboard' })
  }

  quizStore.loadFromStorage()

  if (diagnostico.value) {
    await userStore.generateSetlist(diagnostico.value)
    if (userStore.setlist?._id) {
      await userStore.loadConversation(userStore.setlist._id)
      await scrollToBottom()
    }
  }
})
</script>
