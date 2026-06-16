<template>
  <div class="min-h-screen overflow-x-hidden bg-folsom text-loriga">
    <!-- Nav -->
    <nav class="fixed top-0 z-50 w-full border-b bg-folsom/90 backdrop-blur-md border-outline-variant/20">
      <div class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        <router-link to="/" class="flex items-center gap-3">
          <img src="/logo_rus.webp" alt="RockYourself" class="object-contain w-auto h-10 md:h-12">
        </router-link>
        <router-link to="/dashboard" v-if="authStore.isAuthenticated" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">
          Dashboard
        </router-link>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen pt-20">
      <div class="text-center">
        <div class="mb-4 text-4xl font-display text-solstis animate-pulse">🎸</div>
        <div class="mb-2 text-2xl font-display text-loriga">Analizando tu perfil...</div>
        <div class="font-mono text-sm text-halford">El Raven Engine está procesando 8 mecanismos de supervivencia</div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-5 pt-20">
      <div class="max-w-md text-center">
        <div class="mb-4 text-4xl">⚠️</div>
        <h2 class="mb-4 text-2xl font-display text-loriga">No encontramos tu diagnóstico</h2>
        <p class="mb-8 font-body text-halford">{{ error }}</p>
        <router-link to="/quiz" class="inline-block px-8 py-4 text-lg transition-all bg-solstis text-folsom font-body hover:scale-105">
          Hacer el Quiz
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="resultado" class="pt-24 pb-20 px-5 md:px-16 max-w-[1100px] mx-auto">

      <!-- Header -->
      <div class="mb-16 text-center reveal">
        <span class="font-mono text-xs tracking-[0.3em] uppercase text-solstis mb-4 block">
          DIAGNÓSTICO RAVEN 3.0
        </span>
        <div class="mb-4 font-mono text-sm text-halford">
          Perfil: <span class="text-solstis">{{ resultado.perfil.codigo }}</span>
        </div>
        <h1 class="mb-6 text-4xl font-display md:text-6xl text-loriga">
          Tu motor principal:
          <span class="italic" :style="`color: ${dominante.color}`">
            {{ dominante.nombre }}
          </span>
        </h1>
        <p class="max-w-2xl mx-auto text-lg font-body text-halford">
          {{ dominante.mecanismo }}
        </p>
        <div class="mt-4 font-mono text-xs text-halford/60">
          Rockstar de referencia: {{ dominante.rockstarPrincipal }}
        </div>
      </div>

      <!-- Top 3 Cards -->
      <div class="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        <!-- Dominante -->
        <div class="p-8 border-l-4 bg-surface-container reveal" :style="`border-color: ${dominante.color}`">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            🔥 ARQUETIPO DOMINANTE
          </div>
          <div class="mb-2 text-3xl">{{ dominante.icono }}</div>
          <h3 class="mb-2 text-2xl font-display" :style="`color: ${dominante.color}`">
            {{ dominante.nombre }}
          </h3>
          <p class="mb-4 text-sm font-body text-halford">{{ dominante.usoFuncional }}</p>

          <!-- Estado badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs rounded"
            :style="`background: ${estadoDominante.color}20; color: ${estadoDominante.color}; border: 1px solid ${estadoDominante.color}40`">
            <span>{{ estadoDominante.icon }}</span>
            <span>{{ estadoDominante.label }}</span>
          </div>

          <div class="mt-4 space-y-2">
            <div class="flex justify-between font-mono text-xs">
              <span class="text-halford/60">Funcional</span>
              <span :style="`color: ${dominante.color}`">{{ dominante.scores.funcional }}%</span>
            </div>
            <div class="h-1 overflow-hidden rounded-full bg-halford/10">
              <div class="h-full transition-all duration-1000" :style="`width: ${dominante.scores.funcional}%; background: ${dominante.color}`"></div>
            </div>
            <div class="flex justify-between font-mono text-xs">
              <span class="text-halford/60">Sombra</span>
              <span :style="`color: ${dominante.colorSombra}`">{{ dominante.scores.sombra }}%</span>
            </div>
            <div class="h-1 overflow-hidden rounded-full bg-halford/10">
              <div class="h-full transition-all duration-1000" :style="`width: ${dominante.scores.sombra}%; background: ${dominante.colorSombra}`"></div>
            </div>
          </div>
        </div>

        <!-- Secundario -->
        <div class="p-8 border-l-4 bg-surface-container reveal" :style="`border-color: ${secundario.color}; transition-delay: 0.1s`">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            ⚡ ARQUETIPO SECUNDARIO
          </div>
          <div class="mb-2 text-3xl">{{ secundario.icono }}</div>
          <h3 class="mb-2 text-2xl font-display" :style="`color: ${secundario.color}`">
            {{ secundario.nombre }}
          </h3>
          <p class="mb-4 text-sm font-body text-halford">{{ secundario.usoFuncional }}</p>
          <div class="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs rounded"
            :style="`background: ${estadoSecundario.color}20; color: ${estadoSecundario.color}; border: 1px solid ${estadoSecundario.color}40`">
            <span>{{ estadoSecundario.icon }}</span>
            <span>{{ estadoSecundario.label }}</span>
          </div>
          <div class="mt-4 font-mono text-xs text-halford/60">
            {{ secundario.rockstarPrincipal }}
          </div>
        </div>

        <!-- Terciario -->
        <div v-if="terciario" class="p-8 border-l-4 bg-surface-container reveal" :style="`border-color: ${terciario.color}; transition-delay: 0.2s`">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            🌊 ARQUETIPO TERCIARIO
          </div>
          <div class="mb-2 text-3xl">{{ terciario.icono }}</div>
          <h3 class="mb-2 text-2xl font-display" :style="`color: ${terciario.color}`">
            {{ terciario.nombre }}
          </h3>
          <p class="mb-4 text-sm font-body text-halford">{{ terciario.usoFuncional }}</p>
          <div class="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs rounded"
            :style="`background: ${estadoTerciario.color}20; color: ${estadoTerciario.color}; border: 1px solid ${estadoTerciario.color}40`">
            <span>{{ estadoTerciario.icon }}</span>
            <span>{{ estadoTerciario.label }}</span>
          </div>
          <div class="mt-4 font-mono text-xs text-halford/60">
            {{ terciario.rockstarPrincipal }}
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="alertasActivas.length > 0" class="mb-16 space-y-4 reveal">
        <div v-for="alerta in alertasActivas" :key="alerta.id"
          class="p-6 border rounded-lg"
          :class="alerta.severo ? 'bg-red-950/30 border-red-500/30' : 'bg-yellow-950/30 border-yellow-500/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl" :class="alerta.severo ? 'text-red-400' : 'text-yellow-400'">
              {{ alerta.icono }}
            </span>
            <div>
              <h4 class="text-lg font-display" :class="alerta.severo ? 'text-red-400' : 'text-yellow-400'">
                {{ alerta.titulo }}
              </h4>
              <p class="text-sm font-body text-halford">
                {{ alerta.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sombra detectada -->
      <div v-if="enSombra" class="p-8 mb-16 border-2 rounded-lg reveal"
        :style="`border-color: ${enSombra.colorSombra}40; background: ${enSombra.colorSombra}08`"
      >
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">🌑</span>
          <div>
            <div class="font-mono text-xs tracking-[0.2em] uppercase" :style="`color: ${enSombra.colorSombra}`">
              ARQUETIPO EN SOMBRA
            </div>
            <h3 class="text-2xl font-display" :style="`color: ${enSombra.colorSombra}`">
              {{ enSombra.nombre }}
            </h3>
          </div>
        </div>
        <p class="mb-4 text-base leading-relaxed font-body text-loriga">
          {{ enSombra.sombra }}
        </p>
        <div class="inline-flex items-center gap-2 px-4 py-2 font-mono text-xs rounded"
          :style="`background: ${enSombra.colorSombra}20; color: ${enSombra.colorSombra}; border: 1px solid ${enSombra.colorSombra}40`"
        >
          <span>⚠️</span>
          <span>{{ enSombra.sombraLabel }}</span>
        </div>
        <div class="pt-6 mt-6 border-t border-halford/10">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-3">
            INTERVENCIÓN SUGERIDA
          </div>
          <p class="text-base leading-relaxed font-body text-halford">
            {{ getIntervencionSombra(enSombra.id) }}
          </p>
        </div>
      </div>

      <!-- Mapa de 8 Arquetipos -->
      <div class="p-8 mb-16 bg-surface-container reveal">
        <h3 class="mb-8 text-2xl text-center font-display text-loriga">
          Mapa de 8 Mecanismos de Supervivencia
        </h3>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div v-for="r in todosResultados" :key="r.arquetipoId"
            class="p-4 text-center transition-all border rounded-lg cursor-default"
            :class="[
              r.estado === 'en-sombra' ? 'border-red-500/30 bg-red-950/10' :
              r.estado === 'saludable' ? 'border-green-500/30 bg-green-950/10' :
              r.estado === 'dormido' ? 'border-halford/10 opacity-50' :
              'border-halford/10 hover:border-solstis/30'
            ]"
          >
            <div class="mb-1 text-2xl">{{ r.icono }}</div>
            <div class="mb-1 font-mono text-xs" :style="`color: ${r.color}`">
              {{ r.codigo }}
            </div>
            <div class="mb-2 text-sm font-display" :style="`color: ${r.color}`">
              {{ r.nombre }}
            </div>

            <!-- Barras mini -->
            <div class="space-y-1">
              <div class="flex justify-between font-mono text-[10px]">
                <span class="text-halford/40">F</span>
                <span :style="`color: ${r.color}`">{{ r.scores.funcional }}%</span>
              </div>
              <div class="h-1 overflow-hidden rounded-full bg-halford/10">
                <div class="h-full" :style="`width: ${r.scores.funcional}%; background: ${r.color}`"></div>
              </div>
              <div class="flex justify-between font-mono text-[10px]">
                <span class="text-halford/40">S</span>
                <span :style="`color: ${r.colorSombra}`">{{ r.scores.sombra }}%</span>
              </div>
              <div class="h-1 overflow-hidden rounded-full bg-halford/10">
                <div class="h-full" :style="`width: ${r.scores.sombra}%; background: ${r.colorSombra}`"></div>
              </div>
            </div>

            <div class="mt-2 font-mono text-[10px]" :style="`color: ${getEstadoColor(r.estado)}`">
              {{ getEstadoLabel(r.estado) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Dormidos -->
      <div v-if="dormidos.length > 0" class="p-8 mb-16 border bg-surface-container border-halford/10 reveal">
        <div class="font-mono text-xs tracking-[0.2em] uppercase text-halford mb-4">
          💤 RECURSOS DORMIDOS ({{ dormidos.length }})
        </div>
        <p class="mb-4 text-base font-body text-halford">
          Estos mecanismos están casi inactivos en tu sistema. No los usas, ni en su versión funcional ni en su sombra.
          Representan tus mayores zonas ciegas de crecimiento.
        </p>
        <div class="flex flex-wrap gap-3">
          <div v-for="d in dormidos" :key="d.arquetipoId"
            class="px-4 py-2 font-mono text-xs border rounded"
            :style="`border-color: ${d.color}30; color: ${d.color}`"
          >
            {{ d.icono }} {{ d.nombre }} ({{ d.codigo }})
          </div>
        </div>
      </div>

      <!-- Narrativa del perfil -->
      <div class="mb-16 space-y-px reveal">
        <div class="p-6 border-t-2 bg-surface-container border-solstis">
          <span class="font-mono text-xs tracking-[0.25em] uppercase text-solstis">
            DIAGNÓSTICO NARRATIVO
          </span>
          <h3 class="mt-2 text-2xl font-display text-loriga">Tu Reporte de Crisis</h3>
        </div>

        <!-- Módulo Inercia -->
        <div class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/40">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO INERCIA] Motor Principal
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">
            {{ narrativaInercia }}
          </p>
        </div>

        <!-- Módulo Fricción -->
        <div class="p-6 transition-colors border-l-4 bg-surface-container"
          :class="alertasActivas.some(a => a.severo) ? 'border-red-400' : 'border-transparent hover:border-solstis/40'"
        >
          <div class="font-mono text-xs tracking-[0.15em] uppercase mb-3"
            :class="alertasActivas.some(a => a.severo) ? 'text-red-400' : 'text-halford'"
          >
            [MÓDULO FRICCIÓN] Nivel de Desgaste
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">
            {{ narrativaFriccion }}
          </p>
        </div>

        <!-- Módulo Elasticidad -->
        <div class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/40">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO ELASTICIDAD] Capacidad de Migración
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">
            {{ narrativaElasticidad }}
          </p>
        </div>

        <!-- Antídoto personalizado -->
        <div class="p-8 border-l-4 bg-surface-container border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Tu Intervención
          </div>
          <h4 class="mb-4 text-xl font-display text-loriga">{{ antidoto.titulo }}</h4>
          <p class="mb-6 text-base leading-relaxed font-body text-halford">
            {{ antidoto.diagnostico }}
          </p>
          <div class="pt-6 border-t border-halford/20">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-3">
              Tu acción para mañana a las 8:00 AM
            </div>
            <p class="text-base font-medium leading-relaxed font-body text-loriga">
              {{ antidoto.accion }}
            </p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="p-12 text-center border bg-bocanada border-solstis/20 reveal">
        <h2 class="mb-4 text-3xl font-display md:text-4xl text-loriga">
          Tu Setlist de 12 Semanas te espera
        </h2>
        <p class="max-w-2xl mx-auto mb-8 text-lg font-body text-halford">
          El Agente Raven ha analizado tu perfil {{ resultado.perfil.codigo }}. Ahora diseñará un plan personalizado con sprints económicos, espirituales y mentales en tu tono de rockstar.
        </p>

        <!-- Not authenticated -->
        <div v-if="!authStore.isAuthenticated" class="mb-8">
          <p class="mb-4 text-sm font-body text-halford">Inicia sesión para continuar</p>
          <div class="flex justify-center gap-4">
            <button @click="login('google')" class="px-6 py-3 text-sm transition-all border bg-surface-container border-outline-variant/30 text-loriga hover:border-solstis font-body">
              Google
            </button>
            <button @click="login('github')" class="px-6 py-3 text-sm transition-all border bg-surface-container border-outline-variant/30 text-loriga hover:border-solstis font-body">
              GitHub
            </button>
          </div>
        </div>

        <!-- Authenticated -->
        <div v-else class="flex flex-col justify-center gap-6 md:flex-row">
          <button @click="goToCheckout('premium')" class="bg-solstis text-folsom px-10 py-5 font-body text-lg hover:scale-105 transition-all gold-glow interactive-button shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span class="button-glow"></span>
            <span class="relative z-20">Escenario Principal — $9.99/mes</span>
          </button>
          <button @click="goToCheckout('pro')" class="px-10 py-5 text-lg transition-all border border-solstis text-solstis font-body hover:bg-solstis/10">
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
              class="flex-1 px-4 py-3 text-sm border outline-none bg-surface-container border-outline-variant/30 text-loriga focus:border-solstis font-body"
            />
            <button
              @click="captureEmail"
              :disabled="emailCapturing || !email"
              class="px-6 py-3 text-sm transition-all border bg-surface-container border-solstis/30 text-solstis hover:bg-solstis/10 font-body disabled:opacity-50"
            >
              {{ emailCapturing ? "Enviando..." : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { ARQUETIPOS } from '../stores/quiz.js'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const email = ref('')
const emailCapturing = ref(false)
const resultado = ref(null)

onMounted(() => {
  // 1. Intentar desde history state (navegación directa del quiz)
  if (history.state?.resultado) {
    resultado.value = history.state.resultado
    loading.value = false
    initRevealObserver()
    attachButtonListeners()
    return
  }

  // 2. Intentar desde localStorage
  const stored = localStorage.getItem('raven_diagnostico_v3')
  if (stored) {
    try {
      resultado.value = JSON.parse(stored)
      loading.value = false
      initRevealObserver()
      attachButtonListeners()
      return
    } catch (e) {
      localStorage.removeItem('raven_diagnostico_v3')
    }
  }

  // 3. Fallback: error
  error.value = 'No encontramos un diagnóstico previo. Haz el quiz primero.'
  loading.value = false
})

onUnmounted(() => {
  detachButtonListeners()
})

// ── COMPUTEDS ──

const dominante = computed(() => resultado.value?.perfil?.dominante || null)
const secundario = computed(() => resultado.value?.perfil?.secundario || null)
const terciario = computed(() => resultado.value?.perfil?.terciario || null)
const enSombra = computed(() => resultado.value?.perfil?.enSombra || null)
const dormidos = computed(() => resultado.value?.perfil?.dormidos || [])
const todosResultados = computed(() => resultado.value?.resultados || [])

const estadoDominante = computed(() => getEstadoInfo(dominante.value?.estado))
const estadoSecundario = computed(() => getEstadoInfo(secundario.value?.estado))
const estadoTerciario = computed(() => getEstadoInfo(terciario.value?.estado))

const alertas = computed(() => resultado.value?.alertas || {})

const alertasActivas = computed(() => {
  const lista = []
  const mapa = {
    burnout: { icono: '🔥', titulo: 'ALERTA BURNOUT ACTIVA', descripcion: 'Tu recurso dominante está sobreexplotado. Llevas demasiado tiempo extrayendo del mismo pozo.', severo: true },
    fuga: { icono: '🏃', titulo: 'PATRÓN DE FUGA DETECTADO', descripcion: 'Confundes evolución con evasión. Cada vez que hay fricción, cambias de escenario.', severo: false },
    paralisis: { icono: '🌑', titulo: 'PARÁLISIS POR ANÁLISIS', descripcion: 'Te refugias en la introspección para no actuar. Teorizas sobre tu vida en vez de vivirla.', severo: false },
    codependencia: { icono: '🔗', titulo: 'CODEPENDENCIA OPERATIVA', descripcion: 'Tu autonomía depende de la validación externa. No avanzas si alguien se queda atrás.', severo: false },
    melancolia: { icono: '⚱️', titulo: 'ADICCIÓN A LA TRAGEDIA', descripcion: 'Tu sufrimiento se ha convertido en identidad. Te enamoras de tus propias cicatrices.', severo: true },
    cinismo: { icono: '🎭', titulo: 'CINISMO DEFENSIVO', descripcion: 'Usas el humor para anestesiar el dolor real. Nada se toma en serio, incluyendo tu crecimiento.', severo: false },
    caos: { icono: '🍷', titulo: 'IMPULSIVIDAD DESTRUCTIVA', descripcion: 'Actuar sin calcular te ha metido en problemas mayores. Quemas recursos por no tolerar el aburrimiento.', severo: true }
  }

  Object.entries(alertas.value).forEach(([key, activa]) => {
    if (activa && mapa[key]) {
      lista.push({ id: key, ...mapa[key] })
    }
  })

  return lista
})

// ── NARRATIVAS ──

const narrativaInercia = computed(() => {
  if (!dominante.value) return ''
  const d = dominante.value
  const tiempo = resultado.value?.cronologiaScore || 3
  const tiempoTexto = {
    1: 'menos de una semana',
    2: 'entre 1 y 4 semanas',
    3: 'entre 1 y 3 meses',
    4: 'entre 3 y 12 meses',
    5: 'más de un año'
  }[tiempo] || 'un tiempo prolongado'

  return `Frente al caos, tu primera línea de defensa es **${d.nombre}** (${d.codigo}). Tu sistema nervioso activa este recurso de forma automática antes de pensar. Llevas **${tiempoTexto}** operando desde este pilar. ${d.usoFuncional}`
})

const narrativaFriccion = computed(() => {
  if (!dominante.value) return ''
  const d = dominante.value
  const sombraPct = d.scores?.sombra || 0
  const funcionalPct = d.scores?.funcional || 0

  if (sombraPct > 60) {
    return `Tu motor está operando en **nivel crítico**. La sombra de tu recurso dominante (${sombraPct}%) supera a su uso funcional (${funcionalPct}%). ${d.sombra} Necesitas intervención inmediata.`
  } else if (sombraPct > 40) {
    return `El costo energético de tu recurso dominante es **elevado**. La sombra representa el ${sombraPct}% de tu operación. Aún tienes margen, pero la dirección importa. Estás en zona de riesgo.`
  } else {
    return `Tu recurso dominante opera en **condiciones saludables**. La sombra solo representa el ${sombraPct}% de tu operación. Tu mecanismo de supervivencia está siendo usado correctamente.`
  }
})

const narrativaElasticidad = computed(() => {
  const dormidosCount = dormidos.value.length
  const total = 8
  const elasticidad = ((total - dormidosCount) / total) * 100

  if (elasticidad >= 75) {
    return `Tu índice de elasticidad es **alta** (${elasticidad.toFixed(0)}%). Tienes capacidad real para migrar entre herramientas bajo presión. Tus 8 mecanismos están activos, aunque algunos en sombra.`
  } else if (elasticidad >= 50) {
    return `Tu índice de elasticidad es **moderada** (${elasticidad.toFixed(0)}%). Puedes cambiar de recurso cuando es necesario, pero tienes ${dormidosCount} mecanismos dormidos que limitan tu repertorio.`
  } else if (elasticidad >= 25) {
    return `Tu índice de elasticidad es **limitada** (${elasticidad.toFixed(0)}%). Dependes de pocos recursos para navegar el caos. ${dormidosCount} mecanismos están inactivos, reduciendo drasticamente tus opciones.`
  } else {
    return `Tu índice de elasticidad es **críticamente baja** (${elasticidad.toFixed(0)}%). Casi todos tus mecanismos están dormidos o en sombra. Operas con un repertorio extremadamente reducido bajo presión.`
  }
})

const antidoto = computed(() => {
  // Prioridad: 1) arquetipo en sombra, 2) dominante si está en riesgo, 3) genérico
  if (enSombra.value) {
    return INTERVENCIONES[enSombra.value.id] || INTERVENCIONES.generico
  }
  if (dominante.value && dominante.value.scores?.sombra > 50) {
    return INTERVENCIONES[dominante.value.id] || INTERVENCIONES.generico
  }
  return INTERVENCIONES[dominante.value?.id] || INTERVENCIONES.generico
})

// ── METHODS ──

function getEstadoInfo(estado) {
  const mapa = {
    'saludable': { label: 'Saludable', icon: '✅', color: '#2ecc71' },
    'en-sombra': { label: 'En Sombra', icon: '⚠️', color: '#e74c3c' },
    'equilibrado': { label: 'Equilibrado', icon: '⚖️', color: '#f39c12' },
    'dominante': { label: 'Dominante', icon: '🔥', color: '#D4AF37' },
    'dormido': { label: 'Dormido', icon: '💤', color: '#95a5a6' }
  }
  return mapa[estado] || { label: estado, icon: '•', color: '#bdc3c7' }
}

function getEstadoLabel(estado) {
  return getEstadoInfo(estado).label
}

function getEstadoColor(estado) {
  return getEstadoInfo(estado).color
}

function getIntervencionSombra(arquetipoId) {
  const intervenciones = {
    P1: 'Deja de planificar. Toma una decisión hoy sin tener todas las variables. La incertidumbre no te matará.',
    P2: 'Quédate en el proyecto que te aburre por 30 días más. No huyas. La fricción es información, no señal de escape.',
    P3: 'Haz algo solo hoy. Una decisión, una tarea, un paso. Sin consultar a nadie. Tu juicio es válido sin validación externa.',
    P4: 'Escribe un plan con 3 acciones concretas para esta semana. No más análisis. Ejecuta el primero hoy.',
    P5: 'Sonríe genuinamente hoy. No por el chiste, no por la ironía. Encuentra un momento de ligereza real. El dolor no es tu única identidad.',
    P6: 'Habla de algo que te duele de verdad con alguien de confianza. Sin sarcasmo, sin defensa. Solo vulnerabilidad.',
    P7: 'Delega una tarea hoy. Pide ayuda. Deja de cargar peso que no es tuyo. El martirio no es virtud.',
    P8: 'No hagas nada impulsivo durante 48 horas. Espera. Respira. La quietud no te matará. El aburrimiento es tolerable.'
  }
  return intervenciones[arquetipoId] || 'Identifica tu patrón de sombra y haz una acción consciente en dirección opuesta durante 24 horas.'
}

function login(provider) {
  if (provider === 'google') authStore.loginWithGoogle()
  else authStore.loginWithGithub()
}

function goToCheckout(plan) {
  router.push({ path: '/checkout', query: { plan } })
}

async function captureEmail() {
  if (!email.value || !resultado.value) return
  emailCapturing.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        perfil: resultado.value.perfil,
        alertas: resultado.value.alertas
      })
    })
    if (!response.ok) throw new Error()
    alert('¡Oferta enviada! Revisa tu email en 48h.')
  } catch {
    alert('Error enviando email. Intenta de nuevo.')
  } finally {
    emailCapturing.value = false
  }
}

