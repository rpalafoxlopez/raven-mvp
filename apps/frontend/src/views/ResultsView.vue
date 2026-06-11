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
        <div class="font-mono text-sm text-halford">El Raven Engine está procesando tus respuestas</div>
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
    <div v-else-if="perfil" class="pt-24 pb-20 px-5 md:px-16 max-w-[1100px] mx-auto">
      <!-- Header -->
      <div class="mb-16 text-center reveal">
        <span class="font-mono text-xs tracking-[0.3em] uppercase text-solstis mb-4 block">
          DIAGNÓSTICO RAVEN 3.0
        </span>
        <h1 class="mb-6 text-4xl font-display md:text-6xl text-loriga">
          Tu perfil:
          <span class="italic" :style="`color: ${perfil.dominante.color}`">
            {{ perfil.dominante.nombre }}
          </span>
        </h1>
        <p class="max-w-2xl mx-auto text-lg font-body text-halford">
          {{ perfil.dominante.descripcion }}
        </p>
      </div>

      <!-- Profile Cards -->
      <div class="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        <!-- Dominant -->
        <div class="p-8 border-l-4 bg-surface-container reveal" :style="`border-color: ${perfil.dominante.color}`">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO DOMINANTE
          </div>
          <h3 class="mb-2 text-2xl font-display" :style="`color: ${perfil.dominante.color}`">
            {{ perfil.dominante.rockstarPrincipal }}
          </h3>
          <p class="text-sm font-body text-halford">{{ perfil.dominante.nombre }}</p>
          <div class="mt-4 font-mono text-xs text-halford/60">
            Uso: {{ perfil.dominante.uso }} | Costo: {{ perfil.dominante.costo }}/4
          </div>
        </div>

        <!-- Secondary -->
        <div class="p-8 border-l-4 bg-surface-container border-solstis reveal" style="transition-delay: 0.1s">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO SECUNDARIO
          </div>
          <h3 class="mb-2 text-2xl font-display text-solstis">
            {{ perfil.secundario.rockstarPrincipal }}
          </h3>
          <p class="text-sm font-body text-halford">{{ perfil.secundario.nombre }}</p>
        </div>

        <!-- Tertiary -->
        <div v-if="perfil.terciario" class="p-8 border-l-4 bg-surface-container border-halford reveal" style="transition-delay: 0.2s">
          <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford mb-2">
            RECURSO TERCIARIO
          </div>
          <h3 class="mb-2 text-2xl font-display text-halford">
            {{ perfil.terciario.rockstarPrincipal }}
          </h3>
          <p class="text-sm font-body text-halford">{{ perfil.terciario.nombre }}</p>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="perfil.alertas?.burnout || perfil.bloqueado" class="mb-16 space-y-4 reveal">
        <div v-if="perfil.alertas?.burnout" class="p-6 border rounded-lg bg-red-950/30 border-red-500/30">
          <div class="flex items-center gap-3">
            <span class="text-2xl text-red-400">⚠️</span>
            <div>
              <h4 class="text-lg text-red-400 font-display">ALERTA BURNOUT ACTIVA</h4>
              <p class="text-sm font-body text-halford">
                Impacto de desgaste: {{ perfil.alertas.impacto?.toFixed(1) || 'N/A' }} | Tu recurso dominante está sobreexplotado.
              </p>
            </div>
          </div>
        </div>

        <div v-if="perfil.bloqueado" class="p-6 border rounded-lg bg-surface-container border-outline-variant/30">
          <div class="flex items-center gap-3">
            <span class="text-2xl text-solstis">🔒</span>
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

      <!-- 8 Pillars Grid -->
      <div class="p-8 mb-16 bg-surface-container reveal">
        <h3 class="mb-8 text-2xl text-center font-display text-loriga">
          Mapa de 8 Pilares
        </h3>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div v-for="m in metricas" :key="m.id" class="p-4 text-center transition-colors border border-outline-variant/10 hover:border-solstis/30">
            <div class="mb-1 font-mono text-xs text-halford">
              {{ getPilarLabel(m.id) }}
            </div>
            <div class="text-3xl font-display" :style="`color: ${getPilarColor(m.id)}`">
              {{ m.uso_total }}
            </div>
            <div class="mt-1 font-mono text-xs text-halford/60">
              Sombra: {{ m.sombra_total }}
            </div>
          </div>
        </div>
        <div class="mt-6 text-center">
          <span class="font-mono text-sm text-solstis">
            Elasticidad: {{ elasticidadPct.toFixed(0) }}%
          </span>
        </div>
      </div>

      <!-- Narrative Report -->
      <div class="mb-16 space-y-px reveal">
        <div class="p-6 border-t-2 bg-surface-container border-solstis">
          <span class="font-mono text-xs tracking-[0.25em] uppercase text-solstis">
            DIAGNÓSTICO NARRATIVO
          </span>
          <h3 class="mt-2 text-2xl font-display text-loriga">Tu Reporte de Crisis</h3>
        </div>

        <!-- Inertia -->
        <div v-if="moduloInercia" class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/40">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO INERCIA] Recurso Dominante
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">{{ moduloInercia }}</p>
        </div>

        <!-- Friction -->
        <div v-if="moduloFriccion" class="p-6 transition-colors border-l-4 bg-surface-container"
             :class="alertaBurnout ? 'border-red-400' : 'border-transparent hover:border-solstis/40'">
          <div class="font-mono text-xs tracking-[0.15em] uppercase mb-3"
               :class="alertaBurnout ? 'text-red-400' : 'text-halford'">
            [MÓDULO FRICCIÓN] Nivel de Desgaste
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">{{ moduloFriccion }}</p>
        </div>

        <!-- Elasticity -->
        <div v-if="moduloElasticidad" class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/40">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">
            [MÓDULO ELASTICIDAD] Capacidad de Migración
          </div>
          <p class="text-base leading-relaxed font-body text-loriga">{{ moduloElasticidad }}</p>
        </div>

        <!-- Antidote -->
        <div v-if="antidoto" class="p-8 border-l-4 bg-surface-container border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Tu Intervención
          </div>
          <h4 class="mb-4 text-xl font-display text-loriga">{{ antidoto.titulo }}</h4>
          <p class="mb-6 text-base leading-relaxed font-body text-halford">
            {{ antidoto.diagnostico }}
          </p>
          <div class="pt-6 border-t border-outline-variant/20">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-3">
              Tu acción para mañana a las 8:00 AM
            </div>
            <p class="text-base font-medium leading-relaxed font-body text-loriga">
              {{ antidoto.accion }}
            </p>
          </div>
        </div>
        <div v-else class="p-8 border-l-4 bg-surface-container border-solstis">
          <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">
            [MÓDULO ANTÍDOTO] Sin Bloqueo Detectado
          </div>
          <p class="text-base leading-relaxed font-body text-halford">
            El algoritmo no detecta un recurso crítico en la sombra. Tu elasticidad es alta.
            El Agente Raven trabajará directamente sobre la profundización de tu pilar dominante.
          </p>
        </div>
      </div>

      <!-- CTA -->
      <div class="p-12 text-center border bg-bocanada border-solstis/20 reveal">
        <h2 class="mb-4 text-3xl font-display md:text-4xl text-loriga">
          Tu Setlist de 12 Semanas te espera
        </h2>
        <p class="max-w-2xl mx-auto mb-8 text-lg font-body text-halford">
          El Agente Raven ha analizado tu perfil. Ahora diseñará un plan personalizado con sprints económicos, espirituales y mentales en tu tono de rockstar.
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
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const email = ref('')
const emailCapturing = ref(false)

