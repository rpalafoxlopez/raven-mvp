<template>
  <div class="min-h-screen overflow-x-hidden bg-bocanada text-loriga">

    <!-- Nav -->
    <nav class="fixed top-0 z-50 w-full border-b bg-folsom/90 backdrop-blur-md border-folsom/10">
      <div class="flex items-center justify-between px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        <router-link to="/">
          <img src="/logo_rus.webp" alt="RockYourself" class="object-contain w-auto h-10 md:h-12">
        </router-link>
        <router-link v-if="authStore.isAuthenticated" to="/dashboard"
          class="font-mono text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">
          Dashboard
        </router-link>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="mb-4 text-5xl animate-pulse">🎸</div>
        <div class="mb-2 text-2xl font-display text-loriga">Analizando tu perfil...</div>
        <div class="font-mono text-sm text-halford">El Raven Engine está procesando 8 mecanismos</div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-5">
      <div class="max-w-md text-center">
        <div class="mb-4 text-4xl">⚠️</div>
        <h2 class="mb-4 text-2xl font-display text-loriga">No encontramos tu diagnóstico</h2>
        <p class="mb-8 font-body text-halford">{{ error }}</p>
        <router-link to="/quiz" class="inline-block px-8 py-4 transition-all bg-solstis text-folsom font-body hover:scale-105">
          Hacer el Quiz
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="resultado" class="pt-24 pb-20">

      <!-- ══ HERO: Silueta del Rockstar + Arquetipo Dominante ══ -->
      <section class="relative overflow-hidden min-h-[90vh] flex items-end">

        <!-- Fondo oscuro con gradiente de color del arquetipo -->
        <div class="absolute inset-0 bg-folsom">
          <div class="absolute inset-0 transition-opacity duration-1000"
            :style="`background: radial-gradient(ellipse 80% 70% at 60% 30%, ${dominante.color}18 0%, transparent 70%)`">
          </div>
        </div>

        <!-- Silueta del Rockstar — derecha de la pantalla -->
        <div class="absolute inset-y-0 right-0 flex items-end justify-end w-1/2 pointer-events-none md:w-5/12">
          <!-- Con foto -->
          <template v-if="dominanteImagen">
            <div class="relative w-full h-full">
              <!-- Imagen con máscara de silueta -->
            <img
                  :src="dominanteImagen"
                  :alt="dominante.rockstarPrincipal"
                  class="absolute bottom-0 right-0 object-contain object-bottom w-full h-full"
                  style="background: white;"
                />
              <!-- Overlay de color del arquetipo sobre la imagen -->
              <div class="absolute inset-0"
                :style="`background: linear-gradient(to right, ${dominante.color}22 0%, transparent 60%); mix-blend-mode: color`">
              </div>
              <!-- Gradiente de fade hacia el contenido izquierdo -->
              <div class="absolute inset-0"
                style="background: linear-gradient(to right, #0A0A0A 0%, transparent 40%)">
              </div>
            </div>
          </template>
          <!-- Sin foto: placeholder con icono grande -->
          <template v-else>
            <div class="flex items-center justify-center w-full h-full opacity-10">
              <span class="text-[20rem] leading-none select-none">{{ dominante.icono }}</span>
            </div>
          </template>
        </div>

        <!-- Contenido hero — izquierda -->
        <div class="relative z-10 px-5 pb-16 md:px-16 max-w-[1280px] mx-auto w-full">
          <div class="max-w-xl">
            <div class="font-mono text-xs tracking-[0.4em] uppercase text-solstis mb-4 reveal">
              DIAGNÓSTICO RAVEN 3.0 · {{ resultado.perfil.codigo }}
            </div>
            <div class="mb-3 font-mono text-sm reveal" style="transition-delay: 0.1s">
              <span class="text-halford">Mecanismo dominante:</span>
            </div>
            <h1 class="mb-4 font-display text-5xl md:text-7xl leading-[0.95] reveal" style="transition-delay: 0.15s"
              :style="`color: ${dominante.color}`">
              {{ dominante.nombre }}
            </h1>
            <p class="mb-6 text-lg leading-relaxed font-body text-halford/80 reveal" style="transition-delay: 0.2s">
              {{ dominante.mecanismo }}
            </p>
            <div class="flex items-center gap-4 reveal" style="transition-delay: 0.25s">
              <div class="h-px flex-1 max-w-[60px]" :style="`background: ${dominante.color}`"></div>
              <span class="font-mono text-xs text-halford">
                Rockstar de referencia:
                <span :style="`color: ${dominante.color}`"> {{ dominante.rockstarPrincipal }}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div class="px-5 md:px-16 max-w-[1100px] mx-auto mt-16">

        <!-- ══ Top 3 Arquetipos ══ -->
        <div class="grid grid-cols-1 gap-px mb-16 md:grid-cols-3 bg-folsom/5">

          <!-- Dominante -->
          <div class="p-8 border-t-2 bg-surface-container reveal" :style="`border-color: ${dominante.color}`">
            <div class="flex items-center justify-between mb-4">
              <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford">DOMINANTE</div>
              <div class="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] rounded"
                :style="`background: ${estadoDominante.color}20; color: ${estadoDominante.color}; border: 1px solid ${estadoDominante.color}40`">
                <span>{{ estadoDominante.icon }}</span> {{ estadoDominante.label }}
              </div>
            </div>
            <!-- Foto del rockstar en la card si existe -->
            <div v-if="dominanteImagen" class="relative w-full mb-4 overflow-hidden rounded h-28">
              <img :src="IMAGENES_ROCKSTARPNG[dominante.codigo]" :alt="dominante.rockstarPrincipal"
                class="object-cover object-top w-full h-full"
                :style="`filter: saturate(0.6) contrast(1.1); border-bottom: 2px solid ${dominante.color}`" />
              <div class="absolute inset-0" :style="`background: linear-gradient(to top, ${dominante.color}40 0%, transparent 20%)`"></div>
            </div>
            <h3 class="mb-2 text-xl font-display" :style="`color: ${dominante.color}`">{{ dominante.nombre }}</h3>
            <p class="mb-4 text-sm leading-relaxed font-body text-halford">{{ dominante.usoFuncional }}</p>
            <div class="space-y-2">
              <div class="flex justify-between font-mono text-[11px]">
                <span class="text-halford/50">Funcional</span>
                <span :style="`color: ${dominante.color}`">{{ dominante.scores.funcional }}%</span>
              </div>
              <div class="h-1 overflow-hidden bg-folsom/5">
                <div class="h-full transition-all duration-1000" :style="`width: ${dominante.scores.funcional}%; background: ${dominante.color}`"></div>
              </div>
              <div class="flex justify-between font-mono text-[11px]">
                <span class="text-halford/50">Sombra</span>
                <span :style="`color: ${dominante.colorSombra}`">{{ dominante.scores.sombra }}%</span>
              </div>
              <div class="h-1 overflow-hidden bg-folsom/5">
                <div class="h-full transition-all duration-1000" :style="`width: ${dominante.scores.sombra}%; background: ${dominante.colorSombra}`"></div>
              </div>
            </div>
          </div>

          <!-- Secundario -->
          <div class="p-8 border-t-2 bg-surface-container reveal" :style="`border-color: ${secundario.color}; transition-delay: 0.1s`">
            <div class="flex items-center justify-between mb-4">
              <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford">SECUNDARIO</div>
              <div class="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] rounded"
                :style="`background: ${estadoSecundario.color}20; color: ${estadoSecundario.color}; border: 1px solid ${estadoSecundario.color}40`">
                <span>{{ estadoSecundario.icon }}</span> {{ estadoSecundario.label }}
              </div>
            </div>
            <div v-if="IMAGENES_ROCKSTARPNG[secundario.codigo]" class="relative w-full mb-4 overflow-hidden rounded h-28">
              <img :src="IMAGENES_ROCKSTARPNG[secundario.codigo]" :alt="secundario.rockstarPrincipal"
                class="object-cover object-top w-full h-full"
                :style="`filter: saturate(0.5) contrast(1.1); border-bottom: 2px solid ${secundario.color}`" />
              <div class="absolute inset-0" :style="`background: linear-gradient(to top, ${secundario.color}40 0%, transparent 20%)`"></div>
            </div>
            <h3 class="mb-2 text-xl font-display" :style="`color: ${secundario.color}`">{{ secundario.nombre }}</h3>
            <p class="mb-4 text-sm leading-relaxed font-body text-halford">{{ secundario.usoFuncional }}</p>
            <div class="font-mono text-xs text-halford/50">{{ secundario.rockstarPrincipal }}</div>
          </div>

          <!-- Terciario -->
          <div v-if="terciario" class="p-8 border-t-2 bg-surface-container reveal" :style="`border-color: ${terciario.color}; transition-delay: 0.2s`">
            <div class="flex items-center justify-between mb-4">
              <div class="font-mono text-xs tracking-[0.1em] uppercase text-halford">TERCIARIO</div>
              <div class="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] rounded"
                :style="`background: ${estadoTerciario.color}20; color: ${estadoTerciario.color}; border: 1px solid ${estadoTerciario.color}40`">
                <span>{{ estadoTerciario.icon }}</span> {{ estadoTerciario.label }}
              </div>
            </div>
            <div v-if="IMAGENES_ROCKSTARPNG[terciario.codigo]" class="relative w-full mb-4 overflow-hidden rounded h-28">
              <img :src="IMAGENES_ROCKSTARPNG[terciario.codigo]" :alt="terciario.rockstarPrincipal"
                class="object-cover object-top w-full h-full"
                :style="`filter: saturate(0.5) contrast(1.1); border-bottom: 2px solid ${terciario.color}`" />
              <div class="absolute inset-0" :style="`background: linear-gradient(to top, ${terciario.color}40 0%, transparent 20%)`"></div>
            </div>
            <h3 class="mb-2 text-xl font-display" :style="`color: ${terciario.color}`">{{ terciario.nombre }}</h3>
            <p class="mb-4 text-sm leading-relaxed font-body text-halford">{{ terciario.usoFuncional }}</p>
            <div class="font-mono text-xs text-halford/50">{{ terciario.rockstarPrincipal }}</div>
          </div>
        </div>

        <!-- ══ Alertas ══ -->
        <div v-if="alertasActivas.length > 0" class="mb-16 space-y-3 reveal">
          <div v-for="alerta in alertasActivas" :key="alerta.id" class="flex items-start gap-4 p-5 border"
            :class="alerta.severo ? 'bg-red-950/20 border-red-500/20' : 'bg-yellow-950/20 border-yellow-500/20'">
            <span class="mt-0.5 text-2xl flex-shrink-0" :class="alerta.severo ? 'text-red-400' : 'text-yellow-400'">{{ alerta.icono }}</span>
            <div>
              <h4 class="mb-1 font-mono text-xs tracking-widest" :class="alerta.severo ? 'text-red-400' : 'text-yellow-400'">{{ alerta.titulo }}</h4>
              <p class="text-sm font-body text-halford">{{ alerta.descripcion }}</p>
            </div>
          </div>
        </div>

        <!-- ══ Sombra detectada ══ -->
        <div v-if="enSombra" class="p-8 mb-16 border-l-4 bg-surface-container reveal"
          :style="`border-color: ${enSombra.colorSombra}`">
          <div class="font-mono text-xs tracking-[0.2em] uppercase mb-2" :style="`color: ${enSombra.colorSombra}`">
            ARQUETIPO EN SOMBRA
          </div>
          <h3 class="mb-4 text-2xl font-display" :style="`color: ${enSombra.colorSombra}`">{{ enSombra.nombre }}</h3>
          <p class="mb-4 text-base leading-relaxed font-body text-loriga">{{ enSombra.sombra }}</p>
          <div class="pt-6 mt-6 border-t border-folsom/10">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-2">INTERVENCIÓN</div>
            <p class="text-base leading-relaxed font-body text-halford">{{ getIntervencionSombra(enSombra.id) }}</p>
          </div>
        </div>

        <!-- ══ Mapa de 8 Arquetipos ══ -->
        <div class="mb-16 reveal">
          <div class="mb-6 text-center">
            <div class="font-mono text-xs tracking-[0.3em] uppercase text-halford mb-2">EL SUPERGRUPO</div>
            <h3 class="text-3xl font-display text-loriga">Mapa de 8 Mecanismos</h3>
          </div>
          <div class="grid grid-cols-2 gap-px md:grid-cols-4 bg-folsom/5">
            <div v-for="r in todosResultados" :key="r.arquetipoId"
              class="relative overflow-hidden transition-all cursor-default group bg-surface-container"
              :class="r.estado === 'dormido' ? 'opacity-40' : ''"
            >
              <!-- Foto de fondo si existe -->
              <div v-if="IMAGENES_ROCKSTAR[r.arquetipoId]" class="absolute inset-0 overflow-hidden">
                <img :src="IMAGENES_ROCKSTAR[r.arquetipoId]"
                  class="object-cover object-top w-full h-full transition-transform duration-500 scale-105 group-hover:scale-100"
                  :style="`filter: saturate(0.2) brightness(0.3)`" />
                <div class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  :style="`background: linear-gradient(135deg, ${r.color}30 0%, transparent 70%)`"></div>
              </div>
              <!-- Sin foto: fondo de color sutil -->
              <div v-else class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                :style="`background: ${r.color}08`"></div>

              <!-- Contenido de la card -->
              <div class="relative z-10 p-4">
                <!-- Barra de estado arriba -->
                <div class="h-0.5 w-full mb-3 transition-all duration-500"
                  :style="`background: ${r.estado === 'dormido' ? 'rgba(255,255,255,0.1)' : r.color}; opacity: ${r.scores.funcional / 100}`"></div>

                <div class="mb-1 font-mono text-xs" :style="`color: ${r.color}`">{{ r.codigo }}</div>
                <div class="mb-3 text-sm leading-tight font-display text-loriga">{{ r.nombre }}</div>

                <!-- Mini barras -->
                <div class="space-y-1">
                  <div class="flex justify-between font-mono text-[9px] text-halford/40">
                    <span>F</span><span :style="`color: ${r.color}`">{{ r.scores.funcional }}%</span>
                  </div>
                  <div class="h-0.5 overflow-hidden bg-folsom/5">
                    <div :style="`width: ${r.scores.funcional}%; background: ${r.color}`"></div>
                  </div>
                  <div class="flex justify-between font-mono text-[9px] text-halford/40">
                    <span>S</span><span :style="`color: ${r.colorSombra}`">{{ r.scores.sombra }}%</span>
                  </div>
                  <div class="h-0.5 overflow-hidden bg-folsom/5">
                    <div :style="`width: ${r.scores.sombra}%; background: ${r.colorSombra}`"></div>
                  </div>
                </div>

                <div class="mt-3 font-mono text-[9px]" :style="`color: ${getEstadoColor(r.estado)}`">
                  {{ getEstadoLabel(r.estado) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ Reporte Narrativo ══ -->
        <div class="mb-16 space-y-px reveal">
          <div class="p-6 border-t-2 bg-surface-container border-solstis">
            <div class="font-mono text-xs tracking-[0.25em] uppercase text-solstis">DIAGNÓSTICO NARRATIVO</div>
            <h3 class="mt-2 text-2xl font-display text-loriga">Tu Reporte de Crisis</h3>
          </div>
          <div class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/30">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">[MÓDULO INERCIA] Motor Principal</div>
            <p class="text-base leading-relaxed font-body text-loriga">{{ narrativaInercia }}</p>
          </div>
          <div class="p-6 transition-colors border-l-4 bg-surface-container"
            :class="alertasActivas.some(a => a.severo) ? 'border-red-400' : 'border-transparent hover:border-solstis/30'">
            <div class="font-mono text-xs tracking-[0.15em] uppercase mb-3"
              :class="alertasActivas.some(a => a.severo) ? 'text-red-400' : 'text-halford'">
              [MÓDULO FRICCIÓN] Nivel de Desgaste
            </div>
            <p class="text-base leading-relaxed font-body text-loriga">{{ narrativaFriccion }}</p>
          </div>
          <div class="p-6 transition-colors border-l-4 border-transparent bg-surface-container hover:border-solstis/30">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-halford mb-3">[MÓDULO ELASTICIDAD] Capacidad de Migración</div>
            <p class="text-base leading-relaxed font-body text-loriga">{{ narrativaElasticidad }}</p>
          </div>
          <div class="p-8 border-l-4 bg-surface-container border-solstis">
            <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-4">[MÓDULO ANTÍDOTO] Tu Intervención</div>
            <h4 class="mb-4 text-xl font-display text-loriga">{{ antidoto.titulo }}</h4>
            <p class="mb-6 text-base leading-relaxed font-body text-halford">{{ antidoto.diagnostico }}</p>
            <div class="pt-6 border-t border-folsom/10">
              <div class="font-mono text-xs tracking-[0.15em] uppercase text-solstis mb-3">Tu acción para mañana a las 8:00 AM</div>
              <p class="text-base font-medium leading-relaxed font-body text-loriga">{{ antidoto.accion }}</p>
            </div>
          </div>
        </div>

        <!-- ══ CTA + Email Capture ══ -->
        <div class="p-10 mb-8 text-center border bg-folsom border-solstis/20 reveal">

          <!-- Silueta decorativa del rockstar dominante en el CTA -->
          <div v-if="dominanteImagen" class="relative flex justify-center h-40 mb-8 overflow-hidden">
            <img :src="dominanteImagen" :alt="dominante.rockstarPrincipal"
              class="object-cover object-top h-full opacity-30"
              style="mask-image: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%);"
            />
          </div>

          <div class="font-mono text-xs tracking-[0.3em] uppercase text-solstis mb-4">TU SIGUIENTE ACTO</div>
          <h2 class="mb-4 text-4xl font-display text-loriga">Tu Setlist de 12 Semanas</h2>
          <p class="max-w-xl mx-auto mb-10 leading-relaxed font-body text-halford">
            El Agente Raven diseñará un plan personalizado basado en tu perfil
            <span class="text-solstis">{{ resultado.perfil.codigo }}</span>
            con sprints económicos, espirituales y mentales.
          </p>

          <!-- Sin auth: login -->
          <div v-if="!authStore.isAuthenticated" class="mb-8">
            <p class="mb-4 font-mono text-xs text-halford">Inicia sesión para activar tu plan</p>
            <div class="flex justify-center gap-4">
              <button @click="login('google')"
                class="px-6 py-3 text-sm transition-all border bg-surface-container border-folsom/10 text-loriga hover:border-solstis font-body">
                Continuar con Google
              </button>
              <button @click="login('github')"
                class="px-6 py-3 text-sm transition-all border bg-surface-container border-folsom/10 text-loriga hover:border-solstis font-body">
                Continuar con GitHub
              </button>
            </div>
          </div>

          <!-- Con auth: checkout -->
          <div v-else class="flex flex-col justify-center gap-4 md:flex-row">
            <button @click="goToCheckout('premium')"
              class="relative overflow-hidden bg-solstis text-folsom px-10 py-5 font-body text-lg uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] interactive-button">
              <span class="button-glow"></span>
              <span class="relative z-20">🎸 Escenario Principal — $9.99/mes</span>
            </button>
            <button @click="goToCheckout('pro')"
              class="px-10 py-5 text-lg tracking-wider uppercase transition-all border border-solstis/40 text-solstis font-body hover:bg-solstis/10">
              Productor Ejecutivo — $29.99/mes
            </button>
          </div>

          <!-- Email capture -->
          <div class="max-w-md pt-10 mx-auto mt-12 border-t border-folsom/10">
            <p class="mb-2 font-mono text-xs tracking-[0.15em] uppercase text-halford">¿No listo para pagar?</p>
            <p class="mb-5 text-sm font-body text-halford/60">Guarda tu resultado y recibe una oferta especial en 48h.</p>
            <div class="flex gap-2">
              <input
                v-model="email"
                type="email"
                placeholder="tu@email.com"
                class="flex-1 px-4 py-3 text-sm border outline-none bg-surface-container border-folsom/10 text-loriga focus:border-solstis font-body"
              />
              <button
                @click="captureEmail"
                :disabled="emailCapturing || !email"
                class="px-5 py-3 text-sm transition-all border border-solstis/30 text-solstis font-body hover:bg-solstis/10 disabled:opacity-40 whitespace-nowrap"
              >
                {{ emailCapturing ? 'Enviando...' : 'Guardar →' }}
              </button>
            </div>
            <p v-if="emailSuccess" class="mt-3 font-mono text-xs text-green-400">{{ emailSuccess }}</p>
            <p v-if="emailError" class="mt-3 font-mono text-xs text-red-400">{{ emailError }}</p>
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

const loading  = ref(true)
const error    = ref(null)
const email    = ref('')
const emailCapturing = ref(false)
const emailSuccess   = ref('')
const emailError     = ref('')
const resultado = ref(null)

// ── Mapa de imágenes por arquetipoId ──
// Agrega más fotos en /public/ y referencia aquí.
// Formato: '/nombre.jpg' o '/nombre.webp'
const IMAGENES_ROCKSTAR = {
  P1: '/bruce.webp',      // El Arquitecto Sonico — Bruce Springsteen / referencia Cerati
  P2: '/bowie.webp',     // El Alienigena Camaleon — Bunbury
  P3: '/mercury.webp',        // El Forajido del Duelo — Johnny Cash
  P4: '/dylan.webp', 
  P5: '/kurt.webp',
  P6: '/liam.webp',
  P7: '/cash.webp',
  P8: '/hendrix.webp', 
}

const IMAGENES_ROCKSTARPNG = {
  P1: '/bruce.png',      // El Arquitecto Sonico — Bruce Springsteen / referencia Cerati
  P2: '/bowie.png',     // El Alienigena Camaleon — Bunbury
  P3: '/mercury.png',        // El Forajido del Duelo — Johnny Cash
  P4: '/dylan.png', 
  P5: '/kurt.png',
  P6: '/liam.png',
  P7: '/cash.png',
  P8: '/hendrix.png', 
}

onMounted(() => {
  if (history.state?.resultado) {
    resultado.value = history.state.resultado
    loading.value = false
    init()
    return
  }

  const stored = localStorage.getItem('raven_diagnostico_v3')
  if (stored) {
    try {
      resultado.value = JSON.parse(stored)
      loading.value = false
      init()
      return
    } catch {
      localStorage.removeItem('raven_diagnostico_v3')
    }
  }

  error.value = 'No encontramos un diagnóstico previo. Haz el quiz primero.'
  loading.value = false
})

onUnmounted(() => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.removeEventListener('mousemove', handleGlow)
  })
})