// ── UI EFFECTS ──
const handleButtonMouseMove = (e) => {
  const btn = e.currentTarget
  const glow = btn.querySelector('.button-glow')
  if (!glow) return
  const rect = btn.getBoundingClientRect()
  glow.style.left = (e.clientX - rect.left) + 'px'
  glow.style.top = (e.clientY - rect.top) + 'px'
}

const attachButtonListeners = () => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.addEventListener('mousemove', handleButtonMouseMove)
  })
}

const detachButtonListeners = () => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.removeEventListener('mousemove', handleButtonMouseMove)
  })
}

const initRevealObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}

// ── INTERVENCIONES POR ARQUETIPO ──
const INTERVENCIONES = {
  P1: {
    titulo: 'El Ritual del Caos Controlado',
    diagnostico: 'Tu exceso de planificación te ha convertido en una máquina de listas. Necesitas aprender a soltar sin caer en el desorden.',
    accion: 'Hoy, durante 30 minutos, haz algo que no tenga ningún objetivo productivo. Solo por el placer. Sin métricas, sin deadline. Improvisa.'
  },
  P2: {
    titulo: 'La Ancla del Compromiso',
    diagnostico: 'Tu flexibilidad radical se ha convertido en evasión crónica. Cada vez que hay fricción, cambias de piel.',
    accion: 'Quédate en el proyecto, relación o ciudad que te aburre por 30 días más. No huyas. La fricción es información, no señal de escape.'
  },
  P3: {
    titulo: 'La Soledad Estratégica',
    diagnostico: 'Tu necesidad de tribu te ha robado autonomía. No avanzas sin validación, te cargas los problemas de todos.',
    accion: 'Haz una decisión importante hoy sin consultar a nadie. Una sola. Actúa solo. Tu juicio es válido sin respaldo externo.'
  },
  P4: {
    titulo: 'Anclaje en lo Terrenal',
    diagnostico: 'Vives tanto en tu mente que olvidas el mundo material. Te refugias en el análisis para no actuar.',
    accion: 'Escribe 3 acciones concretas para esta semana. No más teoría. Ejecuta la primera hoy, aunque no tengas certeza del resultado.'
  },
  P5: {
    titulo: 'Integración de la Luz',
    diagnostico: 'Tu duelo se ha convertido en identidad. Te enamoras de tus cicatrices y usas el sufrimiento para no avanzar.',
    accion: 'Sonríe genuinamente hoy. No por ironía, no por sarcasmo. Encuentra un momento de ligereza real. El dolor no es tu única verdad.'
  },
  P6: {
    titulo: 'La Vulnerabilidad como Fuerza',
    diagnostico: 'Tu humor defensivo anestesia todo. Nada se toma en serio, incluyendo tu propio crecimiento.',
    accion: 'Habla de algo que te duele de verdad con alguien de confianza. Sin chiste, sin defensa. Solo vulnerabilidad. Solo 5 minutos.'
  },
  P7: {
    titulo: 'La Delegación Inteligente',
    diagnostico: 'Tu resistencia se ha convertido en síndrome del mártir. Aguantas peso innecesario y glorificas el sacrificio.',
    accion: 'Delega una tarea hoy. Pide ayuda genuina. Deja de cargar responsabilidades que no son tuyas. El martirio no es virtud.'
  },
  P8: {
    titulo: 'La Pausa Visceral',
    diagnostico: 'Tu impulso te ha metido en problemas mayores. Actúas para no sentir, quemas recursos por no tolerar la quietud.',
    accion: 'No hagas nada impulsivo durante 48 horas. Espera. Respira. La quietud no te matará. El aburrimiento es tolerable, no letal.'
  },
  generico: {
    titulo: 'Intervención Personalizada',
    diagnostico: 'El algoritmo detecta un patrón de uso que requiere ajuste. Tu mecanismo de supervivencia necesita recalibración.',
    accion: 'Dedica 30 minutos hoy a reflexionar sobre qué te bloquea y escribe un plan de acción concreto con 3 pasos ejecutables.'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@500&display=swap');

.font-display { font-family: 'Playfair Display', serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.bg-folsom { background-color: #050505; }
.bg-bocanada { background-color: #0A192F; }
.bg-surface-container { background-color: #201f1f; }

.text-loriga { color: #F0F5F9; }
.text-halford { color: #C0C0C0; }
.text-solstis { color: #D4AF37; }
.text-folsom { color: #050505; }

.border-outline-variant\/10 { border-color: rgba(68, 71, 72, 0.1); }
.border-outline-variant\/20 { border-color: rgba(68, 71, 72, 0.2); }
.border-outline-variant\/30 { border-color: rgba(68, 71, 72, 0.3); }

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

.gold-glow:hover {
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
}

.interactive-button {
  position: relative;
  overflow: hidden;
}
.button-glow {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  opacity: 0;
  z-index: 10;
}
.interactive-button:hover .button-glow {
  opacity: 1;
}
</style>