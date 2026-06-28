<template>
  <div class="min-h-screen bg-folsom text-loriga">
    <nav
      class="fixed top-0 z-50 w-full border-b bg-folsom/90 backdrop-blur-md border-outline-variant/20"
    >
      <div
        class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto"
      >
        <router-link
          to="/"
          class="text-2xl italic tracking-tighter uppercase font-display text-solstis"
        >
          ROCKYOURSELF
        </router-link>
      </div>
    </nav>

    <div v-if="perfil" class="pt-24 pb-20 px-5 md:px-16 max-w-[1100px] mx-auto">
      <!-- Header del resultado -->
      <div class="mb-16 text-center">
        <span
          class="font-mono text-xs tracking-[0.3em] uppercase text-solstis mb-4 block"
        >
          DIAGNÓSTICO RAVEN 3.0
        </span>
        <h1 class="mb-6 text-4xl font-display md:text-6xl text-loriga">
          Tu perfil:
          <span class="italic" :style="`color: ${perfil.dominante.color}`">{{
            perfil.dominante.nombre
          }}</span>
        </h1>
        <p class="max-w-2xl mx-auto text-lg font-body text-halford">
          {{ perfil.dominante.descripcion }}
        </p>
      </div>

      <!-- Tarjetas de perfil -->
      <div class="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        <!-- Dominante -->
        <div
          class="p-8 border-l-4 bg-surface-container"
          :style="`border-color: ${perfil.dominante.color}`"
        >
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO DOMINANTE
          </div>
          <h3
            class="mb-2 text-2xl font-display"
            :style="`color: ${perfil.dominante.color}`"
          >
            {{ perfil.dominante.rockstarPrincipal }}
          </h3>
          <p class="text-sm font-body text-halford">{{ perfil.dominante.nombre }}</p>
          <div class="mt-4 font-mono text-xs text-halford/60">
            Uso: {{ perfil.dominante.uso }} | Costo: {{ perfil.dominante.costo }}/4
          </div>
        </div>

        <!-- Secundario -->
        <div class="p-8 border-l-4 bg-surface-container border-solstis">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO SECUNDARIO
          </div>
          <h3 class="mb-2 text-2xl font-display text-solstis">
            {{ perfil.secundario.rockstarPrincipal }}
          </h3>
          <p class="text-sm font-body text-halford">{{ perfil.secundario.nombre }}</p>
        </div>

        <!-- Terciario -->
        <div
          v-if="perfil.terciario"
          class="p-8 border-l-4 bg-surface-container border-halford"
        >
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO TERCIARIO
          </div>
          <h3 class="mb-2 text-2xl font-display text-halford">
            {{ perfil.terciario.rockstarPrincipal }}
          </h3>
          <p class="text-sm font-body text-halford">{{ perfil.terciario.nombre }}</p>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="perfil.alertas.burnout || perfil.bloqueado" class="mb-16 space-y-4">
        <div
          v-if="perfil.alertas.burnout"
          class="p-6 border rounded-lg bg-error-container/20 border-error/30"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-error">warning</span>
            <div>
              <h4 class="text-lg font-display text-error">ALERTA BURNOUT ACTIVA</h4>
              <p class="text-sm font-body text-halford">
                Impacto de desgaste: {{ perfil.alertas.impacto.toFixed(1) }} | Tu recurso
                dominante está sobreexplotado.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="perfil.bloqueado"
          class="p-6 border rounded-lg bg-surface-container border-outline-variant/30"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-solstis">lock</span>
            <div>
              <h4 class="text-lg font-display text-solstis">RECURSO BLOQUEADO</h4>
              <p class="text-sm font-body text-halford">
                {{ perfil.bloqueado.nombre }} ({{ perfil.bloqueado.rockstarPrincipal }}) —
                Has rechazado este recurso por miedo. Es tu mayor área de crecimiento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Radar Chart placeholder -->
      <div class="p-8 mb-16 bg-surface-container">
        <h3 class="mb-8 text-2xl text-center font-display text-loriga">
          Mapa de 8 Pilares
        </h3>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div v-for="m in diagnostico?.metricas" :key="m.id" class="p-4 text-center">
            <div class="mb-1 font-mono text-xs text-halford">
              {{ getPilarLabel(m.id) }}
            </div>
            <div
              class="text-3xl font-display"
              :style="`color: ${PILARES_INFO[m.id].color}`"
            >
              {{ m.uso_total }}
            </div>
            <div class="mt-1 font-mono text-xs text-halford/60">
              Sombra: {{ m.sombra_total }}
            </div>
          </div>
        </div>
        <div class="mt-6 text-center">
          <span class="font-mono text-sm text-solstis">
            Elasticidad: {{ diagnostico?.indice_elasticidad_pct.toFixed(0) }}%
          </span>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- REPORTE RAVEN: Inercia → Fricción → Elasticidad → Antídoto  -->
      <!-- ============================================================ -->
      <div class="mb-16 space-y-px">
        <!-- Header del reporte -->
        <div class="p-6 border-t-2 bg-surface-container border-solstis">
          <span class="font-mono text-xs tracking-[0.25em] uppercase text-solstis">
            DIAGNÓSTICO NARRATIVO
          </span>
          <h3 class="mt-2 text-2xl font-display text-loriga">Tu Reporte de Crisis</h3>
        </div>

        <!-- Módulo Inercia -->
        <div
          v-if="moduloInercia"
          class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/40"
        >
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO INERCIA] Recurso Dominante
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">
            {{ moduloInercia }}
          </p>
        </div>

        <!-- Módulo Fricción -->
        <div
          v-if="moduloFriccion"
          class="p-6 transition-colors border-l-4 bg-surface-container"
          :class="
            diagnostico?.alerta_burnout
              ? 'border-error'
              : 'border-transparent hover:border-solstis/40'
          "
        >
          <div
            class="font-mono text-xs tracking-[0.15em] uppercase mb-3"
            :class="diagnostico?.alerta_burnout ? 'text-error' : 'text-halford'"
          >
            [MÓDULO FRICCIÓN] Nivel de Desgaste
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">
            {{ moduloFriccion }}
          </p>
        </div>

        <!-- Módulo Elasticidad -->
        <div
          v-if="moduloElasticidad"
          class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/40"
        >
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO ELASTICIDAD] Capacidad de Migración
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">
            {{ moduloElasticidad }}
          </p>
        </div>

        <!-- Módulo Antídoto — bloque principal, solo si hay recurso bloqueado -->
        <div v-if="antidoto" class="p-8 border-l-4 bg-surface-container border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Tu Intervención
          </div>
          <h4 class="mb-4 text-xl font-display text-loriga">
            {{ antidoto.titulo }}
          </h4>
          <!-- Diagnóstico -->
          <p class="mb-6 text-base leading-relaxed font-body text-halford">
            {{ antidoto.diagnostico }}
          </p>
          <!-- Acción -->
          <div class="pt-6 border-t border-outline-variant/20">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-3">
              Tu acción para mañana a las 8:00 AM
            </div>
            <p class="text-base font-medium leading-relaxed font-body text-loriga">
              {{ antidoto.accion }}
            </p>
          </div>
        </div>

        <!-- Si no hay recurso bloqueado, mostrar mensaje de elasticidad alta -->
        <div v-else class="p-8 border-l-4 bg-surface-container border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Sin Bloqueo Detectado
          </div>
          <p class="text-base leading-relaxed font-body text-halford">
            El algoritmo no detecta un recurso crítico en la sombra. Tu elasticidad es
            alta. El Agente Raven trabajará directamente sobre la profundización de tu
            pilar dominante y la expansión de tu rango de operación.
          </p>
        </div>
      </div>

      <!-- CTA de pago -->
      <div class="p-12 text-center border bg-folsom border-solstis/20">
        <h2 class="mb-4 text-3xl font-display md:text-4xl text-loriga">
          Tu Setlist de 12 Semanas te espera
        </h2>
        <p class="max-w-2xl mx-auto mb-8 text-lg font-body text-halford">
          El Agente Raven ha analizado tu perfil. Ahora diseñará un plan personalizado con
          sprints económicos, espirituales y mentales en tu tono de rockstar.
        </p>

        <div v-if="!authStore.isAuthenticated" class="mb-8">
          <p class="mb-4 text-sm font-body text-halford">Inicia sesión para continuar</p>
          <div class="flex justify-center gap-4">
            <button
              @click="authStore.loginWithGoogle()"
              class="px-6 py-3 transition-all border bg-surface-container border-outline-variant/30 text-loriga hover:border-solstis"
            >
              Google
            </button>
            <button
              @click="authStore.loginWithGitHub()"
              class="px-6 py-3 transition-all border bg-surface-container border-outline-variant/30 text-loriga hover:border-solstis"
            >
              GitHub
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col justify-center gap-6 md:flex-row">
          <button
            @click="goToCheckout('premium')"
            class="px-10 py-5 text-lg transition-all btn-gold font-body hover:scale-105 gold-glow interactive-button"
          >
            <span class="button-glow"></span>
            <span class="relative z-20">Escenario Principal — $9.99/mes</span>
          </button>
          <button
            @click="goToCheckout('pro')"
            class="px-10 py-5 text-lg transition-all border border-solstis text-solstis font-body hover:bg-solstis/10"
          >
            Productor Ejecutivo — $29.99/mes
          </button>
        </div>

        <!-- Email capture -->
        <div class="pt-8 mt-12 border-t border-outline-variant/20">
          <p class="mb-4 text-sm font-body text-halford">
            ¿No estás listo para pagar? Guarda tu resultado y recibe una oferta especial.
          </p>
          <div class="flex justify-center max-w-md gap-3 mx-auto">
            <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="flex-1 px-4 py-3 border outline-none bg-surface-container border-outline-variant/30 text-loriga focus:border-solstis"
            />
            <button
              @click="captureEmail"
              :disabled="emailCapturing"
              class="px-6 py-3 transition-all border bg-surface-container border-solstis/30 text-solstis hover:bg-solstis/10"
            >
              {{ emailCapturing ? "Enviando..." : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-2xl font-display text-solstis animate-pulse">
          Analizando tu perfil...
        </div>
        <div class="mt-4 font-mono text-sm text-halford">
          El Raven Engine está procesando 34 variables
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'
import { useQuizScoring } from '@/composables/useQuizScoring'
import { PILARES_INFO, ANTIDOTOS, type PilarId } from '@raven/shared-types'
import axios from 'axios'

const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()
const { getPerfilVisual } = useQuizScoring()

const email = ref('')
const emailCapturing = ref(false)

const diagnostico = computed(() => quizStore.diagnostico)
const perfil = computed(() => {
  if (!diagnostico.value) return null
  return getPerfilVisual(diagnostico.value)
})

const getPilarLabel = (id: string) => {
  const info = PILARES_INFO[id as PilarId]
  return info ? info.rockstars[0] : id
}

// Módulo Antídoto — pilar bloqueado del diagnóstico
const antidoto = computed(() => {
  const bloqueado = diagnostico.value?.recurso_bloqueado
  if (!bloqueado) return null
  return ANTIDOTOS[bloqueado] ?? null
})

// Módulo Inercia — descripción narrativa del recurso dominante + tiempo
const moduloInercia = computed(() => {
  if (!diagnostico.value || !perfil.value) return null
  const d = diagnostico.value
  const p = perfil.value
  const tiempos: Record<number, string> = {
    1.0: 'menos de una semana',
    1.2: 'entre 1 y 4 semanas',
    1.5: 'entre 1 y 3 meses',
    2.0: 'entre 3 y 12 meses',
    3.0: 'más de un año'
  }
  const tiempo = tiempos[d.multiplicador_tiempo] ?? 'un tiempo prolongado'
  return `Frente al caos, tu primera línea de defensa es ${p.dominante.nombre} (${p.dominante.rockstarPrincipal}). Tu sistema nervioso activa este recurso de forma automática antes de pensar. Llevas ${tiempo} operando desde este pilar.`
})

// Módulo Fricción — burnout y costo energético del dominante
const moduloFriccion = computed(() => {
  if (!diagnostico.value || !perfil.value) return null
  const d = diagnostico.value
  const costo = perfil.value.dominante.costo
  const nivel = costo === 1 ? 'óptimo' : costo === 2 ? 'estable' : costo === 3 ? 'elevado' : 'crítico'
  if (d.alerta_burnout) {
    return `Tu motor está operando en nivel de agotamiento ${nivel} (${costo}/4). El impacto de desgaste acumulado es ${d.impacto_desgaste.toFixed(1)}. Llevas demasiado tiempo extrayendo de este mismo pozo.`
  }
  return `El costo energético de tu recurso dominante es ${nivel} (${costo}/4). Aún tienes margen, pero la dirección importa.`
})

// Módulo Elasticidad — capacidad de migrar entre pilares
const moduloElasticidad = computed(() => {
  if (!diagnostico.value) return null
  const pct = diagnostico.value.indice_elasticidad_pct
  const label = pct >= 75 ? 'alta' : pct >= 50 ? 'moderada' : pct >= 25 ? 'limitada' : 'críticamente baja'
  return `Tu índice de elasticidad es ${label} (${pct.toFixed(0)}%). ${pct < 50 ? 'Dependes demasiado de un solo recurso para navegar el caos.' : 'Tienes capacidad real para migrar entre herramientas bajo presión.'}`
})

const goToCheckout = (plan: 'premium' | 'pro') => {
  router.push({ path: '/checkout', query: { plan } })
}

const captureEmail = async () => {
  if (!email.value || !diagnostico.value) return
  emailCapturing.value = true
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/email/capture`, {
      email: email.value,
      diagnostico: diagnostico.value
    })
    alert('¡Oferta enviada! Revisa tu email en 48h.')
  } catch (err) {
    alert('Error enviando email. Intenta de nuevo.')
  } finally {
    emailCapturing.value = false
  }
}

onMounted(() => {
  quizStore.loadFromStorage()
  if (!diagnostico.value) {
    router.push('/quiz')
  }
})
</script>