function init() {
  setTimeout(() => {
    initReveal()
    document.querySelectorAll('.interactive-button').forEach(btn => {
      btn.addEventListener('mousemove', handleGlow)
    })
  }, 100)
}

// ── Computeds ──

const dominante  = computed(() => resultado.value?.perfil?.dominante  || null)
const secundario = computed(() => resultado.value?.perfil?.secundario || null)
const terciario  = computed(() => resultado.value?.perfil?.terciario  || null)
const enSombra   = computed(() => resultado.value?.perfil?.enSombra   || null)
const dormidos   = computed(() => resultado.value?.perfil?.dormidos   || [])
const todosResultados = computed(() => resultado.value?.resultados    || [])
const alertas    = computed(() => resultado.value?.alertas            || {})

console.log( dominante , secundario , terciario)

const dominanteImagen = computed(() => {
  //console.log( dominante.value );
  if (!dominante.value) return null
  return IMAGENES_ROCKSTAR[dominante.value.arquetipoId] || null
})

const estadoDominante  = computed(() => getEstadoInfo(dominante.value?.estado))
const estadoSecundario = computed(() => getEstadoInfo(secundario.value?.estado))
const estadoTerciario  = computed(() => getEstadoInfo(terciario.value?.estado))

const alertasActivas = computed(() => {
  const MAPA = {
    burnout:       { icono: '🔥', titulo: 'ALERTA BURNOUT',           descripcion: 'Tu recurso dominante está sobreexplotado. Llevas demasiado tiempo extrayendo del mismo pozo.', severo: true  },
    fuga:          { icono: '🏃', titulo: 'PATRÓN DE FUGA',           descripcion: 'Confundes evolución con evasión. Cada vez que hay fricción, cambias de escenario.',          severo: false },
    paralisis:     { icono: '🌑', titulo: 'PARÁLISIS POR ANÁLISIS',   descripcion: 'Te refugias en la introspección para no actuar. Teorizas sobre tu vida en vez de vivirla.',  severo: false },
    codependencia: { icono: '🔗', titulo: 'CODEPENDENCIA OPERATIVA',  descripcion: 'Tu autonomía depende de la validación externa.',                                             severo: false },
    melancolia:    { icono: '⚱️', titulo: 'ADICCIÓN A LA TRAGEDIA',   descripcion: 'Tu sufrimiento se ha convertido en identidad. Te enamoras de tus propias cicatrices.',       severo: true  },
    cinismo:       { icono: '🎭', titulo: 'CINISMO DEFENSIVO',        descripcion: 'Usas el humor para anestesiar el dolor real.',                                               severo: false },
    caos:          { icono: '🍷', titulo: 'IMPULSIVIDAD DESTRUCTIVA', descripcion: 'Actuar sin calcular te ha metido en problemas. Quemas recursos por no tolerar el aburrimiento.', severo: true  }
  }
  return Object.entries(alertas.value)
    .filter(([, activa]) => activa)
    .map(([key]) => MAPA[key])
    .filter(Boolean)
    .map((a, i) => ({ ...a, id: Object.keys(alertas.value).filter(k => alertas.value[k])[i] }))
})

