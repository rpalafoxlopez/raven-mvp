<template>
  <div class="min-h-screen bg-folsom text-loriga">
    <nav
      class="fixed top-0 w-full z-50 bg-folsom/90 backdrop-blur-md border-b border-outline-variant/20"
    >
      <div
        class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto"
      >
        <router-link
          to="/"
          class="font-display text-2xl tracking-tighter text-solstis italic uppercase"
        >
          ROCKYOURSELF
        </router-link>
      </div>
    </nav>

    <div v-if="perfil" class="pt-24 pb-20 px-5 md:px-16 max-w-[1100px] mx-auto">
      <!-- Header del resultado -->
      <div class="text-center mb-16">
        <span
          class="font-mono text-xs tracking-[0.3em] uppercase text-solstis mb-4 block"
        >
          DIAGNÓSTICO RAVEN 3.0
        </span>
        <h1 class="font-display text-4xl md:text-6xl text-loriga mb-6">
          Tu perfil:
          <span class="italic" :style="`color: ${perfil.dominante.color}`">{{
            perfil.dominante.nombre
          }}</span>
        </h1>
        <p class="font-body text-lg text-halford max-w-2xl mx-auto">
          {{ perfil.dominante.descripcion }}
        </p>
      </div>

      <!-- Tarjetas de perfil -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <!-- Dominante -->
        <div
          class="bg-surface-container p-8 border-l-4"
          :style="`border-color: ${perfil.dominante.color}`"
        >
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO DOMINANTE
          </div>
          <h3
            class="font-display text-2xl mb-2"
            :style="`color: ${perfil.dominante.color}`"
          >
            {{ perfil.dominante.rockstarPrincipal }}
          </h3>
          <p class="font-body text-sm text-halford">{{ perfil.dominante.nombre }}</p>
          <div class="mt-4 font-mono text-xs text-halford/60">
            Uso: {{ perfil.dominante.uso }} | Costo: {{ perfil.dominante.costo }}/4
          </div>
        </div>

        <!-- Secundario -->
        <div class="bg-surface-container p-8 border-l-4 border-solstis">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO SECUNDARIO
          </div>
          <h3 class="font-display text-2xl text-solstis mb-2">
            {{ perfil.secundario.rockstarPrincipal }}
          </h3>
          <p class="font-body text-sm text-halford">{{ perfil.secundario.nombre }}</p>
        </div>

        <!-- Terciario -->
        <div
          v-if="perfil.terciario"
          class="bg-surface-container p-8 border-l-4 border-halford"
        >
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO TERCIARIO
          </div>
          <h3 class="font-display text-2xl text-halford mb-2">
            {{ perfil.terciario.rockstarPrincipal }}
          </h3>
          <p class="font-body text-sm text-halford">{{ perfil.terciario.nombre }}</p>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="perfil.alertas.burnout || perfil.bloqueado" class="mb-16 space-y-4">
        <div
          v-if="perfil.alertas.burnout"
          class="p-6 bg-error-container/20 border border-error/30 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-error">warning</span>
            <div>
              <h4 class="font-display text-lg text-error">ALERTA BURNOUT ACTIVA</h4>
              <p class="font-body text-sm text-halford">
                Impacto de desgaste: {{ perfil.alertas.impacto.toFixed(1) }} | Tu recurso
                dominante está sobreexplotado.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="perfil.bloqueado"
          class="p-6 bg-surface-container border border-outline-variant/30 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-solstis">lock</span>
            <div>
              <h4 class="font-display text-lg text-solstis">RECURSO BLOQUEADO</h4>
              <p class="font-body text-sm text-halford">
                {{ perfil.bloqueado.nombre }} ({{ perfil.bloqueado.rockstarPrincipal }}) —
                Has rechazado este recurso por miedo. Es tu mayor área de crecimiento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Radar Chart placeholder -->
      <div class="bg-surface-container p-8 mb-16">
        <h3 class="font-display text-2xl text-loriga mb-8 text-center">
          Mapa de 8 Pilares
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="m in diagnostico?.metricas" :key="m.id" class="text-center p-4">
            <div class="font-mono text-xs text-halford mb-1">
              {{ getPilarLabel(m.id) }}
            </div>
            <div
              class="font-display text-3xl"
              :style="`color: ${PILARES_INFO[m.id].color}`"
            >
              {{ m.uso_total }}
            </div>
            <div class="font-mono text-xs text-halford/60 mt-1">
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
        <div class="bg-surface-container p-6 border-t-2 border-solstis">
          <span class="font-mono text-xs tracking-[0.25em] uppercase text-solstis">
            DIAGNÓSTICO NARRATIVO
          </span>
          <h3 class="font-display text-2xl text-loriga mt-2">Tu Reporte de Crisis</h3>
        </div>

        <!-- Módulo Inercia -->
        <div
          v-if="moduloInercia"
          class="bg-surface-container p-6 border-l-4 border-transparent hover:border-solstis/40 transition-colors"
        >
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO INERCIA] Recurso Dominante
          </div>
          <p class="font-body text-base text-loriga leading-relaxed">
            {{ moduloInercia }}
          </p>
        </div>

        <!-- Módulo Fricción -->
        <div
          v-if="moduloFriccion"
          class="bg-surface-container p-6 border-l-4 transition-colors"
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
          <p class="font-body text-base text-loriga leading-relaxed">
            {{ moduloFriccion }}
          </p>
        </div>

        <!-- Módulo Elasticidad -->
        <div
          v-if="moduloElasticidad"
          class="bg-surface-container p-6 border-l-4 border-transparent hover:border-solstis/40 transition-colors"
        >
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO ELASTICIDAD] Capacidad de Migración
          </div>
          <p class="font-body text-base text-loriga leading-relaxed">
            {{ moduloElasticidad }}
          </p>
        </div>

        <!-- Módulo Antídoto — bloque principal, solo si hay recurso bloqueado -->
        <div v-if="antidoto" class="bg-surface-container p-8 border-l-4 border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Tu Intervención
          </div>
          <h4 class="font-display text-xl text-loriga mb-4">
            {{ antidoto.titulo }}
          </h4>
          <!-- Diagnóstico -->
          <p class="font-body text-base text-halford leading-relaxed mb-6">
            {{ antidoto.diagnostico }}
          </p>
          <!-- Acción -->
          <div class="border-t border-outline-variant/20 pt-6">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-3">
              Tu acción para mañana a las 8:00 AM
            </div>
            <p class="font-body text-base text-loriga leading-relaxed font-medium">
              {{ antidoto.accion }}
            </p>
          </div>
        </div>

        <!-- Si no hay recurso bloqueado, mostrar mensaje de elasticidad alta -->
        <div v-else class="bg-surface-container p-8 border-l-4 border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Sin Bloqueo Detectado
          </div>
          <p class="font-body text-base text-halford leading-relaxed">
            El algoritmo no detecta un recurso crítico en la sombra. Tu elasticidad es
            alta. El Agente Raven trabajará directamente sobre la profundización de tu
            pilar dominante y la expansión de tu rango de operación.
          </p>
        </div>
      </div>

      <!-- CTA de pago -->
      <div class="text-center p-12 bg-bocanada border border-solstis/20">
        <h2 class="font-display text-3xl md:text-4xl text-loriga mb-4">
          Tu Setlist de 12 Semanas te espera
        </h2>
        <p class="font-body text-lg text-halford mb-8 max-w-2xl mx-auto">
          El Agente Raven ha analizado tu perfil. Ahora diseñará un plan personalizado con
          sprints económicos, espirituales y mentales en tu tono de rockstar.
        </p>

        <div v-if="!authStore.isAuthenticated" class="mb-8">
          <p class="font-body text-sm text-halford mb-4">Inicia sesión para continuar</p>
          <div class="flex gap-4 justify-center">
            <button
              @click="authStore.loginWithGoogle()"
              class="px-6 py-3 bg-surface-container border border-outline-variant/30 text-loriga hover:border-solstis transition-all"
            >
              Google
            </button>
            <button
              @click="authStore.loginWithGitHub()"
              class="px-6 py-3 bg-surface-container border border-outline-variant/30 text-loriga hover:border-solstis transition-all"
            >
              GitHub
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col md:flex-row gap-6 justify-center">
          <button
            @click="goToCheckout('premium')"
            class="bg-solstis text-folsom px-10 py-5 font-body text-lg hover:scale-105 transition-all gold-glow interactive-button"
          >
            <span class="button-glow"></span>
            <span class="relative z-20">Escenario Principal — $9.99/mes</span>
          </button>
          <button
            @click="goToCheckout('pro')"
            class="border border-solstis text-solstis px-10 py-5 font-body text-lg hover:bg-solstis/10 transition-all"
          >
            Productor Ejecutivo — $29.99/mes
          </button>
        </div>

        <!-- Email capture -->
        <div class="mt-12 pt-8 border-t border-outline-variant/20">
          <p class="font-body text-sm text-halford mb-4">
            ¿No estás listo para pagar? Guarda tu resultado y recibe una oferta especial.
          </p>
          <div class="flex gap-3 justify-center max-w-md mx-auto">
            <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="flex-1 px-4 py-3 bg-surface-container border border-outline-variant/30 text-loriga focus:border-solstis outline-none"
            />
            <button
              @click="captureEmail"
              :disabled="emailCapturing"
              class="px-6 py-3 bg-surface-container border border-solstis/30 text-solstis hover:bg-solstis/10 transition-all"
            >
              {{ emailCapturing ? "Enviando..." : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="font-display text-2xl text-solstis animate-pulse">
          Analizando tu perfil...
        </div>
        <div class="font-mono text-sm text-halford mt-4">
          El Raven Engine está procesando 34 variables
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'
import { useAuthStore } from '@/stores/authStore'
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