// ===== DATA SOURCE =====
// Priority: 1) Router state (just completed quiz), 2) localStorage, 3) API fetch

const diagnostico = ref(null)

onMounted(async () => {
  // 1. Try router state first (fresh from quiz)
  if (history.state?.diagnostico) {
    diagnostico.value = history.state.diagnostico
    loading.value = false
    initRevealObserver()
    attachButtonListeners()
    return
  }

  // 2. Try localStorage
  const stored = localStorage.getItem('raven_diagnostico')
  if (stored) {
    try {
      diagnostico.value = JSON.parse(stored)
      loading.value = false
      initRevealObserver()
      attachButtonListeners()
      return
    } catch (e) {
      localStorage.removeItem('raven_diagnostico')
    }
  }

  // 3. No data found
  error.value = 'No encontramos un diagnóstico previo. Haz el quiz primero.'
  loading.value = false
})

onUnmounted(() => {
  detachButtonListeners()
})

// ===== COMPUTED =====

const perfil = computed(() => {
  if (!diagnostico.value) return null
  return calcularPerfil(diagnostico.value)
})

const metricas = computed(() => diagnostico.value?.metricas || [])

const elasticidadPct = computed(() => diagnostico.value?.indice_elasticidad_pct || 0)

const alertaBurnout = computed(() => diagnostico.value?.alerta_burnout || false)

const antidoto = computed(() => {
  const bloqueado = diagnostico.value?.recurso_bloqueado
  if (!bloqueado) return null
  return ANTIDOTOS[bloqueado] || null
})