// ── Narrativas ──

const narrativaInercia = computed(() => {
  if (!dominante.value) return ''
  const d = dominante.value
  const tiempos = { 1: 'menos de una semana', 2: 'entre 1 y 4 semanas', 3: 'entre 1 y 3 meses', 4: 'entre 3 y 12 meses', 5: 'más de un año' }
  const tiempo = tiempos[resultado.value?.cronologiaScore] || 'un tiempo prolongado'
  return `Tu primera línea de defensa frente al caos es ${d.nombre} (${d.codigo}). Llevas ${tiempo} operando desde este pilar. ${d.usoFuncional}`
})

const narrativaFriccion = computed(() => {
  if (!dominante.value) return ''
  const sombra = dominante.value.scores?.sombra || 0
  const funcional = dominante.value.scores?.funcional || 0
  if (sombra > 60) return `Tu motor opera en nivel crítico. La sombra (${sombra}%) supera el uso funcional (${funcional}%). ${dominante.value.sombra} Necesitas intervención inmediata.`
  if (sombra > 40) return `El costo energético es elevado. La sombra representa el ${sombra}% de tu operación. Estás en zona de riesgo.`
  return `Tu recurso dominante opera en condiciones saludables. La sombra solo representa el ${sombra}% de tu operación.`
})

