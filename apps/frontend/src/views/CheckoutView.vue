<template>
  <div class="min-h-screen bg-folsom text-loriga">

    <!-- Nav -->
    <nav class="fixed top-0 z-50 w-full border-b bg-folsom/90 backdrop-blur-md border-outline-variant/20">
      <div class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        <router-link to="/" class="text-2xl italic tracking-tighter uppercase font-display text-solstis">
          ROCKYOURSELF
        </router-link>
        <button
          v-if="authStore.isAuthenticated"
          @click="router.push('/resultado')"
          class="font-mono text-xs transition-colors text-halford hover:text-solstis"
        >
          ← Volver al diagnóstico
        </button>
      </div>
    </nav>

    <!-- ══════════════════════════════════════════════ -->
    <!-- ESTADO: pago exitoso (vuelve de Stripe)       -->
    <!-- ══════════════════════════════════════════════ -->
    <div v-if="paymentSuccess" class="flex items-center justify-center min-h-screen px-5">
      <div class="w-full max-w-lg text-center">
        <div class="font-mono text-xs tracking-[0.25em] uppercase text-solstis mb-6">PAGO CONFIRMADO</div>
        <h1 class="mb-4 text-4xl leading-tight font-display md:text-5xl text-loriga">
          El escenario<br><span class="italic text-solstis">es tuyo.</span>
        </h1>
        <p class="mb-10 text-base leading-relaxed font-body text-halford">
          Tu Agente Raven está listo para generar tu setlist de 12 semanas.<br>
          Sin positivismo barato. Honestidad brutal.
        </p>
        <button
          @click="goToDashboard"
          class="px-10 py-4 bg-solstis text-folsom font-mono text-sm font-bold hover:bg-solstis/80 transition-colors tracking-[0.1em]"
        >
          ENTRAR AL BACKSTAGE →
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!-- ESTADO: cancelado (volvió de Stripe sin pagar) -->
    <!-- ══════════════════════════════════════════════ -->
    <div v-else-if="paymentCanceled" class="flex items-center justify-center min-h-screen px-5">
      <div class="w-full max-w-lg text-center">
        <div class="font-mono text-xs tracking-[0.25em] uppercase text-halford mb-6">PAGO CANCELADO</div>
        <h1 class="mb-4 text-3xl font-display text-loriga">Todavía estás a tiempo.</h1>
        <p class="mb-10 text-base leading-relaxed font-body text-halford">
          Tu diagnóstico sigue guardado. Puedes volver cuando estés listo.
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="paymentCanceled = false"
            class="px-8 py-4 font-mono text-sm font-bold transition-colors bg-solstis text-folsom hover:bg-solstis/80"
          >
            Ver planes →
          </button>
          <button
            @click="router.push('/resultado')"
            class="px-8 py-4 font-mono text-sm transition-colors border border-outline-variant/30 text-halford hover:border-solstis hover:text-solstis"
          >
            Ver diagnóstico
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!-- ESTADO: sin auth — pide login primero         -->
    <!-- ══════════════════════════════════════════════ -->
    <div v-else-if="!authStore.isAuthenticated" class="flex items-center justify-center min-h-screen px-5">
      <div class="w-full max-w-md text-center">
        <div class="font-mono text-xs tracking-[0.2em] uppercase text-halford mb-6">ACCESO REQUERIDO</div>
        <h1 class="mb-4 text-3xl font-display text-loriga">Primero necesitas una cuenta.</h1>
        <p class="mb-10 text-sm leading-relaxed font-body text-halford">
          Inicia sesión para vincular tu diagnóstico y activar tu plan.
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="authStore.loginWithGoogle()"
            class="flex-1 px-6 py-4 text-sm transition-colors border bg-surface-container border-outline-variant/30 text-loriga font-body hover:border-solstis"
          >
            Continuar con Google
          </button>
          <button
            @click="authStore.loginWithGitHub()"
            class="flex-1 px-6 py-4 text-sm transition-colors border bg-surface-container border-outline-variant/30 text-loriga font-body hover:border-solstis"
          >
            Continuar con GitHub
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!-- ESTADO PRINCIPAL: selección de plan          -->
    <!-- ══════════════════════════════════════════════ -->
    <div v-else class="pt-28 pb-20 px-5 md:px-16 max-w-[1100px] mx-auto">

      <!-- Header -->
      <div class="text-center mb-14">
        <p class="font-mono text-xs tracking-[0.25em] uppercase text-halford mb-4">ELIGE TU ACCESO</p>
        <h1 class="mb-4 text-4xl leading-tight font-display md:text-5xl text-loriga">
          El plan que merece<br>
          <span class="italic text-solstis">tu nivel de crisis.</span>
        </h1>
        <p class="max-w-xl mx-auto text-base leading-relaxed font-body text-halford">
          Sin suscripciones trampa. Sin positivismo de app de meditación.<br>
          Un plan real diseñado por IA entrenada en arquetipos.
        </p>
      </div>

      <!-- Toggle mensual / anual -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <button
          @click="billing = 'monthly'"
          class="font-mono text-sm transition-colors"
          :class="billing === 'monthly' ? 'text-solstis' : 'text-halford/50 hover:text-halford'"
        >
          Mensual
        </button>
        <div
          class="relative w-12 h-6 border cursor-pointer border-outline-variant/40"
          @click="billing = billing === 'monthly' ? 'yearly' : 'monthly'"
        >
          <div
            class="absolute w-4 h-4 transition-all duration-300 top-1 bg-solstis"
            :class="billing === 'yearly' ? 'left-7' : 'left-1'"
          ></div>
        </div>
        <button
          @click="billing = 'yearly'"
          class="flex items-center gap-2 font-mono text-sm transition-colors"
          :class="billing === 'yearly' ? 'text-solstis' : 'text-halford/50 hover:text-halford'"
        >
          Anual
          <span class="font-mono text-xs px-2 py-0.5 border border-solstis/40 text-solstis">-25%</span>
        </button>
      </div>

      <!-- Cards de planes -->
      <div class="grid grid-cols-1 gap-px mb-16 md:grid-cols-3 bg-outline-variant/10">

        <!-- FREE -->
        <div class="p-8 bg-folsom">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-4">FREE</div>
          <h2 class="mb-2 text-2xl font-display text-loriga">Backstage Pass</h2>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-4xl font-display text-halford">$0</span>
            <span class="font-mono text-xs text-halford/60">/ siempre</span>
          </div>
          <div class="mb-8 space-y-3">
            <div v-for="f in planes.free" :key="f" class="flex items-start gap-3">
              <span class="font-mono text-xs text-halford/40 mt-0.5 flex-shrink-0">›</span>
              <span class="text-sm font-body text-halford">{{ f }}</span>
            </div>
          </div>
          <div class="pt-6 border-t border-outline-variant/10">
            <div
              v-if="authStore.user?.plan === 'free'"
              class="w-full py-3 text-center font-mono text-xs text-halford/60 border border-outline-variant/20 tracking-[0.1em]"
            >
              PLAN ACTUAL
            </div>
            <button
              v-else
              disabled
              class="w-full py-3 font-mono text-xs border cursor-not-allowed text-halford/40 border-outline-variant/20"
            >
              INCLUIDO
            </button>
          </div>
        </div>

        <!-- PREMIUM — highlighted -->
        <div class="relative p-8 border-t-2 bg-surface-container border-solstis">
          <div class="absolute top-0 -translate-y-1/2 right-6">
            <span class="font-mono text-xs px-3 py-1 bg-solstis text-folsom tracking-[0.1em]">MÁS POPULAR</span>
          </div>
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">PREMIUM</div>
          <h2 class="mb-2 text-2xl font-display text-loriga">Escenario Principal</h2>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-4xl font-display text-loriga">
              ${{ billing === 'monthly' ? '9.99' : '7.49' }}
            </span>
            <span class="font-mono text-xs text-halford/60">/ mes</span>
          </div>
          <div v-if="billing === 'yearly'" class="mb-4 font-mono text-xs text-solstis">
            $89.99 facturado anualmente
          </div>
          <div class="mb-8 space-y-3">
            <div v-for="f in planes.premium" :key="f" class="flex items-start gap-3">
              <span class="font-mono text-xs text-solstis mt-0.5 flex-shrink-0">›</span>
              <span class="text-sm font-body text-loriga">{{ f }}</span>
            </div>
          </div>
          <div class="pt-6 border-t border-outline-variant/20">
            <div
              v-if="authStore.user?.plan === 'premium'"
              class="w-full py-3 text-center font-mono text-xs text-solstis border border-solstis/40 tracking-[0.1em]"
            >
              PLAN ACTUAL
            </div>
            <button
              v-else
              @click="checkout('premium')"
              :disabled="loadingPlan === 'premium'"
              class="w-full py-4 bg-solstis text-folsom font-mono text-sm font-bold hover:bg-solstis/80 transition-colors disabled:opacity-60 tracking-[0.08em]"
            >
              {{ loadingPlan === 'premium' ? 'CONECTANDO...' : 'EMPEZAR →' }}
            </button>
          </div>
        </div>

        <!-- PRO -->
        <div class="p-8 bg-folsom">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-4">PRO</div>
          <h2 class="mb-2 text-2xl font-display text-loriga">Productor Ejecutivo</h2>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-4xl font-display text-loriga">
              ${{ billing === 'monthly' ? '29.99' : '24.99' }}
            </span>
            <span class="font-mono text-xs text-halford/60">/ mes</span>
          </div>
          <div v-if="billing === 'yearly'" class="mb-4 font-mono text-xs text-solstis">
            $299.99 facturado anualmente
          </div>
          <div class="mb-8 space-y-3">
            <div v-for="f in planes.pro" :key="f" class="flex items-start gap-3">
              <span class="font-mono text-xs text-halford/40 mt-0.5 flex-shrink-0">›</span>
              <span class="text-sm font-body text-halford">{{ f }}</span>
            </div>
          </div>
          <div class="pt-6 border-t border-outline-variant/10">
            <div
              v-if="authStore.user?.plan === 'pro'"
              class="w-full py-3 text-center font-mono text-xs text-solstis border border-solstis/40 tracking-[0.1em]"
            >
              PLAN ACTUAL
            </div>
            <button
              v-else
              @click="checkout('pro')"
              :disabled="loadingPlan === 'pro'"
              class="w-full py-4 border border-outline-variant/30 text-loriga font-mono text-sm hover:border-solstis hover:text-solstis transition-colors disabled:opacity-60 tracking-[0.08em]"
            >
              {{ loadingPlan === 'pro' ? 'CONECTANDO...' : 'EMPEZAR →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="p-5 mb-10 text-center border border-error/30 bg-error/5">
        <p class="font-mono text-sm text-error">{{ error }}</p>
      </div>

      <!-- Garantía / trust -->
      <div class="grid grid-cols-1 gap-8 pt-12 text-center border-t md:grid-cols-3 border-outline-variant/10">
        <div>
          <div class="mb-2 text-lg font-display text-loriga">Sin contratos.</div>
          <p class="text-sm leading-relaxed font-body text-halford">
            Cancela cuando quieras desde tu panel de Stripe. Sin letras pequeñas.
          </p>
        </div>
        <div>
          <div class="mb-2 text-lg font-display text-loriga">Pago seguro.</div>
          <p class="text-sm leading-relaxed font-body text-halford">
            Procesado por Stripe. Ni ROCKYOURSELF ni el Agente Raven tocan tus datos de tarjeta.
          </p>
        </div>
        <div>
          <div class="mb-2 text-lg font-display text-loriga">Diagnóstico tuyo.</div>
          <p class="text-sm leading-relaxed font-body text-halford">
            Tu perfil Raven y tu historial de sprints se mantienen aunque cambies de plan.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const billing = ref<'monthly' | 'yearly'>('monthly')
const loadingPlan = ref<'premium' | 'pro' | null>(null)
const error = ref('')
const paymentSuccess = ref(false)
const paymentCanceled = ref(false)

const planes = {
  free: [
    'Quiz completo — 34 preguntas',
    'Perfil Raven con 8 pilares',
    'Diagnóstico narrativo básico',
    'Vista previa de 2 sprints'
  ],
  premium: [
    'Todo lo de Free',
    'Setlist IA de 12 semanas',
    'Dashboard interactivo completo',
    'Sprints económicos, espirituales y mentales',
    'Agente Raven — chat ilimitado',
    'Alertas de burnout en tiempo real'
  ],
  pro: [
    'Todo lo de Premium',
    '1 sesión mensual en vivo con Agente Raven',
    'Acceso prioritario a nuevos arquetipos',
    'Historial de diagnósticos ilimitado',
    'API access para integraciones',
    'Soporte prioritario'
  ]
}

// Detectar estado de retorno desde Stripe
onMounted(() => {
  const q = route.query
  if (q.payment === 'success') {
    paymentSuccess.value = true
    // Actualizar plan en el store local desde la API
    syncUserPlan()
    // Limpiar URL
    router.replace({ path: '/checkout', query: {} })
  } else if (q.canceled === 'true') {
    paymentCanceled.value = true
    router.replace({ path: '/checkout', query: {} })
  }

  // Pre-seleccionar plan si viene de un CTA específico
  if (q.plan === 'pro') billing.value = 'monthly'
})

// Sincronizar plan actualizado por webhook
const syncUserPlan = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`)
    if (response.data.success && response.data.data.plan) {
      authStore.updatePlan(response.data.data.plan)
    }
  } catch (e) {
    // silencioso — no es crítico
  }
}

const checkout = async (planId: 'premium' | 'pro') => {
  if (!authStore.isAuthenticated) return
  loadingPlan.value = planId
  error.value = ''

  try {
    const offerCode = route.query.code as string | undefined
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/stripe/checkout`,
      { planId, billing: billing.value, offerCode }
    )

    if (response.data.success && response.data.data.url) {
      window.location.href = response.data.data.url
    } else {
      error.value = response.data.error || 'Error creando sesión de pago'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error de conexión. Intenta de nuevo.'
  } finally {
    loadingPlan.value = null
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>