const moduloInercia = computed(() => {
  if (!diagnostico.value || !perfil.value) return null
  const d = diagnostico.value
  const p = perfil.value
  const tiempos = {
    1.0: 'menos de una semana',
    1.2: 'entre 1 y 4 semanas',
    1.5: 'entre 1 y 3 meses',
    2.0: 'entre 3 y 12 meses',
    3.0: 'más de un año'
  }
  const tiempo = tiempos[d.multiplicador_tiempo] || 'un tiempo prolongado'
  return `Frente al caos, tu primera línea de defensa es ${p.dominante.nombre} (${p.dominante.rockstarPrincipal}). Tu sistema nervioso activa este recurso de forma automática antes de pensar. Llevas ${tiempo} operando desde este pilar.`
})

const moduloFriccion = computed(() => {
  if (!diagnostico.value || !perfil.value) return null
  const costo = perfil.value.dominante.costo
  const nivel = costo === 1 ? 'óptimo' : costo === 2 ? 'estable' : costo === 3 ? 'elevado' : 'crítico'
  if (alertaBurnout.value) {
    return `Tu motor está operando en nivel de agotamiento ${nivel} (${costo}/4). El impacto de desgaste acumulado es alto. Llevas demasiado tiempo extrayendo de este mismo pozo.`
  }
  return `El costo energético de tu recurso dominante es ${nivel} (${costo}/4). Aún tienes margen, pero la dirección importa.`
})

const moduloElasticidad = computed(() => {
  if (!diagnostico.value) return null
  const pct = elasticidadPct.value
  const label = pct >= 75 ? 'alta' : pct >= 50 ? 'moderada' : pct >= 25 ? 'limitada' : 'críticamente baja'
  return `Tu índice de elasticidad es ${label} (${pct.toFixed(0)}%). ${pct < 50 ? 'Dependes demasiado de un solo recurso para navegar el caos.' : 'Tienes capacidad real para migrar entre herramientas bajo presión.'}`
})

// ===== METHODS =====

function calcularPerfil(d) {
  const sorted = [...d.metricas].sort((a, b) => b.uso_total - a.uso_total)
  const dominante = PILARES_INFO[sorted[0].id]
  const secundario = PILARES_INFO[sorted[1].id]
  const terciario = sorted[2] ? PILARES_INFO[sorted[2].id] : null
  
  const bloqueadoId = d.recurso_bloqueado
  const bloqueado = bloqueadoId ? PILARES_INFO[bloqueadoId] : null

  return {
    dominante: {
      nombre: dominante.nombre,
      rockstarPrincipal: dominante.rockstars[0],
      color: dominante.color,
      uso: sorted[0].uso_total,
      costo: sorted[0].costo || Math.ceil(sorted[0].uso_total / 25),
      descripcion: dominante.descripcion
    },
    secundario: {
      nombre: secundario.nombre,
      rockstarPrincipal: secundario.rockstars[0]
    },
    terciario: terciario ? {
      nombre: terciario.nombre,
      rockstarPrincipal: terciario.rockstars[0]
    } : null,
    bloqueado: bloqueado ? {
      nombre: bloqueado.nombre,
      rockstarPrincipal: bloqueado.rockstars[0]
    } : null,
    alertas: {
      burnout: d.alerta_burnout,
      impacto: d.impacto_desgaste
    }
  }
}

function getPilarLabel(id) {
  const info = PILARES_INFO[id]
  return info ? info.rockstars[0] : id
}

function getPilarColor(id) {
  const info = PILARES_INFO[id]
  return info ? info.color : '#D4AF37'
}

function login(provider) {
  if (provider === 'google') {
    authStore.loginWithGoogle()
  } else {
    authStore.loginWithGithub()
  }
}

function goToCheckout(plan) {
  router.push({ path: '/checkout', query: { plan } })
}

async function captureEmail() {
  if (!email.value || !diagnostico.value) return
  emailCapturing.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        diagnostico: diagnostico.value
      })
    })
    if (!response.ok) throw new Error()
    alert('¡Oferta enviada! Revisa tu email en 48h.')
  } catch (err) {
    alert('Error enviando email. Intenta de nuevo.')
  } finally {
    emailCapturing.value = false
  }
}

// ===== UI EFFECTS =====

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

// ===== DATA CONSTANTS (inline — no external deps) =====