const narrativaElasticidad = computed(() => {
  const inactivos = dormidos.value.length
  const pct = Math.round(((8 - inactivos) / 8) * 100)
  if (pct >= 75) return `Elasticidad alta (${pct}%). Tienes capacidad real para migrar entre herramientas bajo presión.`
  if (pct >= 50) return `Elasticidad moderada (${pct}%). Puedes cambiar de recurso, pero tienes ${inactivos} mecanismos dormidos que limitan tu repertorio.`
  if (pct >= 25) return `Elasticidad limitada (${pct}%). Dependes de pocos recursos. ${inactivos} mecanismos inactivos reducen tus opciones dramáticamente.`
  return `Elasticidad críticamente baja (${pct}%). Casi todos tus mecanismos están dormidos o en sombra.`
})

const antidoto = computed(() => {
  const key = enSombra.value?.codigo || dominante.value?.codigo || 'generico'
  return INTERVENCIONES[key] || INTERVENCIONES.generico
})

// ── Helpers ──

function getEstadoInfo(estado) {
  const mapa = {
    'saludable':  { label: 'Saludable',  icon: '✅', color: '#2ecc71' },
    'en-sombra':  { label: 'En Sombra',  icon: '⚠️', color: '#e74c3c' },
    'equilibrado':{ label: 'Equilibrado',icon: '⚖️', color: '#f39c12' },
    'dominante':  { label: 'Dominante',  icon: '🔥', color: '#C9A227' },
    'dormido':    { label: 'Dormido',    icon: '💤', color: '#95a5a6' }
  }
  return mapa[estado] || { label: estado || '—', icon: '•', color: '#bdc3c7' }
}

function getEstadoLabel(estado) { return getEstadoInfo(estado).label }
function getEstadoColor(estado) { return getEstadoInfo(estado).color }

function getIntervencionSombra(id) {
  const i = {
    P1: 'Deja de planificar. Toma una decisión hoy sin tener todas las variables. La incertidumbre no te matará.',
    P2: 'Quédate en el proyecto que te aburre 30 días más. La fricción es información, no señal de escape.',
    P3: 'Haz algo solo hoy, sin consultar a nadie. Tu juicio es válido sin validación externa.',
    P4: 'Escribe 3 acciones concretas para esta semana y ejecuta la primera hoy.',
    P5: 'Encuentra un momento de ligereza genuina hoy. El dolor no es tu única identidad.',
    P6: 'Habla de algo que te duele de verdad con alguien. Sin sarcasmo, solo vulnerabilidad.',
    P7: 'Delega una tarea hoy. El martirio no es virtud.',
    P8: 'No hagas nada impulsivo durante 48 horas. El aburrimiento es tolerable.'
  }
  return i[id] || 'Identifica tu patrón y haz una acción consciente en dirección opuesta durante 24 horas.'
}

function login(p) { p === 'google' ? authStore.loginWithGoogle() : authStore.loginWithGithub() }
function goToCheckout(plan) { router.push({ path: '/checkout', query: { plan } }) }