const PILARES_INFO = {
  disciplina: { nombre: 'Disciplina', rockstars: ['Cash', 'Hetfield'], color: '#D4AF37', descripcion: 'Tu fuerza está en la constancia y la ética de trabajo. No necesitas motivación, necesitas un riff que seguir.' },
  vision: { nombre: 'Visión', rockstars: ['Larregui', 'Bowie'], color: '#F0F5F9', descripcion: 'Ves patrones donde otros ven caos. Tu mente opera en frecuencias que la mayoría no sintoniza.' },
  arquitectura: { nombre: 'Arquitectura', rockstars: ['Cerati', 'Fripp'], color: '#C0C0C0', descripcion: 'Construyes sistemas impecables y hermosos. Tu obsesión por la perfección es tu superpoder y tu trampa.' },
  rebeldia: { nombre: 'Rebeldía', rockstars: ['Bunbury', 'Jagger'], color: '#ff0000', descripcion: 'Rompes reglas que otros ni siquiera cuestionan. Eres el incómodo necesario en cada sala.' },
  espiritu: { nombre: 'Espíritu', rockstars: ['Dylan', 'Marley'], color: '#e9c349', descripcion: 'Tu mensaje trasciende lo material. Hablas por los que no tienen voz, aunque eso te cueste posiciones.' },
  oscuridad: { nombre: 'Oscuridad', rockstars: ['Vegas', 'Cave'], color: '#4a4a4a', descripcion: 'Encuentras belleza en lo sombrío. Tu profundidad intimida a los de superficie brillante.' },
  liderazgo: { nombre: 'Liderazgo', rockstars: ['Halford', 'Dio'], color: '#e9c349', descripcion: 'Naces para estar al frente. No pides permiso; el escenario te pertenece por derecho divino.' },
  innovacion: { nombre: 'Innovación', rockstars: ['Cerati', 'Eno'], color: '#00d4ff', descripcion: 'Creas lo que no existe todavía. Tu mente es un laboratorio donde la lógica y la locura coexisten.' }
}

const ANTIDOTOS = {
  disciplina: {
    titulo: 'El Ritual del Caos Controlado',
    diagnostico: 'Tu exceso de disciplina te ha convertido en una máquina. Necesitas aprender a soltar sin caer en el desorden.',
    accion: 'Hoy, durante 30 minutos, haz algo que no tenga ningún objetivo productivo. Solo por el placer. Sin métricas, sin deadline.'
  },
  vision: {
    titulo: 'Anclaje en lo Terrenal',
    diagnostico: 'Vives tanto en el futuro que olvidas el presente. Tu cuerpo te está pidiendo atención mientras tu mente vuela.',
    accion: 'Camina 20 minutos sin música, sin podcast, sin nada. Solo observa lo físico alrededor. Ancla tu visión en lo tangible.'
  },
  arquitectura: {
    titulo: 'Deconstrucción Creativa',
    diagnostico: 'Tu necesidad de control te impide la magia del accidente. Lo imprevisto te aterra más de lo que admites.',
    accion: 'Escribe una página de texto sin borrar nada. Deja que sea imperfecto. Publica sin revisar tres veces.'
  },
  rebeldia: {
    titulo: 'Canalización Estratégica',
    diagnostico: 'Tu rebeldía sin dirección te está aislando. Necesitas una causa, no solo oposición por oposición.',
    accion: 'Identifica una regla injusta en tu entorno y propón una alternativa constructiva. Sé el arquitecto del nuevo sistema.'
  },
  espiritu: {
    titulo: 'Materialización de lo Sagrado',
    diagnostico: 'Tu espiritualidad necesita raíces terrenales para no volverse escapismo. Los sueños necesitan presupuesto.',
    accion: 'Convierte un ritual espiritual en una acción física concreta hoy. Una llamada, un email, un pago, un plan.'
  },
  oscuridad: {
    titulo: 'Integración de la Luz',
    diagnostico: 'Tu comodidad con la sombra te impide ver oportunidades luminosas. No todo lo brillante es superficial.',
    accion: 'Haz algo que un "optimista tóxico" haría, solo para experimentar la sensación. Sonríe a un desconocido. Sin ironía.'
  },
  liderazgo: {
    titulo: 'Servicio Humilde',
    diagnostico: 'Tu trono está vacío porque nadie quiere estar cerca de un dictador. El liderazgo sin empatía es soledad con corona.',
    accion: 'Pide ayuda genuinamente a alguien que consideras inferior. Escucha sin interrumpir. Agradece sin condescendencia.'
  },
  innovacion: {
    titulo: 'Perfección de lo Existente',
    diagnostico: 'Siempre creas nuevo, nunca terminas. Necesitas completar algo viejo antes de que la novedad te devore.',
    accion: 'Termina un proyecto abandonado antes de empezar uno nuevo. La innovación sin ejecución es fantasía con PowerPoint.'
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
.bg-red-950\/30 { background-color: rgba(69, 10, 10, 0.3); }
.border-red-500\/30 { border-color: rgba(239, 68, 68, 0.3); }
.text-red-400 { color: #f87171; }

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