async function captureEmail() {
  if (!email.value) return
  emailCapturing.value = true
  emailSuccess.value = ''
  emailError.value = ''
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, perfil: resultado.value?.perfil, alertas: resultado.value?.alertas })
    })
    if (!res.ok) throw new Error()
    emailSuccess.value = 'Tu diagnóstico está guardado. Revisa tu email en las próximas 48h.'
    email.value = ''
  } catch {
    emailError.value = 'Error al enviar. Intenta de nuevo.'
  } finally {
    emailCapturing.value = false
  }
}

function handleGlow(e) {
  const glow = e.currentTarget.querySelector('.button-glow')
  if (!glow) return
  const rect = e.currentTarget.getBoundingClientRect()
  glow.style.left = (e.clientX - rect.left) + 'px'
  glow.style.top  = (e.clientY - rect.top)  + 'px'
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target) } })
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
}

// ── Intervenciones ──
const INTERVENCIONES = {
  P1: { titulo: 'El Ritual del Caos Controlado',    diagnostico: 'Tu exceso de planificación te ha convertido en una máquina de listas. Necesitas aprender a soltar sin caer en el desorden.',                         accion: 'Hoy, durante 30 minutos, haz algo que no tenga ningún objetivo productivo. Solo por el placer. Sin métricas, sin deadline. Improvisa.'              },
  P2: { titulo: 'La Ancla del Compromiso',           diagnostico: 'Tu flexibilidad radical se ha convertido en evasión crónica. Cada vez que hay fricción, cambias de piel.',                                          accion: 'Quédate en el proyecto, relación o contexto que te aburre por 30 días más. No huyas. La fricción es información, no señal de escape.'               },
  P3: { titulo: 'La Soledad Estratégica',            diagnostico: 'Tu necesidad de tribu te ha robado autonomía. No avanzas sin validación y te cargas los problemas de todos.',                                      accion: 'Haz una decisión importante hoy sin consultar a nadie. Una sola. Tu juicio es válido sin respaldo externo.'                                          },
  P4: { titulo: 'Anclaje en lo Terrenal',            diagnostico: 'Vives tanto en tu mente que olvidas el mundo material. Te refugias en el análisis para no actuar.',                                                accion: 'Escribe 3 acciones concretas para esta semana. No más teoría. Ejecuta la primera hoy, aunque no tengas certeza del resultado.'                       },
  P5: { titulo: 'Integración de la Luz',             diagnostico: 'Tu duelo se ha convertido en identidad. Te enamoras de tus cicatrices y usas el sufrimiento para no avanzar.',                                    accion: 'Sonríe genuinamente hoy. No por ironía. Encuentra un momento de ligereza real. El dolor no es tu única verdad.'                                     },
  P6: { titulo: 'La Vulnerabilidad como Fuerza',     diagnostico: 'Tu humor defensivo anestesia todo. Nada se toma en serio, incluyendo tu propio crecimiento.',                                                     accion: 'Habla de algo que te duele de verdad con alguien de confianza. Sin chiste, sin defensa. Solo vulnerabilidad. Solo 5 minutos.'                       },
  P7: { titulo: 'La Delegación Inteligente',         diagnostico: 'Tu resistencia se ha convertido en síndrome del mártir. Aguantas peso innecesario y glorificas el sacrificio.',                                   accion: 'Delega una tarea hoy. Pide ayuda genuina. Deja de cargar responsabilidades que no son tuyas. El martirio no es virtud.'                             },
  P8: { titulo: 'La Pausa Visceral',                 diagnostico: 'Tu impulso te ha metido en problemas mayores. Actúas para no sentir, quemas recursos por no tolerar la quietud.',                                 accion: 'No hagas nada impulsivo durante 48 horas. Espera. Respira. La quietud no te matará. El aburrimiento es tolerable, no letal.'                        },
  generico: { titulo: 'Intervención Personalizada', diagnostico: 'El algoritmo detecta un patrón de uso que requiere ajuste. Tu mecanismo de supervivencia necesita recalibración.',                                  accion: 'Dedica 30 minutos hoy a reflexionar sobre qué te bloquea y escribe un plan de acción concreto con 3 pasos ejecutables.'                             }
}
</script>

<style scoped>
.bg-folsom { background-color: #FFFFFF; }
.bg-bocanada { background-color: #0A0A0A; }
.bg-surface-container { background-color: #FAF8F3; }

.text-loriga { color: #0A0A0A; }
.text-halford { color: #6B6B63; }
.text-solstis { color: #C9A227; }
.text-folsom { color: #FFFFFF; }
.bg-solstis { background-color: #C9A227; }

.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1); }
.reveal.active { opacity: 1; transform: translateY(0); }

.interactive-button { position: relative; overflow: hidden; }
.button-glow { position: absolute; width: 160px; height: 160px; background: radial-gradient(circle, rgba(201,162,39,0.35) 0%, transparent 70%); border-radius: 50%; pointer-events: none; transform: translate(-50%,-50%); transition: opacity 0.3s; opacity: 0; z-index: 10; }
.interactive-button:hover .button-glow { opacity: 1; }
</style>